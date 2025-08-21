"use client";
import React from "react";
import { useTools } from "@/src/features/planning/store/tools.store";
import { usePanels } from "@/src/features/planning/store/panels.store";

const ShapesTool: React.FC<{ onCategoryChange: (c: string | null) => void }> = ({ onCategoryChange }) => {
  const { activeTool, setActiveTool } = useTools();
  const { openPanel } = usePanels();
  return (
    <button
      aria-label="Shapes (R)"
      onClick={() => { setActiveTool("shapes"); openPanel("shapes_panel"); onCategoryChange("shapes"); }}
      className={`w-10 h-10 rounded border ${activeTool==="shapes" ? "bg-blue-50 border-blue-300" : "bg-white"}`}
      title="Shapes (R)"
    >
      ⬛
    </button>
  );
};
export default ShapesTool;
