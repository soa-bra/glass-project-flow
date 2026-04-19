import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useMindMapConnectionController } from './useMindMapConnectionController';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel, getContainerRect } from '@/engine/canvas/kernel/canvasKernel';
import { findNearestAnchor, calculateConnectorBounds } from '@/types/mindmap-canvas';

const mockAddElement = vi.fn();

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: vi.fn((selector: (state: { addElement: typeof mockAddElement }) => unknown) =>
    selector({ addElement: mockAddElement }),
  ),
}));

vi.mock('@/engine/canvas/kernel/canvasKernel', () => ({
  canvasKernel: {
    screenToWorld: vi.fn(),
  },
  getContainerRect: vi.fn(),
}));

vi.mock('@/types/mindmap-canvas', async () => {
  const actual = await vi.importActual('@/types/mindmap-canvas');
  return {
    ...actual,
    findNearestAnchor: vi.fn(),
    calculateConnectorBounds: vi.fn(),
  };
});

describe('useMindMapConnectionController', () => {
  const viewport = { zoom: 1, pan: { x: 0, y: 0 } };
  const containerRef = { current: document.createElement('div') } as any;
  const containerRect = {
    left: 0,
    top: 0,
    width: 1000,
    height: 700,
    right: 1000,
    bottom: 700,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;

  const elements = [
    {
      id: 'source-node',
      type: 'mindmap_node',
      position: { x: 10, y: 20 },
      size: { width: 100, height: 60 },
      data: { color: '#ff0000' },
    },
    {
      id: 'target-node',
      type: 'mindmap_node',
      position: { x: 300, y: 220 },
      size: { width: 120, height: 80 },
      data: {},
    },
  ] as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.mocked(getContainerRect).mockReturnValue(containerRect);
    vi.mocked(canvasKernel.screenToWorld).mockReturnValue({ x: 320, y: 260 });
    vi.mocked(findNearestAnchor).mockReturnValue({
      anchor: 'left',
      distance: 20,
      position: { x: 300, y: 260 },
    } as any);
    vi.mocked(calculateConnectorBounds).mockReturnValue({
      position: { x: 10, y: 20 },
      size: { width: 410, height: 240 },
    } as any);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts a connection and reflects it in the UI state', () => {
    const { result } = renderHook(() =>
      useMindMapConnectionController({ elements, containerRef, viewport }),
    );

    act(() => {
      result.current.handleStartConnection('source-node', 'right', { x: 100, y: 50 });
    });

    expect(result.current.connectionRef.current.isConnecting).toBe(true);
    expect(result.current.connectionUI.isConnecting).toBe(true);
    expect(result.current.connectionUI.startPosition).toEqual({ x: 100, y: 50 });
    expect(result.current.connectionRef.current.sourceNodeId).toBe('source-node');
  });

  it('updates connection position and snaps to nearest eligible anchor', () => {
    const { result } = renderHook(() =>
      useMindMapConnectionController({ elements, containerRef, viewport }),
    );

    act(() => {
      result.current.handleStartConnection('source-node', 'right', { x: 100, y: 50 });
      result.current.updateConnectionPosition(500, 400);
    });

    expect(canvasKernel.screenToWorld).toHaveBeenCalledWith(500, 400, viewport, containerRect);
    expect(findNearestAnchor).toHaveBeenCalled();
    expect(result.current.connectionUI.currentPosition).toEqual({ x: 320, y: 260 });
    expect(result.current.connectionUI.nearestAnchor).toEqual({
      id: 'target-node-left',
      nodeId: 'target-node',
      anchor: 'left',
      position: { x: 300, y: 260 },
    });
  });

  it('adds a connector element and resets state when ending a valid connection', () => {
    const { result } = renderHook(() =>
      useMindMapConnectionController({ elements, containerRef, viewport }),
    );

    act(() => {
      result.current.handleStartConnection('source-node', 'right', { x: 100, y: 50 });
      result.current.handleEndConnection('target-node', 'left');
    });

    expect(calculateConnectorBounds).toHaveBeenCalledWith(elements[0], elements[1]);
    expect(mockAddElement).toHaveBeenCalledWith({
      type: 'mindmap_connector',
      position: { x: 10, y: 20 },
      size: { width: 410, height: 240 },
      data: {
        startNodeId: 'source-node',
        endNodeId: 'target-node',
        startAnchor: { nodeId: 'source-node', anchor: 'right' },
        endAnchor: { nodeId: 'target-node', anchor: 'left' },
        curveStyle: 'bezier',
        color: '#ff0000',
        strokeWidth: 2,
      },
    });
    expect(result.current.connectionRef.current.isConnecting).toBe(false);
    expect(result.current.connectionUI.isConnecting).toBe(false);
  });

  it('cancels the connection and clears transient state', () => {
    const { result } = renderHook(() =>
      useMindMapConnectionController({ elements, containerRef, viewport }),
    );

    act(() => {
      result.current.handleStartConnection('source-node', 'right', { x: 100, y: 50 });
      result.current.cancelConnection();
    });

    expect(result.current.connectionRef.current.isConnecting).toBe(false);
    expect(result.current.connectionUI.isConnecting).toBe(false);
    expect(mockAddElement).not.toHaveBeenCalled();
  });

  it('does nothing when ending a connection on the same source node', () => {
    const { result } = renderHook(() =>
      useMindMapConnectionController({ elements, containerRef, viewport }),
    );

    act(() => {
      result.current.handleStartConnection('source-node', 'right', { x: 100, y: 50 });
      result.current.handleEndConnection('source-node', 'left');
    });

    expect(mockAddElement).not.toHaveBeenCalled();
    expect(result.current.connectionRef.current.isConnecting).toBe(true);
  });
});
