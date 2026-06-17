import { describe, expect, it } from 'vitest';
import { resolvePlanningCanvasReadyState, type PlanningCanvasReadyInput } from './usePlanningCanvasReadyState';

const readyInput: PlanningCanvasReadyInput = {
  boardId: 'board-1',
  canEdit: true,
  boardRoleLoading: false,
  aiPermissionsLoading: false,
  viewportHostSize: { width: 1200, height: 800 },
  hydrationStatus: 'ready',
  hydrationError: null,
  realtimeStatus: 'connected',
  persistenceStatus: 'saved',
};

function resolve(overrides: Partial<PlanningCanvasReadyInput> = {}) {
  return resolvePlanningCanvasReadyState({ ...readyInput, ...overrides });
}

describe('usePlanningCanvasReadyState', () => {
  it('blocks readiness when no board is selected', () => {
    const state = resolve({ boardId: null });

    expect(state).toMatchObject({ isReady: false, reason: 'missing-board', pendingReasons: ['missing-board'] });
  });

  it('blocks readiness while the board role is loading', () => {
    const state = resolve({ boardRoleLoading: true });

    expect(state).toMatchObject({ isReady: false, reason: 'board-role-loading', pendingReasons: ['board-role-loading'] });
    expect(state.manualRefreshVerification).toContain('الصلاحيات');
  });

  it('blocks readiness while AI permissions are loading', () => {
    const state = resolve({ aiPermissionsLoading: true });

    expect(state).toMatchObject({ isReady: false, reason: 'ai-permissions-loading', pendingReasons: ['ai-permissions-loading'] });
    expect(state.manualRefreshVerification).toContain('الذكاء الاصطناعي');
  });

  it('blocks readiness until a refreshed canvas finishes hydrating planning elements', () => {
    const state = resolve({ hydrationStatus: 'loading' });

    expect(state.isReady).toBe(false);
    expect(state.reason).toBe('hydrating-elements');
    expect(state.manualRefreshVerification).toContain('refresh جديد');
    expect(state.manualRefreshVerification).toContain('planning_elements');
  });

  it('blocks readiness when hydration has failed', () => {
    const state = resolve({ hydrationStatus: 'error', hydrationError: new Error('fetch failed') });

    expect(state).toMatchObject({ isReady: false, reason: 'hydration-error', pendingReasons: ['hydration-error'] });
    expect(state.manualRefreshVerification).toContain('فشل تحميل عناصر');
  });

  it('blocks readiness until the viewport host has a measured size', () => {
    const state = resolve({ viewportHostSize: { width: 0, height: 800 } });

    expect(state).toMatchObject({ isReady: false, reason: 'viewport-not-ready', pendingReasons: ['viewport-not-ready'] });
    expect(state.manualRefreshVerification).toContain('قياس مساحة الكانفس');
  });

  it('requires persistence errors to stay reviewable for editable canvases', () => {
    const state = resolve({ persistenceStatus: 'error' });

    expect(state).toMatchObject({ isReady: false, reason: 'persistence-error', pendingReasons: ['persistence-error'] });
    expect(state.manualRefreshVerification).toContain('عدّل عنصراً');
  });

  it('does not block read-only canvases on persistence errors', () => {
    const state = resolve({ canEdit: false, persistenceStatus: 'error' });

    expect(state).toMatchObject({ isReady: true, reason: 'ready', pendingReasons: [] });
  });

  it('marks the canvas ready only with explicit manual refresh verification guidance', () => {
    const state = resolve();

    expect(state.isReady).toBe(true);
    expect(state.reason).toBe('ready');
    expect(state.pendingReasons).toEqual([]);
    expect(state.requiresManualRefreshVerification).toBe(true);
    expect(state.manualRefreshVerification).toContain('typecheck');
  });
});
