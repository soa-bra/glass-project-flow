"use client";
import React from "react";
import { useTools } from "@/src/features/planning/store/tools.store";

const PanTool: React.FC = () => {
  const { activeTool, setActiveTool } = useTools();
  return (
    <button
      aria-label="Pan/Hand (H or Space)"
      onClick={() => setActiveTool("pan")}
      className={`w-10 h-10 rounded border ${activeTool==="pan" ? "bg-blue-50 border-blue-300" : "bg-white"}`}
      title="Pan (H / Space)"
    >
      ✋
    </button>
  );
};
export default PanTool;
