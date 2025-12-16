/**
 * Arrow Routing System - نظام توجيه الأسهم المتقدم
 * يضمن أن جميع اتصالات الأسهم بالعناصر تنتهي بشكل T نظيف
 *
 * Rule Zero:
 * - أي اتصال بين طرف سهم وعنصر لازم ينتهي دائمًا بشكل حرف T
 * - ممنوع: اتصال موازي، اتصال من داخل العنصر، زاوية مائلة
 */

import type {
  ArrowPoint,
  ArrowData,
  ArrowSegment,
  ArrowControlPoint,
  ArrowConnection,
} from "@/types/arrow-connections";
import { generateId } from "@/types/arrow-connections";

// ================== Types ==================

export type SegmentOrientation = "horizontal" | "vertical";
export type EdgeOrientation = "horizontal" | "vertical";
export type SnapEdge = "top" | "bottom" | "left" | "right";

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface RoutingConfig {
  OFFSET_DISTANCE: number; // ازاحة “برا” على نفس حافة العنصر
  CONNECTOR_LENGTH: number; // طول وصلة الـ T القصيرة
  EPS: number; // حساسية المقارنات
}

const DEFAULT_CONFIG: RoutingConfig = {
  OFFSET_DISTANCE: 10,
  CONNECTOR_LENGTH: 10,
  EPS: 0.0001,
};

// ================== Geometry Helpers ==================

const cloneSegments = (segments: ArrowSegment[]): ArrowSegment[] =>
  segments.map((s) => ({
    ...s,
    startPoint: { ...s.startPoint },
    endPoint: { ...s.endPoint },
  }));

const isFinitePoint = (p: ArrowPoint) => Number.isFinite(p.x) && Number.isFinite(p.y);

const rectOf = (el: TargetElement) => ({
  left: el.position.x,
  top: el.position.y,
  right: el.position.x + el.size.width,
  bottom: el.position.y + el.size.height,
});

const pointInsideRect = (p: ArrowPoint, r: ReturnType<typeof rectOf>, eps = 0) =>
  p.x > r.left + eps && p.x < r.right - eps && p.y > r.top + eps && p.y < r.bottom - eps;

const approxEq = (a: number, b: number, eps: number) => Math.abs(a - b) <= eps;

export const getSegmentOrientation = (segment: ArrowSegment): SegmentOrientation => {
  const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
  const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);
  // لو متساوية نعتبرها horizontal لتقليل التذبذب
  return dy > dx ? "vertical" : "horizontal";
};

export const getEdgeOrientation = (snapEdge: SnapEdge): EdgeOrientation => {
  return snapEdge === "top" || snapEdge === "bottom" ? "horizontal" : "vertical";
};

const outwardNormal = (snapEdge: SnapEdge): { dx: number; dy: number } => {
  switch (snapEdge) {
    case "top":
      return { dx: 0, dy: -1 };
    case "bottom":
      return { dx: 0, dy: 1 };
    case "left":
      return { dx: -1, dy: 0 };
    case "right":
      return { dx: 1, dy: 0 };
  }
};

export const detectParallelSnap = (segment: ArrowSegment, snapEdge: SnapEdge): boolean => {
  const segO = getSegmentOrientation(segment);
  const edgeO = getEdgeOrientation(snapEdge);
  return segO === edgeO;
};

/**
 * فحص إذا المسار "الأقصر المتعامد" نحو السناب ممكن يمر داخل العنصر
 * (نكتفي بفحص نقاط وسيطة بسيطة + نقطة البداية)
 */
export const detectIntersection = (
  segmentEndpoint: ArrowPoint,
  snapPoint: ArrowPoint,
  targetElement: TargetElement,
  config: RoutingConfig = DEFAULT_CONFIG,
): boolean => {
  const r = rectOf(targetElement);

  // لو نقطة الضلع نفسها داخل العنصر -> تقاطع أكيد
  if (pointInsideRect(segmentEndpoint, r, config.EPS)) return true;

  // مسار متعامد بسيط (L-shape) له احتمالين: (x ثم y) أو (y ثم x)
  const pivot1: ArrowPoint = { x: snapPoint.x, y: segmentEndpoint.y };
  const pivot2: ArrowPoint = { x: segmentEndpoint.x, y: snapPoint.y };

  // إذا أي نقطة وسيطة داخل المستطيل هذا معناه المرور من الداخل غالبًا
  if (pointInsideRect(pivot1, r, config.EPS)) return true;
  if (pointInsideRect(pivot2, r, config.EPS)) return true;

  // كمان لو السناب نفسها داخل (مفروض ما يصير) نعتبره تقاطع
  if (pointInsideRect(snapPoint, r, config.EPS)) return true;

  return false;
};

