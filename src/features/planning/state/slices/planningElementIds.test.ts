import { describe, expect, it } from 'vitest';
import type { CanvasElement, LayerInfo } from '@/types/canvas';
import { createElementsSlice } from './elementsSlice';
import { createToolsSlice } from './toolsSlice';
import { createPenSlice } from './penSlice';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TestState = ReturnType<typeof createElementsSlice> &
  ReturnType<typeof createToolsSlice> &
  ReturnType<typeof createPenSlice> & {
    elements: CanvasElement[];
    layers: LayerInfo[];
    activeLayerId: string | null;
    selectedElementIds: string[];
    history: { past: unknown[]; future: unknown[] };
  };

function createTestStore() {
  let state: TestState = {
    elements: [],
    layers: [{ id: 'default', name: 'Default', visible: true, locked: false, elements: [] }],
    activeLayerId: 'default',
    selectedElementIds: [],
    history: { past: [], future: [] },
  } as TestState;

  const setState = (updater: Partial<TestState> | ((current: TestState) => Partial<TestState>)) => {
    const patch = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...patch };
  };
  const getState = () => state;

  state = {
    ...state,
    ...createElementsSlice(setState as never, getState as never, {} as never),
    ...createToolsSlice(setState as never, getState as never, {} as never),
    ...createPenSlice(setState as never, getState as never, {} as never),
  };

  return { getState };
}

describe('planning element ids', () => {
  it('creates persistable UUID ids for new canvas elements', () => {
    const store = createTestStore();
    const state = store.getState();

    state.addElement({
      type: 'shape',
      position: { x: 10, y: 20 },
      size: { width: 100, height: 80 },
      style: {},
      data: { shapeType: 'sticky' },
    });

    expect(store.getState().elements[0].id).toMatch(UUID_RE);
  });

  it('creates persistable UUID ids for text elements and pen strokes', () => {
    const store = createTestStore();
    const state = store.getState();

    const textId = state.addText({
      position: { x: 1, y: 2 },
      content: 'نص',
    });
    const strokeId = state.beginStroke(5, 6);

    expect(textId).toMatch(UUID_RE);
    expect(strokeId).toMatch(UUID_RE);
    expect(store.getState().elements.find((element) => element.id === textId)?.id).toMatch(UUID_RE);
  });
});
