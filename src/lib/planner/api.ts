import { createServerFn } from "@tanstack/react-start";
import { makeAdHocGoal } from "./goals";
import { applyEvents, dateIso, emptyState, nextAction, rebuildPlan } from "./engine";
import { explainWhyNow, intakeTasks } from "./llm";
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