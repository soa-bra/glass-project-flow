// arrowMachine.ts
export type Point = { x: number; y: number };

export type DragKind = "none" | "endpoint" | "rootMid" | "segmentMid";
export type Endpoint = "start" | "end";
export type DragAxis = "horizontal" | "vertical";

export type AnchorHit = {
  elementId: string;
  anchorPoint: string; // أو portId / edge... حسب نظامك
  position: Point;     // world position
};

export type ArrowConnection = null | {
  elementId: string;
  anchorPoint: string;
  offset: Point; // optional
};

export type ArrowSegment = {
  id: string;
  startPoint: Point;
  endPoint: Point;
};

export type ControlPoint = {
  id: string;
  type: "endpoint" | "midpoint";
  position: Point;  // LOCAL relative to arrow element
  isActive: boolean;
  segmentId?: string; // موجود فقط في midpoints التابعة للأضلاع
  connection?: ArrowConnection; // endpoints
};

export type ArrowData = {
  arrowType: "straight" | "orthogonal";
  startPoint: Point; // LOCAL
  endPoint: Point;   // LOCAL
  headDirection?: "start" | "end" | "both" | "none";
  segments: ArrowSegment[]; // LOCAL
  controlPoints: ControlPoint[]; // LOCAL
  middlePoint?: Point; // optional
  startConnection?: ArrowConnection;
  endConnection?: ArrowConnection;
};

export type Viewport = { zoom: number; pan: Point };

export type MachineState =
  | { status: "Idle" }
  | { status: "Selected" }
  | { status: "DragEndpoint"; endpoint: Endpoint }
  | { status: "SnapPreview"; endpoint: Endpoint; anchor: AnchorHit }
  | { status: "DragRootMidpoint"; axis: DragAxis }
  | { status: "DragSegmentMidpoint"; segmentId: string; axis: DragAxis }
  | { status: "RecomputeBindings" };

export type MachineContext = {
  arrow: ArrowData;
  // drag runtime
  dragKind: DragKind;
  dragCpId?: string;
  startMouse?: Point;     // client
  startLocal?: Point;     // local point at drag start
  axis?: DragAxis;
  didActivateRootMid?: boolean;
};

export type MachineEvent =
  | { type: "SELECT_ARROW" }
  | { type: "DESELECT_ARROW" }
  | { type: "DELETE_ARROW" }
  | { type: "POINTER_DOWN_CP"; cp: ControlPoint; cpIndex: number }
  | { type: "POINTER_MOVE"; client: Point; viewport: Viewport; nearest?: AnchorHit | null; arrowElementPosWorld: Point }
  | { type: "POINTER_UP" }
  | { type: "CANCEL" }
  | { type: "ELEMENT_MOVED"; elementId: string; getAnchorPos: (hit: AnchorHit) => Point };

export const MIN_SEGMENT = 8;

// ---------- helpers ----------
export const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

export const isHorizontal = (s: ArrowSegment) => Math.abs(s.startPoint.y - s.endPoint.y) < 0.001;
export const isVertical = (s: ArrowSegment) => Math.abs(s.startPoint.x - s.endPoint.x) < 0.001;

export const decideAxis = (dx: number, dy: number): DragAxis | null => {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < 5 && ay < 5) return null;
  return ay > ax ? "vertical" : "horizontal";
};

export const clientToWorld = (client: Point, vp: Viewport): Point => ({
  x: (client.x - vp.pan.x) / vp.zoom,
  y: (client.y - vp.pan.y) / vp.zoom,
});

export const worldToLocal = (world: Point, arrowElementPosWorld: Point): Point => ({
  x: world.x - arrowElementPosWorld.x,
  y: world.y - arrowElementPosWorld.y,
});

const cloneArrow = (a: ArrowData): ArrowData => ({
  ...a,
  startPoint: { ...a.startPoint },
  endPoint: { ...a.endPoint },
  segments: a.segments.map(s => ({ ...s, startPoint: { ...s.startPoint }, endPoint: { ...s.endPoint } })),
  controlPoints: a.controlPoints.map(c => ({ ...c, position: { ...c.position }, connection: c.connection ? { ...c.connection, offset: { ...c.connection.offset } } : c.connection })),
  startConnection: a.startConnection ? { ...a.startConnection, offset: { ...a.startConnection.offset } } : null,
  endConnection: a.endConnection ? { ...a.endConnection, offset: { ...a.endConnection.offset } } : null,
  middlePoint: a.middlePoint ? { ...a.middlePoint } : undefined,
});

