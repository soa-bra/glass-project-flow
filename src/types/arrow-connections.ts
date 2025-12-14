/**
 * Arrow Connections System Types
 * نظام اتصال الأسهم المتقدم - Orthogonal Connectors
 */

// ثوابت النظام
export const ARROW_CONSTANTS = {
  SNAP_DISTANCE: 12,      // مسافة الالتصاق
  DETACH_DISTANCE: 16,    // مسافة فك الالتصاق
  MIN_SEGMENT: 8,         // الحد الأدنى لطول المقطع
  HEAD_SIZE: 12,          // حجم رأس السهم
};

export interface ArrowPoint {
  x: number;
  y: number;
}

// ربط نقطة السهم بعنصر
export interface ArrowBinding {
  elementId: string;
  anchor: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  portId?: string;           // للمنافذ المخصصة
  offset?: { dx: number; dy: number };  // إزاحة نسبية
}

// بيانات السهم المتقدمة
export interface ArrowData {
  // مصفوفة النقاط (start + middle points + end)
  points: ArrowPoint[];
  
  // الربط بالعناصر
  startBinding: ArrowBinding | null;
  endBinding: ArrowBinding | null;
  
  // نوع السهم
  arrowType: 'straight' | 'orthogonal' | 'elbow';
  
  // اتجاه رأس السهم
  headDirection: 'end' | 'start' | 'both' | 'none';
  
  // ---- للتوافق مع الكود القديم ----
  startPoint: ArrowPoint;
  middlePoint: ArrowPoint | null;
  endPoint: ArrowPoint;
  startConnection: ArrowConnection | null;
  endConnection: ArrowConnection | null;
}

// للتوافق مع الكود القديم
export interface ArrowConnection {
  elementId: string | null;
  anchorPoint: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset: { x: number; y: number };
}

export interface ArrowElement {
  id: string;
  type: 'arrow';
  arrowData: ArrowData;
  style: {
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
  };
}

// نقطة الارتكاز للعنصر
export interface ElementAnchor {
  elementId: string;
  anchorPoint: ArrowBinding['anchor'];
  position: ArrowPoint;
}

// حالة السحب لنقاط التحكم
export interface ArrowControlDragState {
  isDragging: boolean;
  controlPoint: 'start' | 'end' | number | null;  // number = index of middle handle
  startPosition: ArrowPoint | null;
  nearestAnchor: ElementAnchor | null;
}

/**
 * إنشاء بيانات سهم افتراضية
 */
export const createDefaultArrowData = (
  startX: number, 
  startY: number, 
  endX: number, 
  endY: number,
  headDirection: ArrowData['headDirection'] = 'end'
): ArrowData => {
  const startPoint = { x: startX, y: startY };
  const endPoint = { x: endX, y: endY };
  
  return {
    points: [startPoint, endPoint],
    startBinding: null,
    endBinding: null,
    arrowType: 'straight',
    headDirection,
    // للتوافق مع الكود القديم
    startPoint,
    middlePoint: null,
    endPoint,
    startConnection: null,
    endConnection: null
  };
};

/**
 * تحويل السهم المستقيم إلى مسار متعرج (Orthogonal)
 */
export const convertToOrthogonal = (
  arrowData: ArrowData,
  draggedPointIndex: number,
  newPosition: ArrowPoint,
  dragDirection: 'horizontal' | 'vertical'
): ArrowData => {
  const points = [...arrowData.points];
  const start = points[0];
  const end = points[points.length - 1];
  
  // إذا كان السهم مستقيماً (نقطتين فقط) وتم سحب نقطة المنتصف
  if (points.length === 2 && draggedPointIndex === -1) {
    // تحديد المسار بناءً على اتجاه السحب
    if (dragDirection === 'horizontal') {
      // مسار: أفقي -> عمودي -> أفقي
      const midX = newPosition.x;
      return {
        ...arrowData,
        points: [
          start,
          { x: midX, y: start.y },
          { x: midX, y: end.y },
          end
        ],
        arrowType: 'orthogonal',
        middlePoint: newPosition,
        startPoint: start,
        endPoint: end
      };
    } else {
      // مسار: عمودي -> أفقي -> عمودي
      const midY = newPosition.y;
      return {
        ...arrowData,
        points: [
          start,
          { x: start.x, y: midY },
          { x: end.x, y: midY },
          end
        ],
        arrowType: 'orthogonal',
        middlePoint: newPosition,
        startPoint: start,
        endPoint: end
      };
    }
  }
  
  // إذا كان السهم متعرجاً بالفعل، نحدث النقطة المسحوبة
  if (draggedPointIndex >= 0 && draggedPointIndex < points.length) {
    points[draggedPointIndex] = newPosition;
    
    // تطبيق Orthogonalize: إجبار المقاطع على أن تكون أفقية/عمودية
    const orthogonalPoints = orthogonalizePoints(points);
    const simplifiedPoints = simplifyPoints(orthogonalPoints);
    
    return {
      ...arrowData,
      points: simplifiedPoints,
      startPoint: simplifiedPoints[0],
      endPoint: simplifiedPoints[simplifiedPoints.length - 1],
      middlePoint: simplifiedPoints.length > 2 ? simplifiedPoints[1] : null
    };
  }
  
  return arrowData;
};

