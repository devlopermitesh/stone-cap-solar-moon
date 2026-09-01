import { useState } from "react";
import { useInterview } from "@/lib/interview-store";
import { usePlanner } from "@/lib/planner/state";
import { CheckCircle2, Gauge, HeartPulse, Zap } from "lucide-react";
import { HubBackButton } from "../hub/HubBackButton";
import { goalById, sourceLabel } from "./PlannerShared";
import type { Energy } from "@/lib/planner/types";

export function PlannerFeedback() {
  const back = useInterview((s) => s.back);
  const setPlannerScreen = useInterview((s) => s.setPlannerScreen);

  const engine = usePlanner((s) => s.engine);
  const selectedBlockId = usePlanner((s) => s.selectedBlockId);
  const busy = usePlanner((s) => s.busy);
  const dispatch = usePlanner((s) => s.dispatch);

  const date = new Date().toISOString().slice(0, 10);
  const plan = engine?.plans[date];
  const block = plan?.blocks.find((b) => b.id === selectedBlockId) ?? plan?.blocks[0] ?? null;
  const goal = block ? goalById(engine?.goals ?? [], block.goalId) : undefined;

  const [energy, setEnergy] = useState<Energy>(3);
  const [difficulty, setDifficulty] = useState(5);
  const [focus, setFocus] = useState(5);
  const [actual, setActual] = useState(block?.minutes ?? 30);
  const [note, setNote] = useState("");

  function submit() {
    if (!block) return;
    void dispatch([
      {
        type: "task_completed",
        blockId: block.id,
        actualMinutes: Math.max(1, actual),
        at: new Date().toISOString(),
        feedback: { energy, difficulty, focus, note: note.trim() || undefined },
      },
    ]);
    setPlannerScreen("day");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="How did it go?" />

      {!block ? (
        <section className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
          Nothing selected to log. Head back and pick a finished block.
        </section>
      ) : (
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-surface p-5">
            <p className="text-lg font-semibold text-fg">{block.title}</p>
            <p className="mt-1 font-mono text-sm tabular-nums text-muted">
              {block.start}–{block.end} · {goal ? sourceLabel(goal.source) : "task"} · P{block.priority}
            </p>
          </section>

          <FeedbackSlider
            icon={<HeartPulse className="size-4" />}
            label="Energy"
            min={1}
            max={5}
            value={energy}
            onChange={(v) => setEnergy(v as Energy)}
            marks={["drained", "", "", "", "fired up"]}
          />
          <FeedbackSlider
            icon={<Gauge className="size-4" />}
            label="Difficulty"
            min={1}
            max={10}
            value={difficulty}
            onChange={setDifficulty}
            marks={["easy", "", "", "", "", "", "", "", "", "brutal"]}
          />
          <FeedbackSlider
            icon={<Zap className="size-4" />}
            label="Focus"
            min={1}
            max={10}
            value={focus}
            onChange={setFocus}
            marks={["scattered", "", "", "", "", "", "", "", "", "locked in"]}
          />

          <section className="rounded-xl border border-border bg-surface p-4">
            <label className="block text-sm font-medium text-muted">Actually spent (minutes)</label>
            <input
              type="number"
              value={actual}
              min={1}
              max={600}
              onChange={(e) => setActual(Number(e.target.value))}
              className="mt-2 w-28 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-fg focus:border-accent focus:outline-none"
            />
            <label className="mt-4 block text-sm font-medium text-muted">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What clicked / what blocked you"
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none"
            />
          </section>

          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-accent bg-accent text-sm font-semibold text-accent-fg transition-colors hover:brightness-110 disabled:opacity-60"
          >
            <CheckCircle2 className="size-4" />
            Save & replan
          </button>
          <p className="text-center text-xs text-subtle">
            This feeds the behavioral engine — avg duration, best time of day, and success rate.
          </p>
        </div>
      )}
    </div>
  );
}

function FeedbackSlider({
  icon,
  label,
  min,
  max,
  value,
  onChange,
  marks,
}: {
  icon: React.ReactNode;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  marks: string[];
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-fg">
          <span className="text-accent">{icon}</span>
          {label}
        </span>
        <span className="font-mono text-lg font-semibold tabular-nums text-accent">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--color-accent)]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-subtle">
        <span>{marks[0]}</span>
        <span>{marks[marks.length - 1]}</span>
      </div>
    </section>
  );
}