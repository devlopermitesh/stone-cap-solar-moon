import { useEffect, useRef, useState } from "react";
import { useTracking } from "@/lib/interview-store";
import { TOPIC_LABELS } from "@/lib/dsa-data";
import { HubBackButton } from "../HubBackButton";
import { DifficultyBadge } from "./DsaBadges";
import { patternSummary } from "@/lib/dsa-labels";
import { cn } from "@/lib/utils";
import { Clock, Pause, Play, RotateCcw, CheckCircle2, Tag, ExternalLink } from "lucide-react";

type TimerState = "idle" | "running" | "paused" | "done";

function mmss(total: number): string {
  const s = Math.max(0, total);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function ProblemRunner({
  problem,
  onBack,
}: {
  problem: { id: number; problem_name: string; topic: string; difficulty: string; pattern?: string; timerSeconds: number; link?: string };
  onBack: () => void;
}) {
  const [left, setLeft] = useState(problem.timerSeconds);
  const [status, setStatus] = useState<TimerState>("idle");
  const [description, setDescription] = useState<string | null>(null);
  const [descLoading, setDescLoading] = useState(false);
  const notifiedRef = useRef(false);
  const completedProblems = useTracking((s) => s.completedProblems);
  const tossProblem = useTracking((s) => s.tossProblem);

  const total = problem.timerSeconds;
  const pct = total ? ((total - left) / total) * 100 : 0;

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          setStatus("done");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === "done" && !notifiedRef.current) {
      notifiedRef.current = true;
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification("Time's up", { body: problem.problem_name });
        } catch {
          /* noop */
        }
      }
    }
  }, [status, problem.problem_name]);

  useEffect(() => {
    if (!problem.link || descLoading || description !== null) return;
    const slug = problem.link.split("/").filter(Boolean).pop();
    if (!slug) return;
    let cancelled = false;
    setDescLoading(true);
    fetch(`https://leetcode-api-pied.vercel.app/problem/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        const text = data?.question ? String(data.question).replace(/<[^>]*>/g, " ") : "";
        setDescription(
          text.trim() ||
            `${data?.title ?? problem.problem_name} — ${
              data?.titleSlug ?? slug
            }`,
        );
      })
      .catch(() => {
        if (!cancelled) setDescription(null);
      })
      .finally(() => {
        if (!cancelled) setDescLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [problem.link, problem.problem_name, description, descLoading]);

  const start = () => {
    if (status === "done") setLeft(total);
    setStatus(status === "running" ? "paused" : "running");
  };

  const reset = () => {
    setLeft(total);
    setStatus("idle");
    notifiedRef.current = false;
  };

  const done = !!completedProblems[String(problem.id)];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <HubBackButton onBack={onBack} label="Problem" />

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4">
        <div>
          <span className="font-mono text-xs text-muted">#{problem.id}</span>
          <h2 className="text-lg font-semibold text-fg">{problem.problem_name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="flex items-center gap-1 capitalize">
              <Tag className="size-3" />
              {TOPIC_LABELS[problem.topic] ?? problem.topic}
            </span>
            {problem.pattern ? (
              <span className="rounded-full bg-elevated px-2 py-0.5 text-subtle">
                {patternSummary(problem.pattern)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border p-6 text-center",
          status === "done" ? "border-wrong/50 bg-wrong-bg/30" : "border-border bg-surface",
        )}
      >
        <span className="text-sm text-muted">Per-question timer</span>
        <span
          className={cn(
            "font-mono text-5xl font-bold tabular-nums",
            status === "done" ? "text-wrong" : "text-fg",
          )}
        >
          {mmss(left)}
        </span>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className={cn("h-full transition-[width]", status === "done" ? "bg-wrong" : "bg-accent")}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
        <p className="text-xs text-subtle">
          {status === "done"
            ? "Time's up — time-box reached."
            : status === "paused"
              ? "Paused"
              : status === "running"
                ? "Running"
                : "Ready — start when you are"}
        </p>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={start}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-accent-fg"
          >
            {status === "running" ? <Pause className="size-4" /> : <Play className="size-4" />}
            {status === "running" ? "Pause" : status === "idle" ? "Start timer" : "Resume"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-medium text-fg"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-muted">{done ? "Marked done" : "Finished it?"}</span>
          <button
            type="button"
            onClick={() => tossProblem(problem.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              done
                ? "border-correct/50 bg-correct-bg text-correct"
                : "border-border bg-bg text-muted hover:bg-elevated",
            )}
          >
            {done ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
            {done ? "Done" : "Mark done"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
          Problem
          {descLoading ? <span className="text-xs font-normal text-muted">loading…</span> : null}
        </h3>
        {description ? (
          <p className="text-sm leading-relaxed text-fg/90">{description}</p>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            {description === null && !descLoading
              ? "This problem is queued from your roadmap by topic + pattern. Open it on LeetCode to read the full statement, then solve it within the timer above."
              : "Loading problem statement…"}
          </p>
        )}
        {problem.link ? (
          <a
            href={problem.link}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-2 text-sm font-medium text-accent"
          >
            Open on platform <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
