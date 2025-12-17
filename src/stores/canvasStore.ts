import { create } from "zustand";

export type ToolId =
  | "selection_tool"
  | "text_tool"
  | "shapes_tool"
  | "frame_tool"
  | "file_uploader"
  | "smart_pen"
  | "smart_element_tool"
  | "root_connector_tool";

export type ShapeType =
  | "rectangle"
  | "rounded_rectangle"
  | "circle"
  | "triangle"
  | "diamond"
  | "line"
  | "arrow"
  | "double_arrow";

export type PenStrokeStyle = "solid" | "dashed" | "dotted";

export type CanvasElementType = "text" | "shape" | "image" | "file" | "frame" | "smart" | "pen_path" | "sticky";

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  position: CanvasPoint;
  size: CanvasSize;

  // Optional common props
  style?: Record<string, any>;
  data?: Record<string, any>;
  content?: string;

  // Shape
  shapeType?: ShapeType;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;

  // Image
  src?: string;
  alt?: string;

  // File
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;

  // Frame
  children?: string[];
  title?: string;
  frameStyle?: "rectangle" | "rounded" | "circle";

  // Layering
  layerId?: string;
  visible?: boolean;
  locked?: boolean;

  // Any metadata
  metadata?: Record<string, any>;
}

export interface PenSettings {
  strokeWidth: number;
  color: string;
  style: PenStrokeStyle;
  smartMode: boolean;
  eraserMode: boolean;
}

export interface PenPoint extends CanvasPoint {
  pressure?: number;
}

export interface PenStroke {
  id: string;
  points: PenPoint[];
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: PenStrokeStyle;
  createdAt: number;
}

export interface LayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

export type GridType = "dots" | "grid" | "isometric" | "hex";

export interface CanvasSettings {
  zoom: number;
  pan: CanvasPoint;
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: GridType;
  background: string;
}

export interface ToolSettings {
  shapes: {
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
    shapeType: ShapeType;
    iconName?: string;
    stickyText?: string;
  };
  text: {
    fontSize: number;
    fontFamily: string;
    color: string;
    alignment: "left" | "center" | "right";
    fontWeight: string;
    direction: "rtl" | "ltr";
    verticalAlign: "top" | "middle" | "bottom";
  };
  pen: PenSettings;
  frame: {
    strokeWidth: number;
    strokeColor: string;
    title: string;
  };
}

type HistoryState = {
  past: CanvasElement[][];
  future: CanvasElement[][];
};

type DragPreview = {
  active: boolean;
  elementIds: string[];
  startPointerWorld: CanvasPoint;
  startPositions: Record<string, CanvasPoint>;
  currentDelta: CanvasPoint;
};

interface CanvasState {
  // Elements
  elements: CanvasElement[];
  selectedElementIds: string[];
  clipboard: CanvasElement[];

  // Tool System
  activeTool: ToolId;
  toolSettings: ToolSettings;
  isDrawing: boolean;
  drawStartPoint: CanvasPoint | null;
  tempElement: CanvasElement | null;
  selectedSmartElement: string | null;

  // Text Editing State
  editingTextId: string | null;
  typingMode: boolean;

  // Internal Drag
  isInternalDrag: boolean;

  // Strokes
  strokes: Record<string, PenStroke>;
  currentStrokeId?: string;

  // Layers
  layers: LayerInfo[];
  activeLayerId: string | null;

  // Viewport & Settings (source of truth)
  viewport: { zoom: number; pan: CanvasPoint };
  settings: CanvasSettings;

  // View Modes
  isPanMode: boolean;
  isFullscreen: boolean;
  showMinimap: boolean;

  // History
  history: HistoryState;

  // Perf: Drag preview (PointerEvents + rAF friendly)
  dragPreview: DragPreview;

  // === Actions
  // Element CRUD
  addElement: (element: Omit<CanvasElement, "id">) => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  deleteElements: (elementIds: string[]) => void;
  duplicateElement: (elementId: string) => void;

  // Selection
  selectElement: (elementId: string, multiSelect?: boolean) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;

  // Tool
  setActiveTool: (tool: ToolId) => void;
  setSelectedSmartElement: (id: string | null) => void;

  // Viewport
  setViewport: (partial: Partial<{ zoom: number; pan: CanvasPoint }>) => void;
  panCanvas: (dx: number, dy: number) => void;
  zoomCanvas: (nextZoom: number, anchorScreen?: { x: number; y: number }, containerRect?: DOMRect) => void;

