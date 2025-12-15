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
    
    // نقطة منتصف الضلع - الضلع الأوسط يكون مفعّلاً (لأنه الذي تم سحبه)
    const isMiddleSegment = i === 1;
    const midPoint: ArrowPoint = {
      x: (pathPoints[i].x + pathPoints[i + 1].x) / 2,
      y: (pathPoints[i].y + pathPoints[i + 1].y) / 2
    };
    controlPoints.push({
      id: generateId(),
      type: 'midpoint',
      position: midPoint,
      segmentId: segId,
      isActive: isMiddleSegment // الضلع الأوسط مفعّل، الباقي غير مفعّل
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
 * تفعيل نقطة منتصف وتحويلها لمسار متعامد جديد
 */
export const activateMidpointAndExpand = (
  arrowData: ArrowData,
  midpointId: string,
  newPosition: ArrowPoint,
  dragDirection: 'horizontal' | 'vertical'
): ArrowData => {
  // العثور على نقطة المنتصف والضلع المرتبط
  const midpoint = arrowData.controlPoints.find(cp => cp.id === midpointId);
  if (!midpoint || midpoint.type !== 'midpoint' || !midpoint.segmentId) {
    return arrowData;
  }
  
  const segmentIndex = arrowData.segments.findIndex(s => s.id === midpoint.segmentId);
  if (segmentIndex === -1) {
    return arrowData;
  }
  
  const segment = arrowData.segments[segmentIndex];
  
  // إنشاء 3 أضلاع جديدة بدلاً من الضلع الواحد
  let newPathPoints: ArrowPoint[];
  
  if (dragDirection === 'vertical') {
    newPathPoints = [
      segment.startPoint,
      { x: segment.startPoint.x, y: newPosition.y },
      { x: segment.endPoint.x, y: newPosition.y },
      segment.endPoint
    ];
  } else {
    newPathPoints = [
      segment.startPoint,
      { x: newPosition.x, y: segment.startPoint.y },
      { x: newPosition.x, y: segment.endPoint.y },
      segment.endPoint
    ];
  }
  
  // إنشاء الأضلاع الجديدة
  const newSegments: ArrowSegment[] = [];
  const newMidpoints: ArrowControlPoint[] = [];
  
  for (let i = 0; i < newPathPoints.length - 1; i++) {
    const segId = generateId();
    newSegments.push({
      id: segId,
      startPoint: newPathPoints[i],
      endPoint: newPathPoints[i + 1]
    });
    
    // نقطة المنتصف - الضلع الأوسط مفعّل
    const isMiddleSegment = i === 1;
    const midPos: ArrowPoint = {
      x: (newPathPoints[i].x + newPathPoints[i + 1].x) / 2,
      y: (newPathPoints[i].y + newPathPoints[i + 1].y) / 2
    };
    newMidpoints.push({
      id: generateId(),
      type: 'midpoint',
      position: midPos,
      segmentId: segId,
      isActive: isMiddleSegment
    });
  }
  
  // استبدال الضلع القديم بالأضلاع الجديدة
  const updatedSegments = [
    ...arrowData.segments.slice(0, segmentIndex),
    ...newSegments,
    ...arrowData.segments.slice(segmentIndex + 1)
  ];
  
  // تحديث نقاط التحكم
  const updatedControlPoints = arrowData.controlPoints.filter(cp => cp.id !== midpointId);
  
  // إضافة نقاط المنتصف الجديدة في المكان الصحيح
  const insertIndex = updatedControlPoints.findIndex(cp => 
    cp.type === 'midpoint' && 
    arrowData.segments.findIndex(s => s.id === cp.segmentId) > segmentIndex
  );
  
  if (insertIndex === -1) {
    updatedControlPoints.push(...newMidpoints);
  } else {
    updatedControlPoints.splice(insertIndex, 0, ...newMidpoints);
  }
  
  return {
    ...arrowData,
    segments: updatedSegments,
    controlPoints: updatedControlPoints,
    arrowType: 'orthogonal'
  };
};

/**
 * تحديث موقع نقطة نهاية (مع تحديث الأضلاع المتصلة بحركة أفقية/عمودية فقط)
 */
export const updateEndpointPosition = (
  arrowData: ArrowData,
  endpointType: 'start' | 'end',
  newPosition: ArrowPoint,
  connection: ArrowConnection | null
): ArrowData => {
  const newData = { ...arrowData };
  newData.segments = [...arrowData.segments];
  newData.controlPoints = [...arrowData.controlPoints];
  
  if (endpointType === 'start') {
    const oldPosition = newData.startPoint;
    newData.startPoint = newPosition;
    newData.startConnection = connection;
    
    // تحديث أول ضلع - يتحرك بالكامل مع نقطة البداية
    if (newData.segments.length > 0) {
      const firstSegment = newData.segments[0];
      const deltaX = newPosition.x - oldPosition.x;
      const deltaY = newPosition.y - oldPosition.y;
      
      // تحديد هل الضلع أفقي أو عمودي
      const isHorizontal = Math.abs(firstSegment.endPoint.y - firstSegment.startPoint.y) < 1;
      const isVertical = Math.abs(firstSegment.endPoint.x - firstSegment.startPoint.x) < 1;
      
      if (isHorizontal) {
        // الضلع أفقي: تحريك نقطة البداية وتحديث Y لنقطة النهاية
        newData.segments[0] = {
          ...firstSegment,
          startPoint: newPosition,
          endPoint: { x: firstSegment.endPoint.x, y: newPosition.y }
        };
        
        // تحديث الضلع التالي إذا وجد
        if (newData.segments.length > 1) {
          newData.segments[1] = {
            ...newData.segments[1],
            startPoint: { x: newData.segments[1].startPoint.x, y: newPosition.y }
          };
        }
      } else if (isVertical) {
        // الضلع عمودي: تحريك نقطة البداية وتحديث X لنقطة النهاية
        newData.segments[0] = {
          ...firstSegment,
          startPoint: newPosition,
          endPoint: { x: newPosition.x, y: firstSegment.endPoint.y }
        };
        
        // تحديث الضلع التالي إذا وجد
        if (newData.segments.length > 1) {
          newData.segments[1] = {
            ...newData.segments[1],
            startPoint: { x: newPosition.x, y: newData.segments[1].startPoint.y }
          };
        }
      } else {
        // السهم المستقيم: تحديث نقطة البداية فقط
        newData.segments[0] = {
          ...firstSegment,
          startPoint: newPosition
        };
      }
    }
    
    // تحديث نقطة البداية في controlPoints
    newData.controlPoints = newData.controlPoints.map((cp, idx) => {
      if (cp.type === 'endpoint' && idx === 0) {
        return { ...cp, position: newPosition, connection };
      }
      return cp;
    });
    
  } else {
    const oldPosition = newData.endPoint;
    newData.endPoint = newPosition;
    newData.endConnection = connection;
    
    // تحديث آخر ضلع - يتحرك بالكامل مع نقطة النهاية
    if (newData.segments.length > 0) {
      const lastIdx = newData.segments.length - 1;
      const lastSegment = newData.segments[lastIdx];
      
      // تحديد هل الضلع أفقي أو عمودي
      const isHorizontal = Math.abs(lastSegment.endPoint.y - lastSegment.startPoint.y) < 1;
      const isVertical = Math.abs(lastSegment.endPoint.x - lastSegment.startPoint.x) < 1;
      
      if (isHorizontal) {
        // الضلع أفقي: تحريك نقطة النهاية وتحديث Y لنقطة البداية
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: { x: lastSegment.startPoint.x, y: newPosition.y },
          endPoint: newPosition
        };
        
        // تحديث الضلع السابق إذا وجد
        if (lastIdx > 0) {
          newData.segments[lastIdx - 1] = {
            ...newData.segments[lastIdx - 1],
            endPoint: { x: newData.segments[lastIdx - 1].endPoint.x, y: newPosition.y }
          };
        }
      } else if (isVertical) {
        // الضلع عمودي: تحريك نقطة النهاية وتحديث X لنقطة البداية
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: { x: newPosition.x, y: lastSegment.startPoint.y },
          endPoint: newPosition
        };
        
        // تحديث الضلع السابق إذا وجد
        if (lastIdx > 0) {
          newData.segments[lastIdx - 1] = {
            ...newData.segments[lastIdx - 1],
            endPoint: { x: newPosition.x, y: newData.segments[lastIdx - 1].endPoint.y }
          };
        }
      } else {
        // السهم المستقيم: تحديث نقطة النهاية فقط
        newData.segments[lastIdx] = {
          ...lastSegment,
          endPoint: newPosition
        };
      }
    }
    
    // تحديث نقطة النهاية في controlPoints
    const endpoints = newData.controlPoints.filter(cp => cp.type === 'endpoint');
    const endPointIdx = newData.controlPoints.findIndex(cp => 
      cp.type === 'endpoint' && cp === endpoints[endpoints.length - 1]
    );
    if (endPointIdx !== -1) {
      newData.controlPoints[endPointIdx] = { 
        ...newData.controlPoints[endPointIdx], 
        position: newPosition, 
        connection 
      };
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
