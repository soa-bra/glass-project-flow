/**
 * Board Store - Store للبيانات فقط (منفصل عن UI)
 * Sprint 1: تفكيك canvasStore إلى boardStore + uiStore
 */

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type {
  BoardModel,
  BoardElement,
  BoardLayer,
  BoardSettings,
  BoardMetadata,
  BoardLink,
  BoardOp,
  BoardOpBatch,
  BoardPosition,
  BoardSize,
  BoardElementStyle
} from '@/types/board-model';
import {
  createAddElementOp,
  createUpdateElementOp,
  createDeleteElementOp,
  createMoveElementOp,
  createResizeElementOp,
  applyOp,
  applyOpBatch,
  reverseOp,
  emitOpEvent,
  createOpBatch,
  createGroupElementsOp,
  createUngroupElementsOp,
  createStyleElementsBatchOp,
  createDeleteElementsBatchOp,
  createMoveElementsBatchOp
} from '@/core/ops/boardOps';

// ============= Board History =============

interface BoardHistory {
  past: BoardOpBatch[];
  future: BoardOpBatch[];
}

// ============= Board State Interface =============

interface BoardState {
  // بيانات اللوحة
  metadata: BoardMetadata;
  elements: BoardElement[];
  links: BoardLink[];
  layers: BoardLayer[];
  settings: BoardSettings;
  
  // History
  history: BoardHistory;
  
  // Element Operations
  addElement: (element: Omit<BoardElement, 'id'> & { id?: string }) => string;
  updateElement: (elementId: string, updates: Partial<BoardElement>) => void;
  deleteElement: (elementId: string) => void;
  deleteElements: (elementIds: string[]) => void;
  duplicateElement: (elementId: string) => string | null;
  duplicateElements: (elementIds: string[]) => string[];
  
  // Position & Size Operations
  moveElement: (elementId: string, position: BoardPosition) => void;
  moveElements: (elementIds: string[], deltaX: number, deltaY: number) => void;
  resizeElement: (elementId: string, size: BoardSize, position?: BoardPosition) => void;
  rotateElement: (elementId: string, rotation: number) => void;
  
  // Style Operations
  updateElementStyle: (elementId: string, style: Partial<BoardElementStyle>) => void;
  updateElementsStyle: (elementIds: string[], style: Partial<BoardElementStyle>) => void;
  
  // Group Operations
  groupElements: (elementIds: string[]) => string;
  ungroupElements: (groupId: string) => void;
  getGroupElements: (groupId: string) => BoardElement[];
  
  // Lock Operations
  lockElement: (elementId: string) => void;
  unlockElement: (elementId: string) => void;
  lockElements: (elementIds: string[]) => void;
  unlockElements: (elementIds: string[]) => void;
  
  // Layer Operations
  addLayer: (name: string) => string;
  updateLayer: (layerId: string, updates: Partial<BoardLayer>) => void;
  deleteLayer: (layerId: string) => void;
  reorderLayers: (layerIds: string[]) => void;
  moveElementToLayer: (elementId: string, layerId: string) => void;
  
  // Link Operations
  addLink: (link: Omit<BoardLink, 'id'>) => string;
  updateLink: (linkId: string, updates: Partial<BoardLink>) => void;
  deleteLink: (linkId: string) => void;
  getElementLinks: (elementId: string) => BoardLink[];
  
  // Settings Operations
  updateSettings: (settings: Partial<BoardSettings>) => void;
  
  // Metadata Operations
  updateMetadata: (metadata: Partial<BoardMetadata>) => void;
  
  // History Operations
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  
  // Board Operations
  loadBoard: (board: BoardModel) => void;
  exportBoard: () => BoardModel;
  resetBoard: () => void;
  
  // Element Getters
  getElementById: (elementId: string) => BoardElement | undefined;
  getElementsByType: (type: string) => BoardElement[];
  getElementsByLayer: (layerId: string) => BoardElement[];
  getElementsByGroup: (groupId: string) => BoardElement[];
  getVisibleElements: () => BoardElement[];
  
  // Internal
  _pushHistory: (ops: BoardOp[]) => void;
  _applyOps: (ops: BoardOp[]) => void;
}

