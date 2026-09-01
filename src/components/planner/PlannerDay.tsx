import { useMemo } from "react";
import { useInterview } from "@/lib/interview-store";
import { usePlanner } from "@/lib/planner/state";
import { dateIso, nowTime } from "@/lib/planner/engine";
import { goalWeeklyBudget } from "@/lib/planner/goals";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Flag,
  ListChecks,
  Play,
  RotateCcw,
  SkipForward,
  Timer,
} from "lucide-react";
import { HubBackButton } from "../hub/HubBackButton";
import { BlockRow, goalById, goalIcon, sourceLabel } from "./PlannerShared";
import type { TaskBlock } from "@/lib/planner/types";

export function PlannerDay() {
  const back = useInterview((s) => s.back);
  const setPlannerScreen = useInterview((s) => s.setPlannerScreen);

  const engine = usePlanner((s) => s.engine);
  const selectedBlockId = usePlanner((s) => s.selectedBlockId);
  const busy = usePlanner((s) => s.busy);
  const dispatch = usePlanner((s) => s.dispatch);
  const selectBlock = usePlanner((s) => s.selectBlock);

  const date = dateIso();
  const plan = engine?.plans[date];

  const selected = useMemo(
    () => plan?.blocks.find((b) => b.id === selectedBlockId) ?? plan?.blocks[0] ?? null,
    [plan, selectedBlockId],
  );
  const selectedGoal = selected ? goalById(engine?.goals ?? [], selected.goalId) : undefined;
  const budget = selectedGoal
    ? goalWeeklyBudget(selectedGoal, { blocks: plan?.blocks ?? [] })
    : null;

  function markStart(block: TaskBlock) {
    void dispatch([{ type: "task_started", blockId: block.id, at: new Date().toISOString() }]);
  }

  function markSkip(block: TaskBlock) {
    void dispatch([
      { type: "task_skipped", blockId: block.id, reason: "Skipped", at: new Date().toISOString() },
    ]);
  }

  function replan() {
    void dispatch([{ type: "replan", at: new Date().toISOString() }]);
    selectBlock(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton onBack={back} label="Today's plan" />
        <button
          type="button"
          onClick={replan}
          disabled={busy}
          className="flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs text-muted transition-colors hover:bg-elevated disabled:opacity-60"
        >
          <RotateCcw className="size-3.5" />
          Recompute
        </button>
      </div>

      {!plan || plan.blocks.length === 0 ? (
        <section className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
          No blocks for today — add a goal or hit Recompute after carrying work.
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <section className="flex flex-col gap-2 lg:col-span-3">
            {plan.blocks.map((b) => (
              <BlockRow
                key={b.id}
                block={b}
                goal={goalById(engine?.goals ?? [], b.goalId)}
                selected={b.id === selected?.id}
                onSelect={() => selectBlock(b.id)}
              />
            ))}
          </section>

          <aside className="flex flex-col gap-4 lg:col-span-2">
            {selected ? (
              <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-fg">
                    {selectedGoal ? goalIcon(selectedGoal.source) : <ListChecks className="size-5" />}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-[11px] tabular-nums",
                      selected.status === "active"
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-border bg-bg text-muted",
                    )}
                  >
                    {selected.status}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-fg">{selected.title}</h2>
                  <p className="mt-1 font-mono text-sm tabular-nums text-accent">
                    {selected.start}–{selected.end} · {selected.minutes} min · P{selected.priority}
                  </p>
                  {selected.why ? <p className="mt-1 text-sm text-muted">{selected.why}</p> : null}
                </div>

                {selectedGoal ? (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-muted">
                      <Flag className="size-3.5 text-accent" />
                      {sourceLabel(selectedGoal.source)} · P{selectedGoal.priority}
                    </span>
                    {budget ? (
                      <span className="rounded-full border border-border bg-bg px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-muted">
                        {budget.sessionLeft} sessions left this week
                      </span>
                    ) : null}
                    {selectedGoal.deadline ? (
                      <span className="rounded-full border border-border bg-bg px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-muted">
                        due {selectedGoal.deadline}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {selected.status === "done" ? (
                  <button
                    type="button"
                    onClick={() => setPlannerScreen("feedback")}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-correct/50 bg-correct-bg text-sm font-semibold text-correct transition-colors hover:brightness-110"
                  >
                    <CheckCircle2 className="size-4" />
                    Log how it went
                  </button>
                ) : selected.status === "skipped" ? (
                  <p className="text-center text-xs text-subtle">Skipped — Recompute will re-plan the day.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => markStart(selected)}
                      disabled={busy || selected.status === "active"}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent text-sm font-semibold text-accent-fg transition-colors hover:brightness-110 disabled:opacity-60"
                    >
                      <Play className="size-4" />
                      {selected.status === "active" ? "Already started" : "Mark started"}
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPlannerScreen("feedback")}
                        className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-correct/50 bg-correct-bg text-xs font-semibold text-correct transition-colors hover:brightness-110"
                      >
                        <CheckCircle2 className="size-4" />
                        Finish + rate
                      </button>
                      <button
                        type="button"
                        onClick={() => markSkip(selected)}
                        disabled={busy}
                        className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-bg text-xs font-semibold text-muted transition-colors hover:bg-elevated disabled:opacity-60"
                      >
                        <SkipForward className="size-4" />
                        Skip
                      </button>
                    </div>
                  </div>
                )}
              </section>
            ) : null}

            <section className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted">
                <Timer className="size-4" />
                Now {nowTime()}
              </div>
              <p className="mt-1 text-xs text-subtle">
                Tap a block to act on it. Finishing asks for energy / difficulty / focus — the engine
                learns your best slots from that.
              </p>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}