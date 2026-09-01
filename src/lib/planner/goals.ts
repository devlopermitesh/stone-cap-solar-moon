import type { Goal, GoalPriority, WeeklyTarget } from "./types";

export function defaultGoals(now = new Date()): Goal[] {
  const t = now.toISOString();
  return [
    {
      id: "dsa",
      title: "DSA instruction + problems",
      source: "dsa",
      kind: "curriculum",
      dataRef: "dsa-plan",
      weeklyTarget: { sessions: 5, minutes: 450 },
      defaultDuration: 90,
      priority: 1,
      active: true,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "english",
      title: "English fluency lessons",
      source: "english",
      kind: "curriculum",
      dataRef: "english-plan",
      weeklyTarget: { sessions: 6, minutes: 300 },
      defaultDuration: 50,
      priority: 2,
      active: true,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "smm",
      title: "SMM interview prep",
      source: "smm",
      kind: "curriculum",
      dataRef: "smm-questions",
      weeklyTarget: { sessions: 3, minutes: 90 },
      defaultDuration: 30,
      priority: 2,
      active: true,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "fullstack",
      title: "Fullstack practice round",
      source: "fullstack",
      kind: "curriculum",
      dataRef: "questions",
      weeklyTarget: { sessions: 3, minutes: 120 },
      defaultDuration: 40,
      priority: 3,
      active: true,
      createdAt: t,
      updatedAt: t,
    },
  ];
}

export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return slug || "task";
}

export type AdHocInput = {
  title: string;
  durationMinutes?: number;
  priority?: GoalPriority;
  deadline?: string;
  project?: string;
};

export function makeAdHocGoal(input: AdHocInput, now = new Date()): Goal {
  const t = now.toISOString();
  const stamp = `${Date.now().toString(36)}`;
  return {
    id: `custom:${slugify(input.title)}:${stamp}`,
    title: input.title,
    source: "custom",
    kind: "task",
    defaultDuration: Math.min(480, Math.max(10, input.durationMinutes ?? 30)),
    priority: input.priority ?? 2,
    deadline: input.deadline,
    project: input.project,
    active: true,
    createdAt: t,
    updatedAt: t,
  };
}

export function upsertGoal(goals: Goal[], goal: Goal): Goal[] {
  const idx = goals.findIndex((g) => g.id === goal.id);
  if (idx === -1) return [...goals, goal];
  const next = [...goals];
  next[idx] = { ...next[idx], ...goal, updatedAt: new Date().toISOString() };
  return next;
}

export function getGoal(goals: Goal[], id: string): Goal | undefined {
  return goals.find((g) => g.id === id);
}

export function activeGoals(goals: Goal[]): Goal[] {
  return goals.filter((g) => g.active);
}

/** Sessions for a goal already present today (done or active). */
export function sessionsToday(plan: { blocks: { goalId: string; status: string }[] } | undefined, goalId: string): number {
  if (!plan) return 0;
  return plan.blocks.filter(
    (b) => b.goalId === goalId && (b.status === "done" || b.status === "active"),
  ).length;
}

export function goalWeeklyBudget(goal: Goal, plan: { blocks: { goalId: string; status: string; minutes: number }[] } | undefined): {
  sessionUsed: number;
  minutesUsed: number;
  sessionLeft: number;
  minuteLeft: number;
} {
  const used = plan
    ? plan.blocks
        .filter((b) => b.goalId === goal.id && (b.status === "done" || b.status === "active"))
        .reduce(
          (acc, b) => {
            acc.sessions += 1;
            acc.minutes += b.minutes;
            return acc;
          },
          { sessions: 0, minutes: 0 },
        )
    : { sessions: 0, minutes: 0 };
  const target = goal.weeklyTarget ?? { sessions: 5, minutes: 300 };
  return {
    sessionUsed: used.sessions,
    minutesUsed: used.minutes,
    sessionLeft: Math.max(0, target.sessions - used.sessions),
    minuteLeft: Math.max(0, target.minutes - used.minutes),
  };
}

export function setWeeklyTarget(goals: Goal[], goalId: string, target: WeeklyTarget): Goal[] {
  return goals.map((g) =>
    g.id === goalId ? { ...g, weeklyTarget: target, updatedAt: new Date().toISOString() } : g,
  );
}

export function setGoalActive(goals: Goal[], goalId: string, active: boolean): Goal[] {
  return goals.map((g) =>
    g.id === goalId ? { ...g, active, updatedAt: new Date().toISOString() } : g,
  );
}