import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useCanvasSelectionController } from './useCanvasSelectionController';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';

vi.mock('@/engine/canvas/kernel/canvasKernel', () => ({
  canvasKernel: {
    worldToScreen: vi.fn(),
  },
}));

describe('useCanvasSelectionController', () => {
  const viewport = { zoom: 2, pan: { x: 30, y: 40 } };
  const rect = {
    left: 10,
    top: 20,
    width: 800,
    height: 600,
    right: 810,
    bottom: 620,
    x: 10,
    y: 20,
    toJSON: () => ({}),
  } as DOMRect;

  const containerRef = {
    current: {
      getBoundingClientRect: vi.fn(() => rect),
    },
  } as any;

  const startPanning = vi.fn();
  const startBoxSelect = vi.fn();
  const updateBoxSelect = vi.fn();
  const resetToIdle = vi.fn();
  const finishSelection = vi.fn();
  const updatePointerFromClient = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(canvasKernel.worldToScreen)
      .mockReturnValueOnce({ x: 100, y: 120 })
      .mockReturnValueOnce({ x: 220, y: 260 })
      .mockReturnValueOnce({ x: 100, y: 120 })
      .mockReturnValueOnce({ x: 220, y: 260 });
  });

  it('starts panning and stores the last client position', () => {
    const { result } = renderHook(() =>
      useCanvasSelectionController({
        containerRef,
        viewport,
        boxSelectData: null,
        startPanning,
        startBoxSelect,
        updateBoxSelect,
        resetToIdle,
        finishSelection,
        updatePointerFromClient,
      }),
    );

    act(() => {
      result.current.beginPanning(300, 180);
    });

    expect(startPanning).toHaveBeenCalledWith({ x: 300, y: 180 }, { x: 30, y: 40 });
    expect(result.current.lastPanPositionRef.current).toEqual({ x: 300, y: 180 });
  });

  it('updates pan delta based on the last stored position', () => {
    const panBy = vi.fn();
    const { result } = renderHook(() =>
      useCanvasSelectionController({
        containerRef,
        viewport,
        boxSelectData: null,
        startPanning,
        startBoxSelect,
        updateBoxSelect,
        resetToIdle,
        finishSelection,
        updatePointerFromClient,
      }),
    );

    act(() => {
      result.current.beginPanning(100, 100);
      result.current.updatePan(135, 155, panBy);
    });

    expect(panBy).toHaveBeenCalledWith(35, 55);
    expect(result.current.lastPanPositionRef.current).toEqual({ x: 135, y: 155 });
  });

  it('starts box selection only when pointer conversion succeeds', () => {
    updatePointerFromClient.mockReturnValue({ x: 50, y: 80 });
    const { result } = renderHook(() =>
      useCanvasSelectionController({
        containerRef,
        viewport,
        boxSelectData: null,
        startPanning,
        startBoxSelect,
        updateBoxSelect,
        resetToIdle,
        finishSelection,
        updatePointerFromClient,
      }),
    );

    let didStart = false;
    act(() => {
      didStart = result.current.beginBoxSelection(400, 300, true);
    });

    expect(didStart).toBe(true);
    expect(startBoxSelect).toHaveBeenCalledWith({ x: 50, y: 80 }, true);
  });

  it('updates box selection from client coordinates when pointer conversion succeeds', () => {
    updatePointerFromClient.mockReturnValue({ x: 70, y: 90 });
    const { result } = renderHook(() =>
      useCanvasSelectionController({
        containerRef,
        viewport,
        boxSelectData: null,
        startPanning,
        startBoxSelect,
        updateBoxSelect,
        resetToIdle,
        finishSelection,
        updatePointerFromClient,
      }),
    );

    act(() => {
      result.current.updateBoxSelectionFromClient(420, 330);
    });

    expect(updateBoxSelect).toHaveBeenCalledWith({ x: 70, y: 90 });
  });

  it('completes box selection and resets idle when selection box is large enough', () => {
    const boxSelectData = {
      startWorld: { x: 10, y: 20 },
      currentWorld: { x: 40, y: 70 },
      additive: true,
    };

    const { result } = renderHook(() =>
      useCanvasSelectionController({
        containerRef,
        viewport,
        boxSelectData,
        startPanning,
        startBoxSelect,
        updateBoxSelect,
        resetToIdle,
        finishSelection,
        updatePointerFromClient,
      }),
    );

    act(() => {
      result.current.completeBoxSelection();
    });

    expect(finishSelection).toHaveBeenCalledWith(90, 100, 210, 240, true);
    expect(resetToIdle).toHaveBeenCalled();
  });

  it('builds selection box screen coordinates from world coordinates', () => {
    const boxSelectData = {
      startWorld: { x: 10, y: 20 },
      currentWorld: { x: 40, y: 70 },
      additive: false,
    };

    const { result } = renderHook(() =>
      useCanvasSelectionController({
        containerRef,
        viewport,
        boxSelectData,
        startPanning,
        startBoxSelect,
        updateBoxSelect,
        resetToIdle,
        finishSelection,
        updatePointerFromClient,
      }),
    );

    expect(result.current.selectionBoxData).toEqual({
      startX: 90,
      startY: 100,
      currentX: 210,
      currentY: 240,
    });
  });
});