// ================== Segment Operations ==================

const ensureContinuous = (segments: ArrowSegment[]) => {
  // يضمن تلامس كل ضلع مع اللي بعده (بدون كسور)
  for (let i = 0; i < segments.length - 1; i++) {
    segments[i + 1].startPoint = { ...segments[i].endPoint };
  }
};

const shiftSegmentRigid = (segments: ArrowSegment[], idx: number, dx: number, dy: number) => {
  const seg = segments[idx];
  seg.startPoint = { x: seg.startPoint.x + dx, y: seg.startPoint.y + dy };
  seg.endPoint = { x: seg.endPoint.x + dx, y: seg.endPoint.y + dy };

  // وصل قبل/بعد
  if (idx > 0) segments[idx - 1].endPoint = { ...seg.startPoint };
  if (idx < segments.length - 1) segments[idx + 1].startPoint = { ...seg.endPoint };
};

const setEndpointOnSegment = (segments: ArrowSegment[], endpointType: "start" | "end", p: ArrowPoint) => {
  if (segments.length === 0) return;
  if (endpointType === "start") {
    segments[0].startPoint = { ...p };
    if (segments.length > 1) segments[1].startPoint = { ...segments[0].endPoint };
  } else {
    segments[segments.length - 1].endPoint = { ...p };
    if (segments.length > 1)
      segments[segments.length - 2].endPoint = {
        ...segments[segments.length - 1].startPoint,
      };
  }
};

// ================== T / U Routing ==================

/**
 * يبني وصلة T نظيفة عند نقطة السناب:
 * - آخر/أول ضلع لازم يكون "عمودي على الحافة" في النهاية
 * - إذا الضلع موازي للحافة: نزيحه كامل + نضيف ضلع رابط واحد
 */
export const resolveTConnection = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: "start" | "end",
  config: RoutingConfig = DEFAULT_CONFIG,
): ArrowSegment[] => {
  const newSegs = cloneSegments(segments);
  if (newSegs.length === 0) return newSegs;

  const idx = endpointType === "start" ? 0 : newSegs.length - 1;
  const seg = newSegs[idx];

  const segO = getSegmentOrientation(seg);
  const edgeO = getEdgeOrientation(snapEdge);

  // نثبت طرف النهاية على السناب (مهم جدًا لمنع العشوائية)
  setEndpointOnSegment(newSegs, endpointType, snapPoint);

  // لو الضلع موازي للحافة: هذه “حالة 1”
  if (segO === edgeO) {
    // إزاحة الضلع كاملًا بوضعه المستقيم
    if (segO === "vertical") {
      // ضلع عمودي + حافة عمودية (left/right) -> نزح أفقياً
      const dx = snapEdge === "left" ? -config.OFFSET_DISTANCE : config.OFFSET_DISTANCE;
      shiftSegmentRigid(newSegs, idx, dx, 0);

      // نضيف ضلع رابط أفقي واحد للسناب
      if (endpointType === "start") {
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { ...snapPoint },
          endPoint: { x: newSegs[0].startPoint.x, y: snapPoint.y },
        };
        newSegs[0].startPoint = { ...connector.endPoint };
        newSegs.unshift(connector);
      } else {
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { x: newSegs[newSegs.length - 1].endPoint.x, y: snapPoint.y },
          endPoint: { ...snapPoint },
        };
        newSegs[newSegs.length - 1].endPoint = { ...connector.startPoint };
        newSegs.push(connector);
      }
    } else {
      // ضلع أفقي + حافة أفقية (top/bottom) -> نزح عمودياً
      const dy = snapEdge === "top" ? -config.OFFSET_DISTANCE : config.OFFSET_DISTANCE;
      shiftSegmentRigid(newSegs, idx, 0, dy);

      // نضيف ضلع رابط عمودي واحد للسناب
      if (endpointType === "start") {
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { ...snapPoint },
          endPoint: { x: snapPoint.x, y: newSegs[0].startPoint.y },
        };
        newSegs[0].startPoint = { ...connector.endPoint };
        newSegs.unshift(connector);
      } else {
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { x: snapPoint.x, y: newSegs[newSegs.length - 1].endPoint.y },
          endPoint: { ...snapPoint },
        };
        newSegs[newSegs.length - 1].endPoint = { ...connector.startPoint };
        newSegs.push(connector);
      }
    }

    ensureContinuous(newSegs);
    // نضمن آخر نقطة = snapPoint
    setEndpointOnSegment(newSegs, endpointType, snapPoint);
    return newSegs;
  }

  // لو ما هو موازي: اتصال طبيعي بس نضمن "T" بوصل قصير عمودي على الحافة
  // (حتى لو كان الضلع الأخير بعيد، نخليه يوقف قبل السناب ثم وصلة قصيرة)
  const normal = outwardNormal(snapEdge);
  const stubEnd: ArrowPoint = {
    x: snapPoint.x + normal.dx * config.CONNECTOR_LENGTH,
    y: snapPoint.y + normal.dy * config.CONNECTOR_LENGTH,
  };

  if (endpointType === "start") {
    // نخلي بداية المسار تبدأ من stubEnd بدل السناب، وبعدين نضيف connector من السناب -> stubEnd
    newSegs[0].startPoint = { ...stubEnd };
    if (newSegs.length > 1) newSegs[1].startPoint = { ...newSegs[0].endPoint };

    const connector: ArrowSegment = {
      id: generateId(),
      startPoint: { ...snapPoint },
      endPoint: { ...stubEnd },
    };
    newSegs.unshift(connector);
  } else {
    newSegs[newSegs.length - 1].endPoint = { ...stubEnd };
    if (newSegs.length > 1) {
      newSegs[newSegs.length - 2].endPoint = { ...newSegs[newSegs.length - 1].startPoint };
    }

    const connector: ArrowSegment = {
      id: generateId(),
      startPoint: { ...stubEnd },
      endPoint: { ...snapPoint },
    };
    newSegs.push(connector);
  }

  ensureContinuous(newSegs);
  setEndpointOnSegment(newSegs, endpointType, snapPoint);
  return newSegs;
};

