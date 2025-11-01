// خوارزميات التنعيم والتبسيط للمسارات

export interface PenPoint {
  x: number;
  y: number;
  t: number;
}

/**
 * تنعيم المسار باستخدام المتوسط المتحرك
 * @param pts - نقاط المسار
 * @param w - نصف عرض النافذة (default: 3)
 */
export const movingAverage = (pts: PenPoint[], w = 3): PenPoint[] => {
  if (pts.length <= w) return pts;
  
  const out: PenPoint[] = [];
  for (let i = 0; i < pts.length; i++) {
    const s = Math.max(0, i - w);
    const e = Math.min(pts.length - 1, i + w);
    let sx = 0, sy = 0, c = 0;
    
    for (let j = s; j <= e; j++) {
      sx += pts[j].x;
      sy += pts[j].y;
      c++;
    }
    
    out.push({ ...pts[i], x: sx / c, y: sy / c });
  }
  
  return out;
};

/**
 * حساب المسافة العمودية من نقطة إلى خط
 */
const perpendicularDistance = (
  a: PenPoint,
  b: PenPoint,
  p: PenPoint
): number => {
  const A = { x: a.x, y: a.y };
  const B = { x: b.x, y: b.y };
  
  const num = Math.abs((B.y - A.y) * p.x - (B.x - A.x) * p.y + B.x * A.y - B.y * A.x);
  const den = Math.hypot(B.y - A.y, B.x - A.x);
  
  return den === 0 ? Math.hypot(p.x - A.x, p.y - A.y) : num / den;
};

/**
 * خوارزمية Ramer-Douglas-Peucker لتبسيط المسار
 * @param pts - نقاط المسار
 * @param eps - حد التسامح (default: 1.2)
 */
export const rdp = (pts: PenPoint[], eps = 1.2): PenPoint[] => {
  if (pts.length < 3) return pts;
  
  let dmaxv = 0;
  let idx = 0;
  
  // إيجاد النقطة الأبعد عن الخط المستقيم
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpendicularDistance(pts[0], pts[pts.length - 1], pts[i]);
    if (d > dmaxv) {
      idx = i;
      dmaxv = d;
    }
  }
  
  // إذا كانت أكبر مسافة أكبر من epsilon، قسّم واستمر
  if (dmaxv > eps) {
    const r1 = rdp(pts.slice(0, idx + 1), eps);
    const r2 = rdp(pts.slice(idx), eps);
    return r1.slice(0, -1).concat(r2);
  } else {
    return [pts[0], pts[pts.length - 1]];
  }
};

/**
 * تصفية النقاط المتقاربة جداً
 * @param pts - نقاط المسار
 * @param minDistance - الحد الأدنى للمسافة بين النقاط (default: 0.5)
 */
export const filterClosePoints = (pts: PenPoint[], minDistance = 0.5): PenPoint[] => {
  if (pts.length === 0) return pts;
  
  const filtered: PenPoint[] = [pts[0]];
  
  for (let i = 1; i < pts.length; i++) {
    const lastPoint = filtered[filtered.length - 1];
    const distance = Math.hypot(pts[i].x - lastPoint.x, pts[i].y - lastPoint.y);
    
    if (distance >= minDistance) {
      filtered.push(pts[i]);
    }
  }
  
  return filtered;
};

/**
 * قفل الاتجاه لخط مستقيم (Shift mode)
 * @param start - نقطة البداية
 * @param current - النقطة الحالية
 */
export const lockDirection = (
  start: PenPoint,
  current: PenPoint
): PenPoint => {
  const dx = current.x - start.x;
  const dy = current.y - start.y;
  const angle = Math.atan2(dy, dx);
  
  // تقريب إلى أقرب زاوية 45 درجة
  const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  const distance = Math.hypot(dx, dy);
  
  return {
    x: start.x + Math.cos(snapAngle) * distance,
    y: start.y + Math.sin(snapAngle) * distance,
    t: current.t
  };
};

/**
 * حساب الـ bounding box للمسار
 */
export const calculateBBox = (pts: PenPoint[]): { x: number; y: number; w: number; h: number } => {
  if (pts.length === 0) {
    return { x: 0, y: 0, w: 0, h: 0 };
  }
  
  const xs = pts.map(p => p.x);
  const ys = pts.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY
  };
};
