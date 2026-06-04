import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCanvasStore } from '@/stores/canvasStore';
import { usePlanningStore } from '@/stores/planningStore';
import type { CanvasBoard } from '@/types/planning';
import { useBoardSaveState } from './useBoardSaveState';

function createBoard(): CanvasBoard {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Board',
    type: 'blank',
    status: 'active',
    owner: '22222222-2222-4222-8222-222222222222',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    lastModified: new Date('2026-01-02T00:00:00Z'),
  };
}

describe('useBoardSaveState', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves viewport and layers without persisting element snapshots', async () => {
    const saveBoard = vi.fn().mockResolvedValue(undefined);
    usePlanningStore.setState({ saveBoard } as never);
    useCanvasStore.setState({
      elements: [
        {
          id: '33333333-3333-4333-8333-333333333333',
          type: 'text',
          position: { x: 10, y: 20 },
          size: { width: 100, height: 40 },
          style: {},
          data: { label: 'live element' },
        },
      ],
      selectedElementIds: ['33333333-3333-4333-8333-333333333333'],
      layers: [
        {
          id: 'default',
          name: 'Default',
          visible: true,
          locked: false,
          elements: ['33333333-3333-4333-8333-333333333333'],
        },
      ],
      viewport: { zoom: 1.25, pan: { x: 12, y: 34 } },
      activeLayerId: 'default',
    } as never);

    const { result } = renderHook(() => useBoardSaveState(createBoard()));

    await act(async () => {
      await result.current.saveBoardState();
    });

    expect(saveBoard).toHaveBeenCalledTimes(1);
    const [, , snapshot] = saveBoard.mock.calls[0];
    expect(snapshot.elements).toEqual([]);
    expect(snapshot.selectedElementIds).toEqual([]);
    expect(snapshot.layers[0].elements).toEqual([]);
    expect(snapshot.viewport).toEqual({ zoom: 1.25, pan: { x: 12, y: 34 } });
    expect(snapshot.activeLayerId).toBe('default');
  });
});
