/**
 * Arrow Routing System – FIXED VERSION
 * Rule Zero enforced:
 * Any arrow–element connection MUST end as a clean T.
 */

import type {
  ArrowPoint,
  ArrowData,
  ArrowSegment,
  ArrowControlPoint,
  ArrowConnection,
} from "@/types/arrow-connections";
import { generateId } from "@/types/arrow-connections";

/* ========================================================= */
/* Types                                                     */
/* ========================================================= */

export type SegmentOrientation = "horizontal" | "vertical";
export type EdgeOrientation = "horizontal" | "vertical";
export type SnapEdge = "top" | "bottom" | "left" | "right";

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface RoutingConfig {
  OFFSET_DISTANCE: number;
  EXTENSION_DISTANCE: number;
}

const CONFIG: RoutingConfig = {
  OFFSET_DISTANCE: 10,
  EXTENSION_DISTANCE: 10,
};

/* ========================================================= */
/* Geometry helpers                                         */
/* ========================================================= */

const clone = (p: ArrowPoint): ArrowPoint => ({ x: p.x, y: p.y });

const segmentOrientation = (s: ArrowSegment): SegmentOrientation =>
  Math.abs(s.endPoint.y - s.startPoint.y) > Math.abs(s.endPoint.x - s.startPoint.x) ? "vertical" : "horizontal";

const edgeOrientation = (edge: SnapEdge): EdgeOrientation =>
  edge === "top" || edge === "bottom" ? "horizontal" : "vertical";

const isParallel = (seg: ArrowSegment, edge: SnapEdge) => segmentOrientation(seg) === edgeOrientation(edge);

/* ========================================================= */
/* Core Routing Logic                                       */
/* ========================================================= */

/**
 * Always keeps snapPoint as FINAL endpoint.
 * All offsets happen BEFORE it.
 */
function buildTConnection(baseSeg: ArrowSegment, snapPoint: ArrowPoint, snapEdge: SnapEdge): ArrowSegment[] {
  const orient = segmentOrientation(baseSeg);

  if (orient === "vertical") {
    const offsetX = snapEdge === "left" ? -CONFIG.OFFSET_DISTANCE : CONFIG.OFFSET_DISTANCE;

    const corner = {
      x: snapPoint.x + offsetX,
      y: snapPoint.y,
    };

    return [
      {
        id: generateId(),
        startPoint: corner,
        endPoint: clone(snapPoint),
      },
      {
        id: generateId(),
        startPoint: clone(baseSeg.startPoint),
        endPoint: corner,
      },
    ];
  }

  // horizontal
  const offsetY = snapEdge === "top" ? -CONFIG.OFFSET_DISTANCE : CONFIG.OFFSET_DISTANCE;

  const corner = {
    x: snapPoint.x,
    y: snapPoint.y + offsetY,
  };

  return [
    {
      id: generateId(),
      startPoint: corner,
      endPoint: clone(snapPoint),
    },
    {
      id: generateId(),
      startPoint: clone(baseSeg.startPoint),
      endPoint: corner,
    },
  ];
}

/**
 * U-maneuver for internal intersection cases
 */
function buildUConnection(baseSeg: ArrowSegment, snapPoint: ArrowPoint, snapEdge: SnapEdge): ArrowSegment[] {
  const orient = segmentOrientation(baseSeg);

  if (orient === "vertical") {
    const side = snapEdge === "left" ? -CONFIG.OFFSET_DISTANCE : CONFIG.OFFSET_DISTANCE;

    const p1 = {
      x: snapPoint.x + side,
      y: snapPoint.y,
    };

    const p2 = {
      x: p1.x,
      y: baseSeg.startPoint.y,
    };

    return [
      { id: generateId(), startPoint: p1, endPoint: clone(snapPoint) },
      { id: generateId(), startPoint: p2, endPoint: p1 },
      {
        id: generateId(),
        startPoint: clone(baseSeg.startPoint),
        endPoint: p2,
      },
    ];
  }

  // horizontal
  const side = snapEdge === "top" ? -CONFIG.OFFSET_DISTANCE : CONFIG.OFFSET_DISTANCE;

  const p1 = {
    x: snapPoint.x,
    y: snapPoint.y + side,
  };

  const p2 = {
    x: baseSeg.startPoint.x,
    y: p1.y,
  };

  return [
    { id: generateId(), startPoint: p1, endPoint: clone(snapPoint) },
    { id: generateId(), startPoint: p2, endPoint: p1 },
    {
      id: generateId(),
      startPoint: clone(baseSeg.startPoint),
      endPoint: p2,
    },
  ];
}

/* ========================================================= */
/* Public API                                               */
/* ========================================================= */

export function resolveSnapConnection(
  arrow: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  target: TargetElement,
  endpoint: "start" | "end",
): ArrowData {
  const segs = arrow.segments.map((s) => ({
    ...s,
    startPoint: clone(s.startPoint),
    endPoint: clone(s.endPoint),
  }));

  const base = endpoint === "start" ? segs[0] : segs[segs.length - 1];

  let newSegs: ArrowSegment[];

  if (isParallel(base, snapEdge)) {
    newSegs = buildTConnection(base, snapPoint, snapEdge);
  } else {
    newSegs = buildUConnection(base, snapPoint, snapEdge);
  }

  if (endpoint === "start") {
    segs.splice(0, 1, ...newSegs.reverse());
  } else {
    segs.splice(segs.length - 1, 1, ...newSegs);
  }

  return {
    ...arrow,
    segments: segs,
    startPoint: segs[0].startPoint,
    endPoint: segs[segs.length - 1].endPoint,
    arrowType: "orthogonal",
  };
}
