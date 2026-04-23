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
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function useFloatingPosition({ activeElements, editingTextId, viewport: _viewport, hasSelection }: UseFloatingPositionProps): Position {
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

  const getAnchorElement = useCallback((elementId: string): HTMLElement | null => {
    const selectionAnchor = document.querySelector(`[data-selection-anchor-id="${elementId}"]`) as HTMLElement | null;
    if (selectionAnchor) return selectionAnchor;

    const legacyElement = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement | null;
    return legacyElement;
  }, []);

  const getElementRects = useCallback((elementIds: string[]) => {
    return elementIds
      .map((elementId) => getAnchorElement(elementId)?.getBoundingClientRect() || null)
      .filter((rect): rect is DOMRect => rect !== null);
  }, [getAnchorElement]);

  const createBoardLocalAnchor = useCallback((rects: DOMRect[], boardRect: DOMRect): AnchorRect | null => {
    if (rects.length === 0) return null;

    const minLeft = Math.min(...rects.map((rect) => rect.left));
    const minTop = Math.min(...rects.map((rect) => rect.top));
    const maxRight = Math.max(...rects.map((rect) => rect.right));

    return {
      centerX: minLeft - boardRect.left + (maxRight - minLeft) / 2,
      top: minTop - boardRect.top,
    };
  }, []);

  const calculateFromEditorDom = useCallback((boardRect: DOMRect): AnchorRect | null => {
    if (!editingTextId) return null;
    const rects = getElementRects([editingTextId]);
    return createBoardLocalAnchor(rects, boardRect);
  }, [createBoardLocalAnchor, editingTextId, getElementRects]);

  const calculateFromSelectionBounds = useCallback((boardRect: DOMRect): AnchorRect | null => {
    if (activeElements.length === 0) return null;

    const elementRects = getElementRects(activeElements.map((element) => element.id));
    return createBoardLocalAnchor(elementRects, boardRect);
  }, [activeElements, createBoardLocalAnchor, getElementRects]);

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

    const anchor = editingTextId ? calculateFromEditorDom(boardRect) : calculateFromSelectionBounds(boardRect);
    if (!anchor) {
      updatePositionIfNeeded(HIDDEN_POSITION);
      return;
    }

    const innerWidth = boardRect.width - TOOLBAR_MARGIN * 2;
    if (toolbar.width > innerWidth) {
      updatePositionIfNeeded(HIDDEN_POSITION);
      return;
    }

    const minLeft = TOOLBAR_MARGIN;
    const maxLeft = boardRect.width - TOOLBAR_MARGIN - toolbar.width;
    const idealLeft = anchor.centerX - toolbar.width / 2;
    const finalLeft = clamp(idealLeft, minLeft, maxLeft);

    const topLimit = TOOLBAR_MARGIN;
    const idealTop = anchor.top - toolbar.height - TOOLBAR_MARGIN;

    updatePositionIfNeeded({
      x: finalLeft + toolbar.width / 2,
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
    const overlayElement = document.querySelector('[data-floating-overlay="true"]') as HTMLElement | null;
    const toolbarElement = document.querySelector('[data-floating-toolbar="true"]') as HTMLElement | null;

    const observedElementIds = Array.from(new Set([
      ...activeElements.map((element) => element.id),
      ...(editingTextId ? [editingTextId] : []),
    ]));

    observedElementIds.forEach((elementId) => {
      const anchorElement = getAnchorElement(elementId);
      if (!anchorElement) return;
      mutationObserver.observe(anchorElement, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
      resizeObserver.observe(anchorElement);
    });

    if (boardElement) resizeObserver.observe(boardElement);
    if (overlayElement) resizeObserver.observe(overlayElement);
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
  }, [activeElements, calculatePosition, editingTextId, getAnchorElement]);

  return position;
}

export default useFloatingPosition;
