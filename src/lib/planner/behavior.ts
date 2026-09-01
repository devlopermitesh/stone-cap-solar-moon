import type { BehaviorMap, BehaviorStats, Goal, TaskAttempt } from "./types";

const MIN_ATTEMPTS_FOR_TRUST = 5;
const MIN_ATTEMPTS_FOR_SLOT = 2;

export function hourOf(timeOfDay: string): number {
  const [h] = timeOfDay.split(":").map(Number);
  return Number.isFinite(h) ? h : 12;
}

function binLabel(hour: number): string {
  const h = hour % 24;
  return `${String(h).padStart(2, "0")}:00`;
}

export function computeBehavior(attempts: TaskAttempt[]): { [goalId: string]: BehaviorStats } {
  const byGoal = new Map<string, TaskAttempt[]>();
  for (const a of attempts) {
    const list = byGoal.get(a.goalId) ?? [];
    list.push(a);
    byGoal.set(a.goalId, list);
  }

  const out: { [goalId: string]: BehaviorStats } = {};
  for (const [goalId, list] of byGoal) {
    if (!list.length) continue;
    const completedList = list.filter((a) => a.completed);
    const totalMinutes = list.reduce((s, a) => s + a.actualMinutes, 0);
    const avgDuration = Math.round(totalMinutes / list.length);
    const successRate = list.filter((a) => a.completed).length / list.length;

    const byHour = new Map<number, { n: number; ok: number }>();
    for (const a of list) {
      const h = hourOf(a.timeOfDay);
      const cur = byHour.get(h) ?? { n: 0, ok: 0 };
      cur.n += 1;
      if (a.completed) cur.ok += 1;
      byHour.set(h, cur);
    }
    let bestSlot: string | null = null;
    let bestScore = -1;
    for (const [h, v] of byHour) {
      if (v.n < MIN_ATTEMPTS_FOR_SLOT) continue;
      const score = v.ok / v.n + Math.min(v.n, 6) / 60;
      if (score > bestScore) {
        bestScore = score;
        bestSlot = binLabel(h);
      }
    }

    out[goalId] = {
      goalId,
      attempts: list.length,
      completed: completedList.length,
      avgDuration,
      bestSlot,
      successRate,
      updatedAt: list[list.length - 1]?.createdAt ?? new Date().toISOString(),
    };
  }
  return out;
}

/** Learned duration once we trust the sample, else the goal's default. */
export function suggestDuration(goal: Goal, behavior: BehaviorMap): number {
  const s = behavior[goal.id];
  if (s && s.attempts >= MIN_ATTEMPTS_FOR_TRUST && s.avgDuration > 0) {
    return Math.min(240, s.avgDuration);
  }
  return goal.defaultDuration;
}

/** Best slot once we have signal, else null (engine falls back to priority order). */
export function suggestSlot(goal: Goal, behavior: BehaviorMap): string | null {
  const s = behavior[goal.id];
  return s?.bestSlot ?? null;
}

export function confidenceLabel(stats: BehaviorStats | undefined): string {
  if (!stats) return "no data";
  if (stats.attempts < MIN_ATTEMPTS_FOR_TRUST) return `learning · ${stats.attempts} sessions`;
  return `confident · ${stats.attempts} sessions`;
}

export function summarizeBehavior(behavior: BehaviorMap, goalId: string): { suggestion: string; confidence: string } {
  const s = behavior[goalId];
  const confidence = confidenceLabel(s);
  if (!s) return { suggestion: "Default duration until enough sessions are logged.", confidence };
  const parts: string[] = [];
  parts.push(`avg ${s.avgDuration}min`);
  parts.push(`${Math.round(s.successRate * 100)}% done`);
  if (s.bestSlot) parts.push(`best ${s.bestSlot}`);
  return { suggestion: parts.join(" · "), confidence };
}

export function mergeBehavior(maps: BehaviorMap[]): BehaviorMap {
  const out: BehaviorMap = {};
  for (const m of maps) Object.assign(out, m);
  return out;
}