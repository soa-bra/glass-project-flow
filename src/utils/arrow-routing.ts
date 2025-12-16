// src/utils/arrow-routing.ts
// =======================================================
// Arrow Routing – Deterministic Orthogonal Routing Engine
// =======================================================

import { ArrowData, ArrowPoint, ArrowSegment, ArrowControlPoint, ArrowConnection } from "@/types/arrow-connections";
import { generateId } from "@/types/arrow-connections";

// -------------------------------------------------------
// Types
// -------------------------------------------------------
export type SnapEdge = "top" | "bottom" | "left" | "right";

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// -------------------------------------------------------
// Geometry helpers
// -------------------------------------------------------
const isVertical = (a: ArrowPoint, b: ArrowPoint) => Math.abs(a.x - b.x) < 1;

const isHorizontal = (a: ArrowPoint, b: ArrowPoint) => Math.abs(a.y - b.y) < 1;

const edgeIsHorizontal = (edge: SnapEdge) => edge === "top" || edge === "bottom";

const edgeIsVertical = (edge: SnapEdge) => edge === "left" || edge === "right";

// -------------------------------------------------------
// Intersection test (strict – no heuristics)
// -------------------------------------------------------
const lineIntersectsRect = (from: ArrowPoint, to: ArrowPoint, el: TargetElement): boolean => {
  const r = {
    l: el.position.x,
    r: el.position.x + el.size.width,
    t: el.position.y,
    b: el.position.y + el.size.height,
  };

  const minX = Math.min(from.x, to.x);
  const maxX = Math.max(from.x, to.x);
  const minY = Math.min(from.y, to.y);
  const maxY = Math.max(from.y, to.y);

  return !(maxX < r.l || minX > r.r || maxY < r.t || minY > r.b);
};

// -------------------------------------------------------
// Active midpoint logic
// -------------------------------------------------------
const findNearestActiveMidpointIndex = (arrow: ArrowData, endpoint: "start" | "end"): number | null => {
  const mids = arrow.controlPoints.filter((cp) => cp.type === "midpoint" && cp.isActive && cp.segmentId);

  if (!mids.length) return null;

  if (endpoint === "start") {
    for (let i = 0; i < arrow.segments.length; i++) {
      if (mids.some((m) => m.segmentId === arrow.segments[i].id)) return i;
    }
  } else {
    for (let i = arrow.segments.length - 1; i >= 0; i--) {
      if (mids.some((m) => m.segmentId === arrow.segments[i].id)) return i;
    }
  }

  return null;
};

// -------------------------------------------------------
// Core routing rules
// -------------------------------------------------------
const buildDirectConnection = (from: ArrowPoint, to: ArrowPoint): ArrowSegment[] => [
  { id: generateId(), startPoint: from, endPoint: to },
];

const buildSingleBend = (from: ArrowPoint, to: ArrowPoint, edge: SnapEdge): ArrowSegment[] => {
  if (edgeIsHorizontal(edge)) {
    const mid = { x: to.x, y: from.y };
    return [
      { id: generateId(), startPoint: from, endPoint: mid },
      { id: generateId(), startPoint: mid, endPoint: to },
    ];
  } else {
    const mid = { x: from.x, y: to.y };
    return [
      { id: generateId(), startPoint: from, endPoint: mid },
      { id: generateId(), startPoint: mid, endPoint: to },
    ];
  }
};

const buildUShape = (from: ArrowPoint, to: ArrowPoint, edge: SnapEdge): ArrowSegment[] => {
  const offset = 20;

  if (edge === "top" || edge === "bottom") {
    const y = edge === "top" ? to.y - offset : to.y + offset;
    return [
      { id: generateId(), startPoint: from, endPoint: { x: from.x, y } },
      { id: generateId(), startPoint: { x: from.x, y }, endPoint: { x: to.x, y } },
      { id: generateId(), startPoint: { x: to.x, y }, endPoint: to },
    ];
  }

  const x = edge === "left" ? to.x - offset : to.x + offset;
  return [
    { id: generateId(), startPoint: from, endPoint: { x, y: from.y } },
    { id: generateId(), startPoint: { x, y: from.y }, endPoint: { x, y: to.y } },
    { id: generateId(), startPoint: { x, y: to.y }, endPoint: to },
  ];
};

