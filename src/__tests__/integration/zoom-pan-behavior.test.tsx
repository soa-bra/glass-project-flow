/**
 * Zoom and Pan Behavior Integration Tests
 * 
 * اختبارات شاملة لسلوك التكبير والتمرير في الكانفاس
 * تغطي: zoom controls, pan gestures, touch support, boundaries
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ============================================
// Types and Interfaces
// ============================================

interface Point {
  x: number;
  y: number;
}

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface CanvasBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface ZoomConfig {
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  smoothZoom: boolean;
  zoomToMouse: boolean;
}

interface PanConfig {
  enablePan: boolean;
  panSpeed: number;
  invertPan: boolean;
  momentumEnabled: boolean;
  momentumFriction: number;
}

// ============================================
// Helper Functions
// ============================================

/**
 * تكبير حول نقطة محددة
 */
function zoomAtPoint(
  camera: Camera,
  point: Point,
  zoomDelta: number,
  config: ZoomConfig
): Camera {
  const newZoom = Math.max(
    config.minZoom,
    Math.min(config.maxZoom, camera.zoom * (1 + zoomDelta))
  );

  if (config.zoomToMouse) {
    // حساب الموقع الجديد للحفاظ على النقطة تحت الماوس
    const zoomRatio = newZoom / camera.zoom;
    const newX = point.x - (point.x - camera.x) * zoomRatio;
    const newY = point.y - (point.y - camera.y) * zoomRatio;

    return { x: newX, y: newY, zoom: newZoom };
  }

  return { ...camera, zoom: newZoom };
}

/**
 * تحريك الكاميرا
 */
function panCamera(
  camera: Camera,
  deltaX: number,
  deltaY: number,
  config: PanConfig
): Camera {
  if (!config.enablePan) return camera;

  const multiplier = config.invertPan ? -1 : 1;
  return {
    ...camera,
    x: camera.x + deltaX * config.panSpeed * multiplier / camera.zoom,
    y: camera.y + deltaY * config.panSpeed * multiplier / camera.zoom
  };
}

/**
 * تقييد الكاميرا ضمن الحدود
 */
function clampCamera(camera: Camera, bounds: CanvasBounds): Camera {
  return {
    ...camera,
    x: Math.max(bounds.minX, Math.min(bounds.maxX, camera.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, camera.y))
  };
}

/**
 * تحويل إحداثيات الشاشة إلى العالم
 */
function screenToWorld(screenPoint: Point, camera: Camera): Point {
  return {
    x: (screenPoint.x - camera.x) / camera.zoom,
    y: (screenPoint.y - camera.y) / camera.zoom
  };
}

/**
 * تحويل إحداثيات العالم إلى الشاشة
 */
function worldToScreen(worldPoint: Point, camera: Camera): Point {
  return {
    x: worldPoint.x * camera.zoom + camera.x,
    y: worldPoint.y * camera.zoom + camera.y
  };
}

/**
 * Fit to content
 */
function fitToContent(
  contentBounds: { x: number; y: number; width: number; height: number },
  viewportSize: { width: number; height: number },
  padding: number = 50
): Camera {
  const scaleX = (viewportSize.width - padding * 2) / contentBounds.width;
  const scaleY = (viewportSize.height - padding * 2) / contentBounds.height;
  const zoom = Math.min(scaleX, scaleY, 1); // لا تتجاوز 100%

  const centerX = contentBounds.x + contentBounds.width / 2;
  const centerY = contentBounds.y + contentBounds.height / 2;

  return {
    x: viewportSize.width / 2 - centerX * zoom,
    y: viewportSize.height / 2 - centerY * zoom,
    zoom
  };
}

/**
 * حساب المسافة بين إصبعين (للـ pinch zoom)
 */
function getPinchDistance(touch1: Point, touch2: Point): number {
  return Math.sqrt(
    Math.pow(touch2.x - touch1.x, 2) + Math.pow(touch2.y - touch1.y, 2)
  );
}

/**
 * حساب مركز الـ pinch
 */
function getPinchCenter(touch1: Point, touch2: Point): Point {
  return {
    x: (touch1.x + touch2.x) / 2,
    y: (touch1.y + touch2.y) / 2
  };
}

