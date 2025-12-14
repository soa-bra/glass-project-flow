import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { 
  ArrowPoint, 
  ArrowData, 
  ElementAnchor,
  ArrowBinding
} from '@/types/arrow-connections';
import { 
  findNearestAnchor, 
  getArrowHandles, 
  updateArrowPoint,
  createDefaultArrowData,
  ARROW_CONSTANTS
} from '@/types/arrow-connections';

interface ArrowControlPointsProps {
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

interface DragState {
  isDragging: boolean;
  handleIndex: number | null;      // فهرس النقطة (0 = start, آخر = end, وسط = middle)
  startPosition: ArrowPoint | null;
  initialMousePos: { x: number; y: number } | null;
  nearestAnchor: ElementAnchor | null;
}

/**
 * مكون نقاط التحكم للأسهم المتقدم
 * يدعم: المسارات المتعرجة (Orthogonal) + الالتصاق بالعناصر
 */
export const ArrowControlPoints: React.FC<ArrowControlPointsProps> = ({
  element,
  viewport
}) => {
  const { elements, updateElement } = useCanvasStore();
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    handleIndex: null,
    startPosition: null,
    initialMousePos: null,
    nearestAnchor: null
  });

  // الحصول على بيانات السهم أو إنشاء بيانات افتراضية
  const arrowData = useMemo((): ArrowData => {
    const stored = element.data?.arrowData;
    
    // التحقق من صلاحية البيانات
    if (stored && stored.points && stored.points.length >= 2) {
      return stored;
    }
    
    // إنشاء بيانات افتراضية بناءً على نوع السهم
    const { width, height } = element.size;
    const shapeType = element.shapeType || element.data?.shapeType || 'arrow_right';
    
    let startX = 0, startY = height / 2, endX = width, endY = height / 2;
    let headDirection: ArrowData['headDirection'] = 'end';
    
    switch (shapeType) {
      case 'arrow_left':
        startX = width; endX = 0;
        break;
      case 'arrow_up':
        startX = width / 2; startY = height;
        endX = width / 2; endY = 0;
        break;
      case 'arrow_down':
        startX = width / 2; startY = 0;
        endX = width / 2; endY = height;
        break;
      case 'arrow_up_right':
        startX = 0; startY = height;
        endX = width; endY = 0;
        break;
      case 'arrow_down_right':
        startX = 0; startY = 0;
        endX = width; endY = height;
        break;
      case 'arrow_up_left':
        startX = width; startY = height;
        endX = 0; endY = 0;
        break;
      case 'arrow_down_left':
        startX = width; startY = 0;
        endX = 0; endY = height;
        break;
      case 'arrow_double_horizontal':
      case 'arrow_double_vertical':
        headDirection = 'both';
        if (shapeType === 'arrow_double_vertical') {
          startX = width / 2; startY = 0;
          endX = width / 2; endY = height;
        }
        break;
    }
    
    return createDefaultArrowData(startX, startY, endX, endY, headDirection);
  }, [element.data?.arrowData, element.size, element.shapeType]);

  // الحصول على نقاط التحكم
  const handles = useMemo(() => getArrowHandles(arrowData), [arrowData]);

  // العناصر الأخرى للبحث عن نقاط الاتصال
  const otherElements = useMemo(() => 
    elements.filter(el => 
      el.id !== element.id && 
      el.type !== 'arrow' && 
      !el.type?.startsWith('arrow_') &&
      !(el.shapeType?.startsWith('arrow_'))
    ),
    [elements, element.id]
  );

  // بدء السحب
  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    handleIndex: number
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const point = handles[handleIndex];
    if (!point) return;

    setDragState({
      isDragging: true,
      handleIndex,
      startPosition: { ...point },
      initialMousePos: { x: e.clientX, y: e.clientY },
      nearestAnchor: null
    });
  }, [handles]);

  // معالجة السحب
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || dragState.handleIndex === null || 
        !dragState.initialMousePos || !dragState.startPosition) return;

    // حساب الفرق بين موقع الماوس الحالي والأولي
    const deltaX = (e.clientX - dragState.initialMousePos.x) / viewport.zoom;
    const deltaY = (e.clientY - dragState.initialMousePos.y) / viewport.zoom;

    // موقع النقطة الجديد
    const newPoint: ArrowPoint = { 
      x: dragState.startPosition.x + deltaX, 
      y: dragState.startPosition.y + deltaY 
    };

    const isStartOrEnd = dragState.handleIndex === 0 || 
                         dragState.handleIndex === handles.length - 1;

    // البحث عن أقرب نقطة ارتكاز للإلتصاق (فقط للأطراف)
    let nearestAnchor: ElementAnchor | null = null;
    let binding: ArrowBinding | null = null;

    if (isStartOrEnd) {
      const canvasPoint = { 
        x: (e.clientX - viewport.pan.x) / viewport.zoom, 
        y: (e.clientY - viewport.pan.y) / viewport.zoom 
      };
      
      nearestAnchor = findNearestAnchor(
        canvasPoint, 
        otherElements,
        ARROW_CONSTANTS.SNAP_DISTANCE / viewport.zoom
      );

      if (nearestAnchor) {
        binding = {
          elementId: nearestAnchor.elementId,
          anchor: nearestAnchor.anchorPoint
        };
      }
    }

    setDragState(prev => ({ ...prev, nearestAnchor }));

    // تحديد الموقع النهائي (مع الالتصاق إذا وُجد)
    const finalPoint = nearestAnchor 
      ? { 
          x: nearestAnchor.position.x - element.position.x, 
          y: nearestAnchor.position.y - element.position.y 
        }
      : newPoint;

    // تحديث بيانات السهم
    const newArrowData = updateArrowPoint(
      arrowData,
      dragState.handleIndex,
      finalPoint,
      binding
    );

    updateElement(element.id, {
      data: { ...element.data, arrowData: newArrowData }
    });
  }, [dragState, viewport, element, arrowData, handles, otherElements, updateElement]);

  // إنهاء السحب
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      handleIndex: null,
      startPosition: null,
      initialMousePos: null,
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

  // نمط نقطة التحكم
  const getHandleStyle = (index: number) => {
    const isStart = index === 0;
    const isEnd = index === handles.length - 1;
    const isConnected = isStart 
      ? !!arrowData.startBinding || !!arrowData.startConnection
      : isEnd 
        ? !!arrowData.endBinding || !!arrowData.endConnection
        : false;
    const isMiddle = !isStart && !isEnd;
    const isOrthogonal = arrowData.arrowType === 'orthogonal';

    return {
      width: isMiddle ? 6 : 8,
      height: isMiddle ? 6 : 8,
      borderRadius: '50%',
      backgroundColor: isConnected 
        ? 'hsl(var(--accent-green))' 
        : isMiddle && isOrthogonal
          ? 'hsl(var(--accent-blue))'
          : '#FFFFFF',
      border: `1.5px solid ${isMiddle ? 'hsl(var(--accent-blue))' : '#000000'}`,
      cursor: 'grab',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      transition: 'transform 0.1s ease'
    };
  };

  // رسم المسار بين النقاط
  const renderPath = () => {
    if (handles.length < 2) return null;

    let pathD = `M ${handles[0].x} ${handles[0].y}`;
    
    for (let i = 1; i < handles.length; i++) {
      pathD += ` L ${handles[i].x} ${handles[i].y}`;
    }

    return (
      <path
        d={pathD}
        stroke="hsl(var(--accent-blue))"
        strokeWidth={1.5}
        strokeDasharray="4,4"
        fill="none"
        opacity={0.6}
      />
    );
  };

  return (
    <>
      {/* خط الاتصال بين النقاط */}
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
        {renderPath()}
      </svg>

      {/* نقاط التحكم */}
      {handles.map((point, index) => {
        const isStart = index === 0;
        const isEnd = index === handles.length - 1;
        
        let title = 'نقطة وسطى - اسحب لتعديل المسار';
        if (isStart) title = 'نقطة البداية - اسحب للاتصال بعنصر';
        if (isEnd) title = 'نقطة النهاية - اسحب للاتصال بعنصر';

        const style = getHandleStyle(index);
        const offset = (isStart || isEnd) ? 4 : 3;

        return (
          <div
            key={`handle-${index}`}
            className="absolute hover:scale-125"
            style={{
              left: point.x - offset,
              top: point.y - offset,
              ...style
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            title={title}
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
            backgroundColor: 'rgba(61, 190, 139, 0.25)',
            animation: 'pulse 0.6s ease-in-out infinite'
          }}
        />
      )}

      {/* مؤشر الالتصاق على العنصر المستهدف */}
      {dragState.nearestAnchor && (
        <div
          className="fixed pointer-events-none text-xs font-medium px-2 py-1 rounded-full"
          style={{
            left: dragState.nearestAnchor.position.x * viewport.zoom + viewport.pan.x + 16,
            top: dragState.nearestAnchor.position.y * viewport.zoom + viewport.pan.y - 10,
            backgroundColor: 'hsl(var(--accent-green))',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          التصاق
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>
    </>
  );
};

export default ArrowControlPoints;
