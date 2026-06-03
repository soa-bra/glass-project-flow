import { describe, expect, it } from 'vitest';
import { canMutateCanvas, highestCanvasRole, mapAppRoleToCanvasRole } from './useCurrentBoardRole';

describe('planning board roles', () => {
  it('maps board-scoped app roles to canvas roles', () => {
    expect(mapAppRoleToCanvasRole('owner')).toBe('host');
    expect(mapAppRoleToCanvasRole('project_manager')).toBe('editor');
    expect(mapAppRoleToCanvasRole('ai_analyst')).toBe('editor');
    expect(mapAppRoleToCanvasRole('guest')).toBe('guest');
    expect(mapAppRoleToCanvasRole('finance_auditor')).toBe('viewer');
  });

  it('keeps the strongest role when global and board roles differ', () => {
    expect(highestCanvasRole('viewer', 'editor')).toBe('editor');
    expect(highestCanvasRole('editor', 'viewer', 'guest')).toBe('editor');
    expect(highestCanvasRole('host', 'editor', 'viewer')).toBe('host');
  });

  it('allows mutation only for host and editor roles', () => {
    expect(canMutateCanvas('host')).toBe(true);
    expect(canMutateCanvas('editor')).toBe(true);
    expect(canMutateCanvas('viewer')).toBe(false);
    expect(canMutateCanvas('guest')).toBe(false);
  });
});
