/**
 * UI Store - Store للحالة المؤقتة (أداة، تحديد، hover)
 * Sprint 1: تفكيك canvasStore إلى boardStore + uiStore
 */

import { create } from 'zustand';
import type { BoardPosition, BoardSize } from '@/types/board-model';

// ============= Tool Types =============

export type ToolId =
  | 'selection_tool'
  | 'smart_pen'
  | 'frame_tool'
  | 'file_uploader'
  | 'text_tool'
  | 'shapes_tool'
  | 'smart_element_tool'
  | 'connector_tool';

export type ShapeType =
  | 'rectangle' | 'circle' | 'triangle' | 'line' | 'star' | 'hexagon'
  | 'pentagon' | 'octagon' | 'diamond'
  | 'arrow_right' | 'arrow_left' | 'arrow_up' | 'arrow_down'
  | 'arrow_up_right' | 'arrow_down_right' | 'arrow_up_left' | 'arrow_down_left'
  | 'icon' | 'sticky';

export type LineStyle = 'solid' | 'dashed' | 'dotted' | 'double';

// ============= Tool Settings =============

export interface ShapeToolSettings {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  shapeType: ShapeType;
  iconName?: string;
  stickyText?: string;
}

export interface TextToolSettings {
  fontSize: number;
  fontFamily: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  fontWeight: string;
  direction: 'rtl' | 'ltr';
  verticalAlign: 'top' | 'middle' | 'bottom';
}

export interface PenToolSettings {
  strokeWidth: number;
  color: string;
  style: LineStyle;
  smartMode: boolean;
  eraserMode: boolean;
}

export interface FrameToolSettings {
  strokeWidth: number;
  strokeColor: string;
  title: string;
}

export interface ConnectorToolSettings {
  strokeColor: string;
  strokeWidth: number;
  arrowStart: boolean;
  arrowEnd: boolean;
  lineType: 'straight' | 'orthogonal' | 'curved';
}

export interface ToolSettings {
  shapes: ShapeToolSettings;
  text: TextToolSettings;
  pen: PenToolSettings;
  frame: FrameToolSettings;
  connector: ConnectorToolSettings;
}

// ============= Pen Stroke Types =============

export interface PenPoint {
  x: number;
  y: number;
  pressure?: number;
  t: number;
}

export interface PenStroke {
  id: string;
  points: PenPoint[];
  color: string;
  width: number;
  style: LineStyle;
  isClosed?: boolean;
  simplified?: boolean;
  bbox?: { x: number; y: number; w: number; h: number };
}

// ============= Viewport State =============

export interface ViewportState {
  zoom: number;
  pan: BoardPosition;
}

// ============= Selection State =============

export interface SelectionState {
  selectedElementIds: string[];
  hoveredElementId: string | null;
  focusedElementId: string | null;
}

// ============= Drawing State =============

export interface DrawingState {
  isDrawing: boolean;
  drawStartPoint: BoardPosition | null;
  tempElementId: string | null;
}

// ============= UI State Interface =============

interface UIState {
  // Tool State
  activeTool: ToolId;
  toolSettings: ToolSettings;
  selectedSmartElement: string | null;
  
  // Selection State
  selectedElementIds: string[];
  hoveredElementId: string | null;
  focusedElementId: string | null;
  
  // Drawing State
  isDrawing: boolean;
  drawStartPoint: BoardPosition | null;
  tempElementId: string | null;
  
  // Text Editing State
  editingTextId: string | null;
  typingMode: boolean;
  
  // Pen Strokes State
  strokes: Record<string, PenStroke>;
  currentStrokeId: string | undefined;
  
  // Viewport State
  viewport: ViewportState;
  
  // View Modes
  isPanMode: boolean;
  isFullscreen: boolean;
  showMinimap: boolean;
  showGrid: boolean;
  
  // Clipboard
  clipboardElementIds: string[];
  
  // Drag State
  isInternalDrag: boolean;
  isDragging: boolean;
  dragOffset: BoardPosition | null;
  
  // Active Layer
  activeLayerId: string;
  
  // Tool Actions
  setActiveTool: (tool: ToolId) => void;
  updateToolSettings: <K extends keyof ToolSettings>(
    tool: K,
    settings: Partial<ToolSettings[K]>
  ) => void;
  setSelectedSmartElement: (elementType: string | null) => void;
  
  // Selection Actions
  selectElement: (elementId: string, multiSelect?: boolean) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  toggleElementSelection: (elementId: string) => void;
  setHoveredElement: (elementId: string | null) => void;
  setFocusedElement: (elementId: string | null) => void;
  
  // Drawing Actions
  setIsDrawing: (drawing: boolean) => void;
  setDrawStartPoint: (point: BoardPosition | null) => void;
  setTempElementId: (elementId: string | null) => void;
  
  // Text Editing Actions
  startEditingText: (elementId: string) => void;
  stopEditingText: () => void;
  startTyping: () => void;
  stopTyping: () => void;
  
