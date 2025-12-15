import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import type {
  ArrowControlDragState,
  ArrowControlPoint as ArrowCP,
  ArrowData,
  ArrowPoint,
  ArrowSegment,
} from "@/types/arrow-connections";
import { findNearestAnchor, generateId, createStraightArrowData } from "@/types/arrow-connections";

/**
 * ✅ هذا الملف يعالج الغلط اللي صار عندك بالصورة:
 * الغلط كان لأننا كنا نولد ضلع “جديد” يربط نقطتين بشكل قطري (Diagonal)
 * وهذا يكسر نموذجك (كل الأضلاع لازم تكون إما عرضية أو طولية فقط).
 *
 * ✅ النموذج هنا حرفيًا:
 * اولا- أول سحب لنقطة المنتصف (سهم مستقيم) => يولد 3 أضلاع:
 *   - ب1 (غير نشط): من start الى زاوية البداية عند مستوى A
 *   - أ (نشط): الضلع السفلي/الأصلي المتحرك (يمتد بين الزاويتين)
 *   - ب2 (غير نشط): من زاوية النهاية الى end
 * ثانيا- تحريك أي ضلع:
 *   - الضلع العرضي يتحرك فوق/تحت فقط (يتغير Y فقط)
 *   - الضلع الطولي يتحرك يمين/يسار فقط (يتغير X فقط)
 *   - المحور يتثبت حسب حالة الضلع عند بداية السحب.
 * ثالثا- سحب ب (غير نشط) => يصير نشط + يقصر/يطول أ + يولد ضلع واحد جديد (غير نشط)
 *   BUT: “ضلع واحد” لازم يكون Orthogonal (ما فيه قطر). عشان كذا نضبطه ليكون بمحاذاة
 *   زاوية البداية (startCorner) وليس startPoint مباشرة إذا ما ينفع.
 *   (هذا هو الحل الوحيد اللي يحافظ على شرط: ضلع واحد بدون قطريات)
 * رابعا-
 *   - دبل كلك على نقطة نشطة => حذف الضلع
 *   - دبل كلك على نقطة غير نشطة => تحرير نص، وإذا النص فاضي يرجع للوضع الطبيعي
 */

