import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import { useBoardCanvasLifecycle } from './useBoardCanvasLifecycle';

function createBoard(): CanvasBoard {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Board',
    type: 'blank',
    status: 'active',
    owner: '22222222-2222-4222-8222-222222222222',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    lastModified: new Date('2026-01-02T00:00:00Z'),
    canvasState: {
      elements: [
        {
          id: '33333333-3333-4333-8333-333333333333',
          type: 'text',
          position: { x: 10, y: 20 },
          size: { width: 100, height: 40 },
          style: {},
          data: { label: 'stale snapshot element' },
        },
      ],
      layers: [
        {
          id: 'default',
          name: 'Default',
          visible: true,
          locked: false,
          elements: ['33333333-3333-4333-8333-333333333333'],
        },
      ],
      selectedElementIds: ['33333333-3333-4333-8333-333333333333'],
      viewport: { zoom: 1.5, pan: { x: 40, y: 50 } },
      activeLayerId: 'default',
      savedAt: '2026-01-02T00:00:00Z',
    },
  };
}

describe('useBoardCanvasLifecycle', () => {
  afterEach(() => {
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      layers: [{ id: 'default', name: 'Default', visible: true, locked: false, elements: [] }],
      viewport: { zoom: 1, pan: { x: 0, y: 0 } },
      activeLayerId: 'default',
      editingTextId: null,
      history: { past: [], future: [] },
    } as never);
  });

  it('keeps planning_elements as the only source for canvas elements', async () => {
    renderHook(() => useBoardCanvasLifecycle(createBoard()));

    await waitFor(() => {
      const state = useCanvasStore.getState();
      expect(state.elements).toEqual([]);
      expect(state.selectedElementIds).toEqual([]);
      expect(state.layers[0].elements).toEqual([]);
      expect(state.viewport).toEqual({ zoom: 1.5, pan: { x: 40, y: 50 } });
      expect(state.activeLayerId).toBe('default');
    });
  });
});
