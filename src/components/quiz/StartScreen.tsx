import { QUESTIONS } from "@/data/questions";
import { TOPICS, useQuiz } from "@/lib/quiz-store";
import { ArrowRight, BookOpen, ListChecks } from "lucide-react";

const TOPIC_COUNTS = TOPICS.filter((t) => t !== "all").map((topic) => ({
  topic,
  count: QUESTIONS.filter((q) => q.topic === topic).length,
}));

export function StartScreen() {
  const start = useQuiz((s) => s.start);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">
          NetTech interview prep
        </p>
        <h1 className="font-sans text-3xl leading-tight font-semibold tracking-tight text-fg sm:text-4xl">
          Frontend CBT
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          150 multiple-choice questions. Pick an answer — wrong choices turn
          red, the correct option turns green. Review every item at the end.
        </p>
      </header>

      <button
        type="button"
        onClick={() => start("all")}
        className="flex min-h-12 items-center justify-between gap-4 rounded-xl bg-fg px-5 py-4 text-left text-accent-fg transition-transform duration-150 hover:opacity-95 active:scale-[0.98]"
      >
        <span className="flex items-center gap-3">
          <ListChecks className="size-5" strokeWidth={1.75} />
          <span>
            <span className="block text-base font-semibold">Full test · 150 questions</span>
            <span className="block text-sm opacity-70">All topics, one sitting</span>
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0" />
      </button>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <BookOpen className="size-4" />
          Practice by topic
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TOPIC_COUNTS.map(({ topic, count }) => (
            <button
              key={topic}
              type="button"
              onClick={() => start(topic)}
              className="flex min-h-12 items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left transition-colors duration-150 hover:bg-elevated"
            >
              <span className="text-sm font-medium text-fg">{topic}</span>
              <span className="font-mono text-xs tabular-nums text-muted">{count}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
