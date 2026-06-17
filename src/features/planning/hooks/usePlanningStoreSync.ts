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
import { useCallback, useEffect, useState } from "react";
import { PlanningBoardsService } from "@/services/central";
import type { PlanningElement } from "@/services/central/planningBoards.service";
import { usePlanningStore } from "@/features/planning/state/store";
import { DEFAULT_LAYER } from "@/features/planning/state/types";
import type { CanvasElement, LayerInfo } from "@/features/planning/state/types";
import { planningElementToCanvas } from "@/features/planning/state/planningElementMapper";
import { isPlanningConnectorElement } from "@/features/planning/integration/connectors";
import { usePlanningRealtime } from "./usePlanningRealtime";
import { useAutoUnlockStaleLocks } from "./useAutoUnlockStaleLocks";

function sortByZ(rows: PlanningElement[]): PlanningElement[] {
  return [...rows].sort((a, b) => {
    if (a.z_index !== b.z_index) return a.z_index - b.z_index;
    return (
      new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    );
  });
}

function ensureLayers(layers: LayerInfo[] | undefined): LayerInfo[] {
  return layers && layers.length > 0 ? layers : [{ ...DEFAULT_LAYER, elements: [] }];
}

function resolveLayerId(element: CanvasElement, layers: LayerInfo[]): string {
  const layerIds = new Set(layers.map((layer) => layer.id));
  const layerId = typeof element.layerId === "string" && element.layerId.trim()
    ? element.layerId
    : undefined;

  if (layerId && layerIds.has(layerId)) return layerId;
  return layers[0]?.id ?? DEFAULT_LAYER.id;
}

function assignLayerIds(elements: CanvasElement[], layers: LayerInfo[]): CanvasElement[] {
  return elements.map((element) => ({
    ...element,
    layerId: resolveLayerId(element, layers),
  }));
}

function rebuildLayerMembership(layers: LayerInfo[] | undefined, elements: CanvasElement[]): LayerInfo[] {
  const normalizedLayers = ensureLayers(layers);
  const elementIdsByLayer = new Map<string, string[]>(
    normalizedLayers.map((layer) => [layer.id, []]),
  );

  for (const element of elements) {
    const layerId = resolveLayerId(element, normalizedLayers);
    const ids = elementIdsByLayer.get(layerId) ?? [];
    if (!ids.includes(element.id)) ids.push(element.id);
    elementIdsByLayer.set(layerId, ids);
  }

  return normalizedLayers.map((layer) => ({
    ...layer,
    elements: elementIdsByLayer.get(layer.id) ?? [],
  }));
}

export type PlanningStoreHydrationStatus = "idle" | "loading" | "ready" | "error";

