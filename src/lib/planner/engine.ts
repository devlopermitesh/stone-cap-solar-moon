import {
  activeGoals,
  defaultGoals,
  setGoalActive,
  setWeeklyTarget,
  upsertGoal,
} from "./goals";
import { computeBehavior, suggestDuration, suggestSlot } from "./behavior";
import { PLAN_VERSION } from "./contract";
import type {
  BehaviorMap,
  EngineEvent,
  EngineState,
  Goal,
  PlanDay,
  TaskBlock,
  TaskBlockStatus,
} from "./types";

/* ---------------------------------- time ---------------------------------- */

export function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}

export function toTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function minutesBetween(a: string, b: string): number {
  return toMin(b) - toMin(a);
}

/* ------------------------------- availability ------------------------------ */

export type Constraint = { start: string; end: string; label: string };

export type Availability = {
  dayStart: string;
  dayEnd: string;
  blocked: Constraint[];
};

export const DEFAULT_AVAILABILITY: Availability = {
  dayStart: "07:00",
  dayEnd: "21:00",
  blocked: [
    { start: "10:00", end: "14:30", label: "College" },
  ],
};

export type FreeWindow = { start: string; end: string };

export function freeWindows(availability: Availability = DEFAULT_AVAILABILITY): FreeWindow[] {
  const dayStart = toMin(availability.dayStart);
  const dayEnd = toMin(availability.dayEnd);
  const blocked = [...availability.blocked]
    .map((c) => ({ start: Math.max(dayStart, toMin(c.start)), end: Math.min(dayEnd, toMin(c.end)) }))
    .filter((c) => c.end > c.start)
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const c of blocked) {
    const last = merged[merged.length - 1];
    if (last && c.start <= last.end) last.end = Math.max(last.end, c.end);
    else merged.push({ ...c });
  }

  const windows: FreeWindow[] = [];
  let cursor = dayStart;
  for (const m of merged) {
    if (m.start > cursor) windows.push({ start: toTime(cursor), end: toTime(m.start) });
    cursor = Math.max(cursor, m.end);
  }
  if (cursor < dayEnd) windows.push({ start: toTime(cursor), end: toTime(dayEnd) });
  return windows;
}

export function totalAvailableMinutes(availability: Availability = DEFAULT_AVAILABILITY): number {
  return freeWindows(availability).reduce((s, w) => s + minutesBetween(w.start, w.end), 0);
}

export function constraintGate(
  block: { start: string; end: string; minutes: number },
  availability: Availability = DEFAULT_AVAILABILITY,
): boolean {
  if (block.minutes <= 0) return false;
  const s = toMin(block.start);
  const e = toMin(block.end);
  if (e - s !== block.minutes) return false;
  if (s < toMin(availability.dayStart) || e > toMin(availability.dayEnd)) return false;
  for (const c of availability.blocked) {
    if (s < toMin(c.end) && e > toMin(c.start)) return false;
  }
  return true;
}

export function dateIso(offset = 0): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ------------------------------- block helpers ----------------------------- */

export function makeBlock(goal: Goal, start: string, minutes: number, status: TaskBlockStatus, why: string): TaskBlock {
  return {
    id: `${goal.id}:${start.replace(":", "")}:${Date.now().toString(36)}`,
    goalId: goal.id,
    title: goal.title,
    start,
    end: toTime(toMin(start) + minutes),
    minutes,
    status,
    priority: goal.priority,
    why,
    attemptIds: [],
  };
}

export function blockById(plan: PlanDay | undefined, blockId: string): TaskBlock | undefined {
  return plan?.blocks.find((b) => b.id === blockId);
}

/* -------------------------------- scheduling ------------------------------- */

function sortForScheduling(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.deadline && b.deadline && a.deadline !== b.deadline) {
      return a.deadline.localeCompare(b.deadline);
    }
    return b.defaultDuration - a.defaultDuration;
  });
}

export function scheduleGoal(
  goal: Goal,
  windows: FreeWindow[],
  behavior: BehaviorMap,
  current: TaskBlock[],
): TaskBlock | null {
  const duration = Math.min(suggestDuration(goal, behavior), 180);
  if (duration <= 0) return null;
  for (const w of windows) {
    const wStart = toMin(w.start);
    const wEnd = toMin(w.end);
    const used = current
      .filter((b) => toMin(b.start) >= wStart && toMin(b.end) <= wEnd)
      .reduce((s, b) => s + b.minutes, 0);
    if (used + duration <= wEnd - wStart) {
      const start = toTime(wStart + used);
      return makeBlock(
        goal,
        start,
        duration,
        "planned",
        engineWhy(goal, behavior),
      );
    }
  }
  // Try as a smaller chunk (scope reduction) when the day is tight.
  const half = Math.floor(duration / 2);
  if (half >= 15) {
    for (const w of windows) {
      const wStart = toMin(w.start);
      const leftover = toMin(w.end) - wStart;
      if (leftover >= half + 5) {
        const start = toTime(wStart + leftover - half);
        return makeBlock(goal, start, half, "planned", "Split into a focused mini-session (scope reduced).");
      }
    }
  }
  return null;
}

