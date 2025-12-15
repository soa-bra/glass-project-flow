/**
 * Arrow Connections System Types
 * نظام اتصال الأسهم بالعناصر - نسخة محسنة مع دعم المسارات المتعددة
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

/**
 * ضلع واحد من مسار السهم
 */
export interface ArrowSegment {
  id: string;
  startPoint: ArrowPoint;
  endPoint: ArrowPoint;
}

/**
 * نقطة تحكم على مسار السهم
 */
export interface ArrowControlPoint {
  id: string;
  type: 'endpoint' | 'midpoint'; // نقطة نهاية (قابلة للاتصال) أو نقطة منتصف (للانحناء)
  position: ArrowPoint;
  segmentId?: string; // معرف الضلع الذي تنتمي إليه نقطة المنتصف
  isActive: boolean; // هل تم تفعيلها بالسحب
  connection?: ArrowConnection | null; // للاتصال بالعناصر (فقط لنقاط النهاية)
  label?: string; // نص توضيحي على نقطة المنتصف
}

export interface ArrowData {
  // نقاط السهم الأساسية (للتوافق مع النظام القديم)
  startPoint: ArrowPoint;
  middlePoint: ArrowPoint | null;
  endPoint: ArrowPoint;
  
  // نظام المسارات المتعددة الجديد
  segments: ArrowSegment[]; // قائمة الأضلاع
  controlPoints: ArrowControlPoint[]; // جميع نقاط التحكم
  
  // الاتصالات
  startConnection: ArrowConnection | null;
  endConnection: ArrowConnection | null;
  
  // نوع السهم
  arrowType: 'straight' | 'elbow' | 'orthogonal'; // مستقيم أو متعرج أو متعامد
  
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
  controlPointId?: string; // معرف نقطة التحكم المحددة
  startPosition: ArrowPoint | null;
  nearestAnchor: ElementAnchor | null;
}

/**
 * إنشاء معرف فريد
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * إنشاء بيانات سهم مستقيم جديد
 */
export const createStraightArrowData = (
  startPoint: ArrowPoint,
  endPoint: ArrowPoint,
  headDirection: ArrowData['headDirection'] = 'end'
): ArrowData => {
  const segmentId = generateId();
  const startId = generateId();
  const endId = generateId();
  const midId = generateId();
  
  const midPoint: ArrowPoint = {
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2
  };
  
  return {
    startPoint,
    middlePoint: null,
    endPoint,
    segments: [
      { id: segmentId, startPoint, endPoint }
    ],
    controlPoints: [
      { id: startId, type: 'endpoint', position: startPoint, isActive: true, connection: null },
      { id: midId, type: 'midpoint', position: midPoint, segmentId, isActive: false },
      { id: endId, type: 'endpoint', position: endPoint, isActive: true, connection: null }
    ],
    startConnection: null,
    endConnection: null,
    arrowType: 'straight',
    headDirection
  };
};

/**
 * تحويل سهم مستقيم إلى مسار متعامد (Orthogonal) عند سحب نقطة المنتصف
 */
