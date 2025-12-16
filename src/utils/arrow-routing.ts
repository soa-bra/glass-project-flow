/**
 * Arrow Routing System - نظام توجيه الأسهم المتقدم (الإصدار النهائي)
 * يضمن أن جميع اتصالات الأسهم بالعناصر تنتهي بشكل T نظيف
 *
 * قواعد هذا الإصدار (مطابقة لوصفك):
 * 1) إذا كانت نقطة النهاية تتجه بشكل مستقيم نحو نقطة السناب ويتحقق اتصال طبيعي (T مباشر) → بدون إضافة أضلاع.
 * 2) إذا كانت ستتصل بحد متعامد مع الضلع الأصلي → إضافة ضلع واحد فقط (ضمن الجزء المتغير).
 * 3) إذا كانت ستتصل من داخل الشكل (يمر المسار داخل العنصر) → إضافة ضلعين فقط (U).
 * 4) ممنوع تحريك/إزالة أي ضلع يحتوي Midpoint مفعّل. يُعدل فقط الجزء بين الطرف الملتصق وأقرب Midpoint مفعّل.
 */

import type {
  ArrowPoint,
  ArrowData,
  ArrowSegment,
  ArrowControlPoint,
  ArrowConnection,
} from "@/types/arrow-connections";
import { generateId } from "@/types/arrow-connections";

// ============= الأنواع والتعريفات =============

export type SegmentOrientation = "horizontal" | "vertical" | "diagonal";
export type EdgeOrientation = "horizontal" | "vertical";
export type SnapEdge = "top" | "bottom" | "left" | "right";

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface RoutingConfig {
  OFFSET_DISTANCE: number;
  CONNECTOR_LENGTH: number;
}

const DEFAULT_CONFIG: RoutingConfig = {
  OFFSET_DISTANCE: 20,
  CONNECTOR_LENGTH: 15,
};

// ============= دوال المساعدة الأساسية =============

export const getSegmentOrientation = (segment: ArrowSegment): SegmentOrientation => {
  const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
  const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);

  const tolerance = 3;
  if (dx < tolerance) return "vertical";
  if (dy < tolerance) return "horizontal";
  return "diagonal";
};

export const getEdgeOrientation = (snapEdge: SnapEdge): EdgeOrientation => {
  return snapEdge === "top" || snapEdge === "bottom" ? "horizontal" : "vertical";
};

export const detectParallelSnap = (segment: ArrowSegment, snapEdge: SnapEdge): boolean => {
  const segmentOrientation = getSegmentOrientation(segment);
  if (segmentOrientation === "diagonal") return false;
  const edgeOrientation = getEdgeOrientation(snapEdge);
  return segmentOrientation === edgeOrientation;
};

// ============= Intersection Helpers =============

export const detectIntersection = (
  fromPoint: ArrowPoint,
  toPoint: ArrowPoint,
  targetElement: TargetElement,
): boolean => {
  const { position, size } = targetElement;
  const padding = 10;

  const rect = {
    left: position.x - padding,
    top: position.y - padding,
    right: position.x + size.width + padding,
    bottom: position.y + size.height + padding,
  };

  const inside = (p: ArrowPoint) => p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom;

  // ✅ 1) إذا النقطة الثابتة داخل
  if (inside(fromPoint)) return true;

  // ✅ 2) تقاطع الخط المستقيم مع حدود المستطيل
  const edges: [ArrowPoint, ArrowPoint][] = [
    [
      { x: rect.left, y: rect.top },
      { x: rect.left, y: rect.bottom },
    ],
    [
      { x: rect.right, y: rect.top },
      { x: rect.right, y: rect.bottom },
    ],
    [
      { x: rect.left, y: rect.top },
      { x: rect.right, y: rect.top },
    ],
    [
      { x: rect.left, y: rect.bottom },
      { x: rect.right, y: rect.bottom },
    ],
  ];

  for (const [a, b] of edges) {
    if (lineIntersectsLine(fromPoint, toPoint, a, b)) return true;
  }

  // ✅ 3) فحص نقاط الانعطاف المحتملة لمسار متعامد (T)
  const midPoint1 = { x: toPoint.x, y: fromPoint.y };
  const midPoint2 = { x: fromPoint.x, y: toPoint.y };
  if (inside(midPoint1) || inside(midPoint2)) return true;

  return false;
};

