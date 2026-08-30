import { useMemo } from "react";
import { useInterview, useTracking } from "@/lib/interview-store";
import { todayPlan, DAILY_GOAL, weekTopic } from "@/lib/english-plan";
import { TOPIC_LABELS, formatDuration } from "@/lib/english-data";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import { Play, CheckCircle2, Circle, ChevronRight } from "lucide-react";

export function EnglishToday() {
  const back = useInterview((s) => s.back);
  const selectedDay = useInterview((s) => s.selectedDay);
  const setEnglishScreen = useInterview((s) => s.setEnglishScreen);
  const setSelectedTopic = useInterview((s) => s.setSelectedTopic);
  const setSelectedDay = useInterview((s) => s.setSelectedDay);
  const seenVideos = useTracking((s) => s.seenVideos);
  const completedVideos = useTracking((s) => s.completedVideos);
  const toggleVideoSeen = useTracking((s) => s.toggleVideoSeen);

  const day = useMemo(() => todayPlan(selectedDay ?? 0), [selectedDay]);
  const topicLabel = TOPIC_LABELS[weekTopic(day.week)] ?? weekTopic(day.week);

  const watchedCount = day.videos.filter(
    (v) => !!seenVideos[String(v.id)] || !!completedVideos[String(v.id)],
  ).length;
  const goalMet = watchedCount >= DAILY_GOAL;

  const goVideo = () => {
    setSelectedDay(day.dateOffset);
    setSelectedTopic(undefined);
    setEnglishScreen("playlist");
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="Today's watch" />

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm tracking-wide text-accent uppercase">
              Week {day.week + 1} · Day {day.dayOfWeek + 1}
            </p>
            <h2 className="text-xl font-semibold text-fg">{day.title}</h2>
            <p className="text-sm text-muted">{topicLabel}</p>
          </div>
          <span className="font-mono text-sm tabular-nums text-muted">
            {watchedCount}/{day.videos.length} watched
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full bg-accent transition-[width]"
            style={{
              width: `${day.videos.length ? (watchedCount / day.videos.length) * 100 : 0}%`,
            }}
          />
        </div>
      </section>

      <section
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border p-4",
          goalMet ? "border-correct/50 bg-correct-bg" : "border-accent/40 bg-accent/5",
        )}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-fg">
          <CheckCircle2 className={cn("size-4", goalMet ? "text-correct" : "text-accent")} />
          Daily goal
        </div>
        <span className="font-mono text-sm tabular-nums">
          {watchedCount}/{DAILY_GOAL} {goalMet ? "· reached 🎉" : ""}
        </span>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Play className="size-4" />
          Watch list · {day.videos.length}
        </div>
        {day.videos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
            No standalone lessons for this topic — try the topic playlist instead.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {day.videos.map((v) => {
              const watched = !!seenVideos[String(v.id)] || !!completedVideos[String(v.id)];
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
                    onClick={() => setEnglishScreen("playlist")}
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
                  <button
                    type="button"
                    onClick={() => setEnglishScreen("playlist")}
                    className="flex items-center gap-1 text-xs font-medium text-accent"
                  >
                    Watch <ChevronRight className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={goVideo}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-medium text-fg transition-colors hover:bg-elevated"
      >
        <Play className="size-4 text-accent" /> Open week playlist
      </button>

      <p className="text-center text-xs text-subtle">
        {watchedCount}/{day.videos.length} watched · tap ✓ when you finish a lesson
      </p>
    </div>
  );
}
