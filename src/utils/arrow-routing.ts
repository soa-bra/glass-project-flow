/**
 * Arrow Routing System - نظام توجيه الأسهم المتقدم
 * يضمن أن جميع اتصالات الأسهم بالعناصر تنتهي بشكل T نظيف
 * 
 * المبدأ الذهبي (Rule Zero):
 * - أي اتصال بين طرف سهم وعنصر لازم ينتهي دائمًا بشكل حرف T
 * - ممنوع: اتصال موازي، اتصال من داخل العنصر، زاوية مائلة
 */

import type { 
  ArrowPoint, 
  ArrowData, 
  ArrowSegment, 
  ArrowControlPoint,
  ArrowConnection 
} from '@/types/arrow-connections';
import { generateId } from '@/types/arrow-connections';

// ============= الأنواع والتعريفات =============

export type SegmentOrientation = 'horizontal' | 'vertical';
export type EdgeOrientation = 'horizontal' | 'vertical';
export type SnapEdge = 'top' | 'bottom' | 'left' | 'right';

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface ConnectionAnalysis {
  isParallel: boolean;
  pathIntersectsShape: boolean;
  segmentOrientation: SegmentOrientation;
  edgeOrientation: EdgeOrientation;
  snapEdge: SnapEdge;
}

export interface RoutingConfig {
  OFFSET_DISTANCE: number;
  EXTENSION_DISTANCE: number;
}

const DEFAULT_CONFIG: RoutingConfig = {
  OFFSET_DISTANCE: 10,
  EXTENSION_DISTANCE: 10
};

// ============= دوال المساعدة =============

/**
 * تحديد اتجاه الضلع (أفقي أو عمودي)
 */
export const getSegmentOrientation = (segment: ArrowSegment): SegmentOrientation => {
  const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
  const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);
  return dy > dx ? 'vertical' : 'horizontal';
};

/**
 * تحديد اتجاه حد العنصر
 * - أعلى/أسفل = حد أفقي (horizontal edge)
 * - يمين/يسار = حد عمودي (vertical edge)
 */
export const getEdgeOrientation = (snapEdge: SnapEdge): EdgeOrientation => {
  return (snapEdge === 'top' || snapEdge === 'bottom') ? 'horizontal' : 'vertical';
};

/**
 * فحص التوازي بين الضلع وحد العنصر
 * التوازي = اتجاه الضلع يساوي اتجاه الحد
 */
export const detectParallelSnap = (
  segment: ArrowSegment,
  snapEdge: SnapEdge
): boolean => {
  const segmentOrientation = getSegmentOrientation(segment);
  const edgeOrientation = getEdgeOrientation(snapEdge);
  
  // التوازي: ضلع عمودي + حد عمودي، أو ضلع أفقي + حد أفقي
  return segmentOrientation === edgeOrientation;
};

/**
 * فحص إذا كان المسار من نقطة الضلع إلى نقطة السناب يمر من داخل العنصر
 */
