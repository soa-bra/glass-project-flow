/**
 * Board Operations Layer - عمليات اللوحة الموحدة
 * Sprint 1: Event-driven operations for all board modifications
 */

import { nanoid } from 'nanoid';
import type {
  BoardElement,
  BoardPosition,
  BoardSize,
  BoardOp,
  BoardOpType,
  BoardOpBatch,
  BoardEvent,
  BoardEventType,
  BoardElementStyle,
  BoardElementMetadata
} from '@/types/board-model';

// ============= Event Emitter =============

type EventCallback = (event: BoardEvent) => void;

class BoardEventEmitter {
  private listeners: Map<BoardEventType, Set<EventCallback>> = new Map();
  private allListeners: Set<EventCallback> = new Set();

  on(type: BoardEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
    
    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  onAll(callback: EventCallback): () => void {
    this.allListeners.add(callback);
    return () => {
      this.allListeners.delete(callback);
    };
  }

  emit(event: BoardEvent): void {
    // إرسال للمستمعين المحددين
    this.listeners.get(event.type)?.forEach(cb => cb(event));
    // إرسال للمستمعين العامين
    this.allListeners.forEach(cb => cb(event));
  }

  clear(): void {
    this.listeners.clear();
    this.allListeners.clear();
  }
}

export const boardEvents = new BoardEventEmitter();

// ============= Operation Factory =============

export const createOp = (
  type: BoardOpType,
  elementId: string,
  payload: Record<string, unknown>,
  previousState?: Partial<BoardElement>
): BoardOp => ({
  id: nanoid(),
  type,
  elementId,
  payload,
  timestamp: Date.now(),
  previousState
});

export const createOpBatch = (
  ops: BoardOp[],
  description?: string
): BoardOpBatch => ({
  id: nanoid(),
  ops,
  timestamp: Date.now(),
  description
});

// ============= Element Operations =============

/**
 * إنشاء عنصر جديد
 */
export const createAddElementOp = (
  element: Omit<BoardElement, 'id'> & { id?: string }
): { op: BoardOp; element: BoardElement } => {
  const newElement: BoardElement = {
    ...element,
    id: element.id || nanoid(),
    zIndex: element.zIndex ?? 0,
    visible: element.visible ?? true,
    locked: element.locked ?? false,
    position: element.position || { x: 0, y: 0 },
    size: element.size || { width: 100, height: 100 }
  };

  const op = createOp('add', newElement.id, { element: newElement });

  return { op, element: newElement };
};

/**
 * تحديث عنصر
 */
export const createUpdateElementOp = (
  elementId: string,
  updates: Partial<BoardElement>,
  previousState?: Partial<BoardElement>
): BoardOp => {
  return createOp('update', elementId, { updates }, previousState);
};

/**
 * حذف عنصر
 */
export const createDeleteElementOp = (
  elementId: string,
  previousState?: BoardElement
): BoardOp => {
  return createOp('delete', elementId, {}, previousState);
};

/**
 * تحريك عنصر
 */
export const createMoveElementOp = (
  elementId: string,
  newPosition: BoardPosition,
  previousPosition?: BoardPosition
): BoardOp => {
  return createOp(
    'move',
    elementId,
    { position: newPosition },
    previousPosition ? { position: previousPosition } : undefined
  );
};

/**
 * تغيير حجم عنصر
 */
export const createResizeElementOp = (
  elementId: string,
  newSize: BoardSize,
  newPosition?: BoardPosition,
  previousSize?: BoardSize,
  previousPosition?: BoardPosition
): BoardOp => {
  return createOp(
    'resize',
    elementId,
    { size: newSize, position: newPosition },
    { size: previousSize, position: previousPosition }
  );
};

/**
 * تدوير عنصر
 */
export const createRotateElementOp = (
  elementId: string,
  rotation: number,
  previousRotation?: number
): BoardOp => {
  return createOp(
    'rotate',
    elementId,
    { rotation },
    previousRotation !== undefined ? { rotation: previousRotation } : undefined
  );
};

/**
 * إعادة ترتيب عنصر (zIndex)
 */
export const createReorderElementOp = (
  elementId: string,
  newZIndex: number,
  previousZIndex?: number
): BoardOp => {
  return createOp(
    'reorder',
    elementId,
    { zIndex: newZIndex },
    previousZIndex !== undefined ? { zIndex: previousZIndex } : undefined
  );
};

/**
 * تجميع عناصر
 */
export const createGroupElementsOp = (
  elementIds: string[],
  groupId: string
): BoardOpBatch => {
  const ops = elementIds.map(elementId =>
    createOp('group', elementId, { groupId })
  );
  return createOpBatch(ops, `تجميع ${elementIds.length} عنصر`);
};

/**
 * فك تجميع عناصر
 */
export const createUngroupElementsOp = (
  elementIds: string[],
  previousGroupId: string
): BoardOpBatch => {
  const ops = elementIds.map(elementId =>
    createOp('ungroup', elementId, {}, { metadata: { groupId: previousGroupId } })
  );
  return createOpBatch(ops, `فك تجميع ${elementIds.length} عنصر`);
};

/**
 * قفل عنصر
 */
export const createLockElementOp = (
  elementId: string,
  previousLocked?: boolean
): BoardOp => {
  return createOp(
    'lock',
    elementId,
    { locked: true },
    previousLocked !== undefined ? { locked: previousLocked } : undefined
  );
};

/**
 * فتح قفل عنصر
 */
export const createUnlockElementOp = (
  elementId: string,
  previousLocked?: boolean
): BoardOp => {
  return createOp(
    'unlock',
    elementId,
    { locked: false },
    previousLocked !== undefined ? { locked: previousLocked } : undefined
  );
};

/**
 * تحديث نمط عنصر
 */
export const createStyleElementOp = (
  elementId: string,
  style: Partial<BoardElementStyle>,
  previousStyle?: Partial<BoardElementStyle>
): BoardOp => {
  return createOp(
    'style',
    elementId,
    { style },
    previousStyle ? { style: previousStyle } : undefined
  );
};

// ============= Operation Applier =============

/**
 * تطبيق عملية على قائمة العناصر
 */
export const applyOp = (
  elements: BoardElement[],
  op: BoardOp
): BoardElement[] => {
  switch (op.type) {
    case 'add': {
      const newElement = op.payload.element as BoardElement;
      return [...elements, newElement];
    }

    case 'delete': {
      return elements.filter(el => el.id !== op.elementId);
    }

    case 'update':
    case 'move':
    case 'resize':
    case 'rotate':
    case 'reorder':
    case 'lock':
    case 'unlock': {
      return elements.map(el => {
        if (el.id !== op.elementId) return el;
        return { ...el, ...op.payload };
      });
    }

    case 'style': {
      return elements.map(el => {
        if (el.id !== op.elementId) return el;
        return {
          ...el,
          style: { ...el.style, ...(op.payload.style as BoardElementStyle) }
        };
      });
    }

    case 'group': {
      return elements.map(el => {
        if (el.id !== op.elementId) return el;
        return {
          ...el,
          metadata: {
            ...el.metadata,
            groupId: op.payload.groupId as string
          }
        };
      });
    }

    case 'ungroup': {
      return elements.map(el => {
        if (el.id !== op.elementId) return el;
        const { groupId, ...restMetadata } = el.metadata || {};
        return {
          ...el,
          metadata: restMetadata
        };
      });
    }

    default:
      return elements;
  }
};

/**
 * تطبيق مجموعة عمليات
 */
export const applyOpBatch = (
  elements: BoardElement[],
  batch: BoardOpBatch
): BoardElement[] => {
  return batch.ops.reduce((acc, op) => applyOp(acc, op), elements);
};

/**
 * عكس عملية (للتراجع)
 */
export const reverseOp = (op: BoardOp): BoardOp | null => {
  switch (op.type) {
    case 'add':
      return createOp('delete', op.elementId, {}, op.payload.element as BoardElement);

    case 'delete':
      if (!op.previousState) return null;
      return createOp('add', op.elementId, { element: op.previousState });

    case 'update':
    case 'move':
    case 'resize':
    case 'rotate':
    case 'reorder':
    case 'lock':
    case 'unlock':
    case 'style':
      if (!op.previousState) return null;
      return createOp(op.type, op.elementId, op.previousState, op.payload);

    case 'group':
      return createOp('ungroup', op.elementId, {}, { metadata: { groupId: op.payload.groupId as string } });

    case 'ungroup':
      if (!op.previousState?.metadata?.groupId) return null;
      return createOp('group', op.elementId, { groupId: op.previousState.metadata.groupId });

    default:
      return null;
  }
};

// ============= Batch Operations =============

/**
 * تحريك عدة عناصر
 */
export const createMoveElementsBatchOp = (
  elements: BoardElement[],
  deltaX: number,
  deltaY: number
): BoardOpBatch => {
  const ops = elements.map(el =>
    createMoveElementOp(
      el.id,
      { x: el.position.x + deltaX, y: el.position.y + deltaY },
      el.position
    )
  );
  return createOpBatch(ops, `تحريك ${elements.length} عنصر`);
};

/**
 * حذف عدة عناصر
 */
export const createDeleteElementsBatchOp = (
  elements: BoardElement[]
): BoardOpBatch => {
  const ops = elements.map(el => createDeleteElementOp(el.id, el));
  return createOpBatch(ops, `حذف ${elements.length} عنصر`);
};

/**
 * تحديث نمط عدة عناصر
 */
export const createStyleElementsBatchOp = (
  elements: BoardElement[],
  style: Partial<BoardElementStyle>
): BoardOpBatch => {
  const ops = elements.map(el =>
    createStyleElementOp(el.id, style, el.style)
  );
  return createOpBatch(ops, `تحديث نمط ${elements.length} عنصر`);
};

// ============= Event Helpers =============

/**
 * إنشاء وإرسال حدث
 */
export const emitBoardEvent = (
  type: BoardEventType,
  elementId?: string,
  data: Record<string, unknown> = {}
): void => {
  const event: BoardEvent = {
    type,
    elementId,
    data,
    timestamp: Date.now()
  };
  boardEvents.emit(event);
};

/**
 * إرسال حدث بعد تطبيق عملية
 */
export const emitOpEvent = (op: BoardOp): void => {
  const eventTypeMap: Record<BoardOpType, BoardEventType> = {
    add: 'element:added',
    update: 'element:updated',
    delete: 'element:deleted',
    move: 'element:moved',
    resize: 'element:resized',
    rotate: 'element:updated',
    reorder: 'element:updated',
    group: 'element:updated',
    ungroup: 'element:updated',
    lock: 'element:updated',
    unlock: 'element:updated',
    style: 'element:updated'
  };

  emitBoardEvent(eventTypeMap[op.type], op.elementId, op.payload);
};
