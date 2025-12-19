/**
 * Canvas Kernel Integration Tests
 * 
 * اختبارات شاملة لـ Canvas Kernel وتحويل الإحداثيات
 * تغطي: coordinate transformations, hit testing, bounds calculations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ============================================
// Types and Interfaces
// ============================================

interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DOMRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

// ============================================
// Canvas Kernel Implementation (للاختبار)
// ============================================

class CanvasKernelImpl {
  /**
   * تحويل إحداثيات الشاشة إلى إحداثيات العالم
   */
  screenToWorld(
    screenX: number,
    screenY: number,
    camera: Camera,
    containerRect: DOMRect | null = null
  ): Point {
    // طرح إحداثيات الحاوية إذا كانت متوفرة
    const adjustedX = containerRect ? screenX - containerRect.left : screenX;
    const adjustedY = containerRect ? screenY - containerRect.top : screenY;

    // تحويل إلى World Space
    return {
      x: (adjustedX - camera.x) / camera.zoom,
      y: (adjustedY - camera.y) / camera.zoom
    };
  }

  /**
   * تحويل إحداثيات العالم إلى إحداثيات الشاشة
   */
  worldToScreen(
    worldX: number,
    worldY: number,
    camera: Camera,
    containerRect: DOMRect | null = null
  ): Point {
    const screenX = worldX * camera.zoom + camera.x;
    const screenY = worldY * camera.zoom + camera.y;

    // إضافة إحداثيات الحاوية إذا كانت متوفرة
    return {
      x: containerRect ? screenX + containerRect.left : screenX,
      y: containerRect ? screenY + containerRect.top : screenY
    };
  }

  /**
   * تحقق من تقاطع مستطيلين
   */
  boundsIntersect(a: Bounds, b: Bounds): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  /**
   * تحقق من وجود نقطة داخل مستطيل
   */
  pointInBounds(point: Point, bounds: Bounds): boolean {
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  /**
   * حساب المسافة بين نقطتين
   */
  distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * حساب حدود مجموعة من العناصر
   */
  calculateBounds(elements: Bounds[]): Bounds | null {
    if (elements.length === 0) return null;

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const el of elements) {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * محاذاة قيمة للشبكة
   */
  snapToGrid(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize;
  }

  /**
   * محاذاة نقطة للشبكة
   */
  snapPointToGrid(point: Point, gridSize: number): Point {
    return {
      x: this.snapToGrid(point.x, gridSize),
      y: this.snapToGrid(point.y, gridSize)
    };
  }

  /**
   * تحويل دلتا من الشاشة إلى العالم
   */
  screenDeltaToWorld(deltaX: number, deltaY: number, camera: Camera): Point {
    return {
      x: deltaX / camera.zoom,
      y: deltaY / camera.zoom
    };
  }

  /**
   * تحويل دلتا من العالم إلى الشاشة
   */
  worldDeltaToScreen(deltaX: number, deltaY: number, camera: Camera): Point {
    return {
      x: deltaX * camera.zoom,
      y: deltaY * camera.zoom
    };
  }

  /**
   * تحويل حجم من العالم إلى الشاشة
   */
  worldSizeToScreen(size: Size, camera: Camera): Size {
    return {
      width: size.width * camera.zoom,
      height: size.height * camera.zoom
    };
  }

  /**
   * تحويل حجم من الشاشة إلى العالم
   */
  screenSizeToWorld(size: Size, camera: Camera): Size {
    return {
      width: size.width / camera.zoom,
      height: size.height / camera.zoom
    };
  }

  /**
   * تحويل Bounds من العالم إلى الشاشة
   */
  worldBoundsToScreen(bounds: Bounds, camera: Camera): Bounds {
    const topLeft = this.worldToScreen(bounds.x, bounds.y, camera);
    const size = this.worldSizeToScreen({ width: bounds.width, height: bounds.height }, camera);
    return { x: topLeft.x, y: topLeft.y, ...size };
  }

  /**
   * تحويل Bounds من الشاشة إلى العالم
   */
  screenBoundsToWorld(bounds: Bounds, camera: Camera): Bounds {
    const topLeft = this.screenToWorld(bounds.x, bounds.y, camera);
    const size = this.screenSizeToWorld({ width: bounds.width, height: bounds.height }, camera);
    return { x: topLeft.x, y: topLeft.y, ...size };
  }

  /**
   * حساب مركز Bounds
   */
  getBoundsCenter(bounds: Bounds): Point {
    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
  }

  /**
   * توسيع Bounds بمقدار معين
   */
  expandBounds(bounds: Bounds, padding: number): Bounds {
    return {
      x: bounds.x - padding,
      y: bounds.y - padding,
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2
    };
  }

  /**
   * تحقق من احتواء Bounds لآخر
   */
  boundsContains(outer: Bounds, inner: Bounds): boolean {
    return (
      inner.x >= outer.x &&
      inner.y >= outer.y &&
      inner.x + inner.width <= outer.x + outer.width &&
      inner.y + inner.height <= outer.y + outer.height
    );
  }

  /**
   * دمج مجموعة Bounds
   */
  mergeBounds(boundsArray: Bounds[]): Bounds | null {
    return this.calculateBounds(boundsArray);
  }

  /**
   * تطبيق transformation matrix على نقطة
   */
  transformPoint(point: Point, matrix: { a: number; b: number; c: number; d: number; e: number; f: number }): Point {
    return {
      x: matrix.a * point.x + matrix.c * point.y + matrix.e,
      y: matrix.b * point.x + matrix.d * point.y + matrix.f
    };
  }

  /**
   * حساب Camera للتمركز على Bounds
   */
  getCameraToFitBounds(
    bounds: Bounds,
    viewportSize: Size,
    padding: number = 50,
    maxZoom: number = 1
  ): Camera {
    const scaleX = (viewportSize.width - padding * 2) / bounds.width;
    const scaleY = (viewportSize.height - padding * 2) / bounds.height;
    const zoom = Math.min(scaleX, scaleY, maxZoom);

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    return {
      x: viewportSize.width / 2 - centerX * zoom,
      y: viewportSize.height / 2 - centerY * zoom,
      zoom
    };
  }
}

// إنشاء instance للاختبار
const canvasKernel = new CanvasKernelImpl();

// ============================================
// Screen to World Transformation Tests
// ============================================

describe('Screen to World Transformation', () => {
  describe('Basic Transformations', () => {
    it('should transform correctly at zoom 1 with no pan', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 1 };
      const screenPoint = { x: 100, y: 200 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera);

      expect(worldPoint.x).toBe(100);
      expect(worldPoint.y).toBe(200);
    });

    it('should transform correctly at zoom 2 with no pan', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const screenPoint = { x: 200, y: 400 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera);

      expect(worldPoint.x).toBe(100);
      expect(worldPoint.y).toBe(200);
    });

    it('should transform correctly at zoom 0.5 with no pan', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 0.5 };
      const screenPoint = { x: 100, y: 200 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera);

      expect(worldPoint.x).toBe(200);
      expect(worldPoint.y).toBe(400);
    });

    it('should transform correctly with pan offset', () => {
      const camera: Camera = { x: 100, y: 50, zoom: 1 };
      const screenPoint = { x: 200, y: 150 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera);

      expect(worldPoint.x).toBe(100);
      expect(worldPoint.y).toBe(100);
    });

    it('should transform correctly with zoom and pan combined', () => {
      const camera: Camera = { x: 100, y: 50, zoom: 2 };
      const screenPoint = { x: 300, y: 250 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera);

      expect(worldPoint.x).toBe(100);
      expect(worldPoint.y).toBe(100);
    });
  });

  describe('With Container Rect', () => {
    it('should adjust for container position', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 1 };
      const containerRect: DOMRect = {
        x: 100, y: 50, width: 800, height: 600,
        top: 50, left: 100, bottom: 650, right: 900
      };
      const screenPoint = { x: 200, y: 150 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera, containerRect);

      expect(worldPoint.x).toBe(100); // 200 - 100
      expect(worldPoint.y).toBe(100); // 150 - 50
    });

    it('should handle container offset with zoom', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const containerRect: DOMRect = {
        x: 50, y: 100, width: 800, height: 600,
        top: 100, left: 50, bottom: 700, right: 850
      };
      const screenPoint = { x: 250, y: 300 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera, containerRect);

      expect(worldPoint.x).toBe(100); // (250 - 50) / 2
      expect(worldPoint.y).toBe(100); // (300 - 100) / 2
    });
  });

  describe('Negative Coordinates', () => {
    it('should handle negative world coordinates', () => {
      const camera: Camera = { x: 500, y: 400, zoom: 1 };
      const screenPoint = { x: 300, y: 200 };

      const worldPoint = canvasKernel.screenToWorld(screenPoint.x, screenPoint.y, camera);

      expect(worldPoint.x).toBe(-200);
      expect(worldPoint.y).toBe(-200);
    });
  });
});

