import { describe, expect, it } from 'vitest';
import { createMindmapSlice } from './mindmapSlice';

const buildElement = (overrides: Record<string, unknown>) => ({
  type: 'shape',
  position: { x: 0, y: 0 },
  size: { width: 100, height: 60 },
  style: {},
  visible: true,
  ...overrides,
});

const createHarness = (elements: any[], selectedElementIds: string[] = []) => {
  let state: any = {
    elements,
    selectedElementIds,
    selectedElementSelectionSource: 'marquee',
  };

  const set = (update: any) => {
    const patch = typeof update === 'function' ? update(state) : update;
    state = { ...state, ...patch };
  };
  const get = () => state;
  const slice = createMindmapSlice(set as never, get as never, undefined as never);

  return {
    slice,
    getState: () => state,
  };
};

describe('mindmapSlice selection expansion', () => {
  it('does not reintroduce locked mind map elements during marquee expansion', () => {
    const elements = [
      buildElement({ id: 'root', type: 'mindmap_node' }),
      buildElement({
        id: 'connector',
        type: 'mindmap_connector',
        data: { startNodeId: 'root', endNodeId: 'locked-child' },
      }),
      buildElement({ id: 'locked-child', type: 'mindmap_node', locked: true }),
      buildElement({ id: 'plain-shape', type: 'shape' }),
    ];
    const { slice, getState } = createHarness(elements, ['root', 'plain-shape']);

    slice.expandSelectionToFullMindMapTrees(['root', 'plain-shape']);

    expect(getState().selectedElementIds).toEqual(['root', 'plain-shape', 'connector']);
    expect(getState().selectedElementIds).not.toContain('locked-child');
    expect(getState().selectedElementSelectionSource).toBeNull();
  });

  it('filters hidden connectors while preserving selected open non-mindmap elements', () => {
    const elements = [
      buildElement({ id: 'root', type: 'mindmap_node' }),
      buildElement({
        id: 'hidden-connector',
        type: 'mindmap_connector',
        visible: false,
        data: { startNodeId: 'root', endNodeId: 'child' },
      }),
      buildElement({ id: 'child', type: 'mindmap_node' }),
      buildElement({ id: 'open-shape', type: 'shape' }),
    ];
    const { slice, getState } = createHarness(elements, ['root', 'open-shape']);

    slice.expandSelectionToFullMindMapTrees(['root', 'open-shape']);

    expect(getState().selectedElementIds).toEqual(['root', 'open-shape', 'child']);
    expect(getState().selectedElementIds).not.toContain('hidden-connector');
  });
});
