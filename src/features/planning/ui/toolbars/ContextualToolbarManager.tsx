/**
 * ContextualToolbarManager - مدير الأشرطة السياقي
 * يتحكم بإظهار شريط واحد فقط في أي وقت
 * 
 * قواعد الأولوية:
 * 1. Tool Mode = Pen/Eraser → PenToolbar فقط (مستقل)
 * 2. Editing Text → TextEditBar
 * 3. Selection موجود → شريط حسب نوع التحديد
 * 4. غير كذا → لا شيء
 */

import React from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { PenFloatingToolbar } from "@/components/ui/penToolbar";
import { useSelectionMeta } from "./floating-bar/hooks/useSelectionMeta";

// Bars
import {
  SingleElementBar,
  MultiSelectBar,
  TextEditBar,
  ImageBar,
  MindmapBar,
  VisualDiagramBar,
} from "./floating-bar/bars";

const ContextualToolbarManager: React.FC = () => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const editingTextId = useCanvasStore((state) => state.editingTextId);
  const selectionMeta = useSelectionMeta();

  // أولوية 1: وضع القلم
  if (activeTool === "smart_pen") {
    return <PenFloatingToolbar isVisible={true} />;
  }

  // أولوية 2: تحرير النص
  if (editingTextId) {
    return <TextEditBar />;
  }

  // أولوية 3: تحديد موجود - حسب النوع
  if (!selectionMeta.hasSelection || selectionMeta.selectionType === null) {
    return null;
  }

  // الخريطة الذهنية
  if (selectionMeta.isMindmapSelection) {
    return <MindmapBar />;
  }

  // المخطط البصري
  if (selectionMeta.selectionType === "visual_diagram") {
    return <VisualDiagramBar />;
  }

  switch (selectionMeta.selectionType) {
    case "text":
      return <TextEditBar />;
    case "image":
      return <ImageBar />;
    case "multiple":
      return <MultiSelectBar />;
    case "element":
      return <SingleElementBar />;
    default:
      return null;
  }
};

export default ContextualToolbarManager;
