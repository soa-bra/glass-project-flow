import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasStore } from '@/stores/canvasStore';

describe('Smart Elements Integration', () => {
  beforeEach(() => {
    // Reset store before each test - clear elements and selection
    useCanvasStore.setState({ elements: [], selectedElementIds: [] });
  });

  describe('Canvas Store', () => {
    it('should add smart element to canvas', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      act(() => {
        result.current.addElement({
          id: 'test-1',
          type: 'smart',
          smartType: 'kanban',
          position: { x: 0, y: 0 },
          size: { width: 400, height: 300 },
          data: { columns: [] },
          layerId: 'default'
        });
      });

      expect(result.current.elements).toHaveLength(1);
      expect(result.current.elements[0].type).toBe('smart');
      expect(result.current.elements[0].smartType).toBe('kanban');
    });

    it('should update smart element data', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      act(() => {
        result.current.addElement({
          id: 'test-1',
          type: 'smart',
          smartType: 'voting',
          position: { x: 0, y: 0 },
          size: { width: 400, height: 300 },
          data: { question: 'Test?', options: [] },
          layerId: 'default'
        });
      });

      act(() => {
        result.current.updateElement('test-1', {
          data: { question: 'Updated?', options: ['Yes', 'No'] }
        });
      });

      expect(result.current.elements[0].data.question).toBe('Updated?');
      expect(result.current.elements[0].data.options).toHaveLength(2);
    });

    it('should delete smart element', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      act(() => {
        result.current.addElement({
          id: 'test-1',
          type: 'smart',
          smartType: 'timeline',
          position: { x: 0, y: 0 },
          size: { width: 600, height: 200 },
          data: { items: [] },
          layerId: 'default'
        });
      });

      expect(result.current.elements).toHaveLength(1);

      act(() => {
        result.current.deleteElement('test-1');
      });

      expect(result.current.elements).toHaveLength(0);
    });

    it('should select multiple elements', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      act(() => {
        result.current.addElement({
          id: 'test-1',
          type: 'smart',
          smartType: 'kanban',
          position: { x: 0, y: 0 },
          size: { width: 400, height: 300 },
          data: {},
          layerId: 'default'
        });
        result.current.addElement({
          id: 'test-2',
          type: 'text',
          position: { x: 100, y: 100 },
          size: { width: 200, height: 100 },
          content: 'Test',
          layerId: 'default'
        });
      });

      act(() => {
        result.current.selectElement('test-1', false);
        result.current.selectElement('test-2', true); // multi-select
      });

      expect(result.current.selectedElementIds).toHaveLength(2);
    });
  });

  describe('Performance', () => {
    it('should handle large number of elements efficiently', () => {
      const { result } = renderHook(() => useCanvasStore());
      const startTime = performance.now();
      
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addElement({
            id: `element-${i}`,
            type: 'smart',
            smartType: 'thinking_board',
            position: { x: i * 50, y: i * 50 },
            size: { width: 300, height: 200 },
            data: { items: [] },
            layerId: 'default'
          });
        }
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.current.elements).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it('should update viewport without lag', () => {
      const { result } = renderHook(() => useCanvasStore());
      const startTime = performance.now();
      
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.setZoom(1 + i * 0.1);
          result.current.setPan(i * 10, i * 10);
        }
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500); // Should be smooth
    });
  });

  describe('History Management', () => {
    it('should track undo/redo operations', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      act(() => {
        result.current.addElement({
          id: 'test-1',
          type: 'smart',
          smartType: 'gantt',
          position: { x: 0, y: 0 },
          size: { width: 800, height: 400 },
          data: { tasks: [] },
          layerId: 'default'
        });
      });

      expect(result.current.elements).toHaveLength(1);

      act(() => {
        result.current.undo();
      });

      expect(result.current.elements).toHaveLength(0);

      act(() => {
        result.current.redo();
      });

      expect(result.current.elements).toHaveLength(1);
    });
  });

  describe('Layer Management', () => {
    it('should respect layer visibility', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      act(() => {
        result.current.addLayer('Test Layer');
        const layerId = result.current.layers[result.current.layers.length - 1].id;
        result.current.addElement({
          id: 'test-1',
          type: 'smart',
          smartType: 'mind_map',
          position: { x: 0, y: 0 },
          size: { width: 500, height: 400 },
          data: {},
          layerId: layerId
        });
      });

      expect(result.current.elements[0].visible).not.toBe(false);

      const layerId = result.current.layers[result.current.layers.length - 1].id;
      act(() => {
        result.current.updateLayer(layerId, { visible: false });
      });

      const layer = result.current.layers.find(l => l.id === layerId);
      expect(layer?.visible).toBe(false);
    });

    it('should lock elements with layer', () => {
      const { result } = renderHook(() => useCanvasStore());
      
      act(() => {
        result.current.addLayer('Test Layer');
        const layerId = result.current.layers[result.current.layers.length - 1].id;
        result.current.addElement({
          id: 'test-1',
          type: 'smart',
          smartType: 'brainstorming',
          position: { x: 0, y: 0 },
          size: { width: 400, height: 300 },
          data: {},
          layerId: layerId
        });
      });

      const layerId = result.current.layers[result.current.layers.length - 1].id;
      act(() => {
        result.current.updateLayer(layerId, { locked: true });
      });

      const layer = result.current.layers.find(l => l.id === layerId);
      expect(layer?.locked).toBe(true);
    });
  });
});
