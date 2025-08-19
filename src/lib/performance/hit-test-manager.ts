// Hit Test Manager using Web Worker
import { CanvasNode } from '@/lib/canvas/types';

export class HitTestManager {
  private worker: Worker | null = null;
  private pendingTests = new Map<string, (nodeIds: string[]) => void>();
  private testCounter = 0;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker(): void {
    try {
      // Create worker from hit-test-worker.ts
      const workerBlob = new Blob([
        `${this.getWorkerCode()}`
      ], { type: 'application/javascript' });
      
      this.worker = new Worker(URL.createObjectURL(workerBlob));
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
    } catch (error) {
      console.warn('Failed to create hit test worker, falling back to main thread');
    }
  }

  async hitTest(point: { x: number; y: number }, nodes: CanvasNode[]): Promise<string[]> {
    if (!this.worker) {
      // Fallback to main thread
      return this.hitTestMainThread(point, nodes);
    }

    return new Promise((resolve) => {
      const testId = (++this.testCounter).toString();
      this.pendingTests.set(testId, resolve);

      const nodeData = nodes.map(node => ({
        id: node.id,
        x: node.transform?.position.x || 0,
        y: node.transform?.position.y || 0,
        width: node.size?.width || 100,
        height: node.size?.height || 50,
        rotation: node.transform?.rotation
      }));

      this.worker.postMessage({
        type: 'hitTest',
        testId,
        point,
        nodes: nodeData
      });
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { type, testId, nodeIds } = event.data;
    
    if (type === 'hitTestResult') {
      const callback = this.pendingTests.get(testId);
      if (callback) {
        callback(nodeIds);
        this.pendingTests.delete(testId);
      }
    }
  }

  private hitTestMainThread(point: { x: number; y: number }, nodes: CanvasNode[]): string[] {
    const hitNodes: string[] = [];

    for (const node of nodes) {
      const x = node.transform?.position.x || 0;
      const y = node.transform?.position.y || 0;
      const width = node.size?.width || 100;
      const height = node.size?.height || 50;

      if (point.x >= x && point.x <= x + width && 
          point.y >= y && point.y <= y + height) {
        hitNodes.push(node.id);
      }
    }

    return hitNodes.reverse(); // Last drawn is on top
  }

  private getWorkerCode(): string {
    return `
      self.onmessage = (event) => {
        const { type, testId, point, nodes } = event.data;
        
        if (type === 'hitTest') {
          const hitNodes = [];
          
          for (const node of nodes) {
            if (isPointInNode(point, node)) {
              hitNodes.push(node.id);
            }
          }
          
          hitNodes.reverse();
          
          self.postMessage({
            type: 'hitTestResult',
            testId,
            nodeIds: hitNodes,
            point
          });
        }
      };
      
      function isPointInNode(point, node) {
        let { x, y } = point;
        
        if (node.rotation) {
          const centerX = node.x + node.width / 2;
          const centerY = node.y + node.height / 2;
          
          const translatedX = x - centerX;
          const translatedY = y - centerY;
          
          const cos = Math.cos(-node.rotation);
          const sin = Math.sin(-node.rotation);
          
          x = translatedX * cos - translatedY * sin + centerX;
          y = translatedX * sin + translatedY * cos + centerY;
        }
        
        return x >= node.x && 
               x <= node.x + node.width && 
               y >= node.y && 
               y <= node.y + node.height;
      }
    `;
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingTests.clear();
  }
}