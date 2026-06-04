import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlanningCanvasPersistence } from './usePlanningCanvasPersistence';

const mocks = vi.hoisted(() => ({
  syncResult: {
    peers: [],
    connectionStatus: 'connected',
    lastSyncAt: null,
    isConnected: true,
    selfUserId: '22222222-2222-4222-8222-222222222222',
    broadcastCursor: vi.fn(),
  },
  usePlanningStoreSync: vi.fn(),
  usePlanningElementPersistence: vi.fn(),
}));

vi.mock('./usePlanningStoreSync', () => ({
  usePlanningStoreSync: mocks.usePlanningStoreSync,
}));

vi.mock('./usePlanningElementPersistence', () => ({
  usePlanningElementPersistence: mocks.usePlanningElementPersistence,
}));

describe('usePlanningCanvasPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.usePlanningStoreSync.mockReturnValue(mocks.syncResult);
  });

  it('wires realtime sync and element persistence through one official hook', () => {
    const { result } = renderHook(() =>
      usePlanningCanvasPersistence('11111111-1111-4111-8111-111111111111', {
        selfDisplayName: 'مستخدم حالي',
        canPersist: true,
      }),
    );

    expect(result.current).toBe(mocks.syncResult);
    expect(mocks.usePlanningStoreSync).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      'مستخدم حالي',
    );
    expect(mocks.usePlanningElementPersistence).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      true,
    );
  });

  it('keeps readonly users subscribed while disabling persistence writes', () => {
    renderHook(() =>
      usePlanningCanvasPersistence('11111111-1111-4111-8111-111111111111', {
        selfDisplayName: 'قارئ',
        canPersist: false,
      }),
    );

    expect(mocks.usePlanningStoreSync).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      'قارئ',
    );
    expect(mocks.usePlanningElementPersistence).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      false,
    );
  });
});
