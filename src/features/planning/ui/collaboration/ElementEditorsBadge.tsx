/**
 * ElementEditorsBadge — shows who is currently editing a specific element.
 *
 * Reads the live presence map from usePlanningRealtime/usePlanningElements,
 * filters to peers whose `editing_element_id` matches, and renders a small
 * RTL-friendly chip: stacked initials + count + relative "last interaction".
 */
import { useEffect, useMemo, useState } from "react";
import type { PresencePeer } from "../../hooks/usePlanningRealtime";

interface ElementEditorsBadgeProps {
  elementId: string;
  /** All peers from usePlanningElements/usePlanningRealtime (excludes self). */
  peers: PresencePeer[];
  className?: string;
}

function relativeTime(ms: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (s < 5) return "الآن";
  if (s < 60) return `قبل ${s} ث`;
  const m = Math.floor(s / 60);
  if (m < 60) return `قبل ${m} د`;
  const h = Math.floor(m / 60);
  return `قبل ${h} س`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0)).join("").toUpperCase() || "?";
}

export function ElementEditorsBadge({
  elementId,
  peers,
  className,
}: ElementEditorsBadgeProps) {
  const editors = useMemo(
    () => peers.filter((p) => p.editing_element_id === elementId),
    [peers, elementId],
  );

  // Re-render every 15s so the "last interaction" label stays fresh.
  const [, tick] = useState(0);
  useEffect(() => {
    if (editors.length === 0) return;
    const id = window.setInterval(() => tick((n) => n + 1), 15_000);
    return () => window.clearInterval(id);
  }, [editors.length]);

  if (editors.length === 0) return null;

  const lastSeen = Math.max(...editors.map((e) => e.lastSeen));
  const visible = editors.slice(0, 3);
  const overflow = editors.length - visible.length;

  return (
    <div
      dir="rtl"
      className={
        "inline-flex items-center gap-2 rounded-full border border-border " +
        "bg-card ps-1 pe-3 py-1 shadow-sm text-xs " +
        (className ?? "")
      }
      aria-label={`${editors.length} يحرر هذا العنصر`}
    >
      <div className="flex -space-x-1.5 rtl:space-x-reverse">
        {visible.map((p) => (
          <span
            key={p.user_id}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-card"
            style={{ backgroundColor: p.color ?? "#64748b" }}
            title={p.display_name ?? "متعاون"}
          >
            {initials(p.display_name ?? "")}
          </span>
        ))}
        {overflow > 0 && (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
            +{overflow}
          </span>
        )}
      </div>
      <span className="font-medium text-foreground">{editors.length}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{relativeTime(lastSeen)}</span>
    </div>
  );
}

export default ElementEditorsBadge;
