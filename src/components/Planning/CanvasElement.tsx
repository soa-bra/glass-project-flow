import React, { useCallback, useRef } from "react";
import { useCanvasStore } from "@/stores/canvasStore";

const CanvasElement: React.FC<{ element: any; isSelected: boolean }> = ({ element, isSelected }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { viewport, updateElement, activeTool, selectedElementIds } = useCanvasStore();

  const dragging = useRef(false);
  const pid = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0, ex: 0, ey: 0 });
  const delta = useRef({ dx: 0, dy: 0 });
  const raf = useRef<number | null>(null);

  const preview = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      if (!ref.current) return;
      ref.current.style.transform = `translate(${delta.current.dx}px, ${delta.current.dy}px)`;
    });
  };

  const onDown = (e: React.PointerEvent) => {
    if (activeTool !== "selection_tool" || e.button !== 0) return;
    e.stopPropagation();

    if (!selectedElementIds.includes(element.id)) {
      useCanvasStore.getState().selectElement(element.id, e.shiftKey);
    }

    dragging.current = true;
    pid.current = e.pointerId;
    start.current = {
      x: e.clientX,
      y: e.clientY,
      ex: element.position.x,
      ey: element.position.y,
    };
    ref.current?.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current || pid.current !== e.pointerId) return;

    const dxw = (e.clientX - start.current.x) / viewport.zoom;
    const dyw = (e.clientY - start.current.y) / viewport.zoom;

    delta.current = {
      dx: dxw * viewport.zoom,
      dy: dyw * viewport.zoom,
    };
    preview();
  };

  const onUp = (e: React.PointerEvent) => {
    if (!dragging.current || pid.current !== e.pointerId) return;
    dragging.current = false;
    pid.current = null;

    updateElement(element.id, {
      position: {
        x: start.current.ex + delta.current.dx / viewport.zoom,
        y: start.current.ey + delta.current.dy / viewport.zoom,
      },
    });

    if (ref.current) ref.current.style.transform = "";
    try {
      ref.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={ref}
      data-canvas-element
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className={`absolute ${isSelected ? "ring-2 ring-emerald-400" : ""}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        touchAction: "none",
      }}
    >
      {element.content}
    </div>
  );
};

export default CanvasElement;
