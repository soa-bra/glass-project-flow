/**
 * usePlanningElements — live elements list for a planning board.
 *
 * - Initial fetch via PlanningBoardsService.listPlanningElements.
 * - Subscribes to Realtime postgres_changes on `planning_elements` (filtered
 *   by board_id) and reconciles INSERT / UPDATE / DELETE into local state.
 * - Returns peers + broadcastCursor from usePlanningRealtime so consumers can
 *   render presence + cursors without opening a second channel.
 *
 * Ordering: kept by (z_index asc, updated_at asc) to match the service.
 */
import { useCallback, useEffect, useState } from "react";
import { PlanningBoardsService } from "@/services/central";
import type { PlanningElement } from "@/services/central/planningBoards.service";
import { usePlanningRealtime } from "./usePlanningRealtime";

function sortElements(rows: PlanningElement[]): PlanningElement[] {
  return [...rows].sort((a, b) => {
    if (a.z_index !== b.z_index) return a.z_index - b.z_index;
    return (
      new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    );
  });
}

export interface UsePlanningElementsResult {
  elements: PlanningElement[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  peers: ReturnType<typeof usePlanningRealtime>["peers"];
  peersById: ReturnType<typeof usePlanningRealtime>["peersById"];
  selfUserId: string | null;
  broadcastCursor: (x: number, y: number) => void;
  updateSelfPresence: ReturnType<typeof usePlanningRealtime>["updateSelfPresence"];
  isConnected: boolean;
}

export function usePlanningElements(
  boardId: string | null,
  selfDisplayName?: string,
): UsePlanningElementsResult {
  const [elements, setElements] = useState<PlanningElement[]>([]);
  const [loading, setLoading] = useState<boolean>(!!boardId);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!boardId) {
      setElements([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await PlanningBoardsService.listPlanningElements(boardId);
      setElements(sortElements(rows));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onElementInsert = useCallback((row: PlanningElement) => {
    setElements((prev) =>
      prev.some((e) => e.id === row.id) ? prev : sortElements([...prev, row]),
    );
  }, []);

  const onElementUpdate = useCallback((row: PlanningElement) => {
    setElements((prev) => {
      const idx = prev.findIndex((e) => e.id === row.id);
      if (idx === -1) return sortElements([...prev, row]);
      const next = prev.slice();
      next[idx] = row;
      return sortElements(next);
    });
  }, []);

  const onElementDelete = useCallback((id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const rt = usePlanningRealtime({
    boardId,
    selfDisplayName,
    onElementInsert,
    onElementUpdate,
    onElementDelete,
  });

  return {
    elements,
    loading,
    error,
    refresh,
    peers: rt.peers,
    peersById: rt.peersById,
    selfUserId: rt.selfUserId,
    broadcastCursor: rt.broadcastCursor,
    isConnected: rt.isConnected,
  };
}
