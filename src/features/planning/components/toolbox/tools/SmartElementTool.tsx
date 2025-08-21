"use client";
import React from "react";
import { useTools } from "@/src/features/planning/store/tools.store";
import { usePanels } from "@/src/features/planning/store/panels.store";

const SmartElementTool: React.FC<{ onCategoryChange: (c: string | null) => void }> = ({ onCategoryChange }) => {
  const { activeTool, setActiveTool } = useTools();
  const { openPanel } = usePanels();
  return (
    <button
      aria-label="Smart Elements (S)"
      onClick={() => { setActiveTool("smart_elements"); openPanel("smart_elements_panel"); onCategoryChange("smart"); }}
      className={`w-10 h-10 rounded border ${activeTool==="smart_elements" ? "bg-blue-50 border-blue-300" : "bg-white"}`}
      title="Smart Elements (S)"
    >
      🧠
    </button>
  );
};
export default SmartElementTool;
