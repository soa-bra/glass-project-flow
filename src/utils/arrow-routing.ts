/**
 * Arrow Routing System - نظام توجيه الأسهم المتقدم (الإصدار المُصحح)
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
  CONNECTOR_LENGTH: number;
}

const DEFAULT_CONFIG: RoutingConfig = {
  OFFSET_DISTANCE: 15,
  EXTENSION_DISTANCE: 15,
  CONNECTOR_LENGTH: 12
};

// ============= دوال المساعدة الأساسية =============

/**
 * تحديد اتجاه الضلع (أفقي أو عمودي أو مائل)
 */
export const getSegmentOrientation = (segment: ArrowSegment): SegmentOrientation => {
  const dx = Math.abs(segment.endPoint.x - segment.startPoint.x);
  const dy = Math.abs(segment.endPoint.y - segment.startPoint.y);
  
  // إذا كان الفرق صغير جداً في أحد الاتجاهات، فهو متعامد
  const tolerance = 3;
  if (dx < tolerance) return 'vertical';
  if (dy < tolerance) return 'horizontal';
  
  // مائل
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
 * فحص إذا كان المسار يمر من داخل العنصر
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
  
  const x1 = segmentEndpoint.x;
  const y1 = segmentEndpoint.y;
  
  // نقطة البداية داخل المستطيل؟
  const padding = 5;
  const startInside = x1 >= rect.left - padding && x1 <= rect.right + padding && 
                      y1 >= rect.top - padding && y1 <= rect.bottom + padding;
  
  return startInside;
};

// ============= دوال تحويل الأضلاع =============

/**
 * ✅ تحويل ضلع مائل إلى مسار متعامد (ضلعين أو ثلاثة)
 */
const ensureOrthogonalSegments = (
  segment: ArrowSegment,
  preferDirection: 'horizontal-first' | 'vertical-first' = 'horizontal-first'
): ArrowSegment[] => {
  const orientation = getSegmentOrientation(segment);
  
  // إذا كان متعامد بالفعل، نرجعه كما هو
  if (orientation !== 'diagonal') {
    return [{
      ...segment,
      startPoint: { ...segment.startPoint },
      endPoint: { ...segment.endPoint }
    }];
  }
  
  // تحويل لمسار متعامد من ضلعين
  const { startPoint, endPoint } = segment;
  
  if (preferDirection === 'horizontal-first') {
    // أفقي ثم عمودي
    const midPoint = { x: endPoint.x, y: startPoint.y };
    return [
      { id: generateId(), startPoint: { ...startPoint }, endPoint: midPoint },
      { id: generateId(), startPoint: midPoint, endPoint: { ...endPoint } }
    ];
  } else {
    // عمودي ثم أفقي
    const midPoint = { x: startPoint.x, y: endPoint.y };
    return [
      { id: generateId(), startPoint: { ...startPoint }, endPoint: midPoint },
      { id: generateId(), startPoint: midPoint, endPoint: { ...endPoint } }
    ];
  }
};

/**
 * ✅ التأكد من أن جميع الأضلاع متعامدة ومتصلة
 */
const validateAndFixSegments = (segments: ArrowSegment[]): ArrowSegment[] => {
  if (segments.length === 0) return segments;
  
  const result: ArrowSegment[] = [];
  
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    
    // تحويل الضلع المائل لمتعامد
    const orthogonalSegs = ensureOrthogonalSegments(seg);
    
    // إذا كان هناك ضلع سابق، نتأكد من اتصاله
    if (result.length > 0) {
      const lastSeg = result[result.length - 1];
      orthogonalSegs[0].startPoint = { ...lastSeg.endPoint };
    }
    
    result.push(...orthogonalSegs);
  }
  
  // التأكد من اتصال جميع الأضلاع
  for (let i = 1; i < result.length; i++) {
    result[i].startPoint = { ...result[i - 1].endPoint };
  }
  
  return result;
};

// ============= دوال إنشاء T-Shape =============

/**
 * ✅ إنشاء مسار T-shape بسيط ونظيف
 * ينشئ ضلعين: ضلع يصل لمحاذاة نقطة السناب، ثم ضلع رابط قصير للسناب
 */
