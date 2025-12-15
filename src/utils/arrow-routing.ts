import type {
  ArrowPoint,
  ArrowData,
  ArrowSegment,
  ArrowControlPoint,
  ArrowConnection,
} from "@/types/arrow-connections";
import { generateId } from "@/types/arrow-connections";

/* =====================================================
   Config
===================================================== */

const OFFSET = 10;
const EXTEND = 10;

/* =====================================================
   Geometry helpers
===================================================== */

type Orientation = "horizontal" | "vertical";
type SnapEdge = "top" | "bottom" | "left" | "right";

const cloneP = (p: ArrowPoint): ArrowPoint => ({ x: p.x, y: p.y });

const orientationOf = (s: ArrowSegment): Orientation =>
  Math.abs(s.endPoint.x - s.startPoint.x) > Math.abs(s.endPoint.y - s.startPoint.y) ? "horizontal" : "vertical";

const edgeOrientation = (e: SnapEdge): Orientation => (e === "top" || e === "bottom" ? "horizontal" : "vertical");

/* =====================================================
   Hard constraint (الأهم)
===================================================== */

function forceEndpointAlignment(segments: ArrowSegment[], snapPoint: ArrowPoint, endpoint: "start" | "end") {
  if (!segments.length) return;

  if (endpoint === "start") {
    segments[0].startPoint = cloneP(snapPoint);
  } else {
    segments[segments.length - 1].endPoint = cloneP(snapPoint);
  }
}

/* =====================================================
   Parallel → T
===================================================== */

function resolveParallelT(
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpoint: "start" | "end",
): ArrowSegment[] {
  const out = segments.map((s) => ({
    ...s,
    startPoint: cloneP(s.startPoint),
    endPoint: cloneP(s.endPoint),
  }));

  const idx = endpoint === "start" ? 0 : out.length - 1;
  const seg = out[idx];
  const o = orientationOf(seg);

  if (o === "vertical") {
    const dx = snapEdge === "left" ? -OFFSET : OFFSET;
    const x = (endpoint === "start" ? seg.startPoint.x : seg.endPoint.x) + dx;

    if (endpoint === "start") {
      seg.startPoint = { x, y: seg.startPoint.y };
      out.unshift({
        id: generateId(),
        startPoint: cloneP(snapPoint),
        endPoint: { x, y: snapPoint.y },
      });
      seg.startPoint = { x, y: snapPoint.y };
    } else {
      seg.endPoint = { x, y: seg.endPoint.y };
      out.push({
        id: generateId(),
        startPoint: { x, y: snapPoint.y },
        endPoint: cloneP(snapPoint),
      });
      seg.endPoint = { x, y: snapPoint.y };
    }
  } else {
    const dy = snapEdge === "top" ? -OFFSET : OFFSET;
    const y = (endpoint === "start" ? seg.startPoint.y : seg.endPoint.y) + dy;

    if (endpoint === "start") {
      seg.startPoint = { x: seg.startPoint.x, y };
      out.unshift({
        id: generateId(),
        startPoint: cloneP(snapPoint),
        endPoint: { x: snapPoint.x, y },
      });
      seg.startPoint = { x: snapPoint.x, y };
    } else {
      seg.endPoint = { x: seg.endPoint.x, y };
      out.push({
        id: generateId(),
        startPoint: { x: snapPoint.x, y },
        endPoint: cloneP(snapPoint),
      });
      seg.endPoint = { x: snapPoint.x, y };
    }
  }

  forceEndpointAlignment(out, snapPoint, endpoint);
  return out;
}

/* =====================================================
   Intersection → U
===================================================== */

function resolveIntersectionU(
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpoint: "start" | "end",
): ArrowSegment[] {
  const out = segments.map((s) => ({
    ...s,
    startPoint: cloneP(s.startPoint),
    endPoint: cloneP(s.endPoint),
  }));

  const idx = endpoint === "start" ? 0 : out.length - 1;
  const seg = out[idx];
  const o = orientationOf(seg);

  if (o === "vertical") {
    const dx = snapEdge === "left" ? -OFFSET : OFFSET;
    const x = (endpoint === "start" ? seg.startPoint.x : seg.endPoint.x) + dx;
    const y = snapPoint.y + (snapEdge === "top" ? -EXTEND : EXTEND);

    if (endpoint === "start") {
      out.unshift(
        {
          id: generateId(),
          startPoint: cloneP(snapPoint),
          endPoint: { x: snapPoint.x, y },
        },
        {
          id: generateId(),
          startPoint: { x: snapPoint.x, y },
          endPoint: { x, y },
        },
      );
      seg.startPoint = { x, y };
    } else {
      seg.endPoint = { x, y };
      out.push(
        {
          id: generateId(),
          startPoint: { x, y },
          endPoint: { x: snapPoint.x, y },
        },
        {
          id: generateId(),
          startPoint: { x: snapPoint.x, y },
          endPoint: cloneP(snapPoint),
        },
      );
    }
  } else {
    const dy = snapEdge === "top" ? -OFFSET : OFFSET;
    const y = (endpoint === "start" ? seg.startPoint.y : seg.endPoint.y) + dy;
    const x = snapPoint.x + (snapEdge === "left" ? -EXTEND : EXTEND);

    if (endpoint === "start") {
      out.unshift(
        {
          id: generateId(),
          startPoint: cloneP(snapPoint),
          endPoint: { x, y: snapPoint.y },
        },
        {
          id: generateId(),
          startPoint: { x, y: snapPoint.y },
          endPoint: { x, y },
        },
      );
      seg.startPoint = { x, y };
    } else {
      seg.endPoint = { x, y };
      out.push(
        {
          id: generateId(),
          startPoint: { x, y },
          endPoint: { x, y: snapPoint.y },
        },
        {
          id: generateId(),
          startPoint: { x, y: snapPoint.y },
          endPoint: cloneP(snapPoint),
        },
      );
    }
  }

  forceEndpointAlignment(out, snapPoint, endpoint);
  return out;
}

/* =====================================================
   Main API
===================================================== */

export function resolveSnapConnection(
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: any,
  endpoint: "start" | "end",
): ArrowData {
  const segs = arrowData.segments;
  const seg = endpoint === "start" ? segs[0] : segs[segs.length - 1];

  const isParallel = orientationOf(seg) === edgeOrientation(snapEdge);

  const nextSegments = isParallel
    ? resolveParallelT(segs, snapPoint, snapEdge, endpoint)
    : resolveIntersectionU(segs, snapPoint, snapEdge, endpoint);

  return {
    ...arrowData,
    segments: nextSegments,
    startPoint: nextSegments[0].startPoint,
    endPoint: nextSegments[nextSegments.length - 1].endPoint,
    arrowType: "orthogonal",
  };
}
