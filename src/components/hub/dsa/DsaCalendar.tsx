import { useMemo, useState } from "react";
import { useInterview, useTracking } from "@/lib/interview-store";
import { TOTAL_WEEKS, problemsForWeek, weekLabel } from "@/lib/dsa-plan";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DsaCalendar() {
  const back = useInterview((s) => s.back);
  const setDsaScreen = useInterview((s) => s.setDsaScreen);
  const setSelectedDay = useInterview((s) => s.setSelectedDay);
  const completedProblems = useTracking((s) => s.completedProblems);

  const [week, setWeek] = useState(0);
  const days = useMemo(() => {
    const problems = problemsForWeek(week);
    const perDay = Math.ceil(problems.length / 7);
    return Array.from({ length: 7 }, (_, d) => {
      const dayProblems = problems.slice(d * perDay, (d + 1) * perDay);
      const done = dayProblems.filter((p) => completedProblems[String(p.id)]).length;
      return { d, count: dayProblems.length, done, dayOffset: week * 7 + d };
    });
  }, [week, completedProblems]);

  const weekDone = days.reduce((a, x) => a + x.done, 0);
  const weekTotal = problemsForWeek(week).length;

  const goToDay = (d: number) => {
    setSelectedDay(week * 7 + d);
    setDsaScreen("today");
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <HubBackButton onBack={back} label="Tracking calendar" />
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <button
            type="button"
            disabled={week === 0}
            onClick={() => setWeek((w) => Math.max(0, w - 1))}
            className="flex size-8 items-center justify-center rounded-md text-muted disabled:opacity-40"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-24 text-center font-mono text-sm tabular-nums">
            Week {week + 1}/{TOTAL_WEEKS}
          </span>
          <button
            type="button"
            disabled={week >= TOTAL_WEEKS - 1}
            onClick={() => setWeek((w) => Math.min(TOTAL_WEEKS - 1, w + 1))}
            className="flex size-8 items-center justify-center rounded-md text-muted disabled:opacity-40"
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">{weekLabel(week)}</h2>
          <span className="font-mono text-sm tabular-nums text-muted">
            {weekDone}/{weekTotal}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full bg-accent transition-[width]"
            style={{ width: `${weekTotal ? (weekDone / weekTotal) * 100 : 0}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2">
          {DAY_NAMES.map((n) => (
            <div key={n} className="pb-1 text-center text-[10px] tracking-wide text-subtle uppercase">
              {n}
            </div>
          ))}
          {days.map((day) => {
            const complete = day.count > 0 && day.done === day.count;
            const partial = day.done > 0 && day.done < day.count;
            return (
              <button
                key={day.d}
                type="button"
                onClick={() => goToDay(day.d)}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border p-1 transition-colors",
                  complete
                    ? "border-accent bg-accent text-accent-fg"
                    : partial
                      ? "border-accent/50 bg-accent/10 text-fg"
                      : "border-border bg-bg text-fg hover:bg-elevated",
                )}
              >
                <span className="font-mono text-xs tabular-nums">{day.d + 1}</span>
                {day.count > 0 ? (
                  <span className="text-[10px] opacity-80">
                    {day.done}/{day.count}
                  </span>
                ) : (
                  <span className="text-[10px] opacity-40">-</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-center text-xs text-subtle">
        Tap a day to open its plan · videos and problems together
      </p>
    </div>
  );
}
