import { useMemo, useState } from "react";
import { SMM_QUESTIONS } from "@/data/smm-questions";
import { useInterview } from "@/lib/interview-store";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Eye, RotateCcw } from "lucide-react";

export function SmmScreen() {
  const back = useInterview((s) => s.back);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [filter, setFilter] = useState<"all" | "short" | "long">("all");

  const list = useMemo(
    () => SMM_QUESTIONS.filter((q) => filter === "all" || q.kind === filter),
    [filter],
  );

  const q = list[index];

  const reset = () => {
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  };

  if (!list.length) {
    return (
      <div className="mx-auto flex w-full max-w-3xl gap-6 px-4 py-6 sm:py-10">
        <HubBackButton onBack={back} label="Social Media Manager" />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:py-12">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">Complete</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            All {SMM_QUESTIONS.length} questions reviewed
          </h1>
          <p className="text-base text-muted">
            {SMM_QUESTIONS.filter((x) => x.kind === "short").length} short ·{" "}
            {SMM_QUESTIONS.filter((x) => x.kind === "long").length} long
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

  const total = list.length;
  const progress = ((index + (revealed ? 1 : 0)) / total) * 100;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="Social Media Manager" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(["all", "short", "long"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setIndex(0);
                setRevealed(false);
                setFinished(false);
              }}
              className={cn(
                "min-h-9 rounded-md px-3 text-xs font-medium capitalize",
                filter === f ? "bg-elevated text-fg" : "text-muted",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="font-mono tabular-nums text-muted">
          {index + 1} / {total}
          <span className="mx-2 text-border">·</span>
          <span className="capitalize">{q.kind}</span>
        </span>
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

        {revealed ? (
          <div className="rounded-md border border-correct/40 bg-correct-bg px-4 py-3 text-sm leading-relaxed text-fg">
            <p className="mb-1 font-medium">Answer</p>
            <p className="text-fg/90">{q.answer}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-md border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
              {q.kind === "long"
                ? "Answer hidden — write out a full response first"
                : "Answer hidden — try to recall it first"}
            </div>
            <button
              type="button"
              onClick={() => setRevealed(true)}
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
          onClick={() => {
            setRevealed(false);
            if (index + 1 >= total) setFinished(true);
            else setIndex((i) => i + 1);
          }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg transition-transform duration-150 active:scale-[0.98]"
        >
          {index + 1 >= total ? "Finish" : "Next question"}
          <ChevronRight className="size-4" />
        </button>
      ) : (
        <p className="text-center text-sm text-subtle">
          {q.kind === "long" ? "Draft your answer, then tap Show" : "Think of the answer, then tap Show"}
        </p>
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
