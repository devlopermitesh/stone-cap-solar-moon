import { useState } from "react";
import { useInterview } from "@/lib/interview-store";
import { usePlanner } from "@/lib/planner/state";
import { makeAdHocGoal } from "@/lib/planner/goals";
import { summarizeBehavior } from "@/lib/planner/behavior";
import { cn } from "@/lib/utils";
import { CalendarPlus, RotateCcw, Sparkles, Target, Trash2 } from "lucide-react";
import { HubBackButton } from "../hub/HubBackButton";
import { StatCard, goalIcon, sourceLabel } from "./PlannerShared";

const PRIORITIES = [
  { value: 1, label: "P1 · must" },
  { value: 2, label: "P2 · should" },
  { value: 3, label: "P3 · nice" },
] as const;

export function PlannerGoals() {
  const back = useInterview((s) => s.back);
  const engine = usePlanner((s) => s.engine);
  const busy = usePlanner((s) => s.busy);
  const snack = usePlanner((s) => s.snack);
  const clearSnack = usePlanner((s) => s.clearSnack);
  const dispatch = usePlanner((s) => s.dispatch);
  const intake = usePlanner((s) => s.intake);

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [priority, setPriority] = useState<1 | 2 | 3>(2);

  const goals = engine?.goals ?? [];

  async function runIntake() {
    if (!text.trim()) return;
    const r = await intake(text);
    if (r.ok && r.count > 0) {
      setText("");
    }
  }

  function manualAdd() {
    if (!title.trim()) return;
    const goal = makeAdHocGoal({ title, durationMinutes: minutes, priority });
    void dispatch([{ type: "urgent_add", goal, at: new Date().toISOString() }]);
    setTitle("");
    setMinutes(30);
    setPriority(2);
  }

  function toggleActive(goalId: string, active: boolean) {
    void dispatch([{ type: "set_goal_active", goalId, active, at: new Date().toISOString() }]);
  }

  function removeGoal(goalId: string) {
    void dispatch([{ type: "set_goal_active", goalId, active: false, at: new Date().toISOString() }]);
  }

  function replan() {
    void dispatch([{ type: "replan", at: new Date().toISOString() }]);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="Goals & targets" />

      {snack ? (
        <button
          type="button"
          onClick={clearSnack}
          className="rounded-xl border border-wrong/50 bg-wrong-bg px-4 py-3 text-left text-sm text-wrong"
        >
          {snack}
        </button>
      ) : null}

      <section className="flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent/5 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-fg">
          <Sparkles className="size-4 text-accent" />
          Describe a task in plain words
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Review DP notes 40min P1 by 2026-09-05 · update PocketLedger budget 30min"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={runIntake}
          disabled={busy || !text.trim()}
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border border-accent bg-accent px-4 text-sm font-semibold text-accent-fg transition-colors hover:brightness-110 disabled:opacity-60"
        >
          <Sparkles className="size-4" />
          Parse with AI
        </button>
        <p className="text-xs text-subtle">
          Gemini reads it, the engine schedules it. If the AI key is off, it still parses simple
          patterns like the example above.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <CalendarPlus className="size-4" />
          Quick add
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minutes}
              min={10}
              max={480}
              step={5}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-20 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-fg focus:border-accent focus:outline-none"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
              className="rounded-lg border border-border bg-bg px-2 py-2 text-sm text-fg focus:border-accent focus:outline-none"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={manualAdd}
              disabled={busy || !title.trim()}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-elevated px-4 text-sm font-medium text-fg transition-colors hover:brightness-110 disabled:opacity-60"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Target className="size-5" />} label="Active goals" value={`${goals.filter((g) => g.active).length}`} />
        <StatCard icon={<Sparkles className="size-5" />} label="Custom tasks" value={`${goals.filter((g) => g.source === "custom").length}`} />
        <StatCard icon={<RotateCcw className="size-5" />} label="Engine state" value={`v${engine?.version ?? "-"}`} />
        <StatCard icon={<CalendarPlus className="size-5" />} label="Attempts logged" value={`${engine?.attempts.length ?? 0}`} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Tracks & tasks</h2>
          <button
            type="button"
            onClick={replan}
            disabled={busy}
            className="flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs text-muted transition-colors hover:bg-elevated disabled:opacity-60"
          >
            <RotateCcw className="size-3.5" />
            Re-plan now
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {goals.length === 0 ? (
            <p className="text-sm text-muted">No goals yet — add your first task above.</p>
          ) : (
            goals
              .slice()
              .sort((a, b) => a.priority - b.priority)
              .map((g) => {
                const behavior = summarizeBehavior(engine?.behavior ?? {}, g.id);
                return (
                  <div
                    key={g.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border bg-surface px-4 py-3",
                      g.active ? "border-border" : "border-border opacity-60",
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg text-accent">
                      {goalIcon(g.source)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="truncate text-sm font-medium text-fg">{g.title}</span>
                        <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[10px] tabular-nums text-muted">
                          {sourceLabel(g.source)} · P{g.priority}
                        </span>
                        {g.deadline ? (
                          <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[10px] tabular-nums text-subtle">
                            due {g.deadline}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {g.weeklyTarget
                          ? `${g.weeklyTarget.sessions} sessions · ${g.weeklyTarget.minutes}min/week · `
                          : ""}
                        {behavior.suggestion}
                      </span>
                      <span className="block text-[11px] text-subtle">{behavior.confidence}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleActive(g.id, !g.active)}
                      disabled={g.source !== "custom" && !g.active}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg border transition-colors",
                        g.active
                          ? "border-correct/50 bg-correct-bg text-correct"
                          : "border-border bg-bg text-muted",
                      )}
                      aria-label={g.active ? "Deactivate" : "Activate"}
                    >
                      {g.active ? "✓" : "○"}
                    </button>
                    {g.source === "custom" ? (
                      <button
                        type="button"
                        onClick={() => removeGoal(g.id)}
                        className="flex size-8 items-center justify-center rounded-lg border border-border bg-bg text-muted transition-colors hover:bg-elevated"
                        aria-label="Remove task"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    ) : null}
                  </div>
                );
              })
          )}
        </div>
      </section>
    </div>
  );
}