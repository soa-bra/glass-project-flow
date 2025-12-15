import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import type {
  ArrowPoint,
  ArrowData,
  ArrowControlDragState,
  ArrowSegment,
  ArrowControlPoint as ArrowCP,
} from "@/types/arrow-connections";
import { findNearestAnchor, createStraightArrowData, generateId } from "@/types/arrow-connections";

interface ArrowControlPointsProps {
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

type Axis = "x" | "y";

type DragExt = ArrowControlDragState & {
  initialMousePos?: { x: number; y: number } | null;
  lockedAxis?: Axis | null; // المحور المقفول (ما يتغير)
  lockedValue?: number | null; // قيمة المحور المقفول
  draggingSegmentId?: string | null; // الضلع اللي نسحب نقطته
};

type LabelsMap = Record<string, string>; // segmentId -> label

const eps = 0.0001;

const clonePoint = (p: ArrowPoint): ArrowPoint => ({ x: p.x, y: p.y });

const deepCloneArrow = (data: ArrowData): ArrowData => ({
  ...data,
  startPoint: clonePoint(data.startPoint),
  endPoint: clonePoint(data.endPoint),
  segments: (data.segments || []).map((s) => ({
    ...s,
    startPoint: clonePoint(s.startPoint),
    endPoint: clonePoint(s.endPoint),
  })),
  controlPoints: (data.controlPoints || []).map((cp) => ({
    ...cp,
    position: clonePoint(cp.position),
    connection: cp.connection ? { ...cp.connection, offset: { ...cp.connection.offset } } : cp.connection,
  })),
});

const mid = (a: ArrowPoint, b: ArrowPoint): ArrowPoint => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

const isHorizontal = (s: ArrowSegment) =>
  Math.abs(s.endPoint.y - s.startPoint.y) <= Math.abs(s.endPoint.x - s.startPoint.x);
const isVertical = (s: ArrowSegment) => !isHorizontal(s);

const applyAxisLock = (p: ArrowPoint, lockedAxis: Axis | null | undefined, lockedValue: number | null | undefined) => {
  if (!lockedAxis || lockedValue == null) return p;
  if (lockedAxis === "x") return { x: lockedValue, y: p.y };
  return { x: p.x, y: lockedValue };
};

/**
 * يبني نقاط التحكم حسب النموذج:
 * - endpoints: start/end active
 * - midpoint على ضلع أ active
 * - midpoints على أضلاع ب: inactive
 */
const rebuildControlPoints_UModel = (
  data: ArrowData,
  activeMidpointSegmentId?: string,
  keepActiveMidpointId?: string,
) => {
  const d = deepCloneArrow(data);

  const cps: ArrowCP[] = [];

  // endpoints
  const startExisting = d.controlPoints?.find(
    (cp) => cp.type === "endpoint" && (cp.id === "start" || d.controlPoints.indexOf(cp) === 0),
  );
  const endExisting = d.controlPoints?.find(
    (cp) => cp.type === "endpoint" && (cp.id === "end" || d.controlPoints.indexOf(cp) === d.controlPoints.length - 1),
  );

  cps.push({
    id: startExisting?.id || "start",
    type: "endpoint",
    position: clonePoint(d.startPoint),
    isActive: true,
    connection: startExisting?.connection || null,
  });

  // لكل ضلع: نقطة منتصف
  d.segments.forEach((seg) => {
    const isA = activeMidpointSegmentId ? seg.id === activeMidpointSegmentId : false;
    const id = isA && keepActiveMidpointId ? keepActiveMidpointId : generateId();

    cps.push({
      id,
      type: "midpoint",
      position: mid(seg.startPoint, seg.endPoint),
      isActive: isA, // فقط ضلع أ يكون Active
      segmentId: seg.id,
    });
  });

  cps.push({
    id: endExisting?.id || "end",
    type: "endpoint",
    position: clonePoint(d.endPoint),
    isActive: true,
    connection: endExisting?.connection || null,
  });

  d.controlPoints = cps;
  return d;
};

/**
 * إنشاء U مفتوح:
 * - ضلع أ = الضلع الأصلي (start -> end) كما هو
 * - ضلعين ب من طرفي أ إلى مستوى السحب (عمودي إذا أ عرضي، وعرضي إذا أ طولي)
 */
const convertStraightToOpenU = (data: ArrowData, uLevel: number, rootMidpointId: string) => {
  const d = deepCloneArrow(data);

  const base: ArrowSegment = d.segments?.[0] || {
    id: generateId(),
    startPoint: clonePoint(d.startPoint),
    endPoint: clonePoint(d.endPoint),
  };
  const baseIsH = isHorizontal(base);

  const baseId = base.id || generateId();
  const baseSeg: ArrowSegment = {
    ...base,
    id: baseId,
    startPoint: clonePoint(d.startPoint),
    endPoint: clonePoint(d.endPoint),
  };

  // ضلعين ب
  let leg1: ArrowSegment;
  let leg2: ArrowSegment;

  if (baseIsH) {
    // أ عرضي => ب طولي (يتحرك Y)
    leg1 = {
      id: generateId(),
      startPoint: clonePoint(d.startPoint),
      endPoint: { x: d.startPoint.x, y: uLevel },
    };
    leg2 = {
      id: generateId(),
      startPoint: clonePoint(d.endPoint),
      endPoint: { x: d.endPoint.x, y: uLevel },
    };
  } else {
    // أ طولي => ب عرضي (يتحرك X)
    leg1 = {
      id: generateId(),
      startPoint: clonePoint(d.startPoint),
      endPoint: { x: uLevel, y: d.startPoint.y },
    };
    leg2 = {
      id: generateId(),
      startPoint: clonePoint(d.endPoint),
      endPoint: { x: uLevel, y: d.endPoint.y },
    };
  }

  d.arrowType = "orthogonal";
  d.segments = [leg1, baseSeg, leg2];

  // ملاحظة: start/end يظلون نهايات الضلع الأصلي (أ)
  d.startPoint = clonePoint(baseSeg.startPoint);
  d.endPoint = clonePoint(baseSeg.endPoint);

  // نقطة منتصف ضلع أ مفعلة (هي المرجع)
  return rebuildControlPoints_UModel(d, baseSeg.id, rootMidpointId);
};

/**
 * تحريك نقطة نهاية ضلع (ب) مع تثبيت محوره
 * - إذا الضلع ب طولي => نسمح بتحريك X فقط؟ لا: الطولي يتحرك يمين/يسار => X فقط (نقفل Y)
 * - إذا الضلع ب عرضي => يتحرك فوق/تحت => Y فقط (نقفل X)
 */
const moveSideLegEndpoint = (data: ArrowData, legSegmentId: string, newEnd: ArrowPoint) => {
  const d = deepCloneArrow(data);
  const idx = d.segments.findIndex((s) => s.id === legSegmentId);
  if (idx === -1) return d;

  const seg = d.segments[idx];
  const segIsH = isHorizontal(seg);

  // الضلع العرضي يتحرك Y فقط => endPoint.y يتغير، endPoint.x ثابت
  // الضلع الطولي يتحرك X فقط => endPoint.x يتغير، endPoint.y ثابت
  const updatedEnd: ArrowPoint = segIsH ? { x: seg.endPoint.x, y: newEnd.y } : { x: newEnd.x, y: seg.endPoint.y };

  d.segments[idx] = { ...seg, endPoint: updatedEnd };

  return d;
};

/**
 * عندما تُسحب نقطة ب غير مفعلة:
 * - تصبح مفعلة
 * - نولد ضلع جديد واحد (غير مفعّل) يربط طرف ب مع startPoint
 * - ونعدل ضلع أ (القاعدة) يطول/يقصر حسب مكان قاعدة ب
 *
 * الربط هنا مع startPoint (حسب وصفك).
 */
const activateBAndGenerateOneSegmentToStart = (data: ArrowData, legSegmentId: string, activeMidpointId: string) => {
  const d = deepCloneArrow(data);

  const legIdx = d.segments.findIndex((s) => s.id === legSegmentId);
  if (legIdx === -1) return d;

  const leg = d.segments[legIdx];

  // ضلع أ هو "الضلع الأصلي" = نحددّه بأنه الضلع اللي نقطة منتصفه Active الآن
  const activeA = d.controlPoints.find((cp) => cp.type === "midpoint" && cp.isActive && cp.segmentId);
  const aSegId = activeA?.segmentId || (d.segments[1]?.id ?? d.segments[0]?.id);

  const aIdx = d.segments.findIndex((s) => s.id === aSegId);
  if (aIdx === -1) return d;

  const aSeg = d.segments[aIdx];
  const aIsH = isHorizontal(aSeg);

  // 1) نجعل نقطة ب (midpoint لهذه الرجل) Active (تصير ضلع ب "مفعّل")
  // لكن حسب نموذجك: النقطة التي تُسحب على ب هي نقطة منتصف الضلع ب نفسه.
  // لذلك نبدّل الـ controlPoints لاحقًا بحيث هذا الـ segmentId يصبح activeMidpointSegmentId.
  // 2) نضيف ضلع جديد واحد (inactive) يربط طرف ب (leg.endPoint) مع startPoint (بداية السهم)
  const newSeg: ArrowSegment = {
    id: generateId(),
    startPoint: clonePoint(d.startPoint),
    endPoint: clonePoint(leg.endPoint),
  };

  // 3) تعديل ضلع أ (القاعدة) يطول/يقصر:
  // - إذا أ عرضي: نغيّر امتداده X بحسب leg.startPoint.x (قاعدة الرجل) أو leg.endPoint.x؟ المنطقي: قاعدة الرجل على طرف أ.
  //   بما أن الرجل متصلة بطرف أ (leg.startPoint هو startPoint أو endPoint)، فالتغيير يكون على الطرف المقابل عند الحاجة.
  // - هنا نطبق أقرب تفسير: إذا الرجل المتحركة كانت من جهة endPoint، نخلي endPoint على أ يصير بمحاذاة إسقاط طرف ب.
  //   وإذا من جهة startPoint، نخلي startPoint يصير بمحاذاة إسقاط طرف ب.
  //
  // هذا يخلي ضلع أ يطول/يقصر حسب حركة ب (يمين/يسار للعمودي أو فوق/تحت للعرضي).
  const legFromStart =
    Math.abs(leg.startPoint.x - d.startPoint.x) < eps && Math.abs(leg.startPoint.y - d.startPoint.y) < eps;

  const projectedOnA: ArrowPoint = aIsH
    ? { x: leg.endPoint.x, y: aSeg.startPoint.y }
    : { x: aSeg.startPoint.x, y: leg.endPoint.y };

  let newStart = clonePoint(aSeg.startPoint);
  let newEnd = clonePoint(aSeg.endPoint);

  if (legFromStart) {
    newStart = projectedOnA;
    d.startPoint = clonePoint(newStart);
  } else {
    newEnd = projectedOnA;
    d.endPoint = clonePoint(newEnd);
  }

  d.segments[aIdx] = { ...aSeg, startPoint: newStart, endPoint: newEnd };

  // 4) نضيف الضلع الجديد (inactive)
  d.segments.push(newSeg);

  // 5) إعادة بناء نقاط التحكم حسب النموذج:
  // - الآن ضلع أ يبقى Active
  // - ضلع ب المسحوب يصبح Active بدل أضلاع ب الأخرى؟ (حسب وصفك: “عند سحبها يتم تفعيلها”)
  //   فهنا نخلي نقطة منتصف ضلع ب المسحوب Active، ونخلي ضلع أ يظل Active كذلك؟
  // بما أنك قلت: “الضلع أ نقطة مفعله ثابتة” + “الضلع ب يتم تفعيله عند سحبه”
  // هذا يعني: أكثر من نقطة Active ممكنة. نعكس هذا داخل controlPoints:
  const rebuilt = rebuildControlPoints_UModel(d, aSeg.id, activeA?.id);

  // فعل midpoint الخاص بـ b
  const bMid = rebuilt.controlPoints.find((cp) => cp.type === "midpoint" && cp.segmentId === legSegmentId);
  if (bMid) bMid.isActive = true;

  // وخلي ActiveMidpointId (النقطة اللي سحبها المستخدم) تربط بهذا الضلع (ب)
  if (bMid) bMid.id = activeMidpointId;

  return rebuilt;
};

export const ArrowControlPoints: React.FC<ArrowControlPointsProps> = ({ element, viewport }) => {
  const { elements, updateElement } = useCanvasStore();

  // محرر النص لنقاط غير مفعلة
  const [editing, setEditing] = useState<{
    segmentId: string;
    at: ArrowPoint;
    value: string;
  } | null>(null);

  const [dragState, setDragState] = useState<DragExt>({
    isDragging: false,
    controlPoint: null,
    controlPointId: undefined,
    startPosition: null,
    nearestAnchor: null,
    initialMousePos: null,
    lockedAxis: null,
    lockedValue: null,
    draggingSegmentId: null,
  });

  const storedArrowData = element.data?.arrowData as ArrowData | undefined;

  const isArrowDataValid =
    storedArrowData &&
    storedArrowData.startPoint &&
    storedArrowData.endPoint &&
    (storedArrowData.startPoint.x !== storedArrowData.endPoint.x ||
      storedArrowData.startPoint.y !== storedArrowData.endPoint.y);

  const getDefaultArrowData = useCallback((): ArrowData => {
    const { width, height } = element.size;
    const shapeType = element.shapeType || element.data?.shapeType || "arrow_right";

    let startPoint: ArrowPoint;
    let endPoint: ArrowPoint;
    let headDirection: "start" | "end" | "both" | "none" = "end";

    switch (shapeType) {
      case "arrow_up":
        startPoint = { x: width / 2, y: height };
        endPoint = { x: width / 2, y: 0 };
        break;
      case "arrow_down":
        startPoint = { x: width / 2, y: 0 };
        endPoint = { x: width / 2, y: height };
        break;
      case "arrow_left":
        startPoint = { x: width, y: height / 2 };
        endPoint = { x: 0, y: height / 2 };
        break;
      default:
        startPoint = { x: 0, y: height / 2 };
        endPoint = { x: width, y: height / 2 };
    }

    const straight = createStraightArrowData(startPoint, endPoint, headDirection);
    // نضمن وجود segment واحد
    const s0: ArrowSegment = {
      id: generateId(),
      startPoint: clonePoint(straight.startPoint),
      endPoint: clonePoint(straight.endPoint),
    };
    straight.segments = [s0];
    straight.arrowType = "straight";
    straight.controlPoints = rebuildControlPoints_UModel(straight, s0.id).controlPoints;
    return straight;
  }, [element.size, element.shapeType, element.data?.shapeType]);

  const arrowData: ArrowData = useMemo(() => {
    if (!isArrowDataValid) return getDefaultArrowData();

    const d = deepCloneArrow(storedArrowData as ArrowData);
    if (!d.segments || d.segments.length === 0) {
      d.segments = [{ id: generateId(), startPoint: clonePoint(d.startPoint), endPoint: clonePoint(d.endPoint) }];
      d.arrowType = "straight";
    }
    if (!d.controlPoints || d.controlPoints.length === 0) {
      // افتراضيًا نفعل نقطة منتصف الضلع الأصلي (أ)
      d.controlPoints = rebuildControlPoints_UModel(d, d.segments[0].id).controlPoints;
      const aMid = d.controlPoints.find((cp) => cp.type === "midpoint" && cp.segmentId === d.segments[0].id);
      if (aMid) aMid.isActive = true;
    }
    return d;
  }, [isArrowDataValid, storedArrowData, getDefaultArrowData]);

  const otherElements = useMemo(
    () => elements.filter((el) => el.id !== element.id && el.type !== "arrow" && !el.shapeType?.startsWith("arrow_")),
    [elements, element.id],
  );

  const displayControlPoints = useMemo(() => arrowData.controlPoints || [], [arrowData]);

  // حذف ضلع مرتبط بنقطة midpoint Active
  const deleteActiveSegmentByMidpoint = useCallback(
    (midpointId: string) => {
      const d = deepCloneArrow(arrowData);
      const cp = d.controlPoints.find((c) => c.id === midpointId);
      if (!cp || cp.type !== "midpoint" || !cp.segmentId) return;
      if (!cp.isActive) return;

      const idx = d.segments.findIndex((s) => s.id === cp.segmentId);
      if (idx === -1) return;

      // لا نحذف إذا الضلع الوحيد
      if (d.segments.length === 1) return;

      // دمج منطقي: نوصل الضلع السابق باللاحق إن وجد
      const segs = [...d.segments];

      if (idx === 0) {
        // حذف الأول: خلي الثاني يبدأ من بداية الأول
        if (segs[1]) segs[1] = { ...segs[1], startPoint: clonePoint(segs[0].startPoint) };
        segs.splice(0, 1);
      } else if (idx === segs.length - 1) {
        // حذف الأخير: خلي السابق ينتهي عند نهاية الأخير
        segs[idx - 1] = { ...segs[idx - 1], endPoint: clonePoint(segs[idx].endPoint) };
        segs.splice(idx, 1);
      } else {
        // وسط: خلي السابق ينتهي عند نهاية التالي ثم احذف (الحالي + التالي)
        const prev = segs[idx - 1];
        const next = segs[idx + 1];
        segs[idx - 1] = { ...prev, endPoint: clonePoint(next.endPoint) };
        segs.splice(idx, 2);
      }

      d.segments = segs;
      d.startPoint = clonePoint(segs[0].startPoint);
      d.endPoint = clonePoint(segs[segs.length - 1].endPoint);
      d.arrowType = segs.length === 1 ? "straight" : "orthogonal";

      // إعادة بناء نقاط التحكم: نجعل ضلع أ = الضلع اللي “يشبه الأصلي” (الأقرب يكون أول ضلع)
      // هنا نثبت Active على أول ضلع (أ) + نحافظ على أي Active آخر إن وجد حسب حاجتك لاحقًا.
      const rebuilt = rebuildControlPoints_UModel(d, segs[0].id);
      const aMid = rebuilt.controlPoints.find((c) => c.type === "midpoint" && c.segmentId === segs[0].id);
      if (aMid) aMid.isActive = true;

      updateElement(element.id, { data: { ...element.data, arrowData: rebuilt } });
    },
    [arrowData, element, updateElement],
  );

  // بدء السحب + تثبيت المحور حسب الضلع وقت بداية السحب
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, cp: ArrowCP) => {
      e.stopPropagation();
      e.preventDefault();

      // اقفل تحرير النص إذا بدأنا سحب
      setEditing(null);

      const isStart = cp.type === "endpoint" && (cp.id === "start" || displayControlPoints.indexOf(cp) === 0);
      const isEnd =
        cp.type === "endpoint" &&
        (cp.id === "end" || displayControlPoints.indexOf(cp) === displayControlPoints.length - 1);

      const controlPointType = isStart ? "start" : isEnd ? "end" : "middle";

      let lockedAxis: Axis | null = null;
      let lockedValue: number | null = null;
      let draggingSegmentId: string | null = null;

      if (controlPointType === "middle" && cp.segmentId) {
        draggingSegmentId = cp.segmentId;
        const seg = arrowData.segments.find((s) => s.id === cp.segmentId);

        if (seg) {
          // الضلع العرضي يتحرك Y فقط => نقفل X
          // الضلع الطولي يتحرك X فقط => نقفل Y
          if (isHorizontal(seg)) {
            lockedAxis = "x";
            lockedValue = cp.position.x;
          } else {
            lockedAxis = "y";
            lockedValue = cp.position.y;
          }
        }
      }

      setDragState({
        isDragging: true,
        controlPoint: controlPointType,
        controlPointId: cp.id,
        startPosition: clonePoint(cp.position),
        nearestAnchor: null,
        initialMousePos: { x: e.clientX, y: e.clientY },
        lockedAxis,
        lockedValue,
        draggingSegmentId,
      });
    },
    [arrowData.segments, displayControlPoints],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.controlPoint || !dragState.initialMousePos || !dragState.startPosition)
        return;

      const deltaX = (e.clientX - dragState.initialMousePos.x) / viewport.zoom;
      const deltaY = (e.clientY - dragState.initialMousePos.y) / viewport.zoom;

      let newPoint: ArrowPoint = {
        x: dragState.startPosition.x + deltaX,
        y: dragState.startPosition.y + deltaY,
      };

      // تطبيق قفل المحور (حسب اتجاه الضلع عند بداية السحب)
      newPoint = applyAxisLock(newPoint, dragState.lockedAxis, dragState.lockedValue);

      // snapping فقط لنقاط النهاية
      const nearestAnchor =
        dragState.controlPoint !== "middle"
          ? findNearestAnchor(
              {
                x: (e.clientX - viewport.pan.x) / viewport.zoom,
                y: (e.clientY - viewport.pan.y) / viewport.zoom,
              },
              otherElements,
              30 / viewport.zoom,
            )
          : null;

      setDragState((prev) => ({ ...prev, nearestAnchor }));

      let d = deepCloneArrow(arrowData);

      // ---- endpoints drag (snap) ----
      if (dragState.controlPoint === "start" || dragState.controlPoint === "end") {
        const endpoint = dragState.controlPoint;
        const finalPoint = nearestAnchor
          ? { x: nearestAnchor.position.x - element.position.x, y: nearestAnchor.position.y - element.position.y }
          : newPoint;

        // تحديث start/end مع المحافظة على أول/آخر ضلع فقط (بدون Router)
        if (!d.segments || d.segments.length === 0) {
          d.segments = [{ id: generateId(), startPoint: clonePoint(d.startPoint), endPoint: clonePoint(d.endPoint) }];
        }

        if (endpoint === "start") {
          d.startPoint = clonePoint(finalPoint);
          d.segments[0] = { ...d.segments[0], startPoint: clonePoint(finalPoint) };
        } else {
          d.endPoint = clonePoint(finalPoint);
          d.segments[d.segments.length - 1] = {
            ...d.segments[d.segments.length - 1],
            endPoint: clonePoint(finalPoint),
          };
        }

        // إعادة بناء نقاط التحكم
        d = rebuildControlPoints_UModel(d, d.segments[1]?.id ?? d.segments[0].id);
      }

      // ---- midpoint drag ----
      if (dragState.controlPoint === "middle" && dragState.controlPointId && dragState.draggingSegmentId) {
        const cp = d.controlPoints.find((c) => c.id === dragState.controlPointId);
        const seg = d.segments.find((s) => s.id === dragState.draggingSegmentId);

        if (!seg) return;

        // حالة السهم مستقيم: أول سحب = U مفتوح
        if (d.arrowType === "straight" || d.segments.length === 1) {
          const s0 = d.segments[0];

          // base (أ) = الضلع الأصلي
          // level يكون حسب الحركة العمودية أو الأفقية على حسب اتجاه الضلع الأصلي:
          const baseIsH = isHorizontal(s0);
          const level = baseIsH ? newPoint.y : newPoint.x;

          d = convertStraightToOpenU(d, level, dragState.controlPointId);

          updateElement(element.id, { data: { ...element.data, arrowData: d } });
          return;
        }

        // سهم U أو متعامد: تمييز Active/Inactive
        if (!cp || cp.type !== "midpoint" || !cp.segmentId) {
          updateElement(element.id, { data: { ...element.data, arrowData: d } });
          return;
        }

        const isActive = !!cp.isActive;

        // لو النقطة غير مفعلة => هذا ضلع (ب) وتم سحبه:
        // 1) حرّك طرف ضلع ب (حسب قفل المحور)
        d = moveSideLegEndpoint(d, cp.segmentId, newPoint);

        if (!isActive) {
          // 2) فعّل النقطة + ولّد ضلع جديد واحد يربط طرف ب مع startPoint + تعديل ضلع أ
          d = activateBAndGenerateOneSegmentToStart(d, cp.segmentId, dragState.controlPointId);
        } else {
          // Active midpoint: نحرك ضلعها فقط (وبحسب القفل أصلاً)
          // هنا نحرّك الضلع كامل بشكل “مقيد”:
          const idx = d.segments.findIndex((s) => s.id === cp.segmentId);
          if (idx !== -1) {
            const s = d.segments[idx];
            if (isHorizontal(s)) {
              const y = newPoint.y;
              d.segments[idx] = { ...s, startPoint: { x: s.startPoint.x, y }, endPoint: { x: s.endPoint.x, y } };
            } else {
              const x = newPoint.x;
              d.segments[idx] = { ...s, startPoint: { x, y: s.startPoint.y }, endPoint: { x, y: s.endPoint.y } };
            }
            d = rebuildControlPoints_UModel(d, cp.segmentId, cp.id);
            // نحافظ على Active على هذا الضلع
            const midCp = d.controlPoints.find((c) => c.type === "midpoint" && c.segmentId === cp.segmentId);
            if (midCp) midCp.isActive = true;
          }
        }
      }

      updateElement(element.id, { data: { ...element.data, arrowData: d } });
    },
    [dragState, viewport, element, arrowData, otherElements, updateElement],
  );

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      controlPoint: null,
      controlPointId: undefined,
      startPosition: null,
      nearestAnchor: null,
      initialMousePos: null,
      lockedAxis: null,
      lockedValue: null,
      draggingSegmentId: null,
    });
  }, []);

  useEffect(() => {
    if (!dragState.isDragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // --- label store داخل arrowData (بدون تعديل Types) ---
  const getLabels = (d: ArrowData): LabelsMap => ((d as any).labels || {}) as LabelsMap;

  const setLabel = (segmentId: string, text: string) => {
    const d = deepCloneArrow(arrowData);
    const labels = { ...getLabels(d) };

    if (!text.trim()) {
      delete labels[segmentId];
    } else {
      labels[segmentId] = text;
    }

    (d as any).labels = labels;
    updateElement(element.id, { data: { ...element.data, arrowData: d } });
  };

  const getControlPointStyle = (cp: ArrowCP) => {
    const isConnected = cp.type === "endpoint" && !!cp.connection;
    const size = cp.isActive ? 10 : 6;

    return {
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: isConnected ? "hsl(var(--accent-green))" : cp.isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
      border: cp.isActive ? "1.5px solid #000000" : "1px dashed rgba(0,0,0,0.4)",
      cursor: "grab",
      boxShadow: cp.isActive ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
      zIndex: 1000,
      transition: "all 0.12s ease",
    } as React.CSSProperties;
  };

  const renderPathLines = () => {
    if (!arrowData.segments || arrowData.segments.length === 0) return null;
    if (arrowData.arrowType === "straight" && arrowData.segments.length === 1) return null;

    return (
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: element.size.width,
          height: element.size.height,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {arrowData.segments.map((segment) => (
          <line
            key={segment.id}
            x1={segment.startPoint.x}
            y1={segment.startPoint.y}
            x2={segment.endPoint.x}
            y2={segment.endPoint.y}
            stroke="hsl(var(--accent-blue))"
            strokeWidth={1}
            strokeDasharray="4,4"
            opacity={0.35}
          />
        ))}
      </svg>
    );
  };

  // عرض نصوص الأضلاع (لو موجودة)
  const renderLabels = () => {
    const labels = getLabels(arrowData);
    return arrowData.segments.map((seg) => {
      const txt = labels[seg.id];
      if (!txt) return null;

      const p = mid(seg.startPoint, seg.endPoint);
      return (
        <div
          key={`label-${seg.id}`}
          className="absolute pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
            color: "#000",
            background: "transparent",
            fontSize: 12,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            zIndex: 2000,
          }}
        >
          {txt}
        </div>
      );
    });
  };

  return (
    <>
      {renderPathLines()}
      {renderLabels()}

      {/* نقاط التحكم */}
      {displayControlPoints.map((cp, idx) => {
        const size = cp.isActive ? 10 : 6;

        return (
          <div
            key={cp.id}
            className="absolute"
            style={{
              left: cp.position.x - size / 2,
              top: cp.position.y - size / 2,
              ...getControlPointStyle(cp),
            }}
            onMouseDown={(e) => handleMouseDown(e, cp)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              // Active -> delete segment
              if (cp.type === "midpoint" && cp.isActive) {
                deleteActiveSegmentByMidpoint(cp.id);
                return;
              }

              // Inactive -> text edit
              if (cp.type === "midpoint" && !cp.isActive && cp.segmentId) {
                const existing = getLabels(arrowData)[cp.segmentId] || "";
                setEditing({ segmentId: cp.segmentId, at: cp.position, value: existing });
              }
            }}
            title={
              cp.type === "endpoint"
                ? idx === 0
                  ? "نقطة البداية - اسحب للاتصال بعنصر"
                  : "نقطة النهاية - اسحب للاتصال بعنصر"
                : cp.isActive
                  ? "نقطة مفعّلة - اسحب (مقيد بالمحور) / دبل كلك للحذف"
                  : "نقطة غير مفعّلة - اسحب لتفعيلها / دبل كلك لكتابة نص"
            }
          />
        );
      })}

      {/* محرر النص */}
      {editing && (
        <input
          autoFocus
          value={editing.value}
          onChange={(e) => setEditing((prev) => (prev ? { ...prev, value: e.target.value } : prev))}
          onBlur={() => {
            setLabel(editing.segmentId, editing.value);
            setEditing(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLabel(editing.segmentId, editing.value);
              setEditing(null);
            }
            if (e.key === "Escape") {
              setEditing(null);
            }
          }}
          className="absolute border-0 outline-none bg-transparent text-black"
          style={{
            left: editing.at.x,
            top: editing.at.y,
            transform: "translate(-50%, -50%)",
            zIndex: 3000,
            fontSize: 12,
            width: 180,
          }}
          placeholder=""
        />
      )}

      {/* مؤشر السناب */}
      {dragState.nearestAnchor && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: dragState.nearestAnchor.position.x * viewport.zoom + viewport.pan.x - 12,
            top: dragState.nearestAnchor.position.y * viewport.zoom + viewport.pan.y - 12,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "3px solid hsl(var(--accent-green))",
            backgroundColor: "rgba(61, 190, 139, 0.2)",
            animation: "pulse 0.5s ease-in-out infinite",
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </>
  );
};

export default ArrowControlPoints;
