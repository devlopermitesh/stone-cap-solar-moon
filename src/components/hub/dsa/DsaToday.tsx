import { useMemo } from "react";
import { useInterview, useTracking } from "@/lib/interview-store";
import { todayPlan } from "@/lib/dsa-plan";
import { videosForWeekWeek } from "@/lib/dsa-plan";
import { formatDuration, TOPIC_LABELS } from "@/lib/dsa-data";
import { HubBackButton } from "../HubBackButton";
import {
  Play,
  CheckCircle2,
  ChevronRight,
  Circle,
  ListChecks,
  Clock,
} from "lucide-react";

export function DsaToday() {
  const back = useInterview((s) => s.back);
  const selectedDay = useInterview((s) => s.selectedDay);
  const setDsaScreen = useInterview((s) => s.setDsaScreen);
  const setSelectedTopic = useInterview((s) => s.setSelectedTopic);
  const selectedTopic = useInterview((s) => s.selectedTopic);
  const completedProblems = useTracking((s) => s.completedProblems);
  const seenVideos = useTracking((s) => s.seenVideos);
  const toggleVideoSeen = useTracking((s) => s.toggleVideoSeen);

  const day = useMemo(() => todayPlan(selectedDay ?? 0), [selectedDay]);
  const videos = useMemo(() => videosForWeekWeek(day.week), [day.week]);

  const planProblems = day.problems;
  const todayDone = planProblems.filter((p) => completedProblems[String(p.id)]).length;

  const goVideo = (id: string) => {
    setSelectedTopic(undefined);
    const target = videos.find((v) => v.id === id);
    if (target) {
      setSelectedTopic(target.topic);
      setDsaScreen("video");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton
        onBack={back}
        label={selectedTopic ? `${TOPIC_LABELS[selectedTopic] ?? selectedTopic} · ${day.week + 1}` : `Today's plan`}
      />

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm tracking-wide text-accent uppercase">
              Week {day.week + 1} · Day {day.dayOfWeek + 1}
            </p>
            <h2 className="text-xl font-semibold text-fg">{day.title}</h2>
          </div>
          <span className="font-mono text-sm tabular-nums text-muted">
            {todayDone}/{planProblems.length} problems
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full bg-accent transition-[width]"
            style={{
              width: `${planProblems.length ? (todayDone / planProblems.length) * 100 : 0}%`,
            }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Play className="size-4" />
          Videos · {videos.length}
        </div>
        <div className="flex flex-col gap-2">
          {videos.map((v) => {
            const watched = !!seenVideos[v.id];
            const topicLabel = v.topic ? TOPIC_LABELS[v.topic] ?? v.topic : "DSA";
            return (
              <div
                key={v.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => toggleVideoSeen(v.id, v.url)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg text-muted transition-colors hover:bg-elevated"
                  aria-label="Toggle watched"
                >
                  {watched ? (
                    <CheckCircle2 className="size-5 text-correct" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => goVideo(v.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg">
                    <Play className="size-4 text-accent" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{v.title}</span>
                    <span className="block text-xs text-muted">
                      {topicLabel} · {formatDuration(v.duration)}
                      {v.isPractice ? " · practice" : " · concept"}
                    </span>
                  </span>
                </button>
                <ChevronRight className="size-4 shrink-0 text-muted" />
              </div>
            );
          })}
          {videos.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
              No videos tagged for this topic yet.
            </p>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <ListChecks className="size-4" />
            Problems · {planProblems.length}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic(undefined);
              setDsaScreen("problems");
            }}
            className="flex items-center gap-1 text-xs font-medium text-accent"
          >
            All problems <ChevronRight className="size-3.5" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {planProblems.map((p) => {
            const done = !!completedProblems[String(p.id)];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedTopic(p.topic);
                  setDsaScreen("problems");
                }}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:bg-elevated"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg text-muted">
                  {done ? (
                    <CheckCircle2 className="size-5 text-correct" />
                  ) : (
                    <span className="font-mono text-xs">{p.id}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">
                    {p.problem_name}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted">
                    <span className="capitalize">{TOPIC_LABELS[p.topic] ?? p.topic}</span>
                    <span>·</span>
                    <span className="capitalize">{p.difficulty}</span>
                    {p.pattern ? <span>· {p.pattern}</span> : null}
                  </span>
                </span>
                <span className="flex items-center gap-1 font-mono text-xs tabular-nums text-muted">
                  <Clock className="size-3" />
                  {Math.round(p.timerSeconds / 60)}m
                </span>
              </button>
            );
          })}
          {planProblems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
              Nothing scheduled for this day yet.
            </p>
          ) : null}
        </div>
      </section>

      <p className="text-center text-xs text-subtle">
        {todayDone}/{planProblems.length} done · tap ✓ to mark a problem complete
      </p>
    </div>
  );
}
