/**
 * Common Actions - الإجراءات المشتركة
 * المرجع الوحيد للنسخ/القص/اللصق والإجراءات العامة
 */

import { toast } from "sonner";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";

/**
 * نسخ العناصر المحددة
 */
export function copyElements(selectedIds: string[]): void {
  const { copyElements: copy } = useCanvasStore.getState();
  copy(selectedIds);
  toast.success("تم نسخ العناصر");
}

/**
 * قص العناصر المحددة
 */
export function cutElements(selectedIds: string[]): void {
  const { cutElements: cut } = useCanvasStore.getState();
  cut(selectedIds);
  toast.success("تم قص العناصر");
}

/**
 * لصق العناصر من الحافظة
 */
export function pasteElements(): boolean {
  const { clipboard, pasteElements: paste } = useCanvasStore.getState();
  if (clipboard.length > 0) {
    paste();
    toast.success("تم لصق العناصر");
    return true;
  } else {
    toast.error("الحافظة فارغة");
    return false;
  }
}

/**
 * تكرار العناصر
 */
export function duplicateElements(selectedIds: string[]): void {
  const { duplicateElement } = useCanvasStore.getState();
  selectedIds.forEach((id) => duplicateElement(id));
  toast.success("تم تكرار العناصر");
}

/**
 * حذف العناصر
 */
export function deleteElements(selectedIds: string[]): void {
  const { deleteElements: del } = useCanvasStore.getState();
  del(selectedIds);
  toast.success("تم حذف العناصر");
}

/**
 * قفل العناصر
 */
export function lockElements(selectedIds: string[]): void {
  const { lockElements: lock } = useCanvasStore.getState();
  lock(selectedIds);
  toast.success("تم قفل العناصر");
}

/**
 * فك قفل العناصر
 */
export function unlockElements(selectedIds: string[]): void {
  const { unlockElements: unlock } = useCanvasStore.getState();
  unlock(selectedIds);
  toast.success("تم إلغاء قفل العناصر");
}

/**
 * تبديل حالة القفل
 */
export function toggleLock(selectedIds: string[], isLocked: boolean): void {
  if (isLocked) {
    unlockElements(selectedIds);
  } else {
    lockElements(selectedIds);
  }
}

/**
 * تبديل الرؤية
 */
export function toggleVisibility(
  selectedIds: string[],
  elements: CanvasElement[],
  isVisible: boolean
): void {
  const { updateElement } = useCanvasStore.getState();
  selectedIds.forEach((id) => {
    updateElement(id, { visible: !isVisible });
  });
  toast.success(isVisible ? "تم إخفاء العناصر" : "تم إظهار العناصر");
}

/**
 * نقل العناصر للأمام
 */
export function bringToFront(selectedIds: string[]): void {
  const { elements } = useCanvasStore.getState();
  const selectedSet = new Set(selectedIds);
  const selected = elements.filter((el) => selectedSet.has(el.id));
  const others = elements.filter((el) => !selectedSet.has(el.id));
  useCanvasStore.setState({ elements: [...others, ...selected] });
  toast.success("تم نقل العنصر للأمام");
}

/**
 * نقل العناصر خطوة للأمام
 */
export function bringForward(selectedIds: string[]): void {
  const { elements } = useCanvasStore.getState();
  const newElements = [...elements];
  [...selectedIds].reverse().forEach((id) => {
    const idx = newElements.findIndex((el) => el.id === id);
    if (idx >= 0 && idx < newElements.length - 1) {
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
    }
  });
  useCanvasStore.setState({ elements: newElements });
  toast.success("تم رفع العنصر");
}

/**
 * نقل العناصر خطوة للخلف
 */
export function sendBackward(selectedIds: string[]): void {
  const { elements } = useCanvasStore.getState();
  const newElements = [...elements];
  selectedIds.forEach((id) => {
    const idx = newElements.findIndex((el) => el.id === id);
    if (idx > 0) {
      [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
    }
  });
  useCanvasStore.setState({ elements: newElements });
  toast.success("تم خفض العنصر");
}

/**
 * نقل العناصر للخلف
 */
export function sendToBack(selectedIds: string[]): void {
  const { elements } = useCanvasStore.getState();
  const selectedSet = new Set(selectedIds);
  const selected = elements.filter((el) => selectedSet.has(el.id));
  const others = elements.filter((el) => !selectedSet.has(el.id));
  useCanvasStore.setState({ elements: [...selected, ...others] });
  toast.success("تم نقل العنصر للخلف");
}

/**
 * تغيير الطبقة
 */
export function changeLayer(selectedIds: string[], layerId: string): void {
  const { updateElement, addLayer, layers } = useCanvasStore.getState();

  if (layerId === "new") {
    const newLayerName = `طبقة ${layers.length + 1}`;
    addLayer(newLayerName);
    toast.success(`تم إنشاء ${newLayerName}`);
  } else {
    selectedIds.forEach((id) => {
      updateElement(id, { layerId });
    });
    toast.success("تم نقل العناصر إلى الطبقة");
  }
}

/**
 * إضافة نص جديد
 */
export function addNewText(position: { x: number; y: number }): void {
  const { addElement } = useCanvasStore.getState();
  addElement({
    type: "text",
    position,
    size: { width: 200, height: 40 },
    content: "نص جديد",
    style: { fontSize: 16 },
  });
  toast.success("تم إضافة نص جديد");
}
