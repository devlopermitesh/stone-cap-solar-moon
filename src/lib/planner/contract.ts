import type { EngineState } from "./types";

export const PLAN_VERSION = 1;

export const DEFAULT_ENGINE_PORT = 8787;

export type EngineStatus = {
  ok: boolean;
  version: number;
  app: "stone-star-planner";
  date: string;
  nextActionId: string | null;
  plans: number;
  goals: number;
  attempts: number;
  updatedAt: string;
};

export type EngineResponse<T> =
  | { ok: true; version: number; data: T }
  | { ok: false; error: string };

export function statusOf(engine: EngineState, date: string): EngineStatus {
  return {
    ok: true,
    version: engine.version,
    app: "stone-star-planner",
    date,
    nextActionId: engine.nextActions[date] ?? null,
    plans: Object.keys(engine.plans).length,
    goals: engine.goals.length,
    attempts: engine.attempts.length,
    updatedAt: engine.updatedAt,
  };
}

export function isEngineState(x: unknown): x is EngineState {
  if (!x || typeof x !== "object") return false;
  const e = x as Partial<EngineState>;
  return (
    typeof e.version === "number" &&
    Array.isArray(e.goals) &&
    typeof e.plans === "object" &&
    Array.isArray(e.attempts) &&
    typeof e.behavior === "object"
  );
}