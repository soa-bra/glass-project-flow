"use client";
import React from "react";
import { useTools } from "@/src/features/planning/store/tools.store";

const SelectionTool: React.FC = () => {
  const { activeTool, setActiveTool } = useTools();
  return (
    <button
      aria-label="Selection (V)"
      title="Selection (V)"
      onClick={() => setActiveTool("selection")}
      className={`w-10 h-10 rounded border ${activeTool==="selection" ? "bg-blue-50 border-blue-300" : "bg-white"}`}
    >
      🔲
    </button>
  );
};
export default SelectionTool;
