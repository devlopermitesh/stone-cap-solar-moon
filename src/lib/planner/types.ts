export const GOAL_SOURCES = [
  "dsa",
  "english",
  "smm",
  "fullstack",
  "instagram",
  "custom",
] as const;

export type GoalSource = (typeof GOAL_SOURCES)[number];
export type GoalPriority = 1 | 2 | 3;

export type WeeklyTarget = {
  sessions: number;
  minutes: number;
};

export type Goal = {
  id: string;
  title: string;
  source: GoalSource;
  kind: "curriculum" | "task";
  dataRef?: string;
  weeklyTarget?: WeeklyTarget;
  defaultDuration: number;
  priority: GoalPriority;
  deadline?: string;
  project?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskBlockStatus = "planned" | "active" | "done" | "skipped" | "carried";

export type TaskBlock = {
  id: string;
  goalId: string;
  title: string;
  start: string;
  end: string;
  minutes: number;
  status: TaskBlockStatus;
  priority: GoalPriority;
  why?: string;
  sourceEvent?: string;
  attemptIds: string[];
};

export type PlanDay = {
  date: string;
  blocks: TaskBlock[];
  version: number;
};

export type Energy = 1 | 2 | 3 | 4 | 5;

export type TaskAttempt = {
  id: string;
  goalId: string;
  blockId: string;
  date: string;
  plannedMinutes: number;
  actualMinutes: number;
  timeOfDay: string;
  completed: boolean;
  energy: Energy;
  difficulty: number;
  focus: number;
  note?: string;
  createdAt: string;
};

export type BehaviorStats = {
  goalId: string;
  attempts: number;
  completed: number;
  avgDuration: number;
  bestSlot: string | null;
  successRate: number;
  updatedAt: string;
};

export type BehaviorMap = Record<string, BehaviorStats>;

export type EngineEvent =
  | { type: "task_started"; blockId: string; at: string }
  | {
      type: "task_completed";
      blockId: string;
      actualMinutes: number;
      feedback: {
        energy: Energy;
        difficulty: number;
        focus: number;
        note?: string;
      };
      at: string;
    }
  | { type: "task_skipped"; blockId: string; reason?: string; at: string }
  | { type: "urgent_add"; goal: Goal; at: string }
  | { type: "set_goal_target"; goalId: string; weeklyTarget: WeeklyTarget; at: string }
  | { type: "set_goal_active"; goalId: string; active: boolean; at: string }
  | { type: "replan"; at: string };

export type EngineState = {
  version: number;
  goals: Goal[];
  plans: Record<string, PlanDay>;
  attempts: TaskAttempt[];
  behavior: BehaviorMap;
  nextActions: Record<string, string | null>;
  updatedAt: string;
};