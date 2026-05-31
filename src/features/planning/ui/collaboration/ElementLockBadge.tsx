/**
 * ElementLockBadge — compact pill showing an element's lock state.
 *
 * Uses semantic design tokens only (no hard-coded colors). Status maps to:
 *   - unlocked        → muted neutral
 *   - locked-by-self  → primary accent
 *   - locked-by-other → destructive (read-only)
 */
import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementLockState } from "@/features/planning/hooks/useElementLockState";

interface ElementLockBadgeProps {
  state: ElementLockState;
  className?: string;
}

export function ElementLockBadge({ state, className }: ElementLockBadgeProps) {
  const isLocked = state.status !== "unlocked";
  const Icon = isLocked ? Lock : LockOpen;

  const tone =
    state.status === "locked-by-other"
      ? "bg-destructive/10 text-destructive border-destructive/30"
      : state.status === "locked-by-self"
        ? "bg-primary/10 text-primary border-primary/30"
        : "bg-muted text-muted-foreground border-border";

  return (
    <span
      role="status"
      aria-live="polite"
      title={state.message}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border ps-2 pe-3 py-0.5 text-xs font-medium",
        tone,
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span>{state.message}</span>
    </span>
  );
}
