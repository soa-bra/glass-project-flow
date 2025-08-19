// Batched Operations Processor for Canvas
import { CanvasNode } from '@/lib/canvas/types';

export interface BatchOperation {
  id: string;
  type: 'update' | 'delete' | 'create' | 'move';
  nodeId: string;
  data?: Partial<CanvasNode>;
  timestamp: number;
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
    return {
      ...existing,
      data: { ...existing.data, ...incoming.data },
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