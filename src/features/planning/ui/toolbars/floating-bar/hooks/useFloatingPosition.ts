/**
 * useFloatingPosition - حساب موقع الشريط الطافي
 * Event-driven بدلاً من polling
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { RefObject } from "react";
import type { CanvasElement } from "@/types/canvas";

interface Position {
  x: number;
  y: number;
  visible: boolean;
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
  toolbarRef: RefObject<HTMLElement>;
}

interface AnchorRect {
  centerX: number;
  top: number;
}

const DEFAULT_POSITION: Position = { x: 0, y: 0, visible: false };
const TOOLBAR_MARGIN = 10;
const MAX_ELASTIC_SHIFT_RATIO = 0.15;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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
  toolbarRef,
}: UseFloatingPositionProps): Position {
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const rafRef = useRef<number | null>(null);
  const lastPositionRef = useRef<Position>(DEFAULT_POSITION);

  const updatePositionIfNeeded = useCallback((next: Position) => {
    const didVisibilityChange = next.visible !== lastPositionRef.current.visible;
    const didMove = Math.abs(next.x - lastPositionRef.current.x) > 2 || Math.abs(next.y - lastPositionRef.current.y) > 2;

    if (didVisibilityChange || didMove) {
      lastPositionRef.current = next;
      setPosition(next);
    }
  }, []);

  const getBoardRect = useCallback((): DOMRect | null => {
    const boardElement = document.querySelector('[data-canvas-container="true"]') as HTMLElement | null;
    return boardElement?.getBoundingClientRect() || null;
  }, []);

  const calculateFromEditorDom = useCallback((): AnchorRect | null => {
    if (!editingTextId) return null;

    const editorElement = document.querySelector(`[data-element-id="${editingTextId}"]`) as HTMLElement | null;
    if (!editorElement) return null;

    const rect = editorElement.getBoundingClientRect();
    return {
      centerX: rect.left + rect.width / 2,
      top: rect.top,
    };
  }, [editingTextId]);

  const calculateFromSelectionBounds = useCallback((): AnchorRect | null => {
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
    const screenTopY = minY * viewport.zoom + viewport.pan.y;

    return {
      centerX: screenCenterX,
      top: screenTopY,
    };
  }, [activeElements, viewport.zoom, viewport.pan.x, viewport.pan.y]);

  const calculatePosition = useCallback(() => {
    if (!hasSelection) {
      updatePositionIfNeeded(DEFAULT_POSITION);
      return;
    }

    const boardRect = getBoardRect();
    const toolbarElement = toolbarRef.current || (document.querySelector('[data-floating-toolbar="true"]') as HTMLElement | null);
    if (!boardRect || !toolbarElement) {
      updatePositionIfNeeded(DEFAULT_POSITION);
      return;
    }

    const anchorRect = editingTextId ? calculateFromEditorDom() : calculateFromSelectionBounds();
    if (!anchorRect) {
      updatePositionIfNeeded(DEFAULT_POSITION);
      return;
    }

    const toolbarWidth = toolbarElement.offsetWidth || 0;
    const toolbarHeight = toolbarElement.offsetHeight || 0;
    if (toolbarWidth <= 0 || toolbarHeight <= 0) {
      updatePositionIfNeeded(DEFAULT_POSITION);
      return;
    }

    const minLeft = boardRect.left + TOOLBAR_MARGIN;
    const maxLeft = boardRect.right - TOOLBAR_MARGIN - toolbarWidth;
    if (maxLeft < minLeft) {
      updatePositionIfNeeded(DEFAULT_POSITION);
      return;
    }

    const idealLeft = anchorRect.centerX - toolbarWidth / 2;
    const clampedLeft = clamp(idealLeft, minLeft, maxLeft);
    const requiredShift = clampedLeft - idealLeft;
    const maxElasticShift = toolbarWidth * MAX_ELASTIC_SHIFT_RATIO;

    if (Math.abs(requiredShift) > maxElasticShift) {
      updatePositionIfNeeded(DEFAULT_POSITION);
      return;
    }

    const topLimit = boardRect.top + TOOLBAR_MARGIN;
    const idealTop = anchorRect.top - toolbarHeight - TOOLBAR_MARGIN;
    const clampedTop = Math.max(topLimit, idealTop);

    updatePositionIfNeeded({
      x: clampedLeft + toolbarWidth / 2,
      y: clampedTop,
      visible: true,
    });
  }, [
    hasSelection,
    getBoardRect,
    toolbarRef,
    editingTextId,
    calculateFromEditorDom,
    calculateFromSelectionBounds,
    updatePositionIfNeeded,
  ]);

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

    const boardElement = document.querySelector('[data-canvas-container="true"]') as HTMLElement | null;
    const toolbarElement = toolbarRef.current || (document.querySelector('[data-floating-toolbar="true"]') as HTMLElement | null);

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

    if (boardElement) {
      resizeObserver.observe(boardElement);
    }

    if (toolbarElement) {
      resizeObserver.observe(toolbarElement);
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
  }, [calculatePosition, editingTextId, toolbarRef]);

  return position;
}

export default useFloatingPosition;
