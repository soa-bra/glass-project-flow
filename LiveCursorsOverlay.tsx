import React, { useCallback, useEffect, useRef } from "react";
import { useOthers, useUpdateMyPresence } from "@liveblocks/react";
// Utility to consistently color live cursors by connection id
import { connectionIdToColor } from "@/utils";

type Camera = { x: number; y: number };

function Cursor({ x, y, label, color }: { x: number; y: number; label?: string; color: string }) {
  return (
    <div style={{ position: "absolute", transform: `translate(${x}px, ${y}px)`, pointerEvents: "none", willChange: "transform" }}>
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M0,0 L0,16 L5,11 L9,17 L12,14 L7,9 L14,9 Z" fill={color} opacity={0.9} />
      </svg>
      {label && (
        <div style={{ background: color, color: "#fff", padding: "2px 6px", borderRadius: 6, fontSize: 11, transform: "translateY(-6px)" }}>
          {label}
        </div>
      )}
    </div>
  );
}

export function LiveCursorsOverlay({ camera }: { camera: Camera }) {
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();
  const raf = useRef<number | null>(null);
  const latest = useRef<{ x: number; y: number } | null>(null);

  const flush = useCallback(() => {
    raf.current = null;
    if (latest.current) updateMyPresence({ cursor: latest.current });
  }, [updateMyPresence]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    const x = e.clientX - camera.x;
    const y = e.clientY - camera.y;
    latest.current = { x, y };
    if (raf.current == null) raf.current = requestAnimationFrame(flush);
  }, [camera.x, camera.y, flush]);

  const onPointerLeave = useCallback(() => {
    latest.current = null;
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {others.map((o) => {
        const c = (o.presence as any)?.cursor as { x: number; y: number } | null;
        if (!c) return null;
        const color = connectionIdToColor(o.connectionId);
        const screenX = c.x + camera.x;
        const screenY = c.y + camera.y;
        const name = (o.info as any)?.name ?? `User ${o.connectionId}`;
        return <Cursor key={o.connectionId} x={screenX} y={screenY} label={name} color={color} />;
      })}
    </div>
  );
}
