import { useMemo } from "react";
import { useInterview } from "@/lib/interview-store";
import { usePlanner } from "@/lib/planner/state";
import { dateIso } from "@/lib/planner/engine";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronRight } from "lucide-react";
import { HubBackButton } from "../hub/HubBackButton";

export function PlannerCalendar() {
  const back = useInterview((s) => s.back);
  const setPlannerScreen = useInterview((s) => s.setPlannerScreen);
  const setDate = usePlanner((s) => s.setDate);
  const engine = usePlanner((s) => s.engine);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const iso = dateIso(i - 1);
        const d = new Date(iso + "T12:00:00");
        const rel = i === 1 ? "Today" : i === 0 ? "Yesterday" : i === 2 ? "Tomorrow" : "";
        const label = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
        const plan = engine?.plans[iso];
        const blocks = plan?.blocks ?? [];
        const done = blocks.filter((b) => b.status === "done").length;
        const carried = blocks.filter((b) => b.status === "carried").length;
        const open = blocks.filter((b) => b.status !== "done" && b.status !== "skipped").length;
        return { iso, label, rel, blocks, done, carried, open };
      }),
    [engine],
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="Week at a glance" />

      <section className="flex flex-col gap-2">
        {days.map((day) => {
          const isToday = day.rel === "Today";
          return (
            <button
              key={day.iso}
              type="button"
              onClick={() => {
                setDate(day.iso);
                setPlannerScreen("day");
              }}
              className={cn(
                "flex min-h-14 items-center justify-between gap-3 rounded-xl border bg-surface px-5 py-3 text-left transition-colors hover:bg-elevated",
                isToday ? "border-accent" : "border-border",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    isToday ? "bg-accent text-accent-fg" : "bg-bg text-accent",
                  )}
                >
                  <CalendarDays className="size-4.5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-fg">{day.label}</span>
                    {day.rel ? (
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px]",
                          isToday ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-bg text-subtle",
                        )}
                      >
                        {day.rel}
                      </span>
                    ) : null}
                  </span>
                  <span className="block font-mono text-xs tabular-nums text-muted">
                    {day.blocks.length === 0
                      ? "no plan"
                      : `${day.blocks.length} blocks · ${day.done} done · ${day.open} open`}
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-2">
                {day.carried > 0 ? (
                  <span className="rounded-full border border-amber-700/50 bg-amber-900/20 px-2 py-0.5 font-mono text-[10px] tabular-nums text-amber-400">
                    {day.carried} carried
                  </span>
                ) : null}
                <ChevronRight className="size-4 shrink-0 text-muted" />
              </span>
            </button>
          );
        })}
      </section>

      <p className="text-center text-xs text-subtle">
        Carried work flows from yesterday into today automatically when the day replans.
      </p>
    </div>
  );
}