export const ensureControlPoints = (arrow: ArrowData): ArrowData => {
  const next = cloneArrow(arrow);

  if (!next.controlPoints || next.controlPoints.length === 0) {
    next.controlPoints = [
      { id: "start", type: "endpoint", position: next.startPoint, isActive: true, connection: next.startConnection ?? null },
      { id: "root-mid", type: "midpoint", position: mid(next.startPoint, next.endPoint), isActive: next.arrowType !== "straight" },
      { id: "end", type: "endpoint", position: next.endPoint, isActive: true, connection: next.endConnection ?? null },
    ];
  }
  return next;
};

// straight -> orthogonal by root midpoint drag
export const convertStraightToOrthogonal = (arrow: ArrowData, rootMidLocal: Point, axis: DragAxis): ArrowData => {
  const next = cloneArrow(arrow);
  next.arrowType = "orthogonal";
  next.middlePoint = rootMidLocal;

  const p0 = next.startPoint;
  const p3 = next.endPoint;

  const pts =
    axis === "vertical"
      ? [p0, { x: p0.x, y: rootMidLocal.y }, { x: p3.x, y: rootMidLocal.y }, p3]
      : [p0, { x: rootMidLocal.x, y: p0.y }, { x: rootMidLocal.x, y: p3.y }, p3];

  // rebuild segments
  next.segments = [
    { id: "seg-0", startPoint: pts[0], endPoint: pts[1] },
    { id: "seg-1", startPoint: pts[1], endPoint: pts[2] },
    { id: "seg-2", startPoint: pts[2], endPoint: pts[3] },
  ];

  // rebuild controlPoints: endpoints + midpoints for each segment + root-mid
  const segMids = next.segments.map((s, i) => ({
    id: `mid-seg-${i}`,
    type: "midpoint" as const,
    position: mid(s.startPoint, s.endPoint),
    isActive: true,
    segmentId: s.id,
  }));

  next.controlPoints = [
    { id: "start", type: "endpoint", position: next.startPoint, isActive: true, connection: next.startConnection ?? null },
    ...segMids,
    { id: "root-mid", type: "midpoint", position: rootMidLocal, isActive: true },
    { id: "end", type: "endpoint", position: next.endPoint, isActive: true, connection: next.endConnection ?? null },
  ];

  return simplify(next);
};

// root-mid move on existing orthogonal: adjust the "route" as whole (keep 3-segment base)
export const moveRootMidOnOrthogonal = (arrow: ArrowData, rootMidLocal: Point, axis: DragAxis): ArrowData => {
  // اذا عندك مسارات أعقد مستقبلاً، توسعها هنا. حالياً نخليها 3-segment canonical route.
  const base = cloneArrow(arrow);
  base.middlePoint = rootMidLocal;
  const p0 = base.startPoint;
  const p3 = base.endPoint;

  const pts =
    axis === "vertical"
      ? [p0, { x: p0.x, y: rootMidLocal.y }, { x: p3.x, y: rootMidLocal.y }, p3]
      : [p0, { x: rootMidLocal.x, y: p0.y }, { x: rootMidLocal.x, y: p3.y }, p3];

  // ensure exactly 3 segments (canonical)
  base.segments = [
    { id: base.segments[0]?.id ?? "seg-0", startPoint: pts[0], endPoint: pts[1] },
    { id: base.segments[1]?.id ?? "seg-1", startPoint: pts[1], endPoint: pts[2] },
    { id: base.segments[2]?.id ?? "seg-2", startPoint: pts[2], endPoint: pts[3] },
  ];

  // update segment midpoints positions only (keep ids/segmentId)
  base.controlPoints = base.controlPoints.map(cp => {
    if (cp.type === "endpoint") {
      if (cp.id === "start") return { ...cp, position: base.startPoint, connection: base.startConnection ?? null };
      if (cp.id === "end") return { ...cp, position: base.endPoint, connection: base.endConnection ?? null };
      return cp;
    }
    if (cp.id === "root-mid") return { ...cp, position: rootMidLocal, isActive: true };
    if (cp.type === "midpoint" && cp.segmentId) {
      const seg = base.segments.find(s => s.id === cp.segmentId);
      if (!seg) return cp;
      return { ...cp, position: mid(seg.startPoint, seg.endPoint), isActive: true };
    }
    return cp;
  });

  return simplify(base);
};

// move a segment midpoint: ONLY change that segment line (x for vertical segment, y for horizontal segment)
export const moveSegmentMidpoint = (arrow: ArrowData, segmentId: string, newLocal: Point): ArrowData => {
  const next = cloneArrow(arrow);
  const segIndex = next.segments.findIndex(s => s.id === segmentId);
  if (segIndex === -1) r
