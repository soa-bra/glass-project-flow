/**
 * PresenceAvatars — RTL-first stack of collaborator avatars + initials.
 *
 * Used in the planning canvas top bar. Cursors themselves are rendered by
 * `PresenceCursors`. This component intentionally avoids glassmorphism
 * (static surface — UI Governance Contract).
 */
import { memo } from "react";
import type { PresencePeer } from "../../hooks/usePlanningRealtime";

interface PresenceAvatarsProps {
  peers: PresencePeer[];
  max?: number;
}

function initialsOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "؟";
  const parts = trimmed.split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export const PresenceAvatars = memo(function PresenceAvatars({
  peers,
  max = 5,
}: PresenceAvatarsProps) {
  if (peers.length === 0) return null;
  const safePeers = peers.filter((p): p is PresencePeer => Boolean(p && p.user_id));
  const visible = safePeers.slice(0, max);
  const overflow = safePeers.length - visible.length;

  return (
    <div className="flex items-center -space-x-2 rtl:space-x-reverse" dir="rtl">
      {visible.map((p) => (
        <div
          key={p.user_id}
          title={p.display_name ?? "متعاون"}
          className="size-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-semibold text-white shadow-sm"
          style={{ background: p.color ?? "#64748b" }}
          aria-label={`متعاون: ${p.display_name ?? "متعاون"}`}
        >
          {initialsOf(p.display_name ?? "")}
        </div>
      ))}
      {overflow > 0 && (
        <div className="size-8 rounded-full border-2 border-background bg-muted text-foreground/70 text-xs font-semibold flex items-center justify-center">
          +{overflow}
        </div>
      )}
    </div>
  );
});