/**
 * حالة (2) / U-Maneuver:
 * لما الوصول للسناب “يمر من داخل العنصر”، نسوي التفاف خارج الحافة ثم نرجع للسناب.
 *
 * الفكرة:
 * - نطلع لنقطة خارج الحافة (outsidePoint = snap + normal*OFFSET)
 * - نوصل من طرف السهم لنقطة محاذية خارجية ثم إلى outsidePoint ثم إلى snap
 * - آخر وصلة دائمًا عمودية على الحافة => T
 */
export const resolveUConnection = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: "start" | "end",
  targetElement: TargetElement,
  config: RoutingConfig = DEFAULT_CONFIG,
): ArrowSegment[] => {
  const newSegs = cloneSegments(segments);
  if (newSegs.length === 0) return newSegs;

  // نقطة خارجية “برا” على نفس الحافة
  const n = outwardNormal(snapEdge);
  const outsidePoint: ArrowPoint = {
    x: snapPoint.x + n.dx * config.OFFSET_DISTANCE,
    y: snapPoint.y + n.dy * config.OFFSET_DISTANCE,
  };

  // الطرف الحالي (قبل إعادة التوجيه)
  const idx = endpointType === "start" ? 0 : newSegs.length - 1;
  const currentEnd: ArrowPoint =
    endpointType === "start" ? { ...newSegs[0].startPoint } : { ...newSegs[newSegs.length - 1].endPoint };

  // pivot: نخلي المسار يطلع لمحاذاة outsidePoint بدون ما يدخل بالعنصر
  // نبني L-shape من currentEnd إلى pivot ثم outsidePoint ثم snapPoint
  let pivot: ArrowPoint;

  // نختار pivot بحيث يكون على نفس X أو Y للـ outsidePoint حسب الأفضل
  const dx = Math.abs(outsidePoint.x - currentEnd.x);
  const dy = Math.abs(outsidePoint.y - currentEnd.y);

  if (dx > dy) {
    pivot = { x: outsidePoint.x, y: currentEnd.y };
  } else {
    pivot = { x: currentEnd.x, y: outsidePoint.y };
  }

  const path: ArrowSegment[] = [];

  const addSeg = (a: ArrowPoint, b: ArrowPoint) => {
    // تجاهل الأضلاع الصفرية
    if (approxEq(a.x, b.x, config.EPS) && approxEq(a.y, b.y, config.EPS)) return;
    path.push({
      id: generateId(),
      startPoint: { ...a },
      endPoint: { ...b },
    });
  };

  if (endpointType === "start") {
    // نعيد بناء أول جزء فقط ثم نلصقه بباقي المسار
    const rest = newSegs.slice(1); // كل شيء بعد أول ضلع (بنوصله لاحقًا)

    addSeg(snapPoint, outsidePoint); // وصلة أخيرة (عمودية على الحافة) => T
    addSeg(outsidePoint, pivot);
    addSeg(pivot, currentEnd);

    // الآن نحتاج نخلي آخر نقطة في path تساوي بداية rest (لو فيه)
    // نخلي أول ضلع في rest يبدأ من currentEnd (المفروض أصلاً)
    // ونربط: آخر path.endPoint = rest[0].startPoint
    const rebuilt = [...path.reverse(), ...rest]; // reverse لأننا بنينا من السناب
    ensureContinuous(rebuilt);

    // ثبّت النهاية عند السناب
    setEndpointOnSegment(rebuilt, "start", snapPoint);
    return rebuilt;
  } else {
    const head = newSegs.slice(0, -1); // كل شيء قبل آخر ضلع

    addSeg(currentEnd, pivot);
    addSeg(pivot, outsidePoint);
    addSeg(outsidePoint, snapPoint); // وصلة أخيرة => T

    const rebuilt = [...head, ...path];
    ensureContinuous(rebuilt);
    setEndpointOnSegment(rebuilt, "end", snapPoint);
    return rebuilt;
  }
};