export function engineWhy(goal: Goal, behavior: BehaviorMap): string {
  const parts = [`P${goal.priority}`];
  const slot = suggestSlot(goal, behavior);
  if (slot) parts.push(`best time ~${slot}`); 
  if (goal.deadline) parts.push(`deadline ${goal.deadline}`);
  const wt = goal.weeklyTarget;
  if (wt) parts.push(`${wt.sessions}x/wk`);
  return parts.length ? parts.join(" · ") : "Priority order";
}

export type PlanInput = {
  date: string;
  goals: Goal[];
  behavior: BehaviorMap;
  previous?: PlanDay | null;
  availability?: Availability;
  now?: string;
};

export function planDay(input: PlanInput): PlanDay {
  const windows = freeWindows(input.availability);
  const prev = input.previous;
  const blocks: TaskBlock[] = [];

  // 1) Carry unfinished work from the previous day.
  if (prev) {
    for (const b of prev.blocks) {
      if (b.status === "done" || b.status === "skipped" || b.status === "carried") continue;
      const goal = input.goals.find((g) => g.id === b.goalId);
      if (!goal || !goal.active || b.minutes <= 0) continue;
      const slot = scheduleGoal(goal, windows, input.behavior, blocks);
      if (slot) {
        blocks.push({ ...slot, sourceEvent: `${b.status} carry`, why: `${slot.why} · carried from ${prev.date}` });
      } else {
        carryAsCompressed(goal, windows, blocks, b);
      }
    }
  }

  // 2) Greedy placement of active goals (respect weekly budget, one session per goal per day max).
  const ordered = sortForScheduling(activeGoals(input.goals));
  for (const goal of ordered) {
    const already = blocks.some((b) => b.goalId === goal.id && b.status !== "skipped");
    if (already) continue;
    const slot = scheduleGoal(goal, windows, input.behavior, blocks);
    if (slot) blocks.push(slot);
  }

  blocks.sort((a, b) => toMin(a.start) - toMin(b.start));
  return { date: input.date, blocks, version: PLAN_VERSION };
}

function carryAsCompressed(goal: Goal, windows: FreeWindow[], blocks: TaskBlock[], original: TaskBlock) {
  if (original.minutes < 30) return;
  const half = Math.floor(original.minutes / 2);
  const compact: TaskBlock = {
    ...makeBlock(goal, "00:00", half, "carried", "Compressed carry-over (scope reduced)."),
    start: "00:00",
  };
  for (const w of windows) {
    const wStart = toMin(w.start);
    const used = blocks
      .filter((b) => toMin(b.start) >= wStart && toMin(b.end) <= toMin(w.end))
      .reduce((s, b) => s + b.minutes, 0);
    if (used + half <= toMin(w.end) - wStart) {
      compact.start = toTime(wStart + used);
      compact.end = toTime(toMin(compact.start) + half);
      blocks.push(compact);
      return;
    }
  }
}

/** First block claiming attention for "right now". */
export function nextAction(plan: PlanDay | undefined, now: string): TaskBlock | null {
  if (!plan) return null;
  const nowMin = toMin(now);
  const open = plan.blocks.filter(
    (b) => b.status === "planned" || b.status === "active" || b.status === "carried",
  );
  const inProgress = open.find((b) => b.status === "active");
  if (inProgress) return inProgress;
  const current = open.find((b) => nowMin >= toMin(b.start) && nowMin < toMin(b.end));
  if (current) return current;
  const upcoming = open.find((b) => toMin(b.start) >= nowMin);
  return upcoming ?? null;
}

/* ------------------------------- state + events ---------------------------- */

export function emptyState(goals?: Goal[], now = new Date()): EngineState {
  return {
    version: PLAN_VERSION,
    goals: goals ?? defaultGoals(now),
    plans: {},
    attempts: [],
    behavior: {},
    nextActions: {},
    updatedAt: now.toISOString(),
  };
}

export function rebuildBehavior(engine: EngineState): EngineState {
  return { ...engine, behavior: computeBehavior(engine.attempts) };
}

