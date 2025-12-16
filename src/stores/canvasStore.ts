import { create } from 'zustand';
import { nanoid } from 'nanoid';

// Types
export type ToolId = 
  | 'selection_tool'
  | 'text_tool'
  | 'shapes_tool'
  | 'smart_pen'
  | 'frame_tool'
  | 'file_uploader'
  | 'smart_element_tool';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  textColor?: string;
  textAlign?: string;
  textDecoration?: string;
  direction?: string;
  alignItems?: string;
  opacity?: number;
  radius?: number;
  zIndex?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export type ShapeType = 'rect' | 'circle' | 'triangle' | 'arrow' | string;
export type LineStyle = 'solid' | 'dashed' | 'dotted';

export interface CanvasElement {
  id: string;
  type: string;
  position: Position;
  size: Size;
  rotation?: number;
  locked?: boolean;
  visible?: boolean;
  layerId?: string;
  style?: ElementStyle;
  name?: string;
  text?: string;
  content?: string;
  src?: string;
  shapeType?: string;
  smartType?: string;
  data?: any;
  children?: string[];
  arrowData?: any;
  metadata?: any;
  hidden?: boolean;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  order: number;
}

export interface Viewport {
  zoom: number;
  pan: Position;
}

export interface ToolSettings {
  shapes?: {
    shapeType?: string;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    opacity?: number;
    iconName?: string;
  };
  pen?: {
    color?: string;
    size?: number;
    eraserMode?: boolean;
    smartMode?: boolean;
  };
  frame?: {
    backgroundColor?: string;
    title?: string;
    strokeWidth?: number;
    strokeColor?: string;
  };
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface PenStroke {
  id: string;
  points: StrokePoint[];
  color: string;
  size: number;
  width?: number;
  style?: LineStyle;
}

interface CanvasState {
  // Elements
  elements: CanvasElement[];
  selectedElementIds: string[];
  tempElement: CanvasElement | null;
  
  // Viewport
  viewport: Viewport;
  
  // Tools
  activeTool: ToolId;
  toolSettings: ToolSettings;
  
  // Layers
  layers: Layer[];
  activeLayerId: string;
  
  // UI State
  showMinimap: boolean;
  isPanMode: boolean;
  isFullscreen: boolean;
  isDrawing: boolean;
  drawStartPoint: Position | null;
  typingMode: boolean;
  isInternalDrag: boolean;
  
  // Pen/Drawing
  strokes: PenStroke[];
  pendingStroke: PenStroke | null;
  
  // History
  history: { past: CanvasElement[][]; future: CanvasElement[][] };
  
  // Clipboard
  clipboard: CanvasElement[];
  
