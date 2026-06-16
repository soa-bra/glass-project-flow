import { describe, expect, it } from 'vitest';
import { resolvePlanningCanvasReadyState } from './usePlanningCanvasReadyState';

describe('usePlanningCanvasReadyState', () => {
  it('blocks readiness until a refreshed canvas finishes hydrating planning elements', () => {
    const state = resolvePlanningCanvasReadyState({
      boardId: 'board-1',
      hydrationStatus: 'loading',
      realtimeStatus: 'connected',
      persistenceStatus: 'idle',
      canEdit: true,
    });

    expect(state.isReady).toBe(false);
    expect(state.reason).toBe('hydrating-elements');
    expect(state.manualRefreshVerification).toContain('refresh جديد');
    expect(state.manualRefreshVerification).toContain('planning_elements');
  });

  it('requires persistence errors to stay reviewable for editable canvases', () => {
    const state = resolvePlanningCanvasReadyState({
      boardId: 'board-1',
      hydrationStatus: 'ready',
      realtimeStatus: 'connected',
      persistenceStatus: 'error',
      canEdit: true,
    });

    expect(state).toMatchObject({ isReady: false, reason: 'persistence-error' });
    expect(state.manualRefreshVerification).toContain('عدّل عنصراً');
  });

  it('marks the canvas ready only with explicit manual refresh verification guidance', () => {
    const state = resolvePlanningCanvasReadyState({
      boardId: 'board-1',
      hydrationStatus: 'ready',
      realtimeStatus: 'connected',
      persistenceStatus: 'saved',
      canEdit: true,
    });

    expect(state.isReady).toBe(true);
    expect(state.reason).toBe('ready');
    expect(state.requiresManualRefreshVerification).toBe(true);
    expect(state.manualRefreshVerification).toContain('typecheck');
  });
});