export const convertToOrthogonalPath = (
  arrowData: ArrowData,
  draggedMidpointId: string,
  newPosition: ArrowPoint,
  dragDirection: 'horizontal' | 'vertical'
): ArrowData => {
  const startPoint = arrowData.startPoint;
  const endPoint = arrowData.endPoint;
  
  // تحديد نوع المسار بناءً على اتجاه السحب
  let pathPoints: ArrowPoint[];
  
  if (dragDirection === 'vertical') {
    // مسار: أفقي -> عمودي -> أفقي
    pathPoints = [
      startPoint,
      { x: startPoint.x, y: newPosition.y },
      { x: endPoint.x, y: newPosition.y },
      endPoint
    ];
  } else {
    // مسار: عمودي -> أفقي -> عمودي
    pathPoints = [
      startPoint,
      { x: newPosition.x, y: startPoint.y },
      { x: newPosition.x, y: endPoint.y },
      endPoint
    ];
  }
  
  // إنشاء الأضلاع الجديدة (3 أضلاع)
  const segments: ArrowSegment[] = [];
  const controlPoints: ArrowControlPoint[] = [];
  
  // نقطة البداية
  const startId = generateId();
  controlPoints.push({
    id: startId,
    type: 'endpoint',
    position: pathPoints[0],
    isActive: true,
    connection: arrowData.startConnection
  });
  
  // إنشاء الأضلاع ونقاط المنتصف
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const segId = generateId();
    segments.push({
      id: segId,
      startPoint: pathPoints[i],
      endPoint: pathPoints[i + 1]
    });
    
    // نقطة منتصف الضلع
    const isMiddleSegment = i === 1; // الضلع الأوسط هو الذي تم إنشاؤه بالسحب
    const midPoint: ArrowPoint = {
      x: (pathPoints[i].x + pathPoints[i + 1].x) / 2,
      y: (pathPoints[i].y + pathPoints[i + 1].y) / 2
    };
    
    controlPoints.push({
      id: isMiddleSegment ? draggedMidpointId : generateId(),
      type: 'midpoint',
      position: midPoint,
      segmentId: segId,
      isActive: isMiddleSegment // الضلع الأوسط يكون نشطاً، البقية غير نشطة
    });
  }
  
  // نقطة النهاية
  const endId = generateId();
  controlPoints.push({
    id: endId,
    type: 'endpoint',
    position: pathPoints[pathPoints.length - 1],
    isActive: true,
    connection: arrowData.endConnection
  });
  
  return {
    ...arrowData,
    startPoint: pathPoints[0],
    middlePoint: newPosition,
    endPoint: pathPoints[pathPoints.length - 1],
    segments,
    controlPoints,
    arrowType: 'orthogonal'
  };
};

/**
 * تحديث موقع نقطة نهاية (مع تحديث الأضلاع المتصلة)
 */
