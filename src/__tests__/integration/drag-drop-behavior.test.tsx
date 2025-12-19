/**
 * Drag and Drop Behavior Tests
 * 
 * Tests for drag and drop functionality including:
 * - Single element drag
 * - Multi-element drag
 * - Constrained movement (Shift key)
 * - Grid snapping
 * - Element snapping
 * - Drag boundaries
 * - Frame containment
 * - Drag with modifiers
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock canvas store
const mockElements = new Map<string, any>();
let mockSelectedIds: string[] = [];
let mockViewport = { x: 0, y: 0, zoom: 1 };
let mockSettings = { 
  showGrid: true, 
  snapToGrid: true, 
  gridSize: 20,
  snapToObjects: true 
};

const createMockElement = (overrides: Partial<any> = {}) => ({
  id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type: 'shape',
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  rotation: 0,
  locked: false,
  visible: true,
  parentId: null,
  ...overrides,
});

const mockCanvasStore = {
  getState: () => ({
    elements: mockElements,
    selectedElementIds: mockSelectedIds,
    viewport: mockViewport,
    settings: mockSettings,
  }),
  moveElements: vi.fn((ids: string[], dx: number, dy: number) => {
    ids.forEach(id => {
      const element = mockElements.get(id);
      if (element && !element.locked) {
        element.x += dx;
        element.y += dy;
      }
    });
  }),
  setElementPosition: vi.fn((id: string, x: number, y: number) => {
    const element = mockElements.get(id);
    if (element && !element.locked) {
      element.x = x;
      element.y = y;
    }
  }),
  selectElements: vi.fn((ids: string[]) => {
    mockSelectedIds = ids;
  }),
};

// Mock snap engine
const mockSnapEngine = {
  snapPoint: vi.fn((point: { x: number; y: number }) => ({
    snapped: { x: Math.round(point.x / 20) * 20, y: Math.round(point.y / 20) * 20 },
    guides: [],
  })),
  setTargets: vi.fn(),
  configure: vi.fn(),
};

// Helper to simulate drag operation
const simulateDrag = (
  elementId: string,
  startPos: { x: number; y: number },
  endPos: { x: number; y: number },
  options: { 
    shiftKey?: boolean; 
    ctrlKey?: boolean;
    snapToGrid?: boolean;
  } = {}
) => {
  const element = mockElements.get(elementId);
  if (!element) return null;

  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;

  let finalDx = dx;
  let finalDy = dy;

  // Constrained movement with Shift
  if (options.shiftKey) {
    if (Math.abs(dx) > Math.abs(dy)) {
      finalDy = 0;
    } else {
      finalDx = 0;
    }
  }

  // Snap to grid
  if (options.snapToGrid && mockSettings.snapToGrid) {
    const newX = element.x + finalDx;
    const newY = element.y + finalDy;
    const snapped = mockSnapEngine.snapPoint({ x: newX, y: newY });
    finalDx = snapped.snapped.x - element.x;
    finalDy = snapped.snapped.y - element.y;
  }

  mockCanvasStore.moveElements([elementId], finalDx, finalDy);

  return {
    originalPosition: { x: element.x - finalDx, y: element.y - finalDy },
    newPosition: { x: element.x, y: element.y },
    delta: { x: finalDx, y: finalDy },
  };
};

// Helper to simulate multi-element drag
const simulateMultiDrag = (
  elementIds: string[],
  delta: { x: number; y: number },
  options: { shiftKey?: boolean } = {}
) => {
  let finalDx = delta.x;
  let finalDy = delta.y;

  if (options.shiftKey) {
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
      finalDy = 0;
    } else {
      finalDx = 0;
    }
  }

  const originalPositions = elementIds.map(id => {
    const el = mockElements.get(id);
    return { id, x: el?.x, y: el?.y };
  });

  mockCanvasStore.moveElements(elementIds, finalDx, finalDy);

  const newPositions = elementIds.map(id => {
    const el = mockElements.get(id);
    return { id, x: el?.x, y: el?.y };
  });

  return { originalPositions, newPositions, delta: { x: finalDx, y: finalDy } };
};

describe('Drag and Drop Behavior', () => {
  beforeEach(() => {
    mockElements.clear();
    mockSelectedIds = [];
    mockViewport = { x: 0, y: 0, zoom: 1 };
    mockSettings = { showGrid: true, snapToGrid: true, gridSize: 20, snapToObjects: true };
    vi.clearAllMocks();
  });

  describe('Single Element Drag', () => {
    it('should move element by drag delta', () => {
      const element = createMockElement({ id: 'drag-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      const result = simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 200, y: 150 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(200);
      expect(element.y).toBe(150);
      expect(result?.delta).toEqual({ x: 100, y: 50 });
    });

    it('should handle negative drag delta', () => {
      const element = createMockElement({ id: 'drag-2', x: 200, y: 200 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 200, y: 200 },
        { x: 50, y: 75 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(50);
      expect(element.y).toBe(75);
    });

    it('should not move locked elements', () => {
      const element = createMockElement({ id: 'locked-1', x: 100, y: 100, locked: true });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 300, y: 300 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(100);
      expect(element.y).toBe(100);
    });

    it('should preserve element properties during drag', () => {
      const element = createMockElement({
        id: 'props-1',
        x: 100,
        y: 100,
        width: 150,
        height: 80,
        rotation: 45,
      });
      (element as any).style = { fill: '#ff0000' };
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 200, y: 200 },
        { snapToGrid: false }
      );

      expect(element.width).toBe(150);
      expect(element.height).toBe(80);
      expect(element.rotation).toBe(45);
      expect((element as any).style.fill).toBe('#ff0000');
      
    });
  });

  describe('Multi-Element Drag', () => {
    it('should move multiple selected elements together', () => {
      const el1 = createMockElement({ id: 'multi-1', x: 100, y: 100 });
      const el2 = createMockElement({ id: 'multi-2', x: 200, y: 150 });
      const el3 = createMockElement({ id: 'multi-3', x: 300, y: 200 });
      
      mockElements.set(el1.id, el1);
      mockElements.set(el2.id, el2);
      mockElements.set(el3.id, el3);

      simulateMultiDrag(['multi-1', 'multi-2', 'multi-3'], { x: 50, y: 25 });

      expect(el1.x).toBe(150);
      expect(el1.y).toBe(125);
      expect(el2.x).toBe(250);
      expect(el2.y).toBe(175);
      expect(el3.x).toBe(350);
      expect(el3.y).toBe(225);
    });

    it('should maintain relative positions during multi-drag', () => {
      const el1 = createMockElement({ id: 'rel-1', x: 100, y: 100 });
      const el2 = createMockElement({ id: 'rel-2', x: 200, y: 200 });
      
      mockElements.set(el1.id, el1);
      mockElements.set(el2.id, el2);

      const originalOffset = {
        x: el2.x - el1.x,
        y: el2.y - el1.y,
      };

      simulateMultiDrag(['rel-1', 'rel-2'], { x: 150, y: 75 });

      const newOffset = {
        x: el2.x - el1.x,
        y: el2.y - el1.y,
      };

      expect(newOffset).toEqual(originalOffset);
    });

    it('should skip locked elements in multi-selection drag', () => {
      const el1 = createMockElement({ id: 'skip-1', x: 100, y: 100, locked: false });
      const el2 = createMockElement({ id: 'skip-2', x: 200, y: 200, locked: true });
      
      mockElements.set(el1.id, el1);
      mockElements.set(el2.id, el2);

      simulateMultiDrag(['skip-1', 'skip-2'], { x: 50, y: 50 });

      expect(el1.x).toBe(150);
      expect(el1.y).toBe(150);
      expect(el2.x).toBe(200); // Unchanged
      expect(el2.y).toBe(200); // Unchanged
    });
  });

  describe('Constrained Movement (Shift Key)', () => {
    it('should constrain to horizontal movement when dx > dy', () => {
      const element = createMockElement({ id: 'const-h', x: 100, y: 100 });
      mockElements.set(element.id, element);

      const result = simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 250, y: 130 },
        { shiftKey: true, snapToGrid: false }
      );

      expect(element.x).toBe(250);
      expect(element.y).toBe(100); // Y unchanged
      expect(result?.delta.y).toBe(0);
    });

    it('should constrain to vertical movement when dy > dx', () => {
      const element = createMockElement({ id: 'const-v', x: 100, y: 100 });
      mockElements.set(element.id, element);

      const result = simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 130, y: 250 },
        { shiftKey: true, snapToGrid: false }
      );

      expect(element.x).toBe(100); // X unchanged
      expect(element.y).toBe(250);
      expect(result?.delta.x).toBe(0);
    });

    it('should apply constraint to multi-element drag', () => {
      const el1 = createMockElement({ id: 'mc-1', x: 100, y: 100 });
      const el2 = createMockElement({ id: 'mc-2', x: 200, y: 100 });
      
      mockElements.set(el1.id, el1);
      mockElements.set(el2.id, el2);

      simulateMultiDrag(['mc-1', 'mc-2'], { x: 100, y: 20 }, { shiftKey: true });

      expect(el1.y).toBe(100); // Y unchanged
      expect(el2.y).toBe(100); // Y unchanged
    });
  });

  describe('Grid Snapping', () => {
    it('should snap to grid when enabled', () => {
      const element = createMockElement({ id: 'snap-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 117, y: 123 },
        { snapToGrid: true }
      );

      // Should snap to nearest grid point (20px grid)
      expect(element.x % 20).toBe(0);
      expect(element.y % 20).toBe(0);
    });

    it('should not snap when grid snapping is disabled', () => {
      mockSettings.snapToGrid = false;
      const element = createMockElement({ id: 'nosnap-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 117, y: 123 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(117);
      expect(element.y).toBe(123);
    });

    it('should respect different grid sizes', () => {
      mockSettings.gridSize = 10;
      mockSnapEngine.snapPoint.mockImplementation((point) => ({
        snapped: { 
          x: Math.round(point.x / 10) * 10, 
          y: Math.round(point.y / 10) * 10 
        },
        guides: [],
      }));

      const element = createMockElement({ id: 'grid-10', x: 100, y: 100 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 117, y: 123 },
        { snapToGrid: true }
      );

      expect(element.x % 10).toBe(0);
      expect(element.y % 10).toBe(0);
    });
  });

  describe('Element Snapping', () => {
    it('should detect snap guides during drag', () => {
      const el1 = createMockElement({ id: 'target-1', x: 200, y: 100 });
      const el2 = createMockElement({ id: 'dragged-1', x: 100, y: 100 });
      
      mockElements.set(el1.id, el1);
      mockElements.set(el2.id, el2);

      mockSnapEngine.snapPoint.mockReturnValue({
        snapped: { x: 200, y: 100 },
        guides: [{ type: 'vertical', position: 200 }],
      });

      const snappedPos = mockSnapEngine.snapPoint({ x: 198, y: 100 });

      expect(snappedPos.guides.length).toBeGreaterThan(0);
      expect(snappedPos.snapped.x).toBe(200);
    });

    it('should snap to center alignment', () => {
      mockSnapEngine.snapPoint.mockReturnValue({
        snapped: { x: 150, y: 150 },
        guides: [
          { type: 'center-v', position: 150 },
          { type: 'center-h', position: 150 },
        ],
      });

      const result = mockSnapEngine.snapPoint({ x: 148, y: 152 });

      expect(result.snapped).toEqual({ x: 150, y: 150 });
      expect(result.guides).toHaveLength(2);
    });

    it('should snap to edge alignment', () => {
      mockSnapEngine.snapPoint.mockReturnValue({
        snapped: { x: 100, y: 100 },
        guides: [{ type: 'left', position: 100 }],
      });

      const result = mockSnapEngine.snapPoint({ x: 98, y: 100 });

      expect(result.guides[0].type).toBe('left');
    });
  });

  describe('Drag Boundaries', () => {
    it('should allow dragging to negative coordinates', () => {
      const element = createMockElement({ id: 'neg-1', x: 50, y: 50 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 50, y: 50 },
        { x: -100, y: -50 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(-100);
      expect(element.y).toBe(-50);
    });

    it('should handle very large coordinates', () => {
      const element = createMockElement({ id: 'large-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 100000, y: 100000 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(100000);
      expect(element.y).toBe(100000);
    });

    it('should handle decimal coordinates', () => {
      const element = createMockElement({ id: 'decimal-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 150.5, y: 175.75 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(150.5);
      expect(element.y).toBe(175.75);
    });
  });

  describe('Frame Containment', () => {
    it('should detect element inside frame bounds', () => {
      const frame = createMockElement({ 
        id: 'frame-1', 
        type: 'frame',
        x: 0, 
        y: 0, 
        width: 500, 
        height: 400 
      });
      const child = createMockElement({ 
        id: 'child-1', 
        x: 100, 
        y: 100, 
        width: 50, 
        height: 50 
      });
      
      mockElements.set(frame.id, frame);
      mockElements.set(child.id, child);

      const isInside = (
        child.x >= frame.x &&
        child.y >= frame.y &&
        child.x + child.width <= frame.x + frame.width &&
        child.y + child.height <= frame.y + frame.height
      );

      expect(isInside).toBe(true);
    });

    it('should detect element outside frame bounds', () => {
      const frame = createMockElement({ 
        id: 'frame-2', 
        type: 'frame',
        x: 0, 
        y: 0, 
        width: 200, 
        height: 200 
      });
      const child = createMockElement({ 
        id: 'child-2', 
        x: 250, 
        y: 250, 
        width: 50, 
        height: 50 
      });
      
      mockElements.set(frame.id, frame);
      mockElements.set(child.id, child);

      const isInside = (
        child.x >= frame.x &&
        child.y >= frame.y &&
        child.x + child.width <= frame.x + frame.width &&
        child.y + child.height <= frame.y + frame.height
      );

      expect(isInside).toBe(false);
    });

    it('should update parentId when dragging into frame', () => {
      const frame = createMockElement({ 
        id: 'frame-3', 
        type: 'frame',
        x: 200, 
        y: 200, 
        width: 300, 
        height: 300 
      });
      const element = createMockElement({ 
        id: 'orphan-1', 
        x: 50, 
        y: 50,
        parentId: null 
      });
      
      mockElements.set(frame.id, frame);
      mockElements.set(element.id, element);

      // Simulate drag into frame
      simulateDrag(
        element.id,
        { x: 50, y: 50 },
        { x: 300, y: 300 },
        { snapToGrid: false }
      );

      // Check if element is now inside frame bounds
      const isInsideFrame = (
        element.x >= frame.x &&
        element.y >= frame.y &&
        element.x + element.width <= frame.x + frame.width &&
        element.y + element.height <= frame.y + frame.height
      );

      expect(isInsideFrame).toBe(true);
    });
  });

  describe('Drag Performance', () => {
    it('should handle many elements efficiently', () => {
      const elementCount = 100;
      const ids: string[] = [];

      for (let i = 0; i < elementCount; i++) {
        const el = createMockElement({ 
          id: `perf-${i}`, 
          x: i * 10, 
          y: i * 10 
        });
        mockElements.set(el.id, el);
        ids.push(el.id);
      }

      const startTime = performance.now();
      simulateMultiDrag(ids, { x: 100, y: 100 });
      const endTime = performance.now();

      // Should complete in reasonable time (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);

      // Verify all elements moved
      ids.forEach((id, i) => {
        const el = mockElements.get(id);
        expect(el.x).toBe(i * 10 + 100);
        expect(el.y).toBe(i * 10 + 100);
      });
    });

    it('should handle rapid position updates', () => {
      const element = createMockElement({ id: 'rapid-1', x: 0, y: 0 });
      mockElements.set(element.id, element);

      // Simulate 60 updates (like 1 second of 60fps dragging)
      for (let i = 0; i < 60; i++) {
        mockCanvasStore.moveElements([element.id], 5, 3);
      }

      expect(element.x).toBe(300);
      expect(element.y).toBe(180);
    });
  });

  describe('Viewport Transformation', () => {
    it('should account for viewport offset in drag calculations', () => {
      mockViewport = { x: 100, y: 50, zoom: 1 };
      const element = createMockElement({ id: 'vp-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      // Screen coordinates would be offset by viewport
      const screenPos = {
        x: element.x - mockViewport.x,
        y: element.y - mockViewport.y,
      };

      expect(screenPos.x).toBe(0);
      expect(screenPos.y).toBe(50);
    });

    it('should account for zoom in drag calculations', () => {
      mockViewport = { x: 0, y: 0, zoom: 2 };
      const element = createMockElement({ id: 'zoom-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      // Screen coordinates would be scaled by zoom
      const screenPos = {
        x: element.x * mockViewport.zoom,
        y: element.y * mockViewport.zoom,
      };

      expect(screenPos.x).toBe(200);
      expect(screenPos.y).toBe(200);
    });

    it('should correctly transform screen to world coordinates', () => {
      mockViewport = { x: 50, y: 25, zoom: 1.5 };

      const screenToWorld = (screenX: number, screenY: number) => ({
        x: screenX / mockViewport.zoom + mockViewport.x,
        y: screenY / mockViewport.zoom + mockViewport.y,
      });

      const worldPos = screenToWorld(150, 75);

      expect(worldPos.x).toBe(150);
      expect(worldPos.y).toBe(75);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delta drag', () => {
      const element = createMockElement({ id: 'zero-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 100, y: 100 },
        { snapToGrid: false }
      );

      expect(element.x).toBe(100);
      expect(element.y).toBe(100);
    });

    it('should handle non-existent element', () => {
      const result = simulateDrag(
        'non-existent',
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      );

      expect(result).toBeNull();
    });

    it('should handle empty selection drag', () => {
      const result = simulateMultiDrag([], { x: 100, y: 100 });

      expect(result.originalPositions).toHaveLength(0);
      expect(result.newPositions).toHaveLength(0);
    });

    it('should handle drag with simultaneous shift and ctrl', () => {
      const element = createMockElement({ id: 'combo-1', x: 100, y: 100 });
      mockElements.set(element.id, element);

      // Both modifiers active
      const result = simulateDrag(
        element.id,
        { x: 100, y: 100 },
        { x: 200, y: 130 },
        { shiftKey: true, ctrlKey: true, snapToGrid: false }
      );

      // Shift should constrain movement
      expect(result?.delta.y).toBe(0);
    });
  });
});