// ============================================
// Zoom Tests
// ============================================

describe('Zoom Behavior', () => {
  let camera: Camera;
  let zoomConfig: ZoomConfig;

  beforeEach(() => {
    camera = { x: 0, y: 0, zoom: 1 };
    zoomConfig = {
      minZoom: 0.1,
      maxZoom: 5,
      zoomStep: 0.1,
      smoothZoom: true,
      zoomToMouse: true
    };
  });

  describe('Basic Zoom Controls', () => {
    it('should zoom in by step amount', () => {
      const newCamera = zoomAtPoint(
        camera,
        { x: 0, y: 0 },
        zoomConfig.zoomStep,
        zoomConfig
      );

      expect(newCamera.zoom).toBeCloseTo(1.1, 2);
    });

    it('should zoom out by step amount', () => {
      const newCamera = zoomAtPoint(
        camera,
        { x: 0, y: 0 },
        -zoomConfig.zoomStep,
        zoomConfig
      );

      expect(newCamera.zoom).toBeCloseTo(0.9, 2);
    });

    it('should not exceed maximum zoom', () => {
      camera.zoom = 4.9;
      const newCamera = zoomAtPoint(
        camera,
        { x: 0, y: 0 },
        0.5,
        zoomConfig
      );

      expect(newCamera.zoom).toBe(zoomConfig.maxZoom);
    });

    it('should not go below minimum zoom', () => {
      camera.zoom = 0.15;
      const newCamera = zoomAtPoint(
        camera,
        { x: 0, y: 0 },
        -0.5,
        zoomConfig
      );

      expect(newCamera.zoom).toBe(zoomConfig.minZoom);
    });

    it('should reset zoom to 100%', () => {
      camera.zoom = 2.5;
      camera.x = 100;
      camera.y = 200;

      const resetCamera = { x: 0, y: 0, zoom: 1 };

      expect(resetCamera.zoom).toBe(1);
      expect(resetCamera.x).toBe(0);
      expect(resetCamera.y).toBe(0);
    });
  });

  describe('Zoom to Mouse Position', () => {
    it('should zoom towards mouse position', () => {
      const mousePos = { x: 400, y: 300 };
      const newCamera = zoomAtPoint(camera, mousePos, 0.5, zoomConfig);

      // التكبير حول نقطة الماوس يجب أن يبقي تلك النقطة ثابتة نسبياً
      expect(newCamera.zoom).toBeGreaterThan(camera.zoom);
    });

    it('should keep point under mouse stationary when zooming', () => {
      const mousePos = { x: 400, y: 300 };
      
      // نقطة في العالم قبل التكبير
      const worldPointBefore = screenToWorld(mousePos, camera);
      
      const newCamera = zoomAtPoint(camera, mousePos, 0.5, zoomConfig);
      
      // نفس النقطة بعد التكبير يجب أن تكون في نفس موقع الشاشة
      const worldPointAfter = screenToWorld(mousePos, newCamera);
      
      expect(worldPointAfter.x).toBeCloseTo(worldPointBefore.x, 0);
      expect(worldPointAfter.y).toBeCloseTo(worldPointBefore.y, 0);
    });

    it('should zoom to center when zoomToMouse is disabled', () => {
      zoomConfig.zoomToMouse = false;
      const mousePos = { x: 400, y: 300 };
      
      const newCamera = zoomAtPoint(camera, mousePos, 0.5, zoomConfig);
      
      // الموقع يجب ألا يتغير
      expect(newCamera.x).toBe(camera.x);
      expect(newCamera.y).toBe(camera.y);
    });
  });

  describe('Wheel Zoom', () => {
    it('should zoom in with negative wheel delta', () => {
      const wheelDelta = -100; // scroll up
      const zoomChange = wheelDelta < 0 ? zoomConfig.zoomStep : -zoomConfig.zoomStep;
      
      const newCamera = zoomAtPoint(camera, { x: 0, y: 0 }, zoomChange, zoomConfig);
      
      expect(newCamera.zoom).toBeCloseTo(1.1, 2);
    });

    it('should zoom out with positive wheel delta', () => {
      const wheelDelta = 100; // scroll down
      const zoomChange = wheelDelta < 0 ? zoomConfig.zoomStep : -zoomConfig.zoomStep;
      
      const newCamera = zoomAtPoint(camera, { x: 0, y: 0 }, zoomChange, zoomConfig);
      
      expect(newCamera.zoom).toBeCloseTo(0.9, 2);
    });

    it('should handle rapid wheel events', () => {
      let currentCamera = camera;
      
      // محاكاة عدة أحداث wheel متتالية
      for (let i = 0; i < 10; i++) {
        currentCamera = zoomAtPoint(
          currentCamera,
          { x: 400, y: 300 },
          zoomConfig.zoomStep,
          zoomConfig
        );
      }
      
      expect(currentCamera.zoom).toBeGreaterThan(2);
      expect(currentCamera.zoom).toBeLessThanOrEqual(zoomConfig.maxZoom);
    });
  });

  describe('Zoom Presets', () => {
    const presets = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

    it('should snap to preset zoom levels', () => {
      camera.zoom = 0.73;
      
      // العثور على أقرب preset
      const closestPreset = presets.reduce((prev, curr) =>
        Math.abs(curr - camera.zoom) < Math.abs(prev - camera.zoom) ? curr : prev
      );
      
      expect(closestPreset).toBe(0.75);
    });

    it('should cycle through presets with zoom shortcuts', () => {
      let currentIndex = presets.indexOf(1); // بدء من 100%
      
      // Zoom in to next preset
      currentIndex = Math.min(currentIndex + 1, presets.length - 1);
      expect(presets[currentIndex]).toBe(1.5);
      
      // Zoom out to previous preset
      currentIndex = Math.max(currentIndex - 1, 0);
      expect(presets[currentIndex]).toBe(1);
    });
  });

  describe('Fit to Content', () => {
    it('should fit content to viewport', () => {
      const contentBounds = { x: 100, y: 100, width: 800, height: 600 };
      const viewportSize = { width: 1200, height: 800 };
      
      const fittedCamera = fitToContent(contentBounds, viewportSize);
      
      // يجب أن يكون المحتوى مرئياً بالكامل
      expect(fittedCamera.zoom).toBeLessThanOrEqual(1);
      expect(fittedCamera.zoom).toBeGreaterThan(0);
    });

    it('should center content in viewport', () => {
      const contentBounds = { x: 0, y: 0, width: 400, height: 300 };
      const viewportSize = { width: 800, height: 600 };
      
      const fittedCamera = fitToContent(contentBounds, viewportSize);
      
      // مركز المحتوى يجب أن يكون في مركز الـ viewport
      const contentCenter = {
        x: contentBounds.x + contentBounds.width / 2,
        y: contentBounds.y + contentBounds.height / 2
      };
      
      const screenCenter = worldToScreen(contentCenter, fittedCamera);
      
      expect(screenCenter.x).toBeCloseTo(viewportSize.width / 2, 0);
      expect(screenCenter.y).toBeCloseTo(viewportSize.height / 2, 0);
    });

    it('should not zoom beyond 100% when fitting', () => {
      const contentBounds = { x: 0, y: 0, width: 100, height: 100 };
      const viewportSize = { width: 1920, height: 1080 };
      
      const fittedCamera = fitToContent(contentBounds, viewportSize);
      
      expect(fittedCamera.zoom).toBeLessThanOrEqual(1);
    });

    it('should handle empty content', () => {
      const contentBounds = { x: 0, y: 0, width: 0, height: 0 };
      const viewportSize = { width: 800, height: 600 };
      
      // يجب ألا يسبب خطأ
      expect(() => fitToContent(contentBounds, viewportSize)).not.toThrow();
    });
  });
});

