import { CanvasEngine } from '../engine/canvas-engine';
import { useCanvasOptimization, useLargeCanvasOptimization } from '@/hooks/performance/useCanvasOptimization';
import { VirtualizedRenderer } from '@/lib/performance/virtualized-renderer';
import { HitTestManager } from '@/lib/performance/hit-test-manager';
import { PerformanceMetrics } from '@/utils/performanceOptimizer';
import { useState, useEffect } from 'react';

export interface PerformanceIntegrationOptions {
  enableVirtualization?: boolean;
  enableHitTesting?: boolean;
  enableMetrics?: boolean;
  largeCanvasThreshold?: number;
}

export class PerformanceIntegration {
  private canvasEngine: CanvasEngine;
  private virtualizedRenderer?: VirtualizedRenderer;
  private hitTestManager?: HitTestManager;
  private metrics?: PerformanceMetrics;
  private options: PerformanceIntegrationOptions;

  constructor(canvasEngine: CanvasEngine, options: PerformanceIntegrationOptions = {}) {
    this.canvasEngine = canvasEngine;
    this.options = {
      enableVirtualization: true,
      enableHitTesting: true,
      enableMetrics: true,
      largeCanvasThreshold: 1000,
      ...options
    };

    this.initialize();
  }

  private initialize(): void {
    if (this.options.enableMetrics) {
      this.metrics = PerformanceMetrics.getInstance();
    }

    if (this.options.enableHitTesting) {
      this.hitTestManager = new HitTestManager();
    }

    // Listen to canvas engine events for performance monitoring
    this.canvasEngine.on('nodeAdded', this.handleNodeOperation.bind(this));
    this.canvasEngine.on('nodeUpdated', this.handleNodeOperation.bind(this));
    this.canvasEngine.on('nodeRemoved', this.handleNodeOperation.bind(this));
    this.canvasEngine.on('cameraChanged', this.handleCameraChange.bind(this));
  }

  // Initialize virtualized renderer when canvas element is available
  initializeVirtualizedRenderer(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    if (this.options.enableVirtualization) {
      this.virtualizedRenderer = new VirtualizedRenderer(canvas, ctx);
    }
  }

  // Enhanced hit testing
  async performHitTest(point: { x: number; y: number }): Promise<string[]> {
    const endTiming = this.metrics?.startTiming('hitTest');
    
    try {
      if (this.hitTestManager) {
        const sceneGraph = this.canvasEngine.getSceneGraph();
        const nodes = sceneGraph.getAllNodes();
        return await this.hitTestManager.hitTest(point, nodes);
      } else {
        // Fallback to scene graph hit test
        const sceneGraph = this.canvasEngine.getSceneGraph();
        const worldPoint = this.canvasEngine.screenToWorld(point);
        return sceneGraph.hitTest(worldPoint).map(node => node.id);
      }
    } finally {
      endTiming?.();
    }
  }

  // Render with performance optimizations
  render(): void {
    const endTiming = this.metrics?.startTiming('render');
    
    try {
      if (this.virtualizedRenderer) {
        const state = this.canvasEngine.getState();
        const nodes = this.canvasEngine.getNodes();
        const camera = state.camera;
        
        // Create render batch
        const batch = {
          id: 'main',
          nodes,
          bounds: {
            x: -camera.position.x / camera.zoom,
            y: -camera.position.y / camera.zoom,
            width: state.viewport.size.width / camera.zoom,
            height: state.viewport.size.height / camera.zoom,
            zoom: camera.zoom
          },
          priority: 'high' as const
        };

        this.virtualizedRenderer.scheduleRender(batch);
      }
    } finally {
      endTiming?.();
    }
  }

  // Handle node operations with performance monitoring
  private handleNodeOperation(event: any): void {
    const nodeCount = this.canvasEngine.getNodes().length;
    
    // Check if we need to enable large canvas optimizations
    if (nodeCount > this.options.largeCanvasThreshold!) {
      this.enableLargeCanvasOptimizations();
    }

    // Update metrics
    this.metrics?.addMetric('nodeCount', nodeCount);
  }

  // Handle camera changes
  private handleCameraChange(event: any): void {
    // Trigger re-render with new viewport
    this.render();
  }

  // Enable optimizations for large canvases
  private enableLargeCanvasOptimizations(): void {
    // This would typically be called from a React component using the hook
    console.log('Large canvas optimizations should be enabled');
  }

  // Get performance metrics
  getMetrics() {
    return {
      canvas: this.metrics?.getAllMetrics() || {},
      renderer: this.virtualizedRenderer?.getMetrics() || {},
      nodeCount: this.canvasEngine.getNodes().length,
      cameraPosition: this.canvasEngine.getState().camera.position,
      zoom: this.canvasEngine.getState().camera.zoom
    };
  }

  // Cleanup
  destroy(): void {
    this.virtualizedRenderer?.clear();
    this.hitTestManager?.destroy();
    this.metrics?.clear();
  }
}

// Hook to use performance integration with React
export const usePerformanceIntegration = (
  canvasEngine: CanvasEngine | null,
  options: PerformanceIntegrationOptions = {}
) => {
  const [integration, setIntegration] = useState<PerformanceIntegration | null>(null);

  useEffect(() => {
    if (!canvasEngine) return;

    const perfIntegration = new PerformanceIntegration(canvasEngine, options);
    setIntegration(perfIntegration);

    return () => {
      perfIntegration.destroy();
    };
  }, [canvasEngine]);

  return integration;
};