// ============================================
// World to Screen Transformation Tests
// ============================================

describe('World to Screen Transformation', () => {
  describe('Basic Transformations', () => {
    it('should transform correctly at zoom 1', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 1 };
      const worldPoint = { x: 100, y: 200 };

      const screenPoint = canvasKernel.worldToScreen(worldPoint.x, worldPoint.y, camera);

      expect(screenPoint.x).toBe(100);
      expect(screenPoint.y).toBe(200);
    });

    it('should transform correctly at zoom 2', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const worldPoint = { x: 100, y: 200 };

      const screenPoint = canvasKernel.worldToScreen(worldPoint.x, worldPoint.y, camera);

      expect(screenPoint.x).toBe(200);
      expect(screenPoint.y).toBe(400);
    });

    it('should transform correctly with pan', () => {
      const camera: Camera = { x: 50, y: 100, zoom: 1 };
      const worldPoint = { x: 100, y: 200 };

      const screenPoint = canvasKernel.worldToScreen(worldPoint.x, worldPoint.y, camera);

      expect(screenPoint.x).toBe(150);
      expect(screenPoint.y).toBe(300);
    });
  });

  describe('Inverse Relationship', () => {
    it('should be inverse of screenToWorld', () => {
      const camera: Camera = { x: 150, y: 100, zoom: 1.5 };
      const originalWorld = { x: 300, y: 250 };

      const screen = canvasKernel.worldToScreen(originalWorld.x, originalWorld.y, camera);
      const backToWorld = canvasKernel.screenToWorld(screen.x, screen.y, camera);

      expect(backToWorld.x).toBeCloseTo(originalWorld.x, 5);
      expect(backToWorld.y).toBeCloseTo(originalWorld.y, 5);
    });

    it('should round-trip correctly with container rect', () => {
      const camera: Camera = { x: 100, y: 50, zoom: 2 };
      const containerRect: DOMRect = {
        x: 200, y: 100, width: 800, height: 600,
        top: 100, left: 200, bottom: 700, right: 1000
      };
      const originalScreen = { x: 500, y: 400 };

      const world = canvasKernel.screenToWorld(originalScreen.x, originalScreen.y, camera, containerRect);
      const backToScreen = canvasKernel.worldToScreen(world.x, world.y, camera, containerRect);

      expect(backToScreen.x).toBeCloseTo(originalScreen.x, 5);
      expect(backToScreen.y).toBeCloseTo(originalScreen.y, 5);
    });
  });
});

