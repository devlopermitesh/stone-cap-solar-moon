import { useState } from "react";
import { useTracking } from "@/lib/interview-store";
import type { BankQuestion } from "@/lib/curriculum";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, Lightbulb, Circle } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  "Very Easy": "text-correct",
  Easy: "text-accent",
  "Easy-Medium": "text-amber-400",
  Medium: "text-amber-400",
  Hard: "text-wrong",
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-border px-2.5 py-0.5 text-xs font-medium capitalize",
        DIFFICULTY_COLORS[difficulty] ?? "text-muted",
      )}
    >
      {difficulty}
    </span>
  );
}

export function QuestionCard({
  q,
  completionKey,
}: {
  q: BankQuestion;
  completionKey: (id: number) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const completed = useTracking((s) => s.completedProblems);
  const toss = useTracking((s) => s.tossProblem);
  const done = !!completed[completionKey(q.id)];

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          onClick={() => toss(completionKey(q.id))}
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-bg text-muted transition-colors hover:bg-elevated"
          aria-label={done ? "Mark incomplete" : "Mark complete"}
        >
          {done ? (
            <CheckCircle2 className="size-4 text-correct" />
          ) : (
            <Circle className="size-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm leading-snug font-medium text-fg">{q.question}</span>
            <span className="mt-2 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={q.difficulty} />
              <span className="rounded-full bg-elevated px-2.5 py-0.5 text-xs text-subtle">
                {q.topicPattern}
              </span>
            </span>
          </span>
          <ChevronDown
            className={cn(
              "mt-0.5 size-4 shrink-0 text-muted transition-transform duration-150",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>

      {expanded ? (
        <div className="flex flex-col gap-3 border-t border-border px-4 pb-4 pt-3">
          <DetailRow label="What the interviewer tests">{q.whatInterviewerTests}</DetailRow>
          <DetailRow label="Example input">
            <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-xs text-fg">
              {q.exampleInput}
            </code>
          </DetailRow>
          <DetailRow label="Expected output">
            <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-xs text-fg">
              {q.expectedOutput}
            </code>
          </DetailRow>
          <DetailRow label="Constraints">{q.constraints}</DetailRow>
          <div className="flex items-start gap-2 rounded-md bg-elevated px-3 py-2 text-sm text-muted">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" />
            <span className="leading-relaxed">{q.hint}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-sm">
      <span className="font-medium text-subtle">{label}: </span>
      <span className="text-fg/90">{children}</span>
    </div>
  );
}