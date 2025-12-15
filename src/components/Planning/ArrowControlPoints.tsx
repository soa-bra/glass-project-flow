import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import type {
  ArrowPoint,
  ArrowData,
  ArrowControlDragState,
  ArrowControlPoint as ArrowCP,
} from "@/types/arrow-connections";
import {
  findNearestAnchor,
  createStraightArrowData,
  convertToOrthogonalPath,
  updateEndpointPosition,
  activateMidpointAndExpand,
} from "@/types/arrow-connections";

interface ArrowControlPointsProps {
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

type DragDirection = "horizontal" | "vertical";

type DragRuntime = {
  isDragging: boolean;
  controlPoint: "start" | "middle" | "end" | null;
  controlPointId?: string;
  startPosition?: ArrowPoint;
  initialMousePos?: { x: number; y: number };
  dragDirection?: DragDirection | null;
  // مهم: Gate لمنع توليد المسار أكثر من مرة
  didActivateMidpoint?: boolean;
};

const getMidPoint = (a: ArrowPoint, b: ArrowPoint): ArrowPoint => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const ArrowControlPoints: React.FC<ArrowControlPointsProps> = ({ element, viewport }) => {
  const { elements, updateElement } = useCanvasStore();

  // ====== ArrowData مصدر واحد موثوق ======
  const getDefaultArrowData = useCallback((): ArrowData => {
    const { width, height } = element.size;
    const shapeType = element.shapeType || element.data?.shapeType || "arrow_right";

    let startPoint: ArrowPoint = { x: 0, y: height / 2 };
    let endPoint: ArrowPoint = { x: width, y: height / 2 };
    let headDirection: "start" | "end" | "both" | "none" = "end";

    switch (shapeType) {
      case "arrow_left":
        startPoint = { x: width, y: height / 2 };
        endPoint = { x: 0, y: height / 2 };
        break;
      case "arrow_up":
        startPoint = { x: width / 2, y: height };
        endPoint = { x: width / 2, y: 0 };
        break;
      case "arrow_down":
        startPoint = { x: width / 2, y: 0 };
        endPoint = { x: width / 2, y: height };
        break;
      case "arrow_double_horizontal":
        startPoint = { x: 0, y: height / 2 };
        endPoint = { x: width, y: height / 2 };
        headDirection = "both";
        break;
      case "arrow_double_vertical":
        startPoint = { x: width / 2, y: 0 };
        endPoint = { x: width / 2, y: height };
        headDirection = "both";
        break;
      default:
        // default already set
        break;
    }

    return createStraightArrowData(startPoint, endPoint, headDirection);
  }, [element.size, element.shapeType, element.data?.shapeType]);

  const arrowData: ArrowData = useMemo(() => {
    const stored = element.data?.arrowData as ArrowData | undefined;
    const valid =
      stored?.startPoint &&
      stored?.endPoint &&
      (stored.startPoint.x !== stored.endPoint.x || stored.startPoint.y !== stored.endPoint.y);

    if (!valid) return getDefaultArrowData();

    // ترقية للبيانات القديمة
    if (!stored.segments || stored.segments.length === 0) {
      return createStraightArrowData(stored.startPoint, stored.endPoint, stored.headDirection || "end");
    }
    return stored;
  }, [element.data?.arrowData, getDefaultArrowData]);

  // ====== عناصر اخرى للسناب ======
  const otherElements = useMemo(
    () => elements.filter((el) => el.id !== element.id && el.type !== "arrow" && !el.shapeType?.startsWith("arrow_")),
    [elements, element.id],
  );

  // ====== نقاط العرض ======
  const displayControlPoints = useMemo(() => {
    if (arrowData.controlPoints && arrowData.controlPoints.length > 0) return arrowData.controlPoints;

    const mid = getMidPoint(arrowData.startPoint, arrowData.endPoint);
    return [
      { id: "start", type: "endpoint" as const, position: arrowData.startPoint, isActive: true },
      { id: "middle", type: "midpoint" as const, position: mid, isActive: false },
      { id: "end", type: "endpoint" as const, position: arrowData.endPoint, isActive: true },
    ];
  }, [arrowData]);

  // ====== Drag state (UI فقط) + DragRef (Runtime قوي) ======
  const [dragStateUI, setDragStateUI] = useState<
    ArrowControlDragState & {
      initialMousePos?: { x: number; y: number } | null;
      dragDirection?: DragDirection | null;
    }
  >({
    isDragging: false,
    controlPoint: null,
    controlPointId: undefined,
    startPosition: null,
    nearestAnchor: null,
    initialMousePos: null,
    dragDirection: null,
  });

  const dragRef = useRef<DragRuntime>({
    isDragging: false,
    controlPoint: null,
    dragDirection: null,
    didActivateMidpoint: false,
  });

  const setArrowData = useCallback(
    (next: ArrowData) => {
      updateElement(element.id, {
        data: { ...element.data, arrowData: next },
      });
    },
    [updateElement, element.id, element.data],
  );

  // ====== Helpers ======

  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => ({
      x: (clientX - viewport.pan.x) / viewport.zoom,
      y: (clientY - viewport.pan.y) / viewport.zoom,
    }),
    [viewport],
  );

