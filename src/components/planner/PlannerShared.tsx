import type { ReactNode } from "react";
import { Code2, GraduationCap, Languages, Rocket, Sparkles, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Goal, GoalSource, TaskBlock, TaskBlockStatus } from "@/lib/planner/types";

export function goalIcon(source: GoalSource, className = "size-5") {
  const cls = "shrink-0 " + className;
  switch (source) {
    case "dsa":
      return <GraduationCap className={cls} strokeWidth={1.75} />;
    case "english":
      return <Languages className={cls} strokeWidth={1.75} />;
    case "smm":
      return <Rocket className={cls} strokeWidth={1.75} />;
    case "fullstack":
      return <Code2 className={cls} strokeWidth={1.75} />;
    default:
      return <Sparkles className={cls} strokeWidth={1.75} />;
  }
}

export function sourceLabel(source: GoalSource): string {
  switch (source) {
    case "dsa":
      return "DSA";
    case "english":
      return "English";
    case "smm":
      return "SMM";
    case "fullstack":
      return "Fullstack";
    default:
      return "Task";
  }
}

export function statusTone(status: TaskBlockStatus): string {
  switch (status) {
    case "done":
      return "border-correct/50 bg-correct-bg text-correct";
    case "active":
      return "border-accent bg-accent/15 text-accent";
    case "skipped":
      return "border-border bg-bg text-subtle line-through";
    case "carried":
      return "border-amber-700/50 bg-amber-900/20 text-amber-400";
    default:
      return "border-border bg-bg text-muted";
  }
}

export function statusLabel(status: TaskBlockStatus): string {
  if (status === "planned") return "up next · planned";
  if (status === "carried") return "carried";
  return status;
}

export function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <span className="flex size-8 items-center justify-center rounded-lg bg-bg text-accent">{icon}</span>
      <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-fg">{value}</p>
      <p className="text-xs text-muted">{label}</p>
      {hint ? <p className="mt-1 text-[11px] text-subtle">{hint}</p> : null}
    </div>
  );
}

export function NavCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors hover:bg-elevated active:scale-[0.99]"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-bg text-accent">{icon}</span>
        <span>
          <span className="block text-base font-semibold text-fg">{title}</span>
          <span className="block text-sm text-muted">{subtitle}</span>
        </span>
      </span>
    </button>
  );
}

export function BlockRow({
  block,
  goal,
  selected,
  onSelect,
}: {
  block: TaskBlock;
  goal: Goal | undefined;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-surface px-4 py-3 text-left transition-colors hover:bg-elevated",
        selected ? "border-accent" : "border-border",
        block.status === "done" && "opacity-70",
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", "bg-bg text-accent")}>
        {goal ? goalIcon(goal.source) : <Timer className="size-4.5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="truncate text-sm font-medium text-fg">{block.title}</span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 font-mono text-[10px] tabular-nums",
              statusTone(block.status),
            )}
          >
            {statusLabel(block.status)}
          </span>
        </span>
        <span className="mt-0.5 flex items-center gap-2 font-mono text-xs tabular-nums text-muted">
          {block.start}–{block.end}
          <span>·</span>
          <span>{block.minutes}m</span>
          {goal ? (
            <>
              <span>·</span>
              <span className="text-subtle">{sourceLabel(goal.source)}</span>
            </>
          ) : null}
        </span>
        {block.why ? <span className="mt-0.5 block truncate text-xs text-subtle">{block.why}</span> : null}
      </span>
    </button>
  );
}

export function goalById(goals: Goal[], goalId: string): Goal | undefined {
  return goals.find((g) => g.id === goalId);
}