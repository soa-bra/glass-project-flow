/**
 * useFloatingPosition - حساب موقع الشريط الطافي
 * Event-driven بدلاً من polling
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { CanvasElement } from "@/types/canvas";

interface Position {
  x: number;
  y: number;
}

interface ViewportState {
  zoom: number;
  pan: { x: number; y: number };
}

interface UseFloatingPositionProps {
  activeElements: CanvasElement[];
  editingTextId: string | null;
  viewport: ViewportState;
  hasSelection: boolean;
}

/**
 * حساب موقع الشريط الطافي بناءً على التحديد أو العنصر المحرر
 * أثناء تحرير النص:
 * - نعتمد فقط على DOM rect للمحرر
 * أثناء التحديد:
 * - نعتمد فقط على bounds العناصر
 */
export function useFloatingPosition({
  activeElements,
  editingTextId,
  viewport,
  hasSelection,
}: UseFloatingPositionProps): Position {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });

  const updatePositionIfNeeded = useCallback((next: Position) => {
    if (Math.abs(next.x - lastPositionRef.current.x) > 2 || Math.abs(next.y - lastPositionRef.current.y) > 2) {
      lastPositionRef.current = next;
      setPosition(next);
    }
  }, []);

  const calculateFromEditorDom = useCallback((): Position | null => {
    if (!editingTextId) return null;

    const editorElement = document.querySelector(`[data-element-id="${editingTextId}"]`) as HTMLElement | null;

    if (!editorElement) return null;

    const rect = editorElement.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: Math.max(70, rect.top - 60),
    };
  }, [editingTextId]);

  const calculateFromSelectionBounds = useCallback((): Position | null => {
    if (activeElements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    activeElements.forEach((el) => {
      const x = el.position.x;
      const y = el.position.y;
      const width = el.size?.width || 200;
      const height = el.size?.height || 100;

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + width > maxX) maxX = x + width;
      if (y + height > maxY) maxY = y + height;
    });

    const selectionCenterX = (minX + maxX) / 2;
    const screenCenterX = selectionCenterX * viewport.zoom + viewport.pan.x;
    const screenTopY = minY * viewport.zoom + viewport.pan.y - 60;

    return {
      x: screenCenterX,
      y: Math.max(70, screenTopY),
    };
  }, [activeElements, viewport.zoom, viewport.pan.x, viewport.pan.y]);

  const calculatePosition = useCallback(() => {
    if (!hasSelection) return;

    // أولا- وضع تحرير النص له أولوية كاملة
    if (editingTextId) {
      const editorPosition = calculateFromEditorDom();
      if (editorPosition) {
        updatePositionIfNeeded(editorPosition);
      }
      return;
    }

    // ثانيا- وضع التحديد العام
    const selectionPosition = calculateFromSelectionBounds();
    if (selectionPosition) {
      updatePositionIfNeeded(selectionPosition);
    }
  }, [hasSelection, editingTextId, calculateFromEditorDom, calculateFromSelectionBounds, updatePositionIfNeeded]);

  useEffect(() => {
    calculatePosition();

    const scheduleUpdate = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        calculatePosition();
        rafRef.current = null;
      });
    };

    const mutationObserver = new MutationObserver(() => {
      scheduleUpdate();
    });

    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    if (editingTextId) {
      const editorElement = document.querySelector(`[data-element-id="${editingTextId}"]`) as HTMLElement | null;

      if (editorElement) {
        mutationObserver.observe(editorElement, {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: true,
        });

        resizeObserver.observe(editorElement);
      }
    }

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [calculatePosition, editingTextId]);

  return position;
}

export default useFloatingPosition;
