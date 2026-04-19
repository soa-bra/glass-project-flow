/**
 * useSelectionMeta - معلومات التحديد الشاملة
 */

import { useMemo } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { SelectionType, SelectionMeta, MindMapNodeData } from "../types";

/**
 * Hook لحساب جميع معلومات التحديد
 */
export function useSelectionMeta(): SelectionMeta {
  const elements = useCanvasStore((state) => state.elements);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const editingTextId = useCanvasStore((state) => state.editingTextId);

  // العناصر المحددة فعليًا من اللوحة
  // ✅ استبعاد روابط الخريطة الذهنية من نموذج التحديد العام
  const selectedElementsRaw = useMemo(
    () => elements.filter((el) => selectedElementIds.includes(el.id) && el.type !== "mindmap_connector"),
    [elements, selectedElementIds],
  );

  // العنصر النصي الذي يتم تحريره
  const editingElement = useMemo(
    () => (editingTextId ? elements.find((el) => el.id === editingTextId) : null),
    [elements, editingTextId],
  );

  // هل يوجد تحديد أو تحرير نص؟
  const hasSelection = selectedElementsRaw.length > 0 || !!editingTextId;

  // العناصر الفعلية للعمل معها
  // أولوية قصوى للنص الجاري تحريره
  const activeElements = useMemo(() => {
    if (editingTextId && editingElement) {
      return [editingElement];
    }
    return selectedElementsRaw;
  }, [editingTextId, editingElement, selectedElementsRaw]);

  const firstElement = activeElements[0] || null;
  const selectionCount = activeElements.length;

  // التحقق من عناصر الخريطة الذهنية
  const isMindmapSelection = useMemo(() => {
    return selectedElementsRaw.some((el) => el.type === "mindmap_node");
  }, [selectedElementsRaw]);

  // جمع عناصر شجرة الخريطة الذهنية
  const mindmapTreeElements = useMemo(() => {
    if (!isMindmapSelection) return [];

    const selectedNodes = selectedElementsRaw.filter((el) => el.type === "mindmap_node");

    const findRoot = (nodeId: string): string => {
      const parentConnector = elements.find(
        (el) => el.type === "mindmap_connector" && (el.data as any)?.endNodeId === nodeId,
      );
      if (parentConnector) {
        return findRoot((parentConnector.data as any).startNodeId);
      }
      return nodeId;
    };

    const collectTree = (rootId: string): string[] => {
      const result = [rootId];
      const childConnectors = elements.filter(
        (el) => el.type === "mindmap_connector" && (el.data as any)?.startNodeId === rootId,
      );

      childConnectors.forEach((conn) => {
        const childId = (conn.data as any)?.endNodeId;
        if (childId) {
          result.push(...collectTree(childId));
        }
      });

      return result;
    };

    const rootIds = new Set<string>();
    selectedNodes.forEach((node) => {
      rootIds.add(findRoot(node.id));
    });

    const allTreeNodeIds = new Set<string>();
    rootIds.forEach((rootId) => {
      collectTree(rootId).forEach((id) => allTreeNodeIds.add(id));
    });

    const allConnectorIds = elements
      .filter(
        (el) =>
          el.type === "mindmap_connector" &&
          allTreeNodeIds.has((el.data as any)?.startNodeId) &&
          allTreeNodeIds.has((el.data as any)?.endNodeId),
      )
      .map((el) => el.id);

    return elements.filter((el) => allTreeNodeIds.has(el.id) || allConnectorIds.includes(el.id));
  }, [isMindmapSelection, selectedElementsRaw, elements]);

  // اسم الخريطة الذهنية
  const mindmapName = useMemo(() => {
    if (!isMindmapSelection) return "";

    const mindmapNodes = mindmapTreeElements.filter((el) => el.type === "mindmap_node");
    const rootNode = mindmapNodes.find((node) => {
      const isRoot = !elements.some((el) => el.type === "mindmap_connector" && (el.data as any)?.endNodeId === node.id);
      return isRoot;
    });

    if (rootNode) {
      const data = rootNode.data as MindMapNodeData;
      return data?.label || "خريطة ذهنية";
    }

    return "خريطة ذهنية";
  }, [isMindmapSelection, mindmapTreeElements, elements]);

  // تحديد نوع التحديد
  const selectionType = useMemo((): SelectionType => {
    // تحرير النص له أولوية أعلى من أي selection عام
    if (editingTextId && editingElement) {
      const type = editingElement.type;
      if (type === "text") return "text";
      if (type === "shape" && (editingElement as any).shapeType === "sticky") return "text";
    }

    if (!hasSelection) return null;
    if (isMindmapSelection) return "mindmap";
    if (selectionCount > 1) return "multiple";

    const type = firstElement?.type;
    if (type === "text") return "text";
    if (type === "image") return "image";
    if (type === "visual_node" || type === "visual_connector") return "visual_diagram";
    return "element";
  }, [hasSelection, selectionCount, firstElement?.type, editingTextId, editingElement, isMindmapSelection]);

  const groupId = useMemo(() => {
    for (const el of activeElements) {
      if (el.metadata?.groupId) return el.metadata.groupId as string;
    }
    return null;
  }, [activeElements]);

  const areElementsGrouped = !!groupId;
  const areElementsLocked = activeElements.some((el) => el.locked === true);
  const areElementsVisible = activeElements.every((el) => el.visible !== false);

  return {
    selectionType,
    selectedElements: activeElements,
    firstElement,
    selectionCount,
    hasSelection,
    isMindmapSelection,
    mindmapTreeElements,
    mindmapName,
    groupId,
    areElementsGrouped,
    areElementsLocked,
    areElementsVisible,
  };
}

export default useSelectionMeta;
