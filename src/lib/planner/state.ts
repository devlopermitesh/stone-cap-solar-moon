import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { aiIntake, explainNext, foldEvents, orchestrateIntake, plannerDefaults } from "./api";
import { applyEvents, dateIso } from "./engine";
import { makeAdHocGoal } from "./goals";
import {
  savedRemoteUrl,
  saveRemoteUrl,
  pingEngine,
  fetchEngineState,
  addTasks,
} from "./remote";
import type { EngineEvent, EngineState, TaskBlock } from "./types";

export type PlannerScreen = "home" | "day" | "calendar" | "goals" | "feedback";

type PlannerState = {
  engine: EngineState | null;
  ready: boolean;
  busy: boolean;
  snack: string | null;
  aiWhy: string | null;
  screen: PlannerScreen;
  selectedBlockId: string | null;
  selectedDate: string;
  remoteUrl: string;
  remote: boolean;
  init: () => Promise<void>;
  dispatch: (events: EngineEvent[]) => Promise<void>;
  intake: (text: string) => Promise<{ ok: boolean; count: number }>;
  refreshWhy: () => Promise<void>;
  open: (screen: PlannerScreen) => void;
  setScreen: (screen: PlannerScreen) => void;
  selectBlock: (id: string | null) => void;
  setDate: (iso: string) => void;
  setRemote: (url: string) => Promise<boolean>;
  clearSnack: () => void;
  todayPlan: () => { date: string; blocks: TaskBlock[]; version: number } | undefined;
  nextBlock: () => TaskBlock | null;
};

export const usePlanner = create<PlannerState>()(
  persist(
    (set, get) => ({
      engine: null,
      ready: false,
      busy: false,
      snack: null,
      aiWhy: null,
      screen: "home",
      selectedBlockId: null,
      selectedDate: dateIso(),
      remoteUrl: savedRemoteUrl(),
      remote: false,

      init: async () => {
        const remoteUrl = get().remoteUrl;
        if (remoteUrl) {
          try {
            const ok = await pingEngine(remoteUrl);
            if (ok) {
              const engine = await fetchEngineState(remoteUrl);
              set({ engine, remote: true, ready: true });
              return;
            }
          } catch {
            /* fall through to local */
          }
        }
        try {
          if (!get().engine) {
            const engine = await plannerDefaults();
            set({ engine });
          }
          const engine = await foldEvents({ data: { engine: get().engine, events: [{ type: "replan", at: new Date().toISOString() }] } });
          set({ engine, remote: false, ready: true });
        } catch {
          set({ ready: true, remote: false, snack: "Planner engine unreachable — showing cached schedule." });
        }
      },

      setRemote: async (url) => {
        const clean = url.trim();
        saveRemoteUrl(clean);
        set({ remoteUrl: clean });
        if (!clean) {
          set({ remote: false });
          return true;
        }
        try {
          const ok = await pingEngine(clean);
          if (!ok) {
            set({ snack: "Engine not reachable at that URL." });
            return false;
          }
          const engine = await fetchEngineState(clean);
          set({ engine, remote: true, ready: true });
          return true;
        } catch {
          set({ snack: "Engine not reachable at that URL." });
          return false;
        }
      },

      dispatch: async (events) => {
        if (!events.length) return;
        set({ busy: true });
        try {
          const remoteUrl = get().remoteUrl;
          if (remoteUrl) {
            const res = await fetch(`${remoteUrl}/api/events`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ events }),
            });
            if (res.ok) {
              const json = (await res.json()) as { data?: EngineState };
              if (json.data) set({ engine: json.data });
              set({ busy: false });
              return;
            }
          }
          const engine = await foldEvents({ data: { engine: get().engine, events } });
          set({ engine, busy: false });
        } catch (e) {
          set({ busy: false, snack: "Could not update the plan from this device." });
          console.error(e);
        }
      },

      intake: async (text) => {
        if (!text.trim()) return { ok: false, count: 0 };
        set({ busy: true });
        const remoteUrl = get().remoteUrl;
        try {
          if (remoteUrl) {
            const res = await addTasks(remoteUrl, text);
            set({ engine: res.engine, busy: false });
            return { ok: true, count: res.added.length };
          }
          // Fast path: deterministic parse + add immediately (instant, offline-safe).
          const fast = fastIntake(text);
          if (fast.length) {
            const base = get().engine;
            if (!base) {
              set({ busy: false, snack: "Planner not ready yet — try again in a second." });
              return { ok: false, count: 0 };
            }
            const applied = applyUrgent(base, fast);
            set({ engine: applied, busy: false });
            // Background refinement: Gemini as PRINCIPAL re-interprets the same
            // sentence as tool calls and applies any better/extra actions.
            void orchestrateIntake({ data: { engine: applied, text } })
              .then((raw) => {
                const refined = raw as { ok: boolean; engine: EngineState; count: number };
                if (refined?.ok) set({ engine: refined.engine, snack: "Gemini refined your add." });
              })
              .catch(() => undefined);
            return { ok: true, count: fast.length };
          }
          // No fast-parseable task: fall back to the AI intake (needs a key).
          const ai = await aiIntake({ data: { engine: get().engine, text } });
          if (ai.ok) set({ engine: ai.engine });
          set({ busy: false });
          return { ok: ai.ok, count: ai.added.length };
        } catch {
          set({ busy: false, snack: "AI intake failed — add the task in Goals instead." });
          return { ok: false, count: 0 };
        }
      },

      refreshWhy: async () => {
        try {
          const res = await explainNext({ data: { engine: get().engine } });
          set({ aiWhy: res.text });
        } catch {
          set({ aiWhy: null });
        }
      },

      open: (screen) => {
        set({ screen, selectedBlockId: null });
        if (screen === "home") {
          void get().refreshWhy();
        }
      },
      setScreen: (screen) => set({ screen }),
      selectBlock: (id) => set({ selectedBlockId: id }),
      setDate: (iso) => set({ selectedDate: iso }),
      clearSnack: () => set({ snack: null }),

      todayPlan: () => {
        const engine = get().engine;
        if (!engine) return undefined;
        return engine.plans[get().selectedDate] ?? engine.plans[dateIso()];
      },

      nextBlock: () => {
        const engine = get().engine;
        if (!engine) return null;
        const plan = engine.plans[get().selectedDate] ?? engine.plans[dateIso()];
        if (!plan) return null;
        const id = engine.nextActions[plan.date];
        return plan.blocks.find((b) => b.id === id) ?? null;
      },
    }),
    {
      name: "stone-planner:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        engine: s.engine,
        selectedDate: s.selectedDate,
        remoteUrl: s.remoteUrl,
      }),
    },
  ),
);

