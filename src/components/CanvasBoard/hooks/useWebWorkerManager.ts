import { useState, useCallback, useRef, useEffect } from 'react';
import { canvasErrorManager } from '../utils/errorHandling';

interface WorkerTask {
  id: string;
  type: string;
  data: any;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

interface WorkerPool {
  workers: Worker[];
  availableWorkers: Worker[];
  tasks: Map<string, WorkerTask>;
}

export const useWebWorkerManager = (workerScript: string, poolSize: number = 2) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const poolRef = useRef<WorkerPool | null>(null);
  const taskCounterRef = useRef(0);

  // Initialize worker pool
  const initializePool = useCallback(async () => {
    try {
      const workers: Worker[] = [];
      
      for (let i = 0; i < poolSize; i++) {
        const worker = new Worker(new URL(workerScript, import.meta.url), {
          type: 'module'
        });
        workers.push(worker);
      }

      poolRef.current = {
        workers,
        availableWorkers: [...workers],
        tasks: new Map()
      };

      // Set up message handlers
      workers.forEach((worker, index) => {
        worker.onmessage = (e) => handleWorkerMessage(e);
        worker.onerror = (error) => handleWorkerError(error, index);
      });

      setIsInitialized(true);
    } catch (error) {
      canvasErrorManager.addError({
        code: 'WORKER_INIT_FAILED',
        message: `Failed to initialize worker pool: ${error}`,
        severity: 'high',
        context: { workerScript, poolSize }
      });
    }
  }, [workerScript, poolSize]);

  // Handle worker messages
  const handleWorkerMessage = useCallback((e: MessageEvent) => {
    const { id, success, data, error } = e.data;
    const pool = poolRef.current;
    
    if (!pool) return;

    const task = pool.tasks.get(id);
    if (!task) return;

    // Return worker to available pool
    pool.availableWorkers.push(e.target as Worker);
    pool.tasks.delete(id);

    if (pool.tasks.size === 0) {
      setIsProcessing(false);
    }

    if (success) {
      task.resolve(data);
    } else {
      task.reject(new Error(error || 'Worker task failed'));
    }
  }, []);

  // Handle worker errors
  const handleWorkerError = useCallback((error: ErrorEvent, workerIndex: number) => {
    canvasErrorManager.addError({
      code: 'WORKER_ERROR',
      message: `Worker ${workerIndex} error: ${error.message}`,
      severity: 'medium',
      context: { workerIndex, error: error.error }
    });
  }, []);

  // Execute task in worker
  const executeTask = useCallback(async <T>(
    type: string,
    data: any,
    timeout: number = 30000
  ): Promise<T> => {
    const pool = poolRef.current;
    
    if (!pool || !isInitialized) {
      throw new Error('Worker pool not initialized');
    }

    if (pool.availableWorkers.length === 0) {
      throw new Error('No available workers');
    }

    return new Promise<T>((resolve, reject) => {
      const worker = pool.availableWorkers.pop()!;
      const taskId = `task-${++taskCounterRef.current}`;
      
      const task: WorkerTask = {
        id: taskId,
        type,
        data,
        resolve,
        reject,
        timestamp: Date.now()
      };

      pool.tasks.set(taskId, task);
      setIsProcessing(true);

      // Set timeout
      const timeoutId = setTimeout(() => {
        pool.tasks.delete(taskId);
        pool.availableWorkers.push(worker);
        
        if (pool.tasks.size === 0) {
          setIsProcessing(false);
        }
        
        reject(new Error(`Worker task timeout after ${timeout}ms`));
      }, timeout);

      // Clear timeout when task completes
      const originalResolve = task.resolve;
      const originalReject = task.reject;
      
      task.resolve = (value: any) => {
        clearTimeout(timeoutId);
        originalResolve(value);
      };
      
      task.reject = (error: Error) => {
        clearTimeout(timeoutId);
        originalReject(error);
      };

      // Send task to worker
      worker.postMessage({ id: taskId, type, data });
    });
  }, [isInitialized]);

  // Cleanup workers
  const cleanup = useCallback(() => {
    const pool = poolRef.current;
    if (!pool) return;

    pool.workers.forEach(worker => {
      worker.terminate();
    });

    poolRef.current = null;
    setIsInitialized(false);
    setIsProcessing(false);
  }, []);

  // Get pool status
  const getStatus = useCallback(() => {
    const pool = poolRef.current;
    if (!pool) return null;

    return {
      totalWorkers: pool.workers.length,
      availableWorkers: pool.availableWorkers.length,
      activeTasks: pool.tasks.size,
      isProcessing
    };
  }, [isProcessing]);

  // Initialize on mount
  useEffect(() => {
    initializePool();
    return cleanup;
  }, [initializePool, cleanup]);

  return {
    isInitialized,
    isProcessing,
    executeTask,
    cleanup,
    getStatus,
    reinitialize: initializePool
  };
};