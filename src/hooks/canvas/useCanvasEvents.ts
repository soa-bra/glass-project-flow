import { useEffect, useMemo, useRef } from "react";
import type { Camera } from "./canvasStore";
import { canvasStore } from "./canvasStore";
import { clamp, rafThrottle } from "./canvasUtils";
import { zoomAtPoint } from "./canvasCoordinates";
import { getViewportRect, toViewportPoint } from "./canvas-events";

export type CanvasEventsOptions = {
  /** When true: holding Space enables pan with left button */
  enableSpacePan?: boolean;
  /** When true: holding Shift enables pan with left button */
  enableShiftPan?: boolean;
};

export function useCanvasEvents(
  viewportRef: React.RefObject<HTMLDivElement>,
  options: CanvasEventsOptions = { enableSpacePan: true, enableShiftPan: true },
) {
  const opts = options;
  const stateRef = useRef({
    isPanning: false,
    lastClient: { x: 0, y: 0 },
    spaceDown: false,
  });

  const onPointerDown = useMemo(() => {
    return (e: React.PointerEvent) => {
      const vp = viewportRef.current;
      if (!vp) return;

      const isMiddle = e.button === 1;
      const isLeft = e.button === 0;

      const allowLeftPan =
        isLeft && ((opts.enableShiftPan && e.shiftKey) || (opts.enableSpacePan && stateRef.current.spaceDown));

      if (!isMiddle && !allowLeftPan) return;

      stateRef.current.isPanning = true;
      stateRef.current.lastClient = { x: e.clientX, y: e.clientY };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    };
  }, [viewportRef, opts.enableShiftPan, opts.enableSpacePan]);

  const onPointerMove = useMemo(() => {
    return rafThrottle((e: React.PointerEvent) => {
      if (!stateRef.current.isPanning) return;

      const cam = canvasStore.getState().camera;
      const dx = (e.clientX - stateRef.current.lastClient.x) / cam.zoom;
      const dy = (e.clientY - stateRef.current.lastClient.y) / cam.zoom;

      stateRef.current.lastClient = { x: e.clientX, y: e.clientY };

      canvasStore.actions.setCamera((c) => ({ x: c.x + dx, y: c.y + dy }));
      e.preventDefault();
      e.stopPropagation();
    });
  }, []);

  const onPointerUp = useMemo(() => {
    return (_e: React.PointerEvent) => {
      stateRef.current.isPanning = false;
    };
  }, []);

  const onWheel = useMemo(() => {
    return rafThrottle((e: WheelEvent) => {
      const vp = viewportRef.current;
      if (!vp) return;
      if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();

      const rect = getViewportRect(vp);
      const screen = toViewportPoint({ x: e.clientX, y: e.clientY }, rect);

      const cam = canvasStore.getState().camera;
      const nextZoom = clamp(cam.zoom * (1 - e.deltaY * 0.001), 0.2, 4);

      const next = zoomAtPoint(cam as any, nextZoom, screen as any) as Camera;
      canvasStore.actions.setCamera(next);
    });
  }, [viewportRef]);

  // Space key tracking
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") stateRef.current.spaceDown = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") stateRef.current.spaceDown = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Wheel must be registered as non-passive to allow preventDefault
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const handler = (e: WheelEvent) => onWheel(e);
    vp.addEventListener("wheel", handler, { passive: false });

    return () => {
      vp.removeEventListener("wheel", handler);
    };
  }, [viewportRef, onWheel]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
