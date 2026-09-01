/**
 * Termux engine entry — deterministic Planner Engine as a self-contained Node
 * service. Single source of state.json, implements the REST contract in
 * `contract.ts`. Bundled to `termux/planner-engine.mjs` (no npm install needed
 * on the phone).
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PLAN_VERSION, statusOf } from "./contract";
import { defaultGoals, makeAdHocGoal } from "./goals";
import { applyEvents, dateIso, emptyState, planDay, rebuildPlan } from "./engine";
import type { EngineEvent, EngineState, TaskAttempt } from "./types";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = Number(process.env.PORT ?? 8787);
const STATE_FILE = resolve(process.env.STATE_FILE ?? "state.json");

type Store = { engine: EngineState };

function loadStore(): Store {
  try {
    if (existsSync(STATE_FILE)) {
      const raw = JSON.parse(readFileSync(STATE_FILE, "utf8")) as Partial<EngineState>;
      if (raw && Array.isArray(raw.goals) && typeof raw.version === "number") {
        return { engine: raw as EngineState };
      }
    }
  } catch {
    // fall through to a fresh engine
  }
  const engine = rebuildPlan(emptyState(defaultGoals()));
  persist({ engine });
  return { engine };
}

function persist(store: Store): void {
  const tmp = `${STATE_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(store.engine, null, 2), "utf8");
  try {
    renameSync(tmp, STATE_FILE);
  } catch {
    writeFileSync(STATE_FILE, JSON.stringify(store.engine, null, 2), "utf8");
  }
}

const store = loadStore();

function fold(events: EngineEvent[]): EngineState {
  store.engine = applyEvents(store.engine, events);
  persist(store);
  return store.engine;
}

function recordAttempt(attempt: TaskAttempt): EngineState {
  const date = attempt.date ?? dateIso();
  const plan = store.engine.plans[date];
  const block = plan?.blocks.find((b) => b.id === attempt.blockId);
  const at = new Date().toISOString();
  if (block) {
    const ev: EngineEvent = {
      type: "task_completed",
      blockId: block.id,
      actualMinutes: attempt.actualMinutes,
      at,
      feedback: {
        energy: attempt.energy,
        difficulty: attempt.difficulty,
        focus: attempt.focus,
        note: attempt.note,
      },
    };
    return fold([ev]);
  }
  return store.engine;
}

function json(res: ServerResponse, body: unknown, status = 200): void {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
  });
  res.end(JSON.stringify(body));
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function parseMiniIntake(text: string): { title: string; durationMinutes: number; priority: 1 | 2 | 3; deadline?: string }[] {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n|(?:and then)/i)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: { title: string; durationMinutes: number; priority: 1 | 2 | 3; deadline?: string }[] = [];
  for (const s of sentences) {
    if (!s) continue;
    const minutes = /(\d+)\s*min(?:s)?\b/i.exec(s)?.[1];
    const hours = /(\d+(?:\.\d+)?)\s*(?:h|hr|hour)s?\b/i.exec(s)?.[1];
    const duration = minutes ? Number(minutes) : hours ? Math.max(10, Math.round(Number(hours) * 60)) : 30;
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
    if (!title) continue;
    out.push({ title, durationMinutes: Math.min(480, Math.max(10, duration)), priority, deadline });
  }
  return out;
}

function route(req: IncomingMessage, res: ServerResponse, pathname: string): void {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (req.method === "GET" && path === "/") {
    const accept = req.headers.accept ?? "";
    if (accept.includes("text/html")) {
      res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      res.end(
        [
          "Stone* Planner engine  v" + PLAN_VERSION,
          `date ${dateIso()}`,
          `goals ${store.engine.goals.length} · attempts ${store.engine.attempts.length}`,
          `GET  /api/planner/state`,
          `POST /api/planner/replan`,
          `POST /api/planner/feedback`,
          `POST /api/planner/intake`,
        ].join("\n"),
      );
      return;
    }
    json(res, { ok: true, status: statusOf(store.engine, dateIso()) });
    return;
  }

  if (req.method === "GET" && path === "/api/planner/state") {
    json(res, { ok: true, version: PLAN_VERSION, data: store.engine });
    return;
  }

  if (req.method === "POST" && path === "/api/planner/replan") {
    void readBody(req).then((body) => {
      const events = (body as { events?: EngineEvent[] }).events ?? [];
      json(res, { ok: true, version: PLAN_VERSION, data: fold(events) });
    });
    return;
  }

  if (req.method === "POST" && path === "/api/planner/feedback") {
    void readBody(req).then((body) => {
      const attempt = (body as { attempt?: TaskAttempt }).attempt;
      if (!attempt || !attempt.blockId) {
        json(res, { ok: false, error: "No attempt payload." }, 400);
        return;
      }
      json(res, { ok: true, version: PLAN_VERSION, data: recordAttempt(attempt) });
    });
    return;
  }

  if (req.method === "POST" && path === "/api/planner/intake") {
    void readBody(req).then((body) => {
      const text = String((body as { text?: string }).text ?? "");
      const parsed = parseMiniIntake(text);
      if (!parsed.length) {
        json(
          res,
          { ok: false, error: "Could not parse tasks. Try: 'review notes 40min P1 by 2026-09-05'." },
          400,
        );
        return;
      }
      const now = new Date();
      const events: EngineEvent[] = parsed.map((t) => ({
        type: "urgent_add",
        goal: makeAdHocGoal(t, now),
        at: now.toISOString(),
      }));
      json(res, { ok: true, version: PLAN_VERSION, data: fold(events), added: parsed });
    });
    return;
  }

  json(res, { ok: false, error: `No route for ${path}` }, 404);
}

const server = createServer((req, res) => {
  try {
    route(req, res, req.url?.split("?")[0] ?? "/");
  } catch (e) {
    json(res, { ok: false, error: e instanceof Error ? e.message : "internal error" }, 500);
  }
});

server.listen(PORT, HOST, () => {
  const state = store.engine;
  const today = dateIso();
  const day = state.plans[today] ?? planDay({ date: today, goals: state.goals, behavior: state.behavior });
  console.log("\n  Stone* Planner engine  (v" + PLAN_VERSION + ")");
  console.log("  -----------------------------");
  console.log("  listening  http://" + HOST + ":" + PORT);
  console.log("  state file " + STATE_FILE);
  console.log("  goals: " + state.goals.length + " · plans: " + Object.keys(state.plans).length + " · attempts: " + state.attempts.length);
  console.log("  today: " + day.blocks.length + " blocks · next: " + (state.nextActions[today] ?? "—"));
  console.log("  -----------------------------");
  console.log("  GET  /api/planner/state      current EngineState");
  console.log("  POST /api/planner/replan     { events: [...] }");
  console.log("  POST /api/planner/feedback   { attempt: {...} }");
  console.log("  POST /api/planner/intake     { text: 'review notes 40min P1' }");
  console.log("  press Ctrl+C to stop\n");
});