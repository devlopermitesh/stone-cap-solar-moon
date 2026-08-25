import { useMemo, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { useQuiz } from "@/lib/quiz-store";
import { cn } from "@/lib/utils";
import { Check, RotateCcw, X } from "lucide-react";

type Filter = "all" | "wrong" | "correct";

export function ResultsScreen() {
  const records = useQuiz((s) => s.records);
  const queue = useQuiz((s) => s.queue);
  const restart = useQuiz((s) => s.restart);
  const [filter, setFilter] = useState<Filter>("all");

  const correctCount = records.filter((r) => r.correct).length;
  const total = records.length || queue.length;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;

  const byTopic = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    for (const rec of records) {
      const q = QUESTIONS.find((item) => item.id === rec.questionId);
      if (!q) continue;
      const cur = map.get(q.topic) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (rec.correct) cur.correct += 1;
      map.set(q.topic, cur);
    }
    return Array.from(map.entries());
  }, [records]);

  const rows = records.filter((r) => {
    if (filter === "wrong") return !r.correct;
    if (filter === "correct") return r.correct;
    return true;
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">Results</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {correctCount}
          <span className="text-muted"> / {total}</span>
        </h1>
        <p className="font-mono text-sm tabular-nums text-muted">{pct}% correct</p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {byTopic.map(([topic, stat]) => (
          <div
            key={topic}
            className="rounded-lg border border-border bg-surface px-3 py-3"
          >
            <p className="text-xs text-muted">{topic}</p>
            <p className="mt-1 font-mono text-sm tabular-nums">
              {stat.correct}/{stat.total}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={restart}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg"
      >
        <RotateCcw className="size-4" />
        Start again
      </button>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-medium">Answer review</h2>
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {(["all", "wrong", "correct"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "min-h-9 rounded-md px-3 text-xs font-medium capitalize",
                  filter === f ? "bg-elevated text-fg" : "text-muted",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ol className="flex flex-col gap-3">
          {rows.map((rec) => {
            const q = QUESTIONS.find((item) => item.id === rec.questionId);
            if (!q) return null;
            return (
              <li
                key={rec.questionId}
                className={cn(
                  "rounded-xl border p-4",
                  rec.correct
                    ? "border-correct/40 bg-correct-bg/40"
                    : "border-wrong/50 bg-wrong-bg/50",
                )}
              >
                <div className="mb-2 flex items-start gap-2">
                  {rec.correct ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-correct" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-wrong" />
                  )}
                  <p className="text-sm font-medium leading-snug">
                    <span className="mr-2 font-mono text-xs text-muted">Q{q.id}</span>
                    {q.question}
                  </p>
                </div>
                <p className="pl-6 text-sm">
                  <span className="text-muted">Your answer: </span>
                  <span className={rec.correct ? "text-correct" : "text-wrong"}>
                    {q.options[rec.chosen]}
                  </span>
                </p>
                {!rec.correct ? (
                  <p className="mt-1 pl-6 text-sm">
                    <span className="text-muted">Correct: </span>
                    <span className="text-correct">{q.options[q.answer]}</span>
                  </p>
                ) : null}
                <p className="mt-2 pl-6 text-sm leading-relaxed text-muted">{q.explanation}</p>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
