"use client";
import React, { useState } from "react";
import { useTools } from "@/src/features/planning/store/tools.store";
import { usePanels } from "@/src/features/planning/store/panels.store";

const modes = ["smart", "connector", "erase", "free"] as const;

const SmartPenTool: React.FC = () => {
  const { activeTool, setActiveTool } = useTools();
  const { openPanel } = usePanels();
  const [modeIndex, setModeIndex] = useState(0);

  const isActive = activeTool === "smart_pen";
  const cycle = () => setModeIndex((i) => (i + 1) % modes.length);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        aria-label="Smart Pen (P)"
        onClick={() => { setActiveTool("smart_pen"); openPanel("smart_pen_panel"); }}
        className={`w-10 h-10 rounded border ${isActive ? "bg-blue-50 border-blue-300" : "bg-white"}`}
        title={`Smart Pen (${modes[modeIndex]})`}
      >
        ✒️
      </button>
      {isActive && (
        <button
          onClick={cycle}
          className="text-[10px] px-1 py-0.5 border rounded bg-white"
          title="Cycle mode"
        >
          {modes[modeIndex]}
        </button>
      )}
    </div>
  );
};
export default SmartPenTool;
