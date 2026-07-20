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

interface ContextualToolbarManagerProps {
  boardId?: string | null;
}

const ContextualToolbarManager: React.FC<ContextualToolbarManagerProps> = ({ boardId }) => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const editingTextId = useCanvasStore((state) => state.editingTextId);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const elements = useCanvasStore((state) => state.elements);

  // إخفاء الشريط العائم كلياً عند تحديد أي موصل — إعداداته تُدار من السايد بانل حصراً
  const selectionContainsConnector = React.useMemo(() => {
    if (selectedElementIds.length === 0) return false;
    const idSet = new Set(selectedElementIds);
    return elements.some(
      (el) => idSet.has(el.id) && (el.type === 'mindmap_connector' || el.type === 'visual_connector')
    );
  }, [selectedElementIds, elements]);

  const toolbarMode = determineToolbarMode(activeTool, editingTextId, selectedElementIds);

  if (selectionContainsConnector && !editingTextId) return null;

  switch (toolbarMode) {
    case "floating":
      return <FloatingBar boardId={boardId} />;
    case "none":
    default:
      return null;
  }
};

export default ContextualToolbarManager;
