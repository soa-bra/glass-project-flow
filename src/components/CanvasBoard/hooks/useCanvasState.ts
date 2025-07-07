import { useState } from 'react';
import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasElements } from './useCanvasElements';
import { useCanvasActions } from './useCanvasActions';
import { useCanvasInteraction } from './useCanvasInteraction';
import { useKeyboardControls } from './useKeyboardControls';

export const useCanvasState = (projectId = 'default', userId = 'user1') => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20);
  const [showDefaultView, setShowDefaultView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedSmartElement, setSelectedSmartElement] = useState<string>('brainstorm');
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'الطبقة الأساسية', visible: true, locked: false, elements: [] }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');

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
    handleCanvasMouseDown(e, selectedTool, zoom, canvasPosition, snapEnabled);
  
  const wrappedHandleCanvasMouseMove = (e: React.MouseEvent) => 
    handleCanvasMouseMove(e, zoom, canvasPosition, snapEnabled);
  
  const wrappedHandleCanvasMouseUp = () => 
    handleCanvasMouseUp(wrappedAddElement);
  
  const wrappedHandleCanvasClick = (e: React.MouseEvent) => 
    handleCanvasClick(e, selectedTool, zoom, canvasPosition, wrappedAddElement, snapEnabled);
  
  const wrappedHandleElementMouseDown = (e: React.MouseEvent, elementId: string) => 
    handleElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId);
  
  const wrappedHandleElementMouseMove = (e: React.MouseEvent) => 
    handleElementMouseMove(e, selectedElementId, zoom, canvasPosition, updateElement, snapEnabled);
  
  const wrappedHandleResizeMouseDown = (e: React.MouseEvent, handle: string) => 
    handleResizeMouseDown(e, handle, selectedTool);
  
  const wrappedHandleResizeMouseMove = (e: React.MouseEvent) => 
    handleResizeMouseMove(e, selectedElementId, elements, zoom, canvasPosition, updateElement);

  const wrappedDeleteElement = (elementId: string) => {
    deleteElement(elementId);
    setSelectedElementId(null);
    setSelectedElements([]);
  };

  // Update selectedElements when selectedElementId changes
  const updateSelectedElements = (elementId: string | null) => {
    if (elementId) {
      setSelectedElements([elementId]);
    } else {
      setSelectedElements([]);
    }
    setSelectedElementId(elementId);
  };

  // تفعيل التحكم بلوحة المفاتيح
  useKeyboardControls({
    selectedElementId,
    elements,
    updateElement,
    deleteElement: wrappedDeleteElement,
    setSelectedElementId
  });

  // Helper functions for new tools
  const handleGridSizeChange = (size: number) => {
    setGridSize(size);
  };

  const handleAlignToGrid = () => {
    console.log('محاذاة العناصر للشبكة');
  };

  const handleLayerUpdate = (newLayers: any[]) => {
    setLayers(newLayers);
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  const handleGroup = () => {
    console.log('تجميع العناصر');
  };

  const handleUngroup = () => {
    console.log('إلغاء تجميع العناصر');
  };

  const handleLock = () => {
    console.log('قفل العناصر');
  };

  const handleUnlock = () => {
    console.log('إلغاء قفل العناصر');
  };

  return {
    // State
    selectedTool,
    selectedElementId,
    selectedElements,
    showGrid,
    snapEnabled,
    gridSize,
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
    layers,
    selectedLayerId,
    
    // Setters
    setSelectedTool,
    setSelectedElementId: updateSelectedElements,
    setSelectedElements,
    setShowGrid,
    setSnapEnabled,
    setGridSize,
    setElements,
    setShowDefaultView,
    setSearchQuery,
    setZoom,
    setCanvasPosition,
    setSelectedSmartElement,
    setLayers,
    setSelectedLayerId,
    
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
    deleteElement: wrappedDeleteElement,
    
    // New tool handlers
    handleGridSizeChange,
    handleAlignToGrid,
    handleLayerUpdate,
    handleLayerSelect,
    handleGroup,
    handleUngroup,
    handleLock,
    handleUnlock
  };
};