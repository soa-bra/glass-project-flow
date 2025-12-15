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

  // معالجة تحريك نقطة البداية/النهاية مع الحفاظ على استقامة الضلع
  const moveEndpointWithSegment = (
    data: ArrowData,
    endpoint: 'start' | 'end',
    newPosition: ArrowPoint
  ): ArrowData => {
    const newData = { ...data };
    
    if (data.arrowType === 'straight' || data.segments.length <= 1) {
      // سهم مستقيم - تحريك بسيط
      if (endpoint === 'start') {
        newData.startPoint = newPosition;
        if (newData.segments.length > 0) {
          newData.segments[0] = { ...newData.segments[0], startPoint: newPosition };
        }
      } else {
        newData.endPoint = newPosition;
        if (newData.segments.length > 0) {
          newData.segments[newData.segments.length - 1] = {
            ...newData.segments[newData.segments.length - 1],
            endPoint: newPosition
          };
        }
      }
    } else {
      // سهم متعامد - تحريك الضلع كاملاً
      if (endpoint === 'start') {
        const oldStart = data.startPoint;
        const deltaX = newPosition.x - oldStart.x;
        const deltaY = newPosition.y - oldStart.y;
        
        newData.startPoint = newPosition;
        
        // تحديد اتجاه الضلع الأول
        const firstSegment = data.segments[0];
        const isFirstVertical = Math.abs(firstSegment.endPoint.x - firstSegment.startPoint.x) < 
                                Math.abs(firstSegment.endPoint.y - firstSegment.startPoint.y);
        
        // تحريك الضلع الأول بالكامل
        newData.segments[0] = {
          ...firstSegment,
          startPoint: newPosition,
          endPoint: isFirstVertical
            ? { x: newPosition.x, y: firstSegment.endPoint.y + deltaY }
            : { x: firstSegment.endPoint.x + deltaX, y: newPosition.y }
        };
        
        // تحديث نقطة بداية الضلع التالي
        if (data.segments.length > 1) {
          newData.segments[1] = {
            ...data.segments[1],
            startPoint: newData.segments[0].endPoint
          };
        }
      } else {
        const oldEnd = data.endPoint;
        const deltaX = newPosition.x - oldEnd.x;
        const deltaY = newPosition.y - oldEnd.y;
        
        newData.endPoint = newPosition;
        
        // تحديد اتجاه الضلع الأخير
        const lastIdx = data.segments.length - 1;
        const lastSegment = data.segments[lastIdx];
        const isLastVertical = Math.abs(lastSegment.endPoint.x - lastSegment.startPoint.x) < 
                               Math.abs(lastSegment.endPoint.y - lastSegment.startPoint.y);
        
        // تحريك الضلع الأخير بالكامل
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: isLastVertical
            ? { x: newPosition.x, y: lastSegment.startPoint.y + deltaY }
            : { x: lastSegment.startPoint.x + deltaX, y: newPosition.y },
          endPoint: newPosition
        };
        
        // تحديث نقطة نهاية الضلع السابق
        if (data.segments.length > 1) {
          newData.segments[lastIdx - 1] = {
            ...data.segments[lastIdx - 1],
            endPoint: newData.segments[lastIdx].startPoint
          };
        }
      }
    }
    
    // تحديث نقاط التحكم
    newData.controlPoints = updateMidpointsPositions(newData);
    
    return newData;
  };
  
  // تحديث مواقع نقاط المنتصف لتبقى في منتصف أضلاعها
  const updateMidpointsPositions = (data: ArrowData): ArrowCP[] => {
    return data.controlPoints.map(cp => {
      if (cp.type === 'midpoint' && cp.segmentId) {
        const segment = data.segments.find(s => s.id === cp.segmentId);
        if (segment) {
          return {
            ...cp,
            position: {
              x: (segment.startPoint.x + segment.endPoint.x) / 2,
              y: (segment.startPoint.y + segment.endPoint.y) / 2
            }
          };
        }
      } else if (cp.type === 'endpoint') {
        // تحديث نقاط النهاية
        if (cp.id === 'start' || data.controlPoints.indexOf(cp) === 0) {
          return { ...cp, position: data.startPoint };
        } else if (cp.id === 'end' || data.controlPoints.indexOf(cp) === data.controlPoints.length - 1) {
          return { ...cp, position: data.endPoint };
        }
      }
      return cp;
    });
  };
  
  // تفعيل نقطة منتصف وتحويلها إلى نقطة نشطة مع إنشاء أضلاع جديدة
  const activateMidpointAndSplit = (
    data: ArrowData,
    midpointId: string,
    newPosition: ArrowPoint,
    direction: 'horizontal' | 'vertical'
  ): ArrowData => {
    const newData = { ...data };
    
    // البحث عن نقطة المنتصف والضلع المرتبط بها
    const midpointIndex = data.controlPoints.findIndex(cp => cp.id === midpointId);
    const midpoint = data.controlPoints[midpointIndex];
    
    if (!midpoint || !midpoint.segmentId) {
      // إذا كان سهم مستقيم، نحوله إلى متعامد
      return convertToOrthogonalPath(data, midpointId, newPosition, direction);
    }
    
    const segmentIndex = data.segments.findIndex(s => s.id === midpoint.segmentId);
    const segment = data.segments[segmentIndex];
    
    if (!segment) return data;
    
    // تقسيم الضلع إلى 3 أضلاع جديدة
    const isVerticalSegment = Math.abs(segment.endPoint.x - segment.startPoint.x) < 
                              Math.abs(segment.endPoint.y - segment.startPoint.y);
    
    let newSegments: ArrowSegment[];
    
    if (isVerticalSegment) {
      // ضلع عمودي -> نقسمه أفقياً
      newSegments = [
        {
          id: generateId(),
          startPoint: segment.startPoint,
          endPoint: { x: segment.startPoint.x, y: newPosition.y }
        },
        {
          id: generateId(),
          startPoint: { x: segment.startPoint.x, y: newPosition.y },
          endPoint: { x: newPosition.x, y: newPosition.y }
        },
        {
          id: generateId(),
          startPoint: { x: newPosition.x, y: newPosition.y },
          endPoint: { x: newPosition.x, y: segment.endPoint.y }
        }
      ];
      
      // تحديث الضلع التالي إذا وجد
      if (segmentIndex < data.segments.length - 1) {
        newData.segments = [
          ...data.segments.slice(0, segmentIndex),
          ...newSegments,
          { ...data.segments[segmentIndex + 1], startPoint: { x: newPosition.x, y: segment.endPoint.y } },
          ...data.segments.slice(segmentIndex + 2)
        ];
      } else {
        newData.segments = [
          ...data.segments.slice(0, segmentIndex),
          ...newSegments
        ];
        newData.endPoint = { x: newPosition.x, y: segment.endPoint.y };
      }
    } else {
      // ضلع أفقي -> نقسمه عمودياً
      newSegments = [
        {
          id: generateId(),
          startPoint: segment.startPoint,
          endPoint: { x: newPosition.x, y: segment.startPoint.y }
        },
        {
          id: generateId(),
          startPoint: { x: newPosition.x, y: segment.startPoint.y },
          endPoint: { x: newPosition.x, y: newPosition.y }
        },
        {
          id: generateId(),
          startPoint: { x: newPosition.x, y: newPosition.y },
          endPoint: { x: segment.endPoint.x, y: newPosition.y }
        }
      ];
      
      if (segmentIndex < data.segments.length - 1) {
        newData.segments = [
          ...data.segments.slice(0, segmentIndex),
          ...newSegments,
          { ...data.segments[segmentIndex + 1], startPoint: { x: segment.endPoint.x, y: newPosition.y } },
          ...data.segments.slice(segmentIndex + 2)
        ];
      } else {
        newData.segments = [
          ...data.segments.slice(0, segmentIndex),
          ...newSegments
        ];
        newData.endPoint = { x: segment.endPoint.x, y: newPosition.y };
      }
    }
    
    // إعادة بناء نقاط التحكم
    const newControlPoints: ArrowCP[] = [
      { id: 'start', type: 'endpoint', position: newData.startPoint, isActive: true }
    ];
    
    // إضافة نقاط منتصف للأضلاع الجديدة (باستثناء الضلع الأوسط الذي يحتوي على النقطة المسحوبة)
    newData.segments.forEach((seg, idx) => {
      const isMiddleSegment = newSegments.length === 3 && 
        segmentIndex <= idx && idx < segmentIndex + 3 && 
        idx === segmentIndex + 1; // الضلع الأوسط
      
      newControlPoints.push({
        id: generateId(),
        type: 'midpoint',
        position: {
          x: (seg.startPoint.x + seg.endPoint.x) / 2,
          y: (seg.startPoint.y + seg.endPoint.y) / 2
        },
        isActive: isMiddleSegment, // النقطة المسحوبة تكون نشطة
        segmentId: seg.id
      });
    });
    
    newControlPoints.push({
      id: 'end',
      type: 'endpoint',
      position: newData.endPoint,
      isActive: true
    });
    
    newData.controlPoints = newControlPoints;
    newData.arrowType = 'orthogonal';
    
    return newData;
  };

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
      
      // تحريك الضلع المرتبط بنقطة البداية
      newArrowData = moveEndpointWithSegment(arrowData, 'start', finalPoint);
      
      // إضافة معلومات الاتصال
      if (nearestAnchor) {
        const startCP = newArrowData.controlPoints.find(cp => cp.id === 'start' || (cp.type === 'endpoint' && newArrowData.controlPoints.indexOf(cp) === 0));
        if (startCP) {
          startCP.connection = {
            elementId: nearestAnchor.elementId,
            anchorPoint: nearestAnchor.anchorPoint,
            offset: { x: 0, y: 0 }
          };
        }
      }
      
    } else if (dragState.controlPoint === 'end') {
      const finalPoint = nearestAnchor 
        ? { 
            x: nearestAnchor.position.x - element.position.x, 
            y: nearestAnchor.position.y - element.position.y 
          }
        : newPoint;
      
      // تحريك الضلع المرتبط بنقطة النهاية
      newArrowData = moveEndpointWithSegment(arrowData, 'end', finalPoint);
      
      // إضافة معلومات الاتصال
      if (nearestAnchor) {
        const endCP = newArrowData.controlPoints.find(cp => cp.id === 'end' || (cp.type === 'endpoint' && newArrowData.controlPoints.indexOf(cp) === newArrowData.controlPoints.length - 1));
        if (endCP) {
          endCP.connection = {
            elementId: nearestAnchor.elementId,
            anchorPoint: nearestAnchor.anchorPoint,
            offset: { x: 0, y: 0 }
          };
        }
      }
      
    } else if (dragState.controlPoint === 'middle' && currentDragDirection && dragState.controlPointId) {
      // البحث عن نقطة المنتصف
      const midpoint = arrowData.controlPoints.find(cp => cp.id === dragState.controlPointId);
      
      if (midpoint && !midpoint.isActive) {
        // تفعيل نقطة المنتصف وتقسيم الضلع
        newArrowData = activateMidpointAndSplit(arrowData, dragState.controlPointId, newPoint, currentDragDirection);
      } else if (midpoint && midpoint.isActive && midpoint.segmentId) {
        // النقطة نشطة بالفعل - تحريكها
        const segment = arrowData.segments.find(s => s.id === midpoint.segmentId);
        if (segment) {
          const isVertical = Math.abs(segment.endPoint.x - segment.startPoint.x) < 
                            Math.abs(segment.endPoint.y - segment.startPoint.y);
          
          // تحديث موقع الضلع (تحريك عمودي أو أفقي فقط)
          const segmentIndex = arrowData.segments.findIndex(s => s.id === midpoint.segmentId);
          
          if (isVertical) {
            // ضلع عمودي - نحركه أفقياً
            newArrowData.segments[segmentIndex] = {
              ...segment,
              startPoint: { x: newPoint.x, y: segment.startPoint.y },
              endPoint: { x: newPoint.x, y: segment.endPoint.y }
            };
          } else {
            // ضلع أفقي - نحركه عمودياً
            newArrowData.segments[segmentIndex] = {
              ...segment,
              startPoint: { x: segment.startPoint.x, y: newPoint.y },
              endPoint: { x: segment.endPoint.x, y: newPoint.y }
            };
          }
          
          // تحديث الأضلاع المجاورة
          if (segmentIndex > 0) {
            newArrowData.segments[segmentIndex - 1] = {
              ...arrowData.segments[segmentIndex - 1],
              endPoint: newArrowData.segments[segmentIndex].startPoint
            };
          }
          if (segmentIndex < arrowData.segments.length - 1) {
            newArrowData.segments[segmentIndex + 1] = {
              ...arrowData.segments[segmentIndex + 1],
              startPoint: newArrowData.segments[segmentIndex].endPoint
            };
          }
          
          // تحديث نقاط التحكم
          newArrowData.controlPoints = updateMidpointsPositions(newArrowData);
        }
      } else {
        // سهم مستقيم - تحويله إلى متعامد
        newArrowData = convertToOrthogonalPath(arrowData, dragState.controlPointId, newPoint, currentDragDirection);
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

  // أنماط نقاط التحكم - موحدة بين النشطة وغير النشطة
  const getControlPointStyle = (cp: ArrowCP | { id: string; type: 'endpoint' | 'midpoint'; position: ArrowPoint; isActive: boolean; connection?: any }) => {
    const isConnected = cp.type === 'endpoint' && cp.connection;
    const isActive = cp.isActive;
    
    // جميع النقاط النشطة (بما فيها نقاط المنتصف المفعّلة) تظهر بنفس الشكل
    const size = isActive ? 10 : 6;
    
    return {
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: isConnected 
        ? 'hsl(var(--accent-green))' 
        : isActive 
          ? '#FFFFFF' 
          : 'rgba(255, 255, 255, 0.4)',
      border: isActive 
        ? '1.5px solid #000000' 
        : '1px dashed rgba(0, 0, 0, 0.4)',
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
      {displayControlPoints.map((cp, idx) => (
        <div
          key={cp.id}
          className="absolute"
          style={{
            left: cp.position.x - (cp.type === 'endpoint' ? 5 : 4),
            top: cp.position.y - (cp.type === 'endpoint' ? 5 : 4),
            ...getControlPointStyle(cp)
          }}
          onMouseDown={(e) => handleMouseDown(e, cp)}
          title={
            cp.type === 'endpoint' 
              ? (idx === 0 ? 'نقطة البداية - اسحب للاتصال بعنصر' : 'نقطة النهاية - اسحب للاتصال بعنصر')
              : 'نقطة المنتصف - اسحب لإنشاء مسار متعامد'
          }
        />
      ))}

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
