/**
 * Termux engine entry — deterministic Planner Engine as a self-contained Node
 * service. Single source of truth, backed by SQLite (Node built-in `node:sqlite`,
 * with a state.json fallback for older Node). Bundled to `termux/planner-engine.mjs`
 * (no npm install needed on the phone).
 *
 * Architecture (per Smart Day Planner spec):
 *   Stone* web app  ──REST──▶  Termux Planner Service  ──▶  Planner Engine (authoritative)
 *                                                              │
 *                                                              ▼
 *                                                           SQLite (memory)
 *
 * The LLM never controls the schedule — the deterministic engine decides.
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PLAN_VERSION, statusOf } from "./contract";
import { defaultGoals, makeAdHocGoal } from "./goals";
import { applyEvents, dateIso, emptyState, nowTime, planDay, rebuildPlan } from "./engine";
import type { EngineEvent, EngineState, TaskAttempt } from "./types";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = Number(process.env.PORT ?? 8787);
const STATE_FILE = resolve(process.env.STATE_FILE ?? "state.json");
const DB_FILE = resolve(process.env.DB_FILE ?? "planner.db");

/* ------------------------------- SQLite memory ------------------------------ */

type Statement = {
  run(...params: unknown[]): unknown;
  get(...params: unknown[]): Record<string, unknown> | undefined;
};
type DbHandle = {
  exec(sql: string): void;
  prepare(sql: string): Statement;
  close(): void;
};

let sqliteAvailable = true;

function dbRun(dbHandle: DbHandle | null, sql: string, ...params: unknown[]): void {
  if (dbHandle) {
    try {
      dbHandle.prepare(sql).run(...params);
    } catch {
      /* ignore */
    }
  }
}

function dbGetRow(dbHandle: DbHandle | null, sql: string): Record<string, unknown> | undefined {
  if (!dbHandle) return undefined;
  try {
    return dbHandle.prepare(sql).get();
  } catch {
    return undefined;
  }
}

// node:sqlite (`DatabaseSync`) — Node 22.5+ built-in, pure-JS, no compile.
// The connection exposes exec()/prepare(); statements expose run()/get().
let DatabaseSync: new (path: string) => unknown;
try {
  const mod = await import("node:sqlite");
  DatabaseSync = mod.DatabaseSync as unknown as new (path: string) => unknown;
} catch {
  sqliteAvailable = false;
}

function openDb(): DbHandle | null {
  if (!DatabaseSync) {
    console.error("[planner] node:sqlite unavailable — using state.json.");
    sqliteAvailable = false;
    return null;
  }
  try {
    const handle = new DatabaseSync(DB_FILE) as unknown as {
      exec(sql: string): void;
      prepare(sql: string): Statement;
      close(): void;
    };
    handle.exec("CREATE TABLE IF NOT EXISTS app_meta(key TEXT PRIMARY KEY, value TEXT)");
    handle.exec("CREATE TABLE IF NOT EXISTS engine_state(id INTEGER PRIMARY KEY CHECK(id=1), json TEXT)");
    handle.exec("CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT, payload TEXT)");
    handle.exec(
      "CREATE TABLE IF NOT EXISTS task_attempts(id INTEGER PRIMARY KEY AUTOINCREMENT, block_id TEXT, date TEXT, payload TEXT)",
    );
    return handle as unknown as DbHandle;
  } catch (e) {
    sqliteAvailable = false;
    console.error("[planner] SQLite unavailable, falling back to state.json:", e instanceof Error ? e.message : e);
    return null;
  }
}

/* ------------------------------ persistence -------------------------------- */
type Store = { engine: EngineState; db: DbHandle | null };

function dbLoadEngine(dbHandle: DbHandle | null): EngineState | null {
  const row = dbGetRow(dbHandle, "SELECT json FROM engine_state WHERE id = 1");
  if (!row) return null;
  try {
    const raw = row.json ? JSON.parse(String(row.json)) : null;
    if (raw && Array.isArray(raw.goals) && typeof raw.version === "number") return raw as EngineState;
  } catch {
    /* ignore */
  }
  return null;
}

function dbSaveEngine(dbHandle: DbHandle | null, engine: EngineState): void {
  dbRun(
    dbHandle,
    "INSERT INTO engine_state(id, json) VALUES(1, ?) ON CONFLICT(id) DO UPDATE SET json = excluded.json",
    JSON.stringify(engine),
  );
}

