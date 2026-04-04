/**
 * ContextualToolbarManager - مدير الأشرطة السياقي
 * يتحكم بإظهار شريط واحد فقط في أي وقت
 * 
 * قواعد الأولوية:
 * 1. Tool Mode = Pen/Eraser → PenToolbar فقط
 * 2. Editing Text → FloatingBar (Text mode)
 * 3. Selection موجود → FloatingBar (حسب type)
 * 4. غير كذا → لا شيء
 */

import React from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import FloatingBar from "./floating-bar";
import { PenFloatingToolbar } from "@/components/ui/penToolbar";
import type { ToolbarMode } from "./floating-bar/types";

/**
 * تحديد الشريط المناسب للعرض
 */
function determineToolbarMode(
  activeTool: string,
  editingTextId: string | null,
  selectedElementIds: string[]
): ToolbarMode {
  // أولوية 1: وضع القلم/الممحاة
  if (activeTool === "smart_pen") {
    return "pen";
  }

  // أولوية 2: تحرير النص
  if (editingTextId) {
    return "floating";
  }

  // أولوية 3: تحديد موجود
  if (selectedElementIds.length > 0) {
    return "floating";
  }

  // أولوية 4: لا شيء
  return "none";
}

const ContextualToolbarManager: React.FC = () => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const editingTextId = useCanvasStore((state) => state.editingTextId);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);

  const toolbarMode = determineToolbarMode(activeTool, editingTextId, selectedElementIds);

  // شريط واحد فقط في أي وقت
  switch (toolbarMode) {
    case "pen":
      return <PenFloatingToolbar isVisible={true} />;
    case "floating":
      return <FloatingBar />;
    case "none":
    default:
      return null;
  }
};

export default ContextualToolbarManager;
