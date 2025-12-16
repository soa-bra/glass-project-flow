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
 * هذه الدالة تضمن دائماً شكل T نظيف مع الضلع الأخير عمودي على حد العنصر
 * 
 * القواعد المستخدمة (مطابقة لـ Miro/FigJam):
 * - الضلع الأخير دائماً عمودي على حد العنصر المتصل
 * - للحدود الأفقية (top/bottom): الضلع الأخير عمودي
 * - للحدود العمودية (left/right): الضلع الأخير أفقي
 * - المسار يتكون من ضلعين أو ثلاثة حسب موقع النقطة الثابتة
 */
const createOrthogonalPathWithTShape = (
  fixedPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  const segments: ArrowSegment[] = [];
  const offset = config.OFFSET_DISTANCE;
  
  // تحديد ما إذا كانت النقطتان متقاربتان جداً في محور معين
  const dx = Math.abs(snapPoint.x - fixedPoint.x);
  const dy = Math.abs(snapPoint.y - fixedPoint.y);
  const threshold = 5;
  
  switch (snapEdge) {
    case 'top':
      // الاتصال من أعلى العنصر → الضلع الأخير عمودي من الأعلى
      if (dx < threshold) {
        // النقطتان متحاذيتان عمودياً → ضلع واحد عمودي
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { ...snapPoint }
        });
      } else if (fixedPoint.y < snapPoint.y) {
        // النقطة الثابتة أعلى من نقطة السناب → ضلعين
        // أفقي إلى محاذاة X ثم عمودي للأسفل
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: snapPoint.x, y: fixedPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: fixedPoint.y },
          endPoint: { ...snapPoint }
        });
      } else {
        // النقطة الثابتة أسفل من نقطة السناب → 3 أضلاع (L-shape مقلوب)
        // عمودي للأعلى أولاً ثم أفقي ثم عمودي للأعلى
        const midY = snapPoint.y - offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: midY }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: midY },
          endPoint: { x: snapPoint.x, y: midY }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: midY },
          endPoint: { ...snapPoint }
        });
      }
      break;
      
    case 'bottom':
      // الاتصال من أسفل العنصر → الضلع الأخير عمودي من الأسفل
      if (dx < threshold) {
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { ...snapPoint }
        });
      } else if (fixedPoint.y > snapPoint.y) {
        // النقطة الثابتة أسفل من نقطة السناب → ضلعين
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: snapPoint.x, y: fixedPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: fixedPoint.y },
          endPoint: { ...snapPoint }
        });
      } else {
        // النقطة الثابتة أعلى من نقطة السناب → 3 أضلاع
        const midY = snapPoint.y + offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: midY }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: midY },
          endPoint: { x: snapPoint.x, y: midY }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: snapPoint.x, y: midY },
          endPoint: { ...snapPoint }
        });
      }
      break;
      
    case 'left':
      // الاتصال من يسار العنصر → الضلع الأخير أفقي من اليسار
      if (dy < threshold) {
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { ...snapPoint }
        });
      } else if (fixedPoint.x < snapPoint.x) {
        // النقطة الثابتة على يسار نقطة السناب → ضلعين
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: snapPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: snapPoint.y },
          endPoint: { ...snapPoint }
        });
      } else {
        // النقطة الثابتة على يمين نقطة السناب → 3 أضلاع
        const midX = snapPoint.x - offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: midX, y: fixedPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: fixedPoint.y },
          endPoint: { x: midX, y: snapPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: snapPoint.y },
          endPoint: { ...snapPoint }
        });
      }
      break;
      
    case 'right':
      // الاتصال من يمين العنصر → الضلع الأخير أفقي من اليمين
      if (dy < threshold) {
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { ...snapPoint }
        });
      } else if (fixedPoint.x > snapPoint.x) {
        // النقطة الثابتة على يمين نقطة السناب → ضلعين
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: fixedPoint.x, y: snapPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: fixedPoint.x, y: snapPoint.y },
          endPoint: { ...snapPoint }
        });
      } else {
        // النقطة الثابتة على يسار نقطة السناب → 3 أضلاع
        const midX = snapPoint.x + offset;
        segments.push({
          id: generateId(),
          startPoint: { ...fixedPoint },
          endPoint: { x: midX, y: fixedPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: fixedPoint.y },
          endPoint: { x: midX, y: snapPoint.y }
        });
        segments.push({
          id: generateId(),
          startPoint: { x: midX, y: snapPoint.y },
          endPoint: { ...snapPoint }
        });
      }
      break;
  }
  
  return segments;
};

