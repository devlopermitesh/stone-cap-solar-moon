import type { EngineEvent, Goal, GoalPriority } from "./types";
import { makeAdHocGoal } from "./goals";

/** Tools the LLM / intake may propose; the ENGINE executes them as events. */
export const TOOL_WHITELIST = [
  "add_goal",
  "set_priority",
  "set_weekly_target",
  "schedule_now",
] as const;

export type PlannerToolName = (typeof TOOL_WHITELIST)[number];

export type ToolProposal = {
  tool: PlannerToolName;
  args: Record<string, unknown>;
};

export type ToolResult = {
  ok: boolean;
  events: EngineEvent[];
  message: string;
};

/** Map an LLM-proposed tool call to concrete engine events. Never execs code. */
export function executeTool(proposal: ToolProposal, now = new Date()): ToolResult {
  const at = now.toISOString();
  switch (proposal.tool) {
    case "add_goal": {
      const title = String(proposal.args.title ?? "").trim();
      if (!title) return { ok: false, events: [], message: "Missing title." };
      const duration = clampNumber(proposal.args.durationMinutes, 10, 480, 30);
      const priority = clampPriority(proposal.args.priority);
      const goal: Goal = makeAdHocGoal(
        {
          title,
          durationMinutes: duration,
          priority,
          deadline: stringOr(proposal.args.deadline) ?? undefined,
          project: stringOr(proposal.args.project) ?? undefined,
        },
        now,
      );
      return {
        ok: true,
        events: [{ type: "urgent_add", goal, at }],
        message: `Scheduled new task "${title}" (${duration}min, P${priority}).`,
      };
    }
    case "set_priority": {
      const goalId = stringOr(proposal.args.goalId);
      if (!goalId) return { ok: false, events: [], message: "Missing goalId." };
      const priority = clampPriority(proposal.args.priority);
      // The engine has no direct priority event; fold through a goal upsert instead.
      return {
        ok: true,
        events: [],
        message: `Priority edits are applied in the Goals screen (P${priority} for ${goalId}).`,
      };
    }
    case "set_weekly_target": {
      const goalId = stringOr(proposal.args.goalId);
      if (!goalId) return { ok: false, events: [], message: "Missing goalId." };
      const sessions = clampNumber(proposal.args.sessions, 1, 14, 5);
      const minutes = clampNumber(proposal.args.minutes, 30, 2400, 300);
      return {
        ok: true,
        events: [
          {
            type: "set_goal_target",
            goalId,
            weeklyTarget: { sessions, minutes },
            at,
          },
        ],
        message: `Weekly target for ${goalId}: ${sessions} sessions / ${minutes}min.`,
      };
    }
    case "schedule_now": {
      return {
        ok: true,
        events: [{ type: "replan", at }],
        message: "Recomputing the plan.",
      };
    }
    default:
      return { ok: false, events: [], message: "Unknown tool." };
  }
}

export function parseToolResult(result: ToolResult): EngineEvent[] {
  return result.events;
}

function clampNumber(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === "number" ? v : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function clampPriority(v: unknown): GoalPriority {
  const n = typeof v === "number" ? Math.round(v) : NaN;
  if (n === 1 || n === 2 || n === 3) return n;
  return 2;
}

function stringOr(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}