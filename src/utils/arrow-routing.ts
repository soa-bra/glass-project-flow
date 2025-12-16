/**
 * Arrow Routing System - نظام توجيه الأسهم المتقدم (الإصدار النهائي)
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

export type SegmentOrientation = 'horizontal' | 'vertical' | 'diagonal';
export type EdgeOrientation = 'horizontal' | 'vertical';
export type SnapEdge = 'top' | 'bottom' | 'left' | 'right';

export interface TargetElement {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface RoutingConfig {
  OFFSET_DISTANCE: number;
  CONNECTOR_LENGTH: number;
}

const DEFAULT_CONFIG: RoutingConfig = {
  OFFSET_DISTANCE: 20,
  CONNECTOR_LENGTH: 15
};

// ============= دوال المساعدة الأساسية =============

/**
 * تحديد اتجاه الضلع (أفقي أو عمودي أو مائل)
 */
export const getSegmentOrientation = (segment: ArrowSegment): SegmentOrientation => {
  const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
  const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);
  
  const tolerance = 3;
  if (dx < tolerance) return 'vertical';
  if (dy < tolerance) return 'horizontal';
  
  return 'diagonal';
};

/**
 * تحديد اتجاه حد العنصر
 */
export const getEdgeOrientation = (snapEdge: SnapEdge): EdgeOrientation => {
  return (snapEdge === 'top' || snapEdge === 'bottom') ? 'horizontal' : 'vertical';
};

/**
 * فحص التوازي بين الضلع وحد العنصر
 */
export const detectParallelSnap = (
  segment: ArrowSegment,
  snapEdge: SnapEdge
): boolean => {
  const segmentOrientation = getSegmentOrientation(segment);
  if (segmentOrientation === 'diagonal') return false;
  
  const edgeOrientation = getEdgeOrientation(snapEdge);
  return segmentOrientation === edgeOrientation;
};

/**
 * فحص إذا كان المسار يمر من داخل العنصر (تقاطع خط مع مستطيل)
 * يستخدم خوارزمية Line-Rectangle Intersection
 */
export const detectIntersection = (
  fromPoint: ArrowPoint,
  toPoint: ArrowPoint,
  targetElement: TargetElement
): boolean => {
  const { position, size } = targetElement;
  const padding = 10; // هامش حول العنصر
  
  const rect = {
    left: position.x - padding,
    top: position.y - padding,
    right: position.x + size.width + padding,
    bottom: position.y + size.height + padding
  };
  
  // ✅ فحص 1: هل النقطة الثابتة (fromPoint) داخل العنصر؟
  const fromInside = fromPoint.x >= rect.left && fromPoint.x <= rect.right && 
                     fromPoint.y >= rect.top && fromPoint.y <= rect.bottom;
  if (fromInside) return true;
  
  // ✅ فحص 2: هل الخط المستقيم يمر عبر العنصر؟
  // نفحص التقاطع مع الأربع حدود للمستطيل
  
  // فحص التقاطع مع الحد الأيسر
  if (lineIntersectsLine(fromPoint, toPoint, 
    { x: rect.left, y: rect.top }, { x: rect.left, y: rect.bottom })) return true;
  
  // فحص التقاطع مع الحد الأيمن
  if (lineIntersectsLine(fromPoint, toPoint, 
    { x: rect.right, y: rect.top }, { x: rect.right, y: rect.bottom })) return true;
  
  // فحص التقاطع مع الحد العلوي
  if (lineIntersectsLine(fromPoint, toPoint, 
    { x: rect.left, y: rect.top }, { x: rect.right, y: rect.top })) return true;
  
  // فحص التقاطع مع الحد السفلي
  if (lineIntersectsLine(fromPoint, toPoint, 
    { x: rect.left, y: rect.bottom }, { x: rect.right, y: rect.bottom })) return true;
  
  // ✅ فحص 3: هل مسار T-shape المحتمل يمر عبر العنصر؟
  // نقطة المنتصف في T-shape (حيث يلتقي الضلعان)
  const midPoint1 = { x: toPoint.x, y: fromPoint.y }; // للحدود الأفقية
  const midPoint2 = { x: fromPoint.x, y: toPoint.y }; // للحدود العمودية
  
  // فحص إذا نقطة المنتصف داخل العنصر
  const mid1Inside = midPoint1.x >= rect.left && midPoint1.x <= rect.right && 
                     midPoint1.y >= rect.top && midPoint1.y <= rect.bottom;
  const mid2Inside = midPoint2.x >= rect.left && midPoint2.x <= rect.right && 
                     midPoint2.y >= rect.top && midPoint2.y <= rect.bottom;
  
  if (mid1Inside || mid2Inside) return true;
  
  return false;
};

