import { create } from 'zustand';
import { CanvasState, CanvasElement, LayerInfo, Frame, ViewportState, GridSettings, SnapSettings } from '../types/canvas.types';

interface CanvasStore extends CanvasState {
  // Element Actions
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  
  // Selection Actions
  selectElement: (id: string, multi?: boolean) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  
  // Viewport Actions
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  fitToScreen: () => void;
  fitToFrame: (frameId: string) => void;
  fitToSelection: () => void;
  
  // Grid and Snap Actions
  toggleGrid: () => void;
  toggleSnap: () => void;
  setGridSize: (size: number) => void;
  setGridType: (type: 'dots' | 'grid' | 'isometric' | 'hex') => void;
  
  // Layer Actions
  createLayer: (name: string) => LayerInfo;
  updateLayer: (id: string, updates: Partial<LayerInfo>) => void;
  deleteLayer: (id: string) => void;
  setSelectedLayer: (id: string) => void;
  moveElementToLayer: (elementId: string, layerId: string) => void;
  
  // Frame Actions
  frames: Frame[];
  createFrame: (bounds: { x: number; y: number; width: number; height: number }) => Frame;
  updateFrame: (id: string, updates: Partial<Frame>) => void;
  deleteFrame: (id: string) => void;
  
  // Utility Actions
  getElementById: (id: string) => CanvasElement | undefined;
  getSelectedElements: () => CanvasElement[];
  getBounds: () => { x: number; y: number; width: number; height: number } | null;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // Initial State
  elements: [],
  selectedElementIds: [],
  zoom: 1,
  pan: { x: 0, y: 0 },
  showGrid: true,
  snapEnabled: true,
  gridSize: 16,
  gridType: 'dots',
  layers: [
    { 
      id: 'main', 
      name: 'الطبقة الرئيسية', 
      visible: true, 
      locked: false, 
      elements: [],
      opacity: 1
    }
  ],
  selectedLayerId: 'main',
  frames: [],

