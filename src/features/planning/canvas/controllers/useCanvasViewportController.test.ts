import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useCanvasViewportController } from './useCanvasViewportController';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';
import { getCursorForMode } from '@/engine/canvas/interaction/interactionStateMachine';

vi.mock('@/engine/canvas/kernel/canvasKernel', () => ({
  canvasKernel: {
    getVisibleBounds: vi.fn(),
    snapToGrid: vi.fn(),
  },
}));

vi.mock('@/engine/canvas/interaction/interactionStateMachine', () => ({
  getCursorForMode: vi.fn(),
}));

describe('useCanvasViewportController', () => {
  const viewport = { zoom: 1.5, pan: { x: 20, y: 30 } };
  const settings = {
    gridSize: 20,
    snapToGrid: true,
    background: '#fff',
  } as any;
  const interactionMode = { kind: 'idle' } as any;
  const panBy = vi.fn();
  const zoomByWheel = vi.fn();

  const layerVisible = { id: 'visible-layer', visible: true };
  const layerHidden = { id: 'hidden-layer', visible: false };

  const elements = [
    {
      id: 'element-1',
      type: 'shape',
      layerId: 'visible-layer',
      visible: true,
      position: { x: 50, y: 60 },
      size: { width: 100, height: 80 },
    },
    {
      id: 'element-2',
      type: 'shape',
      layerId: 'hidden-layer',
      visible: true,
      position: { x: 70, y: 80 },
      size: { width: 100, height: 80 },
    },
    {
      id: 'connector-1',
      type: 'mindmap_connector',
      layerId: 'visible-layer',
      visible: true,
      position: { x: 5000, y: 5000 },
      size: { width: 50, height: 50 },
    },
  ] as any;

  const containerRef = {
    current: {
      clientWidth: 900,
      clientHeight: 600,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(canvasKernel.getVisibleBounds).mockReturnValue({ x: 0, y: 0, width: 1000, height: 800 });
    vi.mocked(canvasKernel.snapToGrid).mockReturnValue({ x: 40, y: 80 });

    class ResizeObserverMock {
      callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe() {
        this.callback([], this as any);
      }
      disconnect() {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock as any);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('computes viewport bounds and visible elements using layer visibility', () => {
    const { result } = renderHook(() =>
      useCanvasViewportController({
        containerRef,
        elements,
        layers: [layerVisible, layerHidden] as any,
        viewport,
        settings,
        activeTool: 'selection_tool',
        interactionMode,
        panBy,
        zoomByWheel,
      }),
    );

    expect(canvasKernel.getVisibleBounds).toHaveBeenCalledWith(viewport, 900, 600);
    expect(result.current.viewportBounds).toEqual({ x: 0, y: 0, width: 1000, height: 800 });
    expect(result.current.visibleElements.map((el) => el.id)).toEqual(['element-1', 'connector-1']);
  });

  it('delegates snap to grid using current grid settings', () => {
    const { result } = renderHook(() =>
      useCanvasViewportController({
        containerRef,
        elements,
        layers: [layerVisible] as any,
        viewport,
        settings,
        activeTool: 'selection_tool',
        interactionMode,
        panBy,
        zoomByWheel,
      }),
    );

    let snapped;
    act(() => {
      snapped = result.current.snapToGrid(43, 78);
    });

    expect(canvasKernel.snapToGrid).toHaveBeenCalledWith({ x: 43, y: 78 }, 20, true);
    expect(snapped).toEqual({ x: 40, y: 80 });
  });

  it('routes wheel zoom when ctrl key is pressed', () => {
    const { result } = renderHook(() =>
      useCanvasViewportController({
        containerRef,
        elements,
        layers: [layerVisible] as any,
        viewport,
        settings,
        activeTool: 'selection_tool',
        interactionMode,
        panBy,
        zoomByWheel,
      }),
    );

    const event = {
      preventDefault: vi.fn(),
      ctrlKey: true,
      metaKey: false,
      deltaY: 120,
      deltaX: 15,
      clientX: 400,
      clientY: 300,
    } as any;

    act(() => {
      result.current.handleWheel(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(zoomByWheel).toHaveBeenCalledWith(120, 400, 300);
    expect(panBy).not.toHaveBeenCalled();
  });

  it('routes wheel pan when ctrl/meta keys are not pressed', () => {
    const { result } = renderHook(() =>
      useCanvasViewportController({
        containerRef,
        elements,
        layers: [layerVisible] as any,
        viewport,
        settings,
        activeTool: 'selection_tool',
        interactionMode,
        panBy,
        zoomByWheel,
      }),
    );

    const event = {
      preventDefault: vi.fn(),
      ctrlKey: false,
      metaKey: false,
      deltaY: 25,
      deltaX: 10,
      clientX: 0,
      clientY: 0,
    } as any;

    act(() => {
      result.current.handleWheel(event);
    });

    expect(panBy).toHaveBeenCalledWith(-10, -25);
    expect(zoomByWheel).not.toHaveBeenCalled();
  });

  it('returns contextual cursor when interaction mode is not idle', () => {
    vi.mocked(getCursorForMode).mockReturnValue('grabbing');

    const { result } = renderHook(() =>
      useCanvasViewportController({
        containerRef,
        elements,
        layers: [layerVisible] as any,
        viewport,
        settings,
        activeTool: 'selection_tool',
        interactionMode: { kind: 'panning' },
        panBy,
        zoomByWheel,
      }),
    );

    expect(result.current.getCursorStyle()).toBe('grabbing');
    expect(getCursorForMode).toHaveBeenCalledWith({ kind: 'panning' });
  });

  it('returns crosshair for smart element tools while idle', () => {
    const { result } = renderHook(() =>
      useCanvasViewportController({
        containerRef,
        elements,
        layers: [layerVisible] as any,
        viewport,
        settings,
        activeTool: 'smart_element_tool',
        interactionMode,
        panBy,
        zoomByWheel,
      }),
    );

    expect(result.current.getCursorStyle()).toBe('crosshair');
  });
});
