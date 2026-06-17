import { createRef } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePlanningCanvasReadyState } from './usePlanningCanvasReadyState';

function renderReadyState(overrides: Partial<Parameters<typeof usePlanningCanvasReadyState>[0]> = {}) {
  const ref = createRef<HTMLDivElement>();
  return renderHook(() =>
    usePlanningCanvasReadyState({
      boardId: 'board-1',
      boardRole: { loading: false },
      sync: { isHydrated: true, hydrationStatus: 'hydrated', hydrationError: null, hydratedBoardId: 'board-1' },
      aiPermissions: { loading: false },
      viewportHostSize: { width: 1200, height: 800 },
      canvasHostRef: ref,
      ...overrides,
    }),
  );
}

describe('usePlanningCanvasReadyState', () => {
  it('waits when only the board role is loading', () => {
    const { result } = renderReadyState({ boardRole: { loading: true } });

    expect(result.current.isReady).toBe(false);
    expect(result.current.pendingReasons).toContain('board-role');
  });

  it('waits when only hydration is loading', () => {
    const { result } = renderReadyState({
      sync: { isHydrated: false, hydrationStatus: 'loading', hydrationError: null, hydratedBoardId: null },
    });

    expect(result.current.isReady).toBe(false);
    expect(result.current.pendingReasons).toContain('hydration');
  });

  it('waits when only AI permissions are loading', () => {
    const { result } = renderReadyState({ aiPermissions: { loading: true } });

    expect(result.current.isReady).toBe(false);
    expect(result.current.pendingReasons).toContain('ai-permissions');
  });

  it('waits when the viewport is not ready', () => {
    const { result } = renderReadyState({ viewportHostSize: { width: 0, height: 0 } });

    expect(result.current.isReady).toBe(false);
    expect(result.current.pendingReasons).toContain('viewport');
  });

  it('is ready when all dependencies are ready', () => {
    const { result } = renderReadyState();

    expect(result.current.isReady).toBe(true);
    expect(result.current.pendingReasons).toEqual([]);
  });
});
