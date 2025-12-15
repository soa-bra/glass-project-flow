import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  generateId,
  applyTShapeConnection
} from '@/types/arrow-connections';

interface ArrowControlPointsProps {
  element: CanvasElement;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

// حالة تعديل النص على نقطة منتصف
interface MidpointLabelState {
  midpointId: string;
  text: string;
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
    containerRect?: DOMRect | null;
    startSnapshot?: {
      segments: ArrowSegment[];
      controlPoints: ArrowCP[];
      startPoint: ArrowPoint;
      endPoint: ArrowPoint;
    } | null;
  }>({
    isDragging: false,
    controlPoint: null,
    controlPointId: undefined,
    startPosition: null,
    nearestAnchor: null,
    initialMousePos: null,
    dragDirection: null,
    containerRect: null,
    startSnapshot: null
  });

  // حالة تعديل النص على نقطة منتصف غير نشطة
  const [editingLabel, setEditingLabel] = useState<MidpointLabelState | null>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  
  // تخزين النصوص على النقاط (مخزنة في arrowData.controlPoints)
  const midpointLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    element.data?.arrowData?.controlPoints?.forEach((cp: ArrowCP & { label?: string }) => {
      if (cp.type === 'midpoint' && cp.label) {
        labels[cp.id] = cp.label;
      }
    });
    return labels;
  }, [element.data?.arrowData?.controlPoints]);

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

  // ✅ إنشاء مفتاح يتغير عند تحريك أي عنصر متصل
  const connectedElementsKey = useMemo(() => {
    const startElId = arrowData.startConnection?.elementId;
    const endElId = arrowData.endConnection?.elementId;
    
    const startEl = startElId ? otherElements.find(e => e.id === startElId) : null;
    const endEl = endElId ? otherElements.find(e => e.id === endElId) : null;
    
    return JSON.stringify({
      start: startEl ? { x: startEl.position.x, y: startEl.position.y } : null,
      end: endEl ? { x: endEl.position.x, y: endEl.position.y } : null
    });
  }, [otherElements, arrowData.startConnection?.elementId, arrowData.endConnection?.elementId]);

  // تم إزالة useEffect المكرر - التحديث يتم حصرياً في canvasStore.ts
  // لمنع التزاحم (race condition) عند تحريك العناصر المتصلة

  // نسخة محسّنة من moveEndpointWithSegment للحفاظ على الزوايا القائمة
  const moveEndpointWithSegmentForConnection = (
    data: ArrowData,
    endpoint: 'start' | 'end',
    newPosition: ArrowPoint
  ): ArrowData => {
    const newData = { 
      ...data, 
      segments: data.segments.map(s => ({ ...s })), 
      controlPoints: data.controlPoints.map(cp => ({ ...cp }))
    };
    
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
      // سهم متعامد - تحريك الضلع كاملاً مع الحفاظ على الزوايا القائمة
      if (endpoint === 'start') {
        const oldStartPoint = data.startPoint;
        newData.startPoint = newPosition;
        
        // حساب الفرق في الموقع
        const deltaX = newPosition.x - oldStartPoint.x;
        const deltaY = newPosition.y - oldStartPoint.y;
        
        // تحديد اتجاه الضلع الأول الأصلي
        const firstSegment = data.segments[0];
        const dx = Math.abs(firstSegment.endPoint.x - firstSegment.startPoint.x);
        const dy = Math.abs(firstSegment.endPoint.y - firstSegment.startPoint.y);
        const isFirstVertical = dy >= dx;
        
        if (isFirstVertical) {
          // ضلع عمودي - نحركه أفقياً بالكامل ليبقى عمودياً
          // نقطة البداية تتحرك، ونقطة النهاية تتحرك أفقياً فقط بنفس المقدار
          newData.segments[0] = {
            ...firstSegment,
            startPoint: newPosition,
            endPoint: { 
              x: firstSegment.endPoint.x + deltaX, 
              y: firstSegment.endPoint.y  // Y لا يتغير ليبقى الضلع عمودياً
            }
          };
        } else {
          // ضلع أفقي - نحركه عمودياً بالكامل ليبقى أفقياً
          // نقطة البداية تتحرك، ونقطة النهاية تتحرك عمودياً فقط بنفس المقدار
          newData.segments[0] = {
            ...firstSegment,
            startPoint: newPosition,
            endPoint: { 
              x: firstSegment.endPoint.x,  // X لا يتغير ليبقى الضلع أفقياً
              y: firstSegment.endPoint.y + deltaY 
            }
          };
        }
        
        // تحديث نقطة بداية الضلع التالي لتتصل بنهاية الضلع الأول
        if (data.segments.length > 1) {
          newData.segments[1] = {
            ...newData.segments[1],
            startPoint: { ...newData.segments[0].endPoint }
          };
        }
      } else {
        const oldEndPoint = data.endPoint;
        newData.endPoint = newPosition;
        
        // حساب الفرق في الموقع
        const deltaX = newPosition.x - oldEndPoint.x;
        const deltaY = newPosition.y - oldEndPoint.y;
        
        // تحديد اتجاه الضلع الأخير الأصلي
        const lastIdx = data.segments.length - 1;
        const lastSegment = data.segments[lastIdx];
        const dx = Math.abs(lastSegment.endPoint.x - lastSegment.startPoint.x);
        const dy = Math.abs(lastSegment.endPoint.y - lastSegment.startPoint.y);
        const isLastVertical = dy >= dx;
        
        if (isLastVertical) {
          // ضلع عمودي - نحركه أفقياً بالكامل ليبقى عمودياً
          newData.segments[lastIdx] = {
            ...lastSegment,
            startPoint: { 
              x: lastSegment.startPoint.x + deltaX, 
              y: lastSegment.startPoint.y  // Y لا يتغير ليبقى الضلع عمودياً
            },
            endPoint: newPosition
          };
        } else {
          // ضلع أفقي - نحركه عمودياً بالكامل ليبقى أفقياً
          newData.segments[lastIdx] = {
            ...lastSegment,
            startPoint: { 
              x: lastSegment.startPoint.x,  // X لا يتغير ليبقى الضلع أفقياً
              y: lastSegment.startPoint.y + deltaY 
            },
            endPoint: newPosition
          };
        }
        
        // تحديث نقطة نهاية الضلع السابق لتتصل ببداية الضلع الأخير
        if (data.segments.length > 1) {
          newData.segments[lastIdx - 1] = {
            ...newData.segments[lastIdx - 1],
            endPoint: { ...newData.segments[lastIdx].startPoint }
          };
        }
      }
    }
    
    // تحديث نقاط التحكم مع الحفاظ على الخصائص الأصلية (isActive, label)
    newData.controlPoints = newData.controlPoints.map((cp, idx) => {
      if (cp.type === 'midpoint' && cp.segmentId) {
        const segment = newData.segments.find(s => s.id === cp.segmentId);
        if (segment) {
          return {
            ...cp, // الحفاظ على isActive و label والخصائص الأخرى
            position: {
              x: (segment.startPoint.x + segment.endPoint.x) / 2,
              y: (segment.startPoint.y + segment.endPoint.y) / 2
            }
          };
        }
      } else if (cp.type === 'endpoint') {
        if (idx === 0) {
          return { ...cp, position: { ...newData.startPoint } };
        } else if (idx === newData.controlPoints.length - 1) {
          return { ...cp, position: { ...newData.endPoint } };
        }
      }
      return cp;
    });
    
    return newData;
  };

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

    // ✅ تفعيل Internal Drag لمنع تعارض السحب مع CanvasElement
    useCanvasStore.getState().setInternalDrag(true);
    const controlPointType = cp.id === 'start' || (cp.type === 'endpoint' && displayControlPoints.indexOf(cp as ArrowCP) === 0)
      ? 'start'
      : cp.id === 'end' || (cp.type === 'endpoint' && displayControlPoints.indexOf(cp as ArrowCP) === displayControlPoints.length - 1)
        ? 'end'
        : 'middle';

    // ✅ تخزين containerRect عند بدء السحب لاستخدامه لاحقاً
    const canvasContainer = document.querySelector('[data-canvas-container]') || document.querySelector('.infinite-canvas-container');
    const containerRect = canvasContainer?.getBoundingClientRect() || null;
    
    // ✅ إنشاء snapshot كامل من arrowData لمنع تحرك جميع النقاط
    const snapshot = {
      segments: arrowData.segments.map(s => ({ 
        ...s, 
        startPoint: { ...s.startPoint }, 
        endPoint: { ...s.endPoint } 
      })),
      controlPoints: arrowData.controlPoints.map(cp => ({ 
        ...cp, 
        position: { ...cp.position } 
      })),
      startPoint: { ...arrowData.startPoint },
      endPoint: { ...arrowData.endPoint }
    };
    
    setDragState({
      isDragging: true,
      controlPoint: controlPointType,
      controlPointId: cp.id,
      startPosition: { ...cp.position },
      nearestAnchor: null,
      initialMousePos: { x: e.clientX, y: e.clientY },
      dragDirection: null,
      containerRect,
      startSnapshot: snapshot
    });
  }, [displayControlPoints]);

  // معالجة تحريك نقطة البداية/النهاية مع الحفاظ على استقامة الضلع
  const moveEndpointWithSegment = (
    data: ArrowData,
    endpoint: 'start' | 'end',
    newPosition: ArrowPoint
  ): ArrowData => {
    const newData = { ...data, segments: [...data.segments], controlPoints: [...data.controlPoints] };
    
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
      // سهم متعامد - تحريك الضلع كاملاً مع الحفاظ على الاتجاه
      if (endpoint === 'start') {
        newData.startPoint = newPosition;
        
        // تحديد اتجاه الضلع الأول
        const firstSegment = data.segments[0];
        const dx = Math.abs(firstSegment.endPoint.x - firstSegment.startPoint.x);
        const dy = Math.abs(firstSegment.endPoint.y - firstSegment.startPoint.y);
        const isFirstVertical = dy > dx;
        
        if (isFirstVertical) {
          // ضلع عمودي - نحرك كلا النقطتين أفقياً ليبقى عمودياً
          const newEndY = firstSegment.endPoint.y;
          newData.segments[0] = {
            ...firstSegment,
            startPoint: newPosition,
            endPoint: { x: newPosition.x, y: newEndY }
          };
        } else {
          // ضلع أفقي - نحرك كلا النقطتين عمودياً ليبقى أفقياً
          const newEndX = firstSegment.endPoint.x;
          newData.segments[0] = {
            ...firstSegment,
            startPoint: newPosition,
            endPoint: { x: newEndX, y: newPosition.y }
          };
        }
        
        // تحديث نقطة بداية الضلع التالي
        if (data.segments.length > 1) {
          newData.segments[1] = {
            ...data.segments[1],
            startPoint: newData.segments[0].endPoint
          };
        }
      } else {
        newData.endPoint = newPosition;
        
        // تحديد اتجاه الضلع الأخير
        const lastIdx = data.segments.length - 1;
        const lastSegment = data.segments[lastIdx];
        const dx = Math.abs(lastSegment.endPoint.x - lastSegment.startPoint.x);
        const dy = Math.abs(lastSegment.endPoint.y - lastSegment.startPoint.y);
        const isLastVertical = dy > dx;
        
        if (isLastVertical) {
          // ضلع عمودي - نحرك كلا النقطتين أفقياً ليبقى عمودياً
          const newStartY = lastSegment.startPoint.y;
          newData.segments[lastIdx] = {
            ...lastSegment,
            startPoint: { x: newPosition.x, y: newStartY },
            endPoint: newPosition
          };
        } else {
          // ضلع أفقي - نحرك كلا النقطتين عمودياً ليبقى أفقياً
          const newStartX = lastSegment.startPoint.x;
          newData.segments[lastIdx] = {
            ...lastSegment,
            startPoint: { x: newStartX, y: newPosition.y },
            endPoint: newPosition
          };
        }
        
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
  
  // تحديث مواقع نقاط المنتصف لتبقى في منتصف أضلاعها مع الحفاظ على حالة التفعيل
  const updateMidpointsPositions = (data: ArrowData): ArrowCP[] => {
    return data.controlPoints.map(cp => {
      if (cp.type === 'midpoint' && cp.segmentId) {
        const segment = data.segments.find(s => s.id === cp.segmentId);
        if (segment) {
          return {
            ...cp, // الحفاظ على isActive وباقي الخصائص
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
  // المنطق الجديد: الضلع الأصلي يتحرك إلى الموقع الجديد + إنشاء ضلعين رابطين
  const activateMidpointAndSplit = (
    data: ArrowData,
    midpointId: string,
    newPosition: ArrowPoint,
    direction: 'horizontal' | 'vertical'
  ): ArrowData => {
    // البحث عن نقطة المنتصف والضلع المرتبط بها
    const midpoint = data.controlPoints.find(cp => cp.id === midpointId);
    
    if (!midpoint || !midpoint.segmentId) {
      // إذا كان سهم مستقيم، نحوله إلى متعامد
      return convertToOrthogonalPath(data, midpointId, newPosition, direction);
    }
    
    const segmentIndex = data.segments.findIndex(s => s.id === midpoint.segmentId);
    const segment = data.segments[segmentIndex];
    
    if (!segment) {
      return convertToOrthogonalPath(data, midpointId, newPosition, direction);
    }
    
    // تحديد اتجاه الضلع الحالي
    const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
    const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);
    const isVerticalSegment = dy > dx;
    
    // إنشاء IDs للأضلاع الجديدة
    const leftConnectorId = generateId();
    const rightConnectorId = generateId();
    // الضلع الأوسط يحتفظ بـ ID الأصلي!
    const middleSegmentId = segment.id;
    
    let newSegments: ArrowSegment[];
    
    if (isVerticalSegment) {
      // ضلع عمودي + سحب أفقي = شكل U أفقي
      // الضلع الأصلي ينتقل إلى newPosition.x (يبقى عمودي)
      // نضيف ضلعين أفقيين على الأعلى والأسفل
      
      const movedMiddleSegment: ArrowSegment = {
        id: middleSegmentId,
        startPoint: { x: newPosition.x, y: segment.startPoint.y },
        endPoint: { x: newPosition.x, y: segment.endPoint.y }
      };
      
      const topConnector: ArrowSegment = {
        id: leftConnectorId,
        startPoint: segment.startPoint, // من البداية الأصلية
        endPoint: { x: newPosition.x, y: segment.startPoint.y } // إلى بداية الضلع المنقول
      };
      
      const bottomConnector: ArrowSegment = {
        id: rightConnectorId,
        startPoint: { x: newPosition.x, y: segment.endPoint.y }, // من نهاية الضلع المنقول
        endPoint: segment.endPoint // إلى النهاية الأصلية
      };
      
      // الترتيب: topConnector → movedMiddleSegment → bottomConnector
      newSegments = [topConnector, movedMiddleSegment, bottomConnector];
    } else {
      // ضلع أفقي + سحب عمودي = شكل U عمودي
      // الضلع الأصلي ينتقل إلى newPosition.y (يبقى أفقي)
      // نضيف ضلعين عموديين على اليسار واليمين
      
      const movedMiddleSegment: ArrowSegment = {
        id: middleSegmentId,
        startPoint: { x: segment.startPoint.x, y: newPosition.y },
        endPoint: { x: segment.endPoint.x, y: newPosition.y }
      };
      
      const leftConnector: ArrowSegment = {
        id: leftConnectorId,
        startPoint: segment.startPoint, // من البداية الأصلية
        endPoint: { x: segment.startPoint.x, y: newPosition.y } // إلى بداية الضلع المنقول
      };
      
      const rightConnector: ArrowSegment = {
        id: rightConnectorId,
        startPoint: { x: segment.endPoint.x, y: newPosition.y }, // من نهاية الضلع المنقول
        endPoint: segment.endPoint // إلى النهاية الأصلية
      };
      
      // الترتيب: leftConnector → movedMiddleSegment → rightConnector
      newSegments = [leftConnector, movedMiddleSegment, rightConnector];
    }
    
    // بناء قائمة الأضلاع الكاملة
    const allSegments = [
      ...data.segments.slice(0, segmentIndex),
      ...newSegments,
      ...data.segments.slice(segmentIndex + 1)
    ];
    
    // تحديث الضلع التالي ليتصل بالأضلاع الجديدة
    if (segmentIndex < data.segments.length - 1) {
      const nextSegIdx = segmentIndex + 3;
      if (allSegments[nextSegIdx]) {
        allSegments[nextSegIdx] = {
          ...allSegments[nextSegIdx],
          startPoint: newSegments[2].endPoint
        };
      }
    }
    
    // إعادة بناء نقاط التحكم
    const newControlPoints: ArrowCP[] = [];
    
    // نقطة البداية
    const startCp = data.controlPoints.find(cp => cp.type === 'endpoint' && data.controlPoints.indexOf(cp) === 0);
    newControlPoints.push({
      id: startCp?.id || 'start',
      type: 'endpoint',
      position: data.startPoint,
      isActive: true,
      connection: startCp?.connection || null
    });
    
    // نقاط منتصف لكل ضلع
    allSegments.forEach((seg) => {
      const midPos = {
        x: (seg.startPoint.x + seg.endPoint.x) / 2,
        y: (seg.startPoint.y + seg.endPoint.y) / 2
      };
      
      // الضلع الأوسط (الأصلي المنقول) يكون نشطاً - نقطته تحتفظ بـ midpointId
      const isTheOriginalMiddle = seg.id === middleSegmentId;
      
      // البحث عن نقطة تحكم موجودة مسبقاً لهذا الضلع (للحفاظ على حالة التفعيل)
      const existingCp = data.controlPoints.find(cp => cp.segmentId === seg.id);
      
      newControlPoints.push({
        id: isTheOriginalMiddle ? midpointId : (existingCp?.id || generateId()),
        type: 'midpoint',
        position: midPos,
        isActive: isTheOriginalMiddle || (existingCp?.isActive ?? false), // الضلع الأوسط نشط دائماً
        segmentId: seg.id
      });
    });
    
    // نقطة النهاية
    const endCp = data.controlPoints.find(cp => cp.type === 'endpoint' && data.controlPoints.indexOf(cp) === data.controlPoints.length - 1);
    const finalEndPoint = allSegments.length > 0 ? allSegments[allSegments.length - 1].endPoint : data.endPoint;
    newControlPoints.push({
      id: endCp?.id || 'end',
      type: 'endpoint',
      position: finalEndPoint,
      isActive: true,
      connection: endCp?.connection || null
    });
    
    return {
      ...data,
      segments: allSegments,
      controlPoints: newControlPoints,
      endPoint: finalEndPoint,
      arrowType: 'orthogonal'
    };
  };
  
  // تفعيل نقطة ضلع جانبي (رابط) وإنشاء ضلع جديد واحد فقط
  const activateSideConnectorMidpoint = (
    data: ArrowData,
    midpointId: string,
    newPosition: ArrowPoint,
    direction: 'horizontal' | 'vertical'
  ): ArrowData => {
    const midpoint = data.controlPoints.find(cp => cp.id === midpointId);
    if (!midpoint || !midpoint.segmentId) return data;
    
    const segmentIndex = data.segments.findIndex(s => s.id === midpoint.segmentId);
    const segment = data.segments[segmentIndex];
    if (!segment) return data;
    
    // تحديد اتجاه الضلع الحالي (الضلع الرابط)
    const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
    const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);
    const isVerticalConnector = dy > dx;
    
    // هل هذا ضلع بداية (متصل بنقطة البداية) أم ضلع نهاية (متصل بنقطة النهاية)؟
    const isStartConnector = segmentIndex === 0;
    const isEndConnector = segmentIndex === data.segments.length - 1;
    
    // إنشاء ضلع جديد واحد فقط
    const newConnectorId = generateId();
    const newSegments = [...data.segments];
    
    if (isVerticalConnector) {
      // ضلع رابط عمودي - يُسحب أفقياً
      // ينقسم إلى: ضلع أفقي جديد + ضلع عمودي مُعدّل
      
      if (isStartConnector) {
        // ضلع بداية: نضيف ضلع أفقي جديد من البداية، ونقصّر الضلع العمودي
        const newHorizontalSegment: ArrowSegment = {
          id: newConnectorId,
          startPoint: segment.startPoint,
          endPoint: { x: newPosition.x, y: segment.startPoint.y }
        };
        
        const modifiedVerticalSegment: ArrowSegment = {
          id: segment.id,
          startPoint: { x: newPosition.x, y: segment.startPoint.y },
          endPoint: { x: newPosition.x, y: segment.endPoint.y }
        };
        
        // نحدّث الضلع الأوسط (التالي) ليتصل بالضلع المعدّل
        if (newSegments[1]) {
          newSegments[1] = {
            ...newSegments[1],
            startPoint: modifiedVerticalSegment.endPoint
          };
        }
        
        newSegments.splice(0, 1, newHorizontalSegment, modifiedVerticalSegment);
      } else if (isEndConnector) {
        // ضلع نهاية: نضيف ضلع أفقي جديد للنهاية، ونقصّر الضلع العمودي
        const modifiedVerticalSegment: ArrowSegment = {
          id: segment.id,
          startPoint: { x: newPosition.x, y: segment.startPoint.y },
          endPoint: { x: newPosition.x, y: segment.endPoint.y }
        };
        
        const newHorizontalSegment: ArrowSegment = {
          id: newConnectorId,
          startPoint: modifiedVerticalSegment.endPoint,
          endPoint: segment.endPoint
        };
        
        // نحدّث الضلع السابق ليتصل بالضلع المعدّل
        if (newSegments[segmentIndex - 1]) {
          newSegments[segmentIndex - 1] = {
            ...newSegments[segmentIndex - 1],
            endPoint: modifiedVerticalSegment.startPoint
          };
        }
        
        newSegments.splice(segmentIndex, 1, modifiedVerticalSegment, newHorizontalSegment);
      }
    } else {
      // ضلع رابط أفقي - يُسحب عمودياً
      // ينقسم إلى: ضلع عمودي جديد + ضلع أفقي مُعدّل
      
      if (isStartConnector) {
        const newVerticalSegment: ArrowSegment = {
          id: newConnectorId,
          startPoint: segment.startPoint,
          endPoint: { x: segment.startPoint.x, y: newPosition.y }
        };
        
        const modifiedHorizontalSegment: ArrowSegment = {
          id: segment.id,
          startPoint: { x: segment.startPoint.x, y: newPosition.y },
          endPoint: { x: segment.endPoint.x, y: newPosition.y }
        };
        
        if (newSegments[1]) {
          newSegments[1] = {
            ...newSegments[1],
            startPoint: modifiedHorizontalSegment.endPoint
          };
        }
        
        newSegments.splice(0, 1, newVerticalSegment, modifiedHorizontalSegment);
      } else if (isEndConnector) {
        const modifiedHorizontalSegment: ArrowSegment = {
          id: segment.id,
          startPoint: { x: segment.startPoint.x, y: newPosition.y },
          endPoint: { x: segment.endPoint.x, y: newPosition.y }
        };
        
        const newVerticalSegment: ArrowSegment = {
          id: newConnectorId,
          startPoint: modifiedHorizontalSegment.endPoint,
          endPoint: segment.endPoint
        };
        
        if (newSegments[segmentIndex - 1]) {
          newSegments[segmentIndex - 1] = {
            ...newSegments[segmentIndex - 1],
            endPoint: modifiedHorizontalSegment.startPoint
          };
        }
        
        newSegments.splice(segmentIndex, 1, modifiedHorizontalSegment, newVerticalSegment);
      }
    }
    
    // إعادة بناء نقاط التحكم مع الحفاظ على حالة التفعيل
    const newControlPoints: ArrowCP[] = [];
    
    // نقطة البداية
    const startCp = data.controlPoints.find(cp => cp.type === 'endpoint' && data.controlPoints.indexOf(cp) === 0);
    newControlPoints.push({
      id: startCp?.id || 'start',
      type: 'endpoint',
      position: data.startPoint,
      isActive: true,
      connection: startCp?.connection || null
    });
    
    // نقاط منتصف لكل ضلع
    newSegments.forEach((seg) => {
      const midPos = {
        x: (seg.startPoint.x + seg.endPoint.x) / 2,
        y: (seg.startPoint.y + seg.endPoint.y) / 2
      };
      
      // البحث عن نقطة تحكم موجودة لهذا الضلع
      const existingCp = data.controlPoints.find(cp => cp.segmentId === seg.id);
      // النقطة التي تم سحبها تصبح نشطة
      const isActivatedMidpoint = seg.id === segment.id;
      
      newControlPoints.push({
        id: isActivatedMidpoint ? midpointId : (existingCp?.id || generateId()),
        type: 'midpoint',
        position: midPos,
        isActive: isActivatedMidpoint || (existingCp?.isActive ?? false),
        segmentId: seg.id
      });
    });
    
    // نقطة النهاية
    const endCp = data.controlPoints.find(cp => cp.type === 'endpoint' && data.controlPoints.indexOf(cp) === data.controlPoints.length - 1);
    const finalEndPoint = newSegments.length > 0 ? newSegments[newSegments.length - 1].endPoint : data.endPoint;
    newControlPoints.push({
      id: endCp?.id || 'end',
      type: 'endpoint',
      position: finalEndPoint,
      isActive: true,
      connection: endCp?.connection || null
    });
    
    return {
      ...data,
      segments: newSegments,
      controlPoints: newControlPoints,
      endPoint: finalEndPoint,
      arrowType: 'orthogonal'
    };
  };

  // حذف ضلع عبر النقر المزدوج على نقطة المنتصف
  const deleteSegmentByMidpoint = useCallback((midpointId: string) => {
    const midpoint = arrowData.controlPoints.find(cp => cp.id === midpointId);
    if (!midpoint || !midpoint.segmentId || midpoint.type !== 'midpoint') return;
    
    // لا يمكن الحذف إذا كان هناك ضلع واحد فقط
    if (arrowData.segments.length <= 1) return;
    
    const segmentIndex = arrowData.segments.findIndex(s => s.id === midpoint.segmentId);
    if (segmentIndex === -1) return;
    
    const segment = arrowData.segments[segmentIndex];
    const newSegments = [...arrowData.segments];
    
    // دمج الضلع مع الضلع السابق أو التالي
    if (segmentIndex === 0 && newSegments.length > 1) {
      // إذا كان الضلع الأول، ندمجه مع الثاني
      newSegments[1] = {
        ...newSegments[1],
        startPoint: segment.startPoint
      };
      newSegments.splice(0, 1);
    } else if (segmentIndex === newSegments.length - 1 && newSegments.length > 1) {
      // إذا كان الضلع الأخير، ندمجه مع السابق
      newSegments[segmentIndex - 1] = {
        ...newSegments[segmentIndex - 1],
        endPoint: segment.endPoint
      };
      newSegments.splice(segmentIndex, 1);
    } else if (newSegments.length > 2) {
      // ضلع في الوسط - ندمج الضلع السابق والتالي
      const prevSegment = newSegments[segmentIndex - 1];
      const nextSegment = newSegments[segmentIndex + 1];
      
      // نوصل الضلع السابق بنهاية الضلع التالي
      newSegments[segmentIndex - 1] = {
        ...prevSegment,
        endPoint: nextSegment.endPoint
      };
      // نحذف الضلع الحالي والتالي
      newSegments.splice(segmentIndex, 2);
    }
    
    // إعادة بناء نقاط التحكم
    const newControlPoints: ArrowCP[] = [];
    
    // نقطة البداية
    const startCp = arrowData.controlPoints.find(cp => cp.type === 'endpoint' && arrowData.controlPoints.indexOf(cp) === 0);
    newControlPoints.push({
      id: startCp?.id || 'start',
      type: 'endpoint',
      position: arrowData.startPoint,
      isActive: true,
      connection: startCp?.connection || null
    });
    
    // نقاط منتصف للأضلاع المتبقية
    newSegments.forEach((seg) => {
      newControlPoints.push({
        id: generateId(),
        type: 'midpoint',
        position: {
          x: (seg.startPoint.x + seg.endPoint.x) / 2,
          y: (seg.startPoint.y + seg.endPoint.y) / 2
        },
        isActive: false,
        segmentId: seg.id
      });
    });
    
    // نقطة النهاية
    const endCp = arrowData.controlPoints.find(cp => cp.type === 'endpoint' && arrowData.controlPoints.indexOf(cp) === arrowData.controlPoints.length - 1);
    const finalEndPoint = newSegments.length > 0 ? newSegments[newSegments.length - 1].endPoint : arrowData.endPoint;
    newControlPoints.push({
      id: endCp?.id || 'end',
      type: 'endpoint',
      position: finalEndPoint,
      isActive: true,
      connection: endCp?.connection || null
    });
    
    const newArrowData: ArrowData = {
      ...arrowData,
      segments: newSegments,
      controlPoints: newControlPoints,
      endPoint: finalEndPoint,
      arrowType: newSegments.length === 1 ? 'straight' : 'orthogonal'
    };
    
    updateElement(element.id, {
      data: { ...element.data, arrowData: newArrowData }
    });
  }, [arrowData, element, updateElement]);

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
    // ✅ إضافة containerRect لحساب الإحداثيات بشكل صحيح
    const canvasContainer = document.querySelector('[data-canvas-container]') || document.querySelector('.infinite-canvas-container');
    const containerRect = canvasContainer?.getBoundingClientRect();
    
    const nearestAnchor = dragState.controlPoint !== 'middle' 
      ? findNearestAnchor(
          { 
            x: (e.clientX - (containerRect?.left || 0) - viewport.pan.x) / viewport.zoom, 
            y: (e.clientY - (containerRect?.top || 0) - viewport.pan.y) / viewport.zoom 
          }, 
          otherElements,
          30 / viewport.zoom
        )
      : null;

    setDragState(prev => ({ ...prev, nearestAnchor }));

    // ✅ استخدام snapshot بدلاً من arrowData الحالي لمنع تحرك جميع النقاط
    const baseArrowData = dragState.startSnapshot ? {
      ...arrowData,
      segments: dragState.startSnapshot.segments.map(s => ({ 
        ...s, 
        startPoint: { ...s.startPoint }, 
        endPoint: { ...s.endPoint } 
      })),
      controlPoints: dragState.startSnapshot.controlPoints.map(cp => ({ 
        ...cp, 
        position: { ...cp.position } 
      })),
      startPoint: { ...dragState.startSnapshot.startPoint },
      endPoint: { ...dragState.startSnapshot.endPoint }
    } : arrowData;

    // تحديث بيانات السهم
    let newArrowData = { ...baseArrowData };

    if (dragState.controlPoint === 'start') {
      const finalPoint = nearestAnchor 
        ? { 
            x: nearestAnchor.position.x - element.position.x, 
            y: nearestAnchor.position.y - element.position.y 
          }
        : newPoint;
      
      // ✅ تطبيق خوارزمية T-Shape عند وجود اتصال
      if (nearestAnchor) {
        // الحصول على العنصر المستهدف
        const targetElement = otherElements.find(el => el.id === nearestAnchor.elementId);
        
        if (targetElement) {
          // تطبيق T-Shape Connection
          newArrowData = applyTShapeConnection(
            baseArrowData,
            'start',
            finalPoint,
            nearestAnchor.anchorPoint,
            targetElement,
            element.position
          );
        } else {
          // fallback: تحريك بسيط
          newArrowData = moveEndpointWithSegment(baseArrowData, 'start', finalPoint);
        }
        
        const connectionData = {
          elementId: nearestAnchor.elementId,
          anchorPoint: nearestAnchor.anchorPoint,
          offset: { x: 0, y: 0 }
        };
        
        newArrowData.startConnection = connectionData;
        
        const startCP = newArrowData.controlPoints.find(cp => cp.id === 'start' || (cp.type === 'endpoint' && newArrowData.controlPoints.indexOf(cp) === 0));
        if (startCP) {
          startCP.connection = connectionData;
        }
      } else {
        // لا يوجد سناب - تحريك عادي
        newArrowData = moveEndpointWithSegment(baseArrowData, 'start', finalPoint);
        newArrowData.startConnection = null;
        const startCP = newArrowData.controlPoints.find(cp => cp.id === 'start' || (cp.type === 'endpoint' && newArrowData.controlPoints.indexOf(cp) === 0));
        if (startCP) {
          startCP.connection = null;
        }
      }
      
    } else if (dragState.controlPoint === 'end') {
      const finalPoint = nearestAnchor 
        ? { 
            x: nearestAnchor.position.x - element.position.x, 
            y: nearestAnchor.position.y - element.position.y 
          }
        : newPoint;
      
      // ✅ تطبيق خوارزمية T-Shape عند وجود اتصال
      if (nearestAnchor) {
        const targetElement = otherElements.find(el => el.id === nearestAnchor.elementId);
        
        if (targetElement) {
          newArrowData = applyTShapeConnection(
            baseArrowData,
            'end',
            finalPoint,
            nearestAnchor.anchorPoint,
            targetElement,
            element.position
          );
        } else {
          newArrowData = moveEndpointWithSegment(baseArrowData, 'end', finalPoint);
        }
        
        const connectionData = {
          elementId: nearestAnchor.elementId,
          anchorPoint: nearestAnchor.anchorPoint,
          offset: { x: 0, y: 0 }
        };
        
        newArrowData.endConnection = connectionData;
        
        const endCP = newArrowData.controlPoints.find(cp => cp.id === 'end' || (cp.type === 'endpoint' && newArrowData.controlPoints.indexOf(cp) === newArrowData.controlPoints.length - 1));
        if (endCP) {
          endCP.connection = connectionData;
        }
      } else {
        newArrowData = moveEndpointWithSegment(baseArrowData, 'end', finalPoint);
        newArrowData.endConnection = null;
        const endCP = newArrowData.controlPoints.find(cp => cp.id === 'end' || (cp.type === 'endpoint' && newArrowData.controlPoints.indexOf(cp) === newArrowData.controlPoints.length - 1));
        if (endCP) {
          endCP.connection = null;
        }
      }
      
    } else if (dragState.controlPoint === 'middle' && currentDragDirection && dragState.controlPointId) {
      // البحث عن نقطة المنتصف
      const midpoint = baseArrowData.controlPoints.find(cp => cp.id === dragState.controlPointId);
      
      if (midpoint && !midpoint.isActive) {
        // نقطة غير نشطة - نحدد إذا كانت ضلع رابط جانبي أم ضلع أوسط
        const segmentIndex = baseArrowData.segments.findIndex(s => s.id === midpoint.segmentId);
        const isFirstOrLastSegment = segmentIndex === 0 || segmentIndex === baseArrowData.segments.length - 1;
        
        if (isFirstOrLastSegment && baseArrowData.segments.length > 1) {
          // ضلع جانبي (رابط) - استخدام دالة التفعيل الخاصة به
          newArrowData = activateSideConnectorMidpoint(baseArrowData, dragState.controlPointId, newPoint, currentDragDirection);
        } else {
          // تفعيل نقطة المنتصف وتقسيم الضلع (للأضلاع الوسطى أو السهم المستقيم)
          newArrowData = activateMidpointAndSplit(baseArrowData, dragState.controlPointId, newPoint, currentDragDirection);
        }
      } else if (midpoint && midpoint.isActive && midpoint.segmentId) {
        // النقطة نشطة بالفعل - تحريكها مع الحفاظ على حالة التفعيل
        const segment = baseArrowData.segments.find(s => s.id === midpoint.segmentId);
        if (segment) {
          // تحديد نوع الضلع: أفقي أو عمودي
          const isHorizontal = Math.abs(segment.endPoint.y - segment.startPoint.y) < 
                              Math.abs(segment.endPoint.x - segment.startPoint.x);
          
          const segmentIndex = baseArrowData.segments.findIndex(s => s.id === midpoint.segmentId);
          
          if (isHorizontal) {
            // ضلع أفقي (عرضي) - نحركه عمودياً فقط (للأعلى والأسفل)
            newArrowData.segments[segmentIndex] = {
              ...segment,
              startPoint: { x: segment.startPoint.x, y: newPoint.y },
              endPoint: { x: segment.endPoint.x, y: newPoint.y }
            };
          } else {
            // ضلع عمودي (طولي) - نحركه أفقياً فقط (لليمين واليسار)
            newArrowData.segments[segmentIndex] = {
              ...segment,
              startPoint: { x: newPoint.x, y: segment.startPoint.y },
              endPoint: { x: newPoint.x, y: segment.endPoint.y }
            };
          }
          
          // تحديث الأضلاع المجاورة
          if (segmentIndex > 0) {
            newArrowData.segments[segmentIndex - 1] = {
              ...baseArrowData.segments[segmentIndex - 1],
              endPoint: newArrowData.segments[segmentIndex].startPoint
            };
          }
          if (segmentIndex < baseArrowData.segments.length - 1) {
            newArrowData.segments[segmentIndex + 1] = {
              ...baseArrowData.segments[segmentIndex + 1],
              startPoint: newArrowData.segments[segmentIndex].endPoint
            };
          }
          
          // تحديث نقاط التحكم مع الحفاظ على حالة التفعيل
          newArrowData.controlPoints = updateMidpointsPositions(newArrowData);
        }
      } else {
        // سهم مستقيم - تحويله إلى متعامد
        newArrowData = convertToOrthogonalPath(baseArrowData, dragState.controlPointId, newPoint, currentDragDirection);
      }
    }

    updateElement(element.id, {
      data: { ...element.data, arrowData: newArrowData }
    });
  }, [dragState, viewport, element, arrowData, otherElements, updateElement]);

  // إنهاء السحب - ✅ حفظ الاتصال النهائي باستخدام getState()
  const handleMouseUp = useCallback(() => {
    // ✅ حفظ الاتصال النهائي قبل إعادة تعيين الحالة
    if (dragState.nearestAnchor && (dragState.controlPoint === 'start' || dragState.controlPoint === 'end')) {
      const connectionData = {
        elementId: dragState.nearestAnchor.elementId,
        anchorPoint: dragState.nearestAnchor.anchorPoint,
        offset: { x: 0, y: 0 }
      };
      
      // ✅ استخدام getState() للحصول على أحدث بيانات السهم
      const currentElement = useCanvasStore.getState().elements.find(e => e.id === element.id);
      const currentArrowData = currentElement?.data?.arrowData || arrowData;
      
      const updatedArrowData = { 
        ...currentArrowData,
        segments: [...(currentArrowData.segments || [])],
        controlPoints: [...(currentArrowData.controlPoints || [])]
      };
      
      if (dragState.controlPoint === 'start') {
        updatedArrowData.startConnection = connectionData;
        // تحديث نقطة التحكم أيضاً
        const startCP = updatedArrowData.controlPoints.find((cp: ArrowCP) => 
          cp.id === 'start' || (cp.type === 'endpoint' && updatedArrowData.controlPoints.indexOf(cp) === 0)
        );
        if (startCP) {
          startCP.connection = connectionData;
        }
      } else if (dragState.controlPoint === 'end') {
        updatedArrowData.endConnection = connectionData;
        // تحديث نقطة التحكم أيضاً
        const endCP = updatedArrowData.controlPoints.find((cp: ArrowCP) => 
          cp.id === 'end' || (cp.type === 'endpoint' && updatedArrowData.controlPoints.indexOf(cp) === updatedArrowData.controlPoints.length - 1)
        );
        if (endCP) {
          endCP.connection = connectionData;
        }
      }
      
      console.log('handleMouseUp: Saving connection', { 
        controlPoint: dragState.controlPoint, 
        connectionData,
        updatedStartConnection: updatedArrowData.startConnection,
        updatedEndConnection: updatedArrowData.endConnection
      });
      
      updateElement(element.id, {
        data: { ...(currentElement?.data || element.data), arrowData: updatedArrowData }
      });
    }
    
    // ✅ إيقاف Internal Drag
    useCanvasStore.getState().setInternalDrag(false);
    // ✅ إيقاف Internal Drag في حالة عدم وجود nearestAnchor أيضاً
    useCanvasStore.getState().setInternalDrag(false);
    
    setDragState({
      isDragging: false,
      controlPoint: null,
      controlPointId: undefined,
      startPosition: null,
      nearestAnchor: null,
      initialMousePos: null,
      dragDirection: null,
      containerRect: null,
      startSnapshot: null
    });
  }, [dragState, element, arrowData, updateElement]);

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

  // معالجة النقر المزدوج على نقطة غير نشطة لإضافة نص
  const handleMidpointDoubleClick = useCallback((e: React.MouseEvent, cp: ArrowCP) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (cp.type === 'midpoint') {
      if (cp.isActive) {
        // النقاط النشطة - حذف الضلع
        deleteSegmentByMidpoint(cp.id);
      } else {
        // النقاط غير النشطة - فتح حقل النص
        const existingLabel = midpointLabels[cp.id] || '';
        setEditingLabel({ midpointId: cp.id, text: existingLabel });
        // ✅ تفعيل وضع الكتابة لمنع اختصارات لوحة المفاتيح
        useCanvasStore.getState().startTyping();
        setTimeout(() => labelInputRef.current?.focus(), 50);
      }
    }
  }, [midpointLabels, deleteSegmentByMidpoint]);

  // حفظ النص على نقطة المنتصف - ✅ استخدام getState() للحصول على أحدث البيانات
  const saveMidpointLabel = useCallback(() => {
    if (!editingLabel) return;
    
    const { midpointId, text } = editingLabel;
    const trimmedText = text.trim();
    
    // ✅ استخدام getState() للحصول على أحدث بيانات السهم (تجنب closure قديم)
    const currentElement = useCanvasStore.getState().elements.find(e => e.id === element.id);
    const currentArrowData = currentElement?.data?.arrowData;
    
    if (!currentArrowData) {
      console.error('saveMidpointLabel: No arrowData found');
      setEditingLabel(null);
      return;
    }
    
    // ✅ تحديث نقطة التحكم بالنص
    const newControlPoints = currentArrowData.controlPoints.map((cp: ArrowCP & { label?: string }) => {
      if (cp.id === midpointId) {
        // إنشاء نسخة جديدة مع النص
        const updatedCp = { ...cp };
        if (trimmedText) {
          updatedCp.label = trimmedText;
        } else {
          delete updatedCp.label;
        }
        return updatedCp;
      }
      return { ...cp }; // نسخ كل نقطة للحفاظ على جميع الخصائص
    });
    
    const newArrowData: ArrowData = {
      ...currentArrowData,
      controlPoints: newControlPoints
    };
    
    console.log('saveMidpointLabel with getState:', { 
      midpointId, 
      trimmedText, 
      controlPointsWithLabels: newControlPoints.filter((cp: any) => cp.label)
    });
    
    updateElement(element.id, {
      data: { ...(currentElement?.data || {}), arrowData: newArrowData }
    });
    
    // ✅ إيقاف وضع الكتابة
    useCanvasStore.getState().stopTyping();
    setEditingLabel(null);
  }, [editingLabel, element.id, updateElement]);

  // إغلاق حقل النص
  const handleLabelKeyDown = useCallback((e: React.KeyboardEvent) => {
    // ✅ منع وصول الحدث للمستمعين الأعلى (مثل حذف العنصر)
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      saveMidpointLabel();
    } else if (e.key === 'Escape') {
      // ✅ إيقاف وضع الكتابة
      useCanvasStore.getState().stopTyping();
      setEditingLabel(null);
    }
  }, [saveMidpointLabel]);

  return (
    <>
      {renderPathLines()}

      {/* نقاط التحكم */}
      {displayControlPoints.map((cp, idx) => {
        const label = midpointLabels[cp.id];
        const isEditingThis = editingLabel?.midpointId === cp.id;
        
        return (
          <React.Fragment key={cp.id}>
            {/* نقطة التحكم */}
            <div
              className="absolute"
              style={{
                left: cp.position.x - (cp.type === 'endpoint' ? 5 : 4),
                top: cp.position.y - (cp.type === 'endpoint' ? 5 : 4),
                ...getControlPointStyle(cp)
              }}
              onMouseDown={(e) => handleMouseDown(e, cp)}
              onDoubleClick={(e) => handleMidpointDoubleClick(e, cp)}
              title={
                cp.type === 'endpoint' 
                  ? (idx === 0 ? 'نقطة البداية - اسحب للاتصال بعنصر' : 'نقطة النهاية - اسحب للاتصال بعنصر')
                  : cp.isActive 
                    ? 'نقطة المنتصف - اسحب للتحريك، انقر مرتين للحذف'
                    : 'نقطة المنتصف - اسحب لإنشاء مسار متعامد، انقر مرتين لإضافة نص'
              }
            />
            
            {/* النص على نقطة المنتصف */}
            {cp.type === 'midpoint' && !cp.isActive && (label || isEditingThis) && (
              <div
                className="absolute pointer-events-auto"
                style={{
                  left: cp.position.x,
                  top: cp.position.y - 24,
                  transform: 'translateX(-50%)',
                  zIndex: 1001
                }}
              >
                {isEditingThis ? (
                  <input
                    ref={labelInputRef}
                    type="text"
                    value={editingLabel?.text || ''}
                    onChange={(e) => setEditingLabel(prev => prev ? { ...prev, text: e.target.value } : null)}
                    onBlur={saveMidpointLabel}
                    onKeyDown={handleLabelKeyDown}
                    className="px-2 py-0.5 text-xs rounded border-none outline-none text-center"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#000000',
                      minWidth: '60px',
                      maxWidth: '150px',
                      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                      fontSize: '12px',
                      direction: 'rtl'
                    }}
                    placeholder="أدخل نصاً..."
                    autoFocus
                  />
                ) : (
                  <span
                    className="px-2 py-0.5 text-xs cursor-pointer"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#000000',
                      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      direction: 'rtl'
                    }}
                    onDoubleClick={(e) => handleMidpointDoubleClick(e, cp)}
                  >
                    {label}
                  </span>
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* ✅ مؤشر الالتصاق - حساب containerRect لحظياً عند كل عرض */}
      {dragState.nearestAnchor && (() => {
        // ✅ حساب containerRect في لحظة العرض (ليس من dragState)
        const canvasContainer = document.querySelector('[data-canvas-container]') || document.querySelector('.infinite-canvas-container');
        const liveContainerRect = canvasContainer?.getBoundingClientRect();
        
        if (!liveContainerRect) return null;
        
        const screenX = dragState.nearestAnchor.position.x * viewport.zoom + viewport.pan.x + liveContainerRect.left;
        const screenY = dragState.nearestAnchor.position.y * viewport.zoom + viewport.pan.y + liveContainerRect.top;
        
        return createPortal(
          <>
            <div
              className="fixed pointer-events-none"
              style={{
                left: screenX - 10,
                top: screenY - 10,
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid #E3E8F0',
                backgroundColor: 'rgba(227, 232, 240, 0.35)',
                boxShadow: '0 0 8px rgba(227, 232, 240, 0.6), inset 0 0 4px rgba(227, 232, 240, 0.4)',
                animation: 'pulse-snap 0.6s ease-in-out infinite',
                zIndex: 99999
              }}
            />
            {/* تأثير بصري إضافي عند الالتصاق */}
            <div
              className="fixed pointer-events-none"
              style={{
                left: screenX - 16,
                top: screenY - 16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid rgba(227, 232, 240, 0.5)',
                animation: 'pulse-ring 0.8s ease-out infinite',
                zIndex: 99998
              }}
            />
          </>,
          document.body
        );
      })()}

      <style>{`
        @keyframes pulse-snap {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default ArrowControlPoints;
