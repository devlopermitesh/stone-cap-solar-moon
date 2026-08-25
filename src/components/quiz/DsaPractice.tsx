import { useState } from "react";
import { DSA_LEVELS, PREP_PLAN, type DsaQuestion } from "@/data/dsa-questions";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronDown, ChevronRight, Lightbulb, CalendarDays } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  "Very Easy": "text-correct",
  Easy: "text-accent",
  "Easy-Medium": "text-amber-400",
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-border px-2.5 py-0.5 text-xs font-medium",
        DIFFICULTY_COLORS[difficulty] ?? "text-muted",
      )}
    >
      {difficulty}
    </span>
  );
}

function ProblemCard({ q }: { q: DsaQuestion }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-bg font-mono text-xs font-medium text-muted">
          {q.id}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug font-medium text-fg">{q.question}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={q.difficulty} />
            <span className="rounded-full bg-elevated px-2.5 py-0.5 text-xs text-subtle">
              {q.topicPattern}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 size-4 shrink-0 text-muted transition-transform duration-150",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded ? (
        <div className="flex flex-col gap-3 border-t border-border px-4 pb-4 pt-3">
          <DetailRow label="What the interviewer is testing">{q.whatInterviewerTests}</DetailRow>
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

export function DsaPractice({ onBack }: { onBack: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showPlan, setShowPlan] = useState(false);

  if (selectedLevel !== null) {
    const level = DSA_LEVELS[selectedLevel];
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedLevel(null)}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-elevated"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium tracking-wide text-accent uppercase">
              Level {level.level}
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-fg">{level.title}</h1>
          </div>
          <span className="font-mono text-xs tabular-nums text-muted">
            {level.questions.length} problems
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {level.questions.map((q) => (
            <ProblemCard key={q.id} q={q} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:py-14">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-elevated"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div>
          <p className="text-sm font-medium tracking-wide text-accent uppercase">DSA Practice</p>
          <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">50 Problems</h1>
          <p className="text-base text-muted">5 levels · 10 problems each · 30-day prep plan</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {DSA_LEVELS.map((level) => (
          <button
            key={level.level}
            type="button"
            onClick={() => setSelectedLevel(level.level - 1)}
            className="flex min-h-14 items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors duration-150 hover:bg-elevated"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-bg font-mono text-sm font-semibold text-fg">
                {level.level}
              </span>
              <span>
                <span className="block text-base font-medium text-fg">{level.title}</span>
                <span className="block text-sm text-muted">{level.questions.length} problems</span>
              </span>
            </span>
            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty={level.difficulty} />
              <ChevronRight className="size-4 text-muted" />
            </div>
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowPlan(!showPlan)}
          className="flex items-center gap-2 text-sm font-medium text-muted"
        >
          <CalendarDays className="size-4" />
          30-Day Preparation Plan
          <ChevronDown
            className={cn("size-4 transition-transform duration-150", showPlan && "rotate-180")}
          />
        </button>

        {showPlan ? (
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
            <div>
              <h3 className="text-sm font-medium text-fg">{PREP_PLAN.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{PREP_PLAN.goal}</p>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold tracking-wide text-subtle uppercase">
                Daily Routine (60–90 min)
              </h4>
              <ol className="flex list-inside flex-col gap-1">
                {PREP_PLAN.dailyRoutine.map((step, i) => (
                  <li key={i} className="text-sm leading-relaxed text-fg/80">
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>

            {PREP_PLAN.weeks.map((week) => (
              <div key={week.week}>
                <h4 className="mb-2 text-xs font-semibold tracking-wide text-subtle uppercase">
                  Week {week.week} — {week.title}
                </h4>
                <ul className="flex flex-col gap-1">
                  {week.days.map((day, i) => (
                    <li key={i} className="text-sm leading-relaxed text-fg/80">
                      {day}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="mb-2 text-xs font-semibold tracking-wide text-subtle uppercase">
                Ongoing Rules
              </h4>
              <ul className="flex flex-col gap-1">
                {PREP_PLAN.ongoingRules.map((rule, i) => (
                  <li key={i} className="text-sm leading-relaxed text-fg/80">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
