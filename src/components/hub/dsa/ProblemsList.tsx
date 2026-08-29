import { useMemo, useState } from "react";
import { useInterview, useTracking } from "@/lib/interview-store";
import { DSA_ROADMAP, TOPIC_LABELS, ROADMAP_TOPICS } from "@/lib/dsa-data";
import { HubBackButton } from "../HubBackButton";
import { DifficultyBadge } from "./DsaBadges";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, ChevronRight, List } from "lucide-react";
import { ProblemRunner } from "./ProblemRunner";

const FILTERS = ["All", "Easy", "Medium", "Hard"] as const;
const TOPIC = ROADMAP_TOPICS.concat([]);

export function ProblemsList() {
  const back = useInterview((s) => s.back);
  const setDsaScreen = useInterview((s) => s.setDsaScreen);
  const completedProblems = useTracking((s) => s.completedProblems);
  const selectedTopic = useInterview((s) => s.selectedTopic);
  const setSelectedTopic = useInterview((s) => s.setSelectedTopic);

  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [openProblem, setOpenProblem] = useState<number | null>(null);

  const topicFilter: (typeof TOPIC)[number] | "all" =
    selectedTopic && (TOPIC as readonly string[]).includes(selectedTopic)
      ? (selectedTopic as (typeof TOPIC)[number])
      : "all";

  const problems = useMemo(() => {
    return DSA_ROADMAP.filter((p) => {
      if (topicFilter !== "all" && p.topic !== topicFilter) return false;
      if (difficulty !== "All" && p.difficulty !== difficulty) return false;
      return true;
    });
  }, [topicFilter, difficulty]);

  if (openProblem !== null) {
    const p = DSA_ROADMAP.find((x) => x.id === openProblem);
    if (p) return <ProblemRunner problem={p} onBack={() => setOpenProblem(null)} />;
  }

  const doneCount = problems.filter((p) => completedProblems[String(p.id)]).length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <HubBackButton onBack={back} label="Problems" />
        <button
          type="button"
          onClick={() => setDsaScreen("today")}
          className="text-xs font-medium text-accent"
        >
          Back to today
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <List className="size-4" />
          {topicFilter === "all" ? "All topics" : TOPIC_LABELS[topicFilter]}
          <span className="font-mono tabular-nums">{problems.length}</span>
          <span className="text-subtle">· {doneCount} done</span>
        </div>

        <div className="flex gap-1 rounded-lg border border-border p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setDifficulty(f)}
              className={cn(
                "min-h-8 rounded-md px-3 text-xs font-medium",
                difficulty === f ? "bg-elevated text-fg" : "text-muted",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {(topicFilter !== "all" || difficulty !== "All") ? (
        <button
          type="button"
          onClick={() => {
            setSelectedTopic(undefined);
            setDifficulty("All");
          }}
          className="w-fit rounded-full border border-border px-3 py-1 text-xs text-muted hover:bg-surface"
        >
          Clear filters
        </button>
      ) : null}

      <div className="flex flex-col gap-2">
        {problems.map((p) => {
          const done = !!completedProblems[String(p.id)];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpenProblem(p.id)}
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
                <span className="block truncate text-sm font-medium text-fg">{p.problem_name}</span>
                <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  <span className="capitalize">{TOPIC_LABELS[p.topic] ?? p.topic}</span>
                  {p.pattern ? <span>· {p.pattern}</span> : null}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <DifficultyBadge difficulty={p.difficulty} />
                <span className="flex items-center gap-1 font-mono text-xs tabular-nums text-subtle">
                  <Clock className="size-3" />
                  {Math.round(p.timerSeconds / 60)}m
                </span>
                <ChevronRight className="size-4 text-subtle" />
              </span>
            </button>
          );
        })}
        {problems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-8 text-center text-sm text-subtle">
            No problems match this filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}
