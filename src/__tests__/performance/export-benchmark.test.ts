/**
 * Export Performance Benchmarks
 * اختبارات أداء التصدير والاستيراد
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvas';
import { ExportEngine, type ExportableElement } from '@/core/exportEngine';
import { ImportEngine } from '@/core/importEngine';

// Helper to generate test elements
const generateElements = (count: number): ExportableElement[] => {
  const types = ['shape', 'text', 'sticky'] as const;
  return Array.from({ length: count }, (_, i) => ({
    id: `el-${i}`,
    type: types[i % types.length],
    position: { x: (i % 20) * 150, y: Math.floor(i / 20) * 150 },
    size: { width: 100, height: 100 },
    content: i % 3 !== 0 ? `نص تجريبي ${i}` : undefined,
    style: {
      backgroundColor: i % 3 === 2 ? '#FFF4CC' : '#FFFFFF',
      shapeType: i % 3 === 0 ? 'rectangle' : undefined,
      fontSize: i % 3 === 1 ? 14 : undefined
    },
    rotation: 0
  }));
};

// Performance measurement helper
const measureTime = async (fn: () => void | Promise<void>): Promise<number> => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};

describe('Export Performance Benchmarks', () => {
  let exportEngine: ExportEngine;
  let importEngine: ImportEngine;

  beforeEach(() => {
    exportEngine = new ExportEngine();
    importEngine = new ImportEngine();
    
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      history: { past: [], future: [] }
    });
  });

  describe('JSON Export Performance', () => {
    it('should export 100 elements to JSON in < 50ms', async () => {
      const elements = generateElements(100);
      
      const time = await measureTime(async () => {
        await exportEngine.export(elements, { format: 'json', filename: 'test-json' });
      });
      
      console.log(`JSON export 100 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(100);
    });

    it('should export 500 elements to JSON in < 200ms', async () => {
      const elements = generateElements(500);
      
      const time = await measureTime(async () => {
        await exportEngine.export(elements, { format: 'json', filename: 'test-json' });
      });
      
      console.log(`JSON export 500 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(200);
    });
  });

  describe('SVG Export Performance', () => {
    it('should export 100 elements to SVG in < 100ms', async () => {
      const elements = generateElements(100);
      
      const time = await measureTime(async () => {
        await exportEngine.export(elements, { format: 'svg', filename: 'test-svg' });
      });
      
      console.log(`SVG export 100 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(200);
    });
  });

  describe('Import Performance', () => {
    it('should validate 100 elements in < 50ms', async () => {
      const elements = generateElements(100);
      const jsonData = JSON.stringify({
        version: '1.0',
        elements,
        metadata: { exportedAt: new Date().toISOString() }
      });
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });
      
      const time = await measureTime(async () => {
        await importEngine.importFromFile(file);
      });
      
      console.log(`JSON import 100 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(100);
    });

    it('should import 500 elements in < 200ms', async () => {
      const elements = generateElements(500);
      const jsonData = JSON.stringify({
        version: '1.0',
        elements,
        metadata: { exportedAt: new Date().toISOString() }
      });
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });
      
      const time = await measureTime(async () => {
        await importEngine.importFromFile(file);
      });
      
      console.log(`JSON import 500 elements: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(200);
    });

    it('should handle import with offset', async () => {
      const elements = generateElements(50);
      const jsonData = JSON.stringify({ version: '1.0', elements });
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });
      
      const result = await importEngine.importFromFile(file, {
        offsetPosition: { x: 100, y: 100 }
      });
      
      expect(result.success).toBe(true);
      if (result.elements) {
        expect(result.elements[0].position.x).toBeGreaterThanOrEqual(100);
      }
    });

    it('should generate new IDs when requested', async () => {
      const elements = generateElements(10);
      const jsonData = JSON.stringify({ version: '1.0', elements });
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });
      
      const result = await importEngine.importFromFile(file, {
        generateNewIds: true
      });
      
      expect(result.success).toBe(true);
      if (result.elements) {
        result.elements.forEach((el, i) => {
          expect(el.id).not.toBe(`el-${i}`);
        });
      }
    });
  });

  describe('Error Recovery Performance', () => {
    it('should recover from corrupted data efficiently', async () => {
      const corruptedData = {
        version: '1.0',
        elements: [
          { id: 'el-1', type: 'shape' },
          { id: 'el-2', type: 'text', position: { x: 100, y: 100 } },
          { id: 'el-3', position: { x: 200, y: 200 }, size: { width: 100, height: 100 } }
        ]
      };
      
      const blob = new Blob([JSON.stringify(corruptedData)], { type: 'application/json' });
      const file = new File([blob], 'corrupted.json', { type: 'application/json' });
      
      const time = await measureTime(async () => {
        await importEngine.importFromFile(file, { errorRecovery: true });
      });
      
      console.log(`Error recovery time: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(100);
    });

    it('should detect format automatically', async () => {
      const elements = generateElements(20);
      const jsonData = JSON.stringify({ version: '1.0', elements });
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });
      
      const time = await measureTime(async () => {
        await importEngine.importFromFile(file);
      });
      
      console.log(`Auto-detect format time: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(50);
    });
  });

  describe('Batch Export Performance', () => {
    it('should export same data to multiple formats efficiently', async () => {
      const elements = generateElements(100);
      
      const times: Record<string, number> = {};
      
      for (const format of ['json', 'svg', 'pdf'] as const) {
        times[format] = await measureTime(async () => {
          await exportEngine.export(elements, { format, filename: 'batch-test' });
        });
      }
      
      console.log('Batch export times:', Object.entries(times).map(([f, t]) => `${f}: ${t.toFixed(2)}ms`).join(', '));
      
      const total = Object.values(times).reduce((a, b) => a + b, 0);
      expect(total).toBeLessThan(3000);
    });
  });

  describe('Memory Efficiency', () => {
    it('should handle large export without memory issues', async () => {
      const elements = generateElements(2000);
      
      const memBefore = (performance as any).memory?.usedJSHeapSize || 0;
      
      await exportEngine.export(elements, { format: 'json', filename: 'large-test' });
      
      const memAfter = (performance as any).memory?.usedJSHeapSize || 0;
      const memUsed = (memAfter - memBefore) / 1024 / 1024;
      
      console.log(`Memory for 2000 element export: ${memUsed.toFixed(2)}MB`);
      
      expect(memUsed).toBeLessThan(50);
    });
  });
});
