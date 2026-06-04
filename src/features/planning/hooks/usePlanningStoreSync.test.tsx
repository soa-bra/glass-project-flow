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
      connectionStatus: 'connected',
      lastSyncAt: null,
      broadcastCursor: vi.fn(),
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
    activeLayerId: 'layer-a',
    history: { past: [], future: [] },
  } as never);
}

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
});