export function usePlanningStoreSync(
  boardId: string | null,
  selfDisplayName?: string,
) {
  const [hydrationStatus, setHydrationStatus] = useState<PlanningStoreHydrationStatus>(
    boardId ? "loading" : "idle",
  );
  const [hydrationError, setHydrationError] = useState<unknown>(null);
  const [hydratedBoardId, setHydratedBoardId] = useState<string | null>(null);
  const storeElements = usePlanningStore((state) => state.elements);

  useAutoUnlockStaleLocks(
    storeElements.map((element) => ({
      id: element.id,
      locked_by: (element as { lockedBy?: string | null }).lockedBy ?? null,
      locked_at: (element as { lockedAt?: string | null }).lockedAt ?? null,
    })),
    {
      enabled: Boolean(boardId),
      onExpire: (elementId) => {
        usePlanningStore.setState((state) => ({
          elements: state.elements.map((element) =>
            element.id === elementId
              ? { ...element, locked: false, lockedBy: null, lockedAt: null }
              : element,
          ),
        }));
      },
    },
  );

  // Initial hydration.
  useEffect(() => {
    if (!boardId) {
      setHydrationStatus("idle");
      setHydrationError(null);
      setHydratedBoardId(null);
      usePlanningStore.setState({ elements: [], pendingDeletedElementIds: [] });
      return;
    }

    let cancelled = false;
    setHydrationStatus("loading");
    setHydrationError(null);
    setHydratedBoardId(null);

    void PlanningBoardsService.listPlanningElements(boardId)
      .then((rows) => {
        if (cancelled) return;
        usePlanningStore.setState((state) => {
          const layers = ensureLayers(state.layers);
          const mapped = assignLayerIds(sortByZ(rows).map(planningElementToCanvas), layers);
          const mappedIds = new Set(mapped.map((element) => element.id));

          return {
            elements: mapped,
            layers: rebuildLayerMembership(layers, mapped),
            selectedElementIds: state.selectedElementIds.filter((id) =>
              mappedIds.has(id),
            ),
          };
        });
        setHydrationStatus("ready");
        setHydrationError(null);
        setHydratedBoardId(boardId);
      })
      .catch((err) => {
        if (cancelled) return;
        setHydrationStatus("error");
        setHydrationError(err);
        setHydratedBoardId(null);
        console.error("[usePlanningStoreSync] fetch failed", err);
      });
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const onElementInsert = useCallback((row: PlanningElement) => {
    usePlanningStore.setState((state) => {
      if (state.pendingDeletedElementIds.includes(row.id)) return state;
      if (state.elements.some((e) => e.id === row.id)) return state;
      const layers = ensureLayers(state.layers);
      const element = assignLayerIds([planningElementToCanvas(row)], layers)[0];
      const elements = [...state.elements, element];
      return {
        elements,
        layers: rebuildLayerMembership(layers, elements),
      };
    });
  }, []);

  const onElementUpdate = useCallback((row: PlanningElement) => {
    usePlanningStore.setState((state) => {
      if (state.pendingDeletedElementIds.includes(row.id)) return state;
      const layers = ensureLayers(state.layers);
      const idx = state.elements.findIndex((e) => e.id === row.id);
      if (idx === -1) {
        const element = assignLayerIds([planningElementToCanvas(row)], layers)[0];
        const elements = [...state.elements, element];
        return {
          elements,
          layers: rebuildLayerMembership(layers, elements),
        };
      }
      const existing = state.elements[idx];
      // Echo suppression — local state already at this version.
      if (existing.updatedAt === row.updated_at) return state;
      const mapped = planningElementToCanvas(row);
      const next = state.elements.slice();
      next[idx] = assignLayerIds([{ ...mapped, layerId: mapped.layerId ?? existing.layerId }], layers)[0];
      return {
        elements: next,
        layers: rebuildLayerMembership(layers, next),
      };
    });
  }, []);

  const onElementDelete = useCallback((id: string) => {
    usePlanningStore.setState((state) => {
      const idsToDelete = new Set<string>([id]);
      if (!state.elements.some((e) => e.id === id)) {
        return {
          pendingDeletedElementIds: state.pendingDeletedElementIds.filter((pendingId) => pendingId !== id),
        };
      }
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
      const elements = state.elements.filter((e) => !idsToDelete.has(e.id));
      const layers = ensureLayers(state.layers);
      return {
        elements,
        pendingDeletedElementIds: state.pendingDeletedElementIds.filter((pendingId) => !idsToDelete.has(pendingId)),
        layers: rebuildLayerMembership(layers, elements),
        selectedElementIds: state.selectedElementIds.filter((selectedId) =>
          !idsToDelete.has(selectedId),
        ),
      };
    });
  }, []);

  const realtime = usePlanningRealtime({
    boardId,
    selfDisplayName,
    onElementInsert,
    onElementUpdate,
    onElementDelete,
  });

  return {
    ...realtime,
    hydrationStatus,
    hydrationError,
    hydratedBoardId,
    isHydrated: hydrationStatus === "ready" || hydrationStatus === "idle",
  };
}
