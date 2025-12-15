import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { 
  ArrowPoint, 
  ArrowData, 
  ElementAnchor,
  ArrowControlDragState,
  ArrowSegment,
  ArrowControlPoint as ArrowCP
} from '@/types/arrow-connections';
import { 
  findNearestAnchor, 
  getAnchorPosition,
  createStraightArrowData,
  convertToOrthogonalPath,
  updateEndpointPosition,
  activateMidpointAndExpand,
  generateId
} from '@/types/arrow-connections';

interface ArrowControlPointsProps {
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

/**
 * مكون نقاط التحكم للأسهم
 * يدعم النظام الجديد مع المسارات المتعامدة
 */
export const ArrowControlPoints: React.FC<ArrowControlPointsProps> = ({
  element,
  viewport
}) => {
  const { elements, updateElement } = useCanvasStore();
  
  const [dragState, setDragState] = useState<ArrowControlDragState & { 
    initialMousePos?: { x: number; y: number } | null;
    dragDirection?: 'horizontal' | 'vertical' | null;
  }>({
    isDragging: false,
    controlPoint: null,
    controlPointId: undefined,
    startPosition: null,
    nearestAnchor: null,
    initialMousePos: null,
    dragDirection: null
  });

  // الحصول على بيانات السهم أو إنشاء بيانات افتراضية
  const getDefaultArrowData = useCallback((): ArrowData => {
    const { width, height } = element.size;
    const shapeType = element.shapeType || element.data?.shapeType || 'arrow_right';
    
    let startPoint: ArrowPoint;
    let endPoint: ArrowPoint;
    let headDirection: 'start' | 'end' | 'both' | 'none' = 'end';

    switch (shapeType) {
      case 'arrow_right':
        startPoint = { x: 0, y: height / 2 };
        endPoint = { x: width, y: height / 2 };
        break;
      case 'arrow_left':
        startPoint = { x: width, y: height / 2 };
        endPoint = { x: 0, y: height / 2 };
        break;
      case 'arrow_up':
        startPoint = { x: width / 2, y: height };
        endPoint = { x: width / 2, y: 0 };
        break;
      case 'arrow_down':
        startPoint = { x: width / 2, y: 0 };
        endPoint = { x: width / 2, y: height };
        break;
      case 'arrow_up_right':
        startPoint = { x: 0, y: height };
        endPoint = { x: width, y: 0 };
        break;
      case 'arrow_down_right':
        startPoint = { x: 0, y: 0 };
        endPoint = { x: width, y: height };
        break;
      case 'arrow_up_left':
        startPoint = { x: width, y: height };
        endPoint = { x: 0, y: 0 };
        break;
      case 'arrow_down_left':
        startPoint = { x: width, y: 0 };
        endPoint = { x: 0, y: height };
        break;
      case 'arrow_double_horizontal':
        startPoint = { x: 0, y: height / 2 };
        endPoint = { x: width, y: height / 2 };
        headDirection = 'both';
        break;
      case 'arrow_double_vertical':
        startPoint = { x: width / 2, y: 0 };
        endPoint = { x: width / 2, y: height };
        headDirection = 'both';
        break;
      default:
        startPoint = { x: 0, y: height / 2 };
        endPoint = { x: width, y: height / 2 };
    }

    return createStraightArrowData(startPoint, endPoint, headDirection);
  }, [element.size, element.shapeType, element.data?.shapeType]);

  // التحقق من صلاحية بيانات السهم
  const storedArrowData = element.data?.arrowData;
  const isArrowDataValid = storedArrowData && 
    storedArrowData.startPoint && 
    storedArrowData.endPoint &&
    (storedArrowData.startPoint.x !== storedArrowData.endPoint.x || 
     storedArrowData.startPoint.y !== storedArrowData.endPoint.y);
  
  const arrowData: ArrowData = useMemo(() => {
    if (isArrowDataValid) {
      // إذا كانت البيانات القديمة بدون نظام الأضلاع، نحولها
      if (!storedArrowData.segments || storedArrowData.segments.length === 0) {
        return createStraightArrowData(
          storedArrowData.startPoint,
          storedArrowData.endPoint,
          storedArrowData.headDirection || 'end'
        );
      }
      return storedArrowData;
    }
    return getDefaultArrowData();
  }, [isArrowDataValid, storedArrowData, getDefaultArrowData]);

  // العناصر الأخرى للبحث عن نقاط الاتصال
  const otherElements = useMemo(() => 
    elements.filter(el => 
      el.id !== element.id && 
      el.type !== 'arrow' && 
      !el.shapeType?.startsWith('arrow_')
    ), [elements, element.id]);

  // الحصول على نقاط التحكم للعرض
  const displayControlPoints = useMemo(() => {
    if (arrowData.controlPoints && arrowData.controlPoints.length > 0) {
      return arrowData.controlPoints;
    }
    
    // fallback للنظام القديم
    const midPoint: ArrowPoint = {
      x: (arrowData.startPoint.x + arrowData.endPoint.x) / 2,
      y: (arrowData.startPoint.y + arrowData.endPoint.y) / 2
    };
    
    return [
      { id: 'start', type: 'endpoint' as const, position: arrowData.startPoint, isActive: true },
      { id: 'middle', type: 'midpoint' as const, position: midPoint, isActive: false },
      { id: 'end', type: 'endpoint' as const, position: arrowData.endPoint, isActive: true }
    ];
  }, [arrowData]);

  // بدء السحب
  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    cp: ArrowCP | { id: string; type: 'endpoint' | 'midpoint'; position: ArrowPoint; isActive: boolean }
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const controlPointType = cp.id === 'start' || (cp.type === 'endpoint' && displayControlPoints.indexOf(cp as ArrowCP) === 0)
      ? 'start'
      : cp.id === 'end' || (cp.type === 'endpoint' && displayControlPoints.indexOf(cp as ArrowCP) === displayControlPoints.length - 1)
        ? 'end'
        : 'middle';

    setDragState({
      isDragging: true,
      controlPoint: controlPointType,
      controlPointId: cp.id,
      startPosition: { ...cp.position },
      nearestAnchor: null,
      initialMousePos: { x: e.clientX, y: e.clientY },
      dragDirection: null
    });
  }, [displayControlPoints]);

  // معالجة السحب
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.controlPoint || !dragState.initialMousePos || !dragState.startPosition) return;

    const deltaX = (e.clientX - dragState.initialMousePos.x) / viewport.zoom;
    const deltaY = (e.clientY - dragState.initialMousePos.y) / viewport.zoom;

    const newPoint: ArrowPoint = { 
      x: dragState.startPosition.x + deltaX, 
      y: dragState.startPosition.y + deltaY 
    };

    // تحديد اتجاه السحب لنقاط المنتصف
    let currentDragDirection = dragState.dragDirection;
    if (dragState.controlPoint === 'middle' && !currentDragDirection) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      if (absDeltaX > 5 || absDeltaY > 5) {
        currentDragDirection = absDeltaY > absDeltaX ? 'vertical' : 'horizontal';
        setDragState(prev => ({ ...prev, dragDirection: currentDragDirection }));
      }
    }

    // البحث عن أقرب نقطة ارتكاز للإلتصاق (فقط لنقاط النهاية)
    const nearestAnchor = dragState.controlPoint !== 'middle' 
      ? findNearestAnchor(
          { 
            x: (e.clientX - viewport.pan.x) / viewport.zoom, 
            y: (e.clientY - viewport.pan.y) / viewport.zoom 
          }, 
          otherElements,
          30 / viewport.zoom
        )
      : null;

    setDragState(prev => ({ ...prev, nearestAnchor }));

    // تحديث بيانات السهم
    let newArrowData = { ...arrowData };

    if (dragState.controlPoint === 'start') {
      const finalPoint = nearestAnchor 
        ? { 
            x: nearestAnchor.position.x - element.position.x, 
            y: nearestAnchor.position.y - element.position.y 
          }
        : newPoint;
      
      const connection = nearestAnchor 
        ? { elementId: nearestAnchor.elementId, anchorPoint: nearestAnchor.anchorPoint, offset: { x: 0, y: 0 } }
        : null;
      
      newArrowData = updateEndpointPosition(newArrowData, 'start', finalPoint, connection);
      
    } else if (dragState.controlPoint === 'end') {
      const finalPoint = nearestAnchor 
        ? { 
            x: nearestAnchor.position.x - element.position.x, 
            y: nearestAnchor.position.y - element.position.y 
          }
        : newPoint;
      
      const connection = nearestAnchor 
        ? { elementId: nearestAnchor.elementId, anchorPoint: nearestAnchor.anchorPoint, offset: { x: 0, y: 0 } }
        : null;
      
      newArrowData = updateEndpointPosition(newArrowData, 'end', finalPoint, connection);
      
    } else if (dragState.controlPoint === 'middle' && currentDragDirection && dragState.controlPointId) {
      // التحقق من نقطة المنتصف
      const midpointCP = arrowData.controlPoints.find(cp => cp.id === dragState.controlPointId);
      
      if (midpointCP && midpointCP.type === 'midpoint') {
        if (!midpointCP.isActive) {
          // تفعيل نقطة منتصف غير نشطة وتوسيع المسار
          if (midpointCP.segmentId) {
            // نقطة منتصف مرتبطة بضلع: توسيعها إلى 3 أضلاع
            newArrowData = activateMidpointAndExpand(
              arrowData,
              dragState.controlPointId,
              newPoint,
              currentDragDirection
            );
          } else if (arrowData.arrowType === 'straight') {
            // نقطة المنتصف الأصلية للسهم المستقيم
            newArrowData = convertToOrthogonalPath(
              arrowData,
              dragState.controlPointId,
              newPoint,
              currentDragDirection
            );
          }
        } else {
          // نقطة المنتصف مفعّلة: تحديث المسار الحالي
          newArrowData.middlePoint = newPoint;
          newArrowData.segments = [...arrowData.segments];
          newArrowData.controlPoints = [...arrowData.controlPoints];
          
          // إعادة حساب المسار بناءً على اتجاه السحب
          if (currentDragDirection === 'vertical') {
            const pathPoints = [
              newArrowData.startPoint,
              { x: newArrowData.startPoint.x, y: newPoint.y },
              { x: newArrowData.endPoint.x, y: newPoint.y },
              newArrowData.endPoint
            ];
            
            if (newArrowData.segments.length >= 3) {
              newArrowData.segments[0] = { ...newArrowData.segments[0], startPoint: pathPoints[0], endPoint: pathPoints[1] };
              newArrowData.segments[1] = { ...newArrowData.segments[1], startPoint: pathPoints[1], endPoint: pathPoints[2] };
              newArrowData.segments[2] = { ...newArrowData.segments[2], startPoint: pathPoints[2], endPoint: pathPoints[3] };
            }
          } else {
            const pathPoints = [
              newArrowData.startPoint,
              { x: newPoint.x, y: newArrowData.startPoint.y },
              { x: newPoint.x, y: newArrowData.endPoint.y },
              newArrowData.endPoint
            ];
            
            if (newArrowData.segments.length >= 3) {
              newArrowData.segments[0] = { ...newArrowData.segments[0], startPoint: pathPoints[0], endPoint: pathPoints[1] };
              newArrowData.segments[1] = { ...newArrowData.segments[1], startPoint: pathPoints[1], endPoint: pathPoints[2] };
              newArrowData.segments[2] = { ...newArrowData.segments[2], startPoint: pathPoints[2], endPoint: pathPoints[3] };
            }
          }
          
          // تحديث نقاط المنتصف لتبقى في منتصف أضلاعها
          newArrowData.controlPoints = newArrowData.controlPoints.map(cp => {
            if (cp.type === 'midpoint' && cp.segmentId) {
              const segment = newArrowData.segments.find(s => s.id === cp.segmentId);
              if (segment) {
                return {
                  ...cp,
                  position: {
                    x: (segment.startPoint.x + segment.endPoint.x) / 2,
                    y: (segment.startPoint.y + segment.endPoint.y) / 2
                  }
                };
              }
            }
            return cp;
          });
        }
      }
    }

    updateElement(element.id, {
      data: { ...element.data, arrowData: newArrowData }
    });
  }, [dragState, viewport, element, arrowData, otherElements, updateElement]);

  // إنهاء السحب
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      controlPoint: null,
      controlPointId: undefined,
      startPosition: null,
      nearestAnchor: null,
      initialMousePos: null,
      dragDirection: null
    });
  }, []);

  // إضافة مستمعي الأحداث العالمية
  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // أنماط نقاط التحكم - جميع النقاط المفعّلة تظهر بنفس الشكل
  const getControlPointStyle = (cp: ArrowCP | { id: string; type: 'endpoint' | 'midpoint'; position: ArrowPoint; isActive: boolean; connection?: any }) => {
    const isConnected = cp.type === 'endpoint' && cp.connection;
    const isActive = cp.isActive;
    
    // جميع النقاط المفعّلة تظهر بنفس الحجم والشكل
    const size = isActive ? 10 : 8;
    
    return {
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: isConnected 
        ? 'hsl(var(--accent-green))' 
        : isActive 
          ? '#FFFFFF' 
          : 'transparent',
      border: `1.5px solid ${isActive ? '#000000' : '#3DA8F5'}`,
      cursor: 'grab',
      boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
      zIndex: 1000,
      transition: 'all 0.15s ease'
    };
  };

  // رسم خطوط المسار للتصور
  const renderPathLines = () => {
    if (arrowData.arrowType === 'straight' || !arrowData.segments || arrowData.segments.length <= 1) {
      return null;
    }

    return (
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: element.size.width,
          height: element.size.height,
          pointerEvents: 'none',
          overflow: 'visible'
        }}
      >
        {arrowData.segments.map((segment, idx) => (
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

      {/* نقاط التحكم */}
      {displayControlPoints.map((cp, idx) => {
        const size = cp.isActive ? 10 : 8;
        return (
          <div
            key={cp.id}
            className="absolute"
            style={{
              left: cp.position.x - size / 2,
              top: cp.position.y - size / 2,
              ...getControlPointStyle(cp)
            }}
            onMouseDown={(e) => handleMouseDown(e, cp)}
            title={
              cp.type === 'endpoint' 
                ? (idx === 0 ? 'نقطة البداية - اسحب للاتصال بعنصر' : 'نقطة النهاية - اسحب للاتصال بعنصر')
                : cp.isActive 
                  ? 'نقطة المنتصف - اسحب لتعديل المسار'
                  : 'نقطة غير نشطة - اسحب لإنشاء مسار متعامد'
            }
          />
        );
      })}

      {/* مؤشر الالتصاق */}
      {dragState.nearestAnchor && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: dragState.nearestAnchor.position.x * viewport.zoom + viewport.pan.x - 12,
            top: dragState.nearestAnchor.position.y * viewport.zoom + viewport.pan.y - 12,
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '3px solid hsl(var(--accent-green))',
            backgroundColor: 'rgba(61, 190, 139, 0.2)',
            animation: 'pulse 0.5s ease-in-out infinite'
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
