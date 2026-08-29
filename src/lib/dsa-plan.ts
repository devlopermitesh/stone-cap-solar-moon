import { DSA_ROADMAP, type RoadmapProblem, DSA_PLAN, type DsaVideo } from "./dsa-data";

export type DayTheme = {
  dateOffset: number;
  week: number;
  dayOfWeek: number;
  title: string;
  problems: RoadmapProblem[];
};

const WEEK_SCHEDULE: { topics: string[]; label: string }[] = [
  { topics: ["arrays"], label: "Arrays" },
  { topics: ["hashing", "two-pointers"], label: "Hashing · Two Pointers" },
  { topics: ["two-pointers", "sliding-window"], label: "Two Pointers · Sliding Window" },
  { topics: ["stack", "binary-search"], label: "Stack · Binary Search" },
  { topics: ["binary-search", "linked-list"], label: "Binary Search · Linked List" },
  { topics: ["linked-list", "trees"], label: "Linked List · Trees" },
  { topics: ["trees"], label: "Trees" },
  { topics: ["trees", "heap"], label: "Trees · Heap" },
  { topics: ["graph"], label: "Graphs" },
  { topics: ["graph", "dynamic-programming"], label: "Graphs · Dynamic Programming" },
  { topics: ["dynamic-programming"], label: "Dynamic Programming" },
  { topics: ["dynamic-programming"], label: "Dynamic Programming · Review" },
];

const CURRENT_START = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
})();

function dateOffsetIso(offsetDays: number): string {
  const d = new Date(CURRENT_START);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const TOTAL_WEEKS = WEEK_SCHEDULE.length;

export function problemsForWeek(week: number): RoadmapProblem[] {
  const { topics } = WEEK_SCHEDULE[week] ?? WEEK_SCHEDULE[0];
  const known = new Set<string>();
  const byTopic = new Map<string, RoadmapProblem[]>();
  for (const p of DSA_ROADMAP) {
    const t = p.topic;
    if (topics.includes(t)) {
      if (!known.has(t)) {
        known.add(t);
      }
      byTopic.set(t, [...(byTopic.get(t) ?? []), p]);
    }
  }
  const out: RoadmapProblem[] = [];
  for (const t of topics) {
    out.push(...(byTopic.get(t) ?? []));
  }
  return out;
}

export function chunkProblems(problems: RoadmapProblem[], dayCount: number): RoadmapProblem[][] {
  const chunks: RoadmapProblem[][] = Array.from({ length: dayCount }, () => []);
  if (!problems.length) return chunks;
  const perDay = Math.ceil(problems.length / dayCount);
  problems.forEach((p, i) => {
    const day = Math.min(Math.floor(i / perDay), dayCount - 1);
    chunks[day].push(p);
  });
  return chunks;
}

export function todayPlan(offset = 0): DayTheme {
  const rawOffset = Math.max(0, offset);
  const week = Math.floor(rawOffset / 7) % TOTAL_WEEKS;
  const dayOfWeek = rawOffset % 7;
  const problems = chunkProblems(problemsForWeek(week), 7)[dayOfWeek] ?? [];
  const schedule = WEEK_SCHEDULE[week];
  return {
    dateOffset: rawOffset,
    week,
    dayOfWeek,
    title: schedule.label,
    problems,
  };
}

export function topicProblems(topic: string): RoadmapProblem[] {
  return DSA_ROADMAP.filter((p) => p.topic === topic);
}

export function dayUniques(day: DayTheme): string {
  return day.problems.map((p) => p.id).join(",");
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function roundToTopic(problem: RoadmapProblem): string {
  return problem.topic;
}

export function videosForTopics(topics: string[]): DsaVideo[] {
  const set = new Set(topics);
  const all: DsaVideo[] = [];
  for (const section of DSA_PLAN) {
    for (const v of section.videos) {
      if (v.topic && set.has(v.topic)) all.push(v);
    }
  }
  const concept = all.filter((v) => !v.isPractice);
  const practice = all.filter((v) => v.isPractice);
  const ordered = [...concept, ...practice];
  const seen = new Set<string>();
  const out: DsaVideo[] = [];
  for (const v of ordered) {
    const vid = v.id;
    if (!vid || seen.has(vid)) continue;
    seen.add(vid);
    out.push(v);
  }
  return out;
}

export function videosForWeekWeek(week: number): DsaVideo[] {
  const schedule = WEEK_SCHEDULE[week] ?? WEEK_SCHEDULE[0];
  return videosForTopics(schedule.topics);
}

export const startIso = dateOffsetIso(0);

export function todayOffset(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = now.getTime() - CURRENT_START.getTime();
  return Math.floor(diff / 86400000);
}

export function isoForOffset(offset: number): string {
  return dateOffsetIso(offset);
}

export function offsetForToday(): number {
  return todayOffset();
}

export function weekLabel(week: number): string {
  return WEEK_SCHEDULE[week]?.label ?? "Review";
}

export function completedCount(): number {
  return DSA_ROADMAP.length;
}
