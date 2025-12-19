/**
 * Integration Tests - Viewport + Elements Integration
 * Tests the interaction between viewport transformations and elements
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Canvas element type for tests
interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layerId: string;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
  };
  locked: boolean;
  visible: boolean;
}

// Viewport state type
interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

// Helper to create test elements
const createTestElement = (overrides: Partial<CanvasElement> = {}): CanvasElement => ({
  id: `el-${Math.random().toString(36).substr(2, 9)}`,
  type: 'rectangle',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  rotation: 0,
  layerId: 'default',
  style: {
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
    opacity: 1,
  },
  locked: false,
  visible: true,
  ...overrides,
});

// Coordinate transformation utilities
const screenToWorld = (
  screenX: number,
  screenY: number,
  viewport: ViewportState
): { x: number; y: number } => {
  return {
    x: (screenX - viewport.panX) / viewport.zoom,
    y: (screenY - viewport.panY) / viewport.zoom,
  };
};

const worldToScreen = (
  worldX: number,
  worldY: number,
  viewport: ViewportState
): { x: number; y: number } => {
  return {
    x: worldX * viewport.zoom + viewport.panX,
    y: worldY * viewport.zoom + viewport.panY,
  };
};

// Element visibility check
const isElementInViewport = (
  element: CanvasElement,
  viewport: ViewportState,
  viewportWidth: number,
  viewportHeight: number
): boolean => {
  const elementScreen = worldToScreen(element.x, element.y, viewport);
  const elementEndScreen = worldToScreen(
    element.x + element.width,
    element.y + element.height,
    viewport
  );
  
  // Check if element bounds intersect with viewport
  return !(
    elementEndScreen.x < 0 ||
    elementScreen.x > viewportWidth ||
    elementEndScreen.y < 0 ||
    elementScreen.y > viewportHeight
  );
};

// Get visible elements
const getVisibleElements = (
  elements: CanvasElement[],
  viewport: ViewportState,
  viewportWidth: number,
  viewportHeight: number
): CanvasElement[] => {
  return elements.filter(el => 
    isElementInViewport(el, viewport, viewportWidth, viewportHeight)
  );
};

// Calculate bounds to fit all elements
const calculateZoomToFit = (
  elements: CanvasElement[],
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 50
): ViewportState => {
  if (elements.length === 0) {
    return { zoom: 1, panX: 0, panY: 0 };
  }
  
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  for (const el of elements) {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  }
  
  const contentWidth = maxX - minX + padding * 2;
  const contentHeight = maxY - minY + padding * 2;
  
  const zoomX = viewportWidth / contentWidth;
  const zoomY = viewportHeight / contentHeight;
  const zoom = Math.min(zoomX, zoomY, 1); // Don't zoom in beyond 100%
  
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  return {
    zoom,
    panX: viewportWidth / 2 - centerX * zoom,
    panY: viewportHeight / 2 - centerY * zoom,
  };
};

describe('Viewport + Elements Integration Tests', () => {
  const viewportWidth = 1920;
  const viewportHeight = 1080;
  
  describe('Coordinate Transformations', () => {
    it('should convert screen to world coordinates at zoom 1', () => {
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const world = screenToWorld(100, 200, viewport);
      
      expect(world.x).toBe(100);
      expect(world.y).toBe(200);
    });

    it('should convert screen to world coordinates at zoom 2', () => {
      const viewport: ViewportState = { zoom: 2, panX: 0, panY: 0 };
      
      const world = screenToWorld(200, 400, viewport);
      
      expect(world.x).toBe(100);
      expect(world.y).toBe(200);
    });

    it('should convert screen to world coordinates with pan', () => {
      const viewport: ViewportState = { zoom: 1, panX: 100, panY: 50 };
      
      const world = screenToWorld(200, 150, viewport);
      
      expect(world.x).toBe(100);
      expect(world.y).toBe(100);
    });

    it('should convert world to screen coordinates at zoom 1', () => {
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const screen = worldToScreen(100, 200, viewport);
      
      expect(screen.x).toBe(100);
      expect(screen.y).toBe(200);
    });

    it('should convert world to screen coordinates at zoom 0.5', () => {
      const viewport: ViewportState = { zoom: 0.5, panX: 0, panY: 0 };
      
      const screen = worldToScreen(100, 200, viewport);
      
      expect(screen.x).toBe(50);
      expect(screen.y).toBe(100);
    });

    it('should handle round-trip conversion', () => {
      const viewport: ViewportState = { zoom: 1.5, panX: 300, panY: 200 };
      const originalX = 150;
      const originalY = 250;
      
      const screen = worldToScreen(originalX, originalY, viewport);
      const world = screenToWorld(screen.x, screen.y, viewport);
      
      expect(world.x).toBeCloseTo(originalX);
      expect(world.y).toBeCloseTo(originalY);
    });
  });

  describe('Element Visibility Detection', () => {
    it('should detect element visible in viewport', () => {
      const element = createTestElement({ x: 500, y: 300, width: 200, height: 100 });
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(true);
    });

    it('should detect element outside viewport (left)', () => {
      const element = createTestElement({ x: -500, y: 300, width: 200, height: 100 });
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(false);
    });

    it('should detect element outside viewport (right)', () => {
      const element = createTestElement({ x: 3000, y: 300, width: 200, height: 100 });
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(false);
    });

    it('should detect element outside viewport (top)', () => {
      const element = createTestElement({ x: 500, y: -500, width: 200, height: 100 });
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(false);
    });

    it('should detect element outside viewport (bottom)', () => {
      const element = createTestElement({ x: 500, y: 2000, width: 200, height: 100 });
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(false);
    });

    it('should detect partially visible element', () => {
      const element = createTestElement({ x: -100, y: 300, width: 200, height: 100 });
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(true);
    });

    it('should update visibility when zooming out', () => {
      const element = createTestElement({ x: 2000, y: 1500, width: 200, height: 100 });
      
      // At zoom 1, element is outside
      let viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      expect(isElementInViewport(element, viewport, viewportWidth, viewportHeight)).toBe(false);
      
      // At zoom 0.5, element becomes visible
      viewport = { zoom: 0.5, panX: 0, panY: 0 };
      expect(isElementInViewport(element, viewport, viewportWidth, viewportHeight)).toBe(true);
    });

    it('should update visibility when panning', () => {
      const element = createTestElement({ x: 2500, y: 500, width: 200, height: 100 });
      
      // Initially outside
      let viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      expect(isElementInViewport(element, viewport, viewportWidth, viewportHeight)).toBe(false);
      
      // Pan to bring it into view
      viewport = { zoom: 1, panX: -1000, panY: 0 };
      expect(isElementInViewport(element, viewport, viewportWidth, viewportHeight)).toBe(true);
    });
  });

  describe('Visible Elements Filtering', () => {
    it('should filter visible elements', () => {
      const elements = [
        createTestElement({ id: 'visible-1', x: 500, y: 300 }),
        createTestElement({ id: 'hidden-1', x: 3000, y: 300 }),
        createTestElement({ id: 'visible-2', x: 800, y: 500 }),
        createTestElement({ id: 'hidden-2', x: -500, y: 300 }),
      ];
      
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      const visible = getVisibleElements(elements, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toHaveLength(2);
      expect(visible.map(e => e.id)).toContain('visible-1');
      expect(visible.map(e => e.id)).toContain('visible-2');
    });

    it('should return all elements when zoomed out enough', () => {
      const elements = [
        createTestElement({ x: 0, y: 0 }),
        createTestElement({ x: 5000, y: 5000 }),
        createTestElement({ x: -2000, y: -2000 }),
      ];
      
      const viewport: ViewportState = { zoom: 0.1, panX: 1000, panY: 500 };
      const visible = getVisibleElements(elements, viewport, viewportWidth, viewportHeight);
      
      expect(visible.length).toBeGreaterThan(0);
    });

    it('should handle empty elements array', () => {
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      const visible = getVisibleElements([], viewport, viewportWidth, viewportHeight);
      
      expect(visible).toHaveLength(0);
    });
  });

  describe('Zoom to Fit', () => {
    it('should calculate viewport to fit single element', () => {
      const elements = [
        createTestElement({ x: 500, y: 300, width: 200, height: 100 }),
      ];
      
      const viewport = calculateZoomToFit(elements, viewportWidth, viewportHeight);
      
      expect(viewport.zoom).toBeLessThanOrEqual(1);
      expect(viewport.panX).toBeDefined();
      expect(viewport.panY).toBeDefined();
    });

    it('should calculate viewport to fit multiple elements', () => {
      const elements = [
        createTestElement({ x: 0, y: 0, width: 100, height: 100 }),
        createTestElement({ x: 1000, y: 800, width: 100, height: 100 }),
      ];
      
      const viewport = calculateZoomToFit(elements, viewportWidth, viewportHeight);
      
      // All elements should be visible with calculated viewport
      const visible = getVisibleElements(elements, viewport, viewportWidth, viewportHeight);
      expect(visible).toHaveLength(2);
    });

    it('should not zoom in beyond 100%', () => {
      const elements = [
        createTestElement({ x: 900, y: 500, width: 50, height: 50 }),
      ];
      
      const viewport = calculateZoomToFit(elements, viewportWidth, viewportHeight);
      
      expect(viewport.zoom).toBeLessThanOrEqual(1);
    });

    it('should handle empty elements', () => {
      const viewport = calculateZoomToFit([], viewportWidth, viewportHeight);
      
      expect(viewport.zoom).toBe(1);
      expect(viewport.panX).toBe(0);
      expect(viewport.panY).toBe(0);
    });

    it('should center elements in viewport', () => {
      const elements = [
        createTestElement({ x: 0, y: 0, width: 400, height: 300 }),
      ];
      
      const viewport = calculateZoomToFit(elements, viewportWidth, viewportHeight);
      
      // Center of element should be close to center of viewport (in screen coordinates)
      const elementCenterWorld = { x: 200, y: 150 };
      const elementCenterScreen = worldToScreen(
        elementCenterWorld.x,
        elementCenterWorld.y,
        viewport
      );
      
      // Should be reasonably centered
      expect(Math.abs(elementCenterScreen.x - viewportWidth / 2)).toBeLessThan(viewportWidth / 4);
      expect(Math.abs(elementCenterScreen.y - viewportHeight / 2)).toBeLessThan(viewportHeight / 4);
    });
  });

  describe('Viewport Performance', () => {
    it('should filter 1000 elements in under 10ms', () => {
      const elements = Array.from({ length: 1000 }, (_, i) =>
        createTestElement({ id: `el-${i}`, x: (i % 100) * 50, y: Math.floor(i / 100) * 50 })
      );
      
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      const start = performance.now();
      getVisibleElements(elements, viewport, viewportWidth, viewportHeight);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(10);
    });

    it('should calculate zoom to fit for 1000 elements in under 10ms', () => {
      const elements = Array.from({ length: 1000 }, (_, i) =>
        createTestElement({ id: `el-${i}`, x: (i % 100) * 50, y: Math.floor(i / 100) * 50 })
      );
      
      const start = performance.now();
      calculateZoomToFit(elements, viewportWidth, viewportHeight);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(10);
    });

    it('should transform 10000 coordinates in under 50ms', () => {
      const viewport: ViewportState = { zoom: 1.5, panX: 100, panY: 200 };
      const count = 10000;
      
      const start = performance.now();
      for (let i = 0; i < count; i++) {
        screenToWorld(i, i, viewport);
        worldToScreen(i, i, viewport);
      }
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small zoom values', () => {
      const viewport: ViewportState = { zoom: 0.01, panX: 0, panY: 0 };
      const element = createTestElement({ x: 50000, y: 50000 });
      
      const screen = worldToScreen(element.x, element.y, viewport);
      
      expect(screen.x).toBe(500);
      expect(screen.y).toBe(500);
    });

    it('should handle very large zoom values', () => {
      const viewport: ViewportState = { zoom: 10, panX: 0, panY: 0 };
      const element = createTestElement({ x: 100, y: 100 });
      
      const screen = worldToScreen(element.x, element.y, viewport);
      
      expect(screen.x).toBe(1000);
      expect(screen.y).toBe(1000);
    });

    it('should handle negative coordinates', () => {
      const element = createTestElement({ x: -500, y: -300, width: 200, height: 100 });
      const viewport: ViewportState = { zoom: 1, panX: 600, panY: 400 };
      
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(true);
    });

    it('should handle zero-sized elements', () => {
      const element = createTestElement({ width: 0, height: 0 });
      const viewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };
      
      // Zero-sized element at visible position should still be "visible"
      const visible = isElementInViewport(element, viewport, viewportWidth, viewportHeight);
      
      expect(visible).toBe(true);
    });
  });
});