export const detectIntersection = (
  segmentEndpoint: ArrowPoint,
  snapPoint: ArrowPoint,
  targetElement: TargetElement
): boolean => {
  const { position, size } = targetElement;
  const rect = {
    left: position.x,
    top: position.y,
    right: position.x + size.width,
    bottom: position.y + size.height
  };
  
  // نقاط الخط من الضلع إلى السناب
  const x1 = segmentEndpoint.x;
  const y1 = segmentEndpoint.y;
  const x2 = snapPoint.x;
  const y2 = snapPoint.y;
  
  // فحص إذا كان الخط يتقاطع مع المستطيل
  // باستخدام خوارزمية Cohen-Sutherland مبسطة
  
  // نقطة البداية داخل المستطيل؟
  const startInside = x1 >= rect.left && x1 <= rect.right && 
                      y1 >= rect.top && y1 <= rect.bottom;
  
  // إذا كانت نقطة البداية داخل المستطيل، فالمسار يمر من الداخل
  if (startInside) return true;
  
  // فحص التقاطع مع كل حد من حدود المستطيل
  const intersectsTop = lineIntersectsSegment(x1, y1, x2, y2, rect.left, rect.top, rect.right, rect.top);
  const intersectsBottom = lineIntersectsSegment(x1, y1, x2, y2, rect.left, rect.bottom, rect.right, rect.bottom);
  const intersectsLeft = lineIntersectsSegment(x1, y1, x2, y2, rect.left, rect.top, rect.left, rect.bottom);
  const intersectsRight = lineIntersectsSegment(x1, y1, x2, y2, rect.right, rect.top, rect.right, rect.bottom);
  
  // استثناء: إذا كان التقاطع فقط مع الحد الذي عليه نقطة السناب، فهو اتصال طبيعي
  const snapOnTop = snapPoint.y === rect.top;
  const snapOnBottom = snapPoint.y === rect.bottom;
  const snapOnLeft = snapPoint.x === rect.left;
  const snapOnRight = snapPoint.x === rect.right;
  
  let intersectionCount = 0;
  if (intersectsTop && !snapOnTop) intersectionCount++;
  if (intersectsBottom && !snapOnBottom) intersectionCount++;
  if (intersectsLeft && !snapOnLeft) intersectionCount++;
  if (intersectsRight && !snapOnRight) intersectionCount++;
  
  return intersectionCount > 0;
};

/**
 * فحص تقاطع خطين
 */
const lineIntersectsSegment = (
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): boolean => {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < 0.0001) return false; // خطوط متوازية
  
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
};

/**
 * حساب اتجاه الإزاحة للخارج (بعيداً عن العنصر)
 */
const getOffsetDirection = (
  snapEdge: SnapEdge,
  snapPoint: ArrowPoint,
  targetElement: TargetElement
): { dx: number; dy: number } => {
  const center = {
    x: targetElement.position.x + targetElement.size.width / 2,
    y: targetElement.position.y + targetElement.size.height / 2
  };
  
  switch (snapEdge) {
    case 'top':
      return { dx: 0, dy: -1 }; // للأعلى (خارج العنصر)
    case 'bottom':
      return { dx: 0, dy: 1 };  // للأسفل
    case 'left':
      return { dx: -1, dy: 0 }; // لليسار
    case 'right':
      return { dx: 1, dy: 0 };  // لليمين
    default:
      return { dx: 0, dy: 0 };
  }
};

// ============= دوال حل الاتصال =============

/**
 * حل اتصال T (للتوازي)
 * الضلع موازي للحد → نزيحه ونضيف ضلع عمودي
 */
