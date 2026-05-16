/**
 * useElementLock — UR-005 cooperative locking contract.
 *
 * - Only ONE element per user per board can be locked at a time.
 * - Lock auto-expires server-side after 30s (ELEMENT_LOCK_TTL_MS).
 * - Hook refreshes (heartbeat) at TTL/3 to keep the lock alive while in use.
 * - Releases on `release()`, unmount, tab hide, or window unload.
 *
 * Usage:
 *   const { locked, acquire, release } = useElementLock(boardId);
 *   await acquire(elementId);   // returns true if granted
 *   await release();             // optional — auto-released on unmount
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  acquireExclusiveElementLock,
  releaseUserLocksOnBoard,
  ELEMENT_LOCK_TTL_MS,
} from "@/services/central";

const HEARTBEAT_MS = Math.floor(ELEMENT_LOCK_TTL_MS / 3); // ≈10s

export function useElementLock(boardId: string | null | undefined) {
  const [locked, setLocked] = useState<string | null>(null);
  const lockedRef = useRef<string | null>(null);
  const beatRef = useRef<number | null>(null);

  const clearBeat = useCallback(() => {
    if (beatRef.current != null) {
      window.clearInterval(beatRef.current);
      beatRef.current = null;
    }
  }, []);

  const release = useCallback(async () => {
    clearBeat();
    const board = boardId;
    lockedRef.current = null;
    setLocked(null);
    if (!board) return;
    try {
      await releaseUserLocksOnBoard(board);
    } catch {
      /* best-effort */
    }
  }, [boardId, clearBeat]);

  const acquire = useCallback(
    async (elementId: string): Promise<boolean> => {
      if (!boardId) return false;
      if (lockedRef.current === elementId) return true;
      const row = await acquireExclusiveElementLock(boardId, elementId);
      if (!row) return false;
      lockedRef.current = elementId;
      setLocked(elementId);
      clearBeat();
      beatRef.current = window.setInterval(() => {
        // Heartbeat: re-acquire to refresh locked_at; ignore failures.
        void acquireExclusiveElementLock(boardId, elementId).catch(() => null);
      }, HEARTBEAT_MS);
      return true;
    },
    [boardId, clearBeat],
  );

  // Auto-release on tab hide / unload / unmount.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void release();
    };
    const onUnload = () => {
      // Fire and forget; server-side TTL will clean up if this fails.
      void release();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onUnload);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onUnload);
      void release();
    };
  }, [release]);

  return { locked, acquire, release };
}
