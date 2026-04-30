import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import InfiniteCanvas from './InfiniteCanvas';

const mockClearSelection = vi.fn();
const mockSelectElement = vi.fn();
const mockPanBy = vi.fn();
const mockZoomByWheel = vi.fn();
const mockHandleCanvasMouseDown = vi.fn();
const mockHandleCanvasMouseMove = vi.fn();
const mockHandleCanvasMouseUp = vi.fn();
const mockBeginPanning = vi.fn();
const mockUpdatePan = vi.fn();
const mockBeginBoxSelection = vi.fn();
const mockUpdateBoxSelectionFromClient = vi.fn();
const mockCompleteBoxSelection = vi.fn();
const mockHandleFileDrop = vi.fn();
const mockHandleFileDragOver = vi.fn();
const mockUpdatePointerFromClient = vi.fn();
const mockHandleEndConnection = vi.fn();
const mockCancelConnection = vi.fn();
const mockUpdateConnectionPosition = vi.fn();
const mockHandleStartConnection = vi.fn();
const mockRealtimeSyncManager = vi.fn();

const canvasState: any = {
  elements: [
    { id: 'el-1', type: 'shape', position: { x: 10, y: 20 }, size: { width: 100, height: 60 } },
    { id: 'el-2', type: 'text', position: { x: 200, y: 120 }, size: { width: 120, height: 40 } },
  ],
  viewport: { zoom: 1.5, pan: { x: 20, y: 30 } },
  settings: { background: '#ffffff', snapToGrid: true },
  selectedElementIds: ['el-1'],
  layers: [{ id: 'layer-1', visible: true }],
  activeTool: 'selection_tool',
  tempElement: { id: 'temp-1', type: 'shape' },
  panBy: mockPanBy,
  zoomByWheel: mockZoomByWheel,
  clearSelection: mockClearSelection,
  selectElement: mockSelectElement,
};

const interactionState: any = {
  mode: { kind: 'idle' },
  startPanning: vi.fn(),
  startBoxSelect: vi.fn(),
  updateBoxSelect: vi.fn(),
  resetToIdle: vi.fn(),
  isMode: vi.fn((kind: string) => kind === interactionState.mode.kind),
};

const boxSelectSelector = Symbol('box-select-selector');
const boxSelectData = {
  startWorld: { x: 10, y: 20 },
  currentWorld: { x: 30, y: 50 },
  additive: true,
};

const connectionRef = {
  current: {
    isConnecting: false,
    sourceNodeId: 'source-node',
    sourceAnchor: 'right',
    nearestAnchor: null,
  },
};

vi.mock('@/stores/canvasStore', () => {
  const useCanvasStore = vi.fn((selector: (state: any) => unknown) => selector(canvasState));
  (useCanvasStore as any).getState = () => ({ editingTextId: null, stopEditingText: vi.fn() });
  return { useCanvasStore };
});

vi.mock('@/stores/interactionStore', () => ({
  useInteractionStore: vi.fn((selector: any) => {
    if (selector === boxSelectSelector) return boxSelectData;
    return selector(interactionState);
  }),
  selectBoxSelectData: boxSelectSelector,
}));

vi.mock('@/hooks/useToolInteraction', () => ({
  useToolInteraction: () => ({
    handleCanvasMouseDown: mockHandleCanvasMouseDown,
    handleCanvasMouseMove: mockHandleCanvasMouseMove,
    handleCanvasMouseUp: mockHandleCanvasMouseUp,
  }),
}));