export const resolveTConnection = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  const newSegments = segments.map(s => ({ 
    ...s, 
    startPoint: { ...s.startPoint }, 
    endPoint: { ...s.endPoint } 
  }));
  
  const segmentIndex = endpointType === 'start' ? 0 : newSegments.length - 1;
  const segment = newSegments[segmentIndex];
  const segmentOrientation = getSegmentOrientation(segment);
  
  // حساب اتجاه الإزاحة
  const edgeOrientation = getEdgeOrientation(snapEdge);
  
  if (segmentOrientation === 'vertical') {
    // ضلع عمودي موازي لحد عمودي (يسار/يمين)
    // → إزاحة الضلع أفقياً + إضافة ضلع أفقي
    const offsetX = (snapEdge === 'left') ? -config.OFFSET_DISTANCE : config.OFFSET_DISTANCE;
    
    if (endpointType === 'start') {
      // إزاحة بداية الضلع
      const newStartX = segment.startPoint.x + offsetX;
      segment.startPoint = { x: newStartX, y: segment.startPoint.y };
      
      // إضافة ضلع أفقي جديد في البداية
      const connectorSegment: ArrowSegment = {
        id: generateId(),
        startPoint: { ...snapPoint },
        endPoint: { x: newStartX, y: snapPoint.y }
      };
      
      // تحديث الضلع الأصلي ليبدأ من نهاية الرابط
      segment.startPoint = { x: newStartX, y: snapPoint.y };
      
      newSegments.splice(0, 0, connectorSegment);
    } else {
      // إزاحة نهاية الضلع
      const newEndX = segment.endPoint.x + offsetX;
      segment.endPoint = { x: newEndX, y: segment.endPoint.y };
      
      // إضافة ضلع أفقي جديد في النهاية
      const connectorSegment: ArrowSegment = {
        id: generateId(),
        startPoint: { x: newEndX, y: snapPoint.y },
        endPoint: { ...snapPoint }
      };
      
      // تحديث الضلع الأصلي لينتهي قبل الرابط
      segment.endPoint = { x: newEndX, y: snapPoint.y };
      
      newSegments.push(connectorSegment);
    }
  } else {
    // ضلع أفقي موازي لحد أفقي (أعلى/أسفل)
    // → إزاحة الضلع عمودياً + إضافة ضلع عمودي
    const offsetY = (snapEdge === 'top') ? -config.OFFSET_DISTANCE : config.OFFSET_DISTANCE;
    
    if (endpointType === 'start') {
      const newStartY = segment.startPoint.y + offsetY;
      segment.startPoint = { x: segment.startPoint.x, y: newStartY };
      
      const connectorSegment: ArrowSegment = {
        id: generateId(),
        startPoint: { ...snapPoint },
        endPoint: { x: snapPoint.x, y: newStartY }
      };
      
      segment.startPoint = { x: snapPoint.x, y: newStartY };
      
      newSegments.splice(0, 0, connectorSegment);
    } else {
      const newEndY = segment.endPoint.y + offsetY;
      segment.endPoint = { x: segment.endPoint.x, y: newEndY };
      
      const connectorSegment: ArrowSegment = {
        id: generateId(),
        startPoint: { x: snapPoint.x, y: newEndY },
        endPoint: { ...snapPoint }
      };
      
      segment.endPoint = { x: snapPoint.x, y: newEndY };
      
      newSegments.push(connectorSegment);
    }
  }
  
  return newSegments;
};

/**
 * حل اتصال U (للتقاطع مع العنصر)
 * المسار يمر من داخل العنصر → مناورة U كاملة
 */
