import { cn } from "@/lib/utils";
import { DIFF_COLOR } from "@/lib/dsa-labels";

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-border px-2.5 py-0.5 text-xs font-medium capitalize",
        DIFF_COLOR[difficulty] ?? "text-muted",
      )}
    >
      {difficulty}
    </span>
  );
}