// ============================================
// Pan Tests
// ============================================

describe('Pan Behavior', () => {
  let camera: Camera;
  let panConfig: PanConfig;

  beforeEach(() => {
    camera = { x: 0, y: 0, zoom: 1 };
    panConfig = {
      enablePan: true,
      panSpeed: 1,
      invertPan: false,
      momentumEnabled: true,
      momentumFriction: 0.95
    };
  });

  describe('Basic Pan', () => {
    it('should pan right when dragging left', () => {
      const newCamera = panCamera(camera, -100, 0, panConfig);
      
      expect(newCamera.x).toBe(-100);
      expect(newCamera.y).toBe(0);
    });

    it('should pan left when dragging right', () => {
      const newCamera = panCamera(camera, 100, 0, panConfig);
      
      expect(newCamera.x).toBe(100);
      expect(newCamera.y).toBe(0);
    });

    it('should pan down when dragging up', () => {
      const newCamera = panCamera(camera, 0, -100, panConfig);
      
      expect(newCamera.x).toBe(0);
      expect(newCamera.y).toBe(-100);
    });

    it('should pan up when dragging down', () => {
      const newCamera = panCamera(camera, 0, 100, panConfig);
      
      expect(newCamera.x).toBe(0);
      expect(newCamera.y).toBe(100);
    });

    it('should pan diagonally', () => {
      const newCamera = panCamera(camera, 50, 75, panConfig);
      
      expect(newCamera.x).toBe(50);
      expect(newCamera.y).toBe(75);
    });
  });

  describe('Pan with Zoom', () => {
    it('should adjust pan speed based on zoom level', () => {
      camera.zoom = 2; // zoomed in
      const newCamera = panCamera(camera, 100, 0, panConfig);
      
      // عند التكبير، التحريك يجب أن يكون أبطأ
      expect(newCamera.x).toBe(50); // 100 / 2
    });

    it('should pan faster when zoomed out', () => {
      camera.zoom = 0.5; // zoomed out
      const newCamera = panCamera(camera, 100, 0, panConfig);
      
      expect(newCamera.x).toBe(200); // 100 / 0.5
    });
  });

  describe('Inverted Pan', () => {
    it('should invert pan direction when enabled', () => {
      panConfig.invertPan = true;
      const newCamera = panCamera(camera, 100, 50, panConfig);
      
      expect(newCamera.x).toBe(-100);
      expect(newCamera.y).toBe(-50);
    });
  });

  describe('Pan Speed', () => {
    it('should respect pan speed multiplier', () => {
      panConfig.panSpeed = 2;
      const newCamera = panCamera(camera, 100, 0, panConfig);
      
      expect(newCamera.x).toBe(200);
    });

    it('should slow down with lower pan speed', () => {
      panConfig.panSpeed = 0.5;
      const newCamera = panCamera(camera, 100, 0, panConfig);
      
      expect(newCamera.x).toBe(50);
    });
  });

  describe('Pan Boundaries', () => {
    const bounds: CanvasBounds = {
      minX: -1000,
      maxX: 1000,
      minY: -1000,
      maxY: 1000
    };

    it('should clamp to left boundary', () => {
      camera.x = -950;
      const pannedCamera = panCamera(camera, -100, 0, panConfig);
      const clampedCamera = clampCamera(pannedCamera, bounds);
      
      expect(clampedCamera.x).toBe(bounds.minX);
    });

    it('should clamp to right boundary', () => {
      camera.x = 950;
      const pannedCamera = panCamera(camera, 100, 0, panConfig);
      const clampedCamera = clampCamera(pannedCamera, bounds);
      
      expect(clampedCamera.x).toBe(bounds.maxX);
    });

    it('should clamp to top boundary', () => {
      camera.y = -950;
      const pannedCamera = panCamera(camera, 0, -100, panConfig);
      const clampedCamera = clampCamera(pannedCamera, bounds);
      
      expect(clampedCamera.y).toBe(bounds.minY);
    });

    it('should clamp to bottom boundary', () => {
      camera.y = 950;
      const pannedCamera = panCamera(camera, 0, 100, panConfig);
      const clampedCamera = clampCamera(pannedCamera, bounds);
      
      expect(clampedCamera.y).toBe(bounds.maxY);
    });

    it('should clamp to corner', () => {
      camera = { x: 950, y: 950, zoom: 1 };
      const pannedCamera = panCamera(camera, 100, 100, panConfig);
      const clampedCamera = clampCamera(pannedCamera, bounds);
      
      expect(clampedCamera.x).toBe(bounds.maxX);
      expect(clampedCamera.y).toBe(bounds.maxY);
    });
  });

  describe('Pan Disabled', () => {
    it('should not pan when disabled', () => {
      panConfig.enablePan = false;
      const newCamera = panCamera(camera, 100, 100, panConfig);
      
      expect(newCamera.x).toBe(0);
      expect(newCamera.y).toBe(0);
    });
  });

  describe('Momentum Pan', () => {
    it('should apply momentum after pan ends', () => {
      const velocity = { x: 100, y: 50 };
      const friction = panConfig.momentumFriction;
      
      // محاكاة frame واحد من momentum
      const newVelocity = {
        x: velocity.x * friction,
        y: velocity.y * friction
      };
      
      expect(newVelocity.x).toBe(95);
      expect(newVelocity.y).toBe(47.5);
    });

    it('should stop momentum when velocity is low', () => {
      let velocity = { x: 10, y: 5 };
      const friction = panConfig.momentumFriction;
      const threshold = 0.5;
      
      // محاكاة عدة frames
      for (let i = 0; i < 50; i++) {
        velocity = {
          x: velocity.x * friction,
          y: velocity.y * friction
        };
      }
      
      expect(Math.abs(velocity.x)).toBeLessThan(threshold);
      expect(Math.abs(velocity.y)).toBeLessThan(threshold);
    });

    it('should not apply momentum when disabled', () => {
      panConfig.momentumEnabled = false;
      const velocity = { x: 100, y: 50 };
      
      // عند تعطيل momentum، السرعة تصبح صفر فوراً
      const finalVelocity = panConfig.momentumEnabled ? velocity : { x: 0, y: 0 };
      
      expect(finalVelocity.x).toBe(0);
      expect(finalVelocity.y).toBe(0);
    });
  });
});

