export const DIFF_COLOR: Record<string, string> = {
  Easy: "text-correct",
  Medium: "text-amber-400",
  Hard: "text-wrong",
};

export function patternSummary(pattern?: string) {
  if (!pattern) return "General";
  const map: Record<string, string> = {
    "Sliding Window": "SW",
    "Two Pointers": "TP",
    "Binary Search on Answer": "BSA",
    "Monotonic Stack": "MS",
    "Prefix Sum": "PS",
    Kadane: "KAD",
    Memoization: "MEM",
    "DFS/BFS": "G",
  };
  return map[pattern] ?? pattern;
}