// ============================================
// Delta Transformation Tests
// ============================================

describe('Delta Transformations', () => {
  describe('Screen Delta to World', () => {
    it('should convert delta at zoom 1', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 1 };
      const delta = canvasKernel.screenDeltaToWorld(100, 50, camera);

      expect(delta.x).toBe(100);
      expect(delta.y).toBe(50);
    });

    it('should scale delta by inverse zoom', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const delta = canvasKernel.screenDeltaToWorld(100, 50, camera);

      expect(delta.x).toBe(50);
      expect(delta.y).toBe(25);
    });

    it('should ignore pan for delta', () => {
      const camera: Camera = { x: 500, y: 300, zoom: 1 };
      const delta = canvasKernel.screenDeltaToWorld(100, 50, camera);

      expect(delta.x).toBe(100);
      expect(delta.y).toBe(50);
    });
  });

  describe('World Delta to Screen', () => {
    it('should convert delta at zoom 1', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 1 };
      const delta = canvasKernel.worldDeltaToScreen(100, 50, camera);

      expect(delta.x).toBe(100);
      expect(delta.y).toBe(50);
    });

    it('should scale delta by zoom', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const delta = canvasKernel.worldDeltaToScreen(100, 50, camera);

      expect(delta.x).toBe(200);
      expect(delta.y).toBe(100);
    });
  });
});

