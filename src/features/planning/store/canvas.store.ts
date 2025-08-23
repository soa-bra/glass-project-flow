// ===============================
// Canvas Store - Planning Board
// متجر حالة الكانفاس للوحة التخطيط  
// ===============================

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  Board, 
  CanvasElement, 
  Frame, 
  Connector, 
  Viewport, 
  SelectionState, 
  GridSettings,
  Position,
  Size 
} from '../types/canvas';
import { nanoid } from 'nanoid';

interface CanvasStore {
  // Board state
  board: Board | null;
  loading: boolean;
  error: string | null;
  
  // Viewport state
  viewport: Viewport;
  
  // Selection state  
  selection: SelectionState;
  
  // Grid state
  grid: GridSettings;
  
  // Performance state
  fps: number;
  renderCount: number;
  
  // Actions - Board management
  createBoard: (name: string, ownerId: string) => void;
  loadBoard: (boardId: string) => Promise<void>;
  updateBoardName: (name: string) => void;
  saveBoardState: () => Promise<void>;
  
  // Actions - Elements
  addElement: (element: Omit<CanvasElement, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateElement: (id: string, changes: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => string;
  
  // Actions - Frames
  addFrame: (frame: Omit<Frame, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateFrame: (id: string, changes: Partial<Frame>) => void;
  deleteFrame: (id: string) => void;
  addElementToFrame: (elementId: string, frameId: string) => void;
  removeElementFromFrame: (elementId: string) => void;
  
  // Actions - Connectors
  addConnector: (connector: Omit<Connector, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateConnector: (id: string, changes: Partial<Connector>) => void;
  deleteConnector: (id: string) => void;
  
  // Actions - Selection
  selectElements: (elementIds: string[]) => void;
  selectElement: (elementId: string, addToSelection?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;
  setHoveredElement: (elementId: string | null) => void;
  
  // Actions - Viewport
  setViewport: (viewport: Partial<Viewport>) => void;
  panViewport: (deltaX: number, deltaY: number) => void;
  zoomViewport: (zoomLevel: number, center?: Position) => void;
  fitToScreen: () => void;
  fitToSelection: () => void;
  fitToFrame: (frameId: string) => void;
  
  // Actions - Grid
  setGrid: (settings: Partial<GridSettings>) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  
  // Actions - Transform
  moveElements: (elementIds: string[], deltaX: number, deltaY: number) => void;
  resizeElement: (elementId: string, newSize: Size, newPosition?: Position) => void;
  rotateElement: (elementId: string, angle: number) => void;
  
  // Actions - Z-index
  bringToFront: (elementId: string) => void;
  sendToBack: (elementId: string) => void;
  bringForward: (elementId: string) => void;
  sendBackward: (elementId: string) => void;
  
  // Actions - Grouping
  groupElements: (elementIds: string[]) => string;
  ungroupElements: (groupId: string) => void;
  
  // Actions - Layers
  showElement: (elementId: string) => void;
  hideElement: (elementId: string) => void;
  lockElement: (elementId: string) => void;
  unlockElement: (elementId: string) => void;
  
  // Actions - Search and filter
  searchElements: (query: string) => CanvasElement[];
  filterElements: (filter: (element: CanvasElement) => boolean) => CanvasElement[];
  
  // Actions - Performance
  updateFPS: (fps: number) => void;
  incrementRenderCount: () => void;
  
  // Utilities
  getElementById: (id: string) => CanvasElement | null;
  getElementBounds: (id: string) => { x: number; y: number; width: number; height: number } | null;
  getElementsInBounds: (bounds: { x: number; y: number; width: number; height: number }) => CanvasElement[];
  getSelectionBounds: () => { x: number; y: number; width: number; height: number } | null;
}

export const useCanvasStore = create<CanvasStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    board: null,
    loading: false,
    error: null,
    
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
    
    selection: {
      selectedIds: [],
      hoveredId: null,
      handles: [],
    },
    
    grid: {
      enabled: true,
      size: 20,
      type: 'dots',
      color: '#e5e7eb',
      opacity: 0.5,
      snapEnabled: true,
    },
    
    fps: 60,
    renderCount: 0,
    
    // Board management
    createBoard: (name: string, ownerId: string) => {
      const newBoard: Board = {
        id: nanoid(),
        name,
        ownerId,
        elements: {},
        frames: {},
        connectors: {},
        viewport: get().viewport,
        grid: get().grid,
        settings: {
          backgroundColor: '#f8f9fa',
          showGrid: true,
          snapToGrid: true,
          snapToObjects: true,
          showGuides: true,
          showRulers: false,
          units: 'px',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      set({ board: newBoard });
    },
    
    loadBoard: async (boardId: string) => {
      set({ loading: true, error: null });
      try {
        // TODO: Implement actual loading from backend
        // For now, create a demo board
        const demoBoard: Board = {
          id: boardId,
          name: 'لوحة تخطيط جديدة',
          ownerId: 'user-1',
          elements: {},
          frames: {},
          connectors: {},
          viewport: get().viewport,
          grid: get().grid,
          settings: {
            backgroundColor: '#f8f9fa',
            showGrid: true,
            snapToGrid: true,
            snapToObjects: true,
            showGuides: true,
            showRulers: false,
            units: 'px',
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set({ board: demoBoard, loading: false });
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },
    
    updateBoardName: (name: string) => {
      const { board } = get();
      if (!board) return;
      
      set({
        board: {
          ...board,
          name,
          updatedAt: Date.now(),
        },
      });
    },
    
    saveBoardState: async () => {
      const { board } = get();
      if (!board) return;
      
      try {
        // TODO: Implement actual saving to backend
        console.log('حفظ حالة اللوحة:', board);
      } catch (error) {
        set({ error: (error as Error).message });
      }
    },
    
    // Elements
    addElement: (elementData) => {
      const { board } = get();
      if (!board) return '';
      
      const id = nanoid();
      const element: CanvasElement = {
        ...elementData,
        id,
        createdBy: board.ownerId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      set({
        board: {
          ...board,
          elements: {
            ...board.elements,
            [id]: element,
          },
          updatedAt: Date.now(),
        },
      });
      
      return id;
    },
    
    updateElement: (id: string, changes: Partial<CanvasElement>) => {
      const { board } = get();
      if (!board || !board.elements[id]) return;
      
      set({
        board: {
          ...board,
          elements: {
            ...board.elements,
            [id]: {
              ...board.elements[id],
              ...changes,
              updatedAt: Date.now(),
            },
          },
          updatedAt: Date.now(),
        },
      });
    },
    
    deleteElement: (id: string) => {
      const { board } = get();
      if (!board || !board.elements[id]) return;
      
      const { [id]: deleted, ...remainingElements } = board.elements;
      
      set({
        board: {
          ...board,
          elements: remainingElements,
          updatedAt: Date.now(),
        },
        selection: {
          ...get().selection,
          selectedIds: get().selection.selectedIds.filter(selectedId => selectedId !== id),
        },
      });
    },
    
    duplicateElement: (id: string) => {
      const { board } = get();
      if (!board || !board.elements[id]) return '';
      
      const element = board.elements[id];
      const newId = nanoid();
      const duplicatedElement: CanvasElement = {
        ...element,
        id: newId,
        transform: {
          ...element.transform,
          x: element.transform.x + 20,
          y: element.transform.y + 20,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      set({
        board: {
          ...board,
          elements: {
            ...board.elements,
            [newId]: duplicatedElement,
          },
          updatedAt: Date.now(),
        },
      });
      
      return newId;
    },
    
    // Selection
    selectElements: (elementIds: string[]) => {
      set({
        selection: {
          ...get().selection,
          selectedIds: elementIds,
        },
      });
    },
    
    selectElement: (elementId: string, addToSelection = false) => {
      const { selection } = get();
      let newSelectedIds: string[];
      
      if (addToSelection) {
        newSelectedIds = selection.selectedIds.includes(elementId)
          ? selection.selectedIds.filter(id => id !== elementId)
          : [...selection.selectedIds, elementId];
      } else {
        newSelectedIds = [elementId];
      }
      
      set({
        selection: {
          ...selection,
          selectedIds: newSelectedIds,
        },
      });
    },
    
    clearSelection: () => {
      set({
        selection: {
          ...get().selection,
          selectedIds: [],
          hoveredId: null,
        },
      });
    },
    
    selectAll: () => {
      const { board } = get();
      if (!board) return;
      
      set({
        selection: {
          ...get().selection,
          selectedIds: Object.keys(board.elements),
        },
      });
    },
    
    setHoveredElement: (elementId: string | null) => {
      set({
        selection: {
          ...get().selection,
          hoveredId: elementId,
        },
      });
    },
    
    // Viewport
    setViewport: (viewport: Partial<Viewport>) => {
      set({
        viewport: {
          ...get().viewport,
          ...viewport,
        },
      });
    },
    
    panViewport: (deltaX: number, deltaY: number) => {
      const { viewport } = get();
      set({
        viewport: {
          ...viewport,
          x: viewport.x + deltaX,
          y: viewport.y + deltaY,
        },
      });
    },
    
    zoomViewport: (zoomLevel: number, center?: Position) => {
      const { viewport } = get();
      let newViewport = { ...viewport, zoom: zoomLevel };
      
      if (center) {
        // Zoom towards the specified center point
        const zoomRatio = zoomLevel / viewport.zoom;
        newViewport.x = center.x - (center.x - viewport.x) * zoomRatio;
        newViewport.y = center.y - (center.y - viewport.y) * zoomRatio;
      }
      
      set({ viewport: newViewport });
    },
    
    fitToScreen: () => {
      // TODO: Implement fit to screen logic
      set({
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      });
    },
    
    fitToSelection: () => {
      // TODO: Implement fit to selection logic
      const bounds = get().getSelectionBounds();
      if (bounds) {
        // Calculate zoom and position to fit selection
      }
    },
    
    fitToFrame: (frameId: string) => {
      // TODO: Implement fit to frame logic
    },
    
    // Grid
    setGrid: (settings: Partial<GridSettings>) => {
      set({
        grid: {
          ...get().grid,
          ...settings,
        },
      });
    },
    
    toggleGrid: () => {
      set({
        grid: {
          ...get().grid,
          enabled: !get().grid.enabled,
        },
      });
    },
    
    toggleSnap: () => {
      set({
        grid: {
          ...get().grid,
          snapEnabled: !get().grid.snapEnabled,
        },
      });
    },
    
    // Transform operations
    moveElements: (elementIds: string[], deltaX: number, deltaY: number) => {
      const { board } = get();
      if (!board) return;
      
      const updatedElements = { ...board.elements };
      
      elementIds.forEach(id => {
        if (updatedElements[id]) {
          updatedElements[id] = {
            ...updatedElements[id],
            transform: {
              ...updatedElements[id].transform,
              x: updatedElements[id].transform.x + deltaX,
              y: updatedElements[id].transform.y + deltaY,
            },
            updatedAt: Date.now(),
          };
        }
      });
      
      set({
        board: {
          ...board,
          elements: updatedElements,
          updatedAt: Date.now(),
        },
      });
    },
    
    resizeElement: (elementId: string, newSize: Size, newPosition?: Position) => {
      get().updateElement(elementId, {
        transform: {
          ...get().board?.elements[elementId]?.transform,
          ...(newPosition && { x: newPosition.x, y: newPosition.y }),
        },
        // Add size to element data if needed
        data: {
          ...get().board?.elements[elementId]?.data,
          width: newSize.width,
          height: newSize.height,
        },
      });
    },
    
    rotateElement: (elementId: string, angle: number) => {
      get().updateElement(elementId, {
        transform: {
          ...get().board?.elements[elementId]?.transform,
          rotation: angle,
        },
      });
    },
    
    // Z-index operations
    bringToFront: (elementId: string) => {
      const { board } = get();
      if (!board) return;
      
      const maxZ = Math.max(...Object.values(board.elements).map(el => el.zIndex));
      get().updateElement(elementId, { zIndex: maxZ + 1 });
    },
    
    sendToBack: (elementId: string) => {
      const { board } = get();
      if (!board) return;
      
      const minZ = Math.min(...Object.values(board.elements).map(el => el.zIndex));
      get().updateElement(elementId, { zIndex: minZ - 1 });
    },
    
    bringForward: (elementId: string) => {
      const element = get().board?.elements[elementId];
      if (!element) return;
      
      get().updateElement(elementId, { zIndex: element.zIndex + 1 });
    },
    
    sendBackward: (elementId: string) => {
      const element = get().board?.elements[elementId];
      if (!element) return;
      
      get().updateElement(elementId, { zIndex: element.zIndex - 1 });
    },
    
    // Grouping (placeholder implementations)
    groupElements: (elementIds: string[]) => {
      // TODO: Implement grouping logic
      return nanoid();
    },
    
    ungroupElements: (groupId: string) => {
      // TODO: Implement ungrouping logic
    },
    
    // Layer operations
    showElement: (elementId: string) => {
      get().updateElement(elementId, {
        style: {
          ...get().board?.elements[elementId]?.style,
          opacity: 1,
        },
      });
    },
    
    hideElement: (elementId: string) => {
      get().updateElement(elementId, {
        style: {
          ...get().board?.elements[elementId]?.style,
          opacity: 0,
        },
      });
    },
    
    lockElement: (elementId: string) => {
      get().updateElement(elementId, {
        permissions: {
          ...get().board?.elements[elementId]?.permissions,
          movable: false,
          resizable: false,
          editable: false,
        },
      });
    },
    
    unlockElement: (elementId: string) => {
      get().updateElement(elementId, {
        permissions: {
          ...get().board?.elements[elementId]?.permissions,
          movable: true,
          resizable: true,
          editable: true,
        },
      });
    },
    
    // Search and filter
    searchElements: (query: string) => {
      const { board } = get();
      if (!board) return [];
      
      return Object.values(board.elements).filter(element => 
        JSON.stringify(element.data).toLowerCase().includes(query.toLowerCase())
      );
    },
    
    filterElements: (filter: (element: CanvasElement) => boolean) => {
      const { board } = get();
      if (!board) return [];
      
      return Object.values(board.elements).filter(filter);
    },
    
    // Performance
    updateFPS: (fps: number) => {
      set({ fps });
    },
    
    incrementRenderCount: () => {
      set({ renderCount: get().renderCount + 1 });
    },
    
    // Utilities
    getElementById: (id: string) => {
      const { board } = get();
      return board?.elements[id] || null;
    },
    
    getElementBounds: (id: string) => {
      const element = get().getElementById(id);
      if (!element) return null;
      
      // TODO: Calculate actual bounds based on element type and transform
      return {
        x: element.transform.x,
        y: element.transform.y,
        width: element.data.width || 100,
        height: element.data.height || 100,
      };
    },
    
    getElementsInBounds: (bounds) => {
      const { board } = get();
      if (!board) return [];
      
      return Object.values(board.elements).filter(element => {
        const elementBounds = get().getElementBounds(element.id);
        if (!elementBounds) return false;
        
        return (
          elementBounds.x < bounds.x + bounds.width &&
          elementBounds.x + elementBounds.width > bounds.x &&
          elementBounds.y < bounds.y + bounds.height &&
          elementBounds.y + elementBounds.height > bounds.y
        );
      });
    },
    
    getSelectionBounds: () => {
      const { selection, board } = get();
      if (!board || selection.selectedIds.length === 0) return null;
      
      const selectedElements = selection.selectedIds
        .map(id => get().getElementBounds(id))
        .filter(bounds => bounds !== null);
      
      if (selectedElements.length === 0) return null;
      
      const minX = Math.min(...selectedElements.map(b => b!.x));
      const minY = Math.min(...selectedElements.map(b => b!.y));
      const maxX = Math.max(...selectedElements.map(b => b!.x + b!.width));
      const maxY = Math.max(...selectedElements.map(b => b!.y + b!.height));
      
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    },
    
    // Frames (placeholder implementations)
    addFrame: (frameData) => {
      // TODO: Implement frame creation
      return nanoid();
    },
    
    updateFrame: (id: string, changes: Partial<Frame>) => {
      // TODO: Implement frame update
    },
    
    deleteFrame: (id: string) => {
      // TODO: Implement frame deletion
    },
    
    addElementToFrame: (elementId: string, frameId: string) => {
      // TODO: Implement adding element to frame
    },
    
    removeElementFromFrame: (elementId: string) => {
      // TODO: Implement removing element from frame
    },
    
    // Connectors (placeholder implementations)
    addConnector: (connectorData) => {
      // TODO: Implement connector creation
      return nanoid();
    },
    
    updateConnector: (id: string, changes: Partial<Connector>) => {
      // TODO: Implement connector update
    },
    
    deleteConnector: (id: string) => {
      // TODO: Implement connector deletion
    },
  }))
);