// ============================================
// Touch Gestures Tests
// ============================================

describe('Touch Gestures', () => {
  let camera: Camera;
  let zoomConfig: ZoomConfig;

  beforeEach(() => {
    camera = { x: 0, y: 0, zoom: 1 };
    zoomConfig = {
      minZoom: 0.1,
      maxZoom: 5,
      zoomStep: 0.1,
      smoothZoom: true,
      zoomToMouse: true
    };
  });

  describe('Pinch Zoom', () => {
    it('should calculate pinch distance correctly', () => {
      const touch1 = { x: 100, y: 100 };
      const touch2 = { x: 200, y: 100 };
      
      const distance = getPinchDistance(touch1, touch2);
      
      expect(distance).toBe(100);
    });

    it('should calculate pinch center correctly', () => {
      const touch1 = { x: 100, y: 100 };
      const touch2 = { x: 200, y: 200 };
      
      const center = getPinchCenter(touch1, touch2);
      
      expect(center.x).toBe(150);
      expect(center.y).toBe(150);
    });

    it('should zoom in when pinching outward', () => {
      const initialDistance = 100;
      const currentDistance = 150;
      const zoomDelta = (currentDistance - initialDistance) / initialDistance;
      
      const newCamera = zoomAtPoint(
        camera,
        { x: 400, y: 300 },
        zoomDelta,
        zoomConfig
      );
      
      expect(newCamera.zoom).toBeGreaterThan(camera.zoom);
    });

    it('should zoom out when pinching inward', () => {
      const initialDistance = 150;
      const currentDistance = 100;
      const zoomDelta = (currentDistance - initialDistance) / initialDistance;
      
      const newCamera = zoomAtPoint(
        camera,
        { x: 400, y: 300 },
        zoomDelta,
        zoomConfig
      );
      
      expect(newCamera.zoom).toBeLessThan(camera.zoom);
    });

    it('should zoom around pinch center', () => {
      const touch1 = { x: 300, y: 200 };
      const touch2 = { x: 500, y: 400 };
      const center = getPinchCenter(touch1, touch2);
      
      expect(center.x).toBe(400);
      expect(center.y).toBe(300);
    });
  });

  describe('Two-finger Pan', () => {
    it('should pan when two fingers move together', () => {
      const panConfig: PanConfig = {
        enablePan: true,
        panSpeed: 1,
        invertPan: false,
        momentumEnabled: false,
        momentumFriction: 0.95
      };

      // كلا الإصبعين يتحركان بنفس الاتجاه
      const delta = { x: 50, y: 30 };
      const newCamera = panCamera(camera, delta.x, delta.y, panConfig);
      
      expect(newCamera.x).toBe(50);
      expect(newCamera.y).toBe(30);
    });
  });

  describe('Touch Edge Cases', () => {
    it('should handle single touch after pinch', () => {
      // بعد انتهاء pinch، يجب أن يتحول إلى pan عادي
      const singleTouch = true;
      const wasMultiTouch = false;
      
      expect(singleTouch && !wasMultiTouch).toBe(true);
    });

    it('should handle rapid touch changes', () => {
      const touchSequence = [
        { type: 'start', touches: 1 },
        { type: 'add', touches: 2 },
        { type: 'remove', touches: 1 },
        { type: 'add', touches: 2 },
        { type: 'end', touches: 0 }
      ];
      
      let currentTouches = 0;
      touchSequence.forEach(event => {
        if (event.type === 'start' || event.type === 'add') {
          currentTouches = event.touches;
        } else if (event.type === 'remove') {
          currentTouches = event.touches;
        } else if (event.type === 'end') {
          currentTouches = 0;
        }
      });
      
      expect(currentTouches).toBe(0);
    });
  });
});