const lineIntersectsLine = (p1: ArrowPoint, p2: ArrowPoint, p3: ArrowPoint, p4: ArrowPoint): boolean => {
  const ccw = (A: ArrowPoint, B: ArrowPoint, C: ArrowPoint): boolean => {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  };

  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
};

// ============= قواعد بناء المسار للجزء المتغير فقط =============

const approxEq = (a: number, b: number, tol = 5) => Math.abs(a - b) <= tol;

const isDirectNaturalConnection = (fixedPoint: ArrowPoint, snapPoint: ArrowPoint, snapEdge: SnapEdge): boolean => {
  // شرط "يتجه بشكل مستقيم" يختلف حسب الحافة:
  // - top/bottom: اتصال طبيعي إذا x متطابق (ضلع عمودي واحد)
  // - left/right: اتصال طبيعي إذا y متطابق (ضلع أفقي واحد)
  if (snapEdge === "top" || snapEdge === "bottom") {
    return approxEq(fixedPoint.x, snapPoint.x);
  }
  return approxEq(fixedPoint.y, snapPoint.y);
};

const buildDirectSegment = (fixedPoint: ArrowPoint, snapPoint: ArrowPoint): ArrowSegment[] => {
  return [
    {
      id: generateId(),
      startPoint: { ...fixedPoint },
      endPoint: { ...snapPoint },
    },
  ];
};

/**
 * مسار T للجزء المتغير:
 * - يسمح بـ 1 أو 2 أو 3 أضلاع (لكن حسب القواعد: إذا Direct → 1)
 * - آخر ضلع يكون عمودي على حافة العنصر.
 */
const createOrthogonalPathWithTShape = (
  fixedPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  config: RoutingConfig = DEFAULT_CONFIG,
): ArrowSegment[] => {
  // ✅ Rule 1: Direct natural connection → no extra segments
  if (isDirectNaturalConnection(fixedPoint, snapPoint, snapEdge)) {
    return buildDirectSegment(fixedPoint, snapPoint);
  }

  const segments: ArrowSegment[] = [];
  const offset = config.OFFSET_DISTANCE;

  switch (snapEdge) {
    case "top": {
      // آخر ضلع عمودي للأسفل (إلى top anchor)
      // إذا fixed أعلى من snap: نكتفي بضلعين (أفقي ثم عمودي)
      // إذا fixed أسفل من snap: نستخدم 3 أضلاع لتفادي المرور فوق/داخل (ضمن المنطق العام)
      if (fixedPoint.y < snapPoint.y) {
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: snapPoint.x, y: fixedPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: fixedPoint.y },
          endPoint: { ...snapPoint },
        });
      } else {
        const midY = snapPoint.y - offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: midY },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: midY },
          endPoint: { x: snapPoint.x, y: midY },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: midY },
          endPoint: { ...snapPoint },
        });
      }
      break;
    }

    case "bottom": {
      // آخر ضلع عمودي للأعلى (إلى bottom anchor)
      if (fixedPoint.y > snapPoint.y) {
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: snapPoint.x, y: fixedPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: fixedPoint.y },
          endPoint: { ...snapPoint },
        });
      } else {
        const midY = snapPoint.y + offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: midY },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: midY },
          endPoint: { x: snapPoint.x, y: midY },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: midY },
          endPoint: { ...snapPoint },
        });
      }
      break;
    }

    case "left": {
      // آخر ضلع أفقي لليمين (إلى left anchor)
      if (fixedPoint.x < snapPoint.x) {
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: snapPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: snapPoint.y },
          endPoint: { ...snapPoint },
        });
      } else {
        const midX = snapPoint.x - offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: midX, y: fixedPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: fixedPoint.y },
          endPoint: { x: midX, y: snapPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: snapPoint.y },
          endPoint: { ...snapPoint },
        });
      }
      break;
    }

    case "right": {
      // آخر ضلع أفقي لليسار (إلى right anchor)
      if (fixedPoint.x > snapPoint.x) {
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: snapPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: snapPoint.y },
          endPoint: { ...snapPoint },
        });
      } else {
        const midX = snapPoint.x + offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: midX, y: fixedPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: fixedPoint.y },
          endPoint: { x: midX, y: snapPoint.y },
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: snapPoint.y },
          endPoint: { ...snapPoint },
        });
      }
      break;
    }
  }

  return segments;
};

