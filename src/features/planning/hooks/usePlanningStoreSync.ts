/**
 * usePlanningStoreSync — wires Supabase Realtime + initial fetch for a
 * planning board directly into the canvas Zustand store.
 *
 * - Hydrates `usePlanningStore.elements` from `planning_elements` on mount.
 * - Reconciles INSERT / UPDATE / DELETE events into the store in place.
 * - Uses `setState` directly (no history push) so remote events don't
 *   pollute the undo stack.
 * - Echo suppression: events whose `updated_at` matches the local copy
 *   are ignored to prevent flicker after an optimistic write.
 *
 * Usage:
 *   const sync = usePlanningStoreSync(boardId);
 *   // sync.peers, sync.broadcastCursor, sync.isConnected available for UI
 */
import { useCallback, useEffect } from "react";
import { PlanningBoardsService } from "@/services/central";
import type { PlanningElement } from "@/services/central/planningBoards.service";
import { usePlanningStore } from "@/features/planning/state/store";
import { planningElementToCanvas } from "@/features/planning/state/planningElementMapper";
import { isPlanningConnectorElement } from "@/features/planning/integration/connectors";
import { usePlanningRealtime } from "./usePlanningRealtime";

function sortByZ(rows: PlanningElement[]): PlanningElement[] {
  return [...rows].sort((a, b) => {
    if (a.z_index !== b.z_index) return a.z_index - b.z_index;
    return (
      new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    );
  });
}

export function usePlanningStoreSync(
  boardId: string | null,
  selfDisplayName?: string,
) {
  // Initial hydration.
  useEffect(() => {
    if (!boardId) {
      usePlanningStore.setState({ elements: [] });
      return;
    }
    let cancelled = false;
    void PlanningBoardsService.listPlanningElements(boardId)
      .then((rows) => {
        if (cancelled) return;
        const mapped = sortByZ(rows).map(planningElementToCanvas);
        usePlanningStore.setState({ elements: mapped });
      })
      .catch((err) => {
        console.error("[usePlanningStoreSync] fetch failed", err);
      });
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const onElementInsert = useCallback((row: PlanningElement) => {
    usePlanningStore.setState((state) => {
      if (state.elements.some((e) => e.id === row.id)) return state;
      return { elements: [...state.elements, planningElementToCanvas(row)] };
    });
  }, []);

  const onElementUpdate = useCallback((row: PlanningElement) => {
    usePlanningStore.setState((state) => {
      const idx = state.elements.findIndex((e) => e.id === row.id);
      if (idx === -1) {
        return { elements: [...state.elements, planningElementToCanvas(row)] };
      }
      const existing = state.elements[idx];
      // Echo suppression — local state already at this version.
      if (existing.updatedAt === row.updated_at) return state;
      const next = state.elements.slice();
      next[idx] = planningElementToCanvas(row);
      return { elements: next };
    });
  }, []);

  const onElementDelete = useCallback((id: string) => {
    usePlanningStore.setState((state) => {
      if (!state.elements.some((e) => e.id === id)) return state;
      const idsToDelete = new Set<string>([id]);
      state.elements.forEach((element) => {
        if (!isPlanningConnectorElement(element)) return;
        const data = element.data as any;
        if (
          data?.startNodeId === id ||
          data?.endNodeId === id ||
          data?.startPoint?.elementId === id ||
          data?.endPoint?.elementId === id
        ) {
          idsToDelete.add(element.id);
        }
      });
      return { elements: state.elements.filter((e) => !idsToDelete.has(e.id)) };
    });
  }, []);

  return usePlanningRealtime({
    boardId,
    selfDisplayName,
    onElementInsert,
    onElementUpdate,
    onElementDelete,
  });
}
