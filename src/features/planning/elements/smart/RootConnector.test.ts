import { describe, expect, it } from 'vitest';
import { getConnectorVisualState, type RootConnectorData } from './RootConnector';

const baseConnector: RootConnectorData = {
  id: 'connector-1',
  startPoint: { elementId: 'source', x: 0, y: 0, anchorPoint: 'right' },
  endPoint: { elementId: 'target', x: 120, y: 0, anchorPoint: 'left' },
};

describe('getConnectorVisualState', () => {
  it('keeps suggested relationships visually proposed instead of confirmed or operational', () => {
    const state = getConnectorVisualState({
      ...baseConnector,
      status: 'suggested',
      permissionScope: 'allowed',
      requiresReview: true,
    });

    expect(state.key).toBe('proposed');
    expect(state.label).toBe('مقترح');
    expect(state.key).not.toBe('confirmed');
    expect(state.key).not.toBe('operational');
    expect(state.dasharray).toBe('8,4');
  });

  it('does not allow an operational status to look operational while it still requires review', () => {
    const state = getConnectorVisualState({
      ...baseConnector,
      status: 'operational',
      permissionScope: 'allowed',
      requiresReview: true,
    });

    expect(state.key).toBe('proposed');
    expect(state.tag).toBe('بانتظار الاعتماد');
  });

  it('shows confirmed relationships only after review is cleared', () => {
    const state = getConnectorVisualState({
      ...baseConnector,
      status: 'confirmed',
      permissionScope: 'allowed',
      requiresReview: false,
    });

    expect(state.key).toBe('confirmed');
    expect(state.label).toBe('مؤكد');
    expect(state.dasharray).toBe('none');
  });

  it('prioritizes permission restrictions over relationship status', () => {
    expect(getConnectorVisualState({ ...baseConnector, status: 'operational', permissionScope: 'restricted' }).key).toBe('restricted');
    expect(getConnectorVisualState({ ...baseConnector, status: 'confirmed', permissionScope: 'blocked' }).key).toBe('blocked');
  });
});