/**
 * ✅ U-shape للجزء المتغير فقط:
 * القاعدة: "من داخل الشكل" → ضلعين فقط (بالإضافة للضلع الأصلي ضمن الجزء المتغير)
 * تنفيذ عملي: 3 أضلاع متعامدة للجزء المتغير (خروج/التفاف/دخول)
 */
const createUShapePath = (
  fixedPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  config: RoutingConfig = DEFAULT_CONFIG,
): ArrowSegment[] => {
  const segments: ArrowSegment[] = [];
  const offset = config.OFFSET_DISTANCE;

  switch (snapEdge) {
    case "top": {
      const y = snapPoint.y - offset;
      segments.push({ id: generateId(), startPoint: { ...fixedPoint }, endPoint: { x: fixedPoint.x, y } });
      segments.push({ id: generateId(), startPoint: { x: fixedPoint.x, y }, endPoint: { x: snapPoint.x, y } });
      segments.push({ id: generateId(), startPoint: { x: snapPoint.x, y }, endPoint: { ...snapPoint } });
      break;
    }
    case "bottom": {
      const y = snapPoint.y + offset;
      segments.push({ id: generateId(), startPoint: { ...fixedPoint }, endPoint: { x: fixedPoint.x, y } });
      segments.push({ id: generateId(), startPoint: { x: fixedPoint.x, y }, endPoint: { x: snapPoint.x, y } });
      segments.push({ id: generateId(), startPoint: { x: snapPoint.x, y }, endPoint: { ...snapPoint } });
      break;
    }
    case "left": {
      const x = snapPoint.x - offset;
      segments.push({ id: generateId(), startPoint: { ...fixedPoint }, endPoint: { x, y: fixedPoint.y } });
      segments.push({ id: generateId(), startPoint: { x, y: fixedPoint.y }, endPoint: { x, y: snapPoint.y } });
      segments.push({ id: generateId(), startPoint: { x, y: snapPoint.y }, endPoint: { ...snapPoint } });
      break;
    }
    case "right": {
      const x = snapPoint.x + offset;
      segments.push({ id: generateId(), startPoint: { ...fixedPoint }, endPoint: { x, y: fixedPoint.y } });
      segments.push({ id: generateId(), startPoint: { x, y: fixedPoint.y }, endPoint: { x, y: snapPoint.y } });
      segments.push({ id: generateId(), startPoint: { x, y: snapPoint.y }, endPoint: { ...snapPoint } });
      break;
    }
  }

  return segments;
};

// ============= إعادة بناء نقاط التحكم (مع الحفاظ الحقيقي) =============

const pickStartEndpointId = (arrowData: ArrowData): string | undefined => {
  const endpoints = arrowData.controlPoints.filter((cp) => cp.type === "endpoint");
  return endpoints[0]?.id;
};

const pickEndEndpointId = (arrowData: ArrowData): string | undefined => {
  const endpoints = arrowData.controlPoints.filter((cp) => cp.type === "endpoint");
  return endpoints[endpoints.length - 1]?.id;
};

