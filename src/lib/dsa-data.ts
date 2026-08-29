import dsaPlanJson from "@/data/dsa-plan.json";
import dsaRoadmapJson from "@/data/dsa-roadmap-500.json";

export type DsaVideo = {
  title: string;
  duration?: number;
  view_count?: number;
  id: string;
  url: string;
  thumbnails?: { url: string; height: number; width: number }[];
  topic?: string;
  order?: number;
  isPractice?: boolean;
};

export type DsaPlanSection = {
  id: number;
  heading: string;
  category: string;
  videos: DsaVideo[];
};

export type RoadmapProblem = {
  id: number;
  topic: string;
  problem_name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timerSeconds: number;
  platform?: string;
  link?: string;
  slug?: string;
  pattern?: string;
  complexity?: string;
  tag?: string;
};

export const DSA_PLAN: DsaPlanSection[] = dsaPlanJson as DsaPlanSection[];
export const DSA_ROADMAP: RoadmapProblem[] = dsaRoadmapJson as RoadmapProblem[];

export const ROADMAP_TOPICS = [
  "arrays",
  "hashing",
  "two-pointers",
  "sliding-window",
  "stack",
  "binary-search",
  "linked-list",
  "trees",
  "heap",
  "graph",
  "dynamic-programming",
] as const;

export const TOPIC_LABELS: Record<string, string> = {
  arrays: "Arrays",
  hashing: "Hashing",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  stack: "Stack",
  "binary-search": "Binary Search",
  "linked-list": "Linked List",
  trees: "Trees",
  heap: "Heap",
  graph: "Graph",
  "dynamic-programming": "Dynamic Programming",
};

export function difficultySeconds(difficulty: string): number {
  if (difficulty === "Easy") return 600;
  if (difficulty === "Hard") return 1800;
  return 1200;
}

export function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "—";
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}` : `${m}:${String(s % 60).padStart(2, "0")}`;
}