export const updateEndpointPosition = (
  arrowData: ArrowData,
  endpointType: 'start' | 'end',
  newPosition: ArrowPoint,
  connection: ArrowConnection | null
): ArrowData => {
  const newData = { ...arrowData };
  
  if (endpointType === 'start') {
    newData.startPoint = newPosition;
    newData.startConnection = connection;
    
    // تحديث أول ضلع
    if (newData.segments.length > 0) {
      newData.segments[0] = {
        ...newData.segments[0],
        startPoint: newPosition
      };
    }
    
    // تحديث نقطة البداية في controlPoints
    const startCP = newData.controlPoints.find(cp => cp.type === 'endpoint' && !newData.controlPoints.some(other => 
      other.type === 'endpoint' && other.id !== cp.id && newData.controlPoints.indexOf(other) < newData.controlPoints.indexOf(cp)
    ));
    if (startCP) {
      startCP.position = newPosition;
      startCP.connection = connection;
    }
  } else {
    newData.endPoint = newPosition;
    newData.endConnection = connection;
    
    // تحديث آخر ضلع
    if (newData.segments.length > 0) {
      const lastIdx = newData.segments.length - 1;
      newData.segments[lastIdx] = {
        ...newData.segments[lastIdx],
        endPoint: newPosition
      };
    }
    
    // تحديث نقطة النهاية في controlPoints
    const endCP = newData.controlPoints.filter(cp => cp.type === 'endpoint').pop();
    if (endCP) {
      endCP.position = newPosition;
      endCP.connection = connection;
    }
  }
  
  // تحديث نقاط المنتصف لتبقى في منتصف أضلاعها
  newData.controlPoints = newData.controlPoints.map(cp => {
    if (cp.type === 'midpoint' && cp.segmentId) {
      const segment = newData.segments.find(s => s.id === cp.segmentId);
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
  
  return newData;
};

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
  
  // نقاط السناب فقط على الحواف (أعلى، أسفل، يمين، يسار) بدون الزوايا
  const anchors: ArrowConnection['anchorPoint'][] = [
    'top', 'bottom', 'left', 'right'
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

/**
 * تحديث مواقع نقاط النهاية بناءً على العناصر المتصلة بها
 */
export const updateConnectedEndpoints = (
  arrowData: ArrowData,
  elements: Array<{ id: string; position: { x: number; y: number }; size: { width: number; height: number } }>,
  elementPosition: { x: number; y: number }
): ArrowData => {
  const newData = { ...arrowData };
  
  // تحديث نقطة البداية إذا كانت متصلة
  if (newData.startConnection?.elementId) {
    const connectedElement = elements.find(e => e.id === newData.startConnection?.elementId);
    if (connectedElement) {
      const anchorPos = getAnchorPosition(connectedElement, newData.startConnection.anchorPoint);
      newData.startPoint = {
        x: anchorPos.x - elementPosition.x,
        y: anchorPos.y - elementPosition.y
      };
    }
  }
  
  // تحديث نقطة النهاية إذا كانت متصلة
  if (newData.endConnection?.elementId) {
    const connectedElement = elements.find(e => e.id === newData.endConnection?.elementId);
    if (connectedElement) {
      const anchorPos = getAnchorPosition(connectedElement, newData.endConnection.anchorPoint);
      newData.endPoint = {
        x: anchorPos.x - elementPosition.x,
        y: anchorPos.y - elementPosition.y
      };
    }
  }
  
  return newData;
};

/**
 * ===============================================================
 * T-SHAPE CONNECTION ALGORITHM
 * خوارزمية اتصال T-Shape الإجبارية
 * ===============================================================
 * 
 * المبدأ الذهبي (Rule Zero):
 * أي اتصال بين طرف سهم وعنصر لازم ينتهي دائمًا بشكل حرف T
 * ولا يوجد أي استثناء.
 */

/**
 * تحديد ما إذا كان الضلع أفقي أو عمودي
 */
const isSegmentHorizontal = (segment: ArrowSegment): boolean => {
  const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
  const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);
  return dx >= dy;
};

/**
 * تحديد ما إذا كان الحد (anchor) أفقي أو عمودي
 * top/bottom = أفقي (الحد نفسه أفقي)
 * left/right = عمودي (الحد نفسه عمودي)
 */
const isAnchorEdgeHorizontal = (anchor: ArrowConnection['anchorPoint']): boolean => {
  return anchor === 'top' || anchor === 'bottom';
};

/**
 * تحديد ما إذا كان الضلع موازي للحد
 * ضلع أفقي + حد أفقي (top/bottom) = موازي
 * ضلع عمودي + حد عمودي (left/right) = موازي
 */
const isSegmentParallelToEdge = (segment: ArrowSegment, anchor: ArrowConnection['anchorPoint']): boolean => {
  const segmentIsHorizontal = isSegmentHorizontal(segment);
  const edgeIsHorizontal = isAnchorEdgeHorizontal(anchor);
  return segmentIsHorizontal === edgeIsHorizontal;
};

/**
 * تحديد اتجاه الإزاحة للخارج (بعيداً عن العنصر)
 */
const getOutwardDirection = (
  anchor: ArrowConnection['anchorPoint'],
  segmentPoint: ArrowPoint,
  anchorPoint: ArrowPoint
): { dx: number; dy: number } => {
  const OFFSET = 12; // مقدار الإزاحة بالبكسل
  
  switch (anchor) {
    case 'top':
      return { dx: 0, dy: -OFFSET }; // للأعلى
    case 'bottom':
      return { dx: 0, dy: OFFSET }; // للأسفل
    case 'left':
      return { dx: -OFFSET, dy: 0 }; // لليسار
    case 'right':
      return { dx: OFFSET, dy: 0 }; // لليمين
    default:
      return { dx: 0, dy: 0 };
  }
};

/**
 * التحقق مما إذا كان المسار يتقاطع مع العنصر
 * (يمر من داخل العنصر للوصول لنقطة السناب)
 */
const doesPathIntersectElement = (
  segmentEndPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  elementBounds: { x: number; y: number; width: number; height: number },
  arrowElementPosition: { x: number; y: number }
): boolean => {
  // تحويل إحداثيات نقطة الضلع من محلية للعنصر إلى عالمية
  const globalSegmentEnd = {
    x: segmentEndPoint.x + arrowElementPosition.x,
    y: segmentEndPoint.y + arrowElementPosition.y
  };
  
  // التحقق مما إذا كانت نقطة الضلع داخل حدود العنصر
  const isInsideX = globalSegmentEnd.x > elementBounds.x && globalSegmentEnd.x < elementBounds.x + elementBounds.width;
  const isInsideY = globalSegmentEnd.y > elementBounds.y && globalSegmentEnd.y < elementBounds.y + elementBounds.height;
  
  return isInsideX && isInsideY;
};

/**
 * الحالة (١): إنشاء T-Shape لحد موازي للضلع
 * - إزاحة الضلع A بالكامل وهو مستقيم (±12px)
 * - إنشاء ضلع مستقيم جديد واحد فقط يربط بين الضلع A ونقطة السناب
 */
const createParallelTShape = (
  arrowData: ArrowData,
  endpoint: 'start' | 'end',
  snapPoint: ArrowPoint,
  anchor: ArrowConnection['anchorPoint']
): ArrowData => {
  const newData = { 
    ...arrowData, 
    segments: arrowData.segments.map(s => ({ ...s, startPoint: { ...s.startPoint }, endPoint: { ...s.endPoint } })),
    controlPoints: arrowData.controlPoints.map(cp => ({ ...cp, position: { ...cp.position } }))
  };
  
  const OFFSET = 12;
  const segmentIdx = endpoint === 'start' ? 0 : arrowData.segments.length - 1;
  const segment = newData.segments[segmentIdx];
  
  // تحديد اتجاه الإزاحة
  const outward = getOutwardDirection(anchor, 
    endpoint === 'start' ? segment.startPoint : segment.endPoint,
    snapPoint
  );
  
  if (isSegmentHorizontal(segment)) {
    // ضلع أفقي - إزاحة عمودية
    const offsetY = outward.dy !== 0 ? outward.dy : (anchor === 'top' ? -OFFSET : OFFSET);
    
    if (endpoint === 'start') {
      // إزاحة الضلع بالكامل
      newData.segments[0] = {
        ...segment,
        startPoint: { x: segment.startPoint.x, y: segment.startPoint.y + offsetY },
        endPoint: { x: segment.endPoint.x, y: segment.endPoint.y + offsetY }
      };
      
      // إنشاء ضلع رابط جديد من نقطة السناب للضلع المُزاح
      const connectorId = generateId();
      const connectorSegment: ArrowSegment = {
        id: connectorId,
        startPoint: snapPoint,
        endPoint: { x: snapPoint.x, y: newData.segments[0].startPoint.y }
      };
      
      // إضافة الضلع الرابط في البداية
      newData.segments.unshift(connectorSegment);
      newData.startPoint = snapPoint;
      
      // إضافة نقطة تحكم للضلع الجديد
      const midPoint: ArrowPoint = {
        x: (connectorSegment.startPoint.x + connectorSegment.endPoint.x) / 2,
        y: (connectorSegment.startPoint.y + connectorSegment.endPoint.y) / 2
      };
      
      const newMidpointCP: ArrowControlPoint = {
        id: generateId(),
        type: 'midpoint',
        position: midPoint,
        segmentId: connectorId,
        isActive: false
      };
      
      // تحديث نقطة البداية
      const startCP = newData.controlPoints.find(cp => cp.type === 'endpoint' && newData.controlPoints.indexOf(cp) === 0);
      if (startCP) {
        startCP.position = snapPoint;
      }
      
      // إدراج نقطة المنتصف الجديدة
      newData.controlPoints.splice(1, 0, newMidpointCP);
    } else {
      // إزاحة الضلع بالكامل
      const lastIdx = newData.segments.length - 1;
      newData.segments[lastIdx] = {
        ...segment,
        startPoint: { x: segment.startPoint.x, y: segment.startPoint.y + offsetY },
        endPoint: { x: segment.endPoint.x, y: segment.endPoint.y + offsetY }
      };
      
      // إنشاء ضلع رابط جديد من الضلع المُزاح لنقطة السناب
      const connectorId = generateId();
      const connectorSegment: ArrowSegment = {
        id: connectorId,
        startPoint: { x: snapPoint.x, y: newData.segments[lastIdx].endPoint.y },
        endPoint: snapPoint
      };
      
      // إضافة الضلع الرابط في النهاية
      newData.segments.push(connectorSegment);
      newData.endPoint = snapPoint;
      
      // إضافة نقطة تحكم للضلع الجديد
      const midPoint: ArrowPoint = {
        x: (connectorSegment.startPoint.x + connectorSegment.endPoint.x) / 2,
        y: (connectorSegment.startPoint.y + connectorSegment.endPoint.y) / 2
      };
      
      const newMidpointCP: ArrowControlPoint = {
        id: generateId(),
        type: 'midpoint',
        position: midPoint,
        segmentId: connectorId,
        isActive: false
      };
      
      // تحديث نقطة النهاية
      const endCP = newData.controlPoints.filter(cp => cp.type === 'endpoint').pop();
      if (endCP) {
        endCP.position = snapPoint;
      }
      
      // إدراج نقطة المنتصف الجديدة قبل نقطة النهاية
      newData.controlPoints.splice(newData.controlPoints.length - 1, 0, newMidpointCP);
    }
  } else {
    // ضلع عمودي - إزاحة أفقية
    const offsetX = outward.dx !== 0 ? outward.dx : (anchor === 'left' ? -OFFSET : OFFSET);
    
    if (endpoint === 'start') {
      newData.segments[0] = {
        ...segment,
        startPoint: { x: segment.startPoint.x + offsetX, y: segment.startPoint.y },
        endPoint: { x: segment.endPoint.x + offsetX, y: segment.endPoint.y }
      };
      
      const connectorId = generateId();
      const connectorSegment: ArrowSegment = {
        id: connectorId,
        startPoint: snapPoint,
        endPoint: { x: newData.segments[0].startPoint.x, y: snapPoint.y }
      };
      
      newData.segments.unshift(connectorSegment);
      newData.startPoint = snapPoint;
      
      const midPoint: ArrowPoint = {
        x: (connectorSegment.startPoint.x + connectorSegment.endPoint.x) / 2,
        y: (connectorSegment.startPoint.y + connectorSegment.endPoint.y) / 2
      };
      
      const newMidpointCP: ArrowControlPoint = {
        id: generateId(),
        type: 'midpoint',
        position: midPoint,
        segmentId: connectorId,
        isActive: false
      };
      
      const startCP = newData.controlPoints.find(cp => cp.type === 'endpoint' && newData.controlPoints.indexOf(cp) === 0);
      if (startCP) {
        startCP.position = snapPoint;
      }
      
      newData.controlPoints.splice(1, 0, newMidpointCP);
    } else {
      const lastIdx = newData.segments.length - 1;
      newData.segments[lastIdx] = {
        ...segment,
        startPoint: { x: segment.startPoint.x + offsetX, y: segment.startPoint.y },
        endPoint: { x: segment.endPoint.x + offsetX, y: segment.endPoint.y }
      };
      
      const connectorId = generateId();
      const connectorSegment: ArrowSegment = {
        id: connectorId,
        startPoint: { x: newData.segments[lastIdx].endPoint.x, y: snapPoint.y },
        endPoint: snapPoint
      };
      
      newData.segments.push(connectorSegment);
      newData.endPoint = snapPoint;
      
      const midPoint: ArrowPoint = {
        x: (connectorSegment.startPoint.x + connectorSegment.endPoint.x) / 2,
        y: (connectorSegment.startPoint.y + connectorSegment.endPoint.y) / 2
      };
      
      const newMidpointCP: ArrowControlPoint = {
        id: generateId(),
        type: 'midpoint',
        position: midPoint,
        segmentId: connectorId,
        isActive: false
      };
      
      const endCP = newData.controlPoints.filter(cp => cp.type === 'endpoint').pop();
      if (endCP) {
        endCP.position = snapPoint;
      }
      
      newData.controlPoints.splice(newData.controlPoints.length - 1, 0, newMidpointCP);
    }
  }
  
  // تحديث الأضلاع المجاورة
  for (let i = 1; i < newData.segments.length; i++) {
    newData.segments[i] = {
      ...newData.segments[i],
      startPoint: { ...newData.segments[i - 1].endPoint }
    };
  }
  
  newData.arrowType = 'orthogonal';
  return newData;
};

/**
 * الحالة (٢): إنشاء U-Shape للمسار الذي يمر من داخل العنصر
 * - إزاحة الضلع A وهو مستقيم (±12px)
 * - زيادة طول الضلع A بمقدار 12px للخارج
 * - إنشاء ضلعين جديدين (B و C) لتشكيل U-Shape
 */
const createUShapePath = (
  arrowData: ArrowData,
  endpoint: 'start' | 'end',
  snapPoint: ArrowPoint,
  anchor: ArrowConnection['anchorPoint'],
  elementBounds: { x: number; y: number; width: number; height: number }
): ArrowData => {
  const newData = { 
    ...arrowData, 
    segments: arrowData.segments.map(s => ({ ...s, startPoint: { ...s.startPoint }, endPoint: { ...s.endPoint } })),
    controlPoints: arrowData.controlPoints.map(cp => ({ ...cp, position: { ...cp.position } }))
  };
  
  const OFFSET = 12;
  const EXTENSION = 12;
  
  const segmentIdx = endpoint === 'start' ? 0 : arrowData.segments.length - 1;
  const segment = newData.segments[segmentIdx];
  const segmentIsHorizontal = isSegmentHorizontal(segment);
  
  // تحديد اتجاه الإزاحة والمد
  if (endpoint === 'start') {
    if (segmentIsHorizontal) {
      // ضلع أفقي
      const offsetY = anchor === 'top' ? -OFFSET : OFFSET;
      const extendX = segment.startPoint.x < segment.endPoint.x ? -EXTENSION : EXTENSION;
      
      // الضلع A المُزاح والممتد
      const newStartPoint = { x: segment.startPoint.x + extendX, y: segment.startPoint.y + offsetY };
      const newEndPoint = { x: segment.endPoint.x, y: segment.endPoint.y + offsetY };
      
      newData.segments[0] = { ...segment, startPoint: newStartPoint, endPoint: newEndPoint };
      
      // الضلع B: من نقطة السناب عمودياً
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: snapPoint,
        endPoint: { x: snapPoint.x, y: newStartPoint.y }
      };
      
      // الضلع C: يربط B بـ A
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: segmentB.endPoint,
        endPoint: newStartPoint
      };
      
      newData.segments.unshift(segmentC);
      newData.segments.unshift(segmentB);
      newData.startPoint = snapPoint;
      
    } else {
      // ضلع عمودي
      const offsetX = anchor === 'left' ? -OFFSET : OFFSET;
      const extendY = segment.startPoint.y < segment.endPoint.y ? -EXTENSION : EXTENSION;
      
      const newStartPoint = { x: segment.startPoint.x + offsetX, y: segment.startPoint.y + extendY };
      const newEndPoint = { x: segment.endPoint.x + offsetX, y: segment.endPoint.y };
      
      newData.segments[0] = { ...segment, startPoint: newStartPoint, endPoint: newEndPoint };
      
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: snapPoint,
        endPoint: { x: newStartPoint.x, y: snapPoint.y }
      };
      
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: segmentB.endPoint,
        endPoint: newStartPoint
      };
      
      newData.segments.unshift(segmentC);
      newData.segments.unshift(segmentB);
      newData.startPoint = snapPoint;
    }
    
    // إضافة نقاط التحكم للأضلاع الجديدة
    const midB: ArrowPoint = {
      x: (newData.segments[0].startPoint.x + newData.segments[0].endPoint.x) / 2,
      y: (newData.segments[0].startPoint.y + newData.segments[0].endPoint.y) / 2
    };
    const midC: ArrowPoint = {
      x: (newData.segments[1].startPoint.x + newData.segments[1].endPoint.x) / 2,
      y: (newData.segments[1].startPoint.y + newData.segments[1].endPoint.y) / 2
    };
    
    const cpB: ArrowControlPoint = { id: generateId(), type: 'midpoint', position: midB, segmentId: newData.segments[0].id, isActive: false };
    const cpC: ArrowControlPoint = { id: generateId(), type: 'midpoint', position: midC, segmentId: newData.segments[1].id, isActive: false };
    
    const startCP = newData.controlPoints.find(cp => cp.type === 'endpoint' && newData.controlPoints.indexOf(cp) === 0);
    if (startCP) startCP.position = snapPoint;
    
    newData.controlPoints.splice(1, 0, cpB, cpC);
    
  } else {
    // endpoint === 'end'
    const lastIdx = newData.segments.length - 1;
    
    if (segmentIsHorizontal) {
      const offsetY = anchor === 'top' ? -OFFSET : OFFSET;
      const extendX = segment.endPoint.x > segment.startPoint.x ? EXTENSION : -EXTENSION;
      
      const newStartPoint = { x: segment.startPoint.x, y: segment.startPoint.y + offsetY };
      const newEndPoint = { x: segment.endPoint.x + extendX, y: segment.endPoint.y + offsetY };
      
      newData.segments[lastIdx] = { ...segment, startPoint: newStartPoint, endPoint: newEndPoint };
      
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: newEndPoint,
        endPoint: { x: snapPoint.x, y: newEndPoint.y }
      };
      
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: segmentC.endPoint,
        endPoint: snapPoint
      };
      
      newData.segments.push(segmentC);
      newData.segments.push(segmentB);
      newData.endPoint = snapPoint;
      
    } else {
      const offsetX = anchor === 'left' ? -OFFSET : OFFSET;
      const extendY = segment.endPoint.y > segment.startPoint.y ? EXTENSION : -EXTENSION;
      
      const newStartPoint = { x: segment.startPoint.x + offsetX, y: segment.startPoint.y };
      const newEndPoint = { x: segment.endPoint.x + offsetX, y: segment.endPoint.y + extendY };
      
      newData.segments[lastIdx] = { ...segment, startPoint: newStartPoint, endPoint: newEndPoint };
      
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: newEndPoint,
        endPoint: { x: newEndPoint.x, y: snapPoint.y }
      };
      
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: segmentC.endPoint,
        endPoint: snapPoint
      };
      
      newData.segments.push(segmentC);
      newData.segments.push(segmentB);
      newData.endPoint = snapPoint;
    }
    
    const segLen = newData.segments.length;
    const midC: ArrowPoint = {
      x: (newData.segments[segLen - 2].startPoint.x + newData.segments[segLen - 2].endPoint.x) / 2,
      y: (newData.segments[segLen - 2].startPoint.y + newData.segments[segLen - 2].endPoint.y) / 2
    };
    const midB: ArrowPoint = {
      x: (newData.segments[segLen - 1].startPoint.x + newData.segments[segLen - 1].endPoint.x) / 2,
      y: (newData.segments[segLen - 1].startPoint.y + newData.segments[segLen - 1].endPoint.y) / 2
    };
    
    const cpC: ArrowControlPoint = { id: generateId(), type: 'midpoint', position: midC, segmentId: newData.segments[segLen - 2].id, isActive: false };
    const cpB: ArrowControlPoint = { id: generateId(), type: 'midpoint', position: midB, segmentId: newData.segments[segLen - 1].id, isActive: false };
    
    const endCP = newData.controlPoints.filter(cp => cp.type === 'endpoint').pop();
    if (endCP) endCP.position = snapPoint;
    
    newData.controlPoints.splice(newData.controlPoints.length - 1, 0, cpC, cpB);
  }
  
  // تحديث الأضلاع المجاورة
  for (let i = 1; i < newData.segments.length; i++) {
    newData.segments[i] = {
      ...newData.segments[i],
      startPoint: { ...newData.segments[i - 1].endPoint }
    };
  }
  
  newData.arrowType = 'orthogonal';
  return newData;
};