  // Smart Elements
  selectedSmartElement: string | null;
}

interface CanvasActions {
  // Element Actions
  addElement: (element: Partial<CanvasElement>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  deleteElements: (ids: string[]) => void;
  duplicateElement: (id: string) => void;
  moveElements: (ids: string[], delta: Position) => void;
  resizeElements: (ids: string[], newSize: Size, anchor?: string) => void;
  resizeFrame: (id: string, newSize: Size) => void;
  
  // Selection
  selectElement: (id: string, multi?: boolean) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Viewport
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  setZoomPercentage: (percentage: number) => void;
  
  // Tools
  setActiveTool: (tool: ToolId) => void;
  setToolSettings: (settings: Partial<ToolSettings>) => void;
  
  // Layers
  addLayer: (name: string) => void;
  deleteLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  setActiveLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  
  // UI Toggles
  toggleMinimap: () => void;
  togglePanMode: () => void;
  toggleFullscreen: () => void;
  setIsDrawing: (value: boolean) => void;
  setDrawStartPoint: (point: Position | null) => void;
  setTempElement: (element: CanvasElement | null) => void;
  startTyping: () => void;
  stopTyping: () => void;
  setInternalDrag: (value: boolean) => void;
  
  // Frame Actions
  assignElementsToFrame: (frameId: string, elementIds: string[]) => void;
  addChildToFrame: (frameId: string, childId: string) => void;
  removeChildFromFrame: (frameId: string, childId: string) => void;
  
  // Pen/Stroke Actions
  beginStroke: (point: StrokePoint, color: string, size: number) => void;
  appendPoint: (point: StrokePoint) => void;
  endStroke: () => void;
  clearPendingStrokes: () => void;
  removeStroke: (id: string) => void;
  eraseStrokeAtPoint: (x: number, y: number, radius: number) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  
  // Clipboard
  copyElements: (ids: string[]) => void;
  pasteElements: () => void;
  
  // Alignment
  alignElements: (ids: string[], alignment: string) => void;
  groupElements: (ids: string[]) => void;
  
  // Smart Elements
  setSelectedSmartElement: (type: string | null) => void;
}

const DEFAULT_LAYER: Layer = {
  id: 'default',
  name: 'الطبقة الرئيسية',
  visible: true,
  locked: false,
  order: 0,
};

export const useCanvasStore = create<CanvasState & CanvasActions>((set, get) => ({
  // Initial State
  elements: [],
  selectedElementIds: [],
  tempElement: null,
  viewport: { zoom: 1, pan: { x: 0, y: 0 } },
  activeTool: 'selection_tool',
  toolSettings: {},
  layers: [DEFAULT_LAYER],
  activeLayerId: 'default',
  showMinimap: false,
  isPanMode: false,
  isFullscreen: false,
  isDrawing: false,
  drawStartPoint: null,
  typingMode: false,
  isInternalDrag: false,
  strokes: [],
  pendingStroke: null,
  history: { past: [], future: [] },
  clipboard: [],
  selectedSmartElement: null,

  // Element Actions
  addElement: (element) => {
    const newElement: CanvasElement = {
      id: element.id || nanoid(),
      type: element.type || 'rect',
      position: element.position || { x: 0, y: 0 },
      size: element.size || { width: 100, height: 100 },
      visible: true,
      layerId: element.layerId || get().activeLayerId,
      ...element,
    };
    get().pushHistory();
    set((state) => ({ elements: [...state.elements, newElement] }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  },

  deleteElement: (id) => {
    get().pushHistory();
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementIds: state.selectedElementIds.filter((i) => i !== id),
    }));
  },

  deleteElements: (ids) => {
    get().pushHistory();
    set((state) => ({
      elements: state.elements.filter((el) => !ids.includes(el.id)),
      selectedElementIds: state.selectedElementIds.filter((i) => !ids.includes(i)),
    }));
  },

  duplicateElement: (id) => {
    const element = get().elements.find((el) => el.id === id);
    if (!element) return;
    get().pushHistory();
    const newElement: CanvasElement = {
      ...element,
      id: nanoid(),
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
    };
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedElementIds: [newElement.id],
    }));
  },

