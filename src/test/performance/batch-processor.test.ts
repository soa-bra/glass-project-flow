// Batch Processor Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BatchProcessor } from '@/lib/performance/batch-processor';

describe('BatchProcessor', () => {
  let batchProcessor: BatchProcessor;
  let onBatchComplete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onBatchComplete = vi.fn();
    batchProcessor = new BatchProcessor(onBatchComplete);
  });

  afterEach(() => {
    batchProcessor.clear();
  });

  it('should initialize with empty queue', () => {
    expect(batchProcessor.getQueueSize()).toBe(0);
  });

  it('should queue operations', () => {
    const operation = {
      id: 'op-1',
      type: 'update' as const,
      nodeId: 'node-1',
      data: { transform: { position: { x: 100, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } } },
      timestamp: Date.now()
    };

    batchProcessor.queueOperation(operation);
    expect(batchProcessor.getQueueSize()).toBe(1);
  });

  it('should merge update operations for same node', () => {
    const op1 = {
      id: 'op-1',
      type: 'update' as const,
      nodeId: 'node-1',
      data: { x: 100 },
      timestamp: Date.now()
    };

    const op2 = {
      id: 'op-2',
      type: 'update' as const,
      nodeId: 'node-1',
      data: { y: 200 },
      timestamp: Date.now() + 10
    };

    batchProcessor.queueOperation(op1);
    batchProcessor.queueOperation(op2);

    expect(batchProcessor.getQueueSize()).toBe(1);
  });

  it('should not merge different operation types', () => {
    const op1 = {
      id: 'op-1',
      type: 'update' as const,
      nodeId: 'node-1',
      data: { x: 100 },
      timestamp: Date.now()
    };

    const op2 = {
      id: 'op-2',
      type: 'delete' as const,
      nodeId: 'node-1',
      timestamp: Date.now() + 10
    };

    batchProcessor.queueOperation(op1);
    batchProcessor.queueOperation(op2);

    expect(batchProcessor.getQueueSize()).toBe(2);
  });

  it('should process batch after delay', async () => {
    const operation = {
      id: 'op-1',
      type: 'create' as const,
      nodeId: 'node-1',
      data: { x: 100, y: 200 },
      timestamp: Date.now()
    };

    batchProcessor.queueOperation(operation);

    // Wait for batch processing
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(onBatchComplete).toHaveBeenCalledWith([operation]);
    expect(batchProcessor.getQueueSize()).toBe(0);
  });

  it('should flush operations immediately', () => {
    const operation = {
      id: 'op-1',
      type: 'move' as const,
      nodeId: 'node-1',
      data: { x: 150, y: 250 },
      timestamp: Date.now()
    };

    batchProcessor.queueOperation(operation);
    batchProcessor.flush();

    expect(onBatchComplete).toHaveBeenCalledWith([operation]);
    expect(batchProcessor.getQueueSize()).toBe(0);
  });

  it('should create multiple batches for large operation sets', async () => {
    const operations = Array.from({ length: 150 }, (_, i) => ({
      id: `op-${i}`,
      type: 'update' as const,
      nodeId: `node-${i}`,
      data: { x: i * 10 },
      timestamp: Date.now() + i
    }));

    operations.forEach(op => batchProcessor.queueOperation(op));

    // Wait for batch processing
    await new Promise(resolve => setTimeout(resolve, 20));

    // Should be called multiple times for different batches
    expect(onBatchComplete.mock.calls.length).toBeGreaterThan(1);
    
    // All operations should be processed
    const totalProcessed = onBatchComplete.mock.calls
      .reduce((sum, call) => sum + call[0].length, 0);
    expect(totalProcessed).toBe(150);
  });

  it('should clear queue', () => {
    const operation = {
      id: 'op-1',
      type: 'delete' as const,
      nodeId: 'node-1',
      timestamp: Date.now()
    };

    batchProcessor.queueOperation(operation);
    expect(batchProcessor.getQueueSize()).toBe(1);

    batchProcessor.clear();
    expect(batchProcessor.getQueueSize()).toBe(0);
  });
});