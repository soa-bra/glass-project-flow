import { useEffect, useMemo, useRef, useState } from "react";
import { useCanvasEvents } from "./useCanvasEvents";
import { useOrderedElements, useSelection, canvasStore } from "./canvasStore";
import { screenToWorld } from "./canvasCoordinates";
import { getViewportRect, toViewportPoint } from "./canvas-events";
import { elementsInRect, hitTest, normalizeRect, uniqIds, type Rect } from "./useCanvasHelpers";

type ScreenRect = Rect;

export function useOptimizedCanvas(viewportRef: React.RefObject<HTMLDivElement>) {
  const elements = useOrderedElements();
  const selection = useSelection();

  // Pan + Zoom (store-driven)
  const { onPointerDown, onPointerMove, onPointerUp } = useCanvasEvents(viewportRef);

  // --- Selection Box (Marquee) state ---
  const marqueeRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startScreen: { x: number; y: number };
    curScreen: { x: number; y: number };
    additive: boolean;
  }>({
    active: false,
    pointerId: null,
    startScreen: { x: 0, y: 0 },
    curScreen: { x: 0, y: 0 },
    additive: false,
  });

  const [selectionBox, setSelectionBox] = useState<ScreenRect | null>(null);

  // Keep selectionBox updates cheap
  const updateSelectionBox = (rect: ScreenRect | null) => {
    setSelectionBox(rect);
  };

  const endMarquee = () => {
    marqueeRef.current.active = false;
    marqueeRef.current.pointerId = null;
    updateSelectionBox(null);
  };

  // Selection click + marquee start
  const onElementLayerPointerDown = useMemo(() => {
    return (e: React.PointerEvent) => {
      const vp = viewportRef.current;
      if (!vp) return;

      // Don't interfere with pan gestures (middle button or shift-pan)
      if (e.button === 1) return;
      if (e.button === 0 && e.shiftKey) return;

      const rect = getViewportRect(vp);
      const screen = toViewportPoint({ x: e.clientX, y: e.clientY }, rect);

      const cam = canvasStore.getState().camera;
      const world = screenToWorld(screen, cam);

      const hit = hitTest(elements, world);

      // If hit element => normal selection
      if (hit) {
        const additive = e.metaKey || e.ctrlKey;
        if (!additive) {
          canvasStore.actions.setSelection([hit], hit);
        } else {
          const next = uniqIds([...selection.ids, hit]);
          canvasStore.actions.setSelection(next, hit);
        }
        return;
      }

      // Empty space => start marquee
      const additive = e.metaKey || e.ctrlKey; // hold ctrl/meta to add to selection
      marqueeRef.current.active = true;
      marqueeRef.current.pointerId = e.pointerId;
      marqueeRef.current.startScreen = { x: screen.x, y: screen.y };
      marqueeRef.current.curScreen = { x: screen.x, y: screen.y };
      marqueeRef.current.additive = additive;

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();

      updateSelectionBox(normalizeRect(marqueeRef.current.startScreen, marqueeRef.current.curScreen));
    };
  }, [viewportRef, elements, selection.ids]);

  // Marquee move/up on window to be robust
  useEffect(() => {
    const onMove = (ev: PointerEvent) => {
      if (!marqueeRef.current.active) return;
      const vp = viewportRef.current;
      if (!vp) return;
      if (marqueeRef.current.pointerId !== ev.pointerId) return;

      const rect = getViewportRect(vp);
      const screen = toViewportPoint({ x: ev.clientX, y: ev.clientY }, rect);

      marqueeRef.current.curScreen = { x: screen.x, y: screen.y };
      updateSelectionBox(normalizeRect(marqueeRef.current.startScreen, marqueeRef.current.curScreen));
    };

    const onUp = (ev: PointerEvent) => {
      if (!marqueeRef.current.active) return;
      const vp = viewportRef.current;
      if (!vp) return;
      if (marqueeRef.current.pointerId !== ev.pointerId) return;

      const rect = getViewportRect(vp);
      const endScreen = toViewportPoint({ x: ev.clientX, y: ev.clientY }, rect);

      const start = marqueeRef.current.startScreen;
      const end = endScreen;

      const screenRect = normalizeRect(start, end);

      // Click threshold: if tiny drag, treat as clear selection
      const dragPixels = Math.hypot(screenRect.w, screenRect.h);
      const clickLike = dragPixels < 6;

      if (clickLike) {
        if (!marqueeRef.current.additive) canvasStore.actions.clearSelection();
        endMarquee();
        return;
      }

      // Convert marquee rect to world rect for hit testing
      const cam = canvasStore.getState().camera;
      const w1 = screenToWorld({ x: screenRect.x, y: screenRect.y }, cam);
      const w2 = screenToWorld({ x: screenRect.x + screenRect.w, y: screenRect.y + screenRect.h }, cam);
      const worldRect = normalizeRect(w1, w2);

      const hits = elementsInRect(elements, worldRect);

      if (!marqueeRef.current.additive) {
        if (hits.length === 0) canvasStore.actions.clearSelection();
        else canvasStore.actions.setSelection(hits, hits[0]);
      } else {
        const next = uniqIds([...selection.ids, ...hits]);
        if (next.length === 0) canvasStore.actions.clearSelection();
        else canvasStore.actions.setSelection(next, next[next.length - 1]);
      }

      endMarquee();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [viewportRef, elements, selection.ids]);

  return {
    elements,
    selection,
    selectionBox, // screen-space rect (for overlay)
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onElementLayerPointerDown,
  };
}
