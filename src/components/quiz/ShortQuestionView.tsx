import { useQuiz } from "@/lib/quiz-store";
import { ChevronRight, Eye } from "lucide-react";
import type { ShortQuestion } from "@/data/short-questions";

export function ShortQuestionView() {
  const queue = useQuiz((s) => s.queue);
  const index = useQuiz((s) => s.index);
  const revealed = useQuiz((s) => s.revealed);
  const revealAnswer = useQuiz((s) => s.revealAnswer);
  const next = useQuiz((s) => s.next);

  const q = queue[index] as ShortQuestion;
  if (!q) return null;

  const total = queue.length;
  const progress = ((index + (revealed ? 1 : 0)) / total) * 100;
  const isLast = index + 1 >= total;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="rounded-full border border-border px-3 py-1 text-muted">{q.topic}</span>
        <span className="font-mono tabular-nums text-muted">
          {index + 1} / {total}
          <span className="mx-2 text-border">·</span>
          Short answer
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

        {revealed ? (
          <div className="rounded-md border border-correct/40 bg-correct-bg px-4 py-3 text-sm leading-relaxed text-fg">
            <p className="mb-1 font-medium">Answer</p>
            <p className="text-fg/90">{q.answer}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-md border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
              Answer hidden — try to recall it first
            </div>
            <button
              type="button"
              onClick={revealAnswer}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg transition-transform duration-150 active:scale-[0.98]"
            >
              <Eye className="size-4" />
              Show answer
            </button>
          </div>
        )}
      </div>

      {revealed ? (
        <button
          type="button"
          onClick={next}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg transition-transform duration-150 active:scale-[0.98]"
        >
          {isLast ? "Finish" : "Next question"}
          <ChevronRight className="size-4" />
        </button>
      ) : (
        <p className="text-center text-sm text-subtle">Think of the answer, then tap Show</p>
      )}
    </div>
  );
}