function loadStore(): Store {
  const dbHandle = openDb();
  let engine = dbLoadEngine(dbHandle);

  if (!engine) {
    try {
      if (existsSync(STATE_FILE)) {
        const raw = JSON.parse(readFileSync(STATE_FILE, "utf8")) as Partial<EngineState>;
        if (raw && Array.isArray(raw.goals) && typeof raw.version === "number") {
          engine = raw as EngineState;
        }
      }
    } catch {
      engine = null;
    }
  }

  if (!engine) {
    engine = rebuildPlan(emptyState(defaultGoals()));
  }

  // On startup: recover from missed events (spec §6 — adapt to actual life).
  const recovered = recoverMissed(engine);

  persist({ engine: recovered, db: dbHandle });
  return { engine: recovered, db: dbHandle };
}

function persist(store: Store): void {
  dbSaveEngine(store.db, store.engine);
  // Keep state.json as a portable mirror/fallback too.
  const tmp = `${STATE_FILE}.tmp`;
  try {
    writeFileSync(tmp, JSON.stringify(store.engine, null, 2), "utf8");
    renameSync(tmp, STATE_FILE);
  } catch {
    /* second-order fallback only */
  }
}

const store = loadStore();

/* ----------------------- missed-event recovery (§6) ------------------------ */
// On startup/service-hit, any block scheduled earlier today that has already
// ended without being started/done is marked "carried" — the spec's "adapt to
// actual life" behaviour. A replan folds carried work back into the day.
function recoverMissed(engine: EngineState): EngineState {
  const today = dateIso();
  const plan = engine.plans[today];
  if (!plan || plan.blocks.length === 0) return engine;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let changed = false;
  const blocks = plan.blocks.map((b) => {
    if (b.status === "planned" || b.status === "active") {
      const [h, m] = (b.end ?? "23:59").split(":").map(Number);
      if (h * 60 + m < nowMin) {
        changed = true;
        return { ...b, status: "carried" as const, why: `${b.why ?? ""} · missed, recover on replan`.trim() };
      }
    }
    return b;
  });
  if (!changed) return engine;
  return { ...engine, plans: { ...engine.plans, [today]: { ...plan, blocks } } };
}

/* --------------------------------- engine ops ------------------------------ */

function fold(events: EngineEvent[]): EngineState {
  store.engine = applyEvents(store.engine, events);
  persist(store);
  return store.engine;
}

const eventLog: Record<string, unknown>[] = [];
function logEvent(payload: EngineEvent | Record<string, unknown>): void {
  const at = new Date().toISOString();
  dbRun(store.db, "INSERT INTO events(at, payload) VALUES(?, ?)", at, JSON.stringify(payload));
  eventLog.push({ at, payload });
}

function recordAttempt(attempt: TaskAttempt): EngineState {
  const date = attempt.date ?? dateIso();
  const plan = store.engine.plans[date];
  const block = plan?.blocks.find((b) => b.id === attempt.blockId);
  const at = new Date().toISOString();
  let result = store.engine;
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
    result = fold([ev]);
    dbRun(
      store.db,
      "INSERT OR REPLACE INTO task_attempts(block_id, date, payload) VALUES(?, ?, ?)",
      block.id,
      date,
      JSON.stringify({ ...attempt, actualMinutes: attempt.actualMinutes }),
    );
  }
  return result;
}

/* ------------------------------- HTTP helpers ------------------------------ */