  // Settings
  updateSettings: (partial: Partial<CanvasSettings>) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;

  // History
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;

  // Text helpers (existing API)
  addText: (textData: Partial<any>) => string;
  updateTextContent: (elementId: string, content: string) => void;
  updateTextStyle: (elementId: string, style: Partial<Record<string, any>>) => void;
  startEditingText: (elementId: string) => void;
  stopEditingText: (elementId?: string) => void;
  startTyping: () => void;
  stopTyping: () => void;

  // Internal Drag
  setInternalDrag: (value: boolean) => void;

  // Pen Actions
  setPenSettings: (partial: Partial<PenSettings>) => void;
  toggleSmartMode: () => void;
  beginStroke: (x: number, y: number, pressure?: number) => string;
  appendPoint: (x: number, y: number, pressure?: number) => void;
  endStroke: () => void;
  clearPendingStroke: () => void;
  clearAllStrokes: () => void;
  removeStroke: (strokeId: string) => void;
  eraseStrokeAtPoint: (x: number, y: number, radius?: number) => boolean;

  // Frame (kept for compatibility)
  addChildToFrame: (frameId: string, childId: string) => void;
  removeChildFromFrame: (frameId: string, childId: string) => void;
  getFrameChildren: (frameId: string) => CanvasElement[];
  assignElementsToFrame: (frameId: string) => void;
  moveFrame: (frameId: string, dx: number, dy: number) => void;
  resizeFrame: (frameId: string, newBounds: { x: number; y: number; width: number; height: number }) => void;
  ungroupFrame: (frameId: string) => void;
  updateFrameTitle: (frameId: string, newTitle: string) => void;

  // Advanced ops (safe no-ops until wired)
  copyElements: (elementIds: string[]) => void;
  pasteElements: () => void;
  cutElements: (elementIds: string[]) => void;
  groupElements: (elementIds: string[]) => void;
  ungroupElements: (groupId: string) => void;
  alignElements: (elementIds: string[], alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => void;
  lockElements: (elementIds: string[]) => void;
  unlockElements: (elementIds: string[]) => void;
  moveElements: (elementIds: string[], deltaX: number, deltaY: number) => void;
  resizeElements: (elementIds: string[], scaleX: number, scaleY: number, origin: { x: number; y: number }) => void;
  rotateElements: (elementIds: string[], angle: number, origin: { x: number; y: number }) => void;
  flipHorizontally: (elementIds: string[]) => void;
  flipVertically: (elementIds: string[]) => void;

  // Drag preview (Pointer Events path)
  beginDragPreview: (elementIds: string[], startPointerWorld: CanvasPoint) => void;
  updateDragPreviewDelta: (delta: CanvasPoint) => void;
  commitDragPreview: () => void;
  clearDragPreview: () => void;
}

function uid(prefix = "el") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function dist(a: CanvasPoint, b: CanvasPoint) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial State
  elements: [],
  selectedElementIds: [],
  clipboard: [],

  activeTool: "selection_tool",
  toolSettings: {
    shapes: {
      fillColor: "#f28e2a",
      strokeColor: "transparent",
      strokeWidth: 1,
      opacity: 1,
      shapeType: "rectangle",
    },
    text: {
      fontSize: 16,
      fontFamily: "IBM Plex Sans Arabic",
      color: "#111827",
      alignment: "right",
      fontWeight: "normal",
      direction: "rtl",
      verticalAlign: "top",
    },
    pen: {
      strokeWidth: 2,
      color: "#111111",
      style: "solid",
      smartMode: false,
      eraserMode: false,
    },
    frame: {
      strokeWidth: 2,
      strokeColor: "#0B0F12",
      title: "",
    },
  },
  isDrawing: false,
  drawStartPoint: null,
  tempElement: null,
  selectedSmartElement: null,

  editingTextId: null,
  typingMode: false,

  isInternalDrag: false,

  strokes: {},
  currentStrokeId: undefined,

  layers: [
    {
      id: "default",
      name: "الطبقة الافتراضية",
      visible: true,
      locked: false,
      elements: [],
    },
  ],
  activeLayerId: "default",

