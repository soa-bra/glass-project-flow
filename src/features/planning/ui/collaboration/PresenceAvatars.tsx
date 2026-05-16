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
  const visible = peers.slice(0, max);
  const overflow = peers.length - visible.length;

  return (
    <div className="flex items-center -space-x-2 rtl:space-x-reverse" dir="rtl">
      {visible.map((p) => (
        <div
          key={p.user_id}
          title={p.display_name}
          className="size-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-semibold text-white shadow-sm"
          style={{ background: p.color }}
          aria-label={`متعاون: ${p.display_name}`}
        >
          {initialsOf(p.display_name)}
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