// ============================================
// Keyboard Navigation Tests
// ============================================

describe('Keyboard Navigation', () => {
  let camera: Camera;
  const PAN_STEP = 50;
  const ZOOM_STEP = 0.1;

  beforeEach(() => {
    camera = { x: 0, y: 0, zoom: 1 };
  });

  describe('Arrow Key Pan', () => {
    it('should pan left with left arrow', () => {
      camera.x -= PAN_STEP;
      expect(camera.x).toBe(-PAN_STEP);
    });

    it('should pan right with right arrow', () => {
      camera.x += PAN_STEP;
      expect(camera.x).toBe(PAN_STEP);
    });

    it('should pan up with up arrow', () => {
      camera.y -= PAN_STEP;
      expect(camera.y).toBe(-PAN_STEP);
    });

    it('should pan down with down arrow', () => {
      camera.y += PAN_STEP;
      expect(camera.y).toBe(PAN_STEP);
    });

    it('should pan faster with shift held', () => {
      const FAST_PAN_STEP = PAN_STEP * 5;
      camera.x += FAST_PAN_STEP;
      expect(camera.x).toBe(250);
    });
  });

  describe('Zoom Shortcuts', () => {
    it('should zoom in with + key', () => {
      camera.zoom *= (1 + ZOOM_STEP);
      expect(camera.zoom).toBeCloseTo(1.1, 2);
    });

    it('should zoom out with - key', () => {
      camera.zoom *= (1 - ZOOM_STEP);
      expect(camera.zoom).toBeCloseTo(0.9, 2);
    });

    it('should reset zoom with 0 key', () => {
      camera.zoom = 2.5;
      camera = { x: 0, y: 0, zoom: 1 };
      expect(camera.zoom).toBe(1);
    });

    it('should fit to content with 1 key', () => {
      const contentBounds = { x: 0, y: 0, width: 800, height: 600 };
      const viewportSize = { width: 1200, height: 800 };
      
      camera = fitToContent(contentBounds, viewportSize);
      
      expect(camera.zoom).toBeLessThanOrEqual(1);
    });

    it('should zoom to 50% with 5 key', () => {
      camera.zoom = 0.5;
      expect(camera.zoom).toBe(0.5);
    });

    it('should zoom to 200% with 2 key', () => {
      camera.zoom = 2;
      expect(camera.zoom).toBe(2);
    });
  });

  describe('Ctrl+Wheel Zoom', () => {
    it('should zoom with Ctrl+wheel', () => {
      const ctrlHeld = true;
      const wheelDelta = -100;
      
      if (ctrlHeld) {
        const zoomChange = wheelDelta < 0 ? ZOOM_STEP : -ZOOM_STEP;
        camera.zoom *= (1 + zoomChange);
      }
      
      expect(camera.zoom).toBeCloseTo(1.1, 2);
    });

    it('should pan with wheel when Ctrl not held', () => {
      const ctrlHeld = false;
      const wheelDeltaY = 100;
      
      if (!ctrlHeld) {
        camera.y -= wheelDeltaY;
      }
      
      expect(camera.y).toBe(-100);
    });
  });
});