/**
 * إنشاء اتصال T-Shape بسيط (عندما يكون الاتصال المباشر مناسباً)
 * - الضلع عمودي على الحد = T-Shape مباشر
 */
const createDirectTShape = (
  arrowData: ArrowData,
  endpoint: 'start' | 'end',
  snapPoint: ArrowPoint
): ArrowData => {
  const newData = { 
    ...arrowData, 
    segments: arrowData.segments.map(s => ({ ...s, startPoint: { ...s.startPoint }, endPoint: { ...s.endPoint } })),
    controlPoints: arrowData.controlPoints.map(cp => ({ ...cp, position: { ...cp.position } }))
  };
  
  if (endpoint === 'start') {
    newData.startPoint = snapPoint;
    if (newData.segments.length > 0) {
      newData.segments[0] = { ...newData.segments[0], startPoint: snapPoint };
    }
    
    const startCP = newData.controlPoints.find(cp => cp.type === 'endpoint' && newData.controlPoints.indexOf(cp) === 0);
    if (startCP) startCP.position = snapPoint;
    
  } else {
    newData.endPoint = snapPoint;
    if (newData.segments.length > 0) {
      const lastIdx = newData.segments.length - 1;
      newData.segments[lastIdx] = { ...newData.segments[lastIdx], endPoint: snapPoint };
    }
    
    const endCP = newData.controlPoints.filter(cp => cp.type === 'endpoint').pop();
    if (endCP) endCP.position = snapPoint;
  }
  
  // تحديث نقاط المنتصف
  newData.controlPoints = newData.controlPoints.map(cp => {
    if (cp.type === 'midpoint' && cp.segmentId) {
      const segment = newData.segments.find(s => s.id === cp.segmentId);
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
  
  return newData;
};

/**
 * الدالة الرئيسية: تطبيق خوارزمية T-Shape
 * تحدد الحالة المناسبة وتطبق الحل الصحيح
 */
export const applyTShapeConnection = (
  arrowData: ArrowData,
  endpoint: 'start' | 'end',
  snapPoint: ArrowPoint,
  anchor: ArrowConnection['anchorPoint'],
  targetElement: { position: { x: number; y: number }; size: { width: number; height: number } },
  arrowElementPosition: { x: number; y: number }
): ArrowData => {
  // الحصول على الضلع المتصل
  const segmentIdx = endpoint === 'start' ? 0 : arrowData.segments.length - 1;
  const segment = arrowData.segments[segmentIdx];
  
  if (!segment) {
    // لا يوجد ضلع - اتصال مباشر
    return createDirectTShape(arrowData, endpoint, snapPoint);
  }
  
  // حساب حدود العنصر المستهدف
  const elementBounds = {
    x: targetElement.position.x,
    y: targetElement.position.y,
    width: targetElement.size.width,
    height: targetElement.size.height
  };
  
  // تحديد نقطة الضلع القريبة من السناب
  const segmentPoint = endpoint === 'start' ? segment.startPoint : segment.endPoint;
  
  // التحقق من الحالات
  const isParallel = isSegmentParallelToEdge(segment, anchor);
  const pathIntersects = doesPathIntersectElement(segmentPoint, snapPoint, elementBounds, arrowElementPosition);
  
  if (isParallel) {
    // الحالة (١): الحد موازي للضلع
    return createParallelTShape(arrowData, endpoint, snapPoint, anchor);
  } else if (pathIntersects) {
    // الحالة (٢): المسار يتقاطع مع العنصر
    return createUShapePath(arrowData, endpoint, snapPoint, anchor, elementBounds);
  } else {
    // الاتصال المباشر مسموح (T-Shape طبيعي)
    return createDirectTShape(arrowData, endpoint, snapPoint);
  }
};