// ============= Default Values =============

const defaultMetadata: BoardMetadata = {
  id: nanoid(),
  title: 'لوحة جديدة',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  isPublic: false
};

const defaultSettings: BoardSettings = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridEnabled: true,
  gridSize: 20,
  gridType: 'grid',
  snapToGrid: false,
  snapToEdges: true,
  snapToCenter: true,
  snapToDistribution: false,
  background: '#FFFFFF',
  theme: 'light'
};

const defaultLayer: BoardLayer = {
  id: 'default',
  name: 'الطبقة الافتراضية',
  visible: true,
  locked: false,
  elements: [],
  order: 0
};

// ============= Board Store =============

export const useBoardStore = create<BoardState>((set, get) => ({
  // Initial State
  metadata: { ...defaultMetadata },
  elements: [],
  links: [],
  layers: [{ ...defaultLayer }],
  settings: { ...defaultSettings },
  history: {
    past: [],
    future: []
  },

  // ============= Element Operations =============

  addElement: (elementData) => {
    const { op, element } = createAddElementOp({
      ...elementData,
      layerId: elementData.layerId || get().layers[0]?.id || 'default',
      zIndex: elementData.zIndex ?? get().elements.length
    });

    set(state => {
      const updatedLayers = state.layers.map(layer =>
        layer.id === element.layerId
          ? { ...layer, elements: [...layer.elements, element.id] }
          : layer
      );

      return {
        elements: [...state.elements, element],
        layers: updatedLayers
      };
    });

    get()._pushHistory([op]);
    emitOpEvent(op);
    
    return element.id;
  },

  updateElement: (elementId, updates) => {
    const element = get().getElementById(elementId);
    if (!element) return;

    const op = createUpdateElementOp(elementId, updates, element);

    set(state => ({
      elements: applyOp(state.elements, op)
    }));

    get()._pushHistory([op]);
    emitOpEvent(op);
  },

  deleteElement: (elementId) => {
    const element = get().getElementById(elementId);
    if (!element) return;

    const op = createDeleteElementOp(elementId, element);

    set(state => {
      // إزالة من الطبقة
      const updatedLayers = state.layers.map(layer => ({
        ...layer,
        elements: layer.elements.filter(id => id !== elementId)
      }));

      // حذف الروابط المتصلة
      const updatedLinks = state.links.filter(
        link => link.fromElementId !== elementId && link.toElementId !== elementId
      );

      return {
        elements: state.elements.filter(el => el.id !== elementId),
        layers: updatedLayers,
        links: updatedLinks
      };
    });

    get()._pushHistory([op]);
    emitOpEvent(op);
  },

  deleteElements: (elementIds) => {
    const elements = elementIds
      .map(id => get().getElementById(id))
      .filter((el): el is BoardElement => el !== undefined);

    if (elements.length === 0) return;

    const batch = createDeleteElementsBatchOp(elements);

    set(state => {
      const idsSet = new Set(elementIds);
      
      const updatedLayers = state.layers.map(layer => ({
        ...layer,
        elements: layer.elements.filter(id => !idsSet.has(id))
      }));

      const updatedLinks = state.links.filter(
        link => !idsSet.has(link.fromElementId) && !idsSet.has(link.toElementId)
      );

      return {
        elements: state.elements.filter(el => !idsSet.has(el.id)),
        layers: updatedLayers,
        links: updatedLinks
      };
    });

    get()._pushHistory(batch.ops);
  },

  duplicateElement: (elementId) => {
    const element = get().getElementById(elementId);
    if (!element) return null;

    const newElement: Omit<BoardElement, 'id'> = {
      ...element,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      },
      metadata: {
        ...element.metadata,
        createdAt: new Date().toISOString()
      }
    };

    return get().addElement(newElement);
  },

  duplicateElements: (elementIds) => {
    return elementIds
      .map(id => get().duplicateElement(id))
      .filter((id): id is string => id !== null);
  },

  // ============= Position & Size Operations =============

  moveElement: (elementId, position) => {
    const element = get().getElementById(elementId);
    if (!element || element.locked) return;

    const op = createMoveElementOp(elementId, position, element.position);

    set(state => ({
      elements: applyOp(state.elements, op)
    }));

    get()._pushHistory([op]);
    emitOpEvent(op);
  },

  moveElements: (elementIds, deltaX, deltaY) => {
    const elements = elementIds
      .map(id => get().getElementById(id))
      .filter((el): el is BoardElement => el !== undefined && !el.locked);

    if (elements.length === 0) return;

    const batch = createMoveElementsBatchOp(elements, deltaX, deltaY);

    set(state => ({
      elements: applyOpBatch(state.elements, batch)
    }));

    get()._pushHistory(batch.ops);
  },

  resizeElement: (elementId, size, position) => {
    const element = get().getElementById(elementId);
    if (!element || element.locked) return;

    const op = createResizeElementOp(
      elementId,
      size,
      position,
      element.size,
      element.position
    );

    set(state => ({
      elements: applyOp(state.elements, op)
    }));

    get()._pushHistory([op]);
    emitOpEvent(op);
  },

  rotateElement: (elementId, rotation) => {
    const element = get().getElementById(elementId);
    if (!element || element.locked) return;

    get().updateElement(elementId, { rotation });
  },

  // ============= Style Operations =============

  updateElementStyle: (elementId, style) => {
    const element = get().getElementById(elementId);
    if (!element) return;

    get().updateElement(elementId, {
      style: { ...element.style, ...style }
    });
  },

  updateElementsStyle: (elementIds, style) => {
    const elements = elementIds
      .map(id => get().getElementById(id))
      .filter((el): el is BoardElement => el !== undefined);

    if (elements.length === 0) return;

    const batch = createStyleElementsBatchOp(elements, style);

    set(state => ({
      elements: applyOpBatch(state.elements, batch)
    }));

    get()._pushHistory(batch.ops);
  },

  // ============= Group Operations =============

  groupElements: (elementIds) => {
    const groupId = nanoid();
    const batch = createGroupElementsOp(elementIds, groupId);

    set(state => ({
      elements: applyOpBatch(state.elements, batch)
    }));

    get()._pushHistory(batch.ops);
    return groupId;
  },

  ungroupElements: (groupId) => {
    const elements = get().getGroupElements(groupId);
    const elementIds = elements.map(el => el.id);
    const batch = createUngroupElementsOp(elementIds, groupId);

    set(state => ({
      elements: applyOpBatch(state.elements, batch)
    }));

    get()._pushHistory(batch.ops);
  },

  getGroupElements: (groupId) => {
    return get().elements.filter(el => el.metadata?.groupId === groupId);
  },

  // ============= Lock Operations =============

  lockElement: (elementId) => {
    get().updateElement(elementId, { locked: true });
  },

  unlockElement: (elementId) => {
    get().updateElement(elementId, { locked: false });
  },

  lockElements: (elementIds) => {
    elementIds.forEach(id => get().lockElement(id));
  },

  unlockElements: (elementIds) => {
    elementIds.forEach(id => get().unlockElement(id));
  },

  // ============= Layer Operations =============

  addLayer: (name) => {
    const id = nanoid();
    const newLayer: BoardLayer = {
      id,
      name,
      visible: true,
      locked: false,
      elements: [],
      order: get().layers.length
    };

    set(state => ({
      layers: [...state.layers, newLayer]
    }));

    return id;
  },

  updateLayer: (layerId, updates) => {
    set(state => ({
      layers: state.layers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    }));
  },

  deleteLayer: (layerId) => {
    const layer = get().layers.find(l => l.id === layerId);
    if (!layer) return;

    // حذف جميع عناصر الطبقة
    get().deleteElements(layer.elements);

    set(state => ({
      layers: state.layers.filter(l => l.id !== layerId)
    }));
  },

  reorderLayers: (layerIds) => {
    set(state => ({
      layers: layerIds
        .map((id, index) => {
          const layer = state.layers.find(l => l.id === id);
          return layer ? { ...layer, order: index } : null;
        })
        .filter((l): l is BoardLayer => l !== null)
    }));
  },

  moveElementToLayer: (elementId, layerId) => {
    const element = get().getElementById(elementId);
    if (!element) return;

    set(state => ({
      layers: state.layers.map(layer => {
        if (layer.id === element.layerId) {
          return { ...layer, elements: layer.elements.filter(id => id !== elementId) };
        }
        if (layer.id === layerId) {
          return { ...layer, elements: [...layer.elements, elementId] };
        }
        return layer;
      }),
      elements: state.elements.map(el =>
        el.id === elementId ? { ...el, layerId } : el
      )
    }));
  },

  // ============= Link Operations =============

  addLink: (linkData) => {
    const id = nanoid();
    const newLink: BoardLink = { ...linkData, id };

    set(state => ({
      links: [...state.links, newLink]
    }));

    return id;
  },

  updateLink: (linkId, updates) => {
    set(state => ({
      links: state.links.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    }));
  },

  deleteLink: (linkId) => {
    set(state => ({
      links: state.links.filter(link => link.id !== linkId)
    }));
  },

  getElementLinks: (elementId) => {
    return get().links.filter(
      link => link.fromElementId === elementId || link.toElementId === elementId
    );
  },

  // ============= Settings Operations =============

  updateSettings: (settings) => {
    set(state => ({
      settings: { ...state.settings, ...settings }
    }));
  },

  // ============= Metadata Operations =============

  updateMetadata: (metadata) => {
    set(state => ({
      metadata: {
        ...state.metadata,
        ...metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  },

  // ============= History Operations =============

  undo: () => {
    const { past } = get().history;
    if (past.length === 0) return;

    const lastBatch = past[past.length - 1];
    const reversedOps = lastBatch.ops
      .map(op => reverseOp(op))
      .filter((op): op is BoardOp => op !== null)
      .reverse();

    set(state => ({
      elements: reversedOps.reduce((acc, op) => applyOp(acc, op), state.elements),
      history: {
        past: state.history.past.slice(0, -1),
        future: [lastBatch, ...state.history.future]
      }
    }));
  },

  redo: () => {
    const { future } = get().history;
    if (future.length === 0) return;

    const nextBatch = future[0];

    set(state => ({
      elements: applyOpBatch(state.elements, nextBatch),
      history: {
        past: [...state.history.past, nextBatch],
        future: state.history.future.slice(1)
      }
    }));
  },

  canUndo: () => get().history.past.length > 0,

  canRedo: () => get().history.future.length > 0,

  clearHistory: () => {
    set({
      history: { past: [], future: [] }
    });
  },

  // ============= Board Operations =============

  loadBoard: (board) => {
    set({
      metadata: board.metadata,
      elements: board.elements,
      links: board.links,
      layers: board.layers,
      settings: board.settings,
      history: { past: [], future: [] }
    });
  },

  exportBoard: () => ({
    metadata: get().metadata,
    elements: get().elements,
    links: get().links,
    layers: get().layers,
    settings: get().settings
  }),

  resetBoard: () => {
    set({
      metadata: { ...defaultMetadata, id: nanoid() },
      elements: [],
      links: [],
      layers: [{ ...defaultLayer }],
      settings: { ...defaultSettings },
      history: { past: [], future: [] }
    });
  },

  // ============= Element Getters =============

  getElementById: (elementId) => {
    return get().elements.find(el => el.id === elementId);
  },

  getElementsByType: (type) => {
    return get().elements.filter(el => el.type === type);
  },

  getElementsByLayer: (layerId) => {
    return get().elements.filter(el => el.layerId === layerId);
  },

  getElementsByGroup: (groupId) => {
    return get().getGroupElements(groupId);
  },

  getVisibleElements: () => {
    const visibleLayerIds = new Set(
      get().layers.filter(l => l.visible).map(l => l.id)
    );
    return get().elements.filter(
      el => el.visible !== false && visibleLayerIds.has(el.layerId || 'default')
    );
  },

  // ============= Internal =============

  _pushHistory: (ops) => {
    if (ops.length === 0) return;

    const batch = createOpBatch(ops);

    set(state => ({
      history: {
        past: [...state.history.past.slice(-50), batch], // Keep last 50 batches
        future: []
      }
    }));
  },

  _applyOps: (ops) => {
    set(state => ({
      elements: ops.reduce((acc, op) => applyOp(acc, op), state.elements)
    }));
  }
}));