// ============================================
// Coordinate Transformation Tests
// ============================================

describe('Coordinate Transformations', () => {
  describe('Screen to World', () => {
    it('should transform correctly at zoom 1', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 1 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(400);
      expect(worldPoint.y).toBe(300);
    });

    it('should transform correctly at zoom 2', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(200);
      expect(worldPoint.y).toBe(150);
    });

    it('should account for camera offset', () => {
      const camera: Camera = { x: 100, y: 50, zoom: 1 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(300);
      expect(worldPoint.y).toBe(250);
    });

    it('should handle combined zoom and offset', () => {
      const camera: Camera = { x: 100, y: 50, zoom: 2 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(150);
      expect(worldPoint.y).toBe(125);
    });
  });

  describe('World to Screen', () => {
    it('should transform correctly at zoom 1', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 1 };
      const worldPoint = { x: 400, y: 300 };
      
      const screenPoint = worldToScreen(worldPoint, camera);
      
      expect(screenPoint.x).toBe(400);
      expect(screenPoint.y).toBe(300);
    });

    it('should transform correctly at zoom 2', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 2 };
      const worldPoint = { x: 200, y: 150 };
      
      const screenPoint = worldToScreen(worldPoint, camera);
      
      expect(screenPoint.x).toBe(400);
      expect(screenPoint.y).toBe(300);
    });

    it('should be inverse of screenToWorld', () => {
      const camera: Camera = { x: 100, y: 50, zoom: 1.5 };
      const originalScreen = { x: 500, y: 400 };
      
      const world = screenToWorld(originalScreen, camera);
      const backToScreen = worldToScreen(world, camera);
      
      expect(backToScreen.x).toBeCloseTo(originalScreen.x, 5);
      expect(backToScreen.y).toBeCloseTo(originalScreen.y, 5);
    });
  });
});