// -------------------------------------------------------
// MAIN – deterministic snap resolution
// -------------------------------------------------------
export const resolveSnapConnection = (
  arrow: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  target: TargetElement,
  endpoint: "start" | "end",
): ArrowData => {
  const activeIndex = findNearestActiveMidpointIndex(arrow, endpoint);

  let fixedPoint: ArrowPoint;
  let preserved: ArrowSegment[];

  if (activeIndex !== null) {
    if (endpoint === "start") {
      preserved = arrow.segments.slice(activeIndex);
      fixedPoint = preserved[0].startPoint;
    } else {
      preserved = arrow.segments.slice(0, activeIndex + 1);
      fixedPoint = preserved[preserved.length - 1].endPoint;
    }
  } else {
    preserved = [];
    fixedPoint = endpoint === "start" ? arrow.endPoint : arrow.startPoint;
  }

  // ---------------------------------------------------
  // RULE SELECTION (strict order)
  // ---------------------------------------------------
  let newSegments: ArrowSegment[];

  // 1️⃣ direct straight connection
  if (
    (isVertical(fixedPoint, snapPoint) && edgeIsHorizontal(snapEdge)) ||
    (isHorizontal(fixedPoint, snapPoint) && edgeIsVertical(snapEdge))
  ) {
    newSegments = buildDirectConnection(fixedPoint, snapPoint);
  }

  // 2️⃣ perpendicular → single bend
  else if (
    (isVertical(fixedPoint, snapPoint) && edgeIsVertical(snapEdge)) ||
    (isHorizontal(fixedPoint, snapPoint) && edgeIsHorizontal(snapEdge))
  ) {
    newSegments = buildSingleBend(fixedPoint, snapPoint, snapEdge);
  }

  // 3️⃣ intersection → U
  else if (lineIntersectsRect(fixedPoint, snapPoint, target)) {
    newSegments = buildUShape(fixedPoint, snapPoint, snapEdge);
  }

  // fallback (should not happen)
  else {
    newSegments = buildSingleBend(fixedPoint, snapPoint, snapEdge);
  }

  // ---------------------------------------------------
  // Direction fix
  // ---------------------------------------------------
  if (endpoint === "start") {
    newSegments = newSegments.map((s) => ({ ...s, startPoint: s.endPoint, endPoint: s.startPoint })).reverse();
  }

  const segments =
    activeIndex !== null
      ? endpoint === "start"
        ? [...newSegments, ...preserved]
        : [...preserved, ...newSegments]
      : newSegments;

  // ---------------------------------------------------
  // Rebuild control points (NO TOUCH active ones)
  // ---------------------------------------------------
  const controlPoints: ArrowControlPoint[] = [];

  controlPoints.push({
    id: generateId(),
    type: "endpoint",
    position: segments[0].startPoint,
    isActive: true,
    connection:
      endpoint === "start"
        ? { elementId: target.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } }
        : arrow.startConnection,
  });

  segments.forEach((seg) => {
    const mid = {
      x: (seg.startPoint.x + seg.endPoint.x) / 2,
      y: (seg.startPoint.y + seg.endPoint.y) / 2,
    };

    const preservedCp = arrow.controlPoints.find((cp) => cp.segmentId === seg.id && cp.type === "midpoint");

    controlPoints.push({
      id: preservedCp?.id || generateId(),
      type: "midpoint",
      position: mid,
      isActive: preservedCp?.isActive ?? false,
      segmentId: seg.id,
      label: preservedCp?.label,
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
        : arrow.endConnection,
  });

  return {
    ...arrow,
    segments,
    controlPoints,
    startPoint: segments[0].startPoint,
    endPoint: segments[segments.length - 1].endPoint,
    arrowType: "orthogonal",
  };
};
