import { vi } from 'vitest';

vi.mock('nanoid', () => {
  let counter = 0;
  return {
    nanoid: () => `mock-id-${++counter}`,
  };
});

import { createSelectionSlice } from './selectionSlice';
import type { CanvasElement, LayerInfo } from '@/types/canvas';

type TestStoreState = {
  elements: CanvasElement[];
  layers: LayerInfo[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  activeLayerId: string | null;
  history: { past: unknown[]; future: unknown[] };
  deleteElements: ReturnType<typeof vi.fn>;
  selectedElementIds: string[];
  clipboard: CanvasElement[];
  selectElement: (elementId: string, multiSelect?: boolean) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  copyElements: (elementIds: string[]) => void;
  pasteElements: (position?: { x: number; y: number }) => void;
  cutElements: (elementIds: string[]) => void;
};

function createTestStore(initialElements: CanvasElement[]) {
  let state: TestStoreState = {
    elements: initialElements,
    layers: [
      {
        id: 'default',
        name: 'Default',
        visible: true,
        locked: false,
        elements: initialElements.map((el) => el.id),
      },
    ],
    viewport: { zoom: 2, pan: { x: 100, y: 50 } },
    activeLayerId: 'default',
    history: { past: [], future: [] },
    deleteElements: vi.fn(),
    selectedElementIds: [],
    clipboard: [],
    selectElement: () => {},
    selectElements: () => {},
    clearSelection: () => {},
    copyElements: () => {},
    pasteElements: () => {},
    cutElements: () => {},
  };

  const setState = (updater: Partial<TestStoreState> | ((current: TestStoreState) => Partial<TestStoreState>)) => {
    const patch = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...patch };
  };

  const getState = () => state;
  const slice = createSelectionSlice(setState as never, getState as never, {} as never);
  state = { ...state, ...slice };

  return {
    getState,
    setState: (patch: Partial<TestStoreState>) => {
      state = { ...state, ...patch };
    },
  };
}

describe('selectionSlice clipboard regression', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('remaps internal references during paste and records a single history entry', () => {
    const sourceNode: CanvasElement = {
      id: 'node-source',
      type: 'mindmap_node',
      position: { x: 10, y: 10 },
      size: { width: 120, height: 60 },
      style: {},
      metadata: { groupId: 'group-original' },
      data: { label: 'Source' },
    };

    const targetNode: CanvasElement = {
      id: 'node-target',
      type: 'mindmap_node',
      position: { x: 220, y: 10 },
      size: { width: 120, height: 60 },
      style: {},
      metadata: { groupId: 'group-original' },
      data: { label: 'Target' },
    };

    const connector: CanvasElement = {
      id: 'connector-original',
      type: 'mindmap_connector',
      position: { x: 120, y: 20 },
      size: { width: 120, height: 20 },
      style: {},
      metadata: { groupId: 'group-original' },
      data: {
        startNodeId: 'node-source',
        endNodeId: 'node-target',
        startAnchor: { nodeId: 'node-source', anchor: 'right' },
        endAnchor: { nodeId: 'node-target', anchor: 'left' },
      },
    };

    const attachedLabel: CanvasElement = {
      id: 'label-original',
      type: 'text',
      position: { x: 20, y: 80 },
      size: { width: 100, height: 30 },
      style: {},
      metadata: { groupId: 'group-original' },
      data: {
        attachedTo: 'node-source',
        relativePosition: { x: 10, y: 70 },
      },
    };

    const store = createTestStore([sourceNode, targetNode, connector, attachedLabel]);
    const state = store.getState();

    state.copyElements(['node-source', 'node-target', 'connector-original', 'label-original']);
    state.pasteElements({ x: 600, y: 300 });

    const nextState = store.getState();
    expect(nextState.history.past).toHaveLength(1);
    expect(nextState.selectedElementIds).toHaveLength(4);

    const pastedElements = nextState.elements.filter((el) => nextState.selectedElementIds.includes(el.id));
    const pastedSource = pastedElements.find((el) => el.type === 'mindmap_node' && el.data?.label === 'Source');
    const pastedTarget = pastedElements.find((el) => el.type === 'mindmap_node' && el.data?.label === 'Target');
    const pastedConnector = pastedElements.find((el) => el.type === 'mindmap_connector');
    const pastedLabel = pastedElements.find((el) => el.type === 'text');

    expect(pastedSource?.id).not.toBe('node-source');
    expect(pastedTarget?.id).not.toBe('node-target');
    expect(pastedConnector?.data?.startNodeId).toBe(pastedSource?.id);
    expect(pastedConnector?.data?.endNodeId).toBe(pastedTarget?.id);
    expect(pastedConnector?.data?.startAnchor?.nodeId).toBe(pastedSource?.id);
    expect(pastedConnector?.data?.endAnchor?.nodeId).toBe(pastedTarget?.id);
    expect(pastedLabel?.data?.attachedTo).toBe(pastedSource?.id);

    const groupIds = new Set(
      pastedElements
        .map((el) => el.metadata?.groupId)
        .filter((groupId): groupId is string => typeof groupId === 'string'),
    );

    expect(groupIds.size).toBe(1);
    expect(Array.from(groupIds)[0]).not.toBe('group-original');
  });

  it('uses the canvas host size to determine viewport-centered paste when position is omitted', () => {
    const container = document.createElement('div');
    container.setAttribute('data-canvas-container', 'true');
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 1000 });
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 600 });
    document.body.appendChild(container);

    const baseElement: CanvasElement = {
      id: 'single-element',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      style: {},
      data: { label: 'Center me' },
    };

    const store = createTestStore([baseElement]);
    const state = store.getState();

    state.copyElements(['single-element']);
    state.pasteElements();

    const nextState = store.getState();
    const pastedElement = nextState.elements.find((el) => nextState.selectedElementIds.includes(el.id));

    expect(pastedElement?.position).toEqual({ x: 150, y: 100 });
    expect(nextState.history.past).toHaveLength(1);
  });
});
