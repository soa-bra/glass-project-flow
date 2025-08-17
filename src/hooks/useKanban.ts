import { useState, useEffect, useCallback } from 'react';
import { kanbanService } from '@/services/kanban';
import type { 
  KanbanBoard, 
  KanbanTask, 
  KanbanMetrics,
  TaskStatus,
  WIPViolation
} from '@/types/kanban';

export const useKanban = (boardId: string) => {
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [metrics, setMetrics] = useState<KanbanMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wipViolations, setWipViolations] = useState<WIPViolation[]>([]);

  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await kanbanService.getBoard(boardId);
      setBoard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch board');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await kanbanService.getMetrics(boardId);
      setMetrics(data);
      setWipViolations(data.wipViolations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    }
  }, [boardId]);

  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check WIP limits before moving
      const violations = await kanbanService.checkWIPLimits(boardId, newStatus, taskId);
      if (violations.length > 0 && !violations[0].canAdd) {
        throw new Error(`لا يمكن نقل المهمة. تم تجاوز حد WIP لحالة "${newStatus}" (${violations[0].currentCount}/${violations[0].limit})`);
      }
      
      await kanbanService.moveTask(taskId, newStatus);
      
      // Refresh board and metrics
      await fetchBoard();
      await fetchMetrics();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [boardId, fetchBoard, fetchMetrics]);

  const updateWIPLimit = useCallback(async (status: TaskStatus, limit: number) => {
    try {
      setLoading(true);
      setError(null);
      await kanbanService.updateWIPLimit(boardId, status, limit);
      
      // Refresh board and metrics
      await fetchBoard();
      await fetchMetrics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update WIP limit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [boardId, fetchBoard, fetchMetrics]);

  const checkWIPViolations = useCallback(async (status: TaskStatus, excludeTaskId?: string) => {
    try {
      const violations = await kanbanService.checkWIPLimits(boardId, status, excludeTaskId);
      return violations;
    } catch (err) {
      // Handle WIP violation check failure silently
      return [];
    }
  }, [boardId]);

  useEffect(() => {
    if (boardId) {
      fetchBoard();
      fetchMetrics();
    }
  }, [boardId, fetchBoard, fetchMetrics]);

  return {
    board,
    metrics,
    wipViolations,
    loading,
    error,
    actions: {
      fetchBoard,
      fetchMetrics,
      moveTask,
      updateWIPLimit,
      checkWIPViolations,
      refresh: () => {
        fetchBoard();
        fetchMetrics();
      }
    }
  };
};