  const decideDragDirection = (dx: number, dy: number): DragDirection | null => {
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (ax < 5 && ay < 5) return null;
    return ay > ax ? "vertical" : "horizontal";
  };

  // تحديث مسار بسيط “ثلاث أضلاع” حول المنصف (بدون توليد متكرر)
  const updateSimpleOrthogonalByMid = (data: ArrowData, mid: ArrowPoint, dir: DragDirection): ArrowData => {
    const next: ArrowData = { ...data };

    const p0 = next.startPoint;
    const p3 = next.endPoint;

    const pathPoints =
      dir === "vertical"
        ? [p0, { x: p0.x, y: mid.y }, { x: p3.x, y: mid.y }, p3]
        : [p0, { x: mid.x, y: p0.y }, { x: mid.x, y: p3.y }, p3];

    // لو عندك segments جاهزة 3+
    if (next.segments && next.segments.length >= 3) {
      next.segments = next.segments.map((s, i) => {
        if (i === 0) return { ...s, startPoint: pathPoints[0], endPoint: pathPoints[1] };
        if (i === 1) return { ...s, startPoint: pathPoints[1], endPoint: pathPoints[2] };
        if (i === 2) return { ...s, startPoint: pathPoints[2], endPoint: pathPoints[3] };
        return s;
      });
    }

    // تحديث نقاط منتصف الأضلاع للعرض
    if (next.controlPoints && next.segments) {
      next.controlPoints = next.controlPoints.map((cp) => {
        if (cp.type === "midpoint" && cp.segmentId) {
          const seg = next.segments.find((s) => s.id === cp.segmentId);
          if (!seg) return cp;
          return { ...cp, position: getMidPoint(seg.startPoint, seg.endPoint) };
        }
        return cp;
      });
    }

    next.middlePoint = mid;
    return next;
  };

