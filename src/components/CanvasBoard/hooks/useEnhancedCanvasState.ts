import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement } from '../types';
import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasLayerState } from './useCanvasLayerState';
import { useRefactoredCanvasInteraction } from './useRefactoredCanvasInteraction';

const defaultElement = {
  id: uuidv4(),
  type: 'rectangle',
  position: { x: 50, y: 50 },
  size: { width: 100, height: 100 },
  fill: 'red',
  stroke: 'black',
  strokeWidth: 2,
  rotation: 0,
  opacity: 1,
  zIndex: 1,
  locked: false,
  properties: {}
};

export const useEnhancedCanvasState = (projectId: string, userId: string) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
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

  const { history, historyIndex, saveStep, undo, redo } = useCanvasHistory(elements, setElements);
  const { layers, setLayers, selectedLayerId, setSelectedLayerId, handleLayerUpdate, handleLayerSelect } = useCanvasLayerState();

  // Use the refactored interaction hook
  const interaction = useRefactoredCanvasInteraction(canvasRef);

  const addElement = useCallback((type: string, x: number, y: number, width?: number, height?: number, text?: string) => {
    const newElement: CanvasElement = {
      ...defaultElement,
      id: uuidv4(),
      type,
      position: { x: x || 50, y: y || 50 },
      size: { width: width || 100, height: height || 100 },
      properties: { text: text || 'نص تجريبي' }
    };
    setElements(prevElements => {
      const newElements = [...prevElements, newElement];
      saveStep(newElements);
      return newElements;
    });
  }, [setElements, saveStep]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prevElements => {
      const newElements = prevElements.map(element =>
        element.id === elementId ? { ...element, ...updates } : element
      );
      saveStep(newElements);
      return newElements;
    });
  }, [setElements, saveStep]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prevElements => {
      const newElements = prevElements.filter(element => element.id !== elementId);
      saveStep(newElements);
      return newElements;
    });
  }, [setElements, saveStep]);

  const handleCopy = useCallback(() => {
    if (selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      if (element) {
        navigator.clipboard.writeText(JSON.stringify(element));
      }
    }
  }, [selectedElementId, elements]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const element = JSON.parse(text);
      if (element && element.type) {
        addElement(element.type, element.position.x + 10, element.position.y + 10, element.size.width, element.size.height);
      }
    } catch (error) {
      console.error('Could not paste element', error);
    }
  }, [addElement]);

  const handleCut = useCallback(() => {
    handleCopy();
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  }, [handleCopy, deleteElement, selectedElementId]);

  const handleGroup = useCallback(() => {
    // Logic to group selected elements
  }, []);

  const handleUngroup = useCallback(() => {
    // Logic to ungroup selected elements
  }, []);

  const handleLock = useCallback(() => {
    if (selectedElementId) {
      updateElement(selectedElementId, { locked: true });
    }
  }, [selectedElementId, updateElement]);

  const handleUnlock = useCallback(() => {
    if (selectedElementId) {
      updateElement(selectedElementId, { locked: false });
    }
  }, [selectedElementId, updateElement]);

  const handleAlignToGrid = useCallback(() => {
    // Logic to align selected elements to the grid
  }, []);

  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
  }, [setGridSize]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    setSelectedElementId(null);
    setSelectedElementIds([]);
  }, [setSelectedElementId, setSelectedElementIds]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') return;

    if (selectedTool === 'text') {
      interaction.handleTextClick(e, zoom, canvasPosition, addElement, snapEnabled);
      return;
    }

    if (['shape', 'smart-element', 'text-box'].includes(selectedTool)) {
      interaction.handleDragCreate(e, selectedTool, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'smart-pen') {
      interaction.handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
      return;
    }
  }, [selectedTool, zoom, canvasPosition, addElement, snapEnabled, interaction]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'hand') {
      // Handle pan
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, interaction]);

  const handleCanvasMouseUp = useCallback(() => {
    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateEnd(selectedTool, addElement);
      return;
    }

    if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenEnd(addElement);
      return;
    }

    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionEnd(elements, setSelectedElementIds);
      return;
    }
  }, [selectedTool, elements, addElement, setSelectedElementIds, interaction]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    interaction.handleElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId, selectedElementIds, setSelectedElementIds);
  }, [selectedTool, elements, zoom, canvasPosition, setSelectedElementId, selectedElementIds, setSelectedElementIds, interaction]);

  const handleElementMouseMove = useCallback((e: React.MouseEvent) => {
    interaction.handleElementMouseMove(e, selectedElementIds, zoom, canvasPosition, updateElement, snapEnabled);
  }, [selectedElementIds, zoom, canvasPosition, updateElement, snapEnabled, interaction]);

  const handleElementMouseUp = useCallback(() => {
    interaction.handleElementMouseUp();
  }, [interaction]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    // Logic for resize start
  }, []);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    // Logic for resize move
  }, []);

  return {
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
    history,
    historyIndex,
    saveStep,
    undo,
    redo,
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    handleLayerUpdate,
    handleLayerSelect,
    addElement,
    updateElement,
    deleteElement,
    handleCopy,
    handlePaste,
    handleCut,
    handleGroup,
    handleUngroup,
    handleLock,
    handleUnlock,
    handleAlignToGrid,
    handleGridSizeChange,

    // Interaction properties from the refactored hook
    isDrawing: interaction.isDrawing,
    drawStart: interaction.drawStart,
    drawEnd: interaction.drawEnd,
    isDragging: interaction.isDragging,
    isResizing: interaction.isResizing,
    isSelecting: interaction.isSelecting,
    selectionBox: interaction.selectionBox,
    
    // Interaction methods from the refactored hook
    handleSelectionStart: interaction.handleSelectionStart,
    handleSelectionMove: interaction.handleSelectionMove,
    handleSelectionEnd: interaction.handleSelectionEnd,
    handleSmartPenStart: interaction.handleSmartPenStart,
    handleSmartPenMove: interaction.handleSmartPenMove,
    handleSmartPenEnd: interaction.handleSmartPenEnd,
    handleDragCreate: interaction.handleDragCreate,
    handleDragCreateMove: interaction.handleDragCreateMove,
    handleDragCreateEnd: interaction.handleDragCreateEnd,
    handleTextClick: interaction.handleTextClick,
    handleElementMouseDown: interaction.handleElementMouseDown,
    handleElementMouseMove: interaction.handleElementMouseMove,
    handleElementMouseUp: interaction.handleElementMouseUp,
  };
};
