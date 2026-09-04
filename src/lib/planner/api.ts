import { createServerFn } from "@tanstack/react-start";
import { makeAdHocGoal } from "./goals";
import { applyEvents, dateIso, emptyState, nextAction, rebuildPlan } from "./engine";
import { explainWhyNow, intakeTasks, orchestrate, planSnapshot } from "./llm";
import { executeTool, type ToolProposal } from "./tools";
import type { EngineEvent, EngineState } from "./types";

export type FoldInput = { engine: EngineState | null; events: EngineEvent[]; date?: string };

export const plannerDefaults = createServerFn({ method: "GET" }).handler(async () => {
  const engine = dateIso() === dateIso() ? rebuildPlan(emptyState()) : emptyState();
  return engine;
});

export const foldEvents = createServerFn({ method: "POST" })
  .validator((d: FoldInput) => d)
  .handler(async ({ data }) => {
    const base = data.engine && data.engine.version > 0 ? data.engine : emptyState();
    return applyEvents(base, data.events);
  });

export type AiIntakeInput = { engine: EngineState | null; text: string };

export const aiIntake = createServerFn({ method: "POST" })
  .validator((d: AiIntakeInput) => d)
  .handler(async ({ data }) => {
    const base = data.engine && data.engine.version > 0 ? data.engine : emptyState();
    const tasks = await intakeTasks(data.text);
    if (!tasks || tasks.length === 0) {
      return { ok: false as const, engine: base, added: [] };
    }
    const now = new Date();
    const events: EngineEvent[] = tasks.map((t) => ({
      type: "urgent_add",
      goal: makeAdHocGoal(
        {
          title: t.title,
          durationMinutes: t.durationMinutes,
          priority: t.priority,
          deadline: t.deadline,
          project: t.project,
        },
        now,
      ),
      at: now.toISOString(),
    }));
    const engine = applyEvents(base, events);
    return { ok: true as const, engine, added: tasks };
  });

export type OrchestrateInput = { engine: EngineState | null; text: string };

/**
 * Gemini = PRINCIPAL. Turns natural language into whitelisted tool-call
 * proposals; the engine validates and executes them. Always returns a valid
 * engine — if the cloud call fails or proposes nothing actionable, the input
 * engine is returned unchanged so the deterministic fast path is never blocked.
 */
export const orchestrateIntake = createServerFn({ method: "POST" })
  .validator((d: OrchestrateInput) => d)
  .handler(async ({ data }) => {
    const base = data.engine && data.engine.version > 0 ? data.engine : emptyState();
    const snapshot = planSnapshot(base.goals);
    const proposals = await orchestrate(data.text, snapshot);
    if (!proposals || proposals.length === 0) {
      return { ok: false as const, engine: base, count: 0 };
    }
    const applied = applyProposals(base, proposals);
    return { ok: true as const, engine: applied, count: proposals.length };
  });

function applyProposals(engine: EngineState, proposals: ToolProposal[]): EngineState {
  const now = new Date();
  let next = engine;
  for (const p of proposals) {
    const result = executeTool(p, now);
    if (result.ok && result.events.length) next = applyEvents(next, result.events);
  }
  return next;
}

export type ExplainInput = { engine: EngineState | null };

export const explainNext = createServerFn({ method: "POST" })
  .validator((d: ExplainInput) => d)
  .handler(async ({ data }) => {
    const base = data.engine && data.engine.version > 0 ? data.engine : emptyState();
    const plan = base.plans[dateIso()] ?? base.plans[Object.keys(base.plans).at(-1) ?? ""];
    const block = plan ? nextAction(plan, `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`) : null;
    if (!block) return { text: null as string | null };
    const text = await explainWhyNow(block, plan.date);
    return { text };
  });