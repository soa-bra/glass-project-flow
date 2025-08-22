"use client";
import React from "react";
import { useTools } from "@/features/planning/store/tools.store";
import { usePanels } from "@/features/planning/store/panels.store";

const TextTool: React.FC = () => {
  const { activeTool, setActiveTool } = useTools();
  const { openPanel } = usePanels();
  return (
    <button
      aria-label="Text (T)"
      onClick={() => { setActiveTool("text"); openPanel("text_panel"); }}
      className={`w-10 h-10 rounded border ${activeTool==="text" ? "bg-blue-50 border-blue-300" : "bg-white"}`}
      title="Text (T)"
    >
      ✍️
    </button>
  );
};
export default TextTool;
