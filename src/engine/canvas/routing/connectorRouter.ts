/**
 * Connector Router - محرك توجيه الموصلات
 * 
 * يحسب المسارات المثلى للموصلات بين العناصر:
 * - Direct: خط مستقيم
 * - Orthogonal: مسار بزوايا قائمة
 * - Bezier: منحنى سلس
 * - Smart: اختيار تلقائي حسب السياق
 */

import type { Point } from '../kernel/canvasKernel';

// =============================================================================
// Types
// =============================================================================

export type RoutingMode = 'direct' | 'orthogonal' | 'bezier' | 'smart';

export interface RouteSegment {
  start: Point;
  end: Point;
  type: 'line' | 'arc' | 'bezier';
  controlPoints?: Point[];
}

export interface RoutingResult {
  segments: RouteSegment[];
  totalLength: number;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export interface EdgeEndpoint {
  nodeId?: string;
  anchor?: string;
  position: Point;
}

export interface RoutingOptions {
  mode: RoutingMode;
  /** الحد الأدنى للمسافة من حافة العنصر */
  padding: number;
  /** نصف قطر الانحناء للمسارات المنحنية */
  cornerRadius: number;
  /** تجنب العناصر الأخرى */
  avoidObstacles: boolean;
  /** معرفات العناصر المراد تجنبها */
  obstacleIds?: string[];
}

const DEFAULT_OPTIONS: RoutingOptions = {
  mode: 'smart',
  padding: 20,
  cornerRadius: 10,
  avoidObstacles: false
};

// =============================================================================
// Connector Router Implementation
// =============================================================================

class ConnectorRouterImpl {
  /**
   * حساب مسار الموصل
   */
  route(
    source: EdgeEndpoint,
    target: EdgeEndpoint,
    options: Partial<RoutingOptions> = {}
  ): RoutingResult {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    // الحصول على مواقع البداية والنهاية
    const startPoint = source.position;
    const endPoint = target.position;

    switch (opts.mode) {
      case 'direct':
        return this.routeDirect(startPoint, endPoint);
      case 'orthogonal':
        return this.routeOrthogonal(startPoint, endPoint, source, target, opts);
      case 'bezier':
        return this.routeBezier(startPoint, endPoint, source, target, opts);
      case 'smart':
      default:
        return this.routeSmart(startPoint, endPoint, source, target, opts);
    }
  }

  /**
   * مسار مباشر (خط مستقيم)
   */
  private routeDirect(start: Point, end: Point): RoutingResult {
    const segment: RouteSegment = {
      start,
      end,
      type: 'line'
    };

    const length = Math.hypot(end.x - start.x, end.y - start.y);

    return {
      segments: [segment],
      totalLength: length,
      boundingBox: this.calculateBoundingBox([start, end])
    };
  }

  /**
   * مسار متعامد (زوايا قائمة)
   */
  private routeOrthogonal(
    start: Point,
    end: Point,
    source: EdgeEndpoint,
    target: EdgeEndpoint,
    options: RoutingOptions
  ): RoutingResult {
    const segments: RouteSegment[] = [];
    const points: Point[] = [start];
    
    // تحديد اتجاه الخروج من المصدر
    const sourceDirection = this.getEndpointDirection(source);
    // تحديد اتجاه الدخول للهدف
    const targetDirection = this.getEndpointDirection(target);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const padding = options.padding;

    // حساب نقاط الوسط بناءً على الاتجاهات
    if (sourceDirection === 'horizontal' && targetDirection === 'horizontal') {
      // أفقي -> أفقي: مسار U أو S
      const midX = start.x + dx / 2;
      points.push({ x: midX, y: start.y });
      points.push({ x: midX, y: end.y });
    } else if (sourceDirection === 'vertical' && targetDirection === 'vertical') {
      // عمودي -> عمودي: مسار U أو S
      const midY = start.y + dy / 2;
      points.push({ x: start.x, y: midY });
      points.push({ x: end.x, y: midY });
    } else if (sourceDirection === 'horizontal' && targetDirection === 'vertical') {
      // أفقي -> عمودي: مسار L
      points.push({ x: end.x, y: start.y });
    } else if (sourceDirection === 'vertical' && targetDirection === 'horizontal') {
      // عمودي -> أفقي: مسار L
      points.push({ x: start.x, y: end.y });
    } else {
      // افتراضي: مسار بسيط مع نقطة وسط واحدة
      if (Math.abs(dx) > Math.abs(dy)) {
        points.push({ x: start.x + dx / 2, y: start.y });
        points.push({ x: start.x + dx / 2, y: end.y });
      } else {
        points.push({ x: start.x, y: start.y + dy / 2 });
        points.push({ x: end.x, y: start.y + dy / 2 });
      }
    }

    points.push(end);

    // تحويل النقاط إلى segments
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const segmentLength = Math.hypot(
        points[i + 1].x - points[i].x,
        points[i + 1].y - points[i].y
      );
      totalLength += segmentLength;

      segments.push({
        start: points[i],
        end: points[i + 1],
        type: 'line'
      });
    }

    return {
      segments,
      totalLength,
      boundingBox: this.calculateBoundingBox(points)
    };
  }

  /**
   * مسار منحني (Bezier)
   */
  private routeBezier(
    start: Point,
    end: Point,
    source: EdgeEndpoint,
    target: EdgeEndpoint,
    options: RoutingOptions
  ): RoutingResult {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);
    