/**
 * ✅ إنشاء مسار U-shape للالتفاف حول العنصر
 * يُستخدم عندما يكون المسار المباشر يمر من داخل العنصر
 * 
 * المسار يتكون من 4 أضلاع:
 * 1. خروج من النقطة الثابتة
 * 2. التفاف حول العنصر (ضلع موازي للحد)
 * 3. اقتراب من الحد
 * 4. دخول إلى نقطة السناب (عمودي على الحد)
 */
const createUShapePath = (
  fixedPoint: ArrowPoint,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowSegment[] => {
  const segments: ArrowSegment[] = [];
  const offset = config.OFFSET_DISTANCE;
  
  switch (snapEdge) {
    case 'top':
      // الالتفاف للوصول إلى أعلى العنصر
      // نقطة الخروج أعلى من نقطة السناب
      const topExitY = snapPoint.y - offset;
      
      // 1. عمودي من النقطة الثابتة للأعلى
      segments.push({
        id: generateId(),
        startPoint: { ...fixedPoint },
        endPoint: { x: fixedPoint.x, y: topExitY }
      });
      
      // 2. أفقي إلى محاذاة X لنقطة السناب
      segments.push({
        id: generateId(),
        startPoint: { x: fixedPoint.x, y: topExitY },
        endPoint: { x: snapPoint.x, y: topExitY }
      });
      
      // 3. عمودي للأسفل إلى نقطة السناب
      segments.push({
        id: generateId(),
        startPoint: { x: snapPoint.x, y: topExitY },
        endPoint: { ...snapPoint }
      });
      break;
      
    case 'bottom':
      const bottomExitY = snapPoint.y + offset;
      
      segments.push({
        id: generateId(),
        startPoint: { ...fixedPoint },
        endPoint: { x: fixedPoint.x, y: bottomExitY }
      });
      
      segments.push({
        id: generateId(),
        startPoint: { x: fixedPoint.x, y: bottomExitY },
        endPoint: { x: snapPoint.x, y: bottomExitY }
      });
      
      segments.push({
        id: generateId(),
        startPoint: { x: snapPoint.x, y: bottomExitY },
        endPoint: { ...snapPoint }
      });
      break;
      
    case 'left':
      const leftExitX = snapPoint.x - offset;
      
      segments.push({
        id: generateId(),
        startPoint: { ...fixedPoint },
        endPoint: { x: leftExitX, y: fixedPoint.y }
      });
      
      segments.push({
        id: generateId(),
        startPoint: { x: leftExitX, y: fixedPoint.y },
        endPoint: { x: leftExitX, y: snapPoint.y }
      });
      
      segments.push({
        id: generateId(),
        startPoint: { x: leftExitX, y: snapPoint.y },
        endPoint: { ...snapPoint }
      });
      break;
      
    case 'right':
      const rightExitX = snapPoint.x + offset;
      
      segments.push({
        id: generateId(),
        startPoint: { ...fixedPoint },
        endPoint: { x: rightExitX, y: fixedPoint.y }
      });
      
      segments.push({
        id: generateId(),
        startPoint: { x: rightExitX, y: fixedPoint.y },
        endPoint: { x: rightExitX, y: snapPoint.y }
      });
      
      segments.push({
        id: generateId(),
        startPoint: { x: rightExitX, y: snapPoint.y },
        endPoint: { ...snapPoint }
      });
      break;
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
 * ✅ البحث عن أقرب نقطة وسط مُفعّلة من طرف معين
 * تُرجع index الضلع الذي يحتوي على أول نقطة مُفعّلة
 */
const findNearestActiveMidpointIndex = (
  arrowData: ArrowData,
  fromEndpoint: 'start' | 'end'
): number | null => {
  const activeMidpoints = arrowData.controlPoints.filter(
    cp => cp.type === 'midpoint' && cp.isActive === true && cp.segmentId
  );
  
  if (activeMidpoints.length === 0) return null;
  
  if (fromEndpoint === 'start') {
    // نبحث من البداية عن أول نقطة مُفعّلة
    for (let i = 0; i < arrowData.segments.length; i++) {
      const seg = arrowData.segments[i];
      const hasActiveMidpoint = activeMidpoints.some(cp => cp.segmentId === seg.id);
      if (hasActiveMidpoint) {
        return i;
      }
    }
  } else {
    // نبحث من النهاية عن أول نقطة مُفعّلة
    for (let i = arrowData.segments.length - 1; i >= 0; i--) {
      const seg = arrowData.segments[i];
      const hasActiveMidpoint = activeMidpoints.some(cp => cp.segmentId === seg.id);
      if (hasActiveMidpoint) {
        return i;
      }
    }
  }
  
  return null;
};

/**
 * ✅ الدالة الرئيسية لحل اتصال السهم بالعنصر
 * تضمن دائماً إنشاء مسار T-shape أو U-shape نظيف
 * 
 * القاعدة الجديدة: لا يتم تحريك أي ضلع يحتوي على نقطة وسط مُفعّلة
 * يتم فقط تعديل الأضلاع بين نقطة النهاية المُلصقة وأقرب نقطة مُفعّلة
 */
export const resolveSnapConnection = (
  arrowData: ArrowData,
  snapPoint: ArrowPoint,
  snapEdge: SnapEdge,
  targetElement: TargetElement,
  endpointType: 'start' | 'end',
  config: RoutingConfig = DEFAULT_CONFIG
): ArrowData => {
  // ✅ الخطوة 1: البحث عن أقرب نقطة وسط مُفعّلة
  const nearestActiveIndex = findNearestActiveMidpointIndex(arrowData, endpointType);
  
  // ✅ الخطوة 2: تحديد الأضلاع التي يجب الاحتفاظ بها والنقطة الثابتة
  let fixedPoint: ArrowPoint;
  let preservedSegments: ArrowSegment[] = [];
  let preservedControlPoints: ArrowControlPoint[] = [];
  
  if (nearestActiveIndex !== null) {
    // يوجد نقاط مُفعّلة - نحتفظ بالأضلاع التي بعد/قبل النقطة المُفعّلة
    if (endpointType === 'start') {
      // نسحب من البداية → نحتفظ بالأضلاع من النقطة المُفعّلة حتى النهاية
      // النقطة الثابتة هي بداية الضلع المُفعّل
      preservedSegments = arrowData.segments.slice(nearestActiveIndex);
      fixedPoint = { ...preservedSegments[0].startPoint };
      
      // نحتفظ بنقاط التحكم للأضلاع المحفوظة
      preservedControlPoints = arrowData.controlPoints.filter(cp => {
        if (cp.type === 'endpoint') return false;
        if (!cp.segmentId) return false;
        return preservedSegments.some(s => s.id === cp.segmentId);
      });
      
      console.log('[Arrow Routing] Preserving segments from active midpoint to end:', {
        activeIndex: nearestActiveIndex,
        preservedCount: preservedSegments.length,
        fixedPoint
      });
    } else {
      // نسحب من النهاية → نحتفظ بالأضلاع من البداية حتى النقطة المُفعّلة
      // النقطة الثابتة هي نهاية الضلع المُفعّل
      preservedSegments = arrowData.segments.slice(0, nearestActiveIndex + 1);
      fixedPoint = { ...preservedSegments[preservedSegments.length - 1].endPoint };
      
      // نحتفظ بنقاط التحكم للأضلاع المحفوظة
      preservedControlPoints = arrowData.controlPoints.filter(cp => {
        if (cp.type === 'endpoint') return false;
        if (!cp.segmentId) return false;
        return preservedSegments.some(s => s.id === cp.segmentId);
      });
      
      console.log('[Arrow Routing] Preserving segments from start to active midpoint:', {
        activeIndex: nearestActiveIndex,
        preservedCount: preservedSegments.length,
        fixedPoint
      });
    }
  } else {
    // لا يوجد نقاط مُفعّلة - نستخدم الطرف الآخر كنقطة ثابتة
    fixedPoint = endpointType === 'start' 
      ? { ...arrowData.endPoint }
      : { ...arrowData.startPoint };
  }
  
  // ✅ الخطوة 3: فحص إذا كان المسار يمر من داخل العنصر (يحتاج U-shape)
  const needsUShape = detectIntersection(fixedPoint, snapPoint, targetElement);
  
  // ✅ الخطوة 4: إنشاء المسار الجديد للجزء المُعدّل فقط
  let newPathSegments: ArrowSegment[];
  
  if (needsUShape) {
    console.log('[Arrow Routing] Creating U-Shape path for modified section');
    newPathSegments = createUShapePath(fixedPoint, snapPoint, snapEdge, config);
  } else {
    console.log('[Arrow Routing] Creating T-Shape path for modified section');
    newPathSegments = createOrthogonalPathWithTShape(fixedPoint, snapPoint, snapEdge, config);
  }
  
  // ✅ الخطوة 5: عكس المسار الجديد إذا كان الاتصال من البداية
  if (endpointType === 'start') {
    newPathSegments = newPathSegments.map(seg => ({
      ...seg,
      startPoint: { ...seg.endPoint },
      endPoint: { ...seg.startPoint }
    })).reverse();
  }
  
  // ✅ الخطوة 6: دمج الأضلاع المحفوظة مع الأضلاع الجديدة
  let finalSegments: ArrowSegment[];
  
  if (nearestActiveIndex !== null) {
    if (endpointType === 'start') {
      // الأضلاع الجديدة + الأضلاع المحفوظة
      // نتأكد أن نهاية المسار الجديد تتصل ببداية الأضلاع المحفوظة
      if (newPathSegments.length > 0 && preservedSegments.length > 0) {
        newPathSegments[newPathSegments.length - 1].endPoint = { ...preservedSegments[0].startPoint };
      }
      finalSegments = [...newPathSegments, ...preservedSegments];
    } else {
      // الأضلاع المحفوظة + الأضلاع الجديدة
      // نتأكد أن بداية المسار الجديد تتصل بنهاية الأضلاع المحفوظة
      if (preservedSegments.length > 0 && newPathSegments.length > 0) {
        newPathSegments[0].startPoint = { ...preservedSegments[preservedSegments.length - 1].endPoint };
      }
      finalSegments = [...preservedSegments, ...newPathSegments];
    }
  } else {
    finalSegments = newPathSegments;
  }
  
  // ✅ الخطوة 7: تحديث النقاط
  const newStartPoint = finalSegments.length > 0 ? { ...finalSegments[0].startPoint } : arrowData.startPoint;
  const newEndPoint = finalSegments.length > 0 ? { ...finalSegments[finalSegments.length - 1].endPoint } : arrowData.endPoint;
  
  // ✅ الخطوة 8: تحديث الاتصالات
  const newStartConnection = endpointType === 'start' 
    ? { elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection
    : arrowData.startConnection;
  
  const newEndConnection = endpointType === 'end' 
    ? { elementId: targetElement.id, anchorPoint: snapEdge, offset: { x: 0, y: 0 } } as ArrowConnection
    : arrowData.endConnection;
  
  // ✅ الخطوة 9: إنشاء ArrowData جديد
  const newArrowData: ArrowData = {
    ...arrowData,
    startPoint: newStartPoint,
    endPoint: newEndPoint,
    segments: finalSegments,
    startConnection: newStartConnection,
    endConnection: newEndConnection,
    arrowType: 'orthogonal'
  };
  
  // ✅ الخطوة 10: إعادة بناء نقاط التحكم مع الحفاظ على حالة isActive للأضلاع المحفوظة
  newArrowData.controlPoints = rebuildControlPointsPreservingActive(
    finalSegments, 
    newArrowData, 
    preservedControlPoints
  );
  
  console.log('[Arrow Routing] Result:', {
    type: needsUShape ? 'U-Shape' : 'T-Shape',
    totalSegments: finalSegments.length,
    preservedSegments: preservedSegments.length,
    newSegments: newPathSegments.length,
    snapEdge,
    endpointType
  });
  
  return newArrowData;
};

/**
 * ✅ إعادة بناء نقاط التحكم مع الحفاظ على حالة isActive للأضلاع المحفوظة
 */
const rebuildControlPointsPreservingActive = (
  segments: ArrowSegment[],
  arrowData: ArrowData,
  preservedControlPoints: ArrowControlPoint[]
): ArrowControlPoint[] => {
  const controlPoints: ArrowControlPoint[] = [];
  
  // نقطة البداية
  const startPoint = segments.length > 0 ? segments[0].startPoint : arrowData.startPoint;
  controlPoints.push({
    id: generateId(),
    type: 'endpoint',
    position: { ...startPoint },
    isActive: true,
    connection: arrowData.startConnection || null
  });
  
  // نقاط منتصف لكل ضلع
  segments.forEach((seg) => {
    const midPos = {
      x: (seg.startPoint.x + seg.endPoint.x) / 2,
      y: (seg.startPoint.y + seg.endPoint.y) / 2
    };
    
    // نبحث عن نقطة تحكم محفوظة لهذا الضلع
    const preservedCp = preservedControlPoints.find(cp => cp.segmentId === seg.id);
    
    controlPoints.push({
      id: preservedCp?.id || generateId(),
      type: 'midpoint',
      position: midPos,
      isActive: preservedCp?.isActive ?? false, // نحافظ على حالة isActive للأضلاع المحفوظة
      segmentId: seg.id,
      label: preservedCp?.label
    });
  });
  
  // نقطة النهاية
  const endPoint = segments.length > 0 ? segments[segments.length - 1].endPoint : arrowData.endPoint;
  controlPoints.push({
    id: generateId(),
    type: 'endpoint',
    position: { ...endPoint },
    isActive: true,
    connection: arrowData.endConnection || null
  });
  
  return controlPoints;
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
  
  // استخدام resolveSnapConnection لضمان T-shape مع الحفاظ على الأضلاع المُفعّلة
  return resolveSnapConnection(
    arrowData,
    newAnchorPosition,
    snapEdge,
    movedElement,
    connectionType
  );
};