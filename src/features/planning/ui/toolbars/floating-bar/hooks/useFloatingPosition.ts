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

interface AnchorRect {
  centerX: number;
  top: number;
}

const HIDDEN_POSITION: Position = { x: -9999, y: -9999 };
const TOOLBAR_MARGIN = 8;
const MAX_ELASTIC_SHIFT_RATIO = 0.15;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function useFloatingPosition({ activeElements, editingTextId, viewport, hasSelection }: UseFloatingPositionProps): Position {
  const [position, setPosition] = useState<Position>(HIDDEN_POSITION);
  const rafRef = useRef<number | null>(null);
  const lastPositionRef = useRef<Position>(HIDDEN_POSITION);

  const updatePositionIfNeeded = useCallback((next: Position) => {
    if (Math.abs(next.x - lastPositionRef.current.x) > 2 || Math.abs(next.y - lastPositionRef.current.y) > 2) {
      lastPositionRef.current = next;
      setPosition(next);
    }
  }, []);

  const getBoardRect = useCallback((): DOMRect | null => {
    const boardFrame = document.querySelector('[data-board-frame="true"]') as HTMLElement | null;
    if (boardFrame) return boardFrame.getBoundingClientRect();

    const fallbackCanvas = document.querySelector('[data-canvas-container="true"]') as HTMLElement | null;
    return fallbackCanvas?.getBoundingClientRect() || null;
  }, []);

  const getToolbarMetrics = useCallback(() => {
    const toolbarElement = document.querySelector('[data-floating-toolbar="true"]') as HTMLElement | null;
    if (!toolbarElement) return null;
    const width = toolbarElement.offsetWidth || 0;
    const height = toolbarElement.offsetHeight || 0;
    if (width <= 0 || height <= 0) return null;
    return { width, height };
  }, []);

  const calculateFromEditorDom = useCallback((): AnchorRect | null => {
    if (!editingTextId) return null;
    const editorElement = document.querySelector(`[data-element-id="${editingTextId}"]`) as HTMLElement | null;
    if (!editorElement) return null;
    const rect = editorElement.getBoundingClientRect();
    return { centerX: rect.left + rect.width / 2, top: rect.top };
  }, [editingTextId]);

  const calculateFromSelectionBounds = useCallback((): AnchorRect | null => {
    if (activeElements.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    activeElements.forEach((el) => {
      const width = el.size?.width || 200;
      const height = el.size?.height || 100;
      minX = Math.min(minX, el.position.x);
      minY = Math.min(minY, el.position.y);
      maxX = Math.max(maxX, el.position.x + width);
      maxY = Math.max(maxY, el.position.y + height);
    });

    return {
      centerX: ((minX + maxX) / 2) * viewport.zoom + viewport.pan.x,
      top: minY * viewport.zoom + viewport.pan.y,
    };
  }, [activeElements, viewport.zoom, viewport.pan.x, viewport.pan.y]);

  const calculatePosition = useCallback(() => {
    if (!hasSelection) {
      updatePositionIfNeeded(HIDDEN_POSITION);
      return;
    }

    const boardRect = getBoardRect();
    const toolbar = getToolbarMetrics();
    if (!boardRect || !toolbar) {
      updatePositionIfNeeded(HIDDEN_POSITION);
      return;
    }

    const anchor = editingTextId ? calculateFromEditorDom() : calculateFromSelectionBounds();
    if (!anchor) {
      updatePositionIfNeeded(HIDDEN_POSITION);
      return;
    }

    const innerWidth = boardRect.width - TOOLBAR_MARGIN * 2;
    if (toolbar.width > innerWidth) {
      updatePositionIfNeeded(HIDDEN_POSITION);
      return;
    }

    const minLeft = boardRect.left + TOOLBAR_MARGIN;
    const maxLeft = boardRect.right - TOOLBAR_MARGIN - toolbar.width;
    const idealLeft = anchor.centerX - toolbar.width / 2;
    const clampedLeft = clamp(idealLeft, minLeft, maxLeft);

    const overflowLeft = Math.max(0, minLeft - idealLeft);
    const overflowRight = Math.max(0, idealLeft - maxLeft);
    const elasticShift = Math.max(overflowLeft, overflowRight);
    const maxElasticShift = toolbar.width * MAX_ELASTIC_SHIFT_RATIO;

    if (elasticShift > maxElasticShift) {
      updatePositionIfNeeded(HIDDEN_POSITION);
      return;
    }

    const topLimit = boardRect.top + TOOLBAR_MARGIN;
    const idealTop = anchor.top - toolbar.height - TOOLBAR_MARGIN;

    updatePositionIfNeeded({
      x: clampedLeft + toolbar.width / 2,
      y: Math.max(topLimit, idealTop),
    });
  }, [
    hasSelection,
    getBoardRect,
    getToolbarMetrics,
    editingTextId,
    calculateFromEditorDom,
    calculateFromSelectionBounds,
    updatePositionIfNeeded,
  ]);

  useEffect(() => {
    calculatePosition();

    const scheduleUpdate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        calculatePosition();
        rafRef.current = null;
      });
    };

    const mutationObserver = new MutationObserver(scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    const boardElement = document.querySelector('[data-board-frame="true"]') as HTMLElement | null;
    const toolbarElement = document.querySelector('[data-floating-toolbar="true"]') as HTMLElement | null;

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

    if (boardElement) resizeObserver.observe(boardElement);
    if (toolbarElement) resizeObserver.observe(toolbarElement);

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [calculatePosition, editingTextId]);

  return position;
}

export default useFloatingPosition;
