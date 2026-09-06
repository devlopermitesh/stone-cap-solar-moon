import { useMemo } from "react";
import { useTracking } from "@/lib/interview-store";
import { todayOffset } from "@/lib/curriculum";
import type { TrackApi, TrackConfig } from "./types";
import { HubBackButton } from "../HubBackButton";
import {
  CalendarDays,
  CalendarDays as CalIcon,
  CheckCircle2,
  Flame,
  GraduationCap,
  ListChecks,
  Play,
  Target,
} from "lucide-react";

export function CurrHome({ config, api }: { config: TrackConfig; api: TrackApi }) {
  const completedProblems = useTracking((s) => s.completedProblems);

  const today = useMemo(() => config.curriculum.todayPlan(todayOffset()), [config]);
  const total = config.curriculum.allQuestions.length;
  const keys = new Set(Object.keys(completedProblems));
  const done = config.curriculum.allQuestions.filter((q) =>
    keys.has(config.completionKey(q.id)),
  ).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const levelRows = config.curriculum.levels.map((lvl) => {
    const all = lvl.questions.length;
    const d = lvl.questions.filter((q) => keys.has(config.completionKey(q.id))).length;
    return { level: lvl, all, d, p: all ? Math.round((d / all) * 100) : 0 };
  });

  const todayDone = today.questions.filter((q) => keys.has(config.completionKey(q.id))).length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <HubBackButton onBack={api.back} label={config.backLabel} />
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted">
          <CalendarDays className="size-4 text-accent" />
          {config.curriculum.TOTAL_WEEKS} weeks
        </span>
      </div>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-fg">
              <Target className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted">Total progress</p>
              <p className="font-mono text-2xl font-semibold tabular-nums">
                {done}
                <span className="text-base text-muted"> / {total}</span>{" "}
                <span className="text-accent">· {pct}%</span>
              </p>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-elevated sm:w-48">
            <div className="h-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Flame className="size-5" />}
          label="Today's questions"
          value={`${today.questions.length}`}
        />
        <StatCard
          icon={<CheckCircle2 className="size-5" />}
          label="Today completed"
          value={`${todayDone}/${today.questions.length}`}
        />
        <StatCard
          icon={<GraduationCap className="size-5" />}
          label="Levels"
          value={`${config.curriculum.levels.length}`}
        />
      </section>

      <button
        type="button"
        onClick={() => {
          api.setSelectedDay(today.dateOffset);
          api.setScreen("today");
        }}
        className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors hover:bg-elevated"
      >
        <span className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-bg text-accent">
            <Play className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold text-fg">Go to today's plan</span>
            <span className="block text-sm text-muted">
              Week {today.week + 1} · {today.title} · {today.questions.length} questions
            </span>
          </span>
        </span>
      </button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NavCard
          icon={<CalendarDays className="size-5" />}
          title="Tracking calendar"
          subtitle="Weekly day-by-day track"
          onClick={() => api.setScreen("calendar")}
        />
        <NavCard
          icon={<ListChecks className="size-5" />}
          title="All questions"
          subtitle={`${config.curriculum.allQuestions.length} questions across all levels`}
          onClick={() => api.setScreen("questions")}
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">By level</h2>
        <div className="flex flex-col gap-2">
          {levelRows.map((r) => (
            <button
              key={r.level.level}
              type="button"
              onClick={() => api.setScreen("questions")}
              className="rounded-lg border border-border bg-surface px-4 py-3 text-left transition-colors hover:bg-elevated"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-fg">{r.level.title}</span>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {r.d}/{r.all}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
                  <div className="h-full bg-accent" style={{ width: `${r.p}%` }} />
                </div>
                <span className="font-mono text-xs tabular-nums text-muted">{r.p}%</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <CalIcon className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <h2 className="text-base font-semibold text-fg">{config.prepPlan.title}</h2>
            <p className="mt-0.5 text-sm leading-relaxed text-muted">{config.prepPlan.goal}</p>
            <p className="mt-2 text-xs text-subtle">
              30-day structured prep · {config.prepPlan.weeks.length} phases
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <span className="flex size-8 items-center justify-center rounded-lg bg-bg text-accent">
        {icon}
      </span>
      <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-fg">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function NavCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors hover:bg-elevated"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-bg text-accent">
          {icon}
        </span>
        <span>
          <span className="block text-base font-semibold text-fg">{title}</span>
          <span className="block text-sm text-muted">{subtitle}</span>
        </span>
      </span>
    </button>
  );
}