  moveElements: (ids, delta) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        ids.includes(el.id) && !el.locked
          ? {
              ...el,
              position: {
                x: el.position.x + delta.x,
                y: el.position.y + delta.y,
              },
            }
          : el
      ),
    }));
  },

  resizeElements: (ids, newSize) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        ids.includes(el.id) ? { ...el, size: newSize } : el
      ),
    }));
  },

  resizeFrame: (id, newSize) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, size: newSize } : el
      ),
    }));
  },

  // Selection
  selectElement: (id, multi = false) => {
    set((state) => ({
      selectedElementIds: multi
        ? state.selectedElementIds.includes(id)
          ? state.selectedElementIds.filter((i) => i !== id)
          : [...state.selectedElementIds, id]
        : [id],
    }));
  },

  selectElements: (ids) => set({ selectedElementIds: ids }),
  clearSelection: () => set({ selectedElementIds: [] }),

  // Viewport
  setZoom: (zoom) =>
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.max(0.1, Math.min(5, zoom)) },
    })),

  setPan: (x, y) =>
    set((state) => ({
      viewport: { ...state.viewport, pan: { x, y } },
    })),

  zoomIn: () =>
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.min(5, state.viewport.zoom * 1.2) },
    })),

  zoomOut: () =>
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.max(0.1, state.viewport.zoom / 1.2) },
    })),

  zoomToFit: () => {
    const { elements, viewport } = get();
    if (elements.length === 0) return;
    // Simple zoom to fit implementation
    set({ viewport: { ...viewport, zoom: 1, pan: { x: 0, y: 0 } } });
  },

  setZoomPercentage: (percentage) =>
    set((state) => ({
      viewport: { ...state.viewport, zoom: percentage / 100 },
    })),

  // Tools
  setActiveTool: (tool) => set({ activeTool: tool }),
  setToolSettings: (settings) =>
    set((state) => ({
      toolSettings: { ...state.toolSettings, ...settings },
    })),

  // Layers
  addLayer: (name) => {
    const newLayer: Layer = {
      id: nanoid(),
      name,
      visible: true,
      locked: false,
      order: get().layers.length,
    };
    set((state) => ({ layers: [...state.layers, newLayer] }));
  },

  deleteLayer: (id) => {
    if (id === 'default') return;
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      elements: state.elements.filter((el) => el.layerId !== id),
    }));
  },

  toggleLayerVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } : l
      ),
    })),

  toggleLayerLock: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, locked: !l.locked } : l
      ),
    })),

  setActiveLayer: (id) => set({ activeLayerId: id }),

  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),

  // UI Toggles
  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
  togglePanMode: () => set((state) => ({ isPanMode: !state.isPanMode })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setIsDrawing: (value) => set({ isDrawing: value }),
  setDrawStartPoint: (point) => set({ drawStartPoint: point }),
  setTempElement: (element) => set({ tempElement: element }),
  startTyping: () => set({ typingMode: true }),
  stopTyping: () => set({ typingMode: false }),
  setInternalDrag: (value) => set({ isInternalDrag: value }),

  // Frame Actions
  assignElementsToFrame: (frameId, elementIds) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === frameId
          ? { ...el, children: [...(el.children || []), ...elementIds] }
          : el
      ),
    }));
  },

  addChildToFrame: (frameId, childId) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === frameId
          ? { ...el, children: [...(el.children || []), childId] }
          : el
      ),
    }));
  },

  removeChildFromFrame: (frameId, childId) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === frameId
          ? { ...el, children: (el.children || []).filter((c) => c !== childId) }
          : el
      ),
    }));
  },

  // Pen/Stroke Actions
  beginStroke: (point, color, size) => {
    set({
      pendingStroke: {
        id: nanoid(),
        points: [point],
        color,
        size,
      },
    });
  },

  appendPoint: (point) => {
    set((state) => ({
      pendingStroke: state.pendingStroke
        ? { ...state.pendingStroke, points: [...state.pendingStroke.points, point] }
        : null,
    }));
  },

  endStroke: () => {
    const { pendingStroke } = get();
    if (pendingStroke && pendingStroke.points.length > 1) {
      set((state) => ({
        strokes: [...state.strokes, pendingStroke],
        pendingStroke: null,
      }));
    } else {
      set({ pendingStroke: null });
    }
  },

  clearPendingStrokes: () => set({ strokes: [], pendingStroke: null }),

  removeStroke: (id) =>
    set((state) => ({
      strokes: state.strokes.filter((s) => s.id !== id),
    })),

  eraseStrokeAtPoint: (x, y, radius) => {
    set((state) => ({
      strokes: state.strokes.filter((stroke) => {
        return !stroke.points.some((p) => {
          const dx = p.x - x;
          const dy = p.y - y;
          return Math.sqrt(dx * dx + dy * dy) <= radius;
        });
      }),
    }));
  },

  // History
  undo: () => {
    const { history, elements } = get();
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    set({
      elements: previous,
      history: {
        past: history.past.slice(0, -1),
        future: [elements, ...history.future],
      },
    });
  },

  redo: () => {
    const { history, elements } = get();
    if (history.future.length === 0) return;
    const next = history.future[0];
    set({
      elements: next,
      history: {
        past: [...history.past, elements],
        future: history.future.slice(1),
      },
    });
  },

  pushHistory: () => {
    set((state) => ({
      history: {
        past: [...state.history.past.slice(-50), state.elements],
        future: [],
      },
    }));
  },

  // Clipboard
  copyElements: (ids) => {
    const elements = get().elements.filter((el) => ids.includes(el.id));
    set({ clipboard: elements });
  },

  pasteElements: () => {
    const { clipboard } = get();
    if (clipboard.length === 0) return;
    get().pushHistory();
    const newElements = clipboard.map((el) => ({
      ...el,
      id: nanoid(),
      position: { x: el.position.x + 20, y: el.position.y + 20 },
    }));
    set((state) => ({
      elements: [...state.elements, ...newElements],
      selectedElementIds: newElements.map((el) => el.id),
    }));
  },

  // Alignment
  alignElements: (ids, alignment) => {
    const elements = get().elements.filter((el) => ids.includes(el.id));
    if (elements.length < 2) return;

    const minX = Math.min(...elements.map((e) => e.position.x));
    const maxX = Math.max(...elements.map((e) => e.position.x + e.size.width));
    const minY = Math.min(...elements.map((e) => e.position.y));

    set((state) => ({
      elements: state.elements.map((el) => {
        if (!ids.includes(el.id)) return el;
        switch (alignment) {
          case 'left':
            return { ...el, position: { ...el.position, x: minX } };
          case 'right':
            return { ...el, position: { ...el.position, x: maxX - el.size.width } };
          case 'top':
            return { ...el, position: { ...el.position, y: minY } };
          default:
            return el;
        }
      }),
    }));
  },

  groupElements: (ids) => {
    const groupId = nanoid();
    set((state) => ({
      elements: state.elements.map((el) =>
        ids.includes(el.id)
          ? { ...el, metadata: { ...el.metadata, groupId } }
          : el
      ),
    }));
  },

  // Smart Elements
  setSelectedSmartElement: (type) => set({ selectedSmartElement: type }),
}));

