import { ELEMENT_LOCK_TTL_MS } from '@/services/central/planningBoards.service';

export interface ActiveElementLock {
  lockedBy: string;
  lockedAtMs: number;
  expiresAtMs: number;
}

export function getActiveElementLock(
  lockedBy: string | null | undefined,
  lockedAt: string | null | undefined,
  nowMs = Date.now(),
): ActiveElementLock | null {
  if (!lockedBy || !lockedAt) return null;

  const lockedAtMs = Date.parse(lockedAt);
  if (!Number.isFinite(lockedAtMs)) return null;

  const expiresAtMs = lockedAtMs + ELEMENT_LOCK_TTL_MS;
  if (nowMs > expiresAtMs) return null;

  return { lockedBy, lockedAtMs, expiresAtMs };
}

export function getElementLockExpiryDelayMs(lock: ActiveElementLock, nowMs = Date.now()): number {
  return Math.max(0, lock.expiresAtMs - nowMs);
}