/**
 * جعل المقاطع أفقية/عمودية فقط
 */
export const orthogonalizePoints = (points: ArrowPoint[]): ArrowPoint[] => {
  if (points.length < 2) return points;
  
  const result: ArrowPoint[] = [points[0]];
  
  for (let i = 1; i < points.length; i++) {
    const prev = result[result.length - 1];
    const curr = points[i];
    
    // إذا كانت النقطة ليست على نفس المحور الأفقي أو العمودي
    const dx = Math.abs(curr.x - prev.x);
    const dy = Math.abs(curr.y - prev.y);
    
    if (dx > ARROW_CONSTANTS.MIN_SEGMENT && dy > ARROW_CONSTANTS.MIN_SEGMENT) {
      // نحتاج إلى نقطة وسيطة لجعل المسار متعامداً
      // اختر المسار الأقصر
      if (dx > dy) {
        result.push({ x: curr.x, y: prev.y });
      } else {
        result.push({ x: prev.x, y: curr.y });
      }
    }
    
    result.push(curr);
  }
  
  return result;
};

/**
 * تبسيط النقاط: دمج النقاط المتقاربة وإلغاء المقاطع القصيرة
 */
export const simplifyPoints = (points: ArrowPoint[]): ArrowPoint[] => {
  if (points.length <= 2) return points;
  
  const result: ArrowPoint[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // حساب المسافة بين النقاط
    const distToPrev = Math.sqrt(
      Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
    );
    const distToNext = Math.sqrt(
      Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2)
    );
    
    // إذا كانت النقطة قريبة جداً من السابقة أو التالية، تجاهلها
    if (distToPrev > ARROW_CONSTANTS.MIN_SEGMENT && distToNext > ARROW_CONSTANTS.MIN_SEGMENT) {
      // تحقق إذا كانت النقاط الثلاث على خط واحد
      const onSameLine = (
        (prev.x === curr.x && curr.x === next.x) ||
        (prev.y === curr.y && curr.y === next.y)
      );
      
      if (!onSameLine) {
        result.push(curr);
      }
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
};

/**
 * حساب موقع نقطة الارتكاز على عنصر
 */
export const getAnchorPosition = (
  element: { position: { x: number; y: number }; size: { width: number; height: number } },
  anchor: ArrowBinding['anchor']
): ArrowPoint => {
  const { x, y } = element.position;
  const { width, height } = element.size;
  
  switch (anchor) {
    case 'center':
      return { x: x + width / 2, y: y + height / 2 };
    case 'top':
      return { x: x + width / 2, y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'top-left':
      return { x, y };
    case 'top-right':
      return { x: x + width, y };
    case 'bottom-left':
      return { x, y: y + height };
    case 'bottom-right':
      return { x: x + width, y: y + height };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
};

/**
 * العثور على أقرب نقطة ارتكاز لموقع معين
 */
export const findNearestAnchor = (
  point: ArrowPoint,
  elements: Array<{ id: string; position: { x: number; y: number }; size: { width: number; height: number } }>,
  threshold: number = ARROW_CONSTANTS.SNAP_DISTANCE
): ElementAnchor | null => {
  let nearest: ElementAnchor | null = null;
  let minDistance = threshold;
  
  const anchors: ArrowBinding['anchor'][] = [
    'center', 'top', 'bottom', 'left', 'right',
    'top-left', 'top-right', 'bottom-left', 'bottom-right'
  ];
  
  for (const element of elements) {
    for (const anchor of anchors) {
      const anchorPos = getAnchorPosition(element, anchor);
      const distance = Math.sqrt(
        Math.pow(point.x - anchorPos.x, 2) + Math.pow(point.y - anchorPos.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = {
          elementId: element.id,
          anchorPoint: anchor,
          position: anchorPos
        };
      }
    }
  }
  
  return nearest;
};

/**
 * حساب نقاط مسار السهم المتعرج (Elbow) - للتوافق
 */
export const calculateElbowPath = (
  start: ArrowPoint,
  middle: ArrowPoint,
  end: ArrowPoint
): ArrowPoint[] => {
  return [
    start,
    { x: middle.x, y: start.y },
    { x: middle.x, y: end.y },
    end
  ];
};

/**
 * الحصول على نقاط التحكم (Handles) للسهم
 * نقطة بداية + نقاط وسطى + نقطة نهاية
 */
export const getArrowHandles = (arrowData: ArrowData): ArrowPoint[] => {
  if (arrowData.arrowType === 'straight' || arrowData.points.length <= 2) {
    // للسهم المستقيم: بداية + منتصف افتراضي + نهاية
    const start = arrowData.points[0] || arrowData.startPoint;
    const end = arrowData.points[arrowData.points.length - 1] || arrowData.endPoint;
    const middle = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
    return [start, middle, end];
  }
  
  // للسهم المتعرج: جميع النقاط
  return arrowData.points;
};

/**
 * تحديث موقع نقطة معينة في السهم
 */
export const updateArrowPoint = (
  arrowData: ArrowData,
  handleIndex: number,
  newPosition: ArrowPoint,
  binding: ArrowBinding | null = null
): ArrowData => {
  const handles = getArrowHandles(arrowData);
  const isStart = handleIndex === 0;
  const isEnd = handleIndex === handles.length - 1;
  const isMiddle = !isStart && !isEnd;
  
  // تحديث السهم المستقيم
  if (arrowData.arrowType === 'straight' || arrowData.points.length <= 2) {
    if (isStart) {
      return {
        ...arrowData,
        points: [newPosition, arrowData.points[arrowData.points.length - 1] || arrowData.endPoint],
        startPoint: newPosition,
        startBinding: binding,
        startConnection: binding ? {
          elementId: binding.elementId,
          anchorPoint: binding.anchor,
          offset: { x: 0, y: 0 }
        } : null
      };
    } else if (isEnd) {
      return {
        ...arrowData,
        points: [arrowData.points[0] || arrowData.startPoint, newPosition],
        endPoint: newPosition,
        endBinding: binding,
        endConnection: binding ? {
          elementId: binding.elementId,
          anchorPoint: binding.anchor,
          offset: { x: 0, y: 0 }
        } : null
      };
    } else if (isMiddle) {
      // تحريك نقطة المنتصف يحول السهم إلى متعرج
      const start = arrowData.points[0] || arrowData.startPoint;
      const end = arrowData.points[arrowData.points.length - 1] || arrowData.endPoint;
      
      // تحديد اتجاه السحب
      const originalMiddle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      const dx = Math.abs(newPosition.x - originalMiddle.x);
      const dy = Math.abs(newPosition.y - originalMiddle.y);
      
      return convertToOrthogonal(
        arrowData,
        -1,
        newPosition,
        dx > dy ? 'horizontal' : 'vertical'
      );
    }
  }
  
  // تحديث السهم المتعرج
  const newPoints = [...arrowData.points];
  
  if (isStart) {
    newPoints[0] = newPosition;
    return {
      ...arrowData,
      points: simplifyPoints(orthogonalizePoints(newPoints)),
      startPoint: newPosition,
      startBinding: binding,
      startConnection: binding ? {
        elementId: binding.elementId,
        anchorPoint: binding.anchor,
        offset: { x: 0, y: 0 }
      } : null
    };
  } else if (isEnd) {
    newPoints[newPoints.length - 1] = newPosition;
    return {
      ...arrowData,
      points: simplifyPoints(orthogonalizePoints(newPoints)),
      endPoint: newPosition,
      endBinding: binding,
      endConnection: binding ? {
        elementId: binding.elementId,
        anchorPoint: binding.anchor,
        offset: { x: 0, y: 0 }
      } : null
    };
  } else {
    // تحديث نقطة وسطى
    newPoints[handleIndex] = newPosition;
    const processedPoints = simplifyPoints(orthogonalizePoints(newPoints));
    return {
      ...arrowData,
      points: processedPoints,
      middlePoint: processedPoints.length > 2 ? processedPoints[1] : null
    };
  }
};