  // Pen Actions
  setPenSettings: (settings: Partial<PenToolSettings>) => void;
  toggleSmartMode: () => void;
  toggleEraserMode: () => void;
  beginStroke: (x: number, y: number, pressure?: number) => string;
  appendPoint: (x: number, y: number, pressure?: number) => void;
  endStroke: () => void;
  clearPendingStroke: () => void;
  clearAllStrokes: () => void;
  removeStroke: (strokeId: string) => void;
  
  // Viewport Actions
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomPercentage: (percentage: number) => void;
  
  // View Mode Actions
  togglePanMode: () => void;
  toggleFullscreen: () => void;
  toggleMinimap: () => void;
  toggleGrid: () => void;
  
  // Clipboard Actions
  setClipboardElementIds: (ids: string[]) => void;
  clearClipboard: () => void;
  
  // Drag Actions
  setInternalDrag: (value: boolean) => void;
  setIsDragging: (value: boolean) => void;
  setDragOffset: (offset: BoardPosition | null) => void;
  
  // Layer Actions
  setActiveLayer: (layerId: string) => void;
}

// ============= Default Tool Settings =============

const defaultToolSettings: ToolSettings = {
  shapes: {
    fillColor: '#f28e2a',
    strokeColor: 'transparent',
    strokeWidth: 1,
    opacity: 1,
    shapeType: 'rectangle'
  },
  text: {
    fontSize: 16,
    fontFamily: 'IBM Plex Sans Arabic',
    color: '#111827',
    alignment: 'right',
    fontWeight: 'normal',
    direction: 'rtl',
    verticalAlign: 'top'
  },
  pen: {
    strokeWidth: 2,
    color: '#111111',
    style: 'solid',
    smartMode: false,
    eraserMode: false
  },
  frame: {
    strokeWidth: 2,
    strokeColor: '#0B0F12',
    title: ''
  },
  connector: {
    strokeColor: '#0B0F12',
    strokeWidth: 2,
    arrowStart: false,
    arrowEnd: true,
    lineType: 'orthogonal'
  }
};

// ============= UI Store =============

