import { useMemo, useState } from "react";
import { useInterview, useTracking } from "@/lib/interview-store";
import { weekEntriesForWeek, weekTopic, weekLabel } from "@/lib/english-plan";
import {
  TOPIC_LABELS,
  formatDuration,
  embeddableForTopic,
  playlistsForTopic,
  playlistId,
} from "@/lib/english-data";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Play,
  ChevronLeft,
  ChevronRight,
  ListVideo,
  ExternalLink,
} from "lucide-react";

export function EnglishPlaylist({ week }: { week: number }) {
  const back = useInterview((s) => s.back);
  const selectedTopic = useInterview((s) => s.selectedTopic);
  const seenVideos = useTracking((s) => s.seenVideos);
  const completedVideos = useTracking((s) => s.completedVideos);
  const toggleVideoSeen = useTracking((s) => s.toggleVideoSeen);

  const topic = selectedTopic ?? weekTopic(week);
  const videos = useMemo(
    () => (selectedTopic ? embeddableForTopic(selectedTopic) : weekEntriesForWeek(week)),
    [selectedTopic, week],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!videos.length) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
        <HubBackButton onBack={back} label="Playlist" />
        <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-subtle">
          No standalone video lessons for this topic yet.
        </p>
      </div>
    );
  }

  const active = videos[currentIndex];
  const watchedCount = videos.filter(
    (v) => !!seenVideos[String(v.id)] || !!completedVideos[String(v.id)],
  ).length;
  const allDone = videos.length > 0 && watchedCount === videos.length;

  const curated = playlistsForTopic(topic);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton
        onBack={back}
        label={selectedTopic ? (TOPIC_LABELS[topic] ?? topic) : weekLabel(week)}
      />

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
            onClick={() => toggleVideoSeen(active.id, active.url)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              !!seenVideos[String(active.id)] || !!completedVideos[String(active.id)]
                ? "border-correct/50 bg-correct-bg text-correct"
                : "border-border bg-surface text-muted hover:bg-elevated",
            )}
          >
            {!!seenVideos[String(active.id)] || !!completedVideos[String(active.id)] ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Circle className="size-4" />
            )}
            {!!seenVideos[String(active.id)] || !!completedVideos[String(active.id)]
              ? "Watched"
              : "Mark watched"}
          </button>
        </div>

        <p className="text-sm text-muted">
          {TOPIC_LABELS[topic] ?? topic} · {formatDuration(active.duration)} ·{" "}
          {active.isPractice ? "practice" : "concept"}
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
            {watchedCount}/{videos.length}
          </span>
        </div>
        {allDone ? (
          <div className="rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm font-medium text-fg">
            All lessons watched — nice work! 🎉
          </div>
        ) : null}

        <div className="flex max-h-[18rem] flex-col gap-1.5 overflow-y-auto pr-1">
          {videos.map((v, i) => {
            const isActive = i === currentIndex;
            const done = !!seenVideos[String(v.id)] || !!completedVideos[String(v.id)];
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
                  onClick={() => toggleVideoSeen(v.id, v.url)}
                  className="flex size-5 shrink-0 items-center justify-center"
                  aria-label={done ? "Unmark watched" : "Mark watched"}
                >
                  {done ? (
                    <CheckCircle2 className="size-5 text-correct" />
                  ) : (
                    <Circle className="size-4 text-muted" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {curated.length > 0 ? (
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <ExternalLink className="size-4" />
            Curated YouTube playlists
          </div>
          {curated.slice(0, 8).map((p) => {
            const pid = playlistId(p);
            return (
              <a
                key={p.id}
                href={`https://www.youtube.com/playlist?list=${pid}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:bg-elevated"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg text-accent">
                  <Play className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">{p.title}</span>
                  <span className="block text-xs text-muted">
                    Full playlist on YouTube · open in new tab
                  </span>
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted" />
              </a>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