  // ====== Start Drag ======
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, cp: any) => {
      e.stopPropagation();
      e.preventDefault();

      const isFirstEndpoint =
        cp.id === "start" || (cp.type === "endpoint" && displayControlPoints.indexOf(cp as any) === 0);
      const isLastEndpoint =
        cp.id === "end" ||
        (cp.type === "endpoint" && displayControlPoints.indexOf(cp as any) === displayControlPoints.length - 1);

      const controlPointType: "start" | "middle" | "end" = isFirstEndpoint
        ? "start"
        : isLastEndpoint
          ? "end"
          : "middle";

      dragRef.current = {
        isDragging: true,
        controlPoint: controlPointType,
        controlPointId: cp.id,
        startPosition: { ...cp.position },
        initialMousePos: { x: e.clientX, y: e.clientY },
        dragDirection: null,
        didActivateMidpoint: false,
      };

      setDragStateUI((prev) => ({
        ...prev,
        isDragging: true,
        controlPoint: controlPointType,
        controlPointId: cp.id,
        startPosition: { ...cp.position },
        nearestAnchor: null,
        initialMousePos: { x: e.clientX, y: e.clientY },
        dragDirection: null,
      }));
    },
    [displayControlPoints],
  );

  // ====== Move ======
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const dr = dragRef.current;
      if (!dr.isDragging || !dr.controlPoint || !dr.initialMousePos || !dr.startPosition) return;

      const dx = (e.clientX - dr.initialMousePos.x) / viewport.zoom;
      const dy = (e.clientY - dr.initialMousePos.y) / viewport.zoom;

      const newLocalPoint: ArrowPoint = {
        x: dr.startPosition.x + dx,
        y: dr.startPosition.y + dy,
      };

      // سناب فقط للأطراف
      const nearestAnchor =
        dr.controlPoint !== "middle"
          ? findNearestAnchor(screenToWorld(e.clientX, e.clientY), otherElements, 30 / viewport.zoom)
          : null;

      setDragStateUI((prev) => ({ ...prev, nearestAnchor }));

      // أحدث ArrowData من العنصر (عشان ما نعلق على نسخة قديمة)
      const currentData = (element.data?.arrowData as ArrowData | undefined) ?? arrowData;
      let nextData: ArrowData = { ...currentData };

      // ===== endpoints =====
      if (dr.controlPoint === "start" || dr.controlPoint === "end") {
        const endpoint: "start" | "end" = dr.controlPoint;

        const finalPoint = nearestAnchor
          ? {
              x: nearestAnchor.position.x - element.position.x,
              y: nearestAnchor.position.y - element.position.y,
            }
          : newLocalPoint;

        const connection = nearestAnchor
          ? { elementId: nearestAnchor.elementId, anchorPoint: nearestAnchor.anchorPoint, offset: { x: 0, y: 0 } }
          : null;

        nextData = updateEndpointPosition(nextData, endpoint, finalPoint, connection);
        setArrowData(nextData);
        return;
      }

      // ===== middle =====
      // تحديد اتجاه السحب مرة واحدة
      if (!dr.dragDirection) {
        const dir = decideDragDirection(dx, dy);
        if (dir) {
          dr.dragDirection = dir;
          setDragStateUI((prev) => ({ ...prev, dragDirection: dir }));
        } else {
          return;
        }
      }

      const dir = dr.dragDirection!;
      const cpId = dr.controlPointId;

      // 1) فعّل/حوّل المنصف مرة وحدة فقط (Gate)
      if (!dr.didActivateMidpoint && cpId) {
        const midpointCP = currentData.controlPoints?.find((c) => c.id === cpId);

        if (midpointCP && midpointCP.type === "midpoint" && !midpointCP.isActive) {
          if (midpointCP.segmentId) {
            nextData = activateMidpointAndExpand(currentData, cpId, newLocalPoint, dir);
          } else if (currentData.arrowType === "straight") {
            nextData = convertToOrthogonalPath(currentData, cpId, newLocalPoint, dir);
          } else {
            // fallback آمن
            nextData = currentData;
          }

          dr.didActivateMidpoint = true;
          setArrowData(nextData);
          return; // مهم: لا تكمل نفس الفريم عشان ما تتكرر التوليدات
        }

        // إذا أصلاً مفعّل
        dr.didActivateMidpoint = true;
      }

      // 2) بعد التفعيل: عدّل المسار بشكل نظيف بدل توليد جديد
      nextData = updateSimpleOrthogonalByMid(currentData, newLocalPoint, dir);
      setArrowData(nextData);
    },
    [
      viewport.zoom,
      viewport,
      otherElements,
      element.position.x,
      element.position.y,
      element.data,
      arrowData,
      screenToWorld,
      setArrowData,
    ],
  );

  const handleMouseUp = useCallback(() => {
    dragRef.current = {
      isDragging: false,
      controlPoint: null,
      dragDirection: null,
      didActivateMidpoint: false,
    };

    setDragStateUI({
      isDragging: false,
      controlPoint: null,
      controlPointId: undefined,
      startPosition: null,
      nearestAnchor: null,
      initialMousePos: null,
      dragDirection: null,
    });
  }, []);

  useEffect(() => {
    if (dragStateUI.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragStateUI.isDragging, handleMouseMove, handleMouseUp]);

  // ====== Style ======
  const getControlPointStyle = (cp: any) => {
    const isConnected = cp.type === "endpoint" && cp.connection;
    const isActive = cp.isActive;
    const size = isActive ? 10 : 8;

    return {
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: isConnected ? "hsl(var(--accent-green))" : isActive ? "#FFFFFF" : "transparent",
      border: `1.5px solid ${isActive ? "#000000" : "#3DA8F5"}`,
      cursor: "grab",
      boxShadow: isActive ? "0 1px 3px rgba(0, 0, 0, 0.2)" : "none",
      zIndex: 1000,
      transition: "all 0.15s ease",
    };
  };

  const renderPathLines = () => {
    if (arrowData.arrowType === "straight" || !arrowData.segments || arrowData.segments.length <= 1) return null;

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
            opacity={0.4}
          />
        ))}
      </svg>
    );
  };

  return (
    <>
      {renderPathLines()}

      {displayControlPoints.map((cp, idx) => {
        const size = cp.isActive ? 10 : 8;
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
            title={
              cp.type === "endpoint"
                ? idx === 0
                  ? "نقطة البداية - اسحب للاتصال بعنصر"
                  : "نقطة النهاية - اسحب للاتصال بعنصر"
                : cp.isActive
                  ? "نقطة المنتصف - اسحب لتعديل المسار"
                  : "نقطة غير نشطة - اسحب لإنشاء مسار متعامد"
            }
          />
        );
      })}

      {dragStateUI.nearestAnchor && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: dragStateUI.nearestAnchor.position.x * viewport.zoom + viewport.pan.x - 12,
            top: dragStateUI.nearestAnchor.position.y * viewport.zoom + viewport.pan.y - 12,
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