export const useUIStore = create<UIState>((set, get) => ({
  // Initial State
  activeTool: 'selection_tool',
  toolSettings: { ...defaultToolSettings },
  selectedSmartElement: null,
  
  selectedElementIds: [],
  hoveredElementId: null,
  focusedElementId: null,
  
  isDrawing: false,
  drawStartPoint: null,
  tempElementId: null,
  
  editingTextId: null,
  typingMode: false,
  
  strokes: {},
  currentStrokeId: undefined,
  
  viewport: {
    zoom: 1,
    pan: { x: 0, y: 0 }
  },
  
  isPanMode: false,
  isFullscreen: false,
  showMinimap: false,
  showGrid: true,
  
  clipboardElementIds: [],
  
  isInternalDrag: false,
  isDragging: false,
  dragOffset: null,
  
  activeLayerId: 'default',

  // ============= Tool Actions =============

  setActiveTool: (tool) => {
    set({
      activeTool: tool,
      isDrawing: false,
      drawStartPoint: null,
      tempElementId: null
    });
  },

  updateToolSettings: (tool, settings) => {
    set(state => ({
      toolSettings: {
        ...state.toolSettings,
        [tool]: {
          ...state.toolSettings[tool],
          ...settings
        }
      }
    }));
  },

  setSelectedSmartElement: (elementType) => {
    set({ selectedSmartElement: elementType });
  },

  // ============= Selection Actions =============

  selectElement: (elementId, multiSelect = false) => {
    set(state => {
      if (multiSelect) {
        const isSelected = state.selectedElementIds.includes(elementId);
        const newSelection = isSelected
          ? state.selectedElementIds.filter(id => id !== elementId)
          : [...state.selectedElementIds, elementId];
        return { selectedElementIds: Array.from(new Set(newSelection)) };
      }
      return { selectedElementIds: [elementId] };
    });
  },

  selectElements: (elementIds) => {
    set({ selectedElementIds: Array.from(new Set(elementIds)) });
  },

  clearSelection: () => {
    set({ selectedElementIds: [] });
  },

  toggleElementSelection: (elementId) => {
    set(state => {
      const isSelected = state.selectedElementIds.includes(elementId);
      return {
        selectedElementIds: isSelected
          ? state.selectedElementIds.filter(id => id !== elementId)
          : [...state.selectedElementIds, elementId]
      };
    });
  },

  setHoveredElement: (elementId) => {
    set({ hoveredElementId: elementId });
  },

  setFocusedElement: (elementId) => {
    set({ focusedElementId: elementId });
  },

  // ============= Drawing Actions =============

  setIsDrawing: (drawing) => {
    set({ isDrawing: drawing });
  },

  setDrawStartPoint: (point) => {
    set({ drawStartPoint: point });
  },

  setTempElementId: (elementId) => {
    set({ tempElementId: elementId });
  },

  // ============= Text Editing Actions =============

  startEditingText: (elementId) => {
    set({ editingTextId: elementId, typingMode: true });
  },

  stopEditingText: () => {
    set({ editingTextId: null, typingMode: false });
  },

  startTyping: () => {
    set({ typingMode: true });
  },

  stopTyping: () => {
    set({ typingMode: false });
  },

  // ============= Pen Actions =============

  setPenSettings: (settings) => {
    set(state => ({
      toolSettings: {
        ...state.toolSettings,
        pen: { ...state.toolSettings.pen, ...settings }
      }
    }));
  },

  toggleSmartMode: () => {
    set(state => ({
      toolSettings: {
        ...state.toolSettings,
        pen: { ...state.toolSettings.pen, smartMode: !state.toolSettings.pen.smartMode }
      }
    }));
  },

  toggleEraserMode: () => {
    set(state => ({
      toolSettings: {
        ...state.toolSettings,
        pen: { ...state.toolSettings.pen, eraserMode: !state.toolSettings.pen.eraserMode }
      }
    }));
  },

  beginStroke: (x, y, pressure = 1) => {
    const id = `stroke-${Date.now()}`;
    const { toolSettings } = get();
    const now = Date.now();

    set(state => ({
      strokes: {
        ...state.strokes,
        [id]: {
          id,
          points: [{ x, y, pressure, t: now }],
          color: toolSettings.pen.color,
          width: toolSettings.pen.strokeWidth,
          style: toolSettings.pen.style,
          isClosed: false,
          simplified: false
        }
      },
      currentStrokeId: id
    }));

    return id;
  },

  appendPoint: (x, y, pressure = 1) => {
    const { currentStrokeId } = get();
    if (!currentStrokeId) return;

    const now = Date.now();
    set(state => {
      const stroke = state.strokes[currentStrokeId];
      if (!stroke) return state;

      return {
        strokes: {
          ...state.strokes,
          [currentStrokeId]: {
            ...stroke,
            points: [...stroke.points, { x, y, pressure, t: now }]
          }
        }
      };
    });
  },

  endStroke: () => {
    const { currentStrokeId, strokes } = get();
    if (!currentStrokeId) return;

    const stroke = strokes[currentStrokeId];
    if (stroke && stroke.points.length >= 2) {
      const xs = stroke.points.map(p => p.x);
      const ys = stroke.points.map(p => p.y);
      const bbox = {
        x: Math.min(...xs),
        y: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs),
        h: Math.max(...ys) - Math.min(...ys)
      };

      set(state => ({
        strokes: {
          ...state.strokes,
          [currentStrokeId]: { ...stroke, bbox }
        },
        currentStrokeId: undefined
      }));
    } else {
      set(state => {
        const { [currentStrokeId]: _, ...remainingStrokes } = state.strokes;
        return {
          strokes: remainingStrokes,
          currentStrokeId: undefined
        };
      });
    }
  },

  clearPendingStroke: () => {
    const { currentStrokeId } = get();
    if (!currentStrokeId) return;

    set(state => {
      const { [currentStrokeId]: _, ...remainingStrokes } = state.strokes;
      return {
        strokes: remainingStrokes,
        currentStrokeId: undefined
      };
    });
  },

  clearAllStrokes: () => {
    set({ strokes: {}, currentStrokeId: undefined });
  },

  removeStroke: (strokeId) => {
    set(state => {
      const { [strokeId]: _, ...remainingStrokes } = state.strokes;
      return { strokes: remainingStrokes };
    });
  },

  // ============= Viewport Actions =============

  setZoom: (zoom) => {
    const clampedZoom = Math.max(0.1, Math.min(5, zoom));
    set(state => ({
      viewport: { ...state.viewport, zoom: clampedZoom }
    }));
  },

  setPan: (x, y) => {
    set(state => ({
      viewport: { ...state.viewport, pan: { x, y } }
    }));
  },

  resetViewport: () => {
    set({
      viewport: { zoom: 1, pan: { x: 0, y: 0 } }
    });
  },

  zoomIn: () => {
    const currentZoom = get().viewport.zoom;
    get().setZoom(currentZoom * 1.2);
  },

  zoomOut: () => {
    const currentZoom = get().viewport.zoom;
    get().setZoom(currentZoom / 1.2);
  },

  setZoomPercentage: (percentage) => {
    get().setZoom(percentage / 100);
  },

  // ============= View Mode Actions =============

  togglePanMode: () => {
    set(state => ({ isPanMode: !state.isPanMode }));
  },

  toggleFullscreen: () => {
    const state = get();
    if (!state.isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    set({ isFullscreen: !state.isFullscreen });
  },

  toggleMinimap: () => {
    set(state => ({ showMinimap: !state.showMinimap }));
  },

  toggleGrid: () => {
    set(state => ({ showGrid: !state.showGrid }));
  },

  // ============= Clipboard Actions =============

  setClipboardElementIds: (ids) => {
    set({ clipboardElementIds: ids });
  },

  clearClipboard: () => {
    set({ clipboardElementIds: [] });
  },

  // ============= Drag Actions =============

  setInternalDrag: (value) => {
    set({ isInternalDrag: value });
  },

  setIsDragging: (value) => {
    set({ isDragging: value });
  },

  setDragOffset: (offset) => {
    set({ dragOffset: offset });
  },

  // ============= Layer Actions =============

  setActiveLayer: (layerId) => {
    set({ activeLayerId: layerId });
  }
}));
