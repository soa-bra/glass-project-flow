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
 * إنشاء اتصال على شكل T عند السناب
 * يضيف ضلع صغير (8px) لضمان أن الاتصال يكون متعامداً دائماً
 */
export const createTShapeConnection = (
  arrowData: ArrowData,
  endpoint: 'start' | 'end',
  anchorPoint: ArrowConnection['anchorPoint'],
  anchorPosition: ArrowPoint,
  elementPosition: { x: number; y: number }
): ArrowData => {
  const connectorLength = 8; // طول الضلع الإضافي
  const localAnchorPos = {
    x: anchorPosition.x - elementPosition.x,
    y: anchorPosition.y - elementPosition.y
  };
  
  const newData = { 
    ...arrowData, 
    segments: arrowData.segments.map(s => ({ ...s })),
    controlPoints: arrowData.controlPoints.map(cp => ({ ...cp }))
  };
  
  if (endpoint === 'end') {
    const lastIdx = newData.segments.length - 1;
    const lastSegment = newData.segments[lastIdx];
    
    // تحديد اتجاه الضلع الأخير
    const dx = Math.abs(lastSegment.endPoint.x - lastSegment.startPoint.x);
    const dy = Math.abs(lastSegment.endPoint.y - lastSegment.startPoint.y);
    const isVertical = dy > dx;
    
    // تحديد إذا كنا نحتاج إضافة ضلع T-connector
    let needsConnector = false;
    let connectorStart = { ...localAnchorPos };
    
    if (isVertical) {
      // ضلع عمودي
      if (anchorPoint === 'left' || anchorPoint === 'right') {
        // الاتصال بحافة جانبية - نحتاج ضلع أفقي
        needsConnector = true;
        connectorStart.x = anchorPoint === 'left' 
          ? localAnchorPos.x - connectorLength 
          : localAnchorPos.x + connectorLength;
      } else if (anchorPoint === 'top') {
        // الاتصال بالحافة العلوية من ضلع عمودي قادم من الأسفل
        needsConnector = true;
        connectorStart.y = localAnchorPos.y - connectorLength;
      }
    } else {
      // ضلع أفقي
      if (anchorPoint === 'top' || anchorPoint === 'bottom') {
        // الاتصال بحافة علوية/سفلية - نحتاج ضلع عمودي
        needsConnector = true;
        connectorStart.y = anchorPoint === 'top'
          ? localAnchorPos.y - connectorLength
          : localAnchorPos.y + connectorLength;
      } else if (anchorPoint === 'left') {
        // الاتصال بالحافة اليسرى من ضلع أفقي قادم من اليمين
        needsConnector = true;
        connectorStart.x = localAnchorPos.x - connectorLength;
      }
    }
    
    if (needsConnector) {
      // تعديل الضلع الأخير لينتهي عند بداية الموصل
      newData.segments[lastIdx] = {
        ...lastSegment,
        endPoint: connectorStart
      };
      
      // إضافة ضلع الموصل
      const connectorId = generateId();
      newData.segments.push({
        id: connectorId,
        startPoint: connectorStart,
        endPoint: localAnchorPos
      });
      
      // إضافة نقطة منتصف للموصل الجديد
      const midPos = {
        x: (connectorStart.x + localAnchorPos.x) / 2,
        y: (connectorStart.y + localAnchorPos.y) / 2
      };
      
      // إدراج نقطة المنتصف قبل نقطة النهاية
      const endCpIndex = newData.controlPoints.findIndex(cp => 
        cp.type === 'endpoint' && newData.controlPoints.indexOf(cp) === newData.controlPoints.length - 1
      );
      
      newData.controlPoints.splice(endCpIndex, 0, {
        id: generateId(),
        type: 'midpoint',
        position: midPos,
        segmentId: connectorId,
        isActive: false
      });
    }
    
    newData.endPoint = localAnchorPos;
    
    // تحديث نقطة النهاية
    const endCP = newData.controlPoints.find(cp => 
      cp.type === 'endpoint' && newData.controlPoints.indexOf(cp) === newData.controlPoints.length - 1
    );
    if (endCP) {
      endCP.position = localAnchorPos;
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
    
  } else {
    // endpoint === 'start' - منطق مماثل للبداية
    const firstSegment = newData.segments[0];
    
    const dx = Math.abs(firstSegment.endPoint.x - firstSegment.startPoint.x);
    const dy = Math.abs(firstSegment.endPoint.y - firstSegment.startPoint.y);
    const isVertical = dy > dx;
    
    let needsConnector = false;
    let connectorEnd = { ...localAnchorPos };
    
    if (isVertical) {
      if (anchorPoint === 'left' || anchorPoint === 'right') {
        needsConnector = true;
        connectorEnd.x = anchorPoint === 'left' 
          ? localAnchorPos.x - connectorLength 
          : localAnchorPos.x + connectorLength;
      } else if (anchorPoint === 'bottom') {
        needsConnector = true;
        connectorEnd.y = localAnchorPos.y + connectorLength;
      }
    } else {
      if (anchorPoint === 'top' || anchorPoint === 'bottom') {
        needsConnector = true;
        connectorEnd.y = anchorPoint === 'top'
          ? localAnchorPos.y - connectorLength
          : localAnchorPos.y + connectorLength;
      } else if (anchorPoint === 'right') {
        needsConnector = true;
        connectorEnd.x = localAnchorPos.x + connectorLength;
      }
    }
    
    if (needsConnector) {
      // تعديل الضلع الأول ليبدأ من نهاية الموصل
      newData.segments[0] = {
        ...firstSegment,
        startPoint: connectorEnd
      };
      
      // إضافة ضلع الموصل في البداية
      const connectorId = generateId();
      newData.segments.unshift({
        id: connectorId,
        startPoint: localAnchorPos,
        endPoint: connectorEnd
      });
      
      // إضافة نقطة منتصف للموصل الجديد
      const midPos = {
        x: (localAnchorPos.x + connectorEnd.x) / 2,
        y: (localAnchorPos.y + connectorEnd.y) / 2
      };
      
      // إدراج نقطة المنتصف بعد نقطة البداية
      newData.controlPoints.splice(1, 0, {
        id: generateId(),
        type: 'midpoint',
        position: midPos,
        segmentId: connectorId,
        isActive: false
      });
    }
    
    newData.startPoint = localAnchorPos;
    
    // تحديث نقطة البداية
    const startCP = newData.controlPoints.find(cp => 
      cp.type === 'endpoint' && newData.controlPoints.indexOf(cp) === 0
    );
    if (startCP) {
      startCP.position = localAnchorPos;
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
  }
  
  return newData;
};
