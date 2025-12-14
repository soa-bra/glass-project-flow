/**
 * Arrow Connections System Types
 * نظام اتصال الأسهم بالعناصر
 */

export interface ArrowPoint {
  x: number;
  y: number;
}

export interface ArrowConnection {
  elementId: string | null; // معرف العنصر المتصل به (null = غير متصل)
  anchorPoint: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset: { x: number; y: number }; // الإزاحة من نقطة الارتكاز
}

export interface ArrowData {
  // نقاط السهم
  startPoint: ArrowPoint;
  middlePoint: ArrowPoint | null; // null = سهم مستقيم، قيمة = سهم متعرج
  endPoint: ArrowPoint;
  
  // الاتصالات
  startConnection: ArrowConnection | null;
  endConnection: ArrowConnection | null;
  
  // نوع السهم
  arrowType: 'straight' | 'elbow'; // مستقيم أو متعرج
  
  // اتجاه رأس السهم
  headDirection: 'end' | 'start' | 'both' | 'none';
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
  anchorPoint: ArrowConnection['anchorPoint'];
  position: ArrowPoint;
}

// حالة السحب لنقاط التحكم
export interface ArrowControlDragState {
  isDragging: boolean;
  controlPoint: 'start' | 'middle' | 'end' | null;
  startPosition: ArrowPoint | null;
  nearestAnchor: ElementAnchor | null;
}

/**
 * حساب موقع نقطة الارتكاز على عنصر
 */
export const getAnchorPosition = (
  element: { position: { x: number; y: number }; size: { width: number; height: number } },
  anchor: ArrowConnection['anchorPoint']
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
  threshold: number = 20
): ElementAnchor | null => {
  let nearest: ElementAnchor | null = null;
  let minDistance = threshold;
  
  const anchors: ArrowConnection['anchorPoint'][] = [
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
 * حساب نقاط مسار السهم المتعرج (Elbow)
 */
export const calculateElbowPath = (
  start: ArrowPoint,
  middle: ArrowPoint,
  end: ArrowPoint
): ArrowPoint[] => {
  // المسار المتعرج: بداية -> نقطة وسطى أفقية -> نقطة وسطى عمودية -> نهاية
  return [
    start,
    { x: middle.x, y: start.y },  // نقطة الانعطاف الأولى
    { x: middle.x, y: end.y },    // نقطة الانعطاف الثانية
    end
  ];
};
