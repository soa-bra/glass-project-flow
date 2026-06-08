/**
 * PresenceCursors — live remote cursors overlay for the planning canvas.
 *
 * Renders an SVG layer positioned absolutely above the canvas. Cursor
 * coordinates are in canvas (world) space; the parent should apply the
 * current viewport transform on the wrapping element.
 */
import { memo } from "react";
import type { PresencePeer } from "../../hooks/usePlanningRealtime";

interface PresenceCursorsProps {
  peers: PresencePeer[];
}

export const PresenceCursors = memo(function PresenceCursors({
  peers,
}: PresenceCursorsProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {peers.map((p) => {
        if (!p || !p.cursor) return null;
        const color = p.color ?? "#64748b";
        const name = p.display_name ?? "متعاون";
        return (
          <div
            key={p.user_id}
            className="absolute transition-transform duration-75 ease-linear will-change-transform"
            style={{
              transform: `translate3d(${p.cursor.x}px, ${p.cursor.y}px, 0)`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2 2 L18 10 L10 12 L8 18 Z"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="absolute top-5 start-3 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-white whitespace-nowrap shadow-sm"
              style={{ background: color }}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
});
