import { useMemo, useState } from "react";
import { useTracking } from "@/lib/interview-store";
import type { TrackApi, TrackConfig } from "./types";
import { HubBackButton } from "../HubBackButton";
import { cn } from "@/lib/utils";
import { List, CheckCircle2 } from "lucide-react";
import { QuestionCard } from "./QuestionCard";

export function CurrQuestions({ config, api }: { config: TrackConfig; api: TrackApi }) {
  const back = api.back;
  const completedProblems = useTracking((s) => s.completedProblems);
  const [level, setLevel] = useState<number | "all">("all");

  const questions = useMemo(() => {
    if (level === "all") return config.curriculum.allQuestions;
    return config.curriculum.questionsForWeek(level);
  }, [config, level]);

  const doneCount = questions.filter((q) => !!completedProblems[config.completionKey(q.id)])
    .length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <HubBackButton onBack={back} label="All questions" />
        <button
          type="button"
          onClick={() => api.setScreen("today")}
          className="text-xs font-medium text-accent"
        >
          Back to today
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <List className="size-4" />
          {level === "all" ? "All levels" : config.curriculum.weekLabel(level)}
          <span className="font-mono tabular-nums">{questions.length}</span>
          <span className="text-subtle">· {doneCount} done</span>
        </div>

        <div className="flex flex-wrap gap-1 rounded-lg border border-border p-1">
          <button
            key="all"
            type="button"
            onClick={() => setLevel("all")}
            className={cn(
              "min-h-8 rounded-md px-3 text-xs font-medium",
              level === "all" ? "bg-elevated text-fg" : "text-muted",
            )}
          >
            All
          </button>
          {config.curriculum.levels.map((lvl) => (
            <button
              key={lvl.level}
              type="button"
              onClick={() => setLevel(lvl.level)}
              className={cn(
                "min-h-8 rounded-md px-3 text-xs font-medium",
                level === lvl.level ? "bg-elevated text-fg" : "text-muted",
              )}
            >
              {lvl.difficulty}
            </button>
          ))}
        </div>
      </div>

      {level !== "all" ? (
        <button
          type="button"
          onClick={() => setLevel("all")}
          className="w-fit rounded-full border border-border px-3 py-1 text-xs text-muted hover:bg-surface"
        >
          Clear level filter
        </button>
      ) : null}

      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <QuestionCard key={q.id} q={q} completionKey={config.completionKey} />
        ))}
        {questions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-8 text-center text-sm text-subtle">
            No questions in this level yet.
          </p>
        ) : null}
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-subtle">
        <CheckCircle2 className="size-3.5" />
        Tap ✓ on a card to mark a question complete
      </p>
    </div>
  );
}