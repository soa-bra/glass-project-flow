import { useState, useCallback, useEffect } from 'react';
import { aiService, CanvasState } from '@/services/aiService';

/**
 * Interface for canvas element
 */
export interface CanvasElement {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'line' | 'image' | 'group';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  content?: string;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
  };
  layerId?: string;
  locked?: boolean;
  visible?: boolean;
  rotation?: number;
  children?: string[]; // For groups
}

/**
 * Interface for canvas layer
 */
export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  order: number;
  elementIds: string[];
  type: 'layer' | 'group';
  parent?: string;
  children?: CanvasLayer[];
}

/**
 * Interface for canvas viewport
 */
export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

/**
 * Hook for managing canvas state with AI integration
 */
export const useCanvasState = () => {
  // Canvas elements state
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  
  // Canvas layers state
  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  
  // Canvas viewport state
  const [viewport, setViewport] = useState<CanvasViewport>({
    x: 0,
    y: 0,
    zoom: 1.0,
    width: 1200,
    height: 800
  });
  
  // Current tool state
  const [currentTool, setCurrentTool] = useState<string>('select');
  
  // History state for undo/redo
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  /**
   * Initialize canvas with default elements and layers
   */
  useEffect(() => {
    const defaultElements: CanvasElement[] = [
      {
        id: 'elem-1',
        type: 'rectangle',
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        style: {
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
          opacity: 0.8
        },
        layerId: 'layer-1'
      },
      {
        id: 'elem-2',
        type: 'text',
        x: 150,
        y: 50,
        width: 100,
        height: 30,
        content: 'Sample Text',
        style: {
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#1f2937'
        },
        layerId: 'layer-2'
      },
      {
        id: 'elem-3',
        type: 'circle',
        x: 350,
        y: 200,
        radius: 75,
        style: {
          fill: '#10b981',
          stroke: '#059669',
          strokeWidth: 2,
          opacity: 0.7
        },
        layerId: 'layer-1'
      }
    ];

    const defaultLayers: CanvasLayer[] = [
      {
        id: 'layer-1',
        name: 'Background',
        visible: true,
        locked: false,
        order: 0,
        elementIds: ['elem-1', 'elem-3'],
        type: 'layer'
      },
      {
        id: 'layer-2',
        name: 'Text Layer',
        visible: true,
        locked: false,
        order: 1,
        elementIds: ['elem-2'],
        type: 'layer'
      }
    ];

    if (elements.length === 0) {
      setElements(defaultElements);
      setLayers(defaultLayers);
    }
  }, [elements.length]);

  /**
   * Get current canvas state for AI context
   */
  const getCanvasState = useCallback((): CanvasState => {
    return {
      elements,
      selectedElements: selectedElementIds,
      viewportBounds: {
        x: viewport.x,
        y: viewport.y,
        width: viewport.width,
        height: viewport.height
      },
      zoom: viewport.zoom,
      tool: currentTool,
      layers
    };
  }, [elements, selectedElementIds, viewport, currentTool, layers]);

  /**
   * Add element to canvas
   */
  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: `elem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    setElements(prev => [...prev, newElement]);
    
    // Add to current layer if specified
    if (element.layerId) {
      setLayers(prev => prev.map(layer => 
        layer.id === element.layerId 
          ? { ...layer, elementIds: [...layer.elementIds, newElement.id] }
          : layer
      ));
    }
    
    return newElement.id;
  }, []);

  /**
   * Update element properties
   */
  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(element => 
      element.id === elementId 
        ? { ...element, ...updates }
        : element
    ));
  }, []);

  /**
   * Delete element from canvas
   */
  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(element => element.id !== elementId));
    setSelectedElementIds(prev => prev.filter(id => id !== elementId));
    
    // Remove from layers
    setLayers(prev => prev.map(layer => ({
      ...layer,
      elementIds: layer.elementIds.filter(id => id !== elementId)
    })));
  }, []);

  /**
   * Select elements
   */
  const selectElements = useCallback((elementIds: string[], multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedElementIds(prev => {
        const newIds = elementIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    } else {
      setSelectedElementIds(elementIds);
    }
  }, []);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedElementIds([]);
  }, []);

  /**
   * Update viewport (pan and zoom)
   */
  const updateViewport = useCallback((updates: Partial<CanvasViewport>) => {
    setViewport(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set current tool
   */
  const setTool = useCallback((tool: string) => {
    setCurrentTool(tool);
  }, []);

  /**
   * Save state to history for undo/redo
   */
  const saveToHistory = useCallback(() => {
    const currentState = getCanvasState();
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [getCanvasState, historyIndex]);

  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setElements(previousState.elements as CanvasElement[]);
      setLayers(previousState.layers as CanvasLayer[]);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  /**
   * Redo last undone action
   */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setElements(nextState.elements as CanvasElement[]);
      setLayers(nextState.layers as CanvasLayer[]);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  /**
   * Export canvas state for AI or external use
   */
  const exportState = useCallback(() => {
    return {
      elements,
      layers,
      viewport,
      selectedElementIds,
      selectedLayerIds,
      currentTool
    };
  }, [elements, layers, viewport, selectedElementIds, selectedLayerIds, currentTool]);

  return {
    // State
    elements,
    selectedElementIds,
    layers,
    selectedLayerIds,
    viewport,
    currentTool,
    
    // Element operations
    addElement,
    updateElement,
    deleteElement,
    selectElements,
    clearSelection,
    
    // Layer operations
    setLayers,
    setSelectedLayerIds,
    
    // Viewport operations
    updateViewport,
    setTool,
    
    // History operations
    saveToHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    
    // State export
    getCanvasState,
    exportState,
    
    // AI integration
    aiService
  };
};