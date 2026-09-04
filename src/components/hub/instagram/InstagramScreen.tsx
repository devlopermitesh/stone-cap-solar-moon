import { useMemo, useState } from "react";
import { INSTAGRAM_PLAN, formatVideoDuration, totalVideoMinutes } from "@/lib/instagram-data";
import { useInterview } from "@/lib/interview-store";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Video,
  Clock,
  Play,
} from "lucide-react";

const SECTIONS = INSTAGRAM_PLAN.filter((s) => s.videos.length > 0);

export function InstagramScreen() {
  const back = useInterview((s) => s.back);
  const [expanded, setExpanded] = useState<number | null>(SECTIONS[0]?.id ?? null);
  const totalVideos = useMemo(() => SECTIONS.reduce((s, sec) => s + sec.videos.length, 0), []);
  const totalMin = useMemo(() => totalVideoMinutes(INSTAGRAM_PLAN), []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={back} label="Instagram Growth" />

      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">
          Instagram Course Roadmap
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Instagram Growth &amp; Marketing
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Video className="size-4" />
            {SECTIONS.length} sections
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Play className="size-4" />
            {totalVideos} videos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />
            {totalMin} min total
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {SECTIONS.map((sec) => {
          const isOpen = expanded === sec.id;
          return (
            <div
              key={sec.id}
              className="rounded-xl border border-border bg-surface overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : sec.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                {isOpen ? (
                  <ChevronDown className="size-4 shrink-0 text-muted" />
                ) : (
                  <ChevronRight className="size-4 shrink-0 text-muted" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-fg truncate">
                    {sec.heading}
                  </h3>
                  <p className="text-xs text-muted">
                    {sec.videos.length} video{sec.videos.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </button>

              {isOpen ? (
                <div className="border-t border-border">
                  {sec.videos.map((v, i) => (
                    <a
                      key={`${sec.id}-${v.id}-${i}`}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-elevated",
                        i < sec.videos.length - 1 && "border-b border-border/50",
                      )}
                    >
                      <span className="w-6 shrink-0 text-center font-mono text-xs text-muted">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-fg">{v.title}</p>
                        <p className="text-xs text-muted">
                          {v.channel ?? ""}
                          {v.duration ? ` · ${formatVideoDuration(v.duration)}` : ""}
                          {v.view_count ? ` · ${v.view_count.toLocaleString()} views` : ""}
                        </p>
                      </div>
                      <ExternalLink className="size-3.5 shrink-0 text-muted" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {SECTIONS.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-8 text-center text-sm text-subtle">
          No Instagram sections available yet.
        </p>
      ) : null}
    </div>
  );
}
