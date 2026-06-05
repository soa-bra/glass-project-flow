import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlanningStore } from '@/features/planning/state/store';
import type { CanvasElement } from '@/types/canvas';
import { usePlanningElementPersistence } from './usePlanningElementPersistence';

const mocks = vi.hoisted(() => ({
  deletePlanningElement: vi.fn(),
  upsertPlanningElements: vi.fn(),
  getUser: vi.fn(),
  from: vi.fn(),
}));

vi.mock('@/services/central', () => ({
  PlanningBoardsService: {
    deletePlanningElement: mocks.deletePlanningElement,
    upsertPlanningElements: mocks.upsertPlanningElements,
  },
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: mocks.getUser,
    },
    from: mocks.from,
  },
}));

const boardId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const elementId = '33333333-3333-4333-8333-333333333333';

function createElement(layerId: string): CanvasElement {
  return {
    id: elementId,
    type: 'text',
    position: { x: 10, y: 20 },
    size: { width: 120, height: 48 },
    style: {},
    data: { label: 'Layered text' },
    metadata: {},
    layer: 0,
    layerId,
  };
}

function resetStore(layerId = 'layer-a'): void {
  usePlanningStore.setState({
    elements: [createElement(layerId)],
    layers: [
      { id: 'layer-a', name: 'Layer A', visible: true, locked: false, elements: layerId === 'layer-a' ? [elementId] : [] },
      { id: 'layer-b', name: 'Layer B', visible: true, locked: false, elements: layerId === 'layer-b' ? [elementId] : [] },
    ],
    selectedElementIds: [],
    activeLayerId: layerId,
    history: { past: [], future: [] },
  } as never);
}

describe('usePlanningElementPersistence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mocks.getUser.mockResolvedValue({ data: { user: { id: userId } } });
    mocks.deletePlanningElement.mockResolvedValue(undefined);
    mocks.upsertPlanningElements.mockResolvedValue(undefined);
    resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('persists a pure layerId move without requiring another element field change', async () => {
    const { result } = renderHook(() => usePlanningElementPersistence(boardId, true));

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      usePlanningStore.setState({ elements: [createElement('layer-b')] } as never);
    });

    expect(result.current.status).toBe('pending');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(710);
    });

    await waitFor(() => expect(result.current.status).toBe('saved'));

    expect(mocks.upsertPlanningElements).toHaveBeenCalledTimes(1);
    expect(mocks.upsertPlanningElements.mock.calls[0][0][0]).toMatchObject({
      id: elementId,
      board_id: boardId,
      created_by: userId,
      metadata: { layerId: 'layer-b' },
    });
    expect(result.current.error).toBeNull();
    expect(result.current.lastPersistedAt).toBeInstanceOf(Date);
  });

  it('reports persistence failures instead of leaving them silent', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mocks.upsertPlanningElements.mockRejectedValueOnce(new Error('database unavailable'));
    const { result } = renderHook(() => usePlanningElementPersistence(boardId, true));

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      usePlanningStore.setState({ elements: [createElement('layer-b')] } as never);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(710);
    });

    await waitFor(() => expect(result.current.status).toBe('error'));

    expect(result.current.error).toBe('database unavailable');
    expect(consoleError).toHaveBeenCalled();
  });
});