const rebuildControlPointsPreservingActive = (
  segments: ArrowSegment[],
  arrowData: ArrowData,
  preservedMidpoints: ArrowControlPoint[],
): ArrowControlPoint[] => {
  const cps: ArrowControlPoint[] = [];

  const startId = pickStartEndpointId(arrowData) || generateId();
  const endId = pickEndEndpointId(arrowData) || generateId();

  const startPoint = segments.length > 0 ? segments[0].startPoint : arrowData.startPoint;
  cps.push({
    id: startId,
    type: "endpoint",
    position: { ...startPoint },
    isActive: true,
    connection: arrowData.startConnection || null,
  });

  for (const seg of segments) {
    const midPos = {
      x: (seg.startPoint.x + seg.endPoint.x) / 2,
      y: (seg.startPoint.y + seg.endPoint.y) / 2,
    };

    // ✅ Preserve by segmentId (IDs of preserved segments stay same)
    const preserved = preservedMidpoints.find((cp) => cp.segmentId === seg.id);

    // ✅ If not preserved, try to reuse from current arrowData (same seg id)
    const existing = arrowData.controlPoints.find((cp) => cp.type === "midpoint" && cp.segmentId === seg.id);

    cps.push({
      id: preserved?.id || existing?.id || generateId(),
      type: "midpoint",
      position: midPos,
      isActive: preserved?.isActive ?? existing?.isActive ?? false,
      segmentId: seg.id,
      label: preserved?.label ?? existing?.label,
    });
  }

  const endPoint = segments.length > 0 ? segments[segments.length - 1].endPoint : arrowData.endPoint;
  cps.push({
    id: endId,
    type: "endpoint",
    position: { ...endPoint },
    isActive: true,
    connection: arrowData.endConnection || null,
  });

  return cps;
};

// ============= قفل الأضلاع ذات النقاط المفعّلة =============

/**
 * ✅ يرجّع index أقرب ضلع يحتوي midpoint مفعّلة بدءًا من طرف معيّن.
 */
const findNearestActiveMidpointIndex = (arrowData: ArrowData, fromEndpoint: "start" | "end"): number | null => {
  const activeMidpoints = arrowData.controlPoints.filter(
    (cp) => cp.type === "midpoint" && cp.isActive === true && cp.segmentId,
  );

  if (activeMidpoints.length === 0) return null;

  if (fromEndpoint === "start") {
    for (let i = 0; i < arrowData.segments.length; i++) {
      const seg = arrowData.segments[i];
      if (activeMidpoints.some((cp) => cp.segmentId === seg.id)) return i;
    }
  } else {
    for (let i = arrowData.segments.length - 1; i >= 0; i--) {
      const seg = arrowData.segments[i];
      if (activeMidpoints.some((cp) => cp.segmentId === seg.id)) return i;
    }
  }

  return null;
};

const reverseSegments = (segments: ArrowSegment[]): ArrowSegment[] => {
  // reverse order and swap start/end
  return segments
    .slice()
    .reverse()
    .map((seg) => ({
      ...seg,
      startPoint: { ...seg.endPoint },
      endPoint: { ...seg.startPoint },
    }));
};

// ============= الدالة الرئيسية للتوجيه (Partial Routing) =============

