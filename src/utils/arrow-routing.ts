/**
 * Arrow Routing System – FIXED
 * كل اتصال ينتهي T نظيفة 100%
 */

import type {
  ArrowData,
  ArrowPoint,
  ArrowSegment,
  ArrowControlPoint,
  ArrowConnection,
} from "@/types/arrow-connections";
import { generateId } from "@/types/arrow-connections";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SnapEdge = "top" | "bottom" | "left" | "right";
type Orientation = "horizontal" | "vertical";

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const OFFSET = 10;

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const segmentOrientation = (s: ArrowSegment): Orientation =>
  Math.abs(s.endPoint.x - s.startPoint.x) > Math.abs(s.endPoint.y - s.startPoint.y) ? "horizontal" : "vertical";

const edgeOrientation = (edge: SnapEdge): Orientation =>
  edge === "top" || edge === "bottom" ? "horizontal" : "vertical";

const midpoint = (s: ArrowSegment): ArrowPoint => ({
  x: (s.startPoint.x + s.endPoint.x) / 2,
  y: (s.startPoint.y + s.endPoint.y) / 2,
});

/* ------------------------------------------------------------------ */
/* Core rule: build path from scratch                                  */
/* ------------------------------------------------------------------ */

function buildTSegments(start: ArrowPoint, snap: ArrowPoint, snapEdge: SnapEdge): ArrowSegment[] {
  const edgeDir = edgeOrientation(snapEdge);

  if (edgeDir === "horizontal") {
    // snap on top/bottom → vertical T
    const stemY = snap.y + (snapEdge === "top" ? -OFFSET : OFFSET);
    return [
      {
        id: generateId(),
        startPoint: start,
        endPoint: { x: start.x, y: stemY },
      },
      {
        id: generateId(),
        startPoint: { x: start.x, y: stemY },
        endPoint: { x: snap.x, y: stemY },
      },
      {
        id: generateId(),
        startPoint: { x: snap.x, y: stemY },
        endPoint: snap,
      },
    ];
  }

  // vertical edge → horizontal T
  const stemX = snap.x + (snapEdge === "left" ? -OFFSET : OFFSET);
  return [
    {
      id: generateId(),
      startPoint: start,
      endPoint: { x: stemX, y: start.y },
    },
    {
      id: generateId(),
      startPoint: { x: stemX, y: start.y },
      endPoint: { x: stemX, y: snap.y },
    },
    {
      id: generateId(),
      startPoint: { x: stemX, y: snap.y },
      endPoint: snap,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function resolveSnapConnection(
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  target: TargetElement,
  endpoint: "start" | "end",
): ArrowData {
  const base = clone(arrowData);

  const fixedPoint = endpoint === "start" ? base.endPoint : base.startPoint;

  // نبني المسار من الصفر – لا نثق بالمسار السابق
  const segments =
    endpoint === "start"
      ? buildTSegments(snapPoint, fixedPoint, snapEdge)
      : buildTSegments(fixedPoint, snapPoint, snapEdge);

  const controlPoints: ArrowControlPoint[] = [];

  // start
  controlPoints.push({
    id: "start",
    type: "endpoint",
    position: segments[0].startPoint,
    isActive: true,
    connection:
      endpoint === "start"
        ? {
            elementId: target.id,
            anchorPoint: snapEdge,
            offset: { x: 0, y: 0 },
          }
        : base.startConnection || null,
  });

  // midpoints
  segments.forEach((seg) => {
    controlPoints.push({
      id: generateId(),
      type: "midpoint",
      position: midpoint(seg),
      isActive: false,
      segmentId: seg.id,
    });
  });

  // end
  controlPoints.push({
    id: "end",
    type: "endpoint",
    position: segments[segments.length - 1].endPoint,
    isActive: true,
    connection:
      endpoint === "end"
        ? {
            elementId: target.id,
            anchorPoint: snapEdge,
            offset: { x: 0, y: 0 },
          }
        : base.endConnection || null,
  });

  return {
    ...base,
    startPoint: segments[0].startPoint,
    endPoint: segments[segments.length - 1].endPoint,
    segments,
    controlPoints,
    arrowType: "orthogonal",
    startConnection: endpoint === "start" ? controlPoints[0].connection : base.startConnection,
    endConnection: endpoint === "end" ? controlPoints[controlPoints.length - 1].connection : base.endConnection,
  };
}
