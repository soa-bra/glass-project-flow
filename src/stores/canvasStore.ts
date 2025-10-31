import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasElement, LayerInfo, CanvasSettings } from '@/types/canvas';

export type ToolId =
  | "selection_tool"
  | "smart_pen"
  | "frame_tool"
  | "file_uploader"
  | "text_tool"
  | "shapes_tool"
  | "smart_element_tool";

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'star' | 'hexagon';

interface ToolSettings {
  shapes: {
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
    shapeType: ShapeType;
  };
  text: {
    fontSize: number;
    fontFamily: string;
    color: string;
    alignment: 'left' | 'center' | 'right';
    fontWeight: string;
  };
  pen: {
    strokeWidth: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
}

interface CanvasState {
  // Elements State
  elements: CanvasElement[];
  selectedElementIds: string[];
  clipboard: CanvasElement[];
  
  // Tool System
  activeTool: ToolId;
  toolSettings: ToolSettings;
  isDrawing: boolean;
  drawStartPoint: { x: number; y: number } | null;
  tempElement: CanvasElement | null;
  selectedSmartElement: string | null;
  
  // Layers State
  layers: LayerInfo[];
  activeLayerId: string | null;
  
  // Viewport State
  viewport: {
    zoom: number;
    pan: { x: number; y: number };
  };
  
  // Settings
  settings: CanvasSettings;
  
  // View Modes
  isPanMode: boolean;
  isFullscreen: boolean;
  showMinimap: boolean;
  
  // History
  history: {
    past: CanvasElement[][];
    future: CanvasElement[][];
  };
  
  // Element Actions
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  deleteElements: (elementIds: string[]) => void;
  duplicateElement: (elementId: string) => void;
  
  // Selection Actions
  selectElement: (elementId: string, multiSelect?: boolean) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  
  // Layer Actions
  addLayer: (name: string) => void;
  updateLayer: (layerId: string, updates: Partial<LayerInfo>) => void;
  deleteLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  setActiveLayer: (layerId: string) => void;
  reorderLayers: (layerIds: string[]) => void;
  
  // Viewport Actions
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<CanvasSettings>) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  
  // View Mode Actions
  togglePanMode: () => void;
  toggleFullscreen: () => void;
  toggleMinimap: () => void;
  setZoomPercentage: (percentage: number) => void;
  
  // Tool Actions
  setActiveTool: (tool: ToolId) => void;
  updateToolSettings: (tool: keyof ToolSettings, settings: Partial<ToolSettings[keyof ToolSettings]>) => void;
  setIsDrawing: (drawing: boolean) => void;
  setDrawStartPoint: (point: { x: number; y: number } | null) => void;
  setTempElement: (element: CanvasElement | null) => void;
  setSelectedSmartElement: (elementType: string | null) => void;
  
  // Advanced Operations
  copyElements: (elementIds: string[]) => void;
  pasteElements: () => void;
  cutElements: (elementIds: string[]) => void;
  groupElements: (elementIds: string[]) => void;
  ungroupElements: (groupId: string) => void;
  alignElements: (elementIds: string[], alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  lockElements: (elementIds: string[]) => void;
  unlockElements: (elementIds: string[]) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial State
  elements: [],
  selectedElementIds: [],
  clipboard: [],
  
  // Tool System Initial State
  activeTool: 'selection_tool',
  toolSettings: {
    shapes: {
      fillColor: '#f28e2a',
      strokeColor: '#000000',
      strokeWidth: 1,
      opacity: 1,
      shapeType: 'rectangle'
    },
    text: {
      fontSize: 16,
      fontFamily: 'IBM Plex Sans Arabic',
      color: '#111827',
      alignment: 'right',
      fontWeight: 'normal'
    },
    pen: {
      strokeWidth: 2,
      color: '#000000',
      style: 'solid'
    }
  },
  isDrawing: false,
  drawStartPoint: null,
  tempElement: null,
  selectedSmartElement: null,
  
  layers: [
    {
      id: 'default',
      name: 'الطبقة الافتراضية',
      visible: true,
      locked: false,
      elements: []
    }
  ],
  activeLayerId: 'default',
  viewport: {
    zoom: 1,
    pan: { x: 0, y: 0 }
  },
  settings: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    gridEnabled: true,
    snapToGrid: false,
    gridSize: 20,
    background: '#FFFFFF',
    theme: 'light'
  },
  isPanMode: false,
  isFullscreen: false,
  showMinimap: false,
  history: {
    past: [],
    future: []
  },
  
  // Element Actions Implementation
  addElement: (elementData) => {
    const element: CanvasElement = {
      type: elementData.type || 'text',
      position: elementData.position || { x: 0, y: 0 },
      size: elementData.size || { width: 200, height: 100 },
      style: elementData.style || {},
      ...elementData,
      id: nanoid(),
      layerId: get().activeLayerId || 'default',
      visible: true,
      locked: false
    };
    
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
    
    get().pushHistory();
  },
  