/**
 * اتصال مباشر:
 * - إذا كان موازي -> resolveTConnection
 * - غير موازي -> نبني وصلة T قصيرة بشكل دائم (حتى لو كان المسار “تمام”)
 */
export const connectDirectly = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: "start" | "end",
  config: RoutingConfig = DEFAULT_CONFIG,
): ArrowSegment[] => {
  // نعيد استخدام resolveTConnection لأنها تغطي الحالتين (موازي/غير موازي)
  return resolveTConnection(segments, snapPoint, snapEdge, endpointType, config);
};

// ================== Control Points Rebuild ==================

export const rebuildControlPoints = (segments: ArrowSegment[], originalArrowData: ArrowData): ArrowControlPoint[] => {
  const cps: ArrowControlPoint[] = [];

  const segs = segments;
  const startPoint = segs.length > 0 ? segs[0].startPoint : originalArrowData.startPoint;
  const endPoint = segs.length > 0 ? segs[segs.length - 1].endPoint : originalArrowData.endPoint;

  // endpoint: start
  const originalStart = originalArrowData.controlPoints?.[0];
  cps.push({
    id: originalStart?.id || generateId(),
    type: "endpoint",
    position: { ...startPoint },
    isActive: true,
    connection: originalArrowData.startConnection || null,
  });

  // midpoints
  segs.forEach((seg) => {
    const mid = {
      x: (seg.startPoint.x + seg.endPoint.x) / 2,
      y: (seg.startPoint.y + seg.endPoint.y) / 2,
    };
    const existing = originalArrowData.controlPoints?.find((cp) => cp.type === "midpoint" && cp.segmentId === seg.id);

    cps.push({
      id: existing?.id || generateId(),
      type: "midpoint",
      position: mid,
      isActive: existing?.isActive ?? false,
      segmentId: seg.id,
      label: (existing as any)?.label,
    } as ArrowControlPoint);
  });

  // endpoint: end
  const originalEnd = originalArrowData.controlPoints?.[originalArrowData.controlPoints.length - 1];
  cps.push({
    id: originalEnd?.id || generateId(),
    type: "endpoint",
    position: { ...endPoint },
    isActive: true,
    connection: originalArrowData.endConnection || null,
  });

  return cps;
};

// ================== Main Resolver ==================

