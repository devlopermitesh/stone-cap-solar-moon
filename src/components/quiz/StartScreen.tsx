import { useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { SHORT_QUESTIONS } from "@/data/short-questions";
import { TOPICS, useQuiz } from "@/lib/quiz-store";
import { useInterview } from "@/lib/interview-store";
import { DsaPractice } from "./DsaPractice";
import { ArrowRight, Code, ListChecks, MessageSquareQuote, ChevronLeft } from "lucide-react";

const TOPIC_COUNTS = TOPICS.filter((t) => t !== "all").map((topic) => ({
  topic,
  count: QUESTIONS.filter((q) => q.topic === topic).length,
}));

export function StartScreen() {
  const start = useQuiz((s) => s.start);
  const startShort = useQuiz((s) => s.startShort);
  const reset = useQuiz((s) => s.restart);
  const goBackToHub = useInterview((s) => s.reset);
  const [activeView, setActiveView] = useState<"start" | "dsa">("start");

  if (activeView === "dsa") {
    return <DsaPractice onBack={() => setActiveView("start")} />;
  }

  const backToHub = () => {
    reset();
    goBackToHub();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:py-14">
      <button
        type="button"
        onClick={backToHub}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
      >
        <ChevronLeft className="size-4" />
        Back to tracks
      </button>

      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">
          NetTech interview prep
        </p>
        <h1 className="font-sans text-3xl leading-tight font-semibold tracking-tight text-fg sm:text-4xl">
          Frontend CBT
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          {QUESTIONS.length} multiple-choice questions, {SHORT_QUESTIONS.length} short-answer recall
          questions, and 50 DSA practice problems.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <ListChecks className="size-4" />
          MCQ questions
        </div>

        <button
          type="button"
          onClick={() => start("all")}
          className="flex min-h-12 items-center justify-between gap-4 rounded-xl bg-fg px-5 py-4 text-left text-accent-fg transition-transform duration-150 hover:opacity-95 active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <ListChecks className="size-5" strokeWidth={1.75} />
            <span>
              <span className="block text-base font-semibold">
                Full test · {QUESTIONS.length} questions
              </span>
              <span className="block text-sm opacity-70">All topics, one sitting</span>
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0" />
        </button>

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

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <MessageSquareQuote className="size-4" />
          Short answers
        </div>

        <button
          type="button"
          onClick={() => startShort("all")}
          className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors duration-150 hover:bg-elevated active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <MessageSquareQuote className="size-5 shrink-0 text-accent" strokeWidth={1.75} />
            <span>
              <span className="block text-base font-medium text-fg">
                Short answers · {SHORT_QUESTIONS.length} questions
              </span>
              <span className="block text-sm text-muted">Read, recall, reveal</span>
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-muted" />
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Code className="size-4" />
          DSA Practice
        </div>

        <button
          type="button"
          onClick={() => setActiveView("dsa")}
          className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors duration-150 hover:bg-elevated active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <Code className="size-5 shrink-0 text-accent" strokeWidth={1.75} />
            <span>
              <span className="block text-base font-medium text-fg">
                DSA Practice · 50 problems
              </span>
              <span className="block text-sm text-muted">5 levels, 30-day prep plan</span>
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-muted" />
        </button>
      </section>
    </div>
  );
}
