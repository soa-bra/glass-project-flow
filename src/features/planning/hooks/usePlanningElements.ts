/**
 * usePlanningElements — live elements list for a planning board.
 *
 * - Initial fetch via PlanningBoardsService.listPlanningElements.
 * - Subscribes to Realtime postgres_changes on `planning_elements` (filtered
 *   by board_id) and reconciles INSERT / UPDATE / DELETE into local state.
 * - Returns peers + broadcastCursor from usePlanningRealtime so consumers can
 *   render presence + cursors without opening a second channel.
 *
 * Optimistic mutations:
 * - createOptimistic / updateOptimistic / deleteOptimistic apply changes to
 *   local state immediately, then call the service. On success the optimistic
 *   row is reconciled with the server row (temp id replaced by real id). On
 *   failure the previous snapshot is restored. Realtime echoes are deduped by
 *   id, so concurrent confirmations are safe.
 *
 * Ordering: kept by (z_index asc, updated_at asc) to match the service.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { PlanningBoardsService } from "@/services/central";
import type {
  PlanningElement,
  PlanningElementCreateInput,
  PlanningElementUpdateInput,
} from "@/services/central/planningBoards.service";
import { usePlanningRealtime } from "./usePlanningRealtime";

function sortElements(rows: PlanningElement[]): PlanningElement[] {
  return [...rows].sort((a, b) => {
    if (a.z_index !== b.z_index) return a.z_index - b.z_index;
    return (
      new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    );
  });
}

const TEMP_ID_PREFIX = "temp-";
const makeTempId = () =>
  `${TEMP_ID_PREFIX}${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

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
  /** Optimistically insert; resolves with the server row (or rejects on failure with state rolled back). */
  createOptimistic: (input: PlanningElementCreateInput) => Promise<PlanningElement>;
  /** Optimistically patch; resolves with the server row (or rejects on failure with state rolled back). */
  updateOptimistic: (
    id: string,
    patch: PlanningElementUpdateInput,
  ) => Promise<PlanningElement>;
  /** Optimistically remove; resolves on success (or rejects on failure with state rolled back). */
  deleteOptimistic: (id: string) => Promise<void>;
}

export function usePlanningElements(
  boardId: string | null,
  selfDisplayName?: string,
): UsePlanningElementsResult {
  const [elements, setElements] = useState<PlanningElement[]>([]);
  const [loading, setLoading] = useState<boolean>(!!boardId);
  const [error, setError] = useState<Error | null>(null);

  // Track ids that were just confirmed by an optimistic mutation, so realtime
  // echoes for the same row don't trigger redundant re-sorts.
  const recentlyConfirmedRef = useRef<Set<string>>(new Set());
  const markConfirmed = (id: string) => {
    recentlyConfirmedRef.current.add(id);
    window.setTimeout(() => {
      recentlyConfirmedRef.current.delete(id);
    }, 2000);
  };

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

  // ── Optimistic mutations ──────────────────────────────────────────────────
  const createOptimistic = useCallback(
    async (input: PlanningElementCreateInput): Promise<PlanningElement> => {
      const nowIso = new Date().toISOString();
      const tempId = makeTempId();
      const optimisticRow: PlanningElement = {
        id: tempId,
        board_id: input.board_id,
        element_type: input.element_type,
        position: (input.position ?? { x: 0, y: 0 }) as PlanningElement["position"],
        size: (input.size ?? { width: 200, height: 120 }) as PlanningElement["size"],
        rotation: input.rotation ?? 0,
        z_index: input.z_index ?? 0,
        content: (input.content ?? {}) as PlanningElement["content"],
        style: (input.style ?? {}) as PlanningElement["style"],
        metadata: (input.metadata ?? {}) as PlanningElement["metadata"],
        schema_version: input.schema_version ?? 1,
        created_by: rt.selfUserId ?? "",
        locked_by: null,
        locked_at: null,
        created_at: nowIso,
        updated_at: nowIso,
      } as PlanningElement;

      setElements((prev) => sortElements([...prev, optimisticRow]));
      try {
        const saved = await PlanningBoardsService.createPlanningElement(input);
        markConfirmed(saved.id);
        setElements((prev) => {
          const without = prev.filter((e) => e.id !== tempId && e.id !== saved.id);
          return sortElements([...without, saved]);
        });
        return saved;
      } catch (e) {
        setElements((prev) => prev.filter((e) => e.id !== tempId));
        throw e instanceof Error ? e : new Error(String(e));
      }
    },
    [rt.selfUserId],
  );

  const updateOptimistic = useCallback(
    async (
      id: string,
      patch: PlanningElementUpdateInput,
    ): Promise<PlanningElement> => {
      let previousRow: PlanningElement | undefined;
      setElements((prev) => {
        const idx = prev.findIndex((e) => e.id === id);
        if (idx === -1) return prev;
        previousRow = prev[idx];
        const next = prev.slice();
        next[idx] = {
          ...previousRow,
          ...patch,
          updated_at: new Date().toISOString(),
        } as PlanningElement;
        return sortElements(next);
      });
      if (!previousRow) {
        throw new Error(`Element ${id} not found in local state`);
      }
      try {
        const saved = await PlanningBoardsService.updatePlanningElement(id, patch);
        markConfirmed(saved.id);
        setElements((prev) => {
          const idx = prev.findIndex((e) => e.id === id);
          if (idx === -1) return sortElements([...prev, saved]);
          const next = prev.slice();
          next[idx] = saved;
          return sortElements(next);
        });
        return saved;
      } catch (e) {
        // rollback
        const snapshot = previousRow;
        setElements((prev) => {
          const idx = prev.findIndex((el) => el.id === id);
          if (idx === -1) return sortElements([...prev, snapshot]);
          const next = prev.slice();
          next[idx] = snapshot;
          return sortElements(next);
        });
        throw e instanceof Error ? e : new Error(String(e));
      }
    },
    [],
  );

  const deleteOptimistic = useCallback(
    async (id: string): Promise<void> => {
      let removed: PlanningElement | undefined;
      setElements((prev) => {
        removed = prev.find((e) => e.id === id);
        return prev.filter((e) => e.id !== id);
      });
      if (!removed) return;
      try {
        await PlanningBoardsService.deletePlanningElement(id);
        markConfirmed(id);
      } catch (e) {
        const snapshot = removed;
        setElements((prev) =>
          prev.some((el) => el.id === id) ? prev : sortElements([...prev, snapshot]),
        );
        throw e instanceof Error ? e : new Error(String(e));
      }
    },
    [],
  );

  return {
    elements,
    loading,
    error,
    refresh,
    peers: rt.peers,
    peersById: rt.peersById,
    selfUserId: rt.selfUserId,
    broadcastCursor: rt.broadcastCursor,
    updateSelfPresence: rt.updateSelfPresence,
    isConnected: rt.isConnected,
    createOptimistic,
    updateOptimistic,
    deleteOptimistic,
  };
}
