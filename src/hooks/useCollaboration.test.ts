import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCollaboration } from './useCollaboration';
import { collaborationEngine } from '@/engine/canvas/collaboration/collaborationEngine';
import { useCanvasStore } from '@/stores/canvasStore';

const addElement = vi.fn();
const updateElement = vi.fn();
const deleteElement = vi.fn();

type RemoteElementChange = {
  type: 'element_created' | 'element_updated' | 'element_deleted' | 'element_moved' | 'element_resized';
  payload: Record<string, unknown>;
};

type InitializeOptions = {
  onRemoteElementChange: (event: RemoteElementChange) => void;
};

let initializeOptions: InitializeOptions | undefined;

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: {
    getState: vi.fn(() => ({
      addElement,
      updateElement,
      deleteElement,
      elements: [],
    })),
  },
}));

vi.mock('@/engine/canvas/collaboration/collaborationEngine', () => ({
  collaborationEngine: {
    initialize: vi.fn((options: InitializeOptions) => {
      initializeOptions = options;
    }),
    joinBoard: vi.fn().mockResolvedValue(undefined),
    leaveBoard: vi.fn(),
    updateCursor: vi.fn(),
    updateSelection: vi.fn(),
    broadcastElementChange: vi.fn().mockResolvedValue(undefined),
    acquireLock: vi.fn().mockResolvedValue(true),
    releaseLock: vi.fn().mockResolvedValue(undefined),
    isElementLocked: vi.fn(() => false),
    getLockOwner: vi.fn(() => null),
  },
}));

describe('useCollaboration legacy element sync guard', () => {
  afterEach(() => {
    vi.clearAllMocks();
    initializeOptions = undefined;
  });

  it('does not apply remote element changes to the canvas store by default', async () => {
    renderHook(() =>
      useCollaboration({
        boardId: 'board-1',
        odId: 'user-1',
        userName: 'User One',
      }),
    );

    await waitFor(() => expect(initializeOptions).toBeDefined());

    initializeOptions?.onRemoteElementChange({
      type: 'element_created',
      payload: { element: { id: 'element-1', type: 'sticky_note' } },
    });

    expect(useCanvasStore.getState).not.toHaveBeenCalled();
    expect(addElement).not.toHaveBeenCalled();
    expect(updateElement).not.toHaveBeenCalled();
    expect(deleteElement).not.toHaveBeenCalled();
  });

  it('keeps legacy element sync available only when explicitly enabled', async () => {
    const { result } = renderHook(() =>
      useCollaboration({
        boardId: 'board-1',
        odId: 'user-1',
        userName: 'User One',
        legacyElementSyncEnabled: true,
      }),
    );

    await waitFor(() => expect(result.current.isConnected).toBe(true));

    initializeOptions?.onRemoteElementChange({
      type: 'element_updated',
      payload: { elementId: 'element-1', updates: { position: { x: 10, y: 20 } } },
    });

    expect(updateElement).toHaveBeenCalledWith('element-1', { position: { x: 10, y: 20 } });

    await result.current.broadcastElementDeleted('element-1');

    expect(collaborationEngine.broadcastElementChange).toHaveBeenCalledWith('element_deleted', {
      entityType: 'element',
      entityId: 'element-1',
      elementId: 'element-1',
    });
  });
});