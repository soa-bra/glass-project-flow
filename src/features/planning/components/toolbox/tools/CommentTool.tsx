"use client";
import React from "react";
import { useTools } from "@/src/features/planning/store/tools.store";
import { usePanels } from "@/src/features/planning/store/panels.store";

const CommentTool: React.FC = () => {
  const { activeTool, setActiveTool } = useTools();
  const { setCommentsOpen } = usePanels();

  return (
    <button
      aria-label="Comment (C)"
      onClick={() => { setActiveTool("comment"); setCommentsOpen(true); }}
      className={`w-10 h-10 rounded border ${activeTool==="comment" ? "bg-blue-50 border-blue-300" : "bg-white"}`}
      title="Comment (C)"
    >
      💬
    </button>
  );
};
export default CommentTool;