/**
 * فحص تقاطع خطين (Line Segment Intersection)
 * يستخدم خوارزمية CCW (Counter-Clockwise)
 */
const lineIntersectsLine = (
  p1: ArrowPoint, p2: ArrowPoint,
  p3: ArrowPoint, p4: ArrowPoint
): boolean => {
  const ccw = (A: ArrowPoint, B: ArrowPoint, C: ArrowPoint): boolean => {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  };
  
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
};

// ============= إنشاء مسار T-Shape النظيف =============

/**
 * ✅ إنشاء مسار T-shape من النقطة الثابتة إلى نقطة السناب
 * هذه الدالة هي جوهر النظام - تضمن دائماً شكل T نظيف
 */
const createOrthogonalPathWithTShape = (
  fixedPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  const edgeOrientation = getEdgeOrientation(snapEdge);
  const segments: ArrowSegment[] = [];
  
  // القاعدة: الضلع الأخير يجب أن يكون عمودي على حد العنصر (T-shape)
  // حد أفقي (top/bottom) → الضلع الأخير عمودي
  // حد عمودي (left/right) → الضلع الأخير أفقي
  
  if (edgeOrientation === 'horizontal') {
    // حد أفقي → نحتاج ضلع أفقي ثم ضلع عمودي (connector)
    // الضلع الأفقي من النقطة الثابتة إلى محاذاة X لنقطة السناب
    const horizontalSegment: ArrowSegment = {
      id: generateId(),
      startPoint: { ...fixedPoint },
      endPoint: { x: snapPoint.x, y: fixedPoint.y }
    };
    segments.push(horizontalSegment);
    
    // الضلع العمودي (T-connector) من نهاية الأفقي إلى نقطة السناب
    const verticalConnector: ArrowSegment = {
      id: generateId(),
      startPoint: { x: snapPoint.x, y: fixedPoint.y },
      endPoint: { ...snapPoint }
    };
    segments.push(verticalConnector);
    
  } else {
    // حد عمودي → نحتاج ضلع عمودي ثم ضلع أفقي (connector)
    // الضلع العمودي من النقطة الثابتة إلى محاذاة Y لنقطة السناب
    const verticalSegment: ArrowSegment = {
      id: generateId(),
      startPoint: { ...fixedPoint },
      endPoint: { x: fixedPoint.x, y: snapPoint.y }
    };
    segments.push(verticalSegment);
    
    // الضلع الأفقي (T-connector) من نهاية العمودي إلى نقطة السناب
    const horizontalConnector: ArrowSegment = {
      id: generateId(),
      startPoint: { x: fixedPoint.x, y: snapPoint.y },
      endPoint: { ...snapPoint }
    };
    segments.push(horizontalConnector);
  }
  
  return segments;
};

/**
 * ✅ إنشاء مسار U-shape للالتفاف حول العنصر
 */
