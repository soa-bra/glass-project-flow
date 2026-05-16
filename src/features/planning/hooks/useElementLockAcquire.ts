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
import { useCallback } from "react";
import { toast } from "sonner";
import {
  PlanningBoardsService,
  type PlanningElement,
} from "@/services/central/planningBoards.service";
import type { PresencePeer } from "./usePlanningRealtime";

const { getPlanningElement, ELEMENT_LOCK_TTL_MS } = PlanningBoardsService;

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

export function useElementLockAcquire(
  acquire: AcquireFn,
  peersById: Record<string, PresencePeer> = {},
  options?: {
    onFailure?: (info: LockFailureInfo) => void;
    suppressToast?: boolean;
  },
) {
  return useCallback(
    async (elementId: string): Promise<boolean> => {
      const ok = await acquire(elementId);
      if (ok) return true;

      let row: PlanningElement | null = null;
      try {
        row = await getPlanningElement(elementId);
      } catch {
        row = null;
      }

      const holderUserId = row?.locked_by ?? null;
      const holderName = holderUserId
        ? (peersById[holderUserId]?.display_name ?? "متعاون آخر")
        : "متعاون آخر";
      const remainingMs = computeRemainingMs(row?.locked_at ?? null);
      const seconds = Math.ceil(remainingMs / 1000);

      const info: LockFailureInfo = {
        elementId,
        holderUserId,
        holderName,
        remainingMs,
      };

      options?.onFailure?.(info);

      if (!options?.suppressToast) {
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
    [acquire, peersById, options],
  );
}
