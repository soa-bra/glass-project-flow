"use client";
import React from "react";
import { useZoomPan } from "@/features/planning/hooks/useZoomPan";

const ZoomTool: React.FC = () => {
  const { zoomIn, zoomOut, fitToScreen } = useZoomPan();
  return (
    <div className="flex flex-col items-center gap-1">
      <button aria-label="Zoom In (+)" onClick={zoomIn} className="w-10 h-10 rounded border bg-white" title="Zoom In">＋</button>
      <button aria-label="Zoom Out (-)" onClick={zoomOut} className="w-10 h-10 rounded border bg-white" title="Zoom Out">－</button>
      <button aria-label="Fit (Ctrl+0)" onClick={fitToScreen} className="w-10 h-10 rounded border bg-white" title="Fit">⤢</button>
    </div>
  );
};
export default ZoomTool;