  updateElement: (elementId, updates) => {
    set(state => ({
      elements: state.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  },
  
  deleteElement: (elementId) => {
    set(state => {
      const updatedLayers = state.layers.map(layer => ({
        ...layer,
        elements: layer.elements.filter(id => id !== elementId)
      }));
      
      return {
        elements: state.elements.filter(el => el.id !== elementId),
        selectedElementIds: state.selectedElementIds.filter(id => id !== elementId),
        layers: updatedLayers
      };
    });
    
    get().pushHistory();
  },
  
  deleteElements: (elementIds) => {
    elementIds.forEach(id => get().deleteElement(id));
  },
  
  duplicateElement: (elementId) => {
    const element = get().elements.find(el => el.id === elementId);
    if (!element) return;
    
    const duplicate = {
      ...element,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };
    
    delete (duplicate as any).id;
    get().addElement(duplicate);
  },
  
  // Selection Actions
  selectElement: (elementId, multiSelect = false) => {
    set(state => {
      if (multiSelect) {
        const isSelected = state.selectedElementIds.includes(elementId);
        return {
          selectedElementIds: isSelected
            ? state.selectedElementIds.filter(id => id !== elementId)
            : [...state.selectedElementIds, elementId]
        };
      }
      return { selectedElementIds: [elementId] };
    });
  },
  
  selectElements: (elementIds) => {
    set({ selectedElementIds: elementIds });
  },
  
  clearSelection: () => {
    set({ selectedElementIds: [] });
  },
  
  // Layer Actions
  addLayer: (name) => {
    const newLayer: LayerInfo = {
      id: nanoid(),
      name,
      visible: true,
      locked: false,
      elements: []
    };
    
    set(state => ({
      layers: [...state.layers, newLayer],
      activeLayerId: newLayer.id
    }));
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
    layer.elements.forEach(elementId => get().deleteElement(elementId));
    
    set(state => {
      const remainingLayers = state.layers.filter(l => l.id !== layerId);
      return {
        layers: remainingLayers,
        activeLayerId: state.activeLayerId === layerId
          ? remainingLayers[0]?.id || null
          : state.activeLayerId
      };
    });
  },
  
  toggleLayerVisibility: (layerId) => {
    set(state => ({
      layers: state.layers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    }));
  },
  
  toggleLayerLock: (layerId) => {
    set(state => ({
      layers: state.layers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    }));
  },
  
  setActiveLayer: (layerId) => {
    set({ activeLayerId: layerId });
  },
  
  reorderLayers: (layerIds) => {
    set(state => ({
      layers: layerIds.map(id => state.layers.find(l => l.id === id)!).filter(Boolean)
    }));
  },
  
  // Viewport Actions
  setZoom: (zoom) => {
    const clampedZoom = Math.max(0.1, Math.min(5, zoom));
    set(state => ({
      viewport: { ...state.viewport, zoom: clampedZoom },
      settings: { ...state.settings, zoom: clampedZoom }
    }));
  },
  
  setPan: (x, y) => {
    set(state => ({
      viewport: { ...state.viewport, pan: { x, y } },
      settings: { ...state.settings, pan: { x, y } }
    }));
  },
  
  resetViewport: () => {
    set(state => ({
      viewport: { zoom: 1, pan: { x: 0, y: 0 } },
      settings: { ...state.settings, zoom: 1, pan: { x: 0, y: 0 } }
    }));
  },
  
  zoomIn: () => {
    const currentZoom = get().viewport.zoom;
    get().setZoom(currentZoom * 1.2);
  },
  
  zoomOut: () => {
    const currentZoom = get().viewport.zoom;
    get().setZoom(currentZoom / 1.2);
  },
  
  zoomToFit: () => {
    const elements = get().elements;
    if (elements.length === 0) {
      get().resetViewport();
      return;
    }
    
    // حساب الحدود
    const bounds = elements.reduce((acc, el) => ({
      minX: Math.min(acc.minX, el.position.x),
      minY: Math.min(acc.minY, el.position.y),
      maxX: Math.max(acc.maxX, el.position.x + el.size.width),
      maxY: Math.max(acc.maxY, el.position.y + el.size.height)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const centerX = bounds.minX + width / 2;
    const centerY = bounds.minY + height / 2;
    
    // حساب التكبير المناسب
    const zoom = Math.min(
      window.innerWidth / (width + 100),
      window.innerHeight / (height + 100),
      1
    );
    
    get().setZoom(zoom);
    get().setPan(-centerX * zoom + window.innerWidth / 2, -centerY * zoom + window.innerHeight / 2);
  },
  
  // History Actions
  undo: () => {
    set(state => {
      if (state.history.past.length === 0) return state;
      
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      
      return {
        elements: previous,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future]
        }
      };
    });
  },
  
  redo: () => {
    set(state => {
      if (state.history.future.length === 0) return state;
      
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      
      return {
        elements: next,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture
        }
      };
    });
  },
  
  pushHistory: () => {
    set(state => ({
      history: {
        past: [...state.history.past.slice(-20), state.elements],
        future: []
      }
    }));
  },
  
  // Settings Actions
  updateSettings: (settings) => {
    set(state => ({
      settings: { ...state.settings, ...settings }
    }));
  },
  
  toggleGrid: () => {
    set(state => ({
      settings: { ...state.settings, gridEnabled: !state.settings.gridEnabled }
    }));
  },
  
  toggleSnapToGrid: () => {
    set(state => ({
      settings: { ...state.settings, snapToGrid: !state.settings.snapToGrid }
    }));
  },
  
  // View Mode Actions
  togglePanMode: () => set(state => ({ isPanMode: !state.isPanMode })),
  
  toggleFullscreen: () => {
    const state = get();
    if (!state.isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    set({ isFullscreen: !state.isFullscreen });
  },
  
  toggleMinimap: () => set(state => ({ showMinimap: !state.showMinimap })),
  
  setZoomPercentage: (percentage) => {
    get().setZoom(percentage / 100);
  },
  
  // Tool Actions Implementation
  setActiveTool: (tool) => {
    set({ activeTool: tool, isDrawing: false, drawStartPoint: null, tempElement: null });
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
  
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  
  setDrawStartPoint: (point) => set({ drawStartPoint: point }),
  
  setTempElement: (element) => set({ tempElement: element }),
  
  // Advanced Operations
  copyElements: (elementIds) => {
    const elements = get().elements.filter(el => elementIds.includes(el.id));
    const clipboard = elements.map(el => ({ ...el }));
    (window as any).__canvasClipboard = clipboard;
  },
  
  pasteElements: () => {
    const clipboard = (window as any).__canvasClipboard || [];
    clipboard.forEach((el: CanvasElement) => {
      const copy = { ...el };
      delete (copy as any).id;
      copy.position = { x: copy.position.x + 20, y: copy.position.y + 20 };
      get().addElement(copy);
    });
  },
  
  cutElements: (elementIds) => {
    get().copyElements(elementIds);
    get().deleteElements(elementIds);
  },
  
  groupElements: (elementIds) => {
    const groupId = nanoid();
    set(state => ({
      elements: state.elements.map(el => 
        elementIds.includes(el.id) 
          ? { ...el, metadata: { ...el.metadata, groupId } } 
          : el
      )
    }));
  },
  
  ungroupElements: (groupId) => {
    set(state => ({
      elements: state.elements.map(el => {
        if (el.metadata?.groupId === groupId) {
          const { groupId: _, ...restMetadata } = el.metadata;
          return { ...el, metadata: restMetadata };
        }
        return el;
      })
    }));
  },
  
  alignElements: (elementIds, alignment) => {
    const elements = get().elements.filter(el => elementIds.includes(el.id));
    if (elements.length === 0) return;
    
    const bounds = {
      minX: Math.min(...elements.map(el => el.position.x)),
      minY: Math.min(...elements.map(el => el.position.y)),
      maxX: Math.max(...elements.map(el => el.position.x + el.size.width)),
      maxY: Math.max(...elements.map(el => el.position.y + el.size.height)),
      centerX: 0,
      centerY: 0
    };
    
    bounds.centerX = bounds.minX + (bounds.maxX - bounds.minX) / 2;
    bounds.centerY = bounds.minY + (bounds.maxY - bounds.minY) / 2;
    
    elements.forEach(el => {
      let newPosition = { ...el.position };
      
      switch(alignment) {
        case 'left':
          newPosition.x = bounds.minX;
          break;
        case 'center':
          newPosition.x = bounds.centerX - el.size.width / 2;
          break;
        case 'right':
          newPosition.x = bounds.maxX - el.size.width;
          break;
        case 'top':
          newPosition.y = bounds.minY;
          break;
        case 'middle':
          newPosition.y = bounds.centerY - el.size.height / 2;
          break;
        case 'bottom':
          newPosition.y = bounds.maxY - el.size.height;
          break;
      }
      
      get().updateElement(el.id, { position: newPosition });
    });
  },
  
  setSelectedSmartElement: (elementType) => {
    set({ selectedSmartElement: elementType });
  },
  
  lockElements: (elementIds) => {
    set(state => ({
      elements: state.elements.map(el => 
        elementIds.includes(el.id) 
          ? { ...el, locked: true } 
          : el
      )
    }));
  },
  
  unlockElements: (elementIds) => {
    set(state => ({
      elements: state.elements.map(el => 
        elementIds.includes(el.id) 
          ? { ...el, locked: false } 
          : el
      )
    }));
  }
}));