// Legacy exports for compatibility
export const canvasStore = {
  getState: useCanvasStore.getState,
  setState: useCanvasStore.setState,
  subscribe: useCanvasStore.subscribe,
  actions: {
    setCamera: (patch: any) => {
      const state = useCanvasStore.getState();
      if (typeof patch === 'function') {
        const { zoom, pan } = patch({ x: state.viewport.pan.x, y: state.viewport.pan.y, zoom: state.viewport.zoom });
        if (zoom !== undefined) state.setZoom(zoom);
        if (pan) state.setPan(pan.x, pan.y);
      } else {
        if (patch.zoom !== undefined) state.setZoom(patch.zoom);
        if (patch.x !== undefined || patch.y !== undefined) {
          state.setPan(patch.x ?? state.viewport.pan.x, patch.y ?? state.viewport.pan.y);
        }
      }
    },
    setSelection: (ids: string[], primaryId?: string) => useCanvasStore.getState().selectElements(ids),
    clearSelection: () => useCanvasStore.getState().clearSelection(),
    addElement: (el: CanvasElement) => useCanvasStore.getState().addElement(el),
    updateElement: (id: string, patch: Partial<CanvasElement>) => useCanvasStore.getState().updateElement(id, patch),
    removeElement: (id: string) => useCanvasStore.getState().deleteElement(id),
  },
};

// Helper function for adding new elements
export function addNewElement(type: string, partial?: Partial<CanvasElement>) {
  const store = useCanvasStore.getState();
  const el: Partial<CanvasElement> = {
    id: nanoid(),
    type,
    position: partial?.position || { x: 100, y: 100 },
    size: partial?.size || { width: 200, height: 150 },
    ...partial,
  };
  store.addElement(el);
  store.selectElement(el.id!);
  return el;
}
