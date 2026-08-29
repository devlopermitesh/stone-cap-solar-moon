import { useMemo, useState } from "react";
import { useInterview, useTracking } from "@/lib/interview-store";
import { videosForWeekWeek } from "@/lib/dsa-plan";
import { TOPIC_LABELS, formatDuration } from "@/lib/dsa-data";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Play,
  ChevronLeft,
  ChevronRight,
  ListVideo,
} from "lucide-react";

export function VideoPlayer({ week }: { week: number }) {
  const back = useInterview((s) => s.back);
  const completedVideos = useTracking((s) => s.completedVideos);
  const seenVideos = useTracking((s) => s.seenVideos);
  const toggleVideoComplete = useTracking((s) => s.toggleVideoComplete);

  const videos = useMemo(() => videosForWeekWeek(week), [week]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const active = videos[currentIndex];
  if (!active) {
    return (
      <div className="mx-auto flex w-full max-w-3xl gap-6 px-4 py-6 sm:py-10">
        <HubBackButton onBack={back} label="Playlist" />
        <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
          No videos tagged for this topic yet.
        </p>
      </div>
    );
  }

  const completedCount = videos.filter((v) => completedVideos[v.id]).length;
  const allDone = videos.length > 0 && completedCount === videos.length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="Video playlist" />

      <div className="overflow-hidden rounded-2xl border border-border bg-black">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube.com/embed/${active.id}`}
          title={active.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg leading-snug font-semibold text-fg">{active.title}</h2>
          <button
            type="button"
            onClick={() => toggleVideoComplete(active.id, active.url)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              completedVideos[active.id]
                ? "border-correct/50 bg-correct-bg text-correct"
                : "border-border bg-surface text-muted hover:bg-elevated",
            )}
          >
            {completedVideos[active.id] ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Circle className="size-4" />
            )}
            {completedVideos[active.id] ? "Completed" : "Mark complete"}
          </button>
        </div>

        <p className="text-sm text-muted">
          {active.topic ? TOPIC_LABELS[active.topic] ?? active.topic : "DSA"} ·{" "}
          {formatDuration(active.duration)} ·{" "}
          {active.view_count ? `${Math.round(active.view_count / 1000)}k views` : ""} ·
          {active.isPractice ? " practice" : " concept"}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-fg disabled:opacity-40"
          >
            <ChevronLeft className="size-4" /> Prev
          </button>
          <button
            type="button"
            disabled={currentIndex >= videos.length - 1}
            onClick={() => setCurrentIndex((i) => Math.min(videos.length - 1, i + 1))}
            className="flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-fg disabled:opacity-40"
          >
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <ListVideo className="size-4" />
            Playlist
          </div>
          <span className="font-mono text-xs tabular-nums text-muted">
            {completedCount}/{videos.length}
          </span>
        </div>
        {allDone ? (
          <div className="rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm font-medium text-fg">
            Playlist completed — great work! 🎉
          </div>
        ) : null}

        <div className="flex max-h-[18rem] flex-col gap-1.5 overflow-y-auto pr-1">
          {videos.map((v, i) => {
            const isActive = i === currentIndex;
            const done = !!completedVideos[v.id];
            const watched = !!seenVideos[v.id];
            return (
              <div
                key={v.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2",
                  isActive ? "border-accent bg-accent/10" : "border-border bg-surface",
                )}
              >
                <button
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg text-accent"
                  aria-label="Play"
                >
                  <Play className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center">
                    {done ? (
                      <CheckCircle2 className="size-5 text-correct" />
                    ) : watched ? (
                      <span className="size-2.5 rounded-full bg-accent" />
                    ) : (
                      <Circle className="size-4 text-muted" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-sm font-medium",
                        isActive ? "text-fg" : "text-muted",
                      )}
                    >
                      {v.title}
                    </span>
                    <span className="block text-xs text-subtle">{formatDuration(v.duration)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleVideoComplete(v.id, v.url)}
                  className="font-mono text-xs text-subtle hover:text-fg"
                  aria-label={done ? "Unmark complete" : "Mark complete"}
                >
                  {done ? "done" : "mark"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
