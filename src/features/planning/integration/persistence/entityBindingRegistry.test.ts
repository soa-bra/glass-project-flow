import { describe, expect, it, vi } from 'vitest';

import { CanvasEntityBindingRegistry } from './entityBindingRegistry';

describe('CanvasEntityBindingRegistry', () => {
  it('binds, rebinds, and unbinds canvas elements', () => {
    const registry = new CanvasEntityBindingRegistry();

    registry.bind('el-1', 'entity:task-1');
    expect(registry.getBinding('el-1')).toBe('entity:task-1');
    expect(registry.getElementsByEntity('entity:task-1')).toEqual(['el-1']);

    registry.bind('el-1', 'entity:task-2');
    expect(registry.getBinding('el-1')).toBe('entity:task-2');
    expect(registry.getElementsByEntity('entity:task-1')).toEqual([]);
    expect(registry.getElementsByEntity('entity:task-2')).toEqual(['el-1']);

    registry.unbind('el-1');
    expect(registry.getBinding('el-1')).toBeUndefined();
    expect(registry.getElementsByEntity('entity:task-2')).toEqual([]);
  });

  it('handles elements without bindings for backward compatibility', () => {
    const registry = new CanvasEntityBindingRegistry();

    expect(registry.getBinding('unbound-element')).toBeUndefined();
    expect(registry.getElementsByEntity('entity:unknown')).toEqual([]);

    expect(() => registry.unbind('unbound-element')).not.toThrow();
  });

  it('emits events on binding changes and supports unsubscribe', () => {
    const registry = new CanvasEntityBindingRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe(listener);

    registry.bind('el-1', 'entity:task-1');
    registry.bind('el-1', 'entity:task-2');
    registry.unbind('el-1');

    expect(listener).toHaveBeenCalledTimes(3);
    expect(listener).toHaveBeenNthCalledWith(1, {
      type: 'binding-changed',
      canvasElementId: 'el-1',
      previousEntityRef: undefined,
      nextEntityRef: 'entity:task-1',
      reason: 'bind',
    });

    expect(listener).toHaveBeenNthCalledWith(2, {
      type: 'binding-changed',
      canvasElementId: 'el-1',
      previousEntityRef: 'entity:task-1',
      nextEntityRef: 'entity:task-2',
      reason: 'bind',
    });

    expect(listener).toHaveBeenNthCalledWith(3, {
      type: 'binding-changed',
      canvasElementId: 'el-1',
      previousEntityRef: 'entity:task-2',
      reason: 'unbind',
    });

    unsubscribe();
    registry.bind('el-2', 'entity:task-3');
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('emits clear events when clearing entity bindings', () => {
    const registry = new CanvasEntityBindingRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);

    registry.bind('el-1', 'entity:task-1');
    registry.bind('el-2', 'entity:task-1');
    listener.mockClear();

    registry.clearEntityBindings('entity:task-1');

    expect(registry.getElementsByEntity('entity:task-1')).toEqual([]);
    expect(registry.getBinding('el-1')).toBeUndefined();
    expect(registry.getBinding('el-2')).toBeUndefined();

    expect(listener).toHaveBeenCalledTimes(3);
    expect(listener).toHaveBeenNthCalledWith(1, {
      type: 'binding-changed',
      canvasElementId: 'el-1',
      previousEntityRef: 'entity:task-1',
      reason: 'clear',
    });
    expect(listener).toHaveBeenNthCalledWith(2, {
      type: 'binding-changed',
      canvasElementId: 'el-2',
      previousEntityRef: 'entity:task-1',
      reason: 'clear',
    });
    expect(listener).toHaveBeenNthCalledWith(3, {
      type: 'entity-bindings-cleared',
      entityRef: 'entity:task-1',
      canvasElementIds: ['el-1', 'el-2'],
    });
  });
});
