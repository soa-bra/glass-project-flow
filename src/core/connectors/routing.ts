/**
 * Routing - خوارزميات توجيه المسارات
 * Sprint 3: Connector Tool 2.0
 */

import type { Point } from '@/core/canvasKernel';
import type { AnchorPoint, ElementBounds } from './anchors';

// =============================================================================
// Types
// =============================================================================

export type PathType = 'straight' | 'curved' | 'orthogonal' | 'smooth';

export interface PathSegment {
  type: 'line' | 'quadratic' | 'cubic';
  points: Point[];
}

export interface RoutePath {
  segments: PathSegment[];
  svgPath: string;
  length: number;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export interface RoutingConfig {
  pathType: PathType;
  cornerRadius: number;
  padding: number;
  curveTension: number;
}

const DEFAULT_CONFIG: RoutingConfig = {
  pathType: 'curved',
  cornerRadius: 12,
  padding: 24,
  curveTension: 0.4
};

// =============================================================================
// Path Router
// =============================================================================

class PathRouter {
  private config: RoutingConfig = DEFAULT_CONFIG;

  updateConfig(config: Partial<RoutingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * حساب المسار بين نقطتي ارتكاز
   */
  calculatePath(
    sourceAnchor: AnchorPoint,
    targetAnchor: AnchorPoint,
    obstacles: ElementBounds[] = []
  ): RoutePath {
    switch (this.config.pathType) {
      case 'straight':
        return this.calculateStraightPath(sourceAnchor.point, targetAnchor.point);
      case 'curved':
        return this.calculateCurvedPath(sourceAnchor, targetAnchor);
      case 'orthogonal':
        return this.calculateOrthogonalPath(sourceAnchor, targetAnchor, obstacles);
      case 'smooth':
        return this.calculateSmoothPath(sourceAnchor, targetAnchor);
      default:
        return this.calculateCurvedPath(sourceAnchor, targetAnchor);
    }
  }

  /**
   * مسار مستقيم
   */
  private calculateStraightPath(start: Point, end: Point): RoutePath {
    const svgPath = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    const length = Math.hypot(end.x - start.x, end.y - start.y);

    return {
      segments: [{ type: 'line', points: [start, end] }],
      svgPath,
      length,
      boundingBox: this.calculateBoundingBox([start, end])
    };
  }

  /**
   * مسار منحني (Bezier Cubic)
   */
  private calculateCurvedPath(source: AnchorPoint, target: AnchorPoint): RoutePath {
    const start = source.point;
    const end = target.point;
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);
    
    // حساب قوة الانحناء
    const curvature = Math.min(distance * this.config.curveTension, 150);
    
    // نقاط التحكم بناءً على اتجاه الخروج
    const cp1: Point = {
      x: start.x + source.normal.x * curvature,
      y: start.y + source.normal.y * curvature
    };
    
    const cp2: Point = {
      x: end.x + target.normal.x * curvature,
      y: end.y + target.normal.y * curvature
    };

    const svgPath = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
    const length = this.estimateCubicBezierLength(start, cp1, cp2, end);

    return {
      segments: [{ type: 'cubic', points: [start, cp1, cp2, end] }],
      svgPath,
      length,
      boundingBox: this.calculateBoundingBox([start, cp1, cp2, end])
    };
  }

  /**
   * مسار متعامد (زوايا قائمة)
   */
  private calculateOrthogonalPath(
    source: AnchorPoint,
    target: AnchorPoint,
    obstacles: ElementBounds[]
  ): RoutePath {
    const start = source.point;
    const end = target.point;
    const padding = this.config.padding;
    const radius = this.config.cornerRadius;

    const points: Point[] = [start];
    
    // إضافة نقطة offset من المصدر
    const offsetStart: Point = {
      x: start.x + source.normal.x * padding,
      y: start.y + source.normal.y * padding
    };
    points.push(offsetStart);

    // حساب نقاط الوسط
    const midPoints = this.calculateOrthogonalMidPoints(
      offsetStart,
      { x: end.x + target.normal.x * padding, y: end.y + target.normal.y * padding },
      source.position,
      target.position
    );
    points.push(...midPoints);

    // إضافة نقطة offset للهدف
    const offsetEnd: Point = {
      x: end.x + target.normal.x * padding,
      y: end.y + target.normal.y * padding
    };
    points.push(offsetEnd);
    points.push(end);

    // بناء مسار SVG مع زوايا مستديرة
    const svgPath = this.buildOrthogonalSVGPath(points, radius);
    const length = this.calculatePolylineLength(points);

    return {
      segments: points.slice(0, -1).map((p, i) => ({
        type: 'line' as const,
        points: [p, points[i + 1]]
      })),
      svgPath,
      length,
      boundingBox: this.calculateBoundingBox(points)
    };
  }

