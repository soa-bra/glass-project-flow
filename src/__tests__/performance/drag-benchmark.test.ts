/**
 * Drag Performance Benchmarks
 * اختبارات أداء السحب والإفلات
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvas';
import type { CanvasElement } from '@/types/canvas';

// Helper to generate test elements
const generateElements = (count: number): CanvasElement[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `el-${i}`,
    type: 'shape' as const,
    position: { x: (i % 20) * 150, y: Math.floor(i / 20) * 150 },
    size: { width: 100, height: 100 },
    style: { backgroundColor: '#FFFFFF', shapeType: 'rectangle' }
  }));
};

// Simulate drag frames
const simulateDrag = (
  elementIds: string[], 
  frames: number,
  moveElements: (ids: string[], dx: number, dy: number) => void
): number[] => {
  const frameTimes: number[] = [];
  
  for (let i = 0; i < frames; i++) {
    const start = performance.now();
    moveElements(elementIds, 2, 2); // Small movement per frame
    frameTimes.push(performance.now() - start);
  }
  
  return frameTimes;
};

describe('Drag Performance Benchmarks', () => {
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

  describe('Single Element Drag', () => {
    beforeEach(() => {
      const elements = generateElements(100);
      useCanvasStore.setState({ elements });
    });

    it('should maintain < 8ms per frame for single element', () => {
      const { moveElements } = useCanvasStore.getState();
      
      const frameTimes = simulateDrag(['el-50'], 60, moveElements);
      const maxTime = Math.max(...frameTimes);
      const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      
      console.log(`Single drag - Avg: ${avgTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(8);
      expect(maxTime).toBeLessThan(16); // Allow occasional spikes
    });

    it('should not cause jank during drag (no frame > 16ms)', () => {
      const { moveElements } = useCanvasStore.getState();
      
      const frameTimes = simulateDrag(['el-25'], 120, moveElements);
      const jankFrames = frameTimes.filter(t => t > 16);
      
      console.log(`Jank frames (>16ms): ${jankFrames.length} of 120`);
      
      // Allow up to 5% jank frames
      expect(jankFrames.length).toBeLessThan(6);
    });

    it('should update position correctly during drag', () => {
      const { moveElements } = useCanvasStore.getState();
      
      const before = useCanvasStore.getState().elements.find(e => e.id === 'el-0')!;
      const startX = before.position.x;
      const startY = before.position.y;
      
      // Simulate 30 frames of movement
      for (let i = 0; i < 30; i++) {
        moveElements(['el-0'], 5, 5);
      }
      
      const after = useCanvasStore.getState().elements.find(e => e.id === 'el-0')!;
      
      expect(after.position.x).toBe(startX + 150);
      expect(after.position.y).toBe(startY + 150);
    });
  });

  describe('Multi-Element Drag', () => {
    beforeEach(() => {
      const elements = generateElements(200);
      useCanvasStore.setState({ elements });
    });

    it('should drag 10 elements smoothly (< 8ms avg)', () => {
      const { moveElements } = useCanvasStore.getState();
      const ids = Array.from({ length: 10 }, (_, i) => `el-${i}`);
      
      const frameTimes = simulateDrag(ids, 60, moveElements);
      const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      
      console.log(`10 elements drag avg: ${avgTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(8);
    });

    it('should drag 50 elements in < 16ms per frame', () => {
      const { moveElements } = useCanvasStore.getState();
      const ids = Array.from({ length: 50 }, (_, i) => `el-${i}`);
      
      const frameTimes = simulateDrag(ids, 60, moveElements);
      const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const maxTime = Math.max(...frameTimes);
      
      console.log(`50 elements drag - Avg: ${avgTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(16);
    });

    it('should drag 100 elements with acceptable performance (< 32ms)', () => {
      const { moveElements } = useCanvasStore.getState();
      const ids = Array.from({ length: 100 }, (_, i) => `el-${i}`);
      
      const frameTimes = simulateDrag(ids, 30, moveElements);
      const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      
      console.log(`100 elements drag avg: ${avgTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(32);
    });

    it('should maintain consistent frame times', () => {
      const { moveElements } = useCanvasStore.getState();
      const ids = Array.from({ length: 20 }, (_, i) => `el-${i}`);
      
      const frameTimes = simulateDrag(ids, 60, moveElements);
      
      const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const variance = frameTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / frameTimes.length;
      const stdDev = Math.sqrt(variance);
      
      console.log(`Frame time std dev: ${stdDev.toFixed(2)}ms`);
      
      // Standard deviation should be less than average
      expect(stdDev).toBeLessThan(avgTime);
    });
  });

  describe('Locked Elements Performance', () => {
    beforeEach(() => {
      const elements = generateElements(100);
      // Lock half the elements
      elements.forEach((el, i) => {
        if (i % 2 === 0) el.locked = true;
      });
      useCanvasStore.setState({ elements });
    });

    it('should quickly skip locked elements during drag', () => {
      const { moveElements } = useCanvasStore.getState();
      const allIds = Array.from({ length: 100 }, (_, i) => `el-${i}`);
      
      const frameTimes = simulateDrag(allIds, 30, moveElements);
      const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      
      console.log(`Drag with locked elements avg: ${avgTime.toFixed(2)}ms`);
      
      // Should still be performant despite locked check
      expect(avgTime).toBeLessThan(16);
    });

    it('should not move locked elements', () => {
      const { moveElements } = useCanvasStore.getState();
      
      const lockedBefore = useCanvasStore.getState().elements.find(e => e.id === 'el-0')!;
      const startPos = { ...lockedBefore.position };
      
      moveElements(['el-0', 'el-1'], 100, 100);
      
      const lockedAfter = useCanvasStore.getState().elements.find(e => e.id === 'el-0')!;
      const unlockedAfter = useCanvasStore.getState().elements.find(e => e.id === 'el-1')!;
      
      // Locked should not move
      expect(lockedAfter.position).toEqual(startPos);
      // Unlocked should move
      expect(unlockedAfter.position.x).toBeGreaterThan(startPos.x);
    });
  });

  describe('Large Canvas Performance', () => {
    it('should handle 1000 elements efficiently', () => {
      const elements = generateElements(1000);
      useCanvasStore.setState({ elements });
      
      const { moveElements } = useCanvasStore.getState();
      const ids = Array.from({ length: 5 }, (_, i) => `el-${i * 200}`);
      
      const frameTimes = simulateDrag(ids, 30, moveElements);
      const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      
      console.log(`5 elements drag on 1000 canvas avg: ${avgTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(10);
    });

    it('should scale linearly with selected elements', () => {
      const elements = generateElements(500);
      useCanvasStore.setState({ elements });
      
      const { moveElements } = useCanvasStore.getState();
      
      // Test with increasing selection sizes
      const sizes = [1, 10, 50, 100];
      const timings: { size: number; avgTime: number }[] = [];
      
      for (const size of sizes) {
        const ids = Array.from({ length: size }, (_, i) => `el-${i}`);
        const frameTimes = simulateDrag(ids, 20, moveElements);
        const avgTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        timings.push({ size, avgTime });
      }
      
      console.log('Scaling test:', timings.map(t => `${t.size}: ${t.avgTime.toFixed(2)}ms`).join(', '));
      
      // Performance should scale roughly linearly
      const ratio = timings[3].avgTime / timings[0].avgTime;
      expect(ratio).toBeLessThan(200); // 100x more elements shouldn't be 200x slower
    });
  });

  describe('Resize Operations', () => {
    beforeEach(() => {
      const elements = generateElements(100);
      useCanvasStore.setState({ elements });
    });

    it('should resize single element efficiently', () => {
      const { resizeElements } = useCanvasStore.getState();
      
      const times: number[] = [];
      for (let i = 0; i < 60; i++) {
        const start = performance.now();
        resizeElements(['el-50'], 1.02, 1.02, { x: 0, y: 0 });
        times.push(performance.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`Single resize avg: ${avgTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(8);
    });

    it('should resize multiple elements efficiently', () => {
      const { resizeElements } = useCanvasStore.getState();
      const ids = Array.from({ length: 20 }, (_, i) => `el-${i}`);
      
      const times: number[] = [];
      for (let i = 0; i < 30; i++) {
        const start = performance.now();
        resizeElements(ids, 1.05, 1.05, { x: 0, y: 0 });
        times.push(performance.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`20 element resize avg: ${avgTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(16);
    });
  });

  describe('Rotation Operations', () => {
    beforeEach(() => {
      const elements = generateElements(100);
      useCanvasStore.setState({ elements });
    });

    it('should rotate single element efficiently', () => {
      const { rotateElements } = useCanvasStore.getState();
      
      const times: number[] = [];
      for (let i = 0; i < 60; i++) {
        const start = performance.now();
        rotateElements(['el-50'], 6, { x: 0, y: 0 }); // 6 degrees per frame
        times.push(performance.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`Single rotation avg: ${avgTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(8);
    });
  });
});