export const resolveSnapConnection = (
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: TargetElement,
  endpointType: "start" | "end",
  config: RoutingConfig = DEFAULT_CONFIG,
): ArrowData => {
  const nearestActiveIndex = findNearestActiveMidpointIndex(arrowData, endpointType);

  let fixedPoint: ArrowPoint;
  let preservedSegments: ArrowSegment[] = [];
  let preservedMidpoints: ArrowControlPoint[] = [];

  if (nearestActiveIndex !== null) {
    if (endpointType === "start") {
      // ✅ preserve from active segment to end
      preservedSegments = arrowData.segments.slice(nearestActiveIndex);
      fixedPoint = { ...preservedSegments[0].startPoint };

      preservedMidpoints = arrowData.controlPoints.filter((cp) => {
        if (cp.type !== "midpoint" || !cp.segmentId) return false;
        return preservedSegments.some((s) => s.id === cp.segmentId);
      });
    } else {
      // ✅ preserve from start to active segment
      preservedSegments = arrowData.segments.slice(0, nearestActiveIndex + 1);
      fixedPoint = { ...preservedSegments[preservedSegments.length - 1].endPoint };

      preservedMidpoints = arrowData.controlPoints.filter((cp) => {
        if (cp.type !== "midpoint" || !cp.segmentId) return false;
        return preservedSegments.some((s) => s.id === cp.segmentId);
      });
    }
  } else {
    fixedPoint = endpointType === "start" ? { ...arrowData.endPoint } : { ...arrowData.startPoint };
  }

  // ✅ قرار U-shape فقط عند المرور من داخل العنصر
  const needsUShape = detectIntersection(fixedPoint, snapPoint, targetElement);

  // ✅ بناء الجزء المتغير فقط
  let newPathSegments = needsUShape
    ? createUShapePath(fixedPoint, snapPoint, snapEdge, config)
    : createOrthogonalPathWithTShape(fixedPoint, snapPoint, snapEdge, config);

  // ✅ إذا الطرف المسحوب هو البداية: نعكس الجزء المتغير فقط
  if (endpointType === "start") {
    newPathSegments = reverseSegments(newPathSegments);
  }

  // ✅ دمج بدون لمس preservedSegments IDs
  let finalSegments: ArrowSegment[];

  if (nearestActiveIndex !== null) {
    if (endpointType === "start") {
      // new + preserved
      if (newPathSegments.length > 0 && preservedSegments.length > 0) {
        newPathSegments[newPathSegments.length - 1] = {
          ...newPathSegments[newPathSegments.length - 1],
          endPoint: { ...preservedSegments[0].startPoint },
        };
      }
      finalSegments = [...newPathSegments, ...preservedSegments];
    } else {
      // preserved + new
      if (preservedSegments.length > 0 && newPathSegments.length > 0) {
        newPathSegments[0] = {
          ...newPathSegments[0],
          startPoint: { ...preservedSegments[preservedSegments.length - 1].endPoint },
        };
      }
      finalSegments = [...preservedSegments, ...newPathSegments];
    }
  } else {
    finalSegments = newPathSegments;
  }

  // ✅ تحديث start/end من segments
  const newStartPoint = finalSegments.length > 0 ? { ...finalSegments[0].startPoint } : { ...arrowData.startPoint };
  const newEndPoint =
    finalSegments.length > 0 ? { ...finalSegments[finalSegments.length - 1].endPoint } : { ...arrowData.endPoint };

  // ✅ تحديث الاتصالات
  const newStartConnection =
    endpointType === "start"
      ? ({ elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection)
      : arrowData.startConnection;

  const newEndConnection =
    endpointType === "end"
      ? ({ elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection)
      : arrowData.endConnection;

  const newArrowData: ArrowData = {
    ...arrowData,
    startPoint: newStartPoint,
    endPoint: newEndPoint,
    segments: finalSegments,
    startConnection: newStartConnection,
    endConnection: newEndConnection,
    arrowType: "orthogonal",
  };

  // ✅ إعادة بناء controlPoints مع الحفاظ الحقيقي لهوية endpoints + midpoints المحفوظة
  newArrowData.controlPoints = rebuildControlPointsPreservingActive(finalSegments, newArrowData, preservedMidpoints);

  return newArrowData;
};

// ============= تحديث الاتصال عند تحريك عنصر =============

export const updateConnectionOnElementMove = (
  arrowData: ArrowData,
  movedElement: TargetElement,
  newAnchorPosition: ArrowPoint,
  connectionType: "start" | "end",
): ArrowData => {
  const connection = connectionType === "start" ? arrowData.startConnection : arrowData.endConnection;

  if (!connection || connection.elementId !== movedElement.id) {
    return arrowData;
  }

  const snapEdge = connection.anchorPoint as SnapEdge;

  return resolveSnapConnection(arrowData, newAnchorPosition, snapEdge, movedElement, connectionType);
};

// ============= (اختياري) تحريك صلب - تُترك كما هي إذا كانت مستخدمة =============

export const moveConnectedSegmentRigidly = (
  arrowData: ArrowData,
  endpoint: "start" | "end",
  newPosition: ArrowPoint,
): ArrowData => {
  const newData: ArrowData = {
    ...arrowData,
    startPoint: { ...arrowData.startPoint },
    endPoint: { ...arrowData.endPoint },
    segments: arrowData.segments.map((s) => ({
      ...s,
      startPoint: { ...s.startPoint },
      endPoint: { ...s.endPoint },
    })),
    controlPoints: arrowData.controlPoints.map((cp) => ({
      ...cp,
      position: { ...cp.position },
    })),
  };

  const isStraight = newData.arrowType === "straight" || newData.segments.length <= 1;

  if (isStraight) {
    if (endpoint === "start") {
      newData.startPoint = { ...newPosition };
      if (newData.segments.length > 0) newData.segments[0].startPoint = { ...newPosition };
    } else {
      newData.endPoint = { ...newPosition };
      if (newData.segments.length > 0) newData.segments[newData.segments.length - 1].endPoint = { ...newPosition };
    }
  } else {
    if (endpoint === "start") {
      const oldStartPoint = arrowData.startPoint;
      newData.startPoint = { ...newPosition };

      const deltaX = newPosition.x - oldStartPoint.x;
      const deltaY = newPosition.y - oldStartPoint.y;

      const firstSegment = arrowData.segments[0];
      const segOrientation = getSegmentOrientation(firstSegment);

      if (segOrientation === "vertical") {
        newData.segments[0] = {
          ...firstSegment,
          startPoint: { ...newPosition },
          endPoint: { x: firstSegment.endPoint.x + deltaX, y: firstSegment.endPoint.y },
        };
      } else {
        newData.segments[0] = {
          ...firstSegment,
          startPoint: { ...newPosition },
          endPoint: { x: firstSegment.endPoint.x, y: firstSegment.endPoint.y + deltaY },
        };
      }

      if (newData.segments.length > 1) {
        newData.segments[1] = { ...newData.segments[1], startPoint: { ...newData.segments[0].endPoint } };
      }
    } else {
      const oldEndPoint = arrowData.endPoint;
      newData.endPoint = { ...newPosition };

      const deltaX = newPosition.x - oldEndPoint.x;
      const deltaY = newPosition.y - oldEndPoint.y;

      const lastIdx = arrowData.segments.length - 1;
      const lastSegment = arrowData.segments[lastIdx];
      const segOrientation = getSegmentOrientation(lastSegment);

      if (segOrientation === "vertical") {
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: { x: lastSegment.startPoint.x + deltaX, y: lastSegment.startPoint.y },
          endPoint: { ...newPosition },
        };
      } else {
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: { x: lastSegment.startPoint.x, y: lastSegment.startPoint.y + deltaY },
          endPoint: { ...newPosition },
        };
      }

      if (newData.segments.length > 1) {
        newData.segments[lastIdx - 1] = {
          ...newData.segments[lastIdx - 1],
          endPoint: { ...newData.segments[lastIdx].startPoint },
        };
      }
    }
  }

  // تحديث controlPoints (بدون فقد IDs إن أمكن)
  newData.controlPoints = rebuildControlPointsPreservingActive(
    newData.segments,
    newData,
    newData.controlPoints.filter((cp) => cp.type === "midpoint" && cp.isActive && cp.segmentId),
  );

  return newData;
};