function json(res: ServerResponse, body: unknown, status = 200): void {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS",
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

function ok(body: unknown): Record<string, unknown> {
  return { ok: true, version: PLAN_VERSION, data: body };
}

/* ---------------------------------- routing -------------------------------- */

function route(req: IncomingMessage, res: ServerResponse, pathname: string): void {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (req.method === "OPTIONS") {
    json(res, { ok: true });
    return;
  }

  if (req.method === "GET" && path === "/") {
    const accept = req.headers.accept ?? "";
    if (accept.includes("text/html")) {
      res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      res.end(
        [
          "Stone* Planner engine  v" + PLAN_VERSION,
          `date ${dateIso()} · now ${nowTime()}`,
          `goals ${store.engine.goals.length} · plans ${Object.keys(store.engine.plans).length} · attempts ${store.engine.attempts.length}`,
          `db ${sqliteAvailable ? "sqlite" : "json"}`,
          "",
          "  Say: POST /api/tasks         { text: 'review notes 40min P1' }",
          "       POST /api/content-replan { events: [...] }",
          "       POST /api/content-feedback { attempt: {...} }",
          "  View: GET  /api/today        today's plan",
          "        GET  /api/week         next 7 days",
          "        GET  /api/events       event log",
        ].join("\n"),
      );
      return;
    }
    json(res, ok({ status: statusOf(store.engine, dateIso()) }));
    return;
  }

  // ---- state / plan ----
  if (req.method === "GET" && path === "/api/planner/state") {
    json(res, ok(store.engine));
    return;
  }
  if (req.method === "GET" && path === "/api/today") {
    const today = dateIso();
    const plan = store.engine.plans[today] ?? planDay({ date: today, goals: store.engine.goals, behavior: store.engine.behavior });
    json(res, ok({ date: today, plan, now: nowTime() }));
    return;
  }
  if (req.method === "GET" && path === "/api/week") {
    const week: Record<string, unknown> = {};
    for (let i = 0; i < 7; i++) {
      const iso = dateIso(i);
      const plan = store.engine.plans[iso];
      week[iso] = {
        date: iso,
        blocks: plan?.blocks ?? [],
        totalMinutes: plan?.blocks.reduce((s, b) => s + b.minutes, 0) ?? 0,
        open: plan?.blocks.filter((b) => b.status !== "done" && b.status !== "skipped").length ?? 0,
      };
    }
    json(res, ok(week));
    return;
  }

  // ---- task intake (natural language) ----
  if (req.method === "POST" && (path === "/api/tasks" || path === "/api/planner/intake")) {
    void readBody(req).then((body) => {
      const text = String((body as { text?: string }).text ?? "");
      const parsed = parseMiniIntake(text);
      if (!parsed.length) {
        json(res, { ok: false, error: "Could not parse tasks. Try: 'review notes 40min P1 by 2026-09-05'." }, 400);
        return;
      }
      const now = new Date();
      const events: EngineEvent[] = parsed.map((t) => ({
        type: "urgent_add",
        goal: makeAdHocGoal(t, now),
        at: now.toISOString(),
      }));
      const engine = fold(events);
      for (const t of parsed) logEvent({ kind: "task_add", task: t });
      json(res, ok({ engine, added: parsed }));
    });
    return;
  }

  // ---- event stream (web app pusher) ----
  if (req.method === "POST" && (path === "/api/events" || path === "/api/planner/replan")) {
    void readBody(req).then((body) => {
      const events = (body as { events?: EngineEvent[] }).events ?? [];
      for (const e of events) logEvent(e);
      json(res, ok(fold(events)));
    });
    return;
  }

  // ---- feedback ----
  if (req.method === "POST" && (path === "/api/feedback" || path === "/api/planner/feedback")) {
    void readBody(req).then((body) => {
      const attempt = (body as { attempt?: TaskAttempt }).attempt;
      if (!attempt || !attempt.blockId) {
        json(res, { ok: false, error: "No attempt payload." }, 400);
        return;
      }
      const engine = recordAttempt(attempt);
      logEvent({ kind: "feedback", blockId: attempt.blockId, energy: attempt.energy });
      json(res, ok(engine));
    });
    return;
  }

  // ---- event log ----
  if (req.method === "GET" && path === "/api/events") {
    json(res, ok({ recent: eventLog.slice(-50).reverse(), db: sqliteAvailable }));
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
  console.log("  memory     " + (sqliteAvailable ? DB_FILE + " (SQLite)" : "state.json"));
  console.log("  goals: " + state.goals.length + " · plans: " + Object.keys(state.plans).length + " · attempts: " + state.attempts.length);
  console.log("  today: " + day.blocks.length + " blocks · next: " + (state.nextActions[today] ?? "—"));
  console.log("  -----------------------------");
  console.log("  POST /api/tasks         add tasks from a sentence");
  console.log("  POST /api/events        push EngineEvents (replan, start, complete…)");
  console.log("  POST /api/feedback      record a task attempt");
  console.log("  GET  /api/today         today's plan");
  console.log("  GET  /api/week          next 7 days");
  console.log("  GET  /api/planner/state full EngineState");
  console.log("  press Ctrl+C to stop\n");
});
