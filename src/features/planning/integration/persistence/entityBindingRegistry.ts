export type CanvasElementId = string;
export type EntityRef = string;

export type BindingChangeReason = 'bind' | 'unbind' | 'clear';

export interface BindingChangeEvent {
  type: 'binding-changed';
  canvasElementId: CanvasElementId;
  previousEntityRef?: EntityRef;
  nextEntityRef?: EntityRef;
  reason: BindingChangeReason;
}

export interface EntityBindingsClearedEvent {
  type: 'entity-bindings-cleared';
  entityRef: EntityRef;
  canvasElementIds: CanvasElementId[];
}

export type CanvasBindingEvent = BindingChangeEvent | EntityBindingsClearedEvent;
export type CanvasBindingListener = (event: CanvasBindingEvent) => void;

/**
 * Registry for mapping canvas element IDs to external entity references.
 *
 * Backward compatibility note:
 * - elements without bindings are treated as first-class citizens;
 * - querying such elements returns `undefined` and never throws.
 */
export class CanvasEntityBindingRegistry {
  private readonly elementToEntity = new Map<CanvasElementId, EntityRef>();
  private readonly entityToElements = new Map<EntityRef, Set<CanvasElementId>>();
  private readonly listeners = new Set<CanvasBindingListener>();

  bind(canvasElementId: CanvasElementId, entityRef: EntityRef): void {
    const previousEntityRef = this.elementToEntity.get(canvasElementId);

    if (previousEntityRef === entityRef) {
      return;
    }

    if (previousEntityRef) {
      this.removeFromEntityIndex(previousEntityRef, canvasElementId);
    }

    this.elementToEntity.set(canvasElementId, entityRef);

    const elementsForEntity = this.entityToElements.get(entityRef) ?? new Set<CanvasElementId>();
    elementsForEntity.add(canvasElementId);
    this.entityToElements.set(entityRef, elementsForEntity);

    this.emit({
      type: 'binding-changed',
      canvasElementId,
      previousEntityRef,
      nextEntityRef: entityRef,
      reason: 'bind',
    });
  }

  unbind(canvasElementId: CanvasElementId): void {
    const previousEntityRef = this.elementToEntity.get(canvasElementId);
    if (!previousEntityRef) {
      return;
    }

    this.elementToEntity.delete(canvasElementId);
    this.removeFromEntityIndex(previousEntityRef, canvasElementId);

    this.emit({
      type: 'binding-changed',
      canvasElementId,
      previousEntityRef,
      reason: 'unbind',
    });
  }

  getBinding(canvasElementId: CanvasElementId): EntityRef | undefined {
    return this.elementToEntity.get(canvasElementId);
  }

  getElementsByEntity(entityRef: EntityRef): CanvasElementId[] {
    const elements = this.entityToElements.get(entityRef);
    if (!elements) {
      return [];
    }

    return Array.from(elements);
  }

  clearEntityBindings(entityRef: EntityRef): void {
    const boundElements = this.entityToElements.get(entityRef);
    if (!boundElements || boundElements.size === 0) {
      return;
    }

    const canvasElementIds = Array.from(boundElements);

    canvasElementIds.forEach((canvasElementId) => {
      this.elementToEntity.delete(canvasElementId);
      this.emit({
        type: 'binding-changed',
        canvasElementId,
        previousEntityRef: entityRef,
        reason: 'clear',
      });
    });

    this.entityToElements.delete(entityRef);

    this.emit({
      type: 'entity-bindings-cleared',
      entityRef,
      canvasElementIds,
    });
  }

  subscribe(listener: CanvasBindingListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: CanvasBindingEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  private removeFromEntityIndex(entityRef: EntityRef, canvasElementId: CanvasElementId): void {
    const elements = this.entityToElements.get(entityRef);
    if (!elements) {
      return;
    }

    elements.delete(canvasElementId);
    if (elements.size === 0) {
      this.entityToElements.delete(entityRef);
    }
  }
}

export const canvasEntityBindingRegistry = new CanvasEntityBindingRegistry();