export const resolveUConnection = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: 'start' | 'end',
  targetElement: TargetElement,
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  const newSegments = segments.map(s => ({ 
    ...s, 
    startPoint: { ...s.startPoint }, 
    endPoint: { ...s.endPoint } 
  }));
  
  const segmentIndex = endpointType === 'start' ? 0 : newSegments.length - 1;
  const segment = newSegments[segmentIndex];
  const segmentOrientation = getSegmentOrientation(segment);
  
  // حساب اتجاه الإزاحة للخارج
  const { dx: offsetDirX, dy: offsetDirY } = getOffsetDirection(snapEdge, snapPoint, targetElement);
  
  // حساب حدود العنصر
  const elementBounds = {
    left: targetElement.position.x,
    top: targetElement.position.y,
    right: targetElement.position.x + targetElement.size.width,
    bottom: targetElement.position.y + targetElement.size.height
  };
  
  if (segmentOrientation === 'vertical') {
    // ضلع عمودي
    // 1. إزاحة الضلع A أفقياً
    // 2. تمديد الضلع A عمودياً للخارج
    // 3. إنشاء ضلعين جديدين للوصول لنقطة السناب
    
    const offsetX = (snapEdge === 'left' || snapEdge === 'right') 
      ? offsetDirX * config.OFFSET_DISTANCE 
      : config.OFFSET_DISTANCE;
    
    if (endpointType === 'start') {
      const newX = segment.startPoint.x + offsetX;
      
      // تمديد الضلع للأعلى أو الأسفل حسب موقع السناب
      const extendY = (snapPoint.y < segment.startPoint.y) 
        ? snapPoint.y - config.EXTENSION_DISTANCE 
        : snapPoint.y + config.EXTENSION_DISTANCE;
      
      // ضلع B: من نقطة السناب لأعلى/لأسفل
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: { ...snapPoint },
        endPoint: { x: snapPoint.x, y: extendY }
      };
      
      // ضلع C: أفقي يربط بين B والضلع الأصلي
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: { x: snapPoint.x, y: extendY },
        endPoint: { x: newX, y: extendY }
      };
      
      // تحديث الضلع الأصلي
      segment.startPoint = { x: newX, y: extendY };
      
      newSegments.splice(0, 0, segmentB, segmentC);
    } else {
      const newX = segment.endPoint.x + offsetX;
      const extendY = (snapPoint.y < segment.endPoint.y) 
        ? snapPoint.y - config.EXTENSION_DISTANCE 
        : snapPoint.y + config.EXTENSION_DISTANCE;
      
      // تحديث الضلع الأصلي
      segment.endPoint = { x: newX, y: extendY };
      
      // ضلع C: أفقي
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: { x: newX, y: extendY },
        endPoint: { x: snapPoint.x, y: extendY }
      };
      
      // ضلع B: عمودي للسناب
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: { x: snapPoint.x, y: extendY },
        endPoint: { ...snapPoint }
      };
      
      newSegments.push(segmentC, segmentB);
    }
  } else {
    // ضلع أفقي
    const offsetY = (snapEdge === 'top' || snapEdge === 'bottom') 
      ? offsetDirY * config.OFFSET_DISTANCE 
      : config.OFFSET_DISTANCE;
    
    if (endpointType === 'start') {
      const newY = segment.startPoint.y + offsetY;
      
      const extendX = (snapPoint.x < segment.startPoint.x) 
        ? snapPoint.x - config.EXTENSION_DISTANCE 
        : snapPoint.x + config.EXTENSION_DISTANCE;
      
      // ضلع B: من نقطة السناب أفقياً
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: { ...snapPoint },
        endPoint: { x: extendX, y: snapPoint.y }
      };
      
      // ضلع C: عمودي
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: { x: extendX, y: snapPoint.y },
        endPoint: { x: extendX, y: newY }
      };
      
      segment.startPoint = { x: extendX, y: newY };
      
      newSegments.splice(0, 0, segmentB, segmentC);
    } else {
      const newY = segment.endPoint.y + offsetY;
      
      const extendX = (snapPoint.x < segment.endPoint.x) 
        ? snapPoint.x - config.EXTENSION_DISTANCE 
        : snapPoint.x + config.EXTENSION_DISTANCE;
      
      segment.endPoint = { x: extendX, y: newY };
      
      const segmentC: ArrowSegment = {
        id: generateId(),
        startPoint: { x: extendX, y: newY },
        endPoint: { x: extendX, y: snapPoint.y }
      };
      
      const segmentB: ArrowSegment = {
        id: generateId(),
        startPoint: { x: extendX, y: snapPoint.y },
        endPoint: { ...snapPoint }
      };
      
      newSegments.push(segmentC, segmentB);
    }
  }
  
  return newSegments;
};

/**
 * الاتصال المباشر (عندما لا يوجد توازي أو تقاطع)
 * يضيف ضلع T-shape بسيط للوصول للسناب بزاوية قائمة
 */
