
import { useState, useCallback, useRef } from 'react';
import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasLayerState } from './useCanvasLayerState';
import { useRefactoredCanvasInteraction } from './useRefactoredCanvasInteraction';
import { useCanvasElementManagement } from './useCanvasElementManagement';
import { useCanvasClipboardActions } from './useCanvasClipboardActions';
import { useCanvasElementActions } from './useCanvasElementActions';
import { useCanvasFileActions } from './useCanvasFileActions';
import { useRefactoredCanvasEventHandlers as useCanvasEventHandlers } from './useRefactoredCanvasEventHandlers';

export const useEnhancedCanvasState = (projectId: string, userId: string) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Basic state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedSmartElement, setSelectedSmartElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showDefaultView, setShowDefaultView] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<number>(24);
  const [panSpeed, setPanSpeed] = useState<number>(5);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineStyle, setLineStyle] = useState<string>('solid');
  const [selectedPenMode, setSelectedPenMode] = useState<string>('smart-draw');

  // Specialized hooks - ترتيب الاستدعاء مهم
  const { history, historyIndex, saveToHistory, undo, redo } = useCanvasHistory();
  const { layers, setLayers, selectedLayerId, setSelectedLayerId, handleLayerUpdate, handleLayerSelect, updateSingleLayer } = useCanvasLayerState();
  const interaction = useRefactoredCanvasInteraction(canvasRef);
  
  // إدارة العناصر أولاً
  const { elements, setElements, addElement, updateElement, deleteElement } = useCanvasElementManagement(saveToHistory);
  
  // ثم إجراءات العناصر (تحتاج elements و selectedElementIds)
  const elementActions = useCanvasElementActions({
    selectedElementIds,
    elements,
    updateElement,
    deleteElement,
    addElement
  });
  
  // إجراءات clipboard (تحتاج نفس البيانات)
  const clipboardActions = useCanvasClipboardActions({
    selectedElementIds,
    elements,
    addElement,
    deleteElement,
    setElements,
    saveToHistory
  });
  
  // File actions
  const fileActions = useCanvasFileActions(projectId, userId, elements);
  
  // Selection functions
  const clearSelection = useCallback(() => {
    setSelectedElementIds([]);
    setSelectedElementId(null);
  }, []);

  const selectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
    setSelectedElementIds([elementId]);
  }, []);

  // Create wrapper for addElement
  const addElementWrapper = useCallback((element: any) => {
    addElement(element.type, element.x, element.y, element.width, element.height, element.content);
  }, [addElement]);

  // Event handlers
  const eventHandlers = useCanvasEventHandlers(
    selectedTool,
    zoom,
    canvasPosition,
    snapEnabled,
    interaction,
    addElementWrapper,
    elements,
    selectedElementIds,
    clearSelection,
    setSelectedElementIds,
    selectElement,
    updateElement,
    setCanvasPosition,
    setZoom
  );

  // Grid helper function
  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
  }, []);

  // Wrapper functions for undo/redo with correct signatures
  const wrappedUndo = useCallback(() => {
    const undoResult = undo();
    if (undoResult) {
      setElements(undoResult);
    }
  }, [undo, setElements]);

  const wrappedRedo = useCallback(() => {
    const redoResult = redo();
    if (redoResult) {
      setElements(redoResult);
    }
  }, [redo, setElements]);

  return {
    // Canvas ref and basic state
    canvasRef,
    elements,
    setElements,
    selectedElementId,
    setSelectedElementId,
    selectedElementIds,
    setSelectedElementIds,
    selectedSmartElement,
    setSelectedSmartElement,
    zoom,
    setZoom,
    canvasPosition,
    setCanvasPosition,
    showDefaultView,
    setShowDefaultView,
    showGrid,
    setShowGrid,
    snapEnabled,
    setSnapEnabled,
    gridSize,
    setGridSize,
    panSpeed,
    setPanSpeed,
    selectedTool,
    setSelectedTool,
    lineWidth,
    setLineWidth,
    lineStyle,
    setLineStyle,
    selectedPenMode,
    setSelectedPenMode,
    
    // History
    history,
    historyIndex,
    saveToHistory,
    undo: wrappedUndo,
    redo: wrappedRedo,
    
    // Layers
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    handleLayerUpdate,
    handleLayerSelect,
    updateSingleLayer,
    
    // Element management
    addElement,
    updateElement,
    deleteElement,
    
    // Clipboard actions
    ...clipboardActions,
    
    // Element actions
    ...elementActions,
    handleGridSizeChange,
    
    // File actions
    ...fileActions,

    // Interaction properties from the refactored hook
    isDrawing: interaction.isDrawing,
    drawStart: interaction.drawStart,
    drawEnd: interaction.drawEnd,
    isDragging: interaction.isDragging,
    isResizing: interaction.isResizing,
    isSelecting: interaction.isSelecting,
    selectionBox: interaction.selectionBox,
    
    // Event handlers (wrapped to match expected signatures)
    handleCanvasClick: eventHandlers.handleCanvasClick,
    handleCanvasMouseDown: eventHandlers.handleCanvasMouseDown,
    handleCanvasMouseMove: eventHandlers.handleCanvasMouseMove,
    handleCanvasMouseUp: () => eventHandlers.handleCanvasMouseUp({} as React.MouseEvent),
    handleElementMouseDown: eventHandlers.handleElementMouseDown,
    handleElementMouseMove: eventHandlers.handleElementMouseMove,
    handleElementMouseUp: eventHandlers.handleElementMouseUp,
    handleResizeMouseDown: eventHandlers.handleResizeMouseDown,
    handleResizeMouseMove: eventHandlers.handleResizeMouseMove
  };
};
