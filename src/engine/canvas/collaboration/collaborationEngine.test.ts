import { describe, expect, it } from 'vitest';
import { CollaborationEvent, resolveConflict } from './collaborationEngine';

function makeEvent(overrides: Partial<CollaborationEvent>): CollaborationEvent {
  return {
    type: 'element_updated',
    odId: 'remote-user',
    boardId: 'board-1',
    payload: { entityType: 'element', entityId: 'e-1', elementId: 'e-1' },
    timestamp: 1700000000000,
    version: 2,
    baseVersion: 1,
    entityVersion: 2,
    ...overrides,
  };
}

describe('resolveConflict', () => {
  it('keeps local state for stale task updates', () => {
    const event = makeEvent({
      payload: { entityType: 'task', entityId: 'task-1' },
      baseVersion: 1,
      entityVersion: 2,
    });

    const resolution = resolveConflict(event, 3);

    expect(resolution.entityType).toBe('task');
    expect(resolution.rule).toBe('task:optimistic-deterministic-lww');
    expect(resolution.outcome).toBe('keep_local');
  });

  it('accepts dependency updates deterministically', () => {
    const event = makeEvent({
      payload: { entityType: 'dependency', entityId: 'dep-1' },
      baseVersion: 0,
    });

    const resolution = resolveConflict(event, 4);

    expect(resolution.entityType).toBe('dependency');
    expect(resolution.rule).toBe('dependency:remote-authoritative');
    expect(resolution.outcome).toBe('apply_remote');
  });

  it('defaults unknown entities to keep-local', () => {
    const event = makeEvent({
      payload: { entityType: 'milestone', entityId: 'm-1' },
    });

    const resolution = resolveConflict(event, 2);

    expect(resolution.entityType).toBe('unknown');
    expect(resolution.rule).toBe('unknown:keep-local');
    expect(resolution.outcome).toBe('keep_local');
  });
});
