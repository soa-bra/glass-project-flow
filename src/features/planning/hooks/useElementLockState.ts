/**
 * useElementLockState — derive UI lock status for a single planning element.
 *
 * Combines the element's server-side `locked_by`/`locked_at` with the active
 * TTL window (ELEMENT_LOCK_TTL_MS) to classify:
 *   - "unlocked"        → no holder, or TTL expired
 *   - "locked-by-self"  → current user holds the lock (editable)
 *   - "locked-by-other" → another user holds an active lock (read-only)
 *
 * Resolves the holder's display name via the presence peers map so the UI
 * can show «يحرّر هذا العنصر: {name}».
 */
import { useMemo } from "react";
import { PlanningBoardsService } from "@/services/central";
import type { PlanningElement } from "@/services/central/planningBoards.service";
import type { PresencePeer } from "./usePlanningRealtime";

const { ELEMENT_LOCK_TTL_MS } = PlanningBoardsService;

export type ElementLockStatus =
  | "unlocked"
  | "locked-by-self"
  | "locked-by-other";

export interface ElementLockState {
  status: ElementLockStatus;
  isEditable: boolean;
  lockedByUserId: string | null;
  lockedByName: string | null;
  lockedAt: Date | null;
  /** Localized Arabic message suitable for tooltips / banners. */
  message: string;
}

type LockableElement = Pick<PlanningElement, "id" | "locked_by" | "locked_at">;

export function useElementLockState(
  element: LockableElement | null | undefined,
  selfUserId: string | null,
  peersById: Record<string, PresencePeer> = {},
): ElementLockState {
  return useMemo<ElementLockState>(() => {
    if (!element || !element.locked_by || !element.locked_at) {
      return {
        status: "unlocked",
        isEditable: true,
        lockedByUserId: null,
        lockedByName: null,
        lockedAt: null,
        message: "متاح للتعديل",
      };
    }

    const lockedAtMs = Date.parse(element.locked_at);
    const expired =
      !Number.isFinite(lockedAtMs) ||
      Date.now() - lockedAtMs > ELEMENT_LOCK_TTL_MS;

    if (expired) {
      return {
        status: "unlocked",
        isEditable: true,
        lockedByUserId: null,
        lockedByName: null,
        lockedAt: null,
        message: "متاح للتعديل",
      };
    }

    if (selfUserId && element.locked_by === selfUserId) {
      return {
        status: "locked-by-self",
        isEditable: true,
        lockedByUserId: element.locked_by,
        lockedByName: "أنت",
        lockedAt: new Date(lockedAtMs),
        message: "أنت تحرّر هذا العنصر",
      };
    }

    const peer = peersById[element.locked_by];
    const name = peer?.display_name?.trim() || "مستخدم آخر";

    return {
      status: "locked-by-other",
      isEditable: false,
      lockedByUserId: element.locked_by,
      lockedByName: name,
      lockedAt: new Date(lockedAtMs),
      message: `مقفل حاليًا — يحرّره ${name}`,
    };
  }, [element, selfUserId, peersById]);
}
