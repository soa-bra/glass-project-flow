// Virtualized Renderer Tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VirtualizedRenderer } from '@/lib/performance/virtualized-renderer';
import type { CanvasNode } from '@/lib/canvas/types';

describe('VirtualizedRenderer', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let renderer: VirtualizedRenderer;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d')!;
    renderer = new VirtualizedRenderer(canvas, ctx);
  });

  it('should initialize with default settings', () => {
    expect(renderer).toBeDefined();
    const metrics = renderer.getMetrics();
    expect(metrics.queueSize).toBe(0);
    expect(metrics.maxBatchSize).toBe(50);
    expect(metrics.renderBudgetMs).toBe(16);
  });

  it('should schedule render batches', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'test-1',
        type: 'rect',
        transform: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        size: { width: 100, height: 100 },
        style: { fill: '#ff0000' }
      }
    ];

    const batch = {
      id: 'test-batch',
      nodes,
      bounds: { x: 0, y: 0, width: 800, height: 600, zoom: 1 },
      priority: 'high' as const
    };

    renderer.scheduleRender(batch);
    
    const metrics = renderer.getMetrics();
    expect(metrics.queueSize).toBe(1);
  });

  it('should respect frame budget', async () => {
    const largeBatch = Array.from({ length: 200 }, (_, i) => ({
      id: `test-batch-${i}`,
      nodes: [],
      bounds: { x: 0, y: 0, width: 800, height: 600, zoom: 1 },
      priority: 'medium' as const
    }));

    largeBatch.forEach(batch => renderer.scheduleRender(batch));

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 50));

    // Should have processed some but not all due to frame budget
    const metrics = renderer.getMetrics();
    expect(metrics.queueSize).toBeLessThan(largeBatch.length);
  });

  it('should cull nodes outside viewport', () => {
    const nodes: CanvasNode[] = [
      {
        id: 'visible',
        type: 'rect',
        transform: { position: { x: 100, y: 100 }, rotation: 0, scale: { x: 1, y: 1 } },
        size: { width: 50, height: 50 },
        style: {}
      },
      {
        id: 'outside',
        type: 'rect',
        transform: { position: { x: 1000, y: 1000 }, rotation: 0, scale: { x: 1, y: 1 } },
        size: { width: 50, height: 50 },
        style: {}
      }
    ];

    const batch = {
      id: 'cull-test',
      nodes,
      bounds: { x: 0, y: 0, width: 800, height: 600, zoom: 1 },
      priority: 'high' as const
    };

    const fillRectSpy = vi.spyOn(ctx, 'fillRect');
    
    renderer.scheduleRender(batch);

    // Wait for rendering
    setTimeout(() => {
      // Should only render visible node
      expect(fillRectSpy).toHaveBeenCalledTimes(1);
    }, 20);
  });

  it('should clear render queue', () => {
    const batch = {
      id: 'test-clear',
      nodes: [],
      bounds: { x: 0, y: 0, width: 800, height: 600, zoom: 1 },
      priority: 'low' as const
    };

    renderer.scheduleRender(batch);
    expect(renderer.getMetrics().queueSize).toBe(1);

    renderer.clear();
    expect(renderer.getMetrics().queueSize).toBe(0);
  });
});