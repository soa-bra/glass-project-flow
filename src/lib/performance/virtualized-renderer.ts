// Virtualized Canvas Renderer for high-performance rendering
import { CanvasNode } from '@/lib/canvas/types';

export interface ViewportBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

export interface RenderBatch {
  id: string;
  nodes: CanvasNode[];
  bounds: ViewportBounds;
  priority: 'high' | 'medium' | 'low';
}

export class VirtualizedRenderer {
  private renderQueue = new Map<string, RenderBatch>();
  private activeRenders = new Set<string>();
  private frameId: number | null = null;
  private maxBatchSize = 50;
  private renderBudgetMs = 16; // Target 60fps

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {}

  scheduleRender(batch: RenderBatch): void {
    this.renderQueue.set(batch.id, batch);
    this.requestRender();
  }

  private requestRender(): void {
    if (this.frameId) return;

    this.frameId = requestAnimationFrame(() => {
      this.processBatches();
      this.frameId = null;
    });
  }

  private processBatches(): void {
    const startTime = performance.now();
    const batches = Array.from(this.renderQueue.values())
      .sort((a, b) => this.getPriority(a) - this.getPriority(b));

    for (const batch of batches) {
      if (performance.now() - startTime > this.renderBudgetMs) {
        break; // Respect frame budget
      }

      this.renderBatch(batch);
      this.renderQueue.delete(batch.id);
    }

    // Continue if there are remaining batches
    if (this.renderQueue.size > 0) {
      this.requestRender();
    }
  }

  private getPriority(batch: RenderBatch): number {
    const priorities = { high: 0, medium: 1, low: 2 };
    return priorities[batch.priority];
  }

  private renderBatch(batch: RenderBatch): void {
    const { nodes, bounds } = batch;
    
    // Cull nodes outside viewport with buffer
    const buffer = 100;
    const visibleNodes = nodes.filter(node => {
      const nodeRight = (node.transform?.position.x || 0) + (node.size?.width || 0);
      const nodeBottom = (node.transform?.position.y || 0) + (node.size?.height || 0);
      
      return !(
        nodeRight < bounds.x - buffer ||
        (node.transform?.position.x || 0) > bounds.x + bounds.width + buffer ||
        nodeBottom < bounds.y - buffer ||
        (node.transform?.position.y || 0) > bounds.y + bounds.height + buffer
      );
    });

    // Render visible nodes in chunks
    this.renderNodesChunked(visibleNodes, bounds);
  }

  private renderNodesChunked(nodes: CanvasNode[], bounds: ViewportBounds): void {
    const chunkSize = this.maxBatchSize;
    
    for (let i = 0; i < nodes.length; i += chunkSize) {
      const chunk = nodes.slice(i, i + chunkSize);
      
      // Use setTimeout for non-blocking rendering
      setTimeout(() => {
        this.renderChunk(chunk, bounds);
      }, 0);
    }
  }

  private renderChunk(nodes: CanvasNode[], bounds: ViewportBounds): void {
    this.ctx.save();
    
    // Apply zoom and pan transformations
    this.ctx.scale(bounds.zoom, bounds.zoom);
    this.ctx.translate(-bounds.x, -bounds.y);

    nodes.forEach(node => this.renderNode(node));
    
    this.ctx.restore();
  }

  private renderNode(node: CanvasNode): void {
    const x = node.transform?.position.x || 0;
    const y = node.transform?.position.y || 0;
    const width = node.size?.width || 100;
    const height = node.size?.height || 50;

    // Basic node rendering - can be extended for different node types
    this.ctx.fillStyle = node.style?.fill || '#ffffff';
    this.ctx.strokeStyle = node.style?.stroke || '#000000';
    this.ctx.lineWidth = node.style?.strokeWidth || 1;
    
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeRect(x, y, width, height);

    // Render text if present
    const textContent = (node as any).text || (node as any).content;
    if (textContent) {
      this.ctx.fillStyle = node.style?.fill || '#000000';
      this.ctx.font = '14px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        String(textContent).substring(0, 50), // Truncate long text
        x + width / 2,
        y + height / 2 + 5
      );
    }
  }

  clear(): void {
    this.renderQueue.clear();
    this.activeRenders.clear();
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  // Performance metrics
  getMetrics() {
    return {
      queueSize: this.renderQueue.size,
      activeRenders: this.activeRenders.size,
      maxBatchSize: this.maxBatchSize,
      renderBudgetMs: this.renderBudgetMs
    };
  }
}