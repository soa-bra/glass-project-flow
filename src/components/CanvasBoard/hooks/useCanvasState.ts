import { useState } from 'react';
import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasElements } from './useCanvasElements';
import { useCanvasActions } from './useCanvasActions';
import { useCanvasInteraction } from './useCanvasInteraction';

export const useCanvasState = (projectId = 'default', userId = 'user1') => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [showDefaultView, setShowDefaultView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedSmartElement, setSelectedSmartElement] = useState<string>('brainstorm');

  // Use specialized hooks
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

  // Wrapper functions for hooks that need current state
  const wrappedAddElement = (x: number, y: number, width?: number, height?: number) => {
    addElement(x, y, selectedTool, selectedSmartElement, width, height);
  };

  const wrappedUndo = () => undo(elements, setElements);
  const wrappedRedo = () => redo(elements, setElements);
  const wrappedSaveCanvas = () => saveCanvas(elements);
  const wrappedExportCanvas = () => exportCanvas(elements);
  const wrappedConvertToProject = () => convertToProject(elements);

  const wrappedHandleCanvasMouseDown = (e: React.MouseEvent) => 
    handleCanvasMouseDown(e, selectedTool, zoom, canvasPosition);
  
  const wrappedHandleCanvasMouseMove = (e: React.MouseEvent) => 
    handleCanvasMouseMove(e, zoom, canvasPosition);
  
  const wrappedHandleCanvasMouseUp = () => 
    handleCanvasMouseUp(wrappedAddElement);
  
  const wrappedHandleCanvasClick = (e: React.MouseEvent) => 
    handleCanvasClick(e, selectedTool, zoom, canvasPosition, wrappedAddElement);
  
  const wrappedHandleElementMouseDown = (e: React.MouseEvent, elementId: string) => 
    handleElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId);
  
  const wrappedHandleElementMouseMove = (e: React.MouseEvent) => 
    handleElementMouseMove(e, selectedElementId, zoom, canvasPosition, updateElement);
  
  const wrappedHandleResizeMouseDown = (e: React.MouseEvent, handle: string) => 
    handleResizeMouseDown(e, handle, selectedTool);
  
  const wrappedHandleResizeMouseMove = (e: React.MouseEvent) => 
    handleResizeMouseMove(e, selectedElementId, elements, zoom, canvasPosition, updateElement);

  const wrappedDeleteElement = (elementId: string) => {
    deleteElement(elementId);
    setSelectedElementId(null);
  };

  return {
    // State
    selectedTool,
    selectedElementId,
    showGrid,
    snapEnabled,
    elements,
    showDefaultView,
    searchQuery,
    zoom,
    canvasPosition,
    canvasRef,
    history,
    historyIndex,
    isDrawing,
    drawStart,
    drawEnd,
    selectedSmartElement,
    isDragging,
    isResizing,
    
    // Setters
    setSelectedTool,
    setSelectedElementId,
    setShowGrid,
    setSnapEnabled,
    setElements,
    setShowDefaultView,
    setSearchQuery,
    setZoom,
    setCanvasPosition,
    setSelectedSmartElement,
    
    // Actions
    addElement: wrappedAddElement,
    handleCanvasClick: wrappedHandleCanvasClick,
    handleCanvasMouseDown: wrappedHandleCanvasMouseDown,
    handleCanvasMouseMove: wrappedHandleCanvasMouseMove,
    handleCanvasMouseUp: wrappedHandleCanvasMouseUp,
    handleElementMouseDown: wrappedHandleElementMouseDown,
    handleElementMouseMove: wrappedHandleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown: wrappedHandleResizeMouseDown,
    handleResizeMouseMove: wrappedHandleResizeMouseMove,
    undo: wrappedUndo,
    redo: wrappedRedo,
    saveCanvas: wrappedSaveCanvas,
    exportCanvas: wrappedExportCanvas,
    convertToProject: wrappedConvertToProject,
    updateElement,
    deleteElement: wrappedDeleteElement
  };
};