export function rebuildPlan(engine: EngineState, date = dateIso()): EngineState {
  const previous = engine.plans[dateIso(-1)] ?? null;
  const plan = planDay({ date, goals: engine.goals, behavior: engine.behavior, previous });
  const action = nextAction(plan, nowTime());
  return {
    ...engine,
    plans: { ...engine.plans, [date]: plan },
    nextActions: { ...engine.nextActions, [date]: action ? action.id : null },
    updatedAt: new Date().toISOString(),
  };
}

export function applyEvent(engine: EngineState, event: EngineEvent): EngineState {
  switch (event.type) {
    case "replan": {
      return rebuildPlan(engine);
    }
    case "task_started": {
      const plan = engine.plans[dateIso()];
      if (!plan) return engine;
      const blocks = plan.blocks.map((b) =>
        b.id === event.blockId ? { ...b, status: "active" as const } : b,
      );
      const next = { ...engine, plans: { ...engine.plans, [plan.date]: { ...plan, blocks } } };
      return recomputeNext(next, plan.date);
    }
    case "task_completed": {
      const plan = engine.plans[dateIso()];
      if (!plan) return engine;
      const block = blockById(plan, event.blockId);
      if (!block) return engine;
      const attempt = {
        id: `a:${event.blockId}:${Date.now().toString(36)}`,
        goalId: block.goalId,
        blockId: event.blockId,
        date: plan.date,
        plannedMinutes: block.minutes,
        actualMinutes: Math.max(1, Math.round(event.actualMinutes)),
        timeOfDay: block.start,
        completed: true,
        energy: event.feedback.energy,
        difficulty: event.feedback.difficulty,
        focus: event.feedback.focus,
        note: event.feedback.note,
        createdAt: event.at,
      };
      const blocks = plan.blocks.map((b) =>
        b.id === event.blockId
          ? { ...b, status: "done" as const, attemptIds: [...b.attemptIds, attempt.id] }
          : b,
      );
      let next: EngineState = {
        ...engine,
        attempts: [...engine.attempts, attempt],
        plans: { ...engine.plans, [plan.date]: { ...plan, blocks } },
      };
      const behavior = computeBehavior(next.attempts);
      next = { ...next, behavior };
      return recomputeNext(next, plan.date);
    }
    case "task_skipped": {
      const plan = engine.plans[dateIso()];
      if (!plan) return engine;
      const blocks = plan.blocks.map((b) =>
        b.id === event.blockId
          ? { ...b, status: "skipped" as const, why: event.reason ?? "Skipped" }
          : b,
      );
      return rebuildPlan({ ...engine, plans: { ...engine.plans, [plan.date]: { ...plan, blocks } } });
    }
    case "urgent_add": {
      const goal = event.goal;
      const goals = upsertGoal(engine.goals, goal);
      return rebuildPlan({ ...engine, goals }, dateIso());
    }
    case "set_goal_target": {
      const goals = setWeeklyTarget(engine.goals, event.goalId, event.weeklyTarget);
      return rebuildPlan({ ...engine, goals });
    }
    case "set_goal_active": {
      const goals = setGoalActive(engine.goals, event.goalId, event.active);
      return rebuildPlan({ ...engine, goals });
    }
    default:
      return engine;
  }
}

export function applyEvents(engine: EngineState, events: EngineEvent[]): EngineState {
  let next = engine;
  for (const ev of events) next = applyEvent(next, ev);
  return next;
}

function recomputeNext(engine: EngineState, date: string): EngineState {
  const plan = engine.plans[date];
  const action = plan ? nextAction(plan, nowTime()) : null;
  return {
    ...engine,
    nextActions: { ...engine.nextActions, [date]: action ? action.id : null },
    updatedAt: new Date().toISOString(),
  };
}

/* --------------------------------- recovery -------------------------------- */

export function recoverTasks(
  previous: PlanDay,
  date: string,
  goals: Goal[],
  behavior: BehaviorMap,
  availability: Availability = DEFAULT_AVAILABILITY,
): { carried: TaskBlock[]; dropped: { title: string; reason: string }[] } {
  const windows = freeWindows(availability);
  const carried: TaskBlock[] = [];
  const dropped: { title: string; reason: string }[] = [];
  for (const b of previous.blocks) {
    if (b.status === "done" || b.status === "skipped" || b.status === "carried") continue;
    const goal = goals.find((g) => g.id === b.goalId);
    if (!goal) continue;
    const slot = scheduleGoal(goal, windows, behavior, carried);
    if (slot) {
      carried.push({ ...slot, status: "carried", sourceEvent: `recover from ${previous.date}` });
    } else {
      dropped.push({ title: b.title, reason: "No free slot left today — carried again or re-add tomorrow." });
    }
  }
  return { carried, dropped };
}