  viewport: { zoom: 1, pan: { x: 0, y: 0 } },
  settings: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    gridEnabled: true,
    snapToGrid: false,
    gridSize: 20,
    gridType: "dots",
    background: "#FFFFFF",
  },

  isPanMode: false,
  isFullscreen: false,
  showMinimap: true,

  history: { past: [], future: [] },

  dragPreview: {
    active: false,
    elementIds: [],
    startPointerWorld: { x: 0, y: 0 },
    startPositions: {},
    currentDelta: { x: 0, y: 0 },
  },

  // === Actions
  addElement: (element) => {
    const id = uid("el");
    const newEl: CanvasElement = {
      id,
      ...element,
      visible: element.visible ?? true,
      locked: element.locked ?? false,
      layerId: element.layerId ?? get().activeLayerId ?? "default",
      data: element.data ?? {},
      style: element.style ?? {},
    };

    set((state) => {
      const layers = state.layers.map((l) =>
        l.id === newEl.layerId ? { ...l, elements: [...l.elements, newEl.id] } : l,
      );
      return { elements: [...state.elements, newEl], layers };
    });

    get().pushHistory();
  },

  updateElement: (elementId, updates) => {
    set((state) => ({
      elements: state.elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)),
    }));
  },

  deleteElement: (elementId) => {
    set((state) => {
      const elements = state.elements.filter((e) => e.id !== elementId);
      const layers = state.layers.map((l) => ({ ...l, elements: l.elements.filter((id) => id !== elementId) }));
      const selectedElementIds = state.selectedElementIds.filter((id) => id !== elementId);
      return { elements, layers, selectedElementIds };
    });
    get().pushHistory();
  },

  deleteElements: (elementIds) => {
    const setIds = new Set(elementIds);
    set((state) => {
      const elements = state.elements.filter((e) => !setIds.has(e.id));
      const layers = state.layers.map((l) => ({ ...l, elements: l.elements.filter((id) => !setIds.has(id)) }));
      const selectedElementIds = state.selectedElementIds.filter((id) => !setIds.has(id));
      return { elements, layers, selectedElementIds };
    });
    get().pushHistory();
  },

  duplicateElement: (elementId) => {
    const el = get().elements.find((e) => e.id === elementId);
    if (!el) return;

    const id = uid("el");
    const copy: CanvasElement = {
      ...el,
      id,
      position: { x: el.position.x + 24, y: el.position.y + 24 },
    };

    set((state) => {
      const layers = state.layers.map((l) =>
        l.id === (copy.layerId ?? "default") ? { ...l, elements: [...l.elements, copy.id] } : l,
      );
      return { elements: [...state.elements, copy], layers, selectedElementIds: [copy.id] };
    });

    get().pushHistory();
  },

  selectElement: (elementId, multiSelect) => {
    set((state) => {
      if (!multiSelect) return { selectedElementIds: [elementId] };
      const exists = state.selectedElementIds.includes(elementId);
      return {
        selectedElementIds: exists
          ? state.selectedElementIds.filter((id) => id !== elementId)
          : [...state.selectedElementIds, elementId],
      };
    });
  },

  selectElements: (elementIds) => set({ selectedElementIds: elementIds }),

  clearSelection: () => set({ selectedElementIds: [] }),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setSelectedSmartElement: (id) => set({ selectedSmartElement: id }),

  setViewport: (partial) => {
    const next = {
      zoom: partial.zoom ?? get().viewport.zoom,
      pan: partial.pan ?? get().viewport.pan,
    };
    set({ viewport: next });
    set((s) => ({ settings: { ...s.settings, zoom: next.zoom, pan: next.pan } }));
  },

  panCanvas: (dx, dy) => {
    const v = get().viewport;
    const next = { ...v, pan: { x: v.pan.x + dx, y: v.pan.y + dy } };
    set({ viewport: next });
    set((s) => ({ settings: { ...s.settings, zoom: next.zoom, pan: next.pan } }));
  },

  zoomCanvas: (nextZoom, anchorScreen, containerRect) => {
    const v = get().viewport;
    const currentZoom = v.zoom;
    const z = clamp(nextZoom, 0.1, 6);

    if (!anchorScreen || !containerRect) {
      const next = { ...v, zoom: z };
      set({ viewport: next });
      set((s) => ({ settings: { ...s.settings, zoom: next.zoom, pan: next.pan } }));
      return;
    }

    // Zoom to cursor (screen anchor) with single transform root math
    const sx = anchorScreen.x - containerRect.left;
    const sy = anchorScreen.y - containerRect.top;

    const worldX = (sx - v.pan.x) / currentZoom;
    const worldY = (sy - v.pan.y) / currentZoom;

    const panX = sx - worldX * z;
    const panY = sy - worldY * z;

    const next = { zoom: z, pan: { x: panX, y: panY } };
    set({ viewport: next });
    set((s) => ({ settings: { ...s.settings, zoom: next.zoom, pan: next.pan } }));
  },

  updateSettings: (partial) => {
    set((state) => ({
      settings: { ...state.settings, ...partial },
      viewport: {
        zoom: partial.zoom ?? state.viewport.zoom,
        pan: partial.pan ?? state.viewport.pan,
      },
    }));
  },

  toggleGrid: () => set((s) => ({ settings: { ...s.settings, gridEnabled: !s.settings.gridEnabled } })),

  toggleSnapToGrid: () => set((s) => ({ settings: { ...s.settings, snapToGrid: !s.settings.snapToGrid } })),

  pushHistory: () => {
    const snapshot = get().elements.map((e) => ({ ...e }));
    set((state) => ({
      history: {
        past: [...state.history.past, snapshot].slice(-80),
        future: [],
      },
    }));
  },

  undo: () => {
    const { past, future } = get().history;
    if (past.length === 0) return;

    const current = get().elements.map((e) => ({ ...e }));
    const prev = past[past.length - 1];

    set((state) => ({
      elements: prev.map((e) => ({ ...e })),
      history: { past: state.history.past.slice(0, -1), future: [current, ...future].slice(0, 80) },
      selectedElementIds: [],
    }));
  },

  redo: () => {
    const { past, future } = get().history;
    if (future.length === 0) return;

    const current = get().elements.map((e) => ({ ...e }));
    const next = future[0];

    set((state) => ({
      elements: next.map((e) => ({ ...e })),
      history: { past: [...past, current].slice(-80), future: state.history.future.slice(1) },
      selectedElementIds: [],
    }));
  },

  resetHistory: () => set({ history: { past: [], future: [] } }),

  addText: (textData) => {
    const id = uid("text");

    const detectDirection = (text: string) => {
      const rtl = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
      const isRTL = rtl.test(text);
      return { direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" };
    };

    const detected = detectDirection(textData.content || "");

    const newText: CanvasElement = {
      id,
      type: "text",
      position: textData.position || { x: 100, y: 100 },
      size: textData.size || { width: 220, height: 56 },
      content: textData.content || "",
      style: {
        fontSize: textData.fontSize || get().toolSettings.text.fontSize || 16,
        color: textData.color || get().toolSettings.text.color,
        fontFamily: textData.fontFamily || get().toolSettings.text.fontFamily,
        fontWeight: textData.fontWeight || get().toolSettings.text.fontWeight,
        textAlign: textData.alignment || detected.textAlign,
        fontStyle: textData.fontStyle || "normal",
        textDecoration: textData.textDecoration || "none",
        direction: textData.direction || detected.direction,
        alignItems:
          get().toolSettings.text.verticalAlign === "top"
            ? "flex-start"
            : get().toolSettings.text.verticalAlign === "bottom"
              ? "flex-end"
              : "center",
        backgroundColor: textData.textType === "box" ? "#FFFFFF" : "transparent",
        unicodeBidi: "plaintext",
        whiteSpace: "pre-wrap",
      },
      data: {
        textType: textData.textType || "line",
        attachedTo: textData.attachedTo,
        relativePosition: textData.relativePosition,
      },
      layerId: get().activeLayerId || "default",
      visible: true,
      locked: false,
    };

    set((state) => {
      const layers = state.layers.map((l) =>
        l.id === newText.layerId ? { ...l, elements: [...l.elements, newText.id] } : l,
      );
      return { elements: [...state.elements, newText], layers };
    });

    get().pushHistory();
    return id;
  },

  updateTextContent: (elementId, content) => {
    set((state) => ({
      elements: state.elements.map((el) => (el.id === elementId ? { ...el, content } : el)),
    }));
  },

  updateTextStyle: (elementId, style) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === elementId ? { ...el, style: { ...(el.style || {}), ...style } } : el,
      ),
    }));
  },

  startEditingText: (elementId) => set({ editingTextId: elementId, typingMode: true }),

  stopEditingText: () => set({ editingTextId: null, typingMode: false }),

  startTyping: () => set({ typingMode: true }),

  stopTyping: () => set({ typingMode: false }),

  setInternalDrag: (value) => set({ isInternalDrag: value }),

  setPenSettings: (partial) =>
    set((s) => ({ toolSettings: { ...s.toolSettings, pen: { ...s.toolSettings.pen, ...partial } } })),

  toggleSmartMode: () =>
    set((s) => ({
      toolSettings: { ...s.toolSettings, pen: { ...s.toolSettings.pen, smartMode: !s.toolSettings.pen.smartMode } },
    })),

  beginStroke: (x, y, pressure) => {
    const id = uid("stroke");
    const pen = get().toolSettings.pen;

    const stroke: PenStroke = {
      id,
      points: [{ x, y, pressure }],
      strokeColor: pen.color,
      strokeWidth: pen.strokeWidth,
      strokeStyle: pen.style,
      createdAt: Date.now(),
    };

    set((s) => ({
      strokes: { ...s.strokes, [id]: stroke },
      currentStrokeId: id,
    }));

    return id;
  },

  appendPoint: (x, y, pressure) => {
    const id = get().currentStrokeId;
    if (!id) return;

    set((s) => {
      const stroke = s.strokes[id];
      if (!stroke) return s;

      const last = stroke.points[stroke.points.length - 1];
      // Downsample: skip very tiny moves to reduce re-renders
      if (last && dist(last, { x, y }) < 0.35) return s;

      return {
        strokes: {
          ...s.strokes,
          [id]: { ...stroke, points: [...stroke.points, { x, y, pressure }] },
        },
      };
    });
  },

  endStroke: () => {
    const id = get().currentStrokeId;
    if (!id) return;
    set({ currentStrokeId: undefined });
  },

  clearPendingStroke: () => {
    const id = get().currentStrokeId;
    if (!id) return;
    set((s) => {
      const { [id]: _, ...rest } = s.strokes;
      return { strokes: rest, currentStrokeId: undefined };
    });
  },

  clearAllStrokes: () => set({ strokes: {}, currentStrokeId: undefined }),

  removeStroke: (strokeId) =>
    set((s) => {
      const { [strokeId]: _, ...rest } = s.strokes;
      return { strokes: rest };
    }),

  eraseStrokeAtPoint: (x, y, radius = 10) => {
    const r2 = radius * radius;
    const strokes = get().strokes;
    const ids = Object.keys(strokes);

    for (const id of ids) {
      const st = strokes[id];
      for (const p of st.points) {
        const dx = p.x - x;
        const dy = p.y - y;
        if (dx * dx + dy * dy <= r2) {
          get().removeStroke(id);
          return true;
        }
      }
    }
    return false;
  },

  addChildToFrame: (frameId, childId) => {
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === frameId ? { ...el, children: Array.from(new Set([...(el.children || []), childId])) } : el,
      ),
    }));
  },

  removeChildFromFrame: (frameId, childId) => {
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === frameId ? { ...el, children: (el.children || []).filter((id) => id !== childId) } : el,
      ),
    }));
  },

  getFrameChildren: (frameId) => {
    const frame = get().elements.find((e) => e.id === frameId);
    if (!frame || frame.type !== "frame") return [];
    const ids = new Set(frame.children || []);
    return get().elements.filter((e) => ids.has(e.id));
  },

  assignElementsToFrame: (frameId) => {
    // placeholder (wire later with box hit test)
    void frameId;
  },

  moveFrame: (frameId, dx, dy) => {
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === frameId ? { ...el, position: { x: el.position.x + dx, y: el.position.y + dy } } : el,
      ),
    }));
  },

  resizeFrame: (frameId, newBounds) => {
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === frameId
          ? {
              ...el,
              position: { x: newBounds.x, y: newBounds.y },
              size: { width: newBounds.width, height: newBounds.height },
            }
          : el,
      ),
    }));
  },

  ungroupFrame: (frameId) => {
    set((s) => ({
      elements: s.elements.map((el) => (el.id === frameId ? { ...el, children: [] } : el)),
    }));
  },

  updateFrameTitle: (frameId, newTitle) => {
    set((s) => ({
      elements: s.elements.map((el) => (el.id === frameId ? { ...el, title: newTitle } : el)),
    }));
  },

  copyElements: (elementIds) => {
    const setIds = new Set(elementIds);
    const items = get()
      .elements.filter((e) => setIds.has(e.id))
      .map((e) => ({ ...e }));
    set({ clipboard: items });
  },

  pasteElements: () => {
    const clip = get().clipboard;
    if (!clip.length) return;

    const pasted = clip.map((e) => ({
      ...e,
      id: uid(e.type),
      position: { x: e.position.x + 32, y: e.position.y + 32 },
    }));

    set((s) => ({
      elements: [...s.elements, ...pasted],
      selectedElementIds: pasted.map((p) => p.id),
    }));

    get().pushHistory();
  },

  cutElements: (elementIds) => {
    get().copyElements(elementIds);
    get().deleteElements(elementIds);
  },

  groupElements: (elementIds) => {
    // placeholder
    void elementIds;
  },

  ungroupElements: (groupId) => {
    // placeholder
    void groupId;
  },

  alignElements: (elementIds, alignment) => {
    // placeholder
    void elementIds;
    void alignment;
  },

  lockElements: (elementIds) => {
    const ids = new Set(elementIds);
    set((s) => ({ elements: s.elements.map((e) => (ids.has(e.id) ? { ...e, locked: true } : e)) }));
  },

  unlockElements: (elementIds) => {
    const ids = new Set(elementIds);
    set((s) => ({ elements: s.elements.map((e) => (ids.has(e.id) ? { ...e, locked: false } : e)) }));
  },

  moveElements: (elementIds, deltaX, deltaY) => {
    const ids = new Set(elementIds);
    set((s) => ({
      elements: s.elements.map((e) =>
        ids.has(e.id) ? { ...e, position: { x: e.position.x + deltaX, y: e.position.y + deltaY } } : e,
      ),
    }));
  },

  resizeElements: (elementIds, scaleX, scaleY) => {
    const ids = new Set(elementIds);
    set((s) => ({
      elements: s.elements.map((e) =>
        ids.has(e.id)
          ? { ...e, size: { width: Math.max(8, e.size.width * scaleX), height: Math.max(8, e.size.height * scaleY) } }
          : e,
      ),
    }));
  },

  rotateElements: (elementIds) => {
    // placeholder (rotation not fully wired yet)
    void elementIds;
  },

  flipHorizontally: (elementIds) => {
    // placeholder
    void elementIds;
  },

  flipVertically: (elementIds) => {
    // placeholder
    void elementIds;
  },

  beginDragPreview: (elementIds, startPointerWorld) => {
    const ids = Array.from(new Set(elementIds));
    const startPositions: Record<string, CanvasPoint> = {};
    const all = get().elements;
    for (const id of ids) {
      const el = all.find((e) => e.id === id);
      if (el) startPositions[id] = { ...el.position };
    }
    set({
      dragPreview: {
        active: true,
        elementIds: ids,
        startPointerWorld: { ...startPointerWorld },
        startPositions,
        currentDelta: { x: 0, y: 0 },
      },
    });
  },

  updateDragPreviewDelta: (delta) => {
    set((s) => ({
      dragPreview: { ...s.dragPreview, currentDelta: { x: delta.x, y: delta.y } },
    }));
  },

  commitDragPreview: () => {
    const dp = get().dragPreview;
    if (!dp.active || !dp.elementIds.length) return;

    const ids = new Set(dp.elementIds);
    const dx = dp.currentDelta.x;
    const dy = dp.currentDelta.y;

    set((s) => ({
      elements: s.elements.map((el) => {
        if (!ids.has(el.id)) return el;
        const start = dp.startPositions[el.id];
        if (!start) return el;
        return { ...el, position: { x: start.x + dx, y: start.y + dy } };
      }),
      dragPreview: {
        ...s.dragPreview,
        active: false,
        elementIds: [],
        startPositions: {},
        currentDelta: { x: 0, y: 0 },
      },
    }));

    get().pushHistory();
  },

  clearDragPreview: () =>
    set({
      dragPreview: {
        active: false,
        elementIds: [],
        startPointerWorld: { x: 0, y: 0 },
        startPositions: {},
        currentDelta: { x: 0, y: 0 },
      },
    }),
}));
