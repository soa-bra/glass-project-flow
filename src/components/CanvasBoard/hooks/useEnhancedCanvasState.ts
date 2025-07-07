import { useCallback } from 'react';
import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasElements } from './useCanvasElements';
import { useCanvasActions } from './useCanvasActions';
import { useEnhancedCanvasInteraction } from './useEnhancedCanvasInteraction';
import { useKeyboardControls } from './useKeyboardControls';
import { useCanvasBasicState } from './useCanvasBasicState';
import { useCanvasEnhancedState } from './useCanvasEnhancedState';
import { useCanvasComments } from './useCanvasComments';
import { useCanvasManipulation } from './useCanvasManipulation';
import { useCanvasSelection } from './useCanvasSelection';
import { useCanvasInteractionHandlers } from './useCanvasInteractionHandlers';

export const useEnhancedCanvasState = (projectId = 'default', userId = 'user1') => {
  // Use specialized state hooks
  const basicState = useCanvasBasicState();
  const enhancedState = useCanvasEnhancedState();
  const commentsState = useCanvasComments(userId);
  
  // Use specialized hooks for canvas functionality
  const { history, historyIndex, saveToHistory, undo, redo } = useCanvasHistory();
  const { elements, setElements, addElement, updateElement, deleteElement } = useCanvasElements(saveToHistory);
  const { saveCanvas, exportCanvas, convertToProject } = useCanvasActions(projectId, userId);
  
  // Use enhanced interaction hook
  const {
    canvasRef,
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    isSelecting,
    selectionBox,
  } = useEnhancedCanvasInteraction();

  // Use manipulation hooks
  const manipulationActions = useCanvasManipulation(
    basicState.selectedElements,
    elements,
    updateElement
  );

  const selectionActions = useCanvasSelection(
    basicState.selectedElements,
    elements,
    enhancedState.fitPadding,
    basicState.setZoom,
    basicState.setCanvasPosition
  );

  // Enhanced element wrappers
  const wrappedAddElement = useCallback((x: number, y: number, width?: number, height?: number) => {
    addElement(x, y, basicState.selectedTool, basicState.selectedSmartElement, width, height);
  }, [addElement, basicState.selectedTool, basicState.selectedSmartElement]);

  const wrappedDeleteElement = useCallback((elementId: string) => {
    deleteElement(elementId);
    basicState.setSelectedElementId(null);
    basicState.setSelectedElements([]);
  }, [deleteElement, basicState.setSelectedElementId, basicState.setSelectedElements]);

  // Use interaction handlers hook
  const interactionHandlers = useCanvasInteractionHandlers(
    basicState.selectedTool,
    basicState.zoom,
    basicState.canvasPosition,
    basicState.snapEnabled,
    basicState.selectedSmartElement,
    isSelecting,
    isDrawing,
    addElement,
    basicState.setSelectedElements,
    elements,
    basicState.selectedElements,
    updateElement,
    basicState.setSelectedElementId,
    canvasRef
  );

  // Legacy wrapper functions
  const wrappedUndo = useCallback(() => undo(elements, setElements), [undo, elements, setElements]);
  const wrappedRedo = useCallback(() => redo(elements, setElements), [redo, elements, setElements]);
  const wrappedSaveCanvas = useCallback(() => saveCanvas(elements), [saveCanvas, elements]);
  const wrappedExportCanvas = useCallback(() => exportCanvas(elements), [exportCanvas, elements]);

  // Keyboard controls
  useKeyboardControls({
    selectedElementId: basicState.selectedElementId,
    elements,
    updateElement,
    deleteElement: wrappedDeleteElement,
    setSelectedElementId: basicState.setSelectedElementId
  });

  return {
    // Basic state from useCanvasBasicState
    ...basicState,
    
    // Enhanced state from useCanvasEnhancedState
    ...enhancedState,
    
    // Comments state from useCanvasComments
    ...commentsState,
    
    // Canvas functionality
    elements,
    setElements,
    canvasRef,
    history,
    historyIndex,
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    isSelecting,
    selectionBox,
    
    // Canvas interaction - using the interaction handlers
    ...interactionHandlers,
    
    // Manipulation actions
    ...manipulationActions,
    
    // Selection actions
    ...selectionActions,
    
    // Legacy actions
    addElement: wrappedAddElement,
    undo: wrappedUndo,
    redo: wrappedRedo,
    saveCanvas: wrappedSaveCanvas,
    exportCanvas: wrappedExportCanvas,
    convertToProject,
    updateElement,
    deleteElement: wrappedDeleteElement,
    
    // Helper functions
    handleAlignToGrid: () => console.log('محاذاة للشبكة'),
    handleGroup: () => console.log('تجميع العناصر'),
    handleUngroup: () => console.log('إلغاء تجميع العناصر'),
    handleLock: () => console.log('قفل العناصر'),
    handleUnlock: () => console.log('إلغاء قفل العناصر')
  };
};