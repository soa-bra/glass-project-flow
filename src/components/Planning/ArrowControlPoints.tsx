import React, { useState, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElementType } from '@/types/canvas-elements';
import {
  ArrowData,
  ArrowPoint,
  ArrowConnection,
  ArrowControlPoint,
  convertToOrthogonalPath,
  updateEndpointPosition,
  activateMidpointAndExpand,
  getAnchorPosition
} from '@/types/arrow-connections';

interface ArrowControlPointsProps {
  element: CanvasElementType & { data?: { arrowData?: ArrowData } };
  viewport: { zoom: number; pan: { x: number; y: number } };
}

interface DragState {
  isDragging: boolean;
  pointId: string | null;
  pointType: 'endpoint' | 'midpoint' | null;
  initialMousePos: { x: number; y: number } | null;
  startPosition: ArrowPoint | null;
  dragDirection: 'horizontal' | 'vertical' | null;
}

export const ArrowControlPoints: React.FC<ArrowControlPointsProps> = ({ element, viewport }) => {
  const { updateElement, elements } = useCanvasStore();
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    pointId: null,
    pointType: null,
    initialMousePos: null,
    startPosition: null,
    dragDirection: null
  });
  
  const [nearestAnchor, setNearestAnchor] = useState<{ elementId: string; anchor: string; position: ArrowPoint } | null>(null);

  // الحصول على بيانات السهم
  const arrowData: ArrowData | null = element.data?.arrowData || null;
  
  if (!arrowData) return null;

  const { controlPoints, segments } = arrowData;

  // تحويل موقع محلي إلى موقع عالمي (شاشة)
  const localToScreen = useCallback((local: ArrowPoint): ArrowPoint => {
    const worldX = element.position.x + local.x;
    const worldY = element.position.y + local.y;
    return {
      x: worldX * viewport.zoom + viewport.pan.x,
      y: worldY * viewport.zoom + viewport.pan.y
    };
  }, [element.position, viewport]);

  // تحويل موقع شاشة إلى موقع محلي
  const screenToLocal = useCallback((screen: ArrowPoint): ArrowPoint => {
    const worldX = (screen.x - viewport.pan.x) / viewport.zoom;
    const worldY = (screen.y - viewport.pan.y) / viewport.zoom;
    return {
      x: worldX - element.position.x,
      y: worldY - element.position.y
    };
  }, [element.position, viewport]);

  // بدء السحب
  const handleMouseDown = useCallback((e: React.MouseEvent, cp: ArrowControlPoint) => {
    e.stopPropagation();
    e.preventDefault();
    
    setDragState({
      isDragging: true,
      pointId: cp.id,
      pointType: cp.type,
      initialMousePos: { x: e.clientX, y: e.clientY },
      startPosition: { ...cp.position },
      dragDirection: null
    });
  }, []);

  // معالجة حركة الماوس
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.pointId || !dragState.initialMousePos || !dragState.startPosition) return;
    
    const deltaX = (e.clientX - dragState.initialMousePos.x) / viewport.zoom;
    const deltaY = (e.clientY - dragState.initialMousePos.y) / viewport.zoom;
    
    const newLocalPos: ArrowPoint = {
      x: dragState.startPosition.x + deltaX,
      y: dragState.startPosition.y + deltaY
    };

    const cp = controlPoints.find(c => c.id === dragState.pointId);
    if (!cp) return;

    let newArrowData: ArrowData;

    if (cp.type === 'endpoint') {
      // نقاط النهاية - البحث عن أقرب عنصر للالتصاق
      const worldPos = {
        x: element.position.x + newLocalPos.x,
        y: element.position.y + newLocalPos.y
      };
      
      // البحث عن أقرب anchor في العناصر الأخرى
      const otherElements = elements.filter(el => el.id !== element.id);
      let foundAnchor: { elementId: string; anchor: string; position: ArrowPoint } | null = null;
      
      const SNAP_DISTANCE = 20;
      for (const el of otherElements) {
        const anchors = ['center', 'top', 'bottom', 'left', 'right'];
        for (const anchor of anchors) {
          const anchorPos = getAnchorPosition(
            { position: el.position, size: el.size },
            anchor as ArrowConnection['anchorPoint']
          );
          const dist = Math.hypot(worldPos.x - anchorPos.x, worldPos.y - anchorPos.y);
          if (dist < SNAP_DISTANCE) {
            foundAnchor = { elementId: el.id, anchor, position: anchorPos };
            break;
          }
        }
        if (foundAnchor) break;
      }
      
      setNearestAnchor(foundAnchor);
      
      // تحديث موقع نقطة النهاية
      const isStart = controlPoints.indexOf(cp) === 0;
      const connection: ArrowConnection | null = foundAnchor ? {
        elementId: foundAnchor.elementId,
        anchorPoint: foundAnchor.anchor as ArrowConnection['anchorPoint'],
        offset: { x: 0, y: 0 }
      } : null;
      
      const finalPos = foundAnchor ? {
        x: foundAnchor.position.x - element.position.x,
        y: foundAnchor.position.y - element.position.y
      } : newLocalPos;
      
      newArrowData = updateEndpointPosition(
        arrowData,
        isStart ? 'start' : 'end',
        finalPos,
        connection
      );
      
    } else if (cp.type === 'midpoint') {
      // تحديد اتجاه السحب
      let direction = dragState.dragDirection;
      if (!direction) {
        const absDx = Math.abs(deltaX);
        const absDy = Math.abs(deltaY);
        if (absDx > 5 || absDy > 5) {
          direction = absDy > absDx ? 'vertical' : 'horizontal';
          setDragState(prev => ({ ...prev, dragDirection: direction }));
        }
      }
      
      if (!direction) return;
      
      // إذا كانت نقطة المنتصف غير نشطة، نفعّلها ونحوّل لمسار متعامد
      if (!cp.isActive) {
        if (arrowData.arrowType === 'straight') {
          // تحويل من مستقيم إلى متعامد
          newArrowData = convertToOrthogonalPath(arrowData, cp.id, newLocalPos, direction);
        } else {
          // توسيع ضلع إلى 3 أضلاع
          newArrowData = activateMidpointAndExpand(arrowData, cp.id, newLocalPos, direction);
        }
      } else {
        // نقطة منتصف نشطة - تحديث موقعها
        const updatedControlPoints = controlPoints.map(c => {
          if (c.id === cp.id) {
            return { ...c, position: newLocalPos };
          }
          return c;
        });
        
        // تحديث الأضلاع المتصلة
        const updatedSegments = segments.map(seg => {
          if (seg.id === cp.segmentId) {
            // تحريك الضلع بناءً على اتجاه السحب
            const isHorizontal = Math.abs(seg.endPoint.y - seg.startPoint.y) < 1;
            if (isHorizontal && direction === 'vertical') {
              return {
                ...seg,
                startPoint: { ...seg.startPoint, y: newLocalPos.y },
                endPoint: { ...seg.endPoint, y: newLocalPos.y }
              };
            } else if (!isHorizontal && direction === 'horizontal') {
              return {
                ...seg,
                startPoint: { ...seg.startPoint, x: newLocalPos.x },
                endPoint: { ...seg.endPoint, x: newLocalPos.x }
              };
            }
          }
          return seg;
        });
        
        newArrowData = {
          ...arrowData,
          controlPoints: updatedControlPoints,
          segments: updatedSegments
        };
        
        // تحديث نقاط المنتصف لتبقى في منتصف أضلاعها
        newArrowData.controlPoints = newArrowData.controlPoints.map(c => {
          if (c.type === 'midpoint' && c.segmentId && c.id !== cp.id) {
            const seg = newArrowData.segments.find(s => s.id === c.segmentId);
            if (seg) {
              return {
                ...c,
                position: {
                  x: (seg.startPoint.x + seg.endPoint.x) / 2,
                  y: (seg.startPoint.y + seg.endPoint.y) / 2
                }
              };
            }
          }
          return c;
        });
      }
    } else {
      return;
    }

    // تحديث العنصر
    updateElement(element.id, {
      data: {
        ...element.data,
        arrowData: newArrowData
      }
    });
  }, [dragState, viewport, controlPoints, segments, arrowData, element, elements, updateElement]);

  // إنهاء السحب
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      pointId: null,
      pointType: null,
      initialMousePos: null,
      startPosition: null,
      dragDirection: null
    });
    setNearestAnchor(null);
  }, []);

  // ربط أحداث الماوس العالمية
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

  // الحصول على نمط نقطة التحكم
  const getControlPointStyle = (cp: ArrowControlPoint): React.CSSProperties => {
    const screenPos = localToScreen(cp.position);
    const isActive = cp.isActive;
    const size = isActive ? 10 : 6;
    
    return {
      position: 'fixed',
      left: screenPos.x - size / 2,
      top: screenPos.y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.5)',
      border: `2px solid ${cp.connection?.elementId ? '#3DBE8B' : 'black'}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      cursor: 'grab',
      zIndex: 10000,
      opacity: isActive ? 1 : 0.6,
      transition: 'opacity 0.2s, transform 0.2s'
    };
  };

  // رسم خطوط المسار
  const renderPathLines = () => {
    if (segments.length === 0) return null;
    
    const pathPoints = [arrowData.startPoint];
    segments.forEach(seg => {
      pathPoints.push(seg.endPoint);
    });
    
    return (
      <svg
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      >
        {pathPoints.slice(0, -1).map((point, i) => {
          const start = localToScreen(point);
          const end = localToScreen(pathPoints[i + 1]);
          return (
            <line
              key={i}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <>
      {renderPathLines()}
      
      {controlPoints.map((cp) => (
        <div
          key={cp.id}
          style={getControlPointStyle(cp)}
          onMouseDown={(e) => handleMouseDown(e, cp)}
          title={cp.type === 'endpoint' ? 'نقطة نهاية' : 'نقطة منتصف'}
        />
      ))}
      
      {/* مؤشر الالتصاق */}
      {nearestAnchor && (
        <div
          style={{
            position: 'fixed',
            left: nearestAnchor.position.x * viewport.zoom + viewport.pan.x - 8,
            top: nearestAnchor.position.y * viewport.zoom + viewport.pan.y - 8,
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '2px solid #3DBE8B',
            backgroundColor: 'rgba(61, 190, 139, 0.3)',
            pointerEvents: 'none',
            zIndex: 10001
          }}
        />
      )}
    </>
  );
};

export default ArrowControlPoints;
