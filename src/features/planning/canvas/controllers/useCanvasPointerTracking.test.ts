import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useCanvasPointerTracking } from './useCanvasPointerTracking';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';

vi.mock('@/engine/canvas/kernel/canvasKernel', () => ({
  canvasKernel: {
    screenToWorld: vi.fn(),
  },
}));

describe('useCanvasPointerTracking', () => {
  const viewport = { zoom: 2, pan: { x: 10, y: 20 } };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('converts client coordinates to world coordinates and stores last pointer position', () => {
    const rect = {
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;

    const containerRef = {
      current: {
        getBoundingClientRect: vi.fn(() => rect),
      },
    } as any;

    vi.mocked(canvasKernel.screenToWorld).mockReturnValue({ x: 150, y: 75 });

    const { result } = renderHook(() =>
      useCanvasPointerTracking({ containerRef, viewport }),
    );

    let worldPoint: { x: number; y: number } | null = null;
    act(() => {
      worldPoint = result.current.updatePointerFromClient(300, 170);
    });

    expect(canvasKernel.screenToWorld).toHaveBeenCalledWith(300, 170, viewport, rect);
    expect(worldPoint).toEqual({ x: 150, y: 75 });
    expect(result.current.lastPointerPositionRef.current).toEqual({ x: 150, y: 75 });
  });

  it('returns null when the container rect is unavailable', () => {
    const containerRef = { current: null } as any;

    const { result } = renderHook(() =>
      useCanvasPointerTracking({ containerRef, viewport }),
    );

    let worldPoint: { x: number; y: number } | null = { x: 1, y: 1 };
    act(() => {
      worldPoint = result.current.updatePointerFromClient(10, 20);
    });

    expect(worldPoint).toBeNull();
    expect(result.current.lastPointerPositionRef.current).toBeNull();
    expect(canvasKernel.screenToWorld).not.toHaveBeenCalled();
  });
});