  /**
   * حساب نقاط الوسط للمسار المتعامد
   */
  private calculateOrthogonalMidPoints(
    start: Point,
    end: Point,
    sourcePos: string,
    targetPos: string
  ): Point[] {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    // أفقي -> أفقي
    if ((sourcePos === 'left' || sourcePos === 'right') &&
        (targetPos === 'left' || targetPos === 'right')) {
      const midX = start.x + dx / 2;
      return [
        { x: midX, y: start.y },
        { x: midX, y: end.y }
      ];
    }

    // عمودي -> عمودي
    if ((sourcePos === 'top' || sourcePos === 'bottom') &&
        (targetPos === 'top' || targetPos === 'bottom')) {
      const midY = start.y + dy / 2;
      return [
        { x: start.x, y: midY },
        { x: end.x, y: midY }
      ];
    }

    // أفقي -> عمودي أو عمودي -> أفقي
    if ((sourcePos === 'left' || sourcePos === 'right')) {
      return [{ x: end.x, y: start.y }];
    } else {
      return [{ x: start.x, y: end.y }];
    }
  }

  /**
   * بناء مسار SVG مع زوايا مستديرة
   */
  private buildOrthogonalSVGPath(points: Point[], radius: number): string {
    if (points.length < 2) return '';
    if (points.length === 2) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      // حساب المسافة للنقطة السابقة والتالية
      const toPrev = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      const toNext = Math.hypot(next.x - curr.x, next.y - curr.y);
      
      // تعديل نصف القطر ليناسب المسافة
      const r = Math.min(radius, toPrev / 2, toNext / 2);

      // اتجاهات
      const fromPrev = { x: (curr.x - prev.x) / toPrev, y: (curr.y - prev.y) / toPrev };
      const toNextDir = { x: (next.x - curr.x) / toNext, y: (next.y - curr.y) / toNext };

      // نقطة بداية القوس
      const arcStart = {
        x: curr.x - fromPrev.x * r,
        y: curr.y - fromPrev.y * r
      };

      // نقطة نهاية القوس
      const arcEnd = {
        x: curr.x + toNextDir.x * r,
        y: curr.y + toNextDir.y * r
      };

      path += ` L ${arcStart.x} ${arcStart.y}`;
      path += ` Q ${curr.x} ${curr.y} ${arcEnd.x} ${arcEnd.y}`;
    }

    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

    return path;
  }

  /**
   * مسار سلس (Smooth curve through points)
   */
  private calculateSmoothPath(source: AnchorPoint, target: AnchorPoint): RoutePath {
    const start = source.point;
    const end = target.point;
    const padding = this.config.padding;

    // نقاط الوسط
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    const cp1: Point = {
      x: start.x + source.normal.x * padding,
      y: start.y + source.normal.y * padding
    };

    const cp2: Point = {
      x: end.x + target.normal.x * padding,
      y: end.y + target.normal.y * padding
    };

    // استخدام S-curve
    const svgPath = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${midX} ${cp1.y}, ${midX} ${midY} S ${cp2.x} ${end.y}, ${end.x} ${end.y}`;
    
    return {
      segments: [{ type: 'cubic', points: [start, cp1, cp2, end] }],
      svgPath,
      length: this.estimateCubicBezierLength(start, cp1, cp2, end),
      boundingBox: this.calculateBoundingBox([start, cp1, cp2, end])
    };
  }

  /**
   * حساب الإطار المحيط
   */
  private calculateBoundingBox(points: Point[]): { x: number; y: number; width: number; height: number } {
    if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

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
  private estimateCubicBezierLength(p0: Point, p1: Point, p2: Point, p3: Point): number {
    const steps = 20;
    let length = 0;
    let prev = p0;

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const point = this.cubicBezierPoint(p0, p1, p2, p3, t);
      length += Math.hypot(point.x - prev.x, point.y - prev.y);
      prev = point;
    }

    return length;
  }

  /**
   * حساب نقطة على منحنى Bezier
   */
  private cubicBezierPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
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
   * حساب طول polyline
   */
  private calculatePolylineLength(points: Point[]): number {
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
      length += Math.hypot(
        points[i + 1].x - points[i].x,
        points[i + 1].y - points[i].y
      );
    }
    return length;
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const pathRouter = new PathRouter();