export const connectDirectly = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  const newSegments = segments.map(s => ({ 
    ...s, 
    startPoint: { ...s.startPoint }, 
    endPoint: { ...s.endPoint } 
  }));
  
  const segmentIndex = endpointType === 'start' ? 0 : newSegments.length - 1;
  const segment = newSegments[segmentIndex];
  const segmentOrientation = getSegmentOrientation(segment);
  const edgeOrientation = getEdgeOrientation(snapEdge);
  
  // إذا كان الضلع عمودي والحد أفقي، أو العكس → T-shape مباشر
  if (segmentOrientation !== edgeOrientation) {
    // إضافة ضلع رابط قصير (8px) لإنشاء T-shape
    const connectorLength = 8;
    
    if (endpointType === 'start') {
      if (edgeOrientation === 'horizontal') {
        // حد أفقي (top/bottom) + ضلع عمودي
        const connectorEndY = (snapEdge === 'top') 
          ? snapPoint.y - connectorLength 
          : snapPoint.y + connectorLength;
        
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { ...snapPoint },
          endPoint: { x: snapPoint.x, y: connectorEndY }
        };
        
        // تحديث الضلع الأصلي
        segment.startPoint = { x: snapPoint.x, y: connectorEndY };
        
        newSegments.splice(0, 0, connector);
      } else {
        // حد عمودي (left/right) + ضلع أفقي
        const connectorEndX = (snapEdge === 'left') 
          ? snapPoint.x - connectorLength 
          : snapPoint.x + connectorLength;
        
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { ...snapPoint },
          endPoint: { x: connectorEndX, y: snapPoint.y }
        };
        
        segment.startPoint = { x: connectorEndX, y: snapPoint.y };
        
        newSegments.splice(0, 0, connector);
      }
    } else {
      if (edgeOrientation === 'horizontal') {
        const connectorStartY = (snapEdge === 'top') 
          ? snapPoint.y - connectorLength 
          : snapPoint.y + connectorLength;
        
        segment.endPoint = { x: snapPoint.x, y: connectorStartY };
        
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { x: snapPoint.x, y: connectorStartY },
          endPoint: { ...snapPoint }
        };
        
        newSegments.push(connector);
      } else {
        const connectorStartX = (snapEdge === 'left') 
          ? snapPoint.x - connectorLength 
          : snapPoint.x + connectorLength;
        
        segment.endPoint = { x: connectorStartX, y: snapPoint.y };
        
        const connector: ArrowSegment = {
          id: generateId(),
          startPoint: { x: connectorStartX, y: snapPoint.y },
          endPoint: { ...snapPoint }
        };
        
        newSegments.push(connector);
      }
    }
  } else {
    // نفس الاتجاه → نحتاج T-shape
    return resolveTConnection(segments, snapPoint, snapEdge, endpointType, config);
  }
  
  return newSegments;
};

/**
 * إعادة بناء نقاط التحكم بعد تعديل الأضلاع
 */
export const rebuildControlPoints = (
  segments: ArrowSegment[],
  originalArrowData: ArrowData
): ArrowControlPoint[] => {
  const controlPoints: ArrowControlPoint[] = [];
  
  // نقطة البداية
  const startPoint = segments.length > 0 ? segments[0].startPoint : originalArrowData.startPoint;
  const originalStartCp = originalArrowData.controlPoints.find(cp => 
    cp.type === 'endpoint' && originalArrowData.controlPoints.indexOf(cp) === 0
  );
  
  controlPoints.push({
    id: originalStartCp?.id || generateId(),
    type: 'endpoint',
    position: { ...startPoint },
    isActive: true,
    connection: originalArrowData.startConnection || null
  });
  
  // نقاط منتصف لكل ضلع
  segments.forEach((seg, idx) => {
    const midPos = {
      x: (seg.startPoint.x + seg.endPoint.x) / 2,
      y: (seg.startPoint.y + seg.endPoint.y) / 2
    };
    
    // البحث عن نقطة تحكم موجودة لهذا الضلع
    const existingCp = originalArrowData.controlPoints.find(cp => cp.segmentId === seg.id);
    
    controlPoints.push({
      id: existingCp?.id || generateId(),
      type: 'midpoint',
      position: midPos,
      isActive: existingCp?.isActive ?? false,
      segmentId: seg.id,
      label: existingCp?.label
    });
  });
  
  // نقطة النهاية
  const endPoint = segments.length > 0 ? segments[segments.length - 1].endPoint : originalArrowData.endPoint;
  const originalEndCp = originalArrowData.controlPoints.find(cp => 
    cp.type === 'endpoint' && originalArrowData.controlPoints.indexOf(cp) === originalArrowData.controlPoints.length - 1
  );
  
  controlPoints.push({
    id: originalEndCp?.id || generateId(),
    type: 'endpoint',
    position: { ...endPoint },
    isActive: true,
    connection: originalArrowData.endConnection || null
  });
  
  return controlPoints;
};

