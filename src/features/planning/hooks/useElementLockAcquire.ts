/**
 * useElementLockAcquire — wraps `useElementLock.acquire` with user-facing
 * feedback when the lock cannot be obtained because another collaborator
 * is currently holding it.
 *
 * On failure:
 *   1. Re-fetches the planning_elements row to know `locked_by` + `locked_at`.
 *   2. Resolves the holder display name via the live `peersById` map.
 *   3. Computes remaining TTL = max(0, ELEMENT_LOCK_TTL_MS - (now - locked_at)).
 *   4. Surfaces a Sonner toast (Arabic, RTL) showing the holder and seconds
 *      until the lock auto-expires.
 *
 * Usage:
 *   const tryAcquire = useElementLockAcquire(acquire, peersById);
 *   const ok = await tryAcquire(elementId);
 */
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  getPlanningElement,
  ELEMENT_LOCK_TTL_MS,
  type PlanningElement,
} from "@/services/central/planningBoards.service";
import type { PresencePeer } from "./usePlanningRealtime";

export interface LockFailureInfo {
  elementId: string;
  holderUserId: string | null;
  holderName: string;
  remainingMs: number;
}

export type AcquireFn = (elementId: string) => Promise<boolean>;

function computeRemainingMs(lockedAtIso: string | null | undefined): number {
  if (!lockedAtIso) return 0;
  const lockedAt = new Date(lockedAtIso).getTime();
  if (Number.isNaN(lockedAt)) return 0;
  return Math.max(0, ELEMENT_LOCK_TTL_MS - (Date.now() - lockedAt));
}

/**
 * Returns a STABLE-reference async fn (identity does not change across renders).
 * Volatile inputs (peersById, options, acquire) are captured via refs so that
 * consumers passing this to memoized children don't trigger cascading re-renders
 * every time presence updates arrive.
 */
export function useElementLockAcquire(
  acquire: AcquireFn,
  peersById: Record<string, PresencePeer> = {},
  options?: {
    onFailure?: (info: LockFailureInfo) => void;
    suppressToast?: boolean;
  },
) {
  const acquireRef = useRef(acquire);
  const peersRef = useRef(peersById);
  const optionsRef = useRef(options);

  useEffect(() => { acquireRef.current = acquire; }, [acquire]);
  useEffect(() => { peersRef.current = peersById; }, [peersById]);
  useEffect(() => { optionsRef.current = options; }, [options]);

  return useCallback(
    async (elementId: string): Promise<boolean> => {
      const ok = await acquireRef.current(elementId);
      if (ok) return true;

      let row: PlanningElement | null = null;
      try {
        row = await getPlanningElement(elementId);
      } catch {
        row = null;
      }

      const holderUserId = row?.locked_by ?? null;
      const holderName = holderUserId
        ? (peersRef.current[holderUserId]?.display_name ?? "متعاون آخر")
        : "متعاون آخر";
      const remainingMs = computeRemainingMs(row?.locked_at ?? null);
      const seconds = Math.ceil(remainingMs / 1000);

      const info: LockFailureInfo = {
        elementId,
        holderUserId,
        holderName,
        remainingMs,
      };

      optionsRef.current?.onFailure?.(info);

      if (!optionsRef.current?.suppressToast) {
        toast.error(`العنصر مقفل حاليًا — يحرّره ${holderName}`, {
          description:
            seconds > 0
              ? `سيتم تحرير القفل تلقائيًا خلال ${seconds} ثانية`
              : "سيتم تحرير القفل خلال لحظات",
          duration: Math.min(8000, Math.max(3000, remainingMs || 4000)),
        });
      }

      return false;
    },
    [],
  );
}