// ============================================
// Size Transformation Tests
// ============================================

describe('Size Transformations', () => {
  describe('World Size to Screen', () => {
    it('should scale size by zoom', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const size = canvasKernel.worldSizeToScreen({ width: 100, height: 50 }, camera);

      expect(size.width).toBe(200);
      expect(size.height).toBe(100);
    });
  });

  describe('Screen Size to World', () => {
    it('should scale size by inverse zoom', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const size = canvasKernel.screenSizeToWorld({ width: 200, height: 100 }, camera);

      expect(size.width).toBe(100);
      expect(size.height).toBe(50);
    });
  });
});

// ============================================
// Bounds Transformation Tests
// ============================================

describe('Bounds Transformations', () => {
  describe('World Bounds to Screen', () => {
    it('should transform bounds correctly', () => {
      const camera: Camera = { x: 50, y: 100, zoom: 2 };
      const worldBounds: Bounds = { x: 100, y: 150, width: 200, height: 100 };

      const screenBounds = canvasKernel.worldBoundsToScreen(worldBounds, camera);

      expect(screenBounds.x).toBe(250); // 100 * 2 + 50
      expect(screenBounds.y).toBe(400); // 150 * 2 + 100
      expect(screenBounds.width).toBe(400); // 200 * 2
      expect(screenBounds.height).toBe(200); // 100 * 2
    });
  });

  describe('Screen Bounds to World', () => {
    it('should transform bounds correctly', () => {
      const camera: Camera = { x: 50, y: 100, zoom: 2 };
      const screenBounds: Bounds = { x: 250, y: 400, width: 400, height: 200 };

      const worldBounds = canvasKernel.screenBoundsToWorld(screenBounds, camera);

      expect(worldBounds.x).toBe(100);
      expect(worldBounds.y).toBe(150);
      expect(worldBounds.width).toBe(200);
      expect(worldBounds.height).toBe(100);
    });
  });
});

// ============================================
// Hit Testing Tests
// ============================================

