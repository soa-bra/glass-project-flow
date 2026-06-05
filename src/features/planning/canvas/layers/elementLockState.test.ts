import { describe, expect, it } from 'vitest';
import { ELEMENT_LOCK_TTL_MS } from '@/services/central/planningBoards.service';
import { getActiveElementLock, getElementLockExpiryDelayMs } from './elementLockState';

describe('elementLockState', () => {
  it('treats missing lock timestamps as unlocked', () => {
    expect(getActiveElementLock('user-2', null, Date.parse('2026-01-01T00:00:00Z'))).toBeNull();
  });

  it('treats invalid lock timestamps as unlocked', () => {
    expect(getActiveElementLock('user-2', 'not-a-date', Date.parse('2026-01-01T00:00:00Z'))).toBeNull();
  });

  it('returns an active lock before the official TTL expires', () => {
    const lockedAtMs = Date.parse('2026-01-01T00:00:00Z');
    const lock = getActiveElementLock('user-2', '2026-01-01T00:00:00Z', lockedAtMs + 1_000);

    expect(lock).toEqual({
      lockedBy: 'user-2',
      lockedAtMs,
      expiresAtMs: lockedAtMs + ELEMENT_LOCK_TTL_MS,
    });
    expect(getElementLockExpiryDelayMs(lock!, lockedAtMs + 1_000)).toBe(ELEMENT_LOCK_TTL_MS - 1_000);
  });

  it('treats locks older than the official TTL as unlocked', () => {
    const lockedAtMs = Date.parse('2026-01-01T00:00:00Z');

    expect(
      getActiveElementLock('user-2', '2026-01-01T00:00:00Z', lockedAtMs + ELEMENT_LOCK_TTL_MS + 1),
    ).toBeNull();
  });
});
