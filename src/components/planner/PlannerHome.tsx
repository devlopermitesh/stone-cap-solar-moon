import { useMemo } from "react";
import { useInterview } from "@/lib/interview-store";
import { usePlanner } from "@/lib/planner/state";
import { dateIso, nowTime } from "@/lib/planner/engine";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Circle,
  ListChecks,
  Play,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { HubBackButton } from "../hub/HubBackButton";
import { BlockRow, NavCard, StatCard, goalById } from "./PlannerShared";

export function PlannerHome() {
  const back = useInterview((s) => s.back);
  const setPlannerScreen = useInterview((s) => s.setPlannerScreen);
  const setDsaScreen = useInterview((s) => s.setDsaScreen);
  const setEnglishScreen = useInterview((s) => s.setEnglishScreen);
  const open = useInterview((s) => s.open);

  const engine = usePlanner((s) => s.engine);
  const ready = usePlanner((s) => s.ready);
  const busy = usePlanner((s) => s.busy);
  const aiWhy = usePlanner((s) => s.aiWhy);
  const dispatch = usePlanner((s) => s.dispatch);
  const selectBlock = usePlanner((s) => s.selectBlock);

  const today = dateIso();
  const plan = engine?.plans[today];
  const next = usePlanner((s) => s.nextBlock);

  const stats = useMemo(() => {
    const blocks = plan?.blocks ?? [];
    const openBlocks = blocks.filter((b) => b.status !== "done" && b.status !== "skipped");
    const done = blocks.filter((b) => b.status === "done").length;
    const activeGoals = engine?.goals.filter((g) => g.active).length ?? 0;
    return { blocks: blocks.length, open: openBlocks.length, done, activeGoals };
  }, [plan, engine]);

  const authoritativeNext = next();
  const block = useMemo(() => {
    if (authoritativeNext) return authoritativeNext;
    const firstOpen = plan?.blocks.find((b) => b.status !== "done" && b.status !== "skipped");
    return firstOpen ?? null;
  }, [authoritativeNext, plan]);
  const fallbackNext = !authoritativeNext && !!block;
  const goal = block ? goalById(engine?.goals ?? [], block.goalId) : undefined;

  function startBlock() {
    if (!block) return;
    void dispatch([{ type: "task_started", blockId: block.id, at: new Date().toISOString() }]);
    selectBlock(block.id);
    setPlannerScreen("day");
  }

  function openLearner() {
    if (!goal) return;
    const src = goal.source;
    if (src === "dsa") {
      setDsaScreen("today");
      open("dsa");
    } else if (src === "english") {
      setEnglishScreen("today");
      open("english");
    } else if (src === "smm" || src === "fullstack") {
      open(src);
    }
  }

  const todayName = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton onBack={back} label="Day Planner" />
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted">
          <CalendarDays className="size-4 text-accent" />
          {todayName}
        </span>
      </div>

      {!ready ? (
        <section className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
          Booting the planner engine…
        </section>
      ) : plan && plan.blocks.length === 0 ? (
        <section className="rounded-xl border border-accent/40 bg-accent/5 p-8 text-center">
          <p className="text-lg font-semibold text-fg">Nothing on today's plan yet</p>
          <p className="mt-1 text-sm text-muted">
            Turn on goals or add an urgent task and the engine builds the day for you.
          </p>
          <button
            type="button"
            onClick={() => setPlannerScreen("goals")}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-accent bg-accent px-4 text-sm font-semibold text-accent-fg transition-colors hover:brightness-110"
          >
            <CalendarPlus className="size-4" />
            Open goals
          </button>
        </section>
      ) : block ? (
        <section className="rounded-xl border border-accent/50 bg-accent/5 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-accent uppercase">
            <Play className="size-3.5" />
            Your next action
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold tracking-tight text-fg">{block.title}</h2>
              <p className="mt-1 font-mono text-sm tabular-nums text-accent">
                {block.start}–{block.end} · {block.minutes} min · P{block.priority}
              </p>
              <p className="mt-1 text-sm text-muted">
                {aiWhy ?? block.why ?? "Engine priority order"} · {goal?.title ?? "task"}
                {fallbackNext ? (
                  <span className="ml-1 text-xs text-subtle">· next slot, replan when you start</span>
                ) : null}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={startBlock}
                disabled={busy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-5 text-sm font-semibold text-accent-fg transition-colors hover:brightness-110 disabled:opacity-60"
              >
                <Play className="size-4" />
                START now
              </button>
              <button
                type="button"
                onClick={openLearner}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-medium text-muted transition-colors hover:bg-elevated"
              >
                Open {goal ? goal.title.split(" ")[0] : "track"}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-correct/50 bg-correct-bg p-5 text-center">
          <CheckCircle2 className="mx-auto size-6 text-correct" />
          <p className="mt-2 text-lg font-semibold text-fg">All done for today</p>
          <p className="text-sm text-muted">Every block on today's plan is finished. Nice work.</p>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<ListChecks className="size-5" />} label="Today's blocks" value={`${stats.blocks}`} />
        <StatCard icon={<Timer className="size-5" />} label="Open" value={`${stats.open}`} />
        <StatCard icon={<CheckCircle2 className="size-5" />} label="Done" value={`${stats.done}`} />
        <StatCard icon={<Target className="size-5" />} label="Active goals" value={`${stats.activeGoals}`} />
      </section>

      {plan && plan.blocks.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Today's schedule</h2>
            {stats.open > 0 && !block ? (
              <span className="font-mono text-xs text-accent">{stats.open} carried to replan</span>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            {plan.blocks.map((b) => (
              <BlockRow
                key={b.id}
                block={b}
                goal={goalById(engine?.goals ?? [], b.goalId)}
                selected={b.id === block?.id}
                onSelect={() => {
                  selectBlock(b.id);
                  setPlannerScreen("day");
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NavCard
          icon={<ListChecks className="size-5" />}
          title="Full day view"
          subtitle="Timeline, done, skip, feedback"
          onClick={() => setPlannerScreen("day")}
        />
        <NavCard
          icon={<CalendarDays className="size-5" />}
          title="Week calendar"
          subtitle="Plan across the next 7 days"
          onClick={() => setPlannerScreen("calendar")}
        />
        <NavCard
          icon={<Target className="size-5" />}
          title="Goals & targets"
          subtitle="Toggle tracks, add urgent tasks"
          onClick={() => setPlannerScreen("goals")}
        />
        <NavCard
          icon={<Sparkles className="size-5" />}
          title="AI quick-add"
          subtitle="Describe a task in plain words"
          onClick={() => setPlannerScreen("goals")}
        />
      </div>

      {engine ? <EngineFoot engVersion={engine.version} /> : null}
    </div>
  );
}

function EngineFoot({ engVersion }: { engVersion: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-subtle">
      <span>
        Engine v{engVersion} · now {nowTime()} · {dateIso()}
      </span>
      <span className="flex items-center gap-1">
        <Circle className="size-2.5 text-correct" />
        <span>Data stays on-device; AI is a consultant, engine decides</span>
      </span>
    </div>
  );
}