import { runCanvasTransaction } from './runCanvasTransaction';

describe('runCanvasTransaction', () => {
  it('captures the pre-mutation snapshot, applies updates, and clears future history', () => {
    let state = {
      elements: [
        {
          id: 'before-id',
          type: 'text',
          position: { x: 5, y: 10 },
          size: { width: 120, height: 40 },
          style: {},
        },
      ],
      layers: [
        {
          id: 'default',
          name: 'Default',
          visible: true,
          locked: false,
          elements: ['before-id'],
        },
      ],
      selectedElementIds: ['before-id'],
      viewport: { zoom: 1.25, pan: { x: 15, y: 25 } },
      activeLayerId: 'default',
      history: {
        past: [{ marker: 'old-entry' }],
        future: [{ marker: 'future-entry' }],
      },
    };

    const set = (updater: (current: typeof state) => Partial<typeof state>) => {
      state = { ...state, ...updater(state) };
    };

    runCanvasTransaction(set, () => ({
      elements: [
        {
          id: 'after-id',
          type: 'shape',
          position: { x: 20, y: 30 },
          size: { width: 160, height: 90 },
          style: { opacity: 0.5 },
        },
      ],
      selectedElementIds: ['after-id'],
    }));

    expect(state.elements[0].id).toBe('after-id');
    expect(state.selectedElementIds).toEqual(['after-id']);
    expect(state.history.future).toEqual([]);
    expect(state.history.past).toHaveLength(2);

    const snapshot = state.history.past[1] as any;
    expect(snapshot.elements[0].id).toBe('before-id');
    expect(snapshot.selectedElementIds).toEqual(['before-id']);
    expect(snapshot.viewport).toEqual({ zoom: 1.25, pan: { x: 15, y: 25 } });
    expect(snapshot.activeLayerId).toBe('default');
  });

  it('keeps only the latest twenty history entries after appending a new snapshot', () => {
    let state = {
      elements: [],
      layers: [],
      selectedElementIds: [],
      viewport: { zoom: 1, pan: { x: 0, y: 0 } },
      activeLayerId: 'default',
      history: {
        past: Array.from({ length: 20 }, (_, index) => ({ marker: `entry-${index + 1}` })),
        future: [{ marker: 'future-entry' }],
      },
    };

    const set = (updater: (current: typeof state) => Partial<typeof state>) => {
      state = { ...state, ...updater(state) };
    };

    runCanvasTransaction(set, () => ({ selectedElementIds: ['fresh-selection'] }));

    expect(state.history.past).toHaveLength(20);
    expect((state.history.past[0] as any).marker).toBe('entry-2');
    expect((state.history.past[18] as any).marker).toBe('entry-20');

    const snapshot = state.history.past[19] as any;
    expect(snapshot.selectedElementIds).toEqual([]);
    expect(snapshot.viewport).toEqual({ zoom: 1, pan: { x: 0, y: 0 } });
    expect(state.history.future).toEqual([]);
  });
});
