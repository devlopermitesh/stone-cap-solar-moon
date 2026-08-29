import { useMemo, useState } from "react";
import { SMM_QUESTIONS } from "@/data/smm-questions";
import { useInterview } from "@/lib/interview-store";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Eye, Lightbulb, RotateCcw } from "lucide-react";

const CATEGORIES = [
  "all",
  ...Array.from(new Set(SMM_QUESTIONS.map((q) => q.category))),
] as const;

export function SmmScreen() {
  const back = useInterview((s) => s.back);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const list = useMemo(
    () => SMM_QUESTIONS.filter((q) => category === "all" || q.category === category),
    [category],
  );

  const q = list[index];

  const reset = () => {
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  };

  const resetAll = (c: (typeof CATEGORIES)[number]) => {
    setCategory(c);
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:py-12">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">Reviewed</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {list.length}/{SMM_QUESTIONS.length} questions in this set
          </h1>
          <p className="text-base text-muted">
            Sweet Country · Social Media Manager interview prep
          </p>
        </header>
        <button
          type="button"
          onClick={reset}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg"
        >
          <RotateCcw className="size-4" />
          Start again
        </button>
        <button
          type="button"
          onClick={back}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-medium text-fg"
        >
          Back to tracks
        </button>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
        <HubBackButton onBack={back} label="Social Media Manager" />
        <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-8 text-center text-sm text-subtle">
          No questions in this category yet.
        </p>
      </div>
    );
  }

  const total = list.length;
  const progress = ((index + (revealed ? 1 : 0)) / total) * 100;
  const isLast = index + 1 >= total;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="Social Media Manager" />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {CATEGORIES.slice(0, 3).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => resetAll(c)}
                className={cn(
                  "min-h-8 rounded-md px-3 text-xs font-medium capitalize",
                  category === c ? "bg-elevated text-fg" : "text-muted",
                )}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
          <span className="font-mono tabular-nums text-muted">
            {index + 1} / {total}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.slice(1).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => resetAll(c)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                category === c
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface text-muted hover:bg-elevated",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full bg-accent transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <span className="w-fit rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
          {q.category}
        </span>
        <h2 className="text-lg leading-snug font-medium text-fg sm:text-xl">{q.question}</h2>

        {!revealed && q.hint ? (
          <div className="flex items-start gap-2 rounded-md bg-elevated px-3 py-2.5 text-sm text-muted">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" />
            <span className="leading-relaxed">{q.hint}</span>
          </div>
        ) : null}

        {revealed ? (
          <div className="flex flex-col gap-3">
            {q.description ? (
              <div className="rounded-md border border-border bg-bg px-4 py-3 text-sm leading-relaxed text-muted">
                <span className="font-medium text-subtle">Why this matters: </span>
                {q.description}
              </div>
            ) : null}
            <div className="rounded-md border border-correct/40 bg-correct-bg px-4 py-3 text-sm leading-relaxed text-fg">
              <p className="mb-1 font-medium">Sample answer</p>
              <p className="text-fg/90">{q.solution}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-md border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
              Answer hidden — draft your response out loud first
            </div>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg transition-transform duration-150 active:scale-[0.98]"
            >
              <Eye className="size-4" />
              Show sample answer
            </button>
          </div>
        )}
      </div>

      {revealed ? (
        <button
          type="button"
          onClick={() => {
            setRevealed(false);
            if (isLast) setFinished(true);
            else setIndex((i) => i + 1);
          }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg transition-transform duration-150 active:scale-[0.98]"
        >
          {isLast ? "Finish" : "Next question"}
          <ChevronRight className="size-4" />
        </button>
      ) : (
        <p className="text-center text-sm text-subtle">Plan your answer, then reveal the sample</p>
      )}

      {revealed ? (
        <button
          type="button"
          onClick={() => {
            setRevealed(false);
            setFinished(true);
          }}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-medium text-fg"
        >
          <Check className="size-4" />
          Mark reviewed &amp; skip ahead
        </button>
      ) : null}
    </div>
  );
}
