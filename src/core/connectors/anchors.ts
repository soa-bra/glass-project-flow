/**
 * Anchors - حساب نقاط الارتكاز الديناميكية
 * Sprint 3: Connector Tool 2.0
 */

import type { Point } from '@/core/canvasKernel';

// =============================================================================
// Types
// =============================================================================

export type AnchorPosition = 'top' | 'right' | 'bottom' | 'left' | 'center';

export interface AnchorPoint {
  id: string;
  position: AnchorPosition;
  point: Point;
  normal: Point; // اتجاه الخروج
}

export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnchorConfig {
  /** تفعيل المحاذاة التلقائية */
  autoAlign: boolean;
  /** مسافة snap للنقاط */
  snapDistance: number;
  /** إظهار نقاط الارتكاز الوسطية */
  showCenterAnchors: boolean;
}

const DEFAULT_CONFIG: AnchorConfig = {
  autoAlign: true,
  snapDistance: 20,
  showCenterAnchors: false
};

// =============================================================================
// Anchor Calculator
// =============================================================================

class AnchorCalculator {
  private config: AnchorConfig = DEFAULT_CONFIG;

  /**
   * تحديث الإعدادات
   */
  updateConfig(config: Partial<AnchorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * حساب جميع نقاط الارتكاز لعنصر
   */
  calculateAnchors(elementId: string, bounds: ElementBounds): AnchorPoint[] {
    const { x, y, width, height } = bounds;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const anchors: AnchorPoint[] = [
      {
        id: `${elementId}-top`,
        position: 'top',
        point: { x: centerX, y },
        normal: { x: 0, y: -1 }
      },
      {
        id: `${elementId}-right`,
        position: 'right',
        point: { x: x + width, y: centerY },
        normal: { x: 1, y: 0 }
      },
      {
        id: `${elementId}-bottom`,
        position: 'bottom',
        point: { x: centerX, y: y + height },
        normal: { x: 0, y: 1 }
      },
      {
        id: `${elementId}-left`,
        position: 'left',
        point: { x, y: centerY },
        normal: { x: -1, y: 0 }
      }
    ];

    if (this.config.showCenterAnchors) {
      anchors.push({
        id: `${elementId}-center`,
        position: 'center',
        point: { x: centerX, y: centerY },
        normal: { x: 0, y: 0 }
      });
    }

    return anchors;
  }

  /**
   * الحصول على نقطة ارتكاز محددة
   */
  getAnchor(elementId: string, bounds: ElementBounds, position: AnchorPosition): AnchorPoint | null {
    const anchors = this.calculateAnchors(elementId, bounds);
    return anchors.find(a => a.position === position) || null;
  }

  /**
   * إيجاد أقرب نقطة ارتكاز
   */
  findNearestAnchor(
    point: Point,
    elements: Array<{ id: string; bounds: ElementBounds }>,
    excludeIds: string[] = []
  ): { anchor: AnchorPoint; elementId: string; distance: number } | null {
    let nearest: { anchor: AnchorPoint; elementId: string; distance: number } | null = null;

    for (const element of elements) {
      if (excludeIds.includes(element.id)) continue;

      const anchors = this.calculateAnchors(element.id, element.bounds);
      
      for (const anchor of anchors) {
        const distance = Math.hypot(
          anchor.point.x - point.x,
          anchor.point.y - point.y
        );

        if (distance <= this.config.snapDistance) {
          if (!nearest || distance < nearest.distance) {
            nearest = { anchor, elementId: element.id, distance };
          }
        }
      }
    }

    return nearest;
  }

  /**
   * حساب أفضل زوج من نقاط الارتكاز للربط بين عنصرين
   */
  calculateBestAnchors(
    sourceBounds: ElementBounds,
    targetBounds: ElementBounds,
    sourceId: string,
    targetId: string
  ): { source: AnchorPoint; target: AnchorPoint } {
    const sourceAnchors = this.calculateAnchors(sourceId, sourceBounds);
    const targetAnchors = this.calculateAnchors(targetId, targetBounds);

    let bestPair: { source: AnchorPoint; target: AnchorPoint; distance: number } | null = null;

    for (const source of sourceAnchors) {
      for (const target of targetAnchors) {
        // تجنب الربط المتقابل المباشر (نفس الجهة)
        if (source.position === target.position) continue;

        const distance = Math.hypot(
          source.point.x - target.point.x,
          source.point.y - target.point.y
        );

        if (!bestPair || distance < bestPair.distance) {
          bestPair = { source, target, distance };
        }
      }
    }

    // إذا لم نجد زوجاً مناسباً، استخدم أقرب زوج
    if (!bestPair) {
      bestPair = {
        source: sourceAnchors[0],
        target: targetAnchors[0],
        distance: Infinity
      };
    }

    return { source: bestPair.source, target: bestPair.target };
  }

  /**
   * حساب نقطة ارتكاز ذكية بناءً على موقع الماوس
   */
  calculateSmartAnchor(
    bounds: ElementBounds,
    mousePoint: Point,
    elementId: string
  ): AnchorPoint {
    const { x, y, width, height } = bounds;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // حساب الموقع النسبي للماوس من مركز العنصر
    const relX = mousePoint.x - centerX;
    const relY = mousePoint.y - centerY;

    // تحديد الاتجاه بناءً على الزاوية
    const angle = Math.atan2(relY, relX);
    const normalizedAngle = ((angle * 180 / Math.PI) + 360) % 360;

    let position: AnchorPosition;
    if (normalizedAngle >= 315 || normalizedAngle < 45) {
      position = 'right';
    } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
      position = 'bottom';
    } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
      position = 'left';
    } else {
      position = 'top';
    }

    return this.getAnchor(elementId, bounds, position)!;
  }

  /**
   * تحويل موقع نقطة الارتكاز إلى نقطة مع offset
   */
  getAnchorWithOffset(anchor: AnchorPoint, offset: number): Point {
    return {
      x: anchor.point.x + anchor.normal.x * offset,
      y: anchor.point.y + anchor.normal.y * offset
    };
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const anchorCalculator = new AnchorCalculator();