// ============= الدالة الرئيسية للتوجيه =============

/**
 * الدالة الرئيسية لحل اتصال السهم بالعنصر
 * تضمن دائماً شكل T نظيف
 */
export const resolveSnapConnection = (
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: TargetElement,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowData => {
  // نسخ البيانات
  const currentSegments = arrowData.segments.map(s => ({ 
    ...s, 
    startPoint: { ...s.startPoint }, 
    endPoint: { ...s.endPoint } 
  }));
  
  // تحديد الضلع المتصل
  const connectedSegmentIdx = endpointType === 'start' ? 0 : currentSegments.length - 1;
  const connectedSegment = currentSegments[connectedSegmentIdx];
  
  if (!connectedSegment) {
    // لا يوجد أضلاع - إرجاع البيانات كما هي
    return arrowData;
  }
  
  // تحليل نوع الاتصال
  const isParallel = detectParallelSnap(connectedSegment, snapEdge);
  
  const segmentEndpoint = endpointType === 'start' 
    ? connectedSegment.startPoint 
    : connectedSegment.endPoint;
  
  const intersectsShape = detectIntersection(segmentEndpoint, snapPoint, targetElement);
  
  let newSegments: ArrowSegment[];
  
  if (isParallel) {
    // حالة التوازي → T-shape
    console.log('[Arrow Routing] Parallel detected → T-Connection');
    newSegments = resolveTConnection(currentSegments, snapPoint, snapEdge, endpointType, config);
  } else if (intersectsShape) {
    // حالة التقاطع → U-shape
    console.log('[Arrow Routing] Intersection detected → U-Connection');
    newSegments = resolveUConnection(currentSegments, snapPoint, snapEdge, endpointType, targetElement, config);
  } else {
    // اتصال مباشر سليم → T-shape بسيط
    console.log('[Arrow Routing] Direct connection → Simple T-Shape');
    newSegments = connectDirectly(currentSegments, snapPoint, snapEdge, endpointType, config);
  }
  
  // إعادة بناء نقاط التحكم
  const newControlPoints = rebuildControlPoints(newSegments, arrowData);
  
  // تحديث نقاط البداية والنهاية
  const newStartPoint = newSegments.length > 0 ? newSegments[0].startPoint : arrowData.startPoint;
  const newEndPoint = newSegments.length > 0 ? newSegments[newSegments.length - 1].endPoint : arrowData.endPoint;
  
  // تحديث الاتصالات
  const newStartConnection = endpointType === 'start' 
    ? { elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection
    : arrowData.startConnection;
  
  const newEndConnection = endpointType === 'end' 
    ? { elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection
    : arrowData.endConnection;
  
  return {
    ...arrowData,
    startPoint: newStartPoint,
    endPoint: newEndPoint,
    segments: newSegments,
    controlPoints: newControlPoints,
    startConnection: newStartConnection,
    endConnection: newEndConnection,
    arrowType: 'orthogonal'
  };
};

/**
 * تحديث اتصال السهم عند تحريك العنصر المتصل
 * يضمن الحفاظ على شكل T عند تحريك العناصر
 */
export const updateConnectionOnElementMove = (
  arrowData: ArrowData,
  movedElement: TargetElement,
  newAnchorPosition: ArrowPoint,
  connectionType: 'start' | 'end'
): ArrowData => {
  // للحفاظ على شكل T، نعيد حساب المسار
  const connection = connectionType === 'start' 
    ? arrowData.startConnection 
    : arrowData.endConnection;
  
  if (!connection || connection.elementId !== movedElement.id) {
    return arrowData;
  }
  
  const snapEdge = connection.anchorPoint as SnapEdge;
  
  // إعادة توجيه السهم
  return resolveSnapConnection(
    arrowData,
    newAnchorPosition,
    snapEdge,
    movedElement,
    connectionType
  );
};
