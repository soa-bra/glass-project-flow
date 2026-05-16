/**
 * useElementHistory — fetch & live-refresh the change-history feed for a
 * single planning_elements row.
 *
 * - Initial load via `PlanningBoardsService.listElementHistory`.
 * - Subscribes to `planning_element_history` INSERT events filtered by
 *   `element_id` so the panel updates whenever someone edits the element.
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  PlanningBoardsService,
  type PlanningElementHistoryEntry,
} from "@/services/central";

export interface UseElementHistoryResult {
  entries: PlanningElementHistoryEntry[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useElementHistory(
  elementId: string | null,
  limit = 50,
): UseElementHistoryResult {
  const [entries, setEntries] = useState<PlanningElementHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!elementId) {
      setEntries([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const rows = await PlanningBoardsService.listElementHistory(
        elementId,
        limit,
      );
      setEntries(rows);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [elementId, limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!elementId) return;
    const channel = supabase
      .channel(`planning-element-history:${elementId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "planning_element_history",
          filter: `element_id=eq.${elementId}`,
        },
        (payload) => {
          const row = payload.new as unknown as PlanningElementHistoryEntry;
          setEntries((prev) => {
            if (prev.some((e) => e.id === row.id)) return prev;
            return [row, ...prev].slice(0, limit);
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [elementId, limit]);

  return { entries, isLoading, error, refresh };
}