describe('Hit Testing', () => {
  describe('Point in Bounds', () => {
    const bounds: Bounds = { x: 100, y: 100, width: 200, height: 150 };

    it('should detect point inside bounds', () => {
      const point = { x: 150, y: 150 };
      expect(canvasKernel.pointInBounds(point, bounds)).toBe(true);
    });

    it('should detect point outside bounds (left)', () => {
      const point = { x: 50, y: 150 };
      expect(canvasKernel.pointInBounds(point, bounds)).toBe(false);
    });

    it('should detect point outside bounds (right)', () => {
      const point = { x: 350, y: 150 };
      expect(canvasKernel.pointInBounds(point, bounds)).toBe(false);
    });

    it('should detect point outside bounds (top)', () => {
      const point = { x: 150, y: 50 };
      expect(canvasKernel.pointInBounds(point, bounds)).toBe(false);
    });

    it('should detect point outside bounds (bottom)', () => {
      const point = { x: 150, y: 300 };
      expect(canvasKernel.pointInBounds(point, bounds)).toBe(false);
    });

    it('should detect point on edge as inside', () => {
      const point = { x: 100, y: 100 };
      expect(canvasKernel.pointInBounds(point, bounds)).toBe(true);
    });

    it('should detect point on opposite edge as inside', () => {
      const point = { x: 300, y: 250 };
      expect(canvasKernel.pointInBounds(point, bounds)).toBe(true);
    });
  });

  describe('Bounds Intersection', () => {
    const boundsA: Bounds = { x: 100, y: 100, width: 100, height: 100 };

    it('should detect overlapping bounds', () => {
      const boundsB: Bounds = { x: 150, y: 150, width: 100, height: 100 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(true);
    });

    it('should detect non-overlapping bounds (right)', () => {
      const boundsB: Bounds = { x: 250, y: 100, width: 100, height: 100 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(false);
    });

    it('should detect non-overlapping bounds (left)', () => {
      const boundsB: Bounds = { x: 0, y: 100, width: 50, height: 100 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(false);
    });

    it('should detect non-overlapping bounds (above)', () => {
      const boundsB: Bounds = { x: 100, y: 0, width: 100, height: 50 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(false);
    });

    it('should detect non-overlapping bounds (below)', () => {
      const boundsB: Bounds = { x: 100, y: 250, width: 100, height: 100 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(false);
    });

    it('should detect touching bounds as not intersecting', () => {
      const boundsB: Bounds = { x: 200, y: 100, width: 100, height: 100 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(false);
    });

    it('should detect contained bounds as intersecting', () => {
      const boundsB: Bounds = { x: 120, y: 120, width: 50, height: 50 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(true);
    });

    it('should detect containing bounds as intersecting', () => {
      const boundsB: Bounds = { x: 50, y: 50, width: 200, height: 200 };
      expect(canvasKernel.boundsIntersect(boundsA, boundsB)).toBe(true);
    });
  });

  describe('Bounds Contains', () => {
    const outer: Bounds = { x: 0, y: 0, width: 500, height: 400 };

    it('should detect contained bounds', () => {
      const inner: Bounds = { x: 100, y: 100, width: 100, height: 100 };
      expect(canvasKernel.boundsContains(outer, inner)).toBe(true);
    });

    it('should detect non-contained bounds (overflow right)', () => {
      const inner: Bounds = { x: 450, y: 100, width: 100, height: 100 };
      expect(canvasKernel.boundsContains(outer, inner)).toBe(false);
    });

    it('should detect non-contained bounds (overflow left)', () => {
      const inner: Bounds = { x: -50, y: 100, width: 100, height: 100 };
      expect(canvasKernel.boundsContains(outer, inner)).toBe(false);
    });

    it('should detect exact match as contained', () => {
      expect(canvasKernel.boundsContains(outer, outer)).toBe(true);
    });
  });
});

// ============================================
// Bounds Calculation Tests
// ============================================

describe('Bounds Calculations', () => {
  describe('Calculate Bounds', () => {
    it('should calculate bounds for multiple elements', () => {
      const elements: Bounds[] = [
        { x: 100, y: 100, width: 50, height: 50 },
        { x: 200, y: 150, width: 100, height: 80 },
        { x: 50, y: 200, width: 60, height: 40 }
      ];

      const bounds = canvasKernel.calculateBounds(elements);

      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBe(50);
      expect(bounds!.y).toBe(100);
      expect(bounds!.width).toBe(250); // 300 - 50
      expect(bounds!.height).toBe(140); // 240 - 100
    });

    it('should return null for empty array', () => {
      const bounds = canvasKernel.calculateBounds([]);
      expect(bounds).toBeNull();
    });

    it('should return same bounds for single element', () => {
      const element: Bounds = { x: 100, y: 100, width: 50, height: 50 };
      const bounds = canvasKernel.calculateBounds([element]);

      expect(bounds).toEqual(element);
    });
  });

  describe('Bounds Center', () => {
    it('should calculate center correctly', () => {
      const bounds: Bounds = { x: 100, y: 100, width: 200, height: 100 };
      const center = canvasKernel.getBoundsCenter(bounds);

      expect(center.x).toBe(200);
      expect(center.y).toBe(150);
    });

    it('should handle origin bounds', () => {
      const bounds: Bounds = { x: 0, y: 0, width: 100, height: 100 };
      const center = canvasKernel.getBoundsCenter(bounds);

      expect(center.x).toBe(50);
      expect(center.y).toBe(50);
    });
  });

  describe('Expand Bounds', () => {
    it('should expand bounds by padding', () => {
      const bounds: Bounds = { x: 100, y: 100, width: 200, height: 100 };
      const expanded = canvasKernel.expandBounds(bounds, 20);

      expect(expanded.x).toBe(80);
      expect(expanded.y).toBe(80);
      expect(expanded.width).toBe(240);
      expect(expanded.height).toBe(140);
    });

    it('should handle zero padding', () => {
      const bounds: Bounds = { x: 100, y: 100, width: 200, height: 100 };
      const expanded = canvasKernel.expandBounds(bounds, 0);

      expect(expanded).toEqual(bounds);
    });
  });

  describe('Merge Bounds', () => {
    it('should merge multiple bounds', () => {
      const boundsArray: Bounds[] = [
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 150, y: 50, width: 100, height: 100 }
      ];

      const merged = canvasKernel.mergeBounds(boundsArray);

      expect(merged).not.toBeNull();
      expect(merged!.x).toBe(0);
      expect(merged!.y).toBe(0);
      expect(merged!.width).toBe(250);
      expect(merged!.height).toBe(150);
    });
  });
});

// ============================================
// Grid Snapping Tests
// ============================================

describe('Grid Snapping', () => {
  describe('Snap to Grid', () => {
    it('should snap value to nearest grid line', () => {
      expect(canvasKernel.snapToGrid(15, 20)).toBe(20);
      expect(canvasKernel.snapToGrid(9, 20)).toBe(0);
      expect(canvasKernel.snapToGrid(10, 20)).toBe(20);
    });

    it('should handle exact grid values', () => {
      expect(canvasKernel.snapToGrid(40, 20)).toBe(40);
    });

    it('should handle different grid sizes', () => {
      expect(canvasKernel.snapToGrid(7, 10)).toBe(10);
      expect(canvasKernel.snapToGrid(7, 5)).toBe(5);
      expect(canvasKernel.snapToGrid(7, 15)).toBe(0);
    });

    it('should handle negative values', () => {
      expect(canvasKernel.snapToGrid(-15, 20)).toBe(-20);
      expect(canvasKernel.snapToGrid(-9, 20)).toBe(0);
    });
  });

  describe('Snap Point to Grid', () => {
    it('should snap point to grid', () => {
      const point = { x: 123, y: 167 };
      const snapped = canvasKernel.snapPointToGrid(point, 20);

      expect(snapped.x).toBe(120);
      expect(snapped.y).toBe(160);
    });

    it('should handle point at origin', () => {
      const point = { x: 5, y: 5 };
      const snapped = canvasKernel.snapPointToGrid(point, 10);

      expect(snapped.x).toBe(0);
      expect(snapped.y).toBe(0);
    });
  });
});

// ============================================
// Distance Calculation Tests
// ============================================

describe('Distance Calculations', () => {
  it('should calculate horizontal distance', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 0 };

    expect(canvasKernel.distance(p1, p2)).toBe(100);
  });

  it('should calculate vertical distance', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 0, y: 100 };

    expect(canvasKernel.distance(p1, p2)).toBe(100);
  });

  it('should calculate diagonal distance', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };

    expect(canvasKernel.distance(p1, p2)).toBe(5);
  });

  it('should return 0 for same point', () => {
    const p1 = { x: 100, y: 100 };
    const p2 = { x: 100, y: 100 };

    expect(canvasKernel.distance(p1, p2)).toBe(0);
  });

  it('should handle negative coordinates', () => {
    const p1 = { x: -10, y: -10 };
    const p2 = { x: 10, y: 10 };

    expect(canvasKernel.distance(p1, p2)).toBeCloseTo(28.28, 1);
  });
});