export const resolveSnapConnection = (
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: TargetElement,
  endpointType: "start" | "end",
  config: RoutingConfig = DEFAULT_CONFIG,
): ArrowData => {
  const currentSegments = cloneSegments(arrowData.segments || []);
  if (currentSegments.length === 0) return arrowData;

  if (!isFinitePoint(snapPoint)) return arrowData;

  const connectedIdx = endpointType === "start" ? 0 : currentSegments.length - 1;
  const connectedSeg = currentSegments[connectedIdx];
  if (!connectedSeg) return arrowData;

  const isParallel = detectParallelSnap(connectedSeg, snapEdge);

  const segmentEndpoint = endpointType === "start" ? connectedSeg.startPoint : connectedSeg.endPoint;

  const intersects = detectIntersection(segmentEndpoint, snapPoint, targetElement, config);

  let newSegments: ArrowSegment[];
  if (intersects) {
    newSegments = resolveUConnection(currentSegments, snapPoint, snapEdge, endpointType, targetElement, config);
  } else {
    // سواء موازي أو غير موازي: resolveTConnection يغطي ويضمن T + تثبيت السناب
    newSegments = resolveTConnection(currentSegments, snapPoint, snapEdge, endpointType, config);
  }

  ensureContinuous(newSegments);
  setEndpointOnSegment(newSegments, endpointType, snapPoint);

  const newControlPoints = rebuildControlPoints(newSegments, arrowData);

  const newStartPoint = newSegments[0].startPoint;
  const newEndPoint = newSegments[newSegments.length - 1].endPoint;

  const newStartConnection =
    endpointType === "start"
      ? ({ elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection)
      : arrowData.startConnection;

  const newEndConnection =
    endpointType === "end"
      ? ({ elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection)
      : arrowData.endConnection;

  return {
    ...arrowData,
    startPoint: { ...newStartPoint },
    endPoint: { ...newEndPoint },
    segments: newSegments,
    controlPoints: newControlPoints,
    startConnection: newStartConnection,
    endConnection: newEndConnection,
    arrowType: "orthogonal",
  };
};

// ================== Drag Helper ==================

/**
 * تحريك طرف السهم أثناء السحب بدون ما “ينهار” المسار:
 * - يحرك أول/آخر ضلع “Rigidly” ويحافظ على زوايا 90
 * - لا يسوي إعادة توجيه سناب هنا (السناب يتم في MouseUp)
 */
export const moveConnectedSegmentRigidly = (
  arrowData: ArrowData,
  endpointType: "start" | "end",
  newEndpointPosition: ArrowPoint,
): ArrowData => {
  const segs = cloneSegments(arrowData.segments || []);
  if (segs.length === 0) return arrowData;

  const lastIdx = segs.length - 1;
  const idx = endpointType === "start" ? 0 : lastIdx;

  const seg = segs[idx];
  const segO = getSegmentOrientation(seg);

  if (endpointType === "start") {
    const old = { ...seg.startPoint };
    seg.startPoint = { ...newEndpointPosition };

    if (segO === "vertical") {
      // خله عمودي: x يتغير مع البداية، y للنهاية ثابت
      seg.endPoint = { x: seg.endPoint.x + (newEndpointPosition.x - old.x), y: seg.endPoint.y };
    } else {
      // أفقي: y يتغير مع البداية، x للنهاية ثابت
      seg.endPoint = { x: seg.endPoint.x, y: seg.endPoint.y + (newEndpointPosition.y - old.y) };
    }

    if (segs.length > 1) segs[1].startPoint = { ...seg.endPoint };
  } else {
    const old = { ...seg.endPoint };
    seg.endPoint = { ...newEndpointPosition };

    if (segO === "vertical") {
      // عمودي: x يتغير مع النهاية، y للبداية ثابت
      seg.startPoint = { x: seg.startPoint.x + (newEndpointPosition.x - old.x), y: seg.startPoint.y };
    } else {
      // أفقي: y يتغير مع النهاية، x للبداية ثابت
      seg.startPoint = { x: seg.startPoint.x, y: seg.startPoint.y + (newEndpointPosition.y - old.y) };
    }

    if (segs.length > 1) segs[lastIdx - 1].endPoint = { ...seg.startPoint };
  }

  ensureContinuous(segs);

  // control points: نحدّث فقط positions
  const newControlPoints = rebuildControlPoints(segs, arrowData);

  return {
    ...arrowData,
    startPoint: { ...segs[0].startPoint },
    endPoint: { ...segs[segs.length - 1].endPoint },
    segments: segs,
    controlPoints: newControlPoints,
  };
};

// ================== Element Move Update ==================

export const updateConnectionOnElementMove = (
  arrowData: ArrowData,
  movedElement: TargetElement,
  newAnchorPosition: ArrowPoint,
  connectionType: "start" | "end",
): ArrowData => {
  const connection = connectionType === "start" ? arrowData.startConnection : arrowData.endConnection;
  if (!connection || connection.elementId !== movedElement.id) return arrowData;

  const snapEdge = connection.anchorPoint as SnapEdge;

  return resolveSnapConnection(arrowData, newAnchorPosition, snapEdge, movedElement, connectionType);
};