const createTShapePath = (
  fromPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  config: RoutingConfig
): ArrowSegment[] => {
  const edgeOrientation = getEdgeOrientation(snapEdge);
  const segments: ArrowSegment[] = [];
  
  if (edgeOrientation === 'horizontal') {
    // حد أفقي (top/bottom) → نحتاج ضلع أفقي ثم ضلع عمودي
    // الضلع العمودي هو الـ connector الذي يتصل بالحد
    
    // الضلع الأفقي من نقطة البداية إلى محاذاة X لنقطة السناب
    const horizontalSegment: ArrowSegment = {
      id: generateId(),
      startPoint: { ...fromPoint },
      endPoint: { x: snapPoint.x, y: fromPoint.y }
    };
    segments.push(horizontalSegment);
    
    // الضلع العمودي (connector) من نهاية الأفقي إلى نقطة السناب
    const verticalConnector: ArrowSegment = {
      id: generateId(),
      startPoint: { x: snapPoint.x, y: fromPoint.y },
      endPoint: { ...snapPoint }
    };
    segments.push(verticalConnector);
    
  } else {
    // حد عمودي (left/right) → نحتاج ضلع عمودي ثم ضلع أفقي
    // الضلع الأفقي هو الـ connector الذي يتصل بالحد
    
    // الضلع العمودي من نقطة البداية إلى محاذاة Y لنقطة السناب
    const verticalSegment: ArrowSegment = {
      id: generateId(),
      startPoint: { ...fromPoint },
      endPoint: { x: fromPoint.x, y: snapPoint.y }
    };
    segments.push(verticalSegment);
    
    // الضلع الأفقي (connector) من نهاية العمودي إلى نقطة السناب
    const horizontalConnector: ArrowSegment = {
      id: generateId(),
      startPoint: { x: fromPoint.x, y: snapPoint.y },
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
  fromPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: TargetElement,
  config: RoutingConfig
): ArrowSegment[] => {
  const segments: ArrowSegment[] = [];
  const offset = config.OFFSET_DISTANCE;
  
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
  
  const edgeOrientation = getEdgeOrientation(snapEdge);
  
  if (edgeOrientation === 'horizontal') {
    // حد أفقي → U عمودي
    // 1. ضلع أفقي من fromPoint إلى محاذاة exitPoint.x
    segments.push({
      id: generateId(),
      startPoint: { ...fromPoint },
      endPoint: { x: exitPoint.x, y: fromPoint.y }
    });
    
    // 2. ضلع عمودي إلى exitPoint
    segments.push({
      id: generateId(),
      startPoint: { x: exitPoint.x, y: fromPoint.y },
      endPoint: { ...exitPoint }
    });
    
    // 3. ضلع عمودي connector من exitPoint إلى snapPoint
    segments.push({
      id: generateId(),
      startPoint: { ...exitPoint },
      endPoint: { ...snapPoint }
    });
    
  } else {
    // حد عمودي → U أفقي
    // 1. ضلع عمودي من fromPoint إلى محاذاة exitPoint.y
    segments.push({
      id: generateId(),
      startPoint: { ...fromPoint },
      endPoint: { x: fromPoint.x, y: exitPoint.y }
    });
    
    // 2. ضلع أفقي إلى exitPoint
    segments.push({
      id: generateId(),
      startPoint: { x: fromPoint.x, y: exitPoint.y },
      endPoint: { ...exitPoint }
    });
    
    // 3. ضلع أفقي connector من exitPoint إلى snapPoint
    segments.push({
      id: generateId(),
      startPoint: { ...exitPoint },
      endPoint: { ...snapPoint }
    });
  }
  
  return segments;
};

// ============= دوال حل الاتصال المحسّنة =============

/**
 * ✅ حل اتصال T (للتوازي) - محسّن
 */
export const resolveTConnection = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  if (segments.length === 0) return [];
  
  const segmentIdx = endpointType === 'start' ? 0 : segments.length - 1;
  const segment = segments[segmentIdx];
  
  // نقطة البداية للمسار الجديد
  const fromPoint = endpointType === 'start' 
    ? segment.endPoint  // نبدأ من نهاية الضلع الأول (الجهة الأخرى)
    : segment.startPoint; // نبدأ من بداية الضلع الأخير (الجهة الأخرى)
  
  // إنشاء مسار T-shape جديد
  const tShapePath = createTShapePath(fromPoint, snapPoint, snapEdge, config);
  
  // دمج المسار الجديد مع الأضلاع الموجودة
  let result: ArrowSegment[];
  
  if (endpointType === 'start') {
    // عكس المسار الجديد (لأنه يبدأ من fromPoint وينتهي بـ snapPoint)
    const reversedPath = tShapePath.map(seg => ({
      id: seg.id,
      startPoint: { ...seg.endPoint },
      endPoint: { ...seg.startPoint }
    })).reverse();
    
    // الضلع الأول من المسار الجديد يبدأ من snapPoint
    reversedPath[0].startPoint = { ...snapPoint };
    
    // ربط المسار الجديد بالأضلاع المتبقية
    if (segments.length > 1) {
      const remainingSegments = segments.slice(1);
      remainingSegments[0].startPoint = { ...reversedPath[reversedPath.length - 1].endPoint };
      result = [...reversedPath, ...remainingSegments];
    } else {
      result = reversedPath;
    }
  } else {
    // للنهاية: المسار يبدأ من fromPoint وينتهي بـ snapPoint
    if (segments.length > 1) {
      const remainingSegments = segments.slice(0, -1);
      remainingSegments[remainingSegments.length - 1].endPoint = { ...tShapePath[0].startPoint };
      result = [...remainingSegments, ...tShapePath];
    } else {
      result = tShapePath;
    }
  }
  
  return validateAndFixSegments(result);
};

/**
 * ✅ حل اتصال U (للتقاطع) - محسّن
 */
export const resolveUConnection = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: 'start' | 'end',
  targetElement: TargetElement,
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  if (segments.length === 0) return [];
  
  const segmentIdx = endpointType === 'start' ? 0 : segments.length - 1;
  const segment = segments[segmentIdx];
  
  const fromPoint = endpointType === 'start' 
    ? segment.endPoint
    : segment.startPoint;
  
  // إنشاء مسار U-shape
  const uShapePath = createUShapePath(fromPoint, snapPoint, snapEdge, targetElement, config);
  
  let result: ArrowSegment[];
  
  if (endpointType === 'start') {
    const reversedPath = uShapePath.map(seg => ({
      id: seg.id,
      startPoint: { ...seg.endPoint },
      endPoint: { ...seg.startPoint }
    })).reverse();
    
    reversedPath[0].startPoint = { ...snapPoint };
    
    if (segments.length > 1) {
      const remainingSegments = segments.slice(1);
      remainingSegments[0].startPoint = { ...reversedPath[reversedPath.length - 1].endPoint };
      result = [...reversedPath, ...remainingSegments];
    } else {
      result = reversedPath;
    }
  } else {
    if (segments.length > 1) {
      const remainingSegments = segments.slice(0, -1);
      remainingSegments[remainingSegments.length - 1].endPoint = { ...uShapePath[0].startPoint };
      result = [...remainingSegments, ...uShapePath];
    } else {
      result = uShapePath;
    }
  }
  
  return validateAndFixSegments(result);
};