// ============================================
// Camera Fitting Tests
// ============================================

describe('Camera Fitting', () => {
  describe('Get Camera to Fit Bounds', () => {
    it('should fit bounds in viewport', () => {
      const bounds: Bounds = { x: 100, y: 100, width: 400, height: 300 };
      const viewportSize: Size = { width: 800, height: 600 };

      const camera = canvasKernel.getCameraToFitBounds(bounds, viewportSize);

      expect(camera.zoom).toBeLessThanOrEqual(1);
      expect(camera.zoom).toBeGreaterThan(0);
    });

    it('should center content in viewport', () => {
      const bounds: Bounds = { x: 0, y: 0, width: 200, height: 200 };
      const viewportSize: Size = { width: 800, height: 600 };

      const camera = canvasKernel.getCameraToFitBounds(bounds, viewportSize, 0);

      // التحقق من أن مركز المحتوى في مركز الـ viewport
      const center = canvasKernel.getBoundsCenter(bounds);
      const screenCenter = canvasKernel.worldToScreen(center.x, center.y, camera);

      expect(screenCenter.x).toBeCloseTo(viewportSize.width / 2, 0);
      expect(screenCenter.y).toBeCloseTo(viewportSize.height / 2, 0);
    });

    it('should respect max zoom', () => {
      const bounds: Bounds = { x: 0, y: 0, width: 50, height: 50 };
      const viewportSize: Size = { width: 800, height: 600 };
      const maxZoom = 1;

      const camera = canvasKernel.getCameraToFitBounds(bounds, viewportSize, 0, maxZoom);

      expect(camera.zoom).toBeLessThanOrEqual(maxZoom);
    });

    it('should apply padding', () => {
      const bounds: Bounds = { x: 0, y: 0, width: 700, height: 500 };
      const viewportSize: Size = { width: 800, height: 600 };
      const padding = 50;

      const camera = canvasKernel.getCameraToFitBounds(bounds, viewportSize, padding);

      // مع padding، الـ zoom يجب أن يكون أقل مما لو لم يكن هناك padding
      const cameraWithoutPadding = canvasKernel.getCameraToFitBounds(bounds, viewportSize, 0);

      expect(camera.zoom).toBeLessThanOrEqual(cameraWithoutPadding.zoom);
    });
  });
});

