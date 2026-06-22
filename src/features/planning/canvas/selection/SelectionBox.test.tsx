import React, { useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import SelectionBox, { useSelectionBox } from './SelectionBox';

const mockSelectElements = vi.fn();
const mockExpandSelectionToFullMindMapTrees = vi.fn();

const visibleElements: any[] = [
  {
    id: 'open-element',
    type: 'shape',
    position: { x: 20, y: 20 },
    size: { width: 40, height: 40 },
    layerId: 'default',
    visible: true,
  },
  {
    id: 'locked-element',
    type: 'shape',
    position: { x: 30, y: 30 },
    size: { width: 40, height: 40 },
    layerId: 'default',
    visible: true,
    locked: true,
  },
  {
    id: 'metadata-locked-element',
    type: 'shape',
    position: { x: 35, y: 35 },
    size: { width: 40, height: 40 },
    layerId: 'default',
    visible: true,
    metadata: { locked: true },
  },
];

const storeState: any = {
  viewport: { zoom: 1, pan: { x: 0, y: 0 } },
  elements: visibleElements,
  layers: [{ id: 'default', visible: true }],
  selectedElementIds: [],
  selectElements: mockSelectElements,
  expandSelectionToFullMindMapTrees: mockExpandSelectionToFullMindMapTrees,
};

vi.mock('@/stores/canvasStore', () => {
  const useCanvasStore = vi.fn((selector?: (state: any) => unknown) => {
    if (typeof selector === 'function') return selector(storeState);
    return storeState;
  });
  (useCanvasStore as any).getState = () => storeState;
  return { useCanvasStore };
});

vi.mock('@/features/planning/state/selectors', () => ({
  selectLayerVisibilityMap: () => new Map([['default', true]]),
}));

vi.mock('@/engine/canvas/kernel/canvasKernel', () => ({
  canvasKernel: {
    screenToWorld: vi.fn((x: number, y: number) => ({ x, y })),
    boundsIntersect: vi.fn((a: any, b: any) => !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    )),
  },
}));

function SelectionHookHarness({ onReady }: { onReady: (api: ReturnType<typeof useSelectionBox>) => void }) {
  const api = useSelectionBox();
  useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return null;
}

describe('SelectionBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeState.elements = visibleElements;
    storeState.selectedElementIds = [];
  });

  it('shows the refreshed intersection label for right-to-left marquee selection', () => {
    render(<SelectionBox startX={100} startY={20} currentX={10} currentY={90} />);

    expect(screen.getByText('تحديد بالتقاطع')).toBeInTheDocument();
    expect(screen.getByText('1 عنصر')).toBeInTheDocument();
  });

  it('excludes locked elements when finishing a marquee selection', () => {
    let api: ReturnType<typeof useSelectionBox> | null = null;
    render(<SelectionHookHarness onReady={(nextApi) => { api = nextApi; }} />);

    act(() => {
      api?.finishSelection(0, 0, 120, 120, false);
    });

    expect(mockSelectElements).toHaveBeenCalledWith(['open-element']);
  });
});
