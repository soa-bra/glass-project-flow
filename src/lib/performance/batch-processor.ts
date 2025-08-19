// Batched Operations Processor for Canvas
import { CanvasNode } from '@/lib/canvas/types';

// Flexible operation data types
export type MoveAbsolute = { x?: number; y?: number };
export type MoveDelta = { dx?: number; dy?: number };
export type SizeData = { width?: number; height?: number };
export type PositionData = { position?: { x?: number; y?: number } };

export type OperationData =
  | Partial<CanvasNode>
  | MoveAbsolute
  | MoveDelta  
  | SizeData
  | PositionData
  | { zIndex?: number }
  | Record<string, unknown>;

export interface BatchOperation {
  id: string;
  type: 'update' | 'delete' | 'create' | 'move';
  nodeId: string;
  data?: OperationData;
  timestamp: number;
}

// Helper function to apply move operations with different data formats
function applyMoveData(currentPosition: { x: number; y: number }, data: OperationData = {}): { x: number; y: number } {
  const d = data as any;
  
  // Handle position object format
  if (d.position && (d.position.x !== undefined || d.position.y !== undefined)) {
    return {
      x: d.position.x ?? currentPosition.x,
      y: d.position.y ?? currentPosition.y,
    };
  }
  
  // Handle absolute x/y format
  if (d.x !== undefined || d.y !== undefined) {
    return {
      x: d.x ?? currentPosition.x,
      y: d.y ?? currentPosition.y,
    };
  }
  
  // Handle delta dx/dy format
  if (d.dx !== undefined || d.dy !== undefined) {
    return {
      x: currentPosition.x + (d.dx ?? 0),
      y: currentPosition.y + (d.dy ?? 0),
    };
  }
  
  return currentPosition;
}

// Helper function to normalize operation data to CanvasNode format
function normalizeOperationData(operation: BatchOperation, currentNode?: Partial<CanvasNode>): Partial<CanvasNode> {
  if (!operation.data) return {};
  
  const d = operation.data as any;
  const result: any = {};
  
  // Handle different operation types
  switch (operation.type) {
    case 'move': {
      if (currentNode?.transform?.position) {
        const newPosition = applyMoveData(currentNode.transform.position, operation.data);
        result.transform = {
          ...currentNode.transform,
          position: newPosition,
        };
      }
      break;
    }
    
    case 'update':
    case 'create': {
      // Copy all data as-is, handling position and size specially
      Object.assign(result, d);
      
      // Handle shorthand position data
      if (d.x !== undefined || d.y !== undefined) {
        result.transform = {
          ...result.transform,
          position: {
            x: d.x ?? (currentNode?.transform?.position?.x ?? 0),
            y: d.y ?? (currentNode?.transform?.position?.y ?? 0),
          },
          rotation: result.transform?.rotation ?? 0,
          scale: result.transform?.scale ?? { x: 1, y: 1 },
        };
        delete result.x;
        delete result.y;
      }
      
      // Handle shorthand size data
      if (d.width !== undefined || d.height !== undefined) {
        result.size = {
          width: d.width ?? (currentNode?.size?.width ?? 100),
          height: d.height ?? (currentNode?.size?.height ?? 100),
        };
        delete result.width;
        delete result.height;
      }
      break;
    }
  }
  
  return result as Partial<CanvasNode>;
}

export class BatchProcessor {
  private operationQueue = new Map<string, BatchOperation>();
  private processingTimer: NodeJS.Timeout | null = null;
  private batchDelay = 16; // ~60fps
  private maxBatchSize = 100;

  constructor(private onBatchComplete: (operations: BatchOperation[]) => void) {}

  queueOperation(operation: BatchOperation): void {
    // Merge operations for the same node
    const existing = this.operationQueue.get(operation.nodeId);
    if (existing && this.canMergeOperations(existing, operation)) {
      this.operationQueue.set(operation.nodeId, this.mergeOperations(existing, operation));
    } else {
      this.operationQueue.set(operation.nodeId, operation);
    }

    this.scheduleBatchProcess();
  }

  private scheduleBatchProcess(): void {
    if (this.processingTimer) return;

    this.processingTimer = setTimeout(() => {
      this.processBatch();
      this.processingTimer = null;
    }, this.batchDelay);
  }

  private processBatch(): void {
    if (this.operationQueue.size === 0) return;

    const operations = Array.from(this.operationQueue.values());
    const batches = this.createBatches(operations);

    batches.forEach(batch => {
      this.onBatchComplete(batch);
    });

    this.operationQueue.clear();
  }

  private createBatches(operations: BatchOperation[]): BatchOperation[][] {
    const batches: BatchOperation[][] = [];
    const sortedOps = operations.sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 0; i < sortedOps.length; i += this.maxBatchSize) {
      batches.push(sortedOps.slice(i, i + this.maxBatchSize));
    }

    return batches;
  }

  private canMergeOperations(existing: BatchOperation, incoming: BatchOperation): boolean {
    // Only merge update operations for the same node
    return existing.nodeId === incoming.nodeId && 
           existing.type === 'update' && 
           incoming.type === 'update';
  }

  private mergeOperations(existing: BatchOperation, incoming: BatchOperation): BatchOperation {
    // Normalize both operations to CanvasNode format before merging
    const existingNormalized = normalizeOperationData(existing);
    const incomingNormalized = normalizeOperationData(incoming);
    
    return {
      ...existing,
      data: { ...existingNormalized, ...incomingNormalized },
      timestamp: incoming.timestamp
    };
  }

  flush(): void {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
    this.processBatch();
  }

  clear(): void {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
    this.operationQueue.clear();
  }

  getQueueSize(): number {
    return this.operationQueue.size;
  }
}