    // حساب نقاط التحكم
    const curvature = Math.min(distance * 0.3, 100);
    const sourceDir = this.getEndpointDirection(source);
    const targetDir = this.getEndpointDirection(target);

    let cp1: Point;
    let cp2: Point;

    if (sourceDir === 'horizontal') {
      cp1 = { x: start.x + (dx > 0 ? curvature : -curvature), y: start.y };
    } else {
      cp1 = { x: start.x, y: start.y + (dy > 0 ? curvature : -curvature) };
    }

    if (targetDir === 'horizontal') {
      cp2 = { x: end.x - (dx > 0 ? curvature : -curvature), y: end.y };
    } else {
      cp2 = { x: end.x, y: end.y - (dy > 0 ? curvature : -curvature) };
    }

    const segment: RouteSegment = {
      start,
      end,
      type: 'bezier',
      controlPoints: [cp1, cp2]
    };

    // تقدير طول المنحنى
    const estimatedLength = this.estimateBezierLength(start, cp1, cp2, end);

    return {
      segments: [segment],
      totalLength: estimatedLength,
      boundingBox: this.calculateBoundingBox([start, cp1, cp2, end])
    };
  }

  /**
   * مسار ذكي (اختيار تلقائي)
   */
  private routeSmart(
    start: Point,
    end: Point,
    source: EdgeEndpoint,
    target: EdgeEndpoint,
    options: RoutingOptions
  ): RoutingResult {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    const distance = Math.hypot(dx, dy);

    // للمسافات القصيرة: خط مستقيم
    if (distance < 50) {
      return this.routeDirect(start, end);
    }

    // إذا كان أحد الطرفين متصلاً بعنصر: مسار متعامد
    if (source.nodeId || target.nodeId) {
      return this.routeOrthogonal(start, end, source, target, options);
    }

    // للمسافات المتوسطة مع فرق كبير في أحد المحاور: مسار متعامد
    if (dx > 3 * dy || dy > 3 * dx) {
      return this.routeOrthogonal(start, end, source, target, options);
    }

    // افتراضي: منحنى
    return this.routeBezier(start, end, source, target, options);
  }

  /**
   * تحديد اتجاه نقطة النهاية
   */
  private getEndpointDirection(endpoint: EdgeEndpoint): 'horizontal' | 'vertical' | 'any' {
    if (!endpoint.anchor) return 'any';

    switch (endpoint.anchor) {
      case 'left':
      case 'right':
        return 'horizontal';
      case 'top':
      case 'bottom':
        return 'vertical';
      default:
        return 'any';
    }
  }

  /**
   * حساب الإطار المحيط
   */
  private calculateBoundingBox(points: Point[]): { x: number; y: number; width: number; height: number } {
    if (points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * تقدير طول منحنى Bezier
   */
  private estimateBezierLength(p0: Point, p1: Point, p2: Point, p3: Point): number {
    // تقريب باستخدام مجموع المسافات بين نقاط التقسيم
    const steps = 10;
    let length = 0;
    let prevPoint = p0;

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const point = this.bezierPoint(p0, p1, p2, p3, t);
      length += Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y);
      prevPoint = point;
    }

    return length;
  }

  /**
   * حساب نقطة على منحنى Bezier
   */
  private bezierPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;

    return {
      x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
    };
  }

  /**
   * إيجاد أقرب نقطة على المسار
   */
  findNearestPointOnRoute(route: RoutingResult, point: Point): { point: Point; distance: number; segmentIndex: number } {
    let nearest = { point: route.segments[0].start, distance: Infinity, segmentIndex: 0 };

    route.segments.forEach((segment, index) => {
      const nearestOnSegment = this.nearestPointOnSegment(segment, point);
      if (nearestOnSegment.distance < nearest.distance) {
        nearest = { ...nearestOnSegment, segmentIndex: index };
      }
    });

    return nearest;
  }

  /**
   * إيجاد أقرب نقطة على segment
   */
  private nearestPointOnSegment(segment: RouteSegment, point: Point): { point: Point; distance: number } {
    if (segment.type === 'line') {
      return this.nearestPointOnLine(segment.start, segment.end, point);
    }
    
    // للمنحنيات: تقريب بنقاط متعددة
    if (segment.type === 'bezier' && segment.controlPoints) {
      const [cp1, cp2] = segment.controlPoints;
      let nearest = { point: segment.start, distance: Infinity };
      
      for (let t = 0; t <= 1; t += 0.05) {
        const p = this.bezierPoint(segment.start, cp1, cp2, segment.end, t);
        const d = Math.hypot(p.x - point.x, p.y - point.y);
        if (d < nearest.distance) {
          nearest = { point: p, distance: d };
        }
      }
      
      return nearest;
    }

    return { point: segment.start, distance: Math.hypot(segment.start.x - point.x, segment.start.y - point.y) };
  }

  /**
   * إيجاد أقرب نقطة على خط مستقيم
   */
  private nearestPointOnLine(lineStart: Point, lineEnd: Point, point: Point): { point: Point; distance: number } {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const lengthSq = dx * dx + dy * dy;

    if (lengthSq === 0) {
      const d = Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
      return { point: lineStart, distance: d };
    }

    let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));

    const nearestPoint = {
      x: lineStart.x + t * dx,
      y: lineStart.y + t * dy
    };

    const distance = Math.hypot(point.x - nearestPoint.x, point.y - nearestPoint.y);

    return { point: nearestPoint, distance };
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const connectorRouter = new ConnectorRouterImpl();
