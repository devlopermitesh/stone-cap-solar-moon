import { useQuiz } from "@/lib/quiz-store";
import { cn } from "@/lib/utils";
import type { Question } from "@/data/questions";
import { Check, ChevronRight, X } from "lucide-react";

const LETTERS = ["A", "B", "C", "D"] as const;

export function QuestionView() {
  const queue = useQuiz((s) => s.queue);
  const index = useQuiz((s) => s.index);
  const chosen = useQuiz((s) => s.chosen);
  const revealed = useQuiz((s) => s.revealed);
  const pick = useQuiz((s) => s.pick);
  const next = useQuiz((s) => s.next);
  const records = useQuiz((s) => s.records);

  const q = queue[index] as Question;
  if (!q) return null;

  const total = queue.length;
  const progress = ((index + (revealed ? 1 : 0)) / total) * 100;
  const score = records.filter((r) => r.correct).length;
  const isLast = index + 1 >= total;
  const pickedWrong = revealed && chosen !== null && chosen !== q.answer;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="rounded-full border border-border px-3 py-1 text-muted">{q.topic}</span>
        <span className="font-mono tabular-nums text-muted">
          {index + 1} / {total}
          <span className="mx-2 text-border">·</span>
          {score} correct
        </span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full bg-accent transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-lg leading-snug font-medium text-fg sm:text-xl">{q.question}</h2>
        {q.code ? (
          <pre className="overflow-x-auto rounded-md bg-bg p-4 font-mono text-sm leading-relaxed text-fg">
            <code>{q.code}</code>
          </pre>
        ) : null}

        <div className="flex flex-col gap-2" role="listbox" aria-label="Answers">
          {q.options.map((opt, i) => {
            const isChosen = chosen === i;
            const isCorrect = i === q.answer;
            const showCorrect = revealed && isCorrect;
            const showWrong = revealed && isChosen && !isCorrect;

            return (
              <button
                key={i}
                type="button"
                role="option"
                aria-selected={isChosen}
                disabled={revealed}
                onClick={() => pick(i)}
                className={cn(
                  "flex min-h-12 items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm leading-snug transition-colors duration-150 sm:text-base",
                  !revealed && "border-border bg-elevated text-fg hover:border-accent/50",
                  showCorrect && "border-correct bg-correct-bg text-fg",
                  showWrong && "border-wrong bg-wrong-bg text-fg",
                  revealed && !showCorrect && !showWrong && "border-border bg-bg text-muted",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-medium",
                    showCorrect && "bg-correct text-fg",
                    showWrong && "bg-wrong text-fg",
                    !revealed && "bg-bg text-muted",
                    revealed && !showCorrect && !showWrong && "bg-elevated text-subtle",
                  )}
                >
                  {showCorrect ? (
                    <Check className="size-4" strokeWidth={2.25} />
                  ) : showWrong ? (
                    <X className="size-4" strokeWidth={2.25} />
                  ) : (
                    LETTERS[i]
                  )}
                </span>
                <span className="pt-0.5">{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed ? (
          <div
            className={cn(
              "rounded-md px-4 py-3 text-sm leading-relaxed",
              pickedWrong ? "bg-wrong-bg text-fg" : "bg-correct-bg text-fg",
            )}
          >
            <p className="mb-1 font-medium">
              {pickedWrong ? "Wrong — you selected a red option." : "Correct."}
            </p>
            <p className="text-fg/90">{q.explanation}</p>
          </div>
        ) : null}
      </div>

      {revealed ? (
        <button
          type="button"
          onClick={next}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg transition-transform duration-150 active:scale-[0.98]"
        >
          {isLast ? "See results" : "Next question"}
          <ChevronRight className="size-4" />
        </button>
      ) : (
        <p className="text-center text-sm text-subtle">Choose an answer to continue</p>
      )}
    </div>
  );
}
