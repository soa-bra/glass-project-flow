/**
 * useAutoUnlockStaleLocks — UR-005 client-side TTL sweep.
 *
 * Polls every `intervalMs` (default 7s, clamped to 5–10s) and frees any
 * element whose `locked_at` is older than ELEMENT_LOCK_TTL_MS (30s).
 * Server-side acquire already tolerates stale locks; this hook keeps the
 * UI in sync without waiting for the next realtime UPDATE.
 *
 * Usage:
 *   useAutoUnlockStaleLocks(elements, {
 *     onExpire: (id) => setElements((s) => s.map(e =>
 *       e.id === id ? { ...e, locked_by: null, locked_at: null } : e
 *     )),
 *   });
 */
import { useEffect, useRef } from "react";
import { PlanningBoardsService } from "@/services/central";
import type { PlanningElement } from "@/services/central/planningBoards.service";

const { ELEMENT_LOCK_TTL_MS } = PlanningBoardsService;

const MIN_INTERVAL_MS = 5_000;
const MAX_INTERVAL_MS = 10_000;
const DEFAULT_INTERVAL_MS = 7_000;

export interface UseAutoUnlockStaleLocksOptions {
  /** Sweep interval (ms). Clamped to 5–10s. Default 7s. */
  intervalMs?: number;
  /** Called once per element that just crossed the TTL boundary. */
  onExpire?: (elementId: string) => void;
  /** Pause the sweep without unmounting the hook. */
  enabled?: boolean;
}

export function useAutoUnlockStaleLocks(
  elements: ReadonlyArray<Pick<PlanningElement, "id" | "locked_by" | "locked_at">>,
  options: UseAutoUnlockStaleLocksOptions = {},
): void {
  const { intervalMs, onExpire, enabled = true } = options;
  const elementsRef = useRef(elements);
  const onExpireRef = useRef(onExpire);
  const reportedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    elementsRef.current = elements;
    // Prune the "already reported" set so a re-locked element can fire again.
    const live = new Set(
      elements
        .filter((el) => el.locked_by && el.locked_at)
        .map((el) => el.id),
    );
    for (const id of reportedRef.current) {
      if (!live.has(id)) reportedRef.current.delete(id);
    }
  }, [elements]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!enabled) return;
    const period = Math.min(
      MAX_INTERVAL_MS,
      Math.max(MIN_INTERVAL_MS, intervalMs ?? DEFAULT_INTERVAL_MS),
    );

    const sweep = () => {
      const now = Date.now();
      const cutoff = now - ELEMENT_LOCK_TTL_MS;
      for (const el of elementsRef.current) {
        if (!el.locked_by || !el.locked_at) continue;
        const lockedAtMs = Date.parse(el.locked_at);
        if (Number.isNaN(lockedAtMs)) continue;
        if (lockedAtMs < cutoff && !reportedRef.current.has(el.id)) {
          reportedRef.current.add(el.id);
          try {
            onExpireRef.current?.(el.id);
          } catch {
            /* best-effort */
          }
        }
      }
    };

    sweep();
    const handle = window.setInterval(sweep, period);
    return () => window.clearInterval(handle);
  }, [enabled, intervalMs]);
}
