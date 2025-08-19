// Performance Integration for Canvas
import { CanvasNode } from '@/lib/canvas/types';
import { VirtualizedRenderer, ViewportBounds } from './virtualized-renderer';
import { BatchProcessor, BatchOperation } from './batch-processor';
import { HitTestManager } from './hit-test-manager';
import { LazyLoader, LoadableAsset } from './lazy-loader';
import { TextureAtlas } from './texture-atlas';

export interface PerformanceConfig {
  enableVirtualization: boolean;
  enableBatching: boolean;
  enableWorkerHitTest: boolean;
  enableLazyLoading: boolean;
  enableTextureAtlas: boolean;
  maxNodes: number;
  targetFps: number;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  enableVirtualization: true,
  enableBatching: true,
  enableWorkerHitTest: true,
  enableLazyLoading: true,
  enableTextureAtlas: true,
  maxNodes: 10000,
  targetFps: 60,
};

export class PerformanceManager {
  private renderer: VirtualizedRenderer | null = null;
  private batchProcessor: BatchProcessor | null = null;
  private hitTestManager: HitTestManager | null = null;
  private lazyLoader: LazyLoader | null = null;
  private textureAtlas: TextureAtlas | null = null;
  private config: PerformanceConfig;
  private frameMetrics: number[] = [];
  private lastFrameTime = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    config: Partial<PerformanceConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialize();
  }

  private initialize(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Initialize virtualized renderer
    if (this.config.enableVirtualization) {
      this.renderer = new VirtualizedRenderer(this.canvas, ctx);
    }

    // Initialize batch processor
    if (this.config.enableBatching) {
      this.batchProcessor = new BatchProcessor(this.processBatchOperations.bind(this));
    }

    // Initialize hit test manager
    if (this.config.enableWorkerHitTest) {
      this.hitTestManager = new HitTestManager();
    }

    // Initialize lazy loader
    if (this.config.enableLazyLoading) {
      this.lazyLoader = new LazyLoader();
    }

    // Initialize texture atlas
    if (this.config.enableTextureAtlas) {
      this.textureAtlas = new TextureAtlas();
    }

    // Start performance monitoring
    this.startPerformanceMonitoring();
  }

  // Virtualized rendering
  scheduleRender(nodes: CanvasNode[], viewport: ViewportBounds): void {
    if (!this.renderer) {
      this.fallbackRender(nodes, viewport);
      return;
    }

    // Split nodes into batches based on priority
    const batches = this.createRenderBatches(nodes, viewport);
    
    batches.forEach(batch => {
      this.renderer!.scheduleRender(batch);
    });
  }

  private createRenderBatches(nodes: CanvasNode[], viewport: ViewportBounds) {
    const batchSize = 50;
    const batches = [];

    // Sort nodes by distance from viewport center for optimal rendering
    const centerX = viewport.x + viewport.width / 2;
    const centerY = viewport.y + viewport.height / 2;
    
    const sortedNodes = nodes.sort((a, b) => {
      const aDistance = Math.sqrt(
        Math.pow((a.transform.position.x || 0) - centerX, 2) + 
        Math.pow((a.transform.position.y || 0) - centerY, 2)
      );
      const bDistance = Math.sqrt(
        Math.pow((b.transform.position.x || 0) - centerX, 2) + 
        Math.pow((b.transform.position.y || 0) - centerY, 2)
      );
      return aDistance - bDistance;
    });

    // Create batches
    for (let i = 0; i < sortedNodes.length; i += batchSize) {
      const batchNodes = sortedNodes.slice(i, i + batchSize);
      const priority = i === 0 ? 'high' : i < batchSize * 2 ? 'medium' : 'low';
      
      batches.push({
        id: `batch-${i / batchSize}`,
        nodes: batchNodes,
        bounds: viewport,
        priority: priority as 'high' | 'medium' | 'low'
      });
    }

    return batches;
  }

  // Batched operations
  queueOperation(operation: BatchOperation): void {
    if (this.batchProcessor) {
      this.batchProcessor.queueOperation(operation);
    } else {
      // Fallback to immediate processing
      this.processBatchOperations([operation]);
    }
  }

  private processBatchOperations(operations: BatchOperation[]): void {
    // Process operations in batches
    operations.forEach(op => {
      // Emit events or call handlers based on operation type
      console.log('Processing operation:', op);
    });
  }

  // Hit testing
  async hitTest(point: { x: number; y: number }, nodes: CanvasNode[]): Promise<string[]> {
    if (this.hitTestManager) {
      return this.hitTestManager.hitTest(point, nodes);
    }
    
    // Fallback hit test
    return this.fallbackHitTest(point, nodes);
  }

  private fallbackHitTest(point: { x: number; y: number }, nodes: CanvasNode[]): string[] {
    const hitNodes: string[] = [];
    
    for (const node of nodes) {
      const x = node.transform.position.x || 0;
      const y = node.transform.position.y || 0;
      const width = node.size.width || 100;
      const height = node.size.height || 50;

      if (point.x >= x && point.x <= x + width && 
          point.y >= y && point.y <= y + height) {
        hitNodes.push(node.id);
      }
    }

    return hitNodes.reverse();
  }

  // Lazy loading
  loadAsset(asset: LoadableAsset, element?: HTMLElement): Promise<any> {
    if (this.lazyLoader) {
      return this.lazyLoader.loadAsset(asset, element);
    }
    
    // Fallback loading
    return Promise.resolve(null);
  }

  observeElement(element: HTMLElement, asset: LoadableAsset): void {
    if (this.lazyLoader) {
      this.lazyLoader.observeElement(element, asset);
    }
  }

  // Texture atlas
  addTexture(id: string, source: HTMLImageElement | HTMLCanvasElement): boolean {
    if (this.textureAtlas) {
      return this.textureAtlas.addTexture(id, source) !== null;
    }
    return false;
  }

  renderTexture(
    ctx: CanvasRenderingContext2D,
    textureId: string,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): boolean {
    if (this.textureAtlas) {
      return this.textureAtlas.renderTexture(ctx, textureId, x, y, width, height);
    }
    return false;
  }

  // Performance monitoring
  private startPerformanceMonitoring(): void {
    const measureFrame = () => {
      const now = performance.now();
      if (this.lastFrameTime > 0) {
        const frameDuration = now - this.lastFrameTime;
        this.frameMetrics.push(frameDuration);
        
        // Keep only last 100 frames
        if (this.frameMetrics.length > 100) {
          this.frameMetrics.shift();
        }
      }
      this.lastFrameTime = now;
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  }

  // Performance metrics
  getPerformanceMetrics() {
    const avgFrameTime = this.frameMetrics.length > 0 
      ? this.frameMetrics.reduce((a, b) => a + b, 0) / this.frameMetrics.length 
      : 0;
    
    const fps = avgFrameTime > 0 ? 1000 / avgFrameTime : 0;

    return {
      averageFrameTime: avgFrameTime,
      currentFps: fps,
      targetFps: this.config.targetFps,
      frameMetrics: [...this.frameMetrics],
      rendererMetrics: this.renderer?.getMetrics() || null,
      batchQueueSize: this.batchProcessor?.getQueueSize() || 0,
      cacheSize: this.lazyLoader?.getCacheSize() || 0,
      atlasUsage: this.textureAtlas?.getAtlasUsage() || 0,
    };
  }

  // Fallback rendering
  private fallbackRender(nodes: CanvasNode[], viewport: ViewportBounds): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(viewport.zoom, viewport.zoom);
    ctx.translate(-viewport.x, -viewport.y);

    // Simple rendering fallback
    nodes.forEach(node => {
      const x = node.transform.position.x || 0;
      const y = node.transform.position.y || 0;
      const width = node.size.width || 100;
      const height = node.size.height || 50;

      ctx.fillStyle = node.style.fill || '#ffffff';
      ctx.strokeStyle = node.style.stroke || '#000000';
      ctx.lineWidth = node.style.strokeWidth || 1;
      
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
    });

    ctx.restore();
  }

  // Cleanup
  destroy(): void {
    this.renderer?.clear();
    this.batchProcessor?.clear();
    this.hitTestManager?.destroy();
    this.lazyLoader?.destroy();
    this.textureAtlas?.clear();
    this.frameMetrics = [];
  }

  // Configuration updates
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    // Reinitialize if needed
  }
}
