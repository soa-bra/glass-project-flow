import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlanningStore } from '@/features/planning/state/store';
import type { PlanningElement } from '@/services/central/planningBoards.service';
import { usePlanningStoreSync } from './usePlanningStoreSync';

const mocks = vi.hoisted(() => ({
  listPlanningElements: vi.fn(),
  usePlanningRealtime: vi.fn(),
  realtimeOptions: undefined as any,
}));

vi.mock('@/services/central', () => ({
  PlanningBoardsService: {
    listPlanningElements: mocks.listPlanningElements,
  },
}));

vi.mock('./usePlanningRealtime', () => ({
  usePlanningRealtime: (options: any) => {
    mocks.realtimeOptions = options;
    return mocks.usePlanningRealtime(options) ?? {
      peers: [],
      peersById: {},
      connectionStatus: 'connected',
      lastSyncAt: null,
      isConnected: true,
      selfUserId: 'editor-user',
      broadcastCursor: vi.fn(),
      updateSelfPresence: vi.fn(),
    };
  },
}));

function createPlanningElement(overrides: Partial<PlanningElement> = {}): PlanningElement {
  return {
    id: '33333333-3333-4333-8333-333333333333',
    board_id: '11111111-1111-4111-8111-111111111111',
    created_by: '22222222-2222-4222-8222-222222222222',
    element_type: 'text',
    position: { x: 10, y: 20 },
    size: { width: 120, height: 48 },
    rotation: 0,
    z_index: 0,
    content: { label: 'Layered text' },
    style: {},
    metadata: { layerId: 'layer-b' },
    locked_by: null,
    locked_at: null,
    schema_version: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
    ...overrides,
  } as PlanningElement;
}

function resetStore(): void {
  usePlanningStore.setState({
    elements: [],
    layers: [
      { id: 'layer-a', name: 'Layer A', visible: true, locked: false, elements: [] },
      { id: 'layer-b', name: 'Layer B', visible: true, locked: false, elements: [] },
    ],
    selectedElementIds: [],
    pendingDeletedElementIds: [],
    activeLayerId: 'layer-a',
    history: { past: [], future: [] },
  } as never);
}

describe('usePlanningStoreSync hydration lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.realtimeOptions = undefined;
    resetStore();
  });

  it('starts loading for a board and marks the matching board ready after hydration', async () => {
    mocks.listPlanningElements.mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    expect(result.current.hydrationStatus).toBe('loading');
    expect(result.current.isHydrated).toBe(false);
    expect(result.current.hydrationError).toBeNull();
    expect(result.current.hydratedBoardId).toBeNull();

    await waitFor(() => {
      expect(result.current).toMatchObject({
        hydrationStatus: 'ready',
        isHydrated: true,
        hydrationError: null,
        hydratedBoardId: '11111111-1111-4111-8111-111111111111',
      });
    });
  });

  it('marks hydration as error and keeps the board unhydrated when initial fetch fails', async () => {
    const error = new Error('network unavailable');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mocks.listPlanningElements.mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    await waitFor(() => {
      expect(result.current).toMatchObject({
        hydrationStatus: 'error',
        isHydrated: false,
        hydrationError: error,
        hydratedBoardId: null,
      });
    });
    expect(consoleError).toHaveBeenCalledWith('[usePlanningStoreSync] fetch failed', error);
    consoleError.mockRestore();
  });

  it('resets to idle and clears element state when no board is selected', async () => {
    act(() => {
      usePlanningStore.setState({
        elements: [createPlanningElement() as never],
        pendingDeletedElementIds: ['deleted-element-id'],
      } as never);
    });

    const { result } = renderHook(() => usePlanningStoreSync(null));

    await waitFor(() => {
      expect(result.current).toMatchObject({
        hydrationStatus: 'idle',
        isHydrated: true,
        hydrationError: null,
        hydratedBoardId: null,
      });
      expect(usePlanningStore.getState().elements).toEqual([]);
      expect(usePlanningStore.getState().pendingDeletedElementIds).toEqual([]);
    });
    expect(mocks.listPlanningElements).not.toHaveBeenCalled();
  });

  it('resets hydration metadata when switching to another board', async () => {
    let resolveFirstHydration: (rows: PlanningElement[]) => void = () => undefined;
    let resolveSecondHydration: (rows: PlanningElement[]) => void = () => undefined;
    mocks.listPlanningElements.mockImplementationOnce(
      () => new Promise<PlanningElement[]>((resolve) => {
        resolveFirstHydration = resolve;
      }),
    );

    const { result, rerender } = renderHook(
      ({ boardId }) => usePlanningStoreSync(boardId),
      { initialProps: { boardId: '11111111-1111-4111-8111-111111111111' } },
    );

    expect(result.current.hydrationStatus).toBe('loading');

    await act(async () => {
      resolveFirstHydration([]);
    });

    await waitFor(() => {
      expect(result.current.hydratedBoardId).toBe('11111111-1111-4111-8111-111111111111');
    });

    mocks.listPlanningElements.mockImplementationOnce(
      () => new Promise<PlanningElement[]>((resolve) => {
        resolveSecondHydration = resolve;
      }),
    );
    rerender({ boardId: '99999999-9999-4999-8999-999999999999' });

    await waitFor(() => {
      expect(result.current).toMatchObject({
        hydrationStatus: 'loading',
        isHydrated: false,
        hydrationError: null,
        hydratedBoardId: null,
      });
    });

    await act(async () => {
      resolveSecondHydration([]);
    });

    await waitFor(() => {
      expect(result.current).toMatchObject({
        hydrationStatus: 'ready',
        isHydrated: true,
        hydratedBoardId: '99999999-9999-4999-8999-999999999999',
      });
    });
  });
});