// ============================================
// Matrix Transformation Tests
// ============================================

describe('Matrix Transformations', () => {
  describe('Transform Point with Matrix', () => {
    it('should apply identity matrix', () => {
      const point = { x: 100, y: 200 };
      const identity = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

      const transformed = canvasKernel.transformPoint(point, identity);

      expect(transformed.x).toBe(100);
      expect(transformed.y).toBe(200);
    });

    it('should apply translation matrix', () => {
      const point = { x: 100, y: 200 };
      const translation = { a: 1, b: 0, c: 0, d: 1, e: 50, f: 100 };

      const transformed = canvasKernel.transformPoint(point, translation);

      expect(transformed.x).toBe(150);
      expect(transformed.y).toBe(300);
    });

    it('should apply scale matrix', () => {
      const point = { x: 100, y: 200 };
      const scale = { a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 };

      const transformed = canvasKernel.transformPoint(point, scale);

      expect(transformed.x).toBe(200);
      expect(transformed.y).toBe(400);
    });

    it('should apply combined transformation', () => {
      const point = { x: 100, y: 100 };
      // Scale by 2 then translate by (50, 50)
      const combined = { a: 2, b: 0, c: 0, d: 2, e: 50, f: 50 };

      const transformed = canvasKernel.transformPoint(point, combined);

      expect(transformed.x).toBe(250); // 100 * 2 + 50
      expect(transformed.y).toBe(250); // 100 * 2 + 50
    });
  });
});

