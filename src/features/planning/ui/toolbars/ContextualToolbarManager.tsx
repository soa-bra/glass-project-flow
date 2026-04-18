/**
 * ContextualToolbarManager - مدير الأشرطة السياقي
 * يعرض الشريط الطافي العام فقط عندما يكون هناك تحرير نص أو تحديد.
 */

import React from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import FloatingBar from "./floating-bar";
import type { ToolbarMode } from "./floating-bar/types";

function determineToolbarMode(
  activeTool: string,
  editingTextId: string | null,
  selectedElementIds: string[]
): ToolbarMode {
  if (activeTool === "smart_pen") {
    return "none";
  }

  if (editingTextId) {
    return "floating";
  }

  if (selectedElementIds.length > 0) {
    return "floating";
  }

  return "none";
}

const ContextualToolbarManager: React.FC = () => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const editingTextId = useCanvasStore((state) => state.editingTextId);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);

  const toolbarMode = determineToolbarMode(activeTool, editingTextId, selectedElementIds);

  switch (toolbarMode) {
    case "floating":
      return <FloatingBar />;
    case "none":
    default:
      return null;
  }
};

export default ContextualToolbarManager;
