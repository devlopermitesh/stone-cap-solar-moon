/**
 * Remote engine client — lets the Stone* web app talk to the authoritative
 * Termux Planner Service over REST. Works when the phone engine is reachable
 * (same Wi-Fi in dev, or via a tunnel in prod). When unreachable, callers fall
 * back to the local deterministic engine.
 *
 * Endpoints (mirror termux/planner-engine.mjs):
 *   GET  {base}/api/today                 today's plan
 *   GET  {base}/api/week                  next 7 days
 *   GET  {base}/api/planner/state         full EngineState
 *   POST {base}/api/events                push EngineEvents  { events: [...] }
 *   POST {base}/api/tasks                 add tasks           { text: "..." }
 *   POST {base}/api/feedback              record attempt      { attempt: {...} }
 */
import type { EngineState, TaskAttempt } from "./types";

export const REMOTE_URL_KEY = "stone-planner:remote-url";

export function savedRemoteUrl(): string {
  try {
    return localStorage.getItem(REMOTE_URL_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveRemoteUrl(url: string): void {
  try {
    const clean = url.trim().replace(/\/+$/, "");
    if (clean) localStorage.setItem(REMOTE_URL_KEY, clean);
    else localStorage.removeItem(REMOTE_URL_KEY);
  } catch {
    /* ignore */
  }
}

async function request<T>(base: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: init?.method ?? "GET",
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    body: init?.body,
    signal: init?.signal ?? AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`engine ${res.status} on ${path}`);
  return (await res.json()) as T;
}

export interface EngineResult<T = unknown> {
  ok: boolean;
  version: number;
  data: T;
}

export async function pingEngine(base: string): Promise<boolean> {
  try {
    await fetch(`${base}/api/planner/state`, { signal: AbortSignal.timeout(4000) });
    return true;
  } catch {
    return false;
  }
}

export async function fetchTodayPlan(base: string): Promise<{ date: string; plan: unknown; now: string }> {
  const r = await request<EngineResult<{ date: string; plan: unknown; now: string }>>(base, "/api/today");
  return r.data;
}

export async function fetchWeek(base: string): Promise<Record<string, unknown>> {
  const r = await request<EngineResult<Record<string, unknown>>>(base, "/api/week");
  return r.data ?? {};
}

export async function fetchEngineState(base: string): Promise<EngineState> {
  const r = await request<EngineResult<EngineState>>(base, "/api/planner/state");
  return r.data;
}

export async function addTasks(base: string, text: string): Promise<{ engine: EngineState; added: unknown[] }> {
  const r = await request<EngineResult<{ engine: EngineState; added: unknown[] }>>(base, "/api/tasks", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return r.data;
}

export async function recordFeedback(base: string, attempt: TaskAttempt): Promise<EngineState> {
  const r = await request<EngineResult<EngineState>>(base, "/api/feedback", {
    method: "POST",
    body: JSON.stringify({ attempt }),
  });
  return r.data;
}
