// محرك التعرف على الإيماءات والأشكال

import type { PenPoint } from '../geometry/simplify';

export interface PenStroke {
  id: string;
  points: PenPoint[];
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  isClosed?: boolean;
  simplified?: boolean;
  bbox?: { x: number; y: number; w: number; h: number };
}

export type SmartKind = 'circle' | 'rect' | 'arrow' | 'lasso' | 'scribble' | 'line' | 'connector' | 'none';

/**
 * تصنيف المسار إلى نوع إيماءة
 */
export function classifyStroke(st: PenStroke): SmartKind {
  const pts = st.points;
  if (pts.length < 2) return 'none';
  
  const first = pts[0];
  const last = pts[pts.length - 1];
  const bbox = st.bbox!;
  
  // فحص إذا كان مغلقاً
  const closed = Math.hypot(last.x - first.x, last.y - first.y) < Math.max(6, st.width * 2);
  
  // حساب كثافة النقاط (للكشف عن الخربشة)
  const area = Math.max(16, bbox.w * bbox.h);
  const density = pts.length / area;
  
  // خربشة: كثافة عالية في مساحة صغيرة
  if (!closed && density > 0.05) {
    return 'scribble';
  }
  
  // أشكال مغلقة
  if (closed) {
    const w = bbox.w;
    const h = bbox.h;
    const ratio = w > 0 ? h / w : 1;
    
    // دائرة: نسبة أضلاع قريبة من 1
    if (ratio > 0.8 && ratio < 1.2) {
      // فحص إضافي: هل النقاط موزعة بانتظام حول المركز؟
      const centerX = bbox.x + w / 2;
      const centerY = bbox.y + h / 2;
      const avgRadius = (w + h) / 4;
      
      let sumDeviation = 0;
      pts.forEach(p => {
        const r = Math.hypot(p.x - centerX, p.y - centerY);
        sumDeviation += Math.abs(r - avgRadius);
      });
      const avgDeviation = sumDeviation / pts.length;
      
      // إذا كان الانحراف صغيراً، إذن دائرة
      if (avgDeviation < avgRadius * 0.3) {
        return 'circle';
      }
    }
    
    // مستطيل أو حلقة تجميع (lasso)
    return 'rect';
  }
  
  // خط مستقيم أو سهم
  const totalLen = pts.reduce((acc, p, i) => 
    i ? acc + Math.hypot(p.x - pts[i-1].x, p.y - pts[i-1].y) : 0, 0
  );
  
  const straightLineLen = Math.hypot(last.x - first.x, last.y - first.y);
  const straightness = straightLineLen / totalLen;
  
  // إذا كان مستقيماً نسبياً
  if (straightness > 0.85 && totalLen > 24) {
    // فحص إذا كان سهماً (تغيير اتجاه في النهاية)
    if (pts.length > 5) {
      const lastSegment = pts.slice(-5);
      const penultimate = lastSegment[0];
      const direction1 = Math.atan2(last.y - penultimate.y, last.x - penultimate.x);
      const direction2 = Math.atan2(penultimate.y - first.y, penultimate.x - first.x);
      const angleDiff = Math.abs(direction1 - direction2);
      
      // إذا كان هناك تغيير كبير في الاتجاه، اعتبره سهماً
      if (angleDiff > Math.PI / 6 && angleDiff < Math.PI * 5 / 6) {
        return 'arrow';
      }
    }
    
    // خط بسيط (قد يكون موصلاً)
    return 'connector';
  }
  
  // خط منحني بسيط
  if (totalLen > 20) {
    return 'line';
  }
  
  return 'none';
}

/**
 * فحص إذا كانت نقطة داخل bounding box
 */
export function pointInBBox(
  p: PenPoint,
  bbox: { x: number; y: number; w: number; h: number }
): boolean {
  return p.x >= bbox.x && 
         p.x <= bbox.x + bbox.w && 
         p.y >= bbox.y && 
         p.y <= bbox.y + bbox.h;
}

/**
 * فحص إذا كان مسار يتقاطع مع bounding box لعنصر
 */
export function strokeIntersectsBBox(
  stroke: PenStroke,
  bbox: { x: number; y: number; w: number; h: number }
): boolean {
  // تحقق سريع: هل bounding box للمسار يتقاطع مع bbox العنصر؟
  const sb = stroke.bbox!;
  if (sb.x > bbox.x + bbox.w || sb.x + sb.w < bbox.x ||
      sb.y > bbox.y + bbox.h || sb.y + sb.h < bbox.y) {
    return false;
  }
  
  // تحقق دقيق: عد النقاط داخل bbox
  let count = 0;
  for (const p of stroke.points) {
    if (pointInBBox(p, bbox)) {
      count++;
    }
  }
  
  // إذا كانت نسبة كبيرة من النقاط داخل bbox، إذن تقاطع
  return count > stroke.points.length * 0.3;
}
