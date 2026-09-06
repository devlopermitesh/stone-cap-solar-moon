import { useMemo } from "react";
import { useTracking } from "@/lib/interview-store";
import { todayOffset } from "@/lib/curriculum";
import type { TrackApi, TrackConfig } from "./types";
import { HubBackButton } from "../HubBackButton";
import { CheckCircle2, ListChecks } from "lucide-react";
import { QuestionCard } from "./QuestionCard";

export function CurrToday({ config, api }: { config: TrackConfig; api: TrackApi }) {
  const back = api.back;
  const completedProblems = useTracking((s) => s.completedProblems);

  const day = useMemo(
    () => config.curriculum.todayPlan(api.selectedDay ?? todayOffset()),
    [config, api.selectedDay],
  );

  const todayDone = day.questions.filter(
    (q) => !!completedProblems[config.completionKey(q.id)],
  ).length;
  const weekTotal = config.curriculum.questionsForWeek(day.week).length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton
        onBack={back}
        label={`${config.backLabel} · Today`}
      />
      <p className="text-sm text-muted">
        Week {day.week + 1} of {config.curriculum.TOTAL_WEEKS} · {weekTotal} questions this week
      </p>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm tracking-wide text-accent uppercase">
              Week {day.week + 1} · Day {day.dayOfWeek + 1}
            </p>
            <h2 className="text-xl font-semibold text-fg">{day.title}</h2>
          </div>
          <span className="font-mono text-sm tabular-nums text-muted">
            {todayDone}/{day.questions.length} questions
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full bg-accent transition-[width]"
            style={{
              width: `${day.questions.length ? (todayDone / day.questions.length) * 100 : 0}%`,
            }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <ListChecks className="size-4" /> Today's questions
        </div>
        <div className="flex flex-col gap-2">
          {day.questions.map((q) => (
            <QuestionCard key={q.id} q={q} completionKey={config.completionKey} />
          ))}
          {day.questions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
              Nothing scheduled for this day yet.
            </p>
          ) : null}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => api.setScreen("calendar")}
          className="flex items-center gap-1 text-xs font-medium text-accent"
        >
          Tracking calendar
        </button>
        <button
          type="button"
          onClick={() => api.setScreen("questions")}
          className="flex items-center gap-1 text-xs font-medium text-accent"
        >
          All questions
        </button>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-subtle">
        <CheckCircle2 className="size-3.5" />
        {todayDone}/{day.questions.length} done · tap ✓ to mark a question complete
      </p>
    </div>
  );
}