export function todayDsv(date: string): string {
  return date;
}

/* --------------------------- fast deterministic intake --------------------- */

type ParsedFast = { title: string; durationMinutes: number; priority: 1 | 2 | 3; deadline?: string };

function fastIntake(text: string): ParsedFast[] {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n|(?:and then)/i)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: ParsedFast[] = [];
  for (const s of sentences) {
    if (!s) continue;
    const minutes = /(\d+)\s*min(?:s)?\b/i.exec(s)?.[1];
    const hours = /(\d+(?:\.\d+)?)\s*(?:h|hr|hour)s?\b/i.exec(s)?.[1];
    const duration = minutes
      ? Number(minutes)
      : hours
        ? Math.max(10, Math.round(Number(hours) * 60))
        : 30;
    const prioRaw = /\bP([1-3])\b/i.exec(s)?.[1];
    const priority = (prioRaw ? Number(prioRaw) : 2) as 1 | 2 | 3;
    const deadline = /(?:by|before|due)\s+(\d{4}-\d{2}-\d{2})/i.exec(s)?.[1];
    const title = s
      .replace(/\(?(\d+)\s*min(?:s)?\b\)?/gi, "")
      .replace(/\(?(\d+(?:\.\d+)?)\s*(?:h|hr|hours?)\b\)?/gi, "")
      .replace(/\bP([1-3])\b/gi, "")
      .replace(/(?:by|before|due)\s+\d{4}-\d{2}-\d{2}/gi, "")
      .replace(/\s+/g, " ")
      .replace(/^[,.;:\s]+|[,.;:\s]+$/g, "")
      .trim();
    if (!title || title.length < 2) continue;
    out.push({ title, durationMinutes: Math.min(480, Math.max(10, duration)), priority, deadline });
  }
  return out;
}

function applyUrgent(engine: EngineState, tasks: ParsedFast[]): EngineState {
  if (!engine) return engine;
  const now = new Date();
  const events: EngineEvent[] = tasks.map((t) => ({
    type: "urgent_add" as const,
    goal: makeAdHocGoal(
      { title: t.title, durationMinutes: t.durationMinutes, priority: t.priority, deadline: t.deadline },
      now,
    ),
    at: now.toISOString(),
  }));
  return applyEvents(engine, events);
}
