import type {
  ArrowPoint,
  ArrowData,
  ArrowSegment,
  ArrowControlPoint,
  ArrowConnection,
} from "@/types/arrow-connections";
import { generateId } from "@/types/arrow-connections";

export type SnapEdge = "top" | "bottom" | "left" | "right";

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const OFFSET = 12;
const T_STEM = 8;

/* ================== Helpers ================== */

const isVertical = (a: ArrowPoint, b: ArrowPoint) => a.x === b.x;
const isHorizontal = (a: ArrowPoint, b: ArrowPoint) => a.y === b.y;

const outwardVector = (edge: SnapEdge) => {
  switch (edge) {
    case "top":
      return { x: 0, y: -1 };
    case "bottom":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
};

/* ================== Core Routing ================== */

/**
 * يبني مسار T نظيف بدون تعديل أي ضلع موجود
 */
const buildTSegments = (from: ArrowPoint, snap: ArrowPoint, edge: SnapEdge): ArrowSegment[] => {
  const dir = outwardVector(edge);

  const stemEnd: ArrowPoint = {
    x: snap.x + dir.x * T_STEM,
    y: snap.y + dir.y * T_STEM,
  };

  const turnPoint: ArrowPoint = dir.x !== 0 ? { x: stemEnd.x, y: from.y } : { x: from.x, y: stemEnd.y };

  return [
    {
      id: generateId(),
      startPoint: snap,
      endPoint: stemEnd,
    },
    {
      id: generateId(),
      startPoint: stemEnd,
      endPoint: turnPoint,
    },
    {
      id: generateId(),
      startPoint: turnPoint,
      endPoint: from,
    },
  ];
};

/* ================== Main Resolver ================== */

export const resolveSnapConnection = (
  arrow: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  target: TargetElement,
  endpoint: "start" | "end",
): ArrowData => {
  const otherPoint = endpoint === "start" ? arrow.endPoint : arrow.startPoint;

  // نبني مسار جديد بالكامل
  const segments =
    endpoint === "start"
      ? buildTSegments(otherPoint, snapPoint, snapEdge).reverse()
      : buildTSegments(otherPoint, snapPoint, snapEdge);

  /* ===== Control Points ===== */

  const controlPoints: ArrowControlPoint[] = [];

  controlPoints.push({
    id: generateId(),
    type: "endpoint",
    position: segments[0].startPoint,
    isActive: true,
    connection:
      endpoint === "start"
        ? { elementId: target.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } }
        : (arrow.startConnection ?? null),
  });

  segments.forEach((seg) => {
    controlPoints.push({
      id: generateId(),
      type: "midpoint",
      position: {
        x: (seg.startPoint.x + seg.endPoint.x) / 2,
        y: (seg.startPoint.y + seg.endPoint.y) / 2,
      },
      segmentId: seg.id,
      isActive: false,
    });
  });

  controlPoints.push({
    id: generateId(),
    type: "endpoint",
    position: segments[segments.length - 1].endPoint,
    isActive: true,
    connection:
      endpoint === "end"
        ? { elementId: target.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } }
        : (arrow.endConnection ?? null),
  });

  return {
    ...arrow,
    startPoint: segments[0].startPoint,
    endPoint: segments[segments.length - 1].endPoint,
    segments,
    controlPoints,
    arrowType: "orthogonal",
    startConnection:
      endpoint === "start"
        ? { elementId: target.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } }
        : arrow.startConnection,
    endConnection:
      endpoint === "end"
        ? { elementId: target.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } }
        : arrow.endConnection,
  };
};