const createUShapePath = (
  fixedPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  const segments: ArrowSegment[] = [];
  const offset = config.OFFSET_DISTANCE;
  const edgeOrientation = getEdgeOrientation(snapEdge);
  
  // حساب نقطة الخروج (بعيدة عن العنصر)
  let exitPoint: ArrowPoint;
  
  switch (snapEdge) {
    case 'top':
      exitPoint = { x: snapPoint.x, y: snapPoint.y - offset };
      break;
    case 'bottom':
      exitPoint = { x: snapPoint.x, y: snapPoint.y + offset };
      break;
    case 'left':
      exitPoint = { x: snapPoint.x - offset, y: snapPoint.y };
      break;
    case 'right':
      exitPoint = { x: snapPoint.x + offset, y: snapPoint.y };
      break;
  }
  
  if (edgeOrientation === 'horizontal') {
    // حد أفقي → U عمودي (3 أضلاع)
    // 1. أفقي من fixedPoint إلى محاذاة exitPoint.x
    segments.push({
      id: generateId(),
      startPoint: { ...fixedPoint },
      endPoint: { x: exitPoint.x, y: fixedPoint.y }
    });
    
    // 2. عمودي إلى exitPoint
    segments.push({
      id: generateId(),
      startPoint: { x: exitPoint.x, y: fixedPoint.y },
      endPoint: { ...exitPoint }
    });
    
    // 3. عمودي connector من exitPoint إلى snapPoint
    segments.push({
      id: generateId(),
      startPoint: { ...exitPoint },
      endPoint: { ...snapPoint }
    });
    
  } else {
    // حد عمودي → U أفقي (3 أضلاع)
    // 1. عمودي من fixedPoint إلى محاذاة exitPoint.y
    segments.push({
      id: generateId(),
      startPoint: { ...fixedPoint },
      endPoint: { x: fixedPoint.x, y: exitPoint.y }
    });
    
    // 2. أفقي إلى exitPoint
    segments.push({
      id: generateId(),
      startPoint: { x: fixedPoint.x, y: exitPoint.y },
      endPoint: { ...exitPoint }
    });
    
    // 3. أفقي connector من exitPoint إلى snapPoint
    segments.push({
      id: generateId(),
      startPoint: { ...exitPoint },
      endPoint: { ...snapPoint }
    });
  }
  
  return segments;
};

// ============= تحريك الضلع المتصل بصلابة (للحفاظ على الزوايا القائمة) =============

/**
 * ✅ تحريك نقطة طرف السهم مع الضلع المتصل بها بشكل صلب
 * هذا مهم عند تحريك العنصر المتصل - الضلع يتحرك كله ولا يُنشئ زاوية مائلة
 */