vi.mock('@/hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: vi.fn() }));
vi.mock('@/hooks/useTouchGestures', () => ({ useTouchGestures: vi.fn() }));
vi.mock('@/hooks/useCanvasPaste', () => ({ useCanvasPaste: vi.fn() }));
vi.mock('@/engine/canvas/interaction/selectionCoordinator', () => ({
  selectionCoordinator: {
    identifyTarget: vi.fn(() => ({ type: 'canvas' })),
  },
}));

vi.mock('@/features/planning/canvas/controllers/useCanvasPointerTracking', () => ({
  useCanvasPointerTracking: () => ({
    lastPointerPositionRef: { current: null },
    updatePointerFromClient: mockUpdatePointerFromClient,
  }),
}));

vi.mock('@/features/planning/canvas/controllers/useCanvasDropController', () => ({
  useCanvasDropController: () => ({
    handleFileDrop: mockHandleFileDrop,
    handleFileDragOver: mockHandleFileDragOver,
  }),
}));

vi.mock('@/features/planning/canvas/controllers/useMindMapConnectionController', () => ({
  useMindMapConnectionController: () => ({
    connectionRef,
    connectionUI: {
      isConnecting: true,
      startPosition: { x: 50, y: 60 },
      currentPosition: { x: 140, y: 160 },
      nearestAnchor: { nodeId: 'target-node', anchor: 'left', position: { x: 120, y: 140 } },
    },
    handleStartConnection: mockHandleStartConnection,
    handleEndConnection: mockHandleEndConnection,
    updateConnectionPosition: mockUpdateConnectionPosition,
    cancelConnection: mockCancelConnection,
  }),
}));

vi.mock('@/features/planning/canvas/controllers/useCanvasViewportController', () => ({
  useCanvasViewportController: () => ({
    viewportBounds: { x: 0, y: 0, width: 1000, height: 800 },
    visibleElements: canvasState.elements,
    snapToGrid: vi.fn((x: number, y: number) => ({ x, y })),
    handleWheel: vi.fn(),
    getCursorStyle: vi.fn(() => 'crosshair'),
  }),
}));

vi.mock('@/features/planning/canvas/controllers/useCanvasSelectionController', () => ({
  useCanvasSelectionController: () => ({
    beginPanning: mockBeginPanning,
    updatePan: mockUpdatePan,
    beginBoxSelection: mockBeginBoxSelection,
    updateBoxSelectionFromClient: mockUpdateBoxSelectionFromClient,
    completeBoxSelection: mockCompleteBoxSelection,
    selectionBoxData: { startX: 10, startY: 15, currentX: 80, currentY: 90 },
  }),
}));

vi.mock('@/features/planning/canvas/controllers/useCanvasRealtimeController', () => ({
  useCanvasRealtimeController: () => ({
    realtimeProps: {
      boardId: 'board-123',
      userId: 'user-1',
      userName: 'Dr. Osama',
      enabled: true,
      viewport: canvasState.viewport,
      onSyncStatusChange: vi.fn(),
    },
  }),
}));

vi.mock('@/features/planning/canvas/layers/CanvasElement', () => ({
  default: ({ element, isSelected, activeTool }: any) => (
    <div data-testid="canvas-element">
      {element.id}:{String(isSelected)}:{activeTool}
    </div>
  ),
}));
vi.mock('@/features/planning/canvas/viewport/DrawingPreview', () => ({ default: () => <div data-testid="drawing-preview" /> }));
vi.mock('@/features/planning/canvas/selection/SelectionBox', () => ({
  default: (props: any) => <div data-testid="selection-box">{JSON.stringify(props)}</div>,
  useSelectionBox: () => ({ finishSelection: vi.fn() }),
}));
vi.mock('@/features/planning/canvas/gestures/StrokesLayer', () => ({ default: () => <div data-testid="strokes-layer" /> }));
vi.mock('@/features/planning/canvas/gestures/PenInputLayer', () => ({ default: ({ active }: any) => <div data-testid="pen-input">{String(active)}</div> }));
vi.mock('@/features/planning/canvas/gestures/FrameInputLayer', () => ({ default: ({ active }: any) => <div data-testid="frame-input">{String(active)}</div> }));
vi.mock('@/features/planning/canvas/selection/BoundingBox', () => ({ BoundingBox: () => <div data-testid="bounding-box" /> }));
vi.mock('@/features/planning/canvas', async () => {
  const actual = await vi.importActual<typeof import('@/features/planning/canvas')>('@/features/planning/canvas');
  return { ...actual, SnapGuides: () => <div data-testid="snap-guides" /> };
});
vi.mock('@/components/ui/penToolbar', () => ({ PenFloatingToolbar: ({ isVisible }: any) => <div data-testid="pen-toolbar">{String(isVisible)}</div> }));
vi.mock('@/features/planning/canvas/viewport/CanvasGridLayer', () => ({ CanvasGridLayer: () => <div data-testid="grid-layer" /> }));
vi.mock('@/features/planning/integration/collaboration', () => ({
  RealtimeSyncManager: (props: any) => {
    mockRealtimeSyncManager(props);
    return <div data-testid="realtime-sync" />;
  },
}));
vi.mock('@/features/planning/elements/mindmap/MindMapConnectionLine', () => ({ default: () => <div data-testid="mindmap-connection-line" /> }));

describe('InfiniteCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    interactionState.mode = { kind: 'idle' };
    connectionRef.current.isConnecting = false;
    connectionRef.current.nearestAnchor = null;
    canvasState.activeTool = 'selection_tool';
  });

  it('renders the canvas shell, visible elements, overlays, and realtime manager', () => {
    render(<InfiniteCanvas boardId="board-123" />);

    expect(screen.getAllByTestId('canvas-element')).toHaveLength(2);
    expect(screen.getByTestId('grid-layer')).toBeInTheDocument();
    expect(screen.getByTestId('strokes-layer')).toBeInTheDocument();
    expect(screen.getByTestId('drawing-preview')).toBeInTheDocument();
    expect(screen.getByTestId('selection-box')).toBeInTheDocument();
    expect(screen.getByTestId('snap-guides')).toBeInTheDocument();
    expect(screen.getByTestId('realtime-sync')).toBeInTheDocument();
    expect(mockRealtimeSyncManager).toHaveBeenCalledWith(
      expect.objectContaining({ boardId: 'board-123', userId: 'user-1', userName: 'Dr. Osama' }),
    );
  });

  it('starts panning on alt + primary mouse down', () => {
    render(<InfiniteCanvas boardId="board-123" />);
    const container = document.querySelector('[data-canvas-container="true"]') as HTMLElement;

    fireEvent.mouseDown(container, { button: 0, altKey: true, clientX: 100, clientY: 200 });

    expect(mockBeginPanning).toHaveBeenCalledWith(100, 200);
    expect(mockHandleCanvasMouseDown).not.toHaveBeenCalled();
  });

  it('starts box selection on canvas mouse down with selection tool', () => {
    render(<InfiniteCanvas boardId="board-123" />);
    const container = document.querySelector('[data-canvas-container="true"]') as HTMLElement;

    fireEvent.mouseDown(container, { button: 0, clientX: 70, clientY: 90, shiftKey: true });

    expect(mockClearSelection).not.toHaveBeenCalled();
    expect(mockBeginBoxSelection).toHaveBeenCalledWith(70, 90, true);
  });

  it('updates panning on mouse move when interaction mode is panning', () => {
    interactionState.mode = { kind: 'panning' };
    render(<InfiniteCanvas boardId="board-123" />);
    const container = document.querySelector('[data-canvas-container="true"]') as HTMLElement;

    fireEvent.mouseMove(container, { clientX: 130, clientY: 170 });

    expect(mockUpdatePointerFromClient).toHaveBeenCalledWith(130, 170);
    expect(mockUpdatePan).toHaveBeenCalledWith(130, 170, mockPanBy);
  });

  it('updates box selection on mouse move when interaction mode is boxSelect', () => {
    interactionState.mode = { kind: 'boxSelect' };
    render(<InfiniteCanvas boardId="board-123" />);
    const container = document.querySelector('[data-canvas-container="true"]') as HTMLElement;

    fireEvent.mouseMove(container, { clientX: 210, clientY: 240 });

    expect(mockUpdateBoxSelectionFromClient).toHaveBeenCalledWith(210, 240);
  });

  it('ends a connection on mouse up when a nearest anchor exists', () => {
    interactionState.mode = { kind: 'idle' };
    connectionRef.current.isConnecting = true;
    connectionRef.current.sourceNodeId = 'source-node';
    connectionRef.current.nearestAnchor = { nodeId: 'target-node', anchor: 'left' };
    render(<InfiniteCanvas boardId="board-123" />);
    const container = document.querySelector('[data-canvas-container="true"]') as HTMLElement;

    fireEvent.mouseUp(container);

    expect(mockHandleEndConnection).toHaveBeenCalledWith('target-node', 'left');
    expect(mockCancelConnection).not.toHaveBeenCalled();
  });

  it('routes drop and dragover handlers to the drop controller', () => {
    render(<InfiniteCanvas boardId="board-123" />);
    const container = document.querySelector('[data-canvas-container="true"]') as HTMLElement;

    fireEvent.dragOver(container);
    fireEvent.drop(container);

    expect(mockHandleFileDragOver).toHaveBeenCalled();
    expect(mockHandleFileDrop).toHaveBeenCalled();
  });
});
