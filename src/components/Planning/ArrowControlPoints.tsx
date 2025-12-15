import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import type {
  ArrowData,
  ArrowPoint,
  ArrowSegment,
  ArrowControlPoint as ArrowCP,
  ArrowControlDragState,
} from "@/types/arrow-connections";
import { createStraightArrowData, findNearestAnchor, generateId } from "@/types/arrow-connections";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

type Axis = "x" | "y";

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
  controlPoints: d.controlPoints.map((cp) => ({
    ...cp,
    position: cloneP(cp.position),
    connection: cp.connection ? { ...cp.connection, offset: { ...cp.connection.offset } } : null,
  })),
});

/* ------------------------------------------------------------------ */
/* Control Points rebuild                                              */
/* ------------------------------------------------------------------ */

function rebuildControlPoints(data: ArrowData, active: Set<string>, keepId?: Record<string, string>): ArrowData {
  const d = deepClone(data);
  const cps: ArrowCP[] = [];

  cps.push({
    id: "start",
    type: "endpoint",
    position: cloneP(d.startPoint),
    isActive: true,
    connection: d.controlPoints.find((c) => c.id === "start")?.connection ?? null,
  });

  d.segments.forEach((s) => {
    cps.push({
      id: keepId?.[s.id] ?? generateId(),
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
    connection: d.controlPoints.find((c) => c.id === "end")?.connection ?? null,
  });

  d.controlPoints = cps;
  return d;
}

/* ------------------------------------------------------------------ */
/* STRAIGHT -> U_BASE                                                  */
/* ------------------------------------------------------------------ */

function straightToU(data: ArrowData, dragPoint: ArrowPoint, keepMidId: string): ArrowData {
  const d = deepClone(data);
  const base = d.segments[0];
  const baseIsH = isHorizontal(base);

  if (baseIsH) {
    const y = dragPoint.y;
    const c1 = { x: d.startPoint.x, y };
    const c2 = { x: d.endPoint.x, y };

    const b1 = { id: generateId(), startPoint: cloneP(d.startPoint), endPoint: c1 };
    const A = { id: generateId(), startPoint: c1, endPoint: c2 };
    const b2 = { id: generateId(), startPoint: c2, endPoint: cloneP(d.endPoint) };

    d.arrowType = "orthogonal";
    d.segments = [b1, A, b2];
    return rebuildControlPoints(d, new Set([A.id]), { [A.id]: keepMidId });
  } else {
    const x = dragPoint.x;
    const c1 = { x, y: d.startPoint.y };
    const c2 = { x, y: d.endPoint.y };

    const b1 = { id: generateId(), startPoint: cloneP(d.startPoint), endPoint: c1 };
    const A = { id: generateId(), startPoint: c1, endPoint: c2 };
    const b2 = { id: generateId(), startPoint: c2, endPoint: cloneP(d.endPoint) };

    d.arrowType = "orthogonal";
    d.segments = [b1, A, b2];
    return rebuildControlPoints(d, new Set([A.id]), { [A.id]: keepMidId });
  }
}

/* ------------------------------------------------------------------ */
/* Move Active Segment (A or activated B)                              */
/* ------------------------------------------------------------------ */

function moveActiveSegment(data: ArrowData, segId: string, dragPoint: ArrowPoint): ArrowData {
  const d = deepClone(data);
  const i = d.segments.findIndex((s) => s.id === segId);
  if (i === -1) return d;

  const s = d.segments[i];

  if (isHorizontal(s)) {
    const y = dragPoint.y;
    d.segments[i] = {
      ...s,
      startPoint: { x: s.startPoint.x, y },
      endPoint: { x: s.endPoint.x, y },
    };
  } else {
    const x = dragPoint.x;
    d.segments[i] = {
      ...s,
      startPoint: { x, y: s.startPoint.y },
      endPoint: { x, y: s.endPoint.y },
    };
  }

  if (i > 0)
    d.segments[i - 1] = {
      ...d.segments[i - 1],
      endPoint: cloneP(d.segments[i].startPoint),
    };

  if (i < d.segments.length - 1)
    d.segments[i + 1] = {
      ...d.segments[i + 1],
      startPoint: cloneP(d.segments[i].endPoint),
    };

  return d;
}

/* ------------------------------------------------------------------ */
/* Drag inactive B -> activate + extend                                */
/* ------------------------------------------------------------------ */

function dragInactiveAndActivate(data: ArrowData, segId: string, dragPoint: ArrowPoint): ArrowData {
  const d = deepClone(data);
  const idx = d.segments.findIndex((s) => s.id === segId);
  if (idx === -1) return d;

  const midIdx = Math.floor(d.segments.length / 2);
  const A = d.segments[midIdx];
  const B = d.segments[idx];

  // move B constrained
  if (isHorizontal(B)) {
    const y = dragPoint.y;
    d.segments[idx] = {
      ...B,
      startPoint: { x: B.startPoint.x, y },
      endPoint: { x: B.endPoint.x, y },
    };
  } else {
    const x = dragPoint.x;
    d.segments[idx] = {
      ...B,
      startPoint: { x, y: B.startPoint.y },
      endPoint: { x, y: B.endPoint.y },
    };
  }

  // resize A
  if (idx < midIdx) {
    d.segments[midIdx] = {
      ...A,
      startPoint: cloneP(d.segments[idx].endPoint),
      endPoint: cloneP(A.endPoint),
    };
  } else {
    d.segments[midIdx] = {
      ...A,
      startPoint: cloneP(A.startPoint),
      endPoint: cloneP(d.segments[idx].startPoint),
    };
  }

  // reconnect neighbors
  if (midIdx - 1 >= 0)
    d.segments[midIdx - 1] = {
      ...d.segments[midIdx - 1],
      endPoint: cloneP(d.segments[midIdx].startPoint),
    };

  if (midIdx + 1 < d.segments.length)
    d.segments[midIdx + 1] = {
      ...d.segments[midIdx + 1],
      startPoint: cloneP(d.segments[midIdx].endPoint),
    };

  // create ONE new orthogonal segment
  const startCorner = d.segments[0].endPoint;
  const touch = idx < midIdx ? d.segments[midIdx].startPoint : d.segments[midIdx].endPoint;

  const canDirect = startCorner.x === touch.x || startCorner.y === touch.y;

  const newSeg: ArrowSegment = {
    id: generateId(),
    startPoint: cloneP(canDirect ? d.startPoint : startCorner),
    endPoint: cloneP(touch),
  };

  d.segments.push(newSeg);

  return rebuildControlPoints(d, new Set([d.segments[midIdx].id, segId]));
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export const ArrowControlPoints: React.FC<{
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}> = ({ element, viewport }) => {
  const { elements, updateElement } = useCanvasStore();

  const [drag, setDrag] = useState<
    ArrowControlDragState & {
      lockedAxis?: Axis | null;
      lockedValue?: number | null;
      segmentId?: string | null;
      startMouse?: { x: number; y: number } | null;
    }
  >({ isDragging: false, controlPoint: null });

  const arrowData: ArrowData = useMemo(() => {
    const stored = element.data?.arrowData as ArrowData | undefined;
    if (!stored) {
      const base = createStraightArrowData(
        { x: 0, y: element.size.height / 2 },
        { x: element.size.width, y: element.size.height / 2 },
        "end",
      );
      const seg = { id: generateId(), startPoint: cloneP(base.startPoint), endPoint: cloneP(base.endPoint) };
      base.segments = [seg];
      base.arrowType = "straight";
      base.controlPoints = rebuildControlPoints(base, new Set([seg.id])).controlPoints;
      return base;
    }
    return stored;
  }, [element]);

  const others = useMemo(
    () => elements.filter((e) => e.id !== element.id && e.type !== "arrow"),
    [elements, element.id],
  );

  /* ---------------- Drag logic ---------------- */

  const onDown = useCallback(
    (e: React.MouseEvent, cp: ArrowCP) => {
      e.preventDefault();
      e.stopPropagation();

      let lockedAxis: Axis | null = null;
      let lockedValue: number | null = null;

      if (cp.type === "midpoint" && cp.segmentId) {
        const s = arrowData.segments.find((x) => x.id === cp.segmentId);
        if (s) {
          if (isHorizontal(s)) {
            lockedAxis = "x";
            lockedValue = cp.position.x;
          } else {
            lockedAxis = "y";
            lockedValue = cp.position.y;
          }
        }
      }

      setDrag({
        isDragging: true,
        controlPoint: cp.type === "endpoint" ? cp.id : "middle",
        controlPointId: cp.id,
        segmentId: cp.segmentId ?? null,
        startPosition: cloneP(cp.position),
        startMouse: { x: e.clientX, y: e.clientY },
        lockedAxis,
        lockedValue,
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

      if (drag.lockedAxis === "x" && drag.lockedValue != null) p = { x: drag.lockedValue, y: p.y };
      if (drag.lockedAxis === "y" && drag.lockedValue != null) p = { x: p.x, y: drag.lockedValue };

      let d = deepClone(arrowData);

      if (drag.controlPoint === "middle" && drag.segmentId) {
        const cp = d.controlPoints.find((c) => c.id === drag.controlPointId);
        if (!cp) return;

        if (d.arrowType === "straight") {
          d = straightToU(d, p, cp.id);
        } else if (cp.isActive) {
          d = moveActiveSegment(d, drag.segmentId, p);
          d = rebuildControlPoints(d, new Set([drag.segmentId]), {
            [drag.segmentId]: cp.id,
          });
        } else {
          d = dragInactiveAndActivate(d, drag.segmentId, p);
        }
      }

      updateElement(element.id, { data: { ...element.data, arrowData: d } });
    },
    [drag, arrowData, viewport, updateElement, element],
  );

  const onUp = useCallback(() => {
    setDrag({ isDragging: false, controlPoint: null });
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

  /* ---------------- Render ---------------- */

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