// ============================================
// Performance Tests
// ============================================

describe('Performance', () => {
  it('should perform 10000 screen-to-world transformations efficiently', () => {
    const camera: Camera = { x: 100, y: 50, zoom: 1.5 };
    const startTime = performance.now();

    for (let i = 0; i < 10000; i++) {
      canvasKernel.screenToWorld(Math.random() * 1000, Math.random() * 1000, camera);
    }

    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(50);
  });

  it('should perform 10000 bounds intersection tests efficiently', () => {
    const boundsA: Bounds = { x: 100, y: 100, width: 100, height: 100 };
    const startTime = performance.now();

    for (let i = 0; i < 10000; i++) {
      const boundsB: Bounds = {
        x: Math.random() * 500,
        y: Math.random() * 500,
        width: 50,
        height: 50
      };
      canvasKernel.boundsIntersect(boundsA, boundsB);
    }

    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(50);
  });

  it('should calculate bounds for 1000 elements efficiently', () => {
    const elements: Bounds[] = Array.from({ length: 1000 }, (_, i) => ({
      x: Math.random() * 10000,
      y: Math.random() * 10000,
      width: 100,
      height: 100
    }));

    const startTime = performance.now();
    canvasKernel.calculateBounds(elements);
    const duration = performance.now() - startTime;

    expect(duration).toBeLessThan(20);
  });
});

// ============================================
// Edge Cases Tests
// ============================================

describe('Edge Cases', () => {
  it('should handle very small zoom', () => {
    const camera: Camera = { x: 0, y: 0, zoom: 0.01 };
    const worldPoint = canvasKernel.screenToWorld(100, 100, camera);

    expect(worldPoint.x).toBe(10000);
    expect(worldPoint.y).toBe(10000);
  });

  it('should handle very large zoom', () => {
    const camera: Camera = { x: 0, y: 0, zoom: 100 };
    const worldPoint = canvasKernel.screenToWorld(100, 100, camera);

    expect(worldPoint.x).toBe(1);
    expect(worldPoint.y).toBe(1);
  });

  it('should handle very large coordinates', () => {
    const camera: Camera = { x: 0, y: 0, zoom: 1 };
    const worldPoint = canvasKernel.screenToWorld(1000000, 1000000, camera);

    expect(worldPoint.x).toBe(1000000);
    expect(worldPoint.y).toBe(1000000);
  });

  it('should handle floating point precision', () => {
    const camera: Camera = { x: 0.1, y: 0.2, zoom: 0.333 };
    const world = canvasKernel.screenToWorld(100.5, 200.7, camera);
    const backToScreen = canvasKernel.worldToScreen(world.x, world.y, camera);

    expect(backToScreen.x).toBeCloseTo(100.5, 5);
    expect(backToScreen.y).toBeCloseTo(200.7, 5);
  });

  it('should handle zero-size bounds', () => {
    const bounds: Bounds = { x: 100, y: 100, width: 0, height: 0 };
    const center = canvasKernel.getBoundsCenter(bounds);

    expect(center.x).toBe(100);
    expect(center.y).toBe(100);
  });

  it('should handle negative size bounds', () => {
    // هذا سيناريو غير صالح لكن يجب ألا يسبب خطأ
    const bounds: Bounds = { x: 100, y: 100, width: -50, height: -50 };
    const center = canvasKernel.getBoundsCenter(bounds);

    expect(center.x).toBe(75);
    expect(center.y).toBe(75);
  });
});