  // Element Actions
  addElement: (element) => set((state) => ({
    elements: [...state.elements, element],
    layers: state.layers.map(layer => 
      layer.id === (element.layerId || state.selectedLayerId)
        ? { ...layer, elements: [...layer.elements, element.id] }
        : layer
    )
  })),

  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map(el => 
      el.id === id ? { ...el, ...updates, updatedAt: Date.now() } : el
    )
  })),

  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id),
    selectedElementIds: state.selectedElementIds.filter(selectedId => selectedId !== id),
    layers: state.layers.map(layer => ({
      ...layer,
      elements: layer.elements.filter(elementId => elementId !== id)
    }))
  })),

  duplicateElement: (id) => set((state) => {
    const element = state.elements.find(el => el.id === id);
    if (!element) return state;
    
    const duplicate = {
      ...element,
      id: `${element.id}_copy_${Date.now()}`,
      position: { x: element.position.x + 20, y: element.position.y + 20 },
      createdBy: 'current_user', // TODO: Get from auth
      updatedAt: Date.now()
    };

    return {
      elements: [...state.elements, duplicate],
      layers: state.layers.map(layer => 
        layer.id === (element.layerId || state.selectedLayerId)
          ? { ...layer, elements: [...layer.elements, duplicate.id] }
          : layer
      )
    };
  }),

  // Selection Actions
  selectElement: (id, multi = false) => set((state) => ({
    selectedElementIds: multi 
      ? state.selectedElementIds.includes(id)
        ? state.selectedElementIds.filter(selectedId => selectedId !== id)
        : [...state.selectedElementIds, id]
      : [id]
  })),

  selectMultiple: (ids) => set({ selectedElementIds: ids }),

  clearSelection: () => set({ selectedElementIds: [] }),

  selectAll: () => set((state) => ({
    selectedElementIds: state.elements
      .filter(el => el.visible !== false)
      .map(el => el.id)
  })),

  // Viewport Actions
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  
  setPan: (pan) => set({ pan }),

  fitToScreen: () => set(() => {
    // TODO: Calculate viewport bounds and fit all elements
    return { zoom: 1, pan: { x: 0, y: 0 } };
  }),

  fitToFrame: (frameId) => set((state) => {
    const frame = state.frames.find(f => f.id === frameId);
    if (!frame) return state;
    // TODO: Calculate zoom and pan to fit frame
    return state;
  }),

  fitToSelection: () => set((state) => {
    const selectedElements = state.elements.filter(el => 
      state.selectedElementIds.includes(el.id)
    );
    if (selectedElements.length === 0) return state;
    // TODO: Calculate bounds and fit selection
    return state;
  }),

  // Grid and Snap Actions
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  setGridSize: (size) => set({ gridSize: size }),
  setGridType: (type) => set({ gridType: type }),

  // Layer Actions
  createLayer: (name) => {
    const layer: LayerInfo = {
      id: `layer_${Date.now()}`,
      name,
      visible: true,
      locked: false,
      elements: [],
      opacity: 1
    };
    
    set((state) => ({
      layers: [...state.layers, layer]
    }));
    
    return layer;
  },

  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    )
  })),

  deleteLayer: (id) => set((state) => {
    if (state.layers.length <= 1 || id === 'main') return state;
    
    const layerToDelete = state.layers.find(l => l.id === id);
    if (!layerToDelete) return state;

    // Move elements to main layer
    const mainLayer = state.layers.find(l => l.id === 'main');
    if (!mainLayer) return state;

    return {
      layers: state.layers
        .filter(layer => layer.id !== id)
        .map(layer => 
          layer.id === 'main'
            ? { ...layer, elements: [...layer.elements, ...layerToDelete.elements] }
            : layer
        ),
      elements: state.elements.map(el => 
        layerToDelete.elements.includes(el.id)
          ? { ...el, layerId: 'main' }
          : el
      ),
      selectedLayerId: state.selectedLayerId === id ? 'main' : state.selectedLayerId
    };
  }),

  setSelectedLayer: (id) => set({ selectedLayerId: id }),

  moveElementToLayer: (elementId, layerId) => set((state) => {
    const element = state.elements.find(el => el.id === elementId);
    if (!element) return state;

    const oldLayerId = element.layerId || 'main';
    
    return {
      elements: state.elements.map(el =>
        el.id === elementId ? { ...el, layerId } : el
      ),
      layers: state.layers.map(layer => ({
        ...layer,
        elements: layer.id === oldLayerId
          ? layer.elements.filter(id => id !== elementId)
          : layer.id === layerId
          ? [...layer.elements, elementId]
          : layer.elements
      }))
    };
  }),

  // Frame Actions
  createFrame: (bounds) => {
    const frame: Frame = {
      id: `frame_${Date.now()}`,
      name: `إطار ${get().frames.length + 1}`,
      bounds,
      locked: false,
      background: 'transparent',
      elements: []
    };
    
    set((state) => ({
      frames: [...state.frames, frame]
    }));
    
    return frame;
  },

  updateFrame: (id, updates) => set((state) => ({
    frames: state.frames.map(frame => 
      frame.id === id ? { ...frame, ...updates } : frame
    )
  })),

  deleteFrame: (id) => set((state) => ({
    frames: state.frames.filter(frame => frame.id !== id)
  })),

  // Utility Actions
  getElementById: (id) => {
    return get().elements.find(el => el.id === id);
  },

  getSelectedElements: () => {
    const { elements, selectedElementIds } = get();
    return elements.filter(el => selectedElementIds.includes(el.id));
  },

  getBounds: () => {
    const selectedElements = get().getSelectedElements();
    if (selectedElements.length === 0) return null;

    const bounds = selectedElements.reduce((acc, el) => {
      const left = el.position.x;
      const right = el.position.x + el.size.width;
      const top = el.position.y;
      const bottom = el.position.y + el.size.height;

      return {
        left: Math.min(acc.left, left),
        right: Math.max(acc.right, right),
        top: Math.min(acc.top, top),
        bottom: Math.max(acc.bottom, bottom)
      };
    }, {
      left: selectedElements[0].position.x,
      right: selectedElements[0].position.x + selectedElements[0].size.width,
      top: selectedElements[0].position.y,
      bottom: selectedElements[0].position.y + selectedElements[0].size.height
    });

    return {
      x: bounds.left,
      y: bounds.top,
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
    };
  }
}));