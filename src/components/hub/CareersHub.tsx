import { useInterview } from "@/lib/interview-store";
import { LayoutGrid, Code2, Rocket, GraduationCap, ChevronRight } from "lucide-react";

const BAGS = [
  {
    id: "fullstack" as const,
    icon: Code2,
    title: "Fullstack Developer",
    subtitle: "MCQ interview test",
    count: "Multiple-choice prep",
    accent: true,
  },
  {
    id: "smm" as const,
    icon: Rocket,
    title: "Social Media Manager",
    subtitle: "Sweet Country · role interview",
    count: "114 Q&A · 7 categories",
    accent: false,
  },
  {
    id: "dsa" as const,
    icon: GraduationCap,
    title: "DSA Roadmap",
    subtitle: "Calendar · videos · problems",
    count: "500-problem tracker",
    accent: false,
  },
];

export function CareersHub() {
  const open = useInterview((s) => s.open);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:py-14">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-accent uppercase">
          <LayoutGrid className="size-4" />
          Interview prep
        </div>
        <h1 className="font-sans text-3xl leading-tight font-semibold tracking-tight text-fg sm:text-4xl">
          Choose your track
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Pick a role-focused practice track. Each track holds its own questions,
          video playlists, and progress tracking — just tap a card to begin.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        {BAGS.map((bag) => (
          <button
            key={bag.id}
            type="button"
            onClick={() => open(bag.id)}
            className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors duration-150 hover:bg-elevated active:scale-[0.99]"
          >
            <span className="flex items-center gap-3">
              <span
                className={
                  bag.accent
                    ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg"
                    : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-bg text-accent"
                }
              >
                <bag.icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-semibold text-fg">{bag.title}</span>
                <span className="block text-sm text-muted">{bag.subtitle}</span>
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="hidden rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted sm:block">
                {bag.count}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted" />
            </span>
          </button>
        ))}
      </section>

      <p className="text-center text-xs text-subtle">
        Fullstack routes to the existing CBT test · Social Media Manager is a new
        Q&amp;A flow · DSA opens a full roadmap with calendar, videos, and problems.
      </p>
    </div>
  );
}
