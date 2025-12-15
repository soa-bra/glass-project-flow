import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import type { ArrowData, ArrowPoint, ArrowSegment, ArrowControlPoint as ArrowCP } from "@/types/arrow-connections";
import { createStraightArrowData, generateId } from "@/types/arrow-connections";

/* ============================================================= */
/* Helpers                                                       */
/* ============================================================= */

type Axis = "x" | "y";

type DragState = {
  isDragging: boolean;
  controlPoint: "start" | "end" | "middle" | null;
  controlPointId?: string;
  segmentId?: string | null;
  startPosition?: ArrowPoint;
  startMouse?: { x: number; y: number };
  lockedAxis?: Axis | null;
  lockedValue?: number | null;
};

const cloneP = (p: ArrowPoint): ArrowPoint => ({ x: p.x, y: p.y });

const mid = (a: ArrowPoint, b: ArrowPoint): ArrowPoint => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

const isHorizontal = (s: ArrowSegment) =>
  Math.abs(s.endPoint.y - s.startPoint.y) <= Math.abs(s.endPoint.x - s.startPoint.x);

const deepClone = (d: ArrowData): ArrowData => ({
  ...d,
  startPoint: cloneP(d.startPoint),
  endPoint: cloneP(d.endPoint),
  segments: d.segments.map((s) => ({
    ...s,
    startPoint: cloneP(s.startPoint),
    endPoint: cloneP(s.endPoint),
  })),
  controlPoints: d.controlPoints.map((c) => ({
    ...c,
    position: cloneP(c.position),
  })),
});

/* ============================================================= */
/* Control points rebuild                                        */
/* ============================================================= */

function rebuildControlPoints(data: ArrowData, active: Set<string>): ArrowData {
  const d = deepClone(data);
  const cps: ArrowCP[] = [];

  cps.push({
    id: "start",
    type: "endpoint",
    position: cloneP(d.startPoint),
    isActive: true,
    connection: null,
  });

  d.segments.forEach((s) => {
    cps.push({
      id: generateId(),
      type: "midpoint",
      segmentId: s.id,
      position: mid(s.startPoint, s.endPoint),
      isActive: active.has(s.id),
    });
  });

  cps.push({
    id: "end",
    type: "endpoint",
    position: cloneP(d.endPoint),
    isActive: true,
    connection: null,
  });

  d.controlPoints = cps;
  return d;
}

/* ============================================================= */
/* STRAIGHT → U                                                  */
/* ============================================================= */

function straightToU(data: ArrowData, dragPoint: ArrowPoint): ArrowData {
  const d = deepClone(data);
  const base = d.segments[0];
  const horizontal = isHorizontal(base);

  if (horizontal) {
    const y = dragPoint.y;
    const c1 = { x: d.startPoint.x, y };
    const c2 = { x: d.endPoint.x, y };

    const b1 = { id: generateId(), startPoint: d.startPoint, endPoint: c1 };
    const A = { id: generateId(), startPoint: c1, endPoint: c2 };
    const b2 = { id: generateId(), startPoint: c2, endPoint: d.endPoint };

    d.arrowType = "orthogonal";
    d.segments = [b1, A, b2];
    return rebuildControlPoints(d, new Set([A.id]));
  }

  const x = dragPoint.x;
  const c1 = { x, y: d.startPoint.y };
  const c2 = { x, y: d.endPoint.y };

  const b1 = { id: generateId(), startPoint: d.startPoint, endPoint: c1 };
  const A = { id: generateId(), startPoint: c1, endPoint: c2 };
  const b2 = { id: generateId(), startPoint: c2, endPoint: d.endPoint };

  d.arrowType = "orthogonal";
  d.segments = [b1, A, b2];
  return rebuildControlPoints(d, new Set([A.id]));
}

/* ============================================================= */
/* Component                                                     */
/* ============================================================= */

export const ArrowControlPoints: React.FC<{
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}> = ({ element, viewport }) => {
  const { updateElement } = useCanvasStore();

  const [drag, setDrag] = useState<DragState>({
    isDragging: false,
    controlPoint: null,
  });

  const arrowData: ArrowData = useMemo(() => {
    const stored = element.data?.arrowData as ArrowData | undefined;
    if (stored) return stored;

    const base = createStraightArrowData(
      { x: 0, y: element.size.height / 2 },
      { x: element.size.width, y: element.size.height / 2 },
      "end",
    );

    const seg = {
      id: generateId(),
      startPoint: cloneP(base.startPoint),
      endPoint: cloneP(base.endPoint),
    };

    base.segments = [seg];
    base.arrowType = "straight";
    base.controlPoints = rebuildControlPoints(base, new Set([seg.id])).controlPoints;
    return base;
  }, [element]);

  /* ================= Mouse ================= */

  const onDown = useCallback(
    (e: React.MouseEvent, cp: ArrowCP) => {
      e.preventDefault();
      e.stopPropagation();

      let axis: Axis | null = null;
      let value: number | null = null;

      if (cp.type === "midpoint" && cp.segmentId) {
        const s = arrowData.segments.find((x) => x.id === cp.segmentId);
        if (s) {
          if (isHorizontal(s)) {
            axis = "x";
            value = cp.position.x;
          } else {
            axis = "y";
            value = cp.position.y;
          }
        }
      }

      setDrag({
        isDragging: true,
        controlPoint: cp.type === "endpoint" ? (cp.id === "start" ? "start" : "end") : "middle",
        controlPointId: cp.id,
        segmentId: cp.segmentId ?? null,
        startPosition: cloneP(cp.position),
        startMouse: { x: e.clientX, y: e.clientY },
        lockedAxis: axis,
        lockedValue: value,
      });
    },
    [arrowData],
  );

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!drag.isDragging || !drag.startMouse || !drag.startPosition) return;

      const dx = (e.clientX - drag.startMouse.x) / viewport.zoom;
      const dy = (e.clientY - drag.startMouse.y) / viewport.zoom;

      let p: ArrowPoint = {
        x: drag.startPosition.x + dx,
        y: drag.startPosition.y + dy,
      };

      if (drag.lockedAxis === "x" && drag.lockedValue != null) p.x = drag.lockedValue;
      if (drag.lockedAxis === "y" && drag.lockedValue != null) p.y = drag.lockedValue;

      let d = deepClone(arrowData);

      if (drag.controlPoint === "middle") {
        if (d.arrowType === "straight") {
          d = straightToU(d, p);
        }
      }

      updateElement(element.id, {
        data: { ...element.data, arrowData: d },
      });
    },
    [drag, arrowData, viewport, updateElement, element],
  );

  const onUp = useCallback(() => {
    setDrag({
      isDragging: false,
      controlPoint: null,
    });
  }, []);

  useEffect(() => {
    if (!drag.isDragging) return;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag.isDragging, onMove, onUp]);

  /* ================= Render ================= */

  return (
    <>
      {arrowData.controlPoints.map((cp) => {
        const size = cp.isActive ? 10 : 6;
        return (
          <div
            key={cp.id}
            onMouseDown={(e) => onDown(e, cp)}
            className="absolute"
            style={{
              left: cp.position.x - size / 2,
              top: cp.position.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: cp.isActive ? "#fff" : "rgba(255,255,255,.4)",
              border: cp.isActive ? "1.5px solid #000" : "1px dashed rgba(0,0,0,.4)",
              cursor: "grab",
              zIndex: 1000,
            }}
          />
        );
      })}
    </>
  );
};

export default ArrowControlPoints;