describe('usePlanningStoreSync layer membership', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.realtimeOptions = undefined;
    resetStore();
  });

  it('rebuilds layer element ids from loaded planning elements', async () => {
    mocks.listPlanningElements.mockResolvedValueOnce([
      createPlanningElement({ metadata: { layerId: 'layer-b' } }),
    ]);

    renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    await waitFor(() => {
      const state = usePlanningStore.getState();
      expect(state.elements[0]?.layerId).toBe('layer-b');
      expect(state.layers.find((layer) => layer.id === 'layer-a')?.elements).toEqual([]);
      expect(state.layers.find((layer) => layer.id === 'layer-b')?.elements).toEqual([
        '33333333-3333-4333-8333-333333333333',
      ]);
    });
  });

  it('does not resurrect a locally deleted element when hydration still receives its row', async () => {
    const deletedId = '33333333-3333-4333-8333-333333333333';
    mocks.listPlanningElements.mockResolvedValueOnce([
      createPlanningElement({ id: deletedId, metadata: { layerId: 'layer-b' } }),
    ]);

    act(() => {
      usePlanningStore.setState({
        pendingDeletedElementIds: [deletedId],
        selectedElementIds: [deletedId],
      } as never);
    });

    renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    await waitFor(() => {
      const state = usePlanningStore.getState();
      expect(state.elements).toEqual([]);
      expect(state.selectedElementIds).toEqual([]);
      expect(state.pendingDeletedElementIds).toEqual([deletedId]);
      expect(state.layers.find((layer) => layer.id === 'layer-b')?.elements).toEqual([]);
    });
  });

  it('does not resurrect a locally deleted element from realtime insert or update events', async () => {
    const deletedId = '33333333-3333-4333-8333-333333333333';
    mocks.listPlanningElements.mockResolvedValueOnce([]);

    act(() => {
      usePlanningStore.setState({
        pendingDeletedElementIds: [deletedId],
        selectedElementIds: [deletedId],
      } as never);
    });

    renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    await waitFor(() => {
      expect(mocks.realtimeOptions).toBeDefined();
    });

    await act(async () => {
      mocks.realtimeOptions.onElementInsert(
        createPlanningElement({ id: deletedId, metadata: { layerId: 'layer-b' } }),
      );
      mocks.realtimeOptions.onElementUpdate(
        createPlanningElement({
          id: deletedId,
          content: { label: 'Remote update after local delete' },
          metadata: { layerId: 'layer-b' },
          updated_at: '2026-01-03T00:00:00Z',
        }),
      );
    });

    const state = usePlanningStore.getState();
    expect(state.elements).toEqual([]);
    expect(state.pendingDeletedElementIds).toEqual([deletedId]);
    expect(state.selectedElementIds).toEqual([deletedId]);
    expect(state.layers.find((layer) => layer.id === 'layer-b')?.elements).toEqual([]);
  });

  it('moves layer membership when realtime updates change layerId', async () => {
    mocks.listPlanningElements.mockResolvedValueOnce([
      createPlanningElement({ metadata: { layerId: 'layer-b' } }),
    ]);

    renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    await waitFor(() => {
      expect(usePlanningStore.getState().elements[0]?.layerId).toBe('layer-b');
    });

    await act(async () => {
      mocks.realtimeOptions.onElementUpdate(
        createPlanningElement({
          metadata: { layerId: 'layer-a' },
          updated_at: '2026-01-03T00:00:00Z',
        }),
      );
    });

    const state = usePlanningStore.getState();
    expect(state.elements[0]?.layerId).toBe('layer-a');
    expect(state.layers.find((layer) => layer.id === 'layer-a')?.elements).toEqual([
      '33333333-3333-4333-8333-333333333333',
    ]);
    expect(state.layers.find((layer) => layer.id === 'layer-b')?.elements).toEqual([]);
  });

  it('preserves selected element ids that still exist after hydration and realtime updates', async () => {
    const selectedId = '33333333-3333-4333-8333-333333333333';
    mocks.listPlanningElements.mockResolvedValueOnce([
      createPlanningElement({ id: selectedId, metadata: { layerId: 'layer-b' } }),
    ]);

    act(() => {
      usePlanningStore.setState({ selectedElementIds: [selectedId, 'missing-element-id'] } as never);
    });

    renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    await waitFor(() => {
      expect(usePlanningStore.getState().selectedElementIds).toEqual([selectedId]);
    });

    await act(async () => {
      mocks.realtimeOptions.onElementUpdate(
        createPlanningElement({
          id: selectedId,
          content: { label: 'Updated text' },
          metadata: { layerId: 'layer-b' },
          updated_at: '2026-01-03T00:00:00Z',
        }),
      );
    });

    expect(usePlanningStore.getState().selectedElementIds).toEqual([selectedId]);

    await act(async () => {
      mocks.realtimeOptions.onElementInsert(
        createPlanningElement({
          id: '44444444-4444-4444-8444-444444444444',
          metadata: { layerId: 'layer-a' },
          updated_at: '2026-01-04T00:00:00Z',
        }),
      );
    });

    expect(usePlanningStore.getState().selectedElementIds).toEqual([selectedId]);
  });

  it('removes deleted elements and dependent connectors from selection on realtime delete', async () => {
    const nodeId = '33333333-3333-4333-8333-333333333333';
    const otherId = '44444444-4444-4444-8444-444444444444';
    const connectorId = '55555555-5555-4555-8555-555555555555';
    mocks.listPlanningElements.mockResolvedValueOnce([
      createPlanningElement({ id: nodeId, metadata: { layerId: 'layer-b' } }),
      createPlanningElement({
        id: otherId,
        metadata: { layerId: 'layer-b' },
        updated_at: '2026-01-02T00:00:01Z',
      }),
      createPlanningElement({
        id: connectorId,
        element_type: 'root_connector',
        content: {
          smartType: 'root_connector',
          startPoint: { elementId: nodeId },
          endPoint: { elementId: otherId },
        },
        metadata: { layerId: 'layer-b' },
        updated_at: '2026-01-02T00:00:02Z',
      }),
    ]);

    act(() => {
      usePlanningStore.setState({ selectedElementIds: [nodeId, connectorId, otherId] } as never);
    });

    renderHook(() => usePlanningStoreSync('11111111-1111-4111-8111-111111111111'));

    await waitFor(() => {
      expect(usePlanningStore.getState().elements).toHaveLength(3);
    });

    await act(async () => {
      mocks.realtimeOptions.onElementDelete(nodeId);
    });

    expect(usePlanningStore.getState().selectedElementIds).toEqual([otherId]);
  });
});
