import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useCanvasRealtimeController } from './useCanvasRealtimeController';

const mockUseCollaborationUser = vi.fn();

vi.mock('@/hooks/useCollaborationUser', () => ({
  useCollaborationUser: () => mockUseCollaborationUser(),
}));

describe('useCanvasRealtimeController', () => {
  const viewport = { zoom: 1.2, pan: { x: 15, y: 25 } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCollaborationUser.mockReturnValue({
      id: 'user-1',
      name: 'Dr. Osama',
    });
  });

  it('builds realtime props from board and collaboration user data', () => {
    const { result } = renderHook(() =>
      useCanvasRealtimeController({ boardId: 'board-123', viewport }),
    );

    expect(result.current.realtimeProps).toMatchObject({
      boardId: 'board-123',
      userId: 'user-1',
      userName: 'Dr. Osama',
      enabled: true,
      viewport,
    });
    expect(typeof result.current.realtimeProps.onSyncStatusChange).toBe('function');
  });

  it('logs sync status changes through the returned callback', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useCanvasRealtimeController({ boardId: 'board-123', viewport }),
    );

    act(() => {
      result.current.realtimeProps.onSyncStatusChange('connected');
    });

    expect(logSpy).toHaveBeenCalledWith('Sync status:', 'connected');
    logSpy.mockRestore();
  });
});
