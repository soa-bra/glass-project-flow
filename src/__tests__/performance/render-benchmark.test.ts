/**
 * Render Performance Benchmarks
 * اختبارات أداء الرسم
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvas';
import type { CanvasElement } from '@/types/canvas';

// Helper to generate test elements
const generateElements = (count: number): Omit<CanvasElement, 'id'>[] => {
  const types = ['shape', 'text', 'sticky'] as const;
  return Array.from({ length: count }, (_, i) => ({
    type: types[i % types.length],
    position: { x: (i % 20) * 150, y: Math.floor(i / 20) * 150 },
    size: { width: 100, height: 100 },
    content: i % 3 === 1 ? `نص تجريبي ${i}` : undefined,
    style: {
      backgroundColor: i % 3 === 2 ? '#FFF4CC' : '#FFFFFF',
      shapeType: i % 3 === 0 ? 'rectangle' : undefined
    }
  }));
};

// Performance measurement helper
const measureTime = async (fn: () => void | Promise<void>): Promise<number> => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};

describe('Render Performance Benchmarks', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      history: { past: [], future: [] },
      layers: [{
        id: 'default',
        name: 'الطبقة الافتراضية',
        visible: true,
        locked: false,
        elements: [],
        zIndex: 0
      }]
    });
  });

  describe('Element Addition Performance', () => {
    it('should add 100 elements in < 50ms', async () => {
      const { addElement } = useCanvasStore.getState();
      const elements = generateElements(100);
      
      const time = await measureTime(() => {
        elements.forEach(el => addElement(el));
      });
      
      console.log(`Adding 100 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(50);
      expect(useCanvasStore.getState().elements.length).toBe(100);
    });

    it('should add 1000 elements in < 500ms', async () => {
      const { addElement } = useCanvasStore.getState();
      const elements = generateElements(1000);
      
      const time = await measureTime(() => {
        elements.forEach(el => addElement(el));
      });
      
      console.log(`Adding 1000 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(500);
      expect(useCanvasStore.getState().elements.length).toBe(1000);
    });

    it('should batch add elements efficiently', async () => {
      const elements = generateElements(500);
      
      const time = await measureTime(() => {
        useCanvasStore.setState(state => ({
          elements: [
            ...state.elements,
            ...elements.map((el, i) => ({ ...el, id: `batch-${i}` }))
          ] as CanvasElement[]
        }));
      });
      
      console.log(`Batch adding 500 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(10);
    });
  });

  describe('Element Update Performance', () => {
    beforeEach(() => {
      // Pre-populate with elements
      const elements = generateElements(100).map((el, i) => ({ ...el, id: `el-${i}` })) as CanvasElement[];
      useCanvasStore.setState({ elements });
    });

    it('should update single element in < 5ms', async () => {
      const { updateElement } = useCanvasStore.getState();
      
      const time = await measureTime(() => {
        updateElement('el-50', { 
          position: { x: 500, y: 500 },
          style: { backgroundColor: '#00FF00' }
        });
      });
      
      console.log(`Single element update: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(5);
    });

    it('should update 100 elements in < 50ms', async () => {
      const { updateElement } = useCanvasStore.getState();
      
      const time = await measureTime(() => {
        for (let i = 0; i < 100; i++) {
          updateElement(`el-${i}`, { 
            position: { x: i * 10, y: i * 10 }
          });
        }
      });
      
      console.log(`100 element updates: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(50);
    });
  });

  describe('Selection Performance', () => {
    beforeEach(() => {
      const elements = generateElements(1000).map((el, i) => ({ ...el, id: `el-${i}` })) as CanvasElement[];
      useCanvasStore.setState({ elements });
    });

    it('should select single element in < 2ms', async () => {
      const { selectElement } = useCanvasStore.getState();
      
      const time = await measureTime(() => {
        selectElement('el-500');
      });
      
      console.log(`Single selection: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(2);
    });

    it('should select 100 elements in < 5ms', async () => {
      const { selectElements } = useCanvasStore.getState();
      const ids = Array.from({ length: 100 }, (_, i) => `el-${i}`);
      
      const time = await measureTime(() => {
        selectElements(ids);
      });
      
      console.log(`100 element selection: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(5);
    });

    it('should clear selection in < 1ms', async () => {
      const { selectElements, clearSelection } = useCanvasStore.getState();
      selectElements(Array.from({ length: 500 }, (_, i) => `el-${i}`));
      
      const time = await measureTime(() => {
        clearSelection();
      });
      
      console.log(`Clear selection: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(1);
    });
  });

  describe('Viewport Operations Performance', () => {
    it('should update zoom in < 1ms', async () => {
      const { setZoom } = useCanvasStore.getState();
      
      const time = await measureTime(() => {
        setZoom(2);
      });
      
      console.log(`Zoom update: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(1);
    });

    it('should update pan in < 1ms', async () => {
      const { setPan } = useCanvasStore.getState();
      
      const time = await measureTime(() => {
        setPan(1000, 500);
      });
      
      console.log(`Pan update: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(1);
    });

    it('should handle rapid viewport changes', async () => {
      const { setZoom, setPan } = useCanvasStore.getState();
      
      const time = await measureTime(() => {
        for (let i = 0; i < 60; i++) {
          setZoom(1 + Math.sin(i * 0.1) * 0.5);
          setPan(Math.cos(i * 0.1) * 100, Math.sin(i * 0.1) * 100);
        }
      });
      
      console.log(`60 viewport updates (1 second simulation): ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(50);
    });
  });

  describe('Memory Usage', () => {
    it('should handle 5000 elements without memory issues', () => {
      const elements = generateElements(5000).map((el, i) => ({ ...el, id: `el-${i}` })) as CanvasElement[];
      
      const memBefore = (performance as any).memory?.usedJSHeapSize || 0;
      
      useCanvasStore.setState({ elements });
      
      const memAfter = (performance as any).memory?.usedJSHeapSize || 0;
      const memUsed = (memAfter - memBefore) / 1024 / 1024;
      
      console.log(`Memory for 5000 elements: ${memUsed.toFixed(2)}MB`);
      
      const { elements: stored } = useCanvasStore.getState();
      expect(stored.length).toBe(5000);
    });

    it('should cleanup properly on state reset', () => {
      const elements = generateElements(1000).map((el, i) => ({ ...el, id: `el-${i}` })) as CanvasElement[];
      useCanvasStore.setState({ elements });
      
      useCanvasStore.setState({ elements: [] });
      
      const { elements: after } = useCanvasStore.getState();
      expect(after.length).toBe(0);
    });
  });

  describe('History Operations Performance', () => {
    beforeEach(() => {
      const elements = generateElements(100).map((el, i) => ({ ...el, id: `el-${i}` })) as CanvasElement[];
      useCanvasStore.setState({ 
        elements,
        history: { past: [], future: [] }
      });
    });

    it('should push history in < 5ms', async () => {
      const { pushHistory } = useCanvasStore.getState();
      
      const time = await measureTime(() => {
        pushHistory();
      });
      
      console.log(`Push history: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(5);
    });

    it('should undo in < 5ms', async () => {
      const { addElement, undo } = useCanvasStore.getState();
      
      // Create history
      addElement({ type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      
      const time = await measureTime(() => {
        undo();
      });
      
      console.log(`Undo: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(5);
    });

    it('should redo in < 5ms', async () => {
      const { addElement, undo, redo } = useCanvasStore.getState();
      
      addElement({ type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      undo();
      
      const time = await measureTime(() => {
        redo();
      });
      
      console.log(`Redo: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(5);
    });
  });
});
