/**
 * Frame Actions - إجراءات الإطار
 */

import { nanoid } from "nanoid";
import type { CanvasElement } from "@/types/canvas";

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * حساب صندوق الإحاطة لمجموعة من العناصر
 */
function calculateBoundingBox(elements: CanvasElement[]): BoundingBox {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 200, height: 150 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    const x = el.position.x;
    const y = el.position.y;
    const width = el.size?.width || 200;
    const height = el.size?.height || 100;

    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + width > maxX) maxX = x + width;
    if (y + height > maxY) maxY = y + height;
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * إنشاء إطار من العناصر المحددة
 */
export function createFrameFromSelection(
  selectedIds: string[],
  elements: CanvasElement[],
  addElement: (el: Partial<CanvasElement>) => void
): string {
  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));

  if (selectedElements.length < 2) {
    throw new Error("يجب تحديد عنصرين على الأقل لإنشاء إطار");
  }

  // 1. حساب Bounding Box
  const bounds = calculateBoundingBox(selectedElements);

  // 2. إضافة padding
  const padding = 24;

  // 3. إنشاء الإطار
  const frameId = `frame-${nanoid()}`;

  addElement({
    id: frameId,
    type: "frame",
    position: {
      x: bounds.x - padding,
      y: bounds.y - padding,
    },
    size: {
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2,
    },
    layerId: selectedElements[0]?.layerId || "default",
    visible: true,
    locked: false,
    content: "",
    style: {
      backgroundColor: "transparent",
      borderColor: "#DADCE0",
      borderWidth: 1,
      borderStyle: "dashed",
    },
    metadata: {
      children: selectedIds,
      title: "",
    },
  });

  return frameId;
}

/**
 * حذف إطار مع الحفاظ على العناصر الداخلية
 */
export function removeFrameKeepChildren(
  frameId: string,
  deleteElements: (ids: string[]) => void
): void {
  // نحذف الإطار فقط، العناصر الداخلية تبقى
  deleteElements([frameId]);
}

/**
 * حذف إطار مع محتوياته
 */
export function removeFrameWithChildren(
  frameId: string,
  elements: CanvasElement[],
  deleteElements: (ids: string[]) => void
): void {
  const frame = elements.find((el) => el.id === frameId);
  if (!frame) return;

  const childIds = (frame.metadata?.children as string[]) || [];
  deleteElements([frameId, ...childIds]);
}