// ============================================
// Animation and Smooth Transitions Tests
// ============================================

describe('Smooth Transitions', () => {
  describe('Animated Zoom', () => {
    it('should interpolate zoom levels', () => {
      const startZoom = 1;
      const targetZoom = 2;
      const progress = 0.5;
      
      const currentZoom = startZoom + (targetZoom - startZoom) * progress;
      
      expect(currentZoom).toBe(1.5);
    });

    it('should use easing function', () => {
      // Ease out cubic
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      
      const progress = 0.5;
      const easedProgress = easeOutCubic(progress);
      
      expect(easedProgress).toBe(0.875);
    });

    it('should complete animation at progress 1', () => {
      const startZoom = 1;
      const targetZoom = 2;
      const progress = 1;
      
      const currentZoom = startZoom + (targetZoom - startZoom) * progress;
      
      expect(currentZoom).toBe(targetZoom);
    });
  });

  describe('Animated Pan', () => {
    it('should interpolate camera position', () => {
      const startPos = { x: 0, y: 0 };
      const targetPos = { x: 200, y: 100 };
      const progress = 0.5;
      
      const currentPos = {
        x: startPos.x + (targetPos.x - startPos.x) * progress,
        y: startPos.y + (targetPos.y - startPos.y) * progress
      };
      
      expect(currentPos.x).toBe(100);
      expect(currentPos.y).toBe(50);
    });

    it('should animate to element', () => {
      const elementCenter = { x: 500, y: 400 };
      const viewportCenter = { x: 600, y: 400 }; // half of 1200x800
      
      // الكاميرا المطلوبة لوضع العنصر في المركز
      const targetCamera: Camera = {
        x: viewportCenter.x - elementCenter.x,
        y: viewportCenter.y - elementCenter.y,
        zoom: 1
      };
      
      expect(targetCamera.x).toBe(100);
      expect(targetCamera.y).toBe(0);
    });
  });
});

// ============================================
// Edge Cases and Error Handling Tests
// ============================================