export const moveConnectedSegmentRigidly = (
  arrowData: ArrowData,
  endpoint: 'start' | 'end',
  newPosition: ArrowPoint
): ArrowData => {
  // نسخ عميق
  const newData: ArrowData = {
    ...arrowData,
    startPoint: { ...arrowData.startPoint },
    endPoint: { ...arrowData.endPoint },
    segments: arrowData.segments.map(s => ({
      ...s,
      startPoint: { ...s.startPoint },
      endPoint: { ...s.endPoint }
    })),
    controlPoints: arrowData.controlPoints.map(cp => ({
      ...cp,
      position: { ...cp.position }
    }))
  };
  
  const isStraight = newData.arrowType === 'straight' || newData.segments.length <= 1;
  
  if (isStraight) {
    // سهم مستقيم - تحريك بسيط
    if (endpoint === 'start') {
      newData.startPoint = { ...newPosition };
      if (newData.segments.length > 0) {
        newData.segments[0].startPoint = { ...newPosition };
      }
    } else {
      newData.endPoint = { ...newPosition };
      if (newData.segments.length > 0) {
        newData.segments[newData.segments.length - 1].endPoint = { ...newPosition };
      }
    }
  } else {
    // سهم متعامد - تحريك الضلع كاملاً مع الحفاظ على اتجاهه
    if (endpoint === 'start') {
      const oldStartPoint = arrowData.startPoint;
      newData.startPoint = { ...newPosition };
      
      const deltaX = newPosition.x - oldStartPoint.x;
      const deltaY = newPosition.y - oldStartPoint.y;
      
      const firstSegment = arrowData.segments[0];
      const segOrientation = getSegmentOrientation(firstSegment);
      
      if (segOrientation === 'vertical') {
        // ضلع عمودي - نحركه أفقياً بالكامل
        newData.segments[0] = {
          ...firstSegment,
          startPoint: { ...newPosition },
          endPoint: { 
            x: firstSegment.endPoint.x + deltaX, 
            y: firstSegment.endPoint.y 
          }
        };
      } else {
        // ضلع أفقي - نحركه عمودياً بالكامل
        newData.segments[0] = {
          ...firstSegment,
          startPoint: { ...newPosition },
          endPoint: { 
            x: firstSegment.endPoint.x, 
            y: firstSegment.endPoint.y + deltaY 
          }
        };
      }
      
      // تحديث الضلع التالي ليتصل
      if (newData.segments.length > 1) {
        newData.segments[1] = {
          ...newData.segments[1],
          startPoint: { ...newData.segments[0].endPoint }
        };
      }
      
    } else {
      const oldEndPoint = arrowData.endPoint;
      newData.endPoint = { ...newPosition };
      
      const deltaX = newPosition.x - oldEndPoint.x;
      const deltaY = newPosition.y - oldEndPoint.y;
      
      const lastIdx = arrowData.segments.length - 1;
      const lastSegment = arrowData.segments[lastIdx];
      const segOrientation = getSegmentOrientation(lastSegment);
      
      if (segOrientation === 'vertical') {
        // ضلع عمودي - نحركه أفقياً بالكامل
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: { 
            x: lastSegment.startPoint.x + deltaX, 
            y: lastSegment.startPoint.y 
          },
          endPoint: { ...newPosition }
        };
      } else {
        // ضلع أفقي - نحركه عمودياً بالكامل
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: { 
            x: lastSegment.startPoint.x, 
            y: lastSegment.startPoint.y + deltaY 
          },
          endPoint: { ...newPosition }
        };
      }
      
      // تحديث الضلع السابق ليتصل
      if (newData.segments.length > 1) {
        newData.segments[lastIdx - 1] = {
          ...newData.segments[lastIdx - 1],
          endPoint: { ...newData.segments[lastIdx].startPoint }
        };
      }
    }
  }
  
  // تحديث نقاط التحكم
  newData.controlPoints = rebuildControlPointsFromSegments(newData);
  
  return newData;
};

// ============= إعادة بناء نقاط التحكم =============

/**
 * ✅ إعادة بناء نقاط التحكم من الأضلاع
 */
