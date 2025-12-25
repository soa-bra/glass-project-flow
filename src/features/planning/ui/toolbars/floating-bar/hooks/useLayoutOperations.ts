/**
 * useLayoutOperations - عمليات التخطيط والتوزيع والمحاذاة
 */

import { useCallback } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";

interface LayoutOperationsResult {
  // المحاذاة الأفقية
  alignHorizontally: (align: "right" | "center" | "left") => void;
  // المحاذاة العمودية
  alignVertically: (align: "top" | "middle" | "bottom") => void;
  // التوزيع الأفقي
  distributeHorizontally: () => void;
  // التوزيع العمودي
  distributeVertically: () => void;
  // فك التداخل
  resolveOverlaps: () => void;
}

/**
 * Hook لعمليات التخطيط والتوزيع
 */
export function useLayoutOperations(): LayoutOperationsResult {
  const elements = useCanvasStore((state) => state.elements);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const updateElement = useCanvasStore((state) => state.updateElement);

  // الحصول على العناصر المحددة
  const getSelectedElements = useCallback(() => {
    return elements.filter((el) => selectedElementIds.includes(el.id));
  }, [elements, selectedElementIds]);

  // المحاذاة الأفقية
  const alignHorizontally = useCallback(
    (align: "right" | "center" | "left") => {
      const selectedElements = getSelectedElements();
      if (selectedElements.length < 2) return;

      // حساب الحدود
      const bounds = calculateBounds(selectedElements);

      selectedElements.forEach((el) => {
        let newX: number;
        switch (align) {
          case "right":
            newX = bounds.maxX - el.size.width;
            break;
          case "center":
            newX = bounds.minX + (bounds.maxX - bounds.minX) / 2 - el.size.width / 2;
            break;
          case "left":
            newX = bounds.minX;
            break;
        }
        updateElement(el.id, { position: { ...el.position, x: newX } });
      });
    },
    [getSelectedElements, updateElement]
  );

  // المحاذاة العمودية
  const alignVertically = useCallback(
    (align: "top" | "middle" | "bottom") => {
      const selectedElements = getSelectedElements();
      if (selectedElements.length < 2) return;

      const bounds = calculateBounds(selectedElements);

      selectedElements.forEach((el) => {
        let newY: number;
        switch (align) {
          case "top":
            newY = bounds.minY;
            break;
          case "middle":
            newY = bounds.minY + (bounds.maxY - bounds.minY) / 2 - el.size.height / 2;
            break;
          case "bottom":
            newY = bounds.maxY - el.size.height;
            break;
        }
        updateElement(el.id, { position: { ...el.position, y: newY } });
      });
    },
    [getSelectedElements, updateElement]
  );

  // التوزيع الأفقي
  const distributeHorizontally = useCallback(() => {
    const selectedElements = getSelectedElements();
    if (selectedElements.length < 3) return;

    // ترتيب حسب X
    const sorted = [...selectedElements].sort((a, b) => a.position.x - b.position.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // حساب المسافة الإجمالية
    const totalWidth = sorted.reduce((sum, el) => sum + el.size.width, 0);
    const totalSpace = last.position.x + last.size.width - first.position.x - totalWidth;
    const gap = totalSpace / (sorted.length - 1);

    let currentX = first.position.x + first.size.width + gap;
    for (let i = 1; i < sorted.length - 1; i++) {
      updateElement(sorted[i].id, {
        position: { ...sorted[i].position, x: currentX },
      });
      currentX += sorted[i].size.width + gap;
    }
  }, [getSelectedElements, updateElement]);

  // التوزيع العمودي
  const distributeVertically = useCallback(() => {
    const selectedElements = getSelectedElements();
    if (selectedElements.length < 3) return;

    // ترتيب حسب Y
    const sorted = [...selectedElements].sort((a, b) => a.position.y - b.position.y);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // حساب المسافة الإجمالية
    const totalHeight = sorted.reduce((sum, el) => sum + el.size.height, 0);
    const totalSpace = last.position.y + last.size.height - first.position.y - totalHeight;
    const gap = totalSpace / (sorted.length - 1);

    let currentY = first.position.y + first.size.height + gap;
    for (let i = 1; i < sorted.length - 1; i++) {
      updateElement(sorted[i].id, {
        position: { ...sorted[i].position, y: currentY },
      });
      currentY += sorted[i].size.height + gap;
    }
  }, [getSelectedElements, updateElement]);

  // فك التداخل
  const resolveOverlaps = useCallback(() => {
    const selectedElements = getSelectedElements();
    if (selectedElements.length < 2) return;

    const padding = 20;
    const positions = new Map<string, { x: number; y: number }>();

    // نسخ المواقع الحالية
    selectedElements.forEach((el) => {
      positions.set(el.id, { ...el.position });
    });

    // التحقق من التداخل وإصلاحه
    let hasOverlap = true;
    let iterations = 0;
    const maxIterations = 100;

    while (hasOverlap && iterations < maxIterations) {
      hasOverlap = false;
      iterations++;

      for (let i = 0; i < selectedElements.length; i++) {
        for (let j = i + 1; j < selectedElements.length; j++) {
          const elA = selectedElements[i];
          const elB = selectedElements[j];
          const posA = positions.get(elA.id)!;
          const posB = positions.get(elB.id)!;

          // التحقق من التداخل
          const overlapX =
            posA.x < posB.x + elB.size.width + padding &&
            posA.x + elA.size.width + padding > posB.x;
          const overlapY =
            posA.y < posB.y + elB.size.height + padding &&
            posA.y + elA.size.height + padding > posB.y;

          if (overlapX && overlapY) {
            hasOverlap = true;

            // إزاحة العنصر الثاني
            const centerAX = posA.x + elA.size.width / 2;
            const centerBX = posB.x + elB.size.width / 2;
            const centerAY = posA.y + elA.size.height / 2;
            const centerBY = posB.y + elB.size.height / 2;

            const dx = centerBX - centerAX;
            const dy = centerBY - centerAY;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;

            const moveX = (dx / distance) * 10;
            const moveY = (dy / distance) * 10;

            positions.set(elB.id, {
              x: posB.x + moveX,
              y: posB.y + moveY,
            });
          }
        }
      }
    }

    // تطبيق المواقع الجديدة
    positions.forEach((pos, id) => {
      updateElement(id, { position: pos });
    });
  }, [getSelectedElements, updateElement]);

  return {
    alignHorizontally,
    alignVertically,
    distributeHorizontally,
    distributeVertically,
    resolveOverlaps,
  };
}

// دالة مساعدة لحساب الحدود
function calculateBounds(elements: CanvasElement[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    minX = Math.min(minX, el.position.x);
    minY = Math.min(minY, el.position.y);
    maxX = Math.max(maxX, el.position.x + el.size.width);
    maxY = Math.max(maxY, el.position.y + el.size.height);
  });

  return { minX, minY, maxX, maxY };
}

export default useLayoutOperations;
