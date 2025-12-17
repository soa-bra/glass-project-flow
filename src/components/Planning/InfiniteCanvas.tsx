import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import CanvasElement from "./CanvasElement";
import SelectionBox from "./SelectionBox";
import StrokesLayer from "./StrokesLayer";
import { screenToCanvasCoordinates, clampZoom } from "@/utils/canvasCoordinates";
import { isTypingTarget } from "@/utils/canvasUtils";

const InfiniteCanvas: React.FC<{ boardId: string }> = ({ boardId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { elements, viewport, settings, selectedElementIds, activeTool, clearSelection, setViewport } =
    useCanvasStore();

  /* ===================== Pan State ===================== */
  const panning = useRef(false);
  const panPointer = useRef<number | null>(null);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const raf = useRef<number | null>(null);
  const nextPan = useRef<{ x: number; y: number } | null>(null);

  const commitPan = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      if (!nextPan.current) return;
      setViewport({ pan: nextPan.current });
      nextPan.current = null;
    });
  };

  /* ===================== Selection Box ===================== */
  const [selecting, setSelecting] = useState(false);
  const [selStart, setSelStart] = useState<{ x: number; y: number; shift: boolean } | null>(null);
  const [selNow, setSelNow] = useState<{ x: number; y: number } | null>(null);

  /* ===================== Virtualization ===================== */
  const bounds = useMemo(() => {
    const w = containerRef.current?.clientWidth ?? window.innerWidth;
    const h = containerRef.current?.clientHeight ?? window.innerHeight;
    return {
      x: -viewport.pan.x / viewport.zoom,
      y: -viewport.pan.y / viewport.zoom,
      w: w / viewport.zoom,
      h: h / viewport.zoom,
    };
  }, [viewport]);

  const visibleElements = useMemo(() => {
    const pad = 300;
    return elements.filter((e) => {
      if (e.visible === false) return false;
      return (
        e.position.x + e.size.width > bounds.x - pad &&
        e.position.x < bounds.x + bounds.w + pad &&
        e.position.y + e.size.height > bounds.y - pad &&
        e.position.y < bounds.y + bounds.h + pad
      );
    });
  }, [elements, bounds]);

  /* ===================== Wheel (Zoom to Cursor) ===================== */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const before = screenToCanvasCoordinates(e.clientX, e.clientY, viewport, rect);
      const delta = -e.deltaY * 0.001;
      const nextZoom = clampZoom(viewport.zoom * (1 + delta));

      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      setViewport({
        zoom: nextZoom,
        pan: {
          x: cx - before.x * nextZoom,
          y: cy - before.y * nextZoom,
        },
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [viewport, setViewport]);

  /* ===================== Pointer Events ===================== */
  const onPointerDown = (e: React.PointerEvent) => {
    if (isTypingTarget(e.target)) return;

    // Pan: middle OR alt + left
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      panning.current = true;
      panPointer.current = e.pointerId;
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: viewport.pan.x,
        panY: viewport.pan.y,
      };
      containerRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    // Box select
    if (
      e.button === 0 &&
      activeTool === "selection_tool" &&
      !(e.target as HTMLElement).closest("[data-canvas-element]")
    ) {
      const r = containerRef.current!.getBoundingClientRect();
      if (!e.shiftKey) clearSelection();
      setSelecting(true);
      setSelStart({ x: e.clientX - r.left, y: e.clientY - r.top, shift: e.shiftKey });
      setSelNow({ x: e.clientX - r.left, y: e.clientY - r.top });
      containerRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (panning.current && panPointer.current === e.pointerId) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      nextPan.current = {
        x: panStart.current.panX + dx,
        y: panStart.current.panY + dy,
      };
      commitPan();
      return;
    }

    if (selecting && selStart) {
      const r = containerRef.current!.getBoundingClientRect();
      setSelNow({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (panning.current) {
      panning.current = false;
      panPointer.current = null;
    }

    if (selecting && selStart && selNow) {
      const minX = Math.min(selStart.x, selNow.x);
      const maxX = Math.max(selStart.x, selNow.x);
      const minY = Math.min(selStart.y, selNow.y);
      const maxY = Math.max(selStart.y, selNow.y);

      const hits = elements
        .filter((el) => {
          const sx = el.position.x * viewport.zoom + viewport.pan.x;
          const sy = el.position.y * viewport.zoom + viewport.pan.y;
          const sw = el.size.width * viewport.zoom;
          const sh = el.size.height * viewport.zoom;
          return sx < maxX && sx + sw > minX && sy < maxY && sy + sh > minY;
        })
        .map((e) => e.id);

      useCanvasStore
        .getState()
        .selectElements(
          selStart.shift ? Array.from(new Set([...useCanvasStore.getState().selectedElementIds, ...hits])) : hits,
        );
    }

    setSelecting(false);
    setSelStart(null);
    setSelNow(null);

    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ background: settings.background, touchAction: "none" }}
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          willChange: "transform",
        }}
      >
        <StrokesLayer />
        {visibleElements.map((el) => (
          <CanvasElement key={el.id} element={el} isSelected={selectedElementIds.includes(el.id)} />
        ))}
      </div>

      {selecting && selStart && selNow && (
        <SelectionBox startX={selStart.x} startY={selStart.y} currentX={selNow.x} currentY={selNow.y} />
      )}
    </div>
  );
};

export default InfiniteCanvas;
