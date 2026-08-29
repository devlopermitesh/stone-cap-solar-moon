import { ChevronLeft } from "lucide-react";

export function HubBackButton({ onBack, label }: { onBack: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-elevated"
        aria-label="Back"
      >
        <ChevronLeft className="size-4" />
      </button>
      {label ? <h1 className="text-2xl font-semibold tracking-tight text-fg">{label}</h1> : null}
    </div>
  );
}
