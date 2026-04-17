import { captureBoardSnapshot, restoreBoardSnapshot } from './boardSnapshot';

describe('boardSnapshot', () => {
  it('captures a deep-cloned board snapshot without sharing references', () => {
    const state = {
      elements: [
        {
          id: 'element-1',
          type: 'text',
          position: { x: 10, y: 20 },
          size: { width: 100, height: 40 },
          style: { color: '#111111' },
          data: { nested: { value: 'original' } },
        },
      ],
      layers: [
        {
          id: 'default',
          name: 'Default',
          visible: true,
          locked: false,
          elements: ['element-1'],
        },
      ],
      selectedElementIds: ['element-1'],
      viewport: { zoom: 1.5, pan: { x: 25, y: 35 } },
      activeLayerId: 'default',
    };

    const snapshot = captureBoardSnapshot(state);

    state.elements[0].position.x = 999;
    state.elements[0].data.nested.value = 'mutated';
    state.layers[0].elements.push('element-2');
    state.selectedElementIds.push('element-2');
    state.viewport.pan.x = 500;

    expect(snapshot.elements[0].position.x).toBe(10);
    expect(snapshot.elements[0].data.nested.value).toBe('original');
    expect(snapshot.layers[0].elements).toEqual(['element-1']);
    expect(snapshot.selectedElementIds).toEqual(['element-1']);
    expect(snapshot.viewport.pan.x).toBe(25);
    expect(snapshot.activeLayerId).toBe('default');
  });

  it('restores a full board snapshot with synced settings and fresh clones', () => {
    const snapshot = captureBoardSnapshot({
      elements: [
        {
          id: 'element-restore',
          type: 'shape',
          position: { x: 40, y: 50 },
          size: { width: 150, height: 90 },
          style: { opacity: 0.5 },
        },
      ],
      layers: [
        {
          id: 'default',
          name: 'Default',
          visible: true,
          locked: false,
          elements: ['element-restore'],
        },
      ],
      selectedElementIds: ['element-restore'],
      viewport: { zoom: 2, pan: { x: 75, y: 95 } },
      activeLayerId: 'default',
    });

    const restored = restoreBoardSnapshot(snapshot);
    restored.elements[0].position.y = 777;
    restored.layers[0].elements.push('element-extra');
    restored.settings.pan.x = 1234;

    expect(restored.viewport).toEqual({ zoom: 2, pan: { x: 75, y: 95 } });
    expect(restored.settings).toEqual({ zoom: 2, pan: { x: 1234, y: 95 } });
    expect(restored.activeLayerId).toBe('default');

    expect(snapshot.elements[0].position.y).toBe(50);
    expect(snapshot.layers[0].elements).toEqual(['element-restore']);
    expect(snapshot.viewport.pan.x).toBe(75);
  });

  it('falls back to default viewport and layer values when optional state is absent', () => {
    const snapshot = captureBoardSnapshot({
      elements: [],
      layers: [],
    });

    const restored = restoreBoardSnapshot(snapshot);

    expect(snapshot.viewport).toEqual({ zoom: 1, pan: { x: 0, y: 0 } });
    expect(snapshot.activeLayerId).toBe('default');
    expect(restored.settings).toEqual({ zoom: 1, pan: { x: 0, y: 0 } });
    expect(restored.selectedElementIds).toEqual([]);
  });
});