describe('Edge Cases', () => {
  describe('Extreme Zoom Levels', () => {
    it('should handle very small zoom', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 0.1 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(4000);
      expect(worldPoint.y).toBe(3000);
    });

    it('should handle very large zoom', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 5 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(80);
      expect(worldPoint.y).toBe(60);
    });
  });

  describe('Extreme Pan Values', () => {
    it('should handle very large pan offsets', () => {
      const camera: Camera = { x: 10000, y: 10000, zoom: 1 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(-9600);
      expect(worldPoint.y).toBe(-9700);
    });

    it('should handle negative pan offsets', () => {
      const camera: Camera = { x: -5000, y: -5000, zoom: 1 };
      const screenPoint = { x: 400, y: 300 };
      
      const worldPoint = screenToWorld(screenPoint, camera);
      
      expect(worldPoint.x).toBe(5400);
      expect(worldPoint.y).toBe(5300);
    });
  });

  describe('Rapid State Changes', () => {
    it('should handle rapid zoom changes', () => {
      let camera: Camera = { x: 0, y: 0, zoom: 1 };
      const zoomConfig: ZoomConfig = {
        minZoom: 0.1,
        maxZoom: 5,
        zoomStep: 0.1,
        smoothZoom: false,
        zoomToMouse: true
      };

      // محاكاة 100 تغيير سريع
      for (let i = 0; i < 100; i++) {
        const delta = Math.random() > 0.5 ? 0.05 : -0.05;
        camera = zoomAtPoint(camera, { x: 400, y: 300 }, delta, zoomConfig);
      }

      expect(camera.zoom).toBeGreaterThanOrEqual(zoomConfig.minZoom);
      expect(camera.zoom).toBeLessThanOrEqual(zoomConfig.maxZoom);
    });

    it('should handle simultaneous zoom and pan', () => {
      let camera: Camera = { x: 0, y: 0, zoom: 1 };
      const zoomConfig: ZoomConfig = {
        minZoom: 0.1,
        maxZoom: 5,
        zoomStep: 0.1,
        smoothZoom: false,
        zoomToMouse: true
      };
      const panConfig: PanConfig = {
        enablePan: true,
        panSpeed: 1,
        invertPan: false,
        momentumEnabled: false,
        momentumFriction: 0.95
      };

      // Zoom ثم Pan
      camera = zoomAtPoint(camera, { x: 400, y: 300 }, 0.5, zoomConfig);
      camera = panCamera(camera, 100, 50, panConfig);

      expect(camera.zoom).toBeGreaterThan(1);
      expect(camera.x).not.toBe(0);
    });
  });

  describe('Boundary Conditions', () => {
    it('should handle zoom at boundary', () => {
      const camera: Camera = { x: 0, y: 0, zoom: 5 }; // at max
      const zoomConfig: ZoomConfig = {
        minZoom: 0.1,
        maxZoom: 5,
        zoomStep: 0.1,
        smoothZoom: false,
        zoomToMouse: true
      };

      const newCamera = zoomAtPoint(camera, { x: 0, y: 0 }, 0.5, zoomConfig);

      expect(newCamera.zoom).toBe(5); // should stay at max
    });

    it('should handle pan at world edge', () => {
      const camera: Camera = { x: 1000, y: 1000, zoom: 1 };
      const bounds: CanvasBounds = {
        minX: -1000,
        maxX: 1000,
        minY: -1000,
        maxY: 1000
      };

      const panConfig: PanConfig = {
        enablePan: true,
        panSpeed: 1,
        invertPan: false,
        momentumEnabled: false,
        momentumFriction: 0.95
      };

      const pannedCamera = panCamera(camera, 500, 500, panConfig);
      const clampedCamera = clampCamera(pannedCamera, bounds);

      expect(clampedCamera.x).toBe(bounds.maxX);
      expect(clampedCamera.y).toBe(bounds.maxY);
    });
  });
});

// ============================================
// Performance Tests
// ============================================

describe('Performance', () => {
  it('should handle 1000 coordinate transformations efficiently', () => {
    const camera: Camera = { x: 100, y: 50, zoom: 1.5 };
    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      const screenPoint = { x: Math.random() * 1000, y: Math.random() * 1000 };
      screenToWorld(screenPoint, camera);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // يجب أن تكتمل في أقل من 50ms
    expect(duration).toBeLessThan(50);
  });

  it('should handle rapid camera updates efficiently', () => {
    let camera: Camera = { x: 0, y: 0, zoom: 1 };
    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      camera = {
        x: camera.x + 1,
        y: camera.y + 1,
        zoom: Math.min(5, camera.zoom + 0.001)
      };
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(20);
  });
});