interface ArrowControlPointsProps {
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

type Axis = "x" | "y";

type DragExt = ArrowControlDragState & {
  initialMousePos?: { x: number; y: number } | null;
  lockedAxis?: Axis | null; // المحور المقفول
  lockedValue?: number | null; // قيمة المحور المقفول
  segmentId?: string | null; // الضلع اللي نسحب نقطته
};

const cloneP = (p: ArrowPoint): ArrowPoint => ({ x: p.x, y: p.y });
const mid = (a: ArrowPoint, b: ArrowPoint): ArrowPoint => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

const isHorizontal = (s: ArrowSegment) =>
  Math.abs(s.endPoint.y - s.startPoint.y) <= Math.abs(s.endPoint.x - s.startPoint.x);

function deepClone(data: ArrowData): ArrowData {
  return {
    ...data,
    startPoint: cloneP(data.startPoint),
    endPoint: cloneP(data.endPoint),
    segments: (data.segments || []).map((s) => ({
      ...s,
      startPoint: cloneP(s.startPoint),
      endPoint: cloneP(s.endPoint),
    })),
    controlPoints: (data.controlPoints || []).map((cp) => ({
      ...cp,
      position: cloneP(cp.position),
      connection: cp.connection ? { ...cp.connection, offset: { ...cp.connection.offset } } : cp.connection,
    })),
  };
}

function rebuildControlPoints(
  data: ArrowData,
  activeSegmentIds: Set<string>,
  keepIds?: Record<string, string>,
): ArrowData {
  const d = deepClone(data);

  const cps: ArrowCP[] = [];

  // endpoints
  const startExisting = d.controlPoints?.find(
    (c) => c.type === "endpoint" && (c.id === "start" || d.controlPoints.indexOf(c) === 0),
  );
  const endExisting = d.controlPoints?.find(
    (c) => c.type === "endpoint" && (c.id === "end" || d.controlPoints.indexOf(c) === d.controlPoints.length - 1),
  );

  cps.push({
    id: startExisting?.id || "start",
    type: "endpoint",
    position: cloneP(d.startPoint),
    isActive: true,
    connection: startExisting?.connection || null,
  });

  d.segments.forEach((seg) => {
    cps.push({
      id: keepIds?.[seg.id] || generateId(),
      type: "midpoint",
      position: mid(seg.startPoint, seg.endPoint),
      isActive: activeSegmentIds.has(seg.id),
      segmentId: seg.id,
    });
  });

  cps.push({
    id: endExisting?.id || "end",
    type: "endpoint",
    position: cloneP(d.endPoint),
    isActive: true,
    connection: endExisting?.connection || null,
  });

  d.controlPoints = cps;
  return d;
}

/**
 * تحويل سهم مستقيم إلى نموذج U مفتوح:
 * start -> (start.x, levelY) -> (end.x, levelY) -> end
 * أو لو السهم طولي:
 * start -> (levelX, start.y) -> (levelX, end.y) -> end
 */
function convertStraightToOpenU(data: ArrowData, dragPoint: ArrowPoint, keepMidpointId: string): ArrowData {
  const d = deepClone(data);
  const base = d.segments?.[0] || { id: generateId(), startPoint: cloneP(d.startPoint), endPoint: cloneP(d.endPoint) };

  const baseIsH = isHorizontal(base);

  if (baseIsH) {
    const levelY = dragPoint.y;
    const startCorner = { x: d.startPoint.x, y: levelY };
    const endCorner = { x: d.endPoint.x, y: levelY };

    const b1: ArrowSegment = { id: generateId(), startPoint: cloneP(d.startPoint), endPoint: startCorner };
    const A: ArrowSegment = { id: generateId(), startPoint: startCorner, endPoint: endCorner };
    const b2: ArrowSegment = { id: generateId(), startPoint: endCorner, endPoint: cloneP(d.endPoint) };

    d.arrowType = "orthogonal";
    d.segments = [b1, A, b2];

    // A هو الضلع النشط
    return rebuildControlPoints(d, new Set([A.id]), { [A.id]: keepMidpointId });
  } else {
    const levelX = dragPoint.x;
    const startCorner = { x: levelX, y: d.startPoint.y };
    const endCorner = { x: levelX, y: d.endPoint.y };

    const b1: ArrowSegment = { id: generateId(), startPoint: cloneP(d.startPoint), endPoint: startCorner };
    const A: ArrowSegment = { id: generateId(), startPoint: startCorner, endPoint: endCorner };
    const b2: ArrowSegment = { id: generateId(), startPoint: endCorner, endPoint: cloneP(d.endPoint) };

    d.arrowType = "orthogonal";
    d.segments = [b1, A, b2];

    return rebuildControlPoints(d, new Set([A.id]), { [A.id]: keepMidpointId });
  }
}

/**
 * تحريك ضلع كامل (Active midpoint) مع الحفاظ على أنه يظل عرضي/طولي:
 * - إذا الضلع عرضي: يتحرك فوق/تحت => نغير Y للـ start/end معًا.
 * - إذا الضلع طولي: يتحرك يمين/يسار => نغير X للـ start/end معًا.
 */
function moveWholeSegment(data: ArrowData, segmentId: string, dragPoint: ArrowPoint): ArrowData {
  const d = deepClone(data);
  const idx = d.segments.findIndex((s) => s.id === segmentId);
  if (idx === -1) return d;

  const seg = d.segments[idx];
  if (isHorizontal(seg)) {
    const y = dragPoint.y;
    d.segments[idx] = { ...seg, startPoint: { x: seg.startPoint.x, y }, endPoint: { x: seg.endPoint.x, y } };
  } else {
    const x = dragPoint.x;
    d.segments[idx] = { ...seg, startPoint: { x, y: seg.startPoint.y }, endPoint: { x, y: seg.endPoint.y } };
  }

  // لازم نربط الأضلاع المجاورة
  if (idx > 0) d.segments[idx - 1] = { ...d.segments[idx - 1], endPoint: cloneP(d.segments[idx].startPoint) };
  if (idx < d.segments.length - 1)
    d.segments[idx + 1] = { ...d.segments[idx + 1], startPoint: cloneP(d.segments[idx].endPoint) };

  return d;
}

/**
 * تحريك طرف ضلع (غير نشط) بشكل مقيد، ثم تفعيله.
 * قاعدة النموذج:
 * - ب هو ضلع طرفي (الأول أو الأخير غالبًا).
 * - تحريك ب يغيّر طول أ (الضلع الأوسط) + يولد ضلع جديد واحد غير نشط.
 *
 * ✅ مهم: الضلع الجديد لازم Orthogonal (ما فيه قطر)
 * لذلك نربطه بالزاوية الأقرب (corner) وليس startPoint إذا كان الربط مع startPoint
 * يسبب قطر.
 */
function dragInactiveBAndActivate(data: ArrowData, bSegmentId: string, dragPoint: ArrowPoint): ArrowData {
  const d = deepClone(data);

  const bIdx = d.segments.findIndex((s) => s.id === bSegmentId);
  if (bIdx === -1) return d;

  // نفترض تركيب U الأساسي: [b1, A, b2] على الأقل
  const AIdx = Math.floor(d.segments.length / 2);
  const A = d.segments[AIdx];

  const b = d.segments[bIdx];
  const bIsH = isHorizontal(b);

  // 1) حرك b مع القيد (العرضي فوق/تحت، الطولي يمين/يسار)
  let newB: ArrowSegment = b;
  if (bIsH) {
    // عرضي => نغير Y فقط
    const y = dragPoint.y;
    newB = { ...b, startPoint: { x: b.startPoint.x, y }, endPoint: { x: b.endPoint.x, y } };
  } else {
    const x = dragPoint.x;
    newB = { ...b, startPoint: { x, y: b.startPoint.y }, endPoint: { x, y: b.endPoint.y } };
  }
  d.segments[bIdx] = newB;

  // 2) قص/طول A حسب اتجاه b
  // إذا bIdx قبل A => نعدل A.startPoint ليطابق نهاية b
  // إذا bIdx بعد A => نعدل A.endPoint ليطابق بداية b
  if (bIdx < AIdx) {
    d.segments[AIdx] = { ...A, startPoint: cloneP(newB.endPoint), endPoint: cloneP(A.endPoint) };
  } else {
    d.segments[AIdx] = { ...A, startPoint: cloneP(A.startPoint), endPoint: cloneP(newB.startPoint) };
  }

  // 3) إعادة ربط الأضلاع المجاورة لـ A
  if (AIdx - 1 >= 0) d.segments[AIdx - 1] = { ...d.segments[AIdx - 1], endPoint: cloneP(d.segments[AIdx].startPoint) };
  if (AIdx + 1 < d.segments.length)
    d.segments[AIdx + 1] = { ...d.segments[AIdx + 1], startPoint: cloneP(d.segments[AIdx].endPoint) };

  // 4) توليد ضلع جديد واحد غير نشط (Orthogonal):
  // نربط بين "نقطة البداية" و"نقطة b" ولكن بدون قطر.
  // إذا الربط المباشر يطلع قطر، نربطه بالزاوية (corner) الخاصة بالنقطة.

  const startP = d.startPoint;
  const cornerP = d.segments[0].endPoint; // زاوية البداية بعد b1
  const bTouch = bIdx < AIdx ? d.segments[AIdx].startPoint : d.segments[AIdx].endPoint;

  // جرّب ربط مباشر: إذا نفس X أو نفس Y => مسموح
  let connectorStart = cloneP(startP);
  let connectorEnd = cloneP(bTouch);

  const directOk =
    Math.abs(connectorStart.x - connectorEnd.x) < 0.0001 || Math.abs(connectorStart.y - connectorEnd.y) < 0.0001;
  if (!directOk) {
    // الحل الآمن: اربط بالزاوية (corner) بدل startPoint (يحافظ على ضلع واحد بدون قطر)
    connectorStart = cloneP(cornerP);
    connectorEnd = cloneP(bTouch);
  }

  const newSeg: ArrowSegment = {
    id: generateId(),
    startPoint: connectorStart,
    endPoint: connectorEnd,
  };

  d.segments.push(newSeg);

  // Active: A + b
  const actives = new Set<string>([d.segments[AIdx].id, bSegmentId]);
  return rebuildControlPoints(d, actives);
}

function deleteSegment(data: ArrowData, segmentId: string): ArrowData {
  const d = deepClone(data);
  const idx = d.segments.findIndex((s) => s.id === segmentId);
  if (idx === -1) return d;
  if (d.segments.length <= 1) return d;

  const segs = [...d.segments];

  if (idx === 0) {
    if (segs[1]) segs[1] = { ...segs[1], startPoint: cloneP(segs[0].startPoint) };
    segs.splice(0, 1);
  } else if (idx === segs.length - 1) {
    segs[idx - 1] = { ...segs[idx - 1], endPoint: cloneP(segs[idx].endPoint) };
    segs.splice(idx, 1);
  } else {
    // دمج prev مع next
    segs[idx - 1] = { ...segs[idx - 1], endPoint: cloneP(segs[idx + 1].endPoint) };
    segs.splice(idx, 2);
  }

  d.segments = segs;
  d.startPoint = cloneP(segs[0].startPoint);
  d.endPoint = cloneP(segs[segs.length - 1].endPoint);
  d.arrowType = segs.length === 1 ? "straight" : "orthogonal";

  // نخلي الضلع الأوسط Active افتراضيًا
  const midIdx = Math.floor(segs.length / 2);
  return rebuildControlPoints(d, new Set([segs[midIdx].id]));
}

export const ArrowControlPoints: React.FC<ArrowControlPointsProps> = ({ element, viewport }) => {
  const { elements, updateElement } = useCanvasStore();

  // تحرير نص للنقاط غير النشطة
  const [editing, setEditing] = useState<{ segmentId: string; at: ArrowPoint; value: string } | null>(null);

  const [dragState, setDragState] = useState<DragExt>({
    isDragging: false,
    controlPoint: null,
    controlPointId: undefined,
    startPosition: null,
    nearestAnchor: null,
    initialMousePos: null,
    lockedAxis: null,
    lockedValue: null,
    segmentId: null,
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

    const straight = createStraightArrowData(startPoint, endPoint, "end");
    const seg0: ArrowSegment = { id: generateId(), startPoint: cloneP(startPoint), endPoint: cloneP(endPoint) };
    straight.segments = [seg0];
    straight.arrowType = "straight";
    straight.controlPoints = rebuildControlPoints(straight, new Set([seg0.id])).controlPoints;
    return straight;
  }, [element.size, element.shapeType, element.data?.shapeType]);

  const arrowData: ArrowData = useMemo(() => {
    if (!isArrowDataValid) return getDefaultArrowData();

    const d = deepClone(storedArrowData as ArrowData);

    if (!d.segments || d.segments.length === 0) {
      d.segments = [{ id: generateId(), startPoint: cloneP(d.startPoint), endPoint: cloneP(d.endPoint) }];
      d.arrowType = "straight";
    }

    if (!d.controlPoints || d.controlPoints.length === 0) {
      const midIdx = Math.floor(d.segments.length / 2);
      const rebuilt = rebuildControlPoints(d, new Set([d.segments[midIdx].id]));
      return rebuilt;
    }

    return d;
  }, [isArrowDataValid, storedArrowData, getDefaultArrowData]);

  const otherElements = useMemo(
    () => elements.filter((el) => el.id !== element.id && el.type !== "arrow" && !el.shapeType?.startsWith("arrow_")),
    [elements, element.id],
  );

  const displayControlPoints = useMemo(() => arrowData.controlPoints || [], [arrowData]);

  const getLabels = (d: ArrowData) => ((d as any).labels || {}) as Record<string, string>;
  const setLabel = (segmentId: string, text: string) => {
    const d = deepClone(arrowData);
    const labels = { ...getLabels(d) };
    if (!text.trim()) delete labels[segmentId];
    else labels[segmentId] = text;
    (d as any).labels = labels;
    updateElement(element.id, { data: { ...element.data, arrowData: d } });
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, cp: ArrowCP) => {
      e.stopPropagation();
      e.preventDefault();
      setEditing(null);

      const isStart = cp.type === "endpoint" && (cp.id === "start" || displayControlPoints.indexOf(cp) === 0);
      const isEnd =
        cp.type === "endpoint" &&
        (cp.id === "end" || displayControlPoints.indexOf(cp) === displayControlPoints.length - 1);

      const controlPointType = isStart ? "start" : isEnd ? "end" : "middle";

      let lockedAxis: Axis | null = null;
      let lockedValue: number | null = null;
      let segmentId: string | null = null;

      if (controlPointType === "middle" && cp.segmentId) {
        segmentId = cp.segmentId;
        const seg = arrowData.segments.find((s) => s.id === cp.segmentId);
        if (seg) {
          // حسب نموذجك: العرضي يتحرك فوق/تحت => نقفل X
          // الطولي يتحرك يمين/يسار => نقفل Y
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
        startPosition: cloneP(cp.position),
        nearestAnchor: null,
        initialMousePos: { x: e.clientX, y: e.clientY },
        lockedAxis,
        lockedValue,
        segmentId,
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

      let newPoint: ArrowPoint = { x: dragState.startPosition.x + deltaX, y: dragState.startPosition.y + deltaY };

      if (dragState.lockedAxis && dragState.lockedValue != null) {
        if (dragState.lockedAxis === "x") newPoint = { x: dragState.lockedValue, y: newPoint.y };
        else newPoint = { x: newPoint.x, y: dragState.lockedValue };
      }

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

      let d = deepClone(arrowData);

      // endpoints (snap)
      if (dragState.controlPoint === "start" || dragState.controlPoint === "end") {
        const endpoint = dragState.controlPoint;
        const finalPoint = nearestAnchor
          ? { x: nearestAnchor.position.x - element.position.x, y: nearestAnchor.position.y - element.position.y }
          : newPoint;

        if (!d.segments || d.segments.length === 0) {
          d.segments = [{ id: generateId(), startPoint: cloneP(d.startPoint), endPoint: cloneP(d.endPoint) }];
        }

        if (endpoint === "start") {
          d.startPoint = cloneP(finalPoint);
          d.segments[0] = { ...d.segments[0], startPoint: cloneP(finalPoint) };
        } else {
          d.endPoint = cloneP(finalPoint);
          d.segments[d.segments.length - 1] = { ...d.segments[d.segments.length - 1], endPoint: cloneP(finalPoint) };
        }

        const midIdx = Math.floor(d.segments.length / 2);
        d = rebuildControlPoints(d, new Set([d.segments[midIdx].id]));

        updateElement(element.id, { data: { ...element.data, arrowData: d } });
        return;
      }

      // midpoints
      if (dragState.controlPoint === "middle" && dragState.controlPointId && dragState.segmentId) {
        const cp = d.controlPoints.find((c) => c.id === dragState.controlPointId);
        if (!cp || cp.type !== "midpoint" || !cp.segmentId) return;

        // straight -> convert to U
        if (d.arrowType === "straight" || d.segments.length === 1) {
          d = convertStraightToOpenU(d, newPoint, dragState.controlPointId);
          updateElement(element.id, { data: { ...element.data, arrowData: d } });
          return;
        }

        // active vs inactive
        if (cp.isActive) {
          d = moveWholeSegment(d, cp.segmentId, newPoint);

          // ابقِ نفس الضلع Active
          const act = new Set<string>([cp.segmentId]);
          d = rebuildControlPoints(d, act, { [cp.segmentId]: cp.id });

          updateElement(element.id, { data: { ...element.data, arrowData: d } });
          return;
        } else {
          // inactive (ب)
          d = dragInactiveBAndActivate(d, cp.segmentId, newPoint);
          updateElement(element.id, { data: { ...element.data, arrowData: d } });
          return;
        }
      }

      updateElement(element.id, { data: { ...element.data, arrowData: d } });
    },
    [dragState, viewport, otherElements, arrowData, updateElement, element],
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
      segmentId: null,
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

  const getControlPointStyle = (cp: ArrowCP) => {
    const isConnected = cp.type === "endpoint" && !!cp.connection;
    const size = cp.isActive ? 10 : 6;

    return {
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: isConnected ? "hsl(var(--accent-green))" : cp.isActive ? "#FFFFFF" : "rgba(255,255,255,0.4)",
      border: cp.isActive ? "1.5px solid #000" : "1px dashed rgba(0,0,0,0.4)",
      cursor: "grab",
      boxShadow: cp.isActive ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
      zIndex: 1000,
      transition: "all 0.12s ease",
    } as React.CSSProperties;
  };

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
      {renderLabels()}

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

              // Active -> delete
              if (cp.type === "midpoint" && cp.isActive && cp.segmentId) {
                const nd = deleteSegment(arrowData, cp.segmentId);
                updateElement(element.id, { data: { ...element.data, arrowData: nd } });
                return;
              }

              // Inactive -> text
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
                  ? "نقطة مفعّلة - اسحب (مقيد) / دبل كلك للحذف"
                  : "نقطة غير مفعّلة - اسحب لتفعيلها / دبل كلك لكتابة نص"
            }
          />
        );
      })}

      {editing && (
        <input
          autoFocus
          value={editing.value}
          onChange={(e) => setEditing((p) => (p ? { ...p, value: e.target.value } : p))}
          onBlur={() => {
            setLabel(editing.segmentId, editing.value);
            setEditing(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLabel(editing.segmentId, editing.value);
              setEditing(null);
            }
            if (e.key === "Escape") setEditing(null);
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
        />
      )}

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
