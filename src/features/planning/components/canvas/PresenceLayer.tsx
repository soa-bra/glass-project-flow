"use client";
import React from "react";
import { useCollaboration } from "@/src/features/planning/hooks/useCollaboration";

interface PresenceLayerProps {
  worldToScreen: (pt:{x:number;y:number}) => {x:number;y:number};
}

const PresenceLayer: React.FC<PresenceLayerProps> = ({ worldToScreen }) => {
  const { cursors, participants } = useCollaboration(); // {userId:{x,y,color,name}}
  return (
    <div aria-label="Presence Layer" className="pointer-events-none absolute inset-0">
      {Object.entries(cursors).map(([uid, p]: any) => {
        const s = worldToScreen({ x: p.x, y: p.y });
        const color = p.color ?? "#0ea5e9";
        const name = participants[uid]?.name ?? "Guest";
        return (
          <div key={uid} className="absolute" style={{ left: s.x, top: s.y }}>
            <div className="translate-x-1 translate-y-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="1.5">
                <path d="M3 3l6 16 3-7 7-3-16-6z" />
              </svg>
            </div>
            <div className="ml-4 -mt-1 px-2 py-0.5 rounded text-[11px] text-white" style={{ background: color }}>
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default PresenceLayer;
