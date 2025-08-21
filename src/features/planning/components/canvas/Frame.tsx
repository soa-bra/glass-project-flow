"use client";
import React from "react";
import { useSelection } from "@/src/features/planning/hooks/useSelection";
import { useCanvas } from "@/src/features/planning/hooks/useCanvas";

interface FrameProps { frame: any; }

const Frame: React.FC<FrameProps> = ({ frame }) => {
  const { selectFrame } = useSelection();
  const { isLocked } = useCanvas();

  return (
    <div
      role="group"
      aria-label={`Frame ${frame.name ?? frame.id}`}
      className="absolute border-2 rounded-md shadow-sm"
      style={{
        left: frame.x, top: frame.y, width: frame.w, height: frame.h,
        background: frame.background ?? "#fff",
        borderColor: isLocked(frame.id) ? "#94a3b8" : "#2563eb",
      }}
      onPointerDown={(e) => { e.stopPropagation(); selectFrame(frame.id, e.shiftKey); }}
    >
      <div className="absolute top-0 left-0 px-2 py-1 text-[11px] bg-white/80 border-b border-r rounded-br">
        {frame.name ?? "Frame"}
      </div>
    </div>
  );
};
export default Frame;
