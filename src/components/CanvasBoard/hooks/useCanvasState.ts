import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasElements } from './useCanvasElements';
import { useCanvasActions } from './useCanvasActions';
import { useCanvasInteraction } from './useCanvasInteraction';
import { useKeyboardControls } from './useKeyboardControls';
import { useCanvasToolState } from './useCanvasToolState';
import { useCanvasViewState } from './useCanvasViewState';
import { useCanvasSelectionState } from './useCanvasSelectionState';
import { useCanvasLayerState } from './useCanvasLayerState';
import { useCanvasToolActions } from './useCanvasToolActions';
import { useCanvasInteractionWrappers } from './useCanvasInteractionWrappers';

export const useCanvasState = (projectId = 'default', userId = 'user1') => {
  // Use specialized state hooks
  const toolState = useCanvasToolState();
  const viewState = useCanvasViewState();
  const selectionState = useCanvasSelectionState();
  const layerState = useCanvasLayerState();

  // Use specialized functionality hooks
  const { history, historyIndex, saveToHistory, undo, redo } = useCanvasHistory();
  const { elements, setElements, addElement, updateElement, deleteElement } = useCanvasElements(saveToHistory);
  const { saveCanvas, exportCanvas, convertToProject } = useCanvasActions(projectId, userId);
  const {
    canvasRef,
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasClick,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove
  } = useCanvasInteraction();

  // Tool actions
  const toolActions = useCanvasToolActions(viewState.gridSize, viewState.setGridSize);

  // Interaction wrappers
  const interactionWrappers = useCanvasInteractionWrappers(
    toolState.selectedTool,
    toolState.selectedSmartElement,
    selectionState.selectedElementId,
    elements,
    viewState.zoom,
    viewState.canvasPosition,
    viewState.snapEnabled,
    addElement,
    updateElement,
    selectionState.setSelectedElementId,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasClick,
    handleElementMouseDown,
    handleElementMouseMove,
    handleResizeMouseDown,
    handleResizeMouseMove
  );

  // Wrapper functions for actions
  const wrappedDeleteElement = (elementId: string) => {
    deleteElement(elementId);
    selectionState.setSelectedElementId(null);
    selectionState.setSelectedElements([]);
  };

  const wrappedUndo = () => undo(elements, setElements);
  const wrappedRedo = () => redo(elements, setElements);
  const wrappedSaveCanvas = () => saveCanvas(elements);
  const wrappedExportCanvas = () => exportCanvas(elements);
  const wrappedConvertToProject = () => convertToProject(elements);

  // Keyboard controls
  useKeyboardControls({
    selectedElementId: selectionState.selectedElementId,
    elements,
    updateElement,
    deleteElement: wrappedDeleteElement,
    setSelectedElementId: selectionState.setSelectedElementId
  });

  return {
    // Tool state
    ...toolState,
    
    // View state
    ...viewState,
    
    // Selection state
    ...selectionState,
    
    // Layer state
    ...layerState,
    
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
    
    // Interaction handlers
    ...interactionWrappers,
    handleElementMouseUp,
    
    // Actions
    undo: wrappedUndo,
    redo: wrappedRedo,
    saveCanvas: wrappedSaveCanvas,
    exportCanvas: wrappedExportCanvas,
    convertToProject: wrappedConvertToProject,
    updateElement,
    deleteElement: wrappedDeleteElement,
    
    // Tool actions
    ...toolActions,
  };
};