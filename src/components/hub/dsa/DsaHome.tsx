import { useMemo } from "react";
import { useInterview, useTracking } from "@/lib/interview-store";
import {
  DSA_ROADMAP,
  ROADMAP_TOPICS,
  TOPIC_LABELS,
} from "@/lib/dsa-data";
import { todayPlan, todayOffset, TOTAL_WEEKS } from "@/lib/dsa-plan";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  GraduationCap,
  Play,
  ListChecks,
  Target,
} from "lucide-react";

export function DsaHome() {
  const back = useInterview((s) => s.back);
  const setDsaScreen = useInterview((s) => s.setDsaScreen);
  const setSelectedDay = useInterview((s) => s.setSelectedDay);
  const setSelectedTopic = useInterview((s) => s.setSelectedTopic);
  const completedProblems = useTracking((s) => s.completedProblems);
  const reminder = useTracking((s) => s.reminder);
  const setReminder = useTracking((s) => s.setReminder);

  const today = useMemo(() => todayPlan(todayOffset()), []);
  const total = DSA_ROADMAP.length;
  const done = Object.keys(completedProblems).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const topicRows = ROADMAP_TOPICS.map((t) => {
    const all = DSA_ROADMAP.filter((p) => p.topic === t).length;
    const d = DSA_ROADMAP.filter((p) => p.topic === t && completedProblems[String(p.id)])
      .length;
    return { topic: t, label: TOPIC_LABELS[t] ?? t, all, d, p: all ? Math.round((d / all) * 100) : 0 };
  });

  const todayDone = today.problems.filter((p) => completedProblems[String(p.id)]).length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <HubBackButton onBack={back} label="DSA Roadmap" />
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted">
          <CalendarDays className="size-4 text-accent" />
          {TOTAL_WEEKS} weeks
        </span>
      </div>
      {/* root = activeBag dsa, back goes to bag selection */}

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
        <StatCard icon={<Flame className="size-5" />} label="Today's problems" value={`${today.problems.length}`} />
        <StatCard
          icon={<CheckCircle2 className="size-5" />}
          label="Today completed"
          value={`${todayDone}/${today.problems.length}`}
        />
        <StatCard icon={<GraduationCap className="size-5" />} label="Topics" value={`${ROADMAP_TOPICS.length}`} />
      </section>

      <button
        type="button"
        onClick={() => {
          setSelectedDay(today.dateOffset);
          setDsaScreen("today");
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
              Week {today.week + 1} · {today.title} · {today.problems.length} problems
            </span>
          </span>
        </span>
      </button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NavCard
          icon={<CalendarDays className="size-5" />}
          title="Tracking calendar"
          subtitle="Weekly day-by-day track"
          onClick={() => setDsaScreen("calendar")}
        />
        <NavCard
          icon={<ListChecks className="size-5" />}
          title="All problems"
          subtitle="LeetCode-style with timers"
          onClick={() => { setSelectedTopic(undefined); setDsaScreen("problems"); }}
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">By topic</h2>
        <div className="flex flex-col gap-2">
          {topicRows.map((r) => (
            <button
              key={r.topic}
              type="button"
              onClick={() => { setSelectedTopic(r.topic); setDsaScreen("problems"); }}
              className="rounded-lg border border-border bg-surface px-4 py-3 text-left transition-colors hover:bg-elevated"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-fg">{r.label}</span>
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

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Clock className="size-4" />
          Daily reminder
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input
              type="time"
              value={reminder.time}
              onChange={(e) => setReminder({ ...reminder, time: e.target.value })}
              className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-fg focus:border-accent focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setReminder({ ...reminder, enabled: !reminder.enabled })}
            className={cn(
              "flex min-h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
              reminder.enabled
                ? "border-accent bg-accent text-accent-fg"
                : "border-border bg-bg text-muted",
            )}
          >
            {reminder.enabled ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
            {reminder.enabled ? "Reminder on" : "Reminder off"}
          </button>
        </div>
        <p className="text-xs text-subtle">
          {reminder.enabled
            ? `A daily nudge is set for ${reminder.time}.`
            : "Turn on to get a daily practice nudge at your chosen time."}
        </p>
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