/**
 * ✅ الاتصال المباشر - محسّن
 */
export const connectDirectly = (
  segments: ArrowSegment[],
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  if (segments.length === 0) return [];
  
  const segmentIdx = endpointType === 'start' ? 0 : segments.length - 1;
  const segment = segments[segmentIdx];
  const segmentOrientation = getSegmentOrientation(segment);
  const edgeOrientation = getEdgeOrientation(snapEdge);
  
  // نسخ الأضلاع
  const newSegments = segments.map(s => ({
    ...s,
    startPoint: { ...s.startPoint },
    endPoint: { ...s.endPoint }
  }));
  
  // إذا كان الضلع مائل، نحوله أولاً
  if (segmentOrientation === 'diagonal') {
    const orthogonalSegs = ensureOrthogonalSegments(segment);
    newSegments.splice(segmentIdx, 1, ...orthogonalSegs);
    
    // نعيد معالجة مع الأضلاع الجديدة
    return connectDirectly(newSegments, snapPoint, snapEdge, endpointType, config);
  }
  
  // الآن الضلع متعامد (أفقي أو عمودي)
  // إذا كان التوجه مختلف (ضلع عمودي + حد أفقي أو العكس) → T-shape بسيط
  if (segmentOrientation !== edgeOrientation) {
    // إضافة connector قصير فقط
    const connectorLength = config.CONNECTOR_LENGTH;
    
    if (endpointType === 'start') {
      // إضافة connector في البداية
      let connector: ArrowSegment;
      
      if (edgeOrientation === 'horizontal') {
        // حد أفقي → connector عمودي
        const connectorEndY = (snapEdge === 'top') 
          ? snapPoint.y - connectorLength 
          : snapPoint.y + connectorLength;
        
        connector = {
          id: generateId(),
          startPoint: { ...snapPoint },
          endPoint: { x: snapPoint.x, y: connectorEndY }
        };
        
        // تحديث الضلع الأول ليتصل بالـ connector
        newSegments[0].startPoint = { x: snapPoint.x, y: connectorEndY };
      } else {
        // حد عمودي → connector أفقي
        const connectorEndX = (snapEdge === 'left') 
          ? snapPoint.x - connectorLength 
          : snapPoint.x + connectorLength;
        
        connector = {
          id: generateId(),
          startPoint: { ...snapPoint },
          endPoint: { x: connectorEndX, y: snapPoint.y }
        };
        
        newSegments[0].startPoint = { x: connectorEndX, y: snapPoint.y };
      }
      
      newSegments.unshift(connector);
      
    } else {
      // إضافة connector في النهاية
      let connector: ArrowSegment;
      const lastIdx = newSegments.length - 1;
      
      if (edgeOrientation === 'horizontal') {
        const connectorStartY = (snapEdge === 'top') 
          ? snapPoint.y - connectorLength 
          : snapPoint.y + connectorLength;
        
        newSegments[lastIdx].endPoint = { x: snapPoint.x, y: connectorStartY };
        
        connector = {
          id: generateId(),
          startPoint: { x: snapPoint.x, y: connectorStartY },
          endPoint: { ...snapPoint }
        };
      } else {
        const connectorStartX = (snapEdge === 'left') 
          ? snapPoint.x - connectorLength 
          : snapPoint.x + connectorLength;
        
        newSegments[lastIdx].endPoint = { x: connectorStartX, y: snapPoint.y };
        
        connector = {
          id: generateId(),
          startPoint: { x: connectorStartX, y: snapPoint.y },
          endPoint: { ...snapPoint }
        };
      }
      
      newSegments.push(connector);
    }
    
    return validateAndFixSegments(newSegments);
  }
  
  // نفس الاتجاه → نحتاج T-shape كامل
  return resolveTConnection(segments, snapPoint, snapEdge, endpointType, config);
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
 * ✅ الدالة الرئيسية لحل اتصال السهم بالعنصر - مُحسّنة بالكامل
 */
export const resolveSnapConnection = (
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: TargetElement,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowData => {
  // التحقق من وجود أضلاع
  if (!arrowData.segments || arrowData.segments.length === 0) {
    console.warn('[Arrow Routing] No segments found');
    return arrowData;
  }
  
  // ✅ أولاً: تحويل أي أضلاع مائلة لمتعامدة
  const orthogonalSegments = validateAndFixSegments(
    arrowData.segments.map(s => ({
      ...s,
      startPoint: { ...s.startPoint },
      endPoint: { ...s.endPoint }
    }))
  );
  
  // تحديد الضلع المتصل
  const connectedSegmentIdx = endpointType === 'start' ? 0 : orthogonalSegments.length - 1;
  const connectedSegment = orthogonalSegments[connectedSegmentIdx];
  
  if (!connectedSegment) {
    console.warn('[Arrow Routing] No connected segment found');
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
    console.log('[Arrow Routing] Parallel → T-Connection');
    newSegments = resolveTConnection(orthogonalSegments, snapPoint, snapEdge, endpointType, config);
  } else if (intersectsShape) {
    console.log('[Arrow Routing] Intersection → U-Connection');
    newSegments = resolveUConnection(orthogonalSegments, snapPoint, snapEdge, endpointType, targetElement, config);
  } else {
    console.log('[Arrow Routing] Direct → Simple T-Shape');
    newSegments = connectDirectly(orthogonalSegments, snapPoint, snapEdge, endpointType, config);
  }
  
  // ✅ التحقق النهائي من صحة الأضلاع
  newSegments = validateAndFixSegments(newSegments);
  
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
  
  console.log('[Arrow Routing] Result:', {
    segmentsCount: newSegments.length,
    startPoint: newStartPoint,
    endPoint: newEndPoint
  });
  
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
  
  return resolveSnapConnection(
    arrowData,
    newAnchorPosition,
    snapEdge,
    movedElement,
    connectionType
  );
};
