import React, { useState, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { 
  ArrowPoint, 
  ArrowData, 
  ElementAnchor,
  ArrowControlDragState 
} from '@/types/arrow-connections';
import { findNearestAnchor, getAnchorPosition } from '@/types/arrow-connections';

interface ArrowControlPointsProps {
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

/**
 * مكون نقاط التحكم للأسهم
 * يعرض 3 نقاط: بداية، وسط، نهاية
 */
export const ArrowControlPoints: React.FC<ArrowControlPointsProps> = ({
  element,
  viewport
}) => {
  const { elements, updateElement } = useCanvasStore();
  
  const [dragState, setDragState] = useState<ArrowControlDragState>({
    isDragging: false,
    controlPoint: null,
    startPosition: null,
    nearestAnchor: null
  });

  // الحصول على بيانات السهم أو إنشاء بيانات افتراضية بناءً على أبعاد العنصر الفعلية
  const getDefaultArrowData = (): ArrowData => {
    const { width, height } = element.size;
    // تحديد نقاط البداية والنهاية بناءً على أبعاد السهم
    return {
      startPoint: { x: 0, y: height / 2 },
      middlePoint: null,
      endPoint: { x: width, y: height / 2 },
      startConnection: null,
      endConnection: null,
      arrowType: 'straight',
      headDirection: 'end'
    };
  };

  const arrowData: ArrowData = element.data?.arrowData || getDefaultArrowData();

  // حساب موقع النقطة الوسطى (دائماً في منتصف الخط الفعلي للسهم)
  const getMiddlePoint = (): ArrowPoint => {
    if (arrowData.middlePoint) {
      return arrowData.middlePoint;
    }
    // النقطة الوسطى على الخط بين البداية والنهاية
    return {
      x: (arrowData.startPoint.x + arrowData.endPoint.x) / 2,
      y: (arrowData.startPoint.y + arrowData.endPoint.y) / 2
    };
  };

  // العناصر الأخرى (غير السهم الحالي) للبحث عن نقاط الاتصال
  const otherElements = elements.filter(el => 
    el.id !== element.id && 
    el.type !== 'arrow' && 
    !el.type?.startsWith('arrow_')
  );

  // بدء السحب
  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    controlPoint: 'start' | 'middle' | 'end'
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const point = controlPoint === 'start' 
      ? arrowData.startPoint 
      : controlPoint === 'end' 
        ? arrowData.endPoint 
        : getMiddlePoint();

    setDragState({
      isDragging: true,
      controlPoint,
      startPosition: point,
      nearestAnchor: null
    });
  }, [arrowData]);

  // معالجة السحب
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.controlPoint) return;

    // تحويل إحداثيات الشاشة إلى إحداثيات الكانفاس
    const canvasX = (e.clientX - viewport.pan.x) / viewport.zoom - element.position.x;
    const canvasY = (e.clientY - viewport.pan.y) / viewport.zoom - element.position.y;

    const newPoint: ArrowPoint = { x: canvasX, y: canvasY };

    // البحث عن أقرب نقطة ارتكاز للإلتصاق
    const absolutePoint = { x: e.clientX, y: e.clientY };
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
    const newArrowData = { ...arrowData };

    if (dragState.controlPoint === 'start') {
      newArrowData.startPoint = nearestAnchor 
        ? { 
            x: nearestAnchor.position.x - element.position.x, 
            y: nearestAnchor.position.y - element.position.y 
          }
        : newPoint;
      newArrowData.startConnection = nearestAnchor 
        ? { elementId: nearestAnchor.elementId, anchorPoint: nearestAnchor.anchorPoint, offset: { x: 0, y: 0 } }
        : null;
    } else if (dragState.controlPoint === 'end') {
      newArrowData.endPoint = nearestAnchor 
        ? { 
            x: nearestAnchor.position.x - element.position.x, 
            y: nearestAnchor.position.y - element.position.y 
          }
        : newPoint;
      newArrowData.endConnection = nearestAnchor 
        ? { elementId: nearestAnchor.elementId, anchorPoint: nearestAnchor.anchorPoint, offset: { x: 0, y: 0 } }
        : null;
    } else if (dragState.controlPoint === 'middle') {
      // تحريك النقطة الوسطى يحول السهم إلى سهم متعرج
      newArrowData.middlePoint = newPoint;
      newArrowData.arrowType = 'elbow';
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
      startPosition: null,
      nearestAnchor: null
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

  // نمط نقطة التحكم (مطابق لـ ResizeHandle)
  const controlPointStyle = (isConnected: boolean) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: isConnected ? 'hsl(var(--accent-green))' : '#FFFFFF',
    border: '1px solid #000000',
    cursor: 'grab',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
    zIndex: 1000
  });

  // نمط النقطة الوسطى (مطابق للنقاط الأخرى)
  const middlePointStyle = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: arrowData.arrowType === 'elbow' ? 'hsl(var(--accent-green))' : '#FFFFFF',
    border: '1px solid #000000',
    cursor: 'grab',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
    zIndex: 1000
  };

  const startPos = arrowData.startPoint;
  const middlePos = getMiddlePoint();
  const endPos = arrowData.endPoint;

  return (
    <>
      {/* خط الاتصال بين النقاط (للتصور) */}
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
        {/* خط توضيحي للمسار */}
        {arrowData.arrowType === 'elbow' && arrowData.middlePoint && (
          <path
            d={`M ${startPos.x} ${startPos.y} L ${middlePos.x} ${startPos.y} L ${middlePos.x} ${endPos.y} L ${endPos.x} ${endPos.y}`}
            stroke="hsl(var(--accent-blue))"
            strokeWidth={1}
            strokeDasharray="4,4"
            fill="none"
            opacity={0.5}
          />
        )}
      </svg>

      {/* نقطة البداية */}
      <div
        className="absolute"
        style={{
          left: startPos.x - 4,
          top: startPos.y - 4,
          ...controlPointStyle(!!arrowData.startConnection)
        }}
        onMouseDown={(e) => handleMouseDown(e, 'start')}
        title="نقطة البداية - اسحب للاتصال بعنصر"
      />

      {/* نقطة الوسط */}
      <div
        className="absolute"
        style={{
          left: middlePos.x - 4,
          top: middlePos.y - 4,
          ...middlePointStyle
        }}
        onMouseDown={(e) => handleMouseDown(e, 'middle')}
        title="النقطة الوسطى - اسحب لإنشاء سهم متعرج"
      />

      {/* نقطة النهاية */}
      <div
        className="absolute"
        style={{
          left: endPos.x - 4,
          top: endPos.y - 4,
          ...controlPointStyle(!!arrowData.endConnection)
        }}
        onMouseDown={(e) => handleMouseDown(e, 'end')}
        title="نقطة النهاية - اسحب للاتصال بعنصر"
      />

      {/* مؤشر الالتصاق */}
      {dragState.nearestAnchor && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: dragState.nearestAnchor.position.x * viewport.zoom + viewport.pan.x - 10,
            top: dragState.nearestAnchor.position.y * viewport.zoom + viewport.pan.y - 10,
            width: 20,
            height: 20,
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
