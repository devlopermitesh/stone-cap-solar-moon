import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { aiIntake, explainNext, foldEvents, plannerDefaults } from "./api";
import { dateIso } from "./engine";
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
  init: () => Promise<void>;
  dispatch: (events: EngineEvent[]) => Promise<void>;
  intake: (text: string) => Promise<{ ok: boolean; count: number }>;
  refreshWhy: () => Promise<void>;
  open: (screen: PlannerScreen) => void;
  setScreen: (screen: PlannerScreen) => void;
  selectBlock: (id: string | null) => void;
  setDate: (iso: string) => void;
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

      init: async () => {
        try {
          if (!get().engine) {
            const engine = await plannerDefaults();
            set({ engine });
          }
          const engine = await foldEvents({ data: { engine: get().engine, events: [{ type: "replan", at: new Date().toISOString() }] } });
          set({ engine, ready: true });
        } catch {
          set({ ready: true, snack: "Planner engine unreachable — showing cached schedule." });
        }
      },

      dispatch: async (events) => {
        if (!events.length) return;
        set({ busy: true });
        try {
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
        try {
          const res = await aiIntake({ data: { engine: get().engine, text } });
          if (res.ok) set({ engine: res.engine });
          set({ busy: false });
          return { ok: res.ok, count: res.added.length };
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
      }),
    },
  ),
);

export function todayDsv(date: string): string {
  return date;
}