const rebuildControlPointsFromSegments = (arrowData: ArrowData): ArrowControlPoint[] => {
  const controlPoints: ArrowControlPoint[] = [];
  
  // نقطة البداية
  const originalStartCp = arrowData.controlPoints.find(cp => 
    cp.type === 'endpoint' && arrowData.controlPoints.indexOf(cp) === 0
  );
  
  controlPoints.push({
    id: originalStartCp?.id || generateId(),
    type: 'endpoint',
    position: { ...arrowData.startPoint },
    isActive: true,
    connection: arrowData.startConnection || null
  });
  
  // نقاط منتصف لكل ضلع
  arrowData.segments.forEach((seg) => {
    const midPos = {
      x: (seg.startPoint.x + seg.endPoint.x) / 2,
      y: (seg.startPoint.y + seg.endPoint.y) / 2
    };
    
    const existingCp = arrowData.controlPoints.find(cp => cp.segmentId === seg.id);
    
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
  const originalEndCp = arrowData.controlPoints.find(cp => 
    cp.type === 'endpoint' && arrowData.controlPoints.indexOf(cp) === arrowData.controlPoints.length - 1
  );
  
  controlPoints.push({
    id: originalEndCp?.id || generateId(),
    type: 'endpoint',
    position: { ...arrowData.endPoint },
    isActive: true,
    connection: arrowData.endConnection || null
  });
  
  return controlPoints;
};

/**
 * ✅ إعادة بناء نقاط التحكم بعد تعديل الأضلاع
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
  segments.forEach((seg) => {
    const midPos = {
      x: (seg.startPoint.x + seg.endPoint.x) / 2,
      y: (seg.startPoint.y + seg.endPoint.y) / 2
    };
    
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
 * ✅ الدالة الرئيسية لحل اتصال السهم بالعنصر
 * تضمن دائماً إنشاء مسار T-shape أو U-shape نظيف
 */
export const resolveSnapConnection = (
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: TargetElement,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowData => {
  // ✅ الخطوة 1: تحديد النقطة الثابتة (الطرف الآخر للسهم)
  const fixedPoint = endpointType === 'start' 
    ? { ...arrowData.endPoint }
    : { ...arrowData.startPoint };
  
  // ✅ الخطوة 2: فحص إذا كان المسار يمر من داخل العنصر (يحتاج U-shape)
  const needsUShape = detectIntersection(fixedPoint, snapPoint, targetElement);
  
  // ✅ الخطوة 3: إنشاء المسار المناسب
  let newSegments: ArrowSegment[];
  
  if (needsUShape) {
    console.log('[Arrow Routing] Creating U-Shape path');
    newSegments = createUShapePath(fixedPoint, snapPoint, snapEdge, config);
  } else {
    console.log('[Arrow Routing] Creating T-Shape path');
    newSegments = createOrthogonalPathWithTShape(fixedPoint, snapPoint, snapEdge, config);
  }
  
  // ✅ الخطوة 4: عكس المسار إذا كان الاتصال من البداية
  if (endpointType === 'start') {
    newSegments = newSegments.map(seg => ({
      ...seg,
      startPoint: { ...seg.endPoint },
      endPoint: { ...seg.startPoint }
    })).reverse();
  }
  
  // ✅ الخطوة 5: تحديث النقاط
  const newStartPoint = newSegments.length > 0 ? { ...newSegments[0].startPoint } : arrowData.startPoint;
  const newEndPoint = newSegments.length > 0 ? { ...newSegments[newSegments.length - 1].endPoint } : arrowData.endPoint;
  
  // ✅ الخطوة 6: تحديث الاتصالات
  const newStartConnection = endpointType === 'start' 
    ? { elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection
    : arrowData.startConnection;
  
  const newEndConnection = endpointType === 'end' 
    ? { elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection
    : arrowData.endConnection;
  
  // ✅ الخطوة 7: إنشاء ArrowData جديد
  const newArrowData: ArrowData = {
    ...arrowData,
    startPoint: newStartPoint,
    endPoint: newEndPoint,
    segments: newSegments,
    startConnection: newStartConnection,
    endConnection: newEndConnection,
    arrowType: 'orthogonal'
  };
  
  // ✅ الخطوة 8: إعادة بناء نقاط التحكم
  newArrowData.controlPoints = rebuildControlPoints(newSegments, newArrowData);
  
  console.log('[Arrow Routing] Result:', {
    type: needsUShape ? 'U-Shape' : 'T-Shape',
    segmentsCount: newSegments.length,
    snapEdge,
    endpointType
  });
  
  return newArrowData;
};

/**
 * ✅ تحديث اتصال السهم عند تحريك العنصر المتصل
 * هذه الدالة تُستخدم في canvasStore عند تحريك العناصر
 */
export const updateConnectionOnElementMove = (
  arrowData: ArrowData,
  movedElement: TargetElement,
  newAnchorPosition: ArrowPoint,
  connectionType: 'start' | 'end'
): ArrowData => {
  const connection = connectionType === 'start' 
    ? arrowData.startConnection 
    : arrowData.endConnection;
  
  if (!connection || connection.elementId !== movedElement.id) {
    return arrowData;
  }
  
  const snapEdge = connection.anchorPoint as SnapEdge;
  
  // استخدام resolveSnapConnection لضمان T-shape
  return resolveSnapConnection(
    arrowData,
    newAnchorPosition,
    snapEdge,
    movedElement,
    connectionType
  );
};
