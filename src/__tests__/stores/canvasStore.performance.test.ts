import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvasStore';
import { performanceMonitor } from '@/utils/performanceMonitor';

describe('Canvas Store - Performance Tests', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      clipboard: [],
      history: { past: [], future: [] }
    });
    performanceMonitor.reset();
  });

  describe('Large Dataset Operations', () => {
    it('should add 100+ elements efficiently', () => {
      const { addElement } = useCanvasStore.getState();
      
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        addElement({
          type: 'shape',
          position: { x: (i % 10) * 60, y: Math.floor(i / 10) * 60 },
          size: { width: 50, height: 50 },
          shapeType: i % 2 === 0 ? 'rectangle' : 'circle',
          layerId: 'default',
          visible: true
        });
      }
      
      const duration = performance.now() - start;
      const elements = useCanvasStore.getState().elements;
      
      expect(elements).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it('should handle multi-select of 50+ elements efficiently', () => {
      const { addElement, selectElements } = useCanvasStore.getState();
      
      // Add 50 elements
      for (let i = 0; i < 50; i++) {
        addElement({
          type: 'shape',
          position: { x: i * 60, y: 0 },
          size: { width: 50, height: 50 },
          shapeType: 'rectangle',
          layerId: 'default',
          visible: true
        });
      }
      
      const elementIds = useCanvasStore.getState().elements.map(el => el.id);
      
      const start = performance.now();
      selectElements(elementIds);
      const duration = performance.now() - start;
      
      expect(useCanvasStore.getState().selectedElementIds).toHaveLength(50);
      expect(duration).toBeLessThan(100); // Should be very fast
    });

    it('should delete multiple elements efficiently', () => {
      const { addElement, deleteElements } = useCanvasStore.getState();
      
      // Add 100 elements
      for (let i = 0; i < 100; i++) {
        addElement({
          type: 'shape',
          position: { x: (i % 10) * 60, y: Math.floor(i / 10) * 60 },
          size: { width: 50, height: 50 },
          shapeType: 'rectangle',
          layerId: 'default',
          visible: true
        });
      }
      
      const elementIds = useCanvasStore.getState().elements.slice(0, 50).map(el => el.id);
      
      const start = performance.now();
      deleteElements(elementIds);
      const duration = performance.now() - start;
      
      expect(useCanvasStore.getState().elements).toHaveLength(50);
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Viewport Operations Performance', () => {
    it('should handle zoom operations efficiently', () => {
      const { setZoom } = useCanvasStore.getState();
      
      const start = performance.now();
      
      for (let i = 0; i < 50; i++) {
        setZoom(0.5 + (i * 0.01));
      }
      
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(500); // 50 zoom operations in less than 500ms
    });

    it('should handle pan operations efficiently', () => {
      const { setPan } = useCanvasStore.getState();
      
      const start = performance.now();
      
      for (let i = 0; i < 50; i++) {
        setPan(i * 10, i * 10);
      }
      
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(500); // 50 pan operations in less than 500ms
    });
  });

  describe('Complex Operations Performance', () => {
    it('should handle copy/paste of large selections efficiently', () => {
      const { addElement, selectElements, copyElements, pasteElements } = useCanvasStore.getState();
      
      // Add 30 elements
      for (let i = 0; i < 30; i++) {
        addElement({
          type: 'shape',
          position: { x: i * 60, y: 0 },
          size: { width: 50, height: 50 },
          shapeType: 'rectangle',
          layerId: 'default',
          visible: true
        });
      }
      
      const elementIds = useCanvasStore.getState().elements.map(el => el.id);
      selectElements(elementIds);
      
      const start = performance.now();
      copyElements(elementIds);
      pasteElements();
      const duration = performance.now() - start;
      
      expect(useCanvasStore.getState().elements).toHaveLength(60);
      expect(duration).toBeLessThan(200);
    });

    it('should handle alignment of many elements efficiently', () => {
      const { addElement, selectElements, alignElements } = useCanvasStore.getState();
      
      // Add 40 elements
      for (let i = 0; i < 40; i++) {
        addElement({
          type: 'shape',
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          size: { width: 50, height: 50 },
          shapeType: 'rectangle',
          layerId: 'default',
          visible: true
        });
      }
      
      const elementIds = useCanvasStore.getState().elements.map(el => el.id);
      selectElements(elementIds);
      
      const start = performance.now();
      alignElements(elementIds, 'left');
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('should handle multiple undo/redo operations efficiently', () => {
      const { addElement, undo, redo } = useCanvasStore.getState();
      
      // Perform 20 add operations
      for (let i = 0; i < 20; i++) {
        addElement({
          type: 'shape',
          position: { x: i * 60, y: 0 },
          size: { width: 50, height: 50 },
          shapeType: 'rectangle',
          layerId: 'default',
          visible: true
        });
      }
      
      const undoStart = performance.now();
      for (let i = 0; i < 20; i++) {
        undo();
      }
      const undoDuration = performance.now() - undoStart;
      
      const redoStart = performance.now();
      for (let i = 0; i < 20; i++) {
        redo();
      }
      const redoDuration = performance.now() - redoStart;
      
      expect(undoDuration).toBeLessThan(200);
      expect(redoDuration).toBeLessThan(200);
      expect(useCanvasStore.getState().elements).toHaveLength(20);
    });
  });

  describe('Memory Management', () => {
    it('should not cause memory leaks with repeated operations', () => {
      const { addElement, deleteElements } = useCanvasStore.getState();
      
      // Repeatedly add and delete elements
      for (let cycle = 0; cycle < 10; cycle++) {
        const elementIds: string[] = [];
        
        for (let i = 0; i < 50; i++) {
          addElement({
            type: 'shape',
            position: { x: i * 60, y: 0 },
            size: { width: 50, height: 50 },
            shapeType: 'rectangle',
            layerId: 'default',
            visible: true
          });
        }
        
        const currentElements = useCanvasStore.getState().elements;
        elementIds.push(...currentElements.map(el => el.id));
        
        deleteElements(elementIds);
      }
      
      // After all cycles, no elements should remain
      expect(useCanvasStore.getState().elements).toHaveLength(0);
      
      // History should not grow unbounded (implementation dependent)
      const historySize = useCanvasStore.getState().history.past.length;
      expect(historySize).toBeLessThan(100); // Reasonable limit
    });
  });
});
