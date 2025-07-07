import { useState, useCallback } from 'react';
import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasElements } from './useCanvasElements';
import { useCanvasActions } from './useCanvasActions';
import { useEnhancedCanvasInteraction } from './useEnhancedCanvasInteraction';
import { useKeyboardControls } from './useKeyboardControls';
import { CanvasElement } from '../types';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'ai';
  resolved: boolean;
  tags: string[];
}

export const useEnhancedCanvasState = (projectId = 'default', userId = 'user1') => {
  // Basic canvas state
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
  
  // Enhanced canvas state
  const [smoothZoom, setSmoothZoom] = useState<boolean>(true);
  const [zoomToMouse, setZoomToMouse] = useState<boolean>(true);
  const [fitPadding, setFitPadding] = useState<number>(20);
  const [panSpeed, setPanSpeed] = useState<number>(1);
  
  // Smart pen enhanced state
  const [penColor, setPenColor] = useState<string>('#000000');
  const [smoothing, setSmoothing] = useState<number>(50);
  const [snapSensitivity, setSnapSensitivity] = useState<number>(20);
  const [autoGroup, setAutoGroup] = useState<boolean>(true);
  const [smartRecognition, setSmartRecognition] = useState<boolean>(true);
  const [selectedPenMode, setSelectedPenMode] = useState<string>('smart-draw');
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineStyle, setLineStyle] = useState<string>('solid');
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentPenActive, setIsCommentPenActive] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [collaborators] = useState<string[]>(['محمد', 'فاطمة', 'أحمد']);
  
  // AI state
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);
  
  // Layers state
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'الطبقة الأساسية', visible: true, locked: false, elements: [] }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');

  // Use specialized hooks
  const { history, historyIndex, saveToHistory, undo, redo } = useCanvasHistory();
  const { elements, setElements, addElement, updateElement, deleteElement } = useCanvasElements(saveToHistory);
  const { saveCanvas, exportCanvas, convertToProject } = useCanvasActions(projectId, userId);
  // Use enhanced interaction hook instead
  const {
    canvasRef,
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    isSelecting,
    selectionBox,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    handleSmartPenStart,
    handleSmartPenMove,
    handleSmartPenEnd,
    handleDragCreate,
    handleDragCreateMove,
    handleDragCreateEnd,
    handleTextClick,
    handleElementMouseDown: enhancedElementMouseDown,
    handleElementMouseMove: enhancedElementMouseMove,
    handleElementMouseUp
  } = useEnhancedCanvasInteraction();

  // Enhanced selection handlers
  const handleCopy = useCallback(() => {
    if (selectedElements.length > 0) {
      console.log('نسخ العناصر:', selectedElements);
      // TODO: Implement copy functionality
    }
  }, [selectedElements]);

  const handleCut = useCallback(() => {
    if (selectedElements.length > 0) {
      console.log('قص العناصر:', selectedElements);
      // TODO: Implement cut functionality
    }
  }, [selectedElements]);

  const handlePaste = useCallback(() => {
    console.log('لصق العناصر');
    // TODO: Implement paste functionality
  }, []);

  const handleDuplicate = useCallback(() => {
    if (selectedElements.length > 0) {
      console.log('تكرار العناصر:', selectedElements);
      // TODO: Implement duplicate functionality
    }
  }, [selectedElements]);

  const handleFlipHorizontal = useCallback(() => {
    selectedElements.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        updateElement(elementId, {
          style: { ...element.style, transform: 'scaleX(-1)' }
        });
      }
    });
  }, [selectedElements, elements, updateElement]);

  const handleFlipVertical = useCallback(() => {
    selectedElements.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        updateElement(elementId, {
          style: { ...element.style, transform: 'scaleY(-1)' }
        });
      }
    });
  }, [selectedElements, elements, updateElement]);

  const handleRotate = useCallback((angle: number) => {
    selectedElements.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        const currentRotation = parseFloat(element.style?.rotation || '0');
        updateElement(elementId, {
          style: { ...element.style, rotation: `${currentRotation + angle}deg` }
        });
      }
    });
  }, [selectedElements, elements, updateElement]);

  const handleAlign = useCallback((type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedElements.length < 2) return;
    
    const selectedElementObjects = selectedElements
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean) as CanvasElement[];
    
    if (selectedElementObjects.length < 2) return;

    // Calculate alignment position
    let alignPosition = 0;
    switch (type) {
      case 'left':
        alignPosition = Math.min(...selectedElementObjects.map(el => el.position.x));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, x: alignPosition } });
        });
        break;
      case 'right':
        alignPosition = Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, x: alignPosition - el.size.width } });
        });
        break;
      case 'center':
        const centerX = (Math.min(...selectedElementObjects.map(el => el.position.x)) + 
                        Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width))) / 2;
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, x: centerX - el.size.width / 2 } });
        });
        break;
      case 'top':
        alignPosition = Math.min(...selectedElementObjects.map(el => el.position.y));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, y: alignPosition } });
        });
        break;
      case 'bottom':
        alignPosition = Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, y: alignPosition - el.size.height } });
        });
        break;
      case 'middle':
        const centerY = (Math.min(...selectedElementObjects.map(el => el.position.y)) + 
                        Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height))) / 2;
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, y: centerY - el.size.height / 2 } });
        });
        break;
    }
  }, [selectedElements, elements, updateElement]);

  const handleDistribute = useCallback((type: 'horizontal' | 'vertical') => {
    if (selectedElements.length < 3) return;
    
    const selectedElementObjects = selectedElements
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean) as CanvasElement[];
    
    if (selectedElementObjects.length < 3) return;

    if (type === 'horizontal') {
      selectedElementObjects.sort((a, b) => a.position.x - b.position.x);
      const totalWidth = Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width)) - 
                        Math.min(...selectedElementObjects.map(el => el.position.x));
      const spacing = totalWidth / (selectedElementObjects.length - 1);
      
      selectedElementObjects.forEach((el, index) => {
        if (index > 0 && index < selectedElementObjects.length - 1) {
          const newX = selectedElementObjects[0].position.x + (spacing * index);
          updateElement(el.id, { position: { ...el.position, x: newX } });
        }
      });
    } else {
      selectedElementObjects.sort((a, b) => a.position.y - b.position.y);
      const totalHeight = Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height)) - 
                         Math.min(...selectedElementObjects.map(el => el.position.y));
      const spacing = totalHeight / (selectedElementObjects.length - 1);
      
      selectedElementObjects.forEach((el, index) => {
        if (index > 0 && index < selectedElementObjects.length - 1) {
          const newY = selectedElementObjects[0].position.y + (spacing * index);
          updateElement(el.id, { position: { ...el.position, y: newY } });
        }
      });
    }
  }, [selectedElements, elements, updateElement]);

  // Comment handlers
  const handleAddComment = useCallback((text: string, type: 'text' | 'voice' | 'ai', tags: string[] = []) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text,
      author: userId,
      timestamp: new Date(),
      type,
      resolved: false,
      tags
    };
    setComments(prev => [...prev, newComment]);
  }, [userId]);

  const handleResolveComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ));
  }, []);

  const handleReplyToComment = useCallback((commentId: string, reply: string) => {
    console.log('الرد على التعليق:', commentId, reply);
    // TODO: Implement reply functionality
  }, []);

  // Enhanced zoom handlers  
  const handleFitToSelection = useCallback(() => {
    if (selectedElements.length === 0) return;
    
    const selectedElementObjects = selectedElements
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean) as CanvasElement[];
    
    if (selectedElementObjects.length === 0) return;

    // Calculate bounding box of selected elements
    const minX = Math.min(...selectedElementObjects.map(el => el.position.x));
    const minY = Math.min(...selectedElementObjects.map(el => el.position.y));
    const maxX = Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width));
    const maxY = Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height));
    
    const selectionWidth = maxX - minX;
    const selectionHeight = maxY - minY;
    
    // Calculate zoom to fit selection with padding
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const zoomX = (canvasWidth - fitPadding * 2) / selectionWidth * 100;
    const zoomY = (canvasHeight - fitPadding * 2) / selectionHeight * 100;
    const newZoom = Math.min(zoomX, zoomY, 300); // Max 300%
    
    setZoom(newZoom);
    setCanvasPosition({
      x: -(minX + selectionWidth / 2) + canvasWidth / 2,
      y: -(minY + selectionHeight / 2) + canvasHeight / 2
    });
  }, [selectedElements, elements, fitPadding]);

  // Update selectedElements when selectedElementId changes
  const updateSelectedElements = useCallback((elementId: string | null) => {
    if (elementId) {
      setSelectedElements([elementId]);
    } else {
      setSelectedElements([]);
    }
    setSelectedElementId(elementId);
  }, []);

  // Enhanced element wrappers
  const wrappedAddElement = useCallback((x: number, y: number, width?: number, height?: number) => {
    addElement(x, y, selectedTool, selectedSmartElement, width, height);
  }, [addElement, selectedTool, selectedSmartElement]);

  const wrappedDeleteElement = useCallback((elementId: string) => {
    deleteElement(elementId);
    setSelectedElementId(null);
    setSelectedElements([]);
  }, [deleteElement]);

  // Enhanced canvas interaction wrappers
  const wrappedHandleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
    } else if (selectedTool === 'smart-pen') {
      handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool)) {
      handleDragCreate(e, selectedTool, zoom, canvasPosition, snapEnabled);
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, handleSelectionStart, handleSmartPenStart, handleDragCreate]);
  
  const wrappedHandleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select' && isSelecting) {
      handleSelectionMove(e, zoom, canvasPosition, snapEnabled);
    } else if (selectedTool === 'smart-pen' && isDrawing) {
      handleSmartPenMove(e, zoom, canvasPosition, snapEnabled);
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && isDrawing) {
      handleDragCreateMove(e, zoom, canvasPosition, snapEnabled);
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, isSelecting, isDrawing, handleSelectionMove, handleSmartPenMove, handleDragCreateMove]);
  
  const wrappedHandleCanvasMouseUp = useCallback(() => {
    if (selectedTool === 'select' && isSelecting) {
      handleSelectionEnd(elements, (elementIds) => setSelectedElements(elementIds));
    } else if (selectedTool === 'smart-pen' && isDrawing) {
      handleSmartPenEnd((type, startX, startY, endX, endY) => {
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        addElement(x, y, type, selectedSmartElement, Math.max(width, 20), Math.max(height, 20));
      });
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && isDrawing) {
      handleDragCreateEnd(selectedTool, (type, x, y, width, height) => 
        addElement(x, y, type, selectedSmartElement, width, height)
      );
    }
  }, [selectedTool, isSelecting, isDrawing, elements, selectedSmartElement, addElement, handleSelectionEnd, handleSmartPenEnd, handleDragCreateEnd]);
  
  const wrappedHandleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'text') {
      handleTextClick(e, zoom, canvasPosition, (type, x, y) => 
        addElement(x, y, type, selectedSmartElement), snapEnabled);
    } else if (['sticky', 'comment', 'upload'].includes(selectedTool)) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
        const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
        addElement(x, y, selectedTool, selectedSmartElement);
      }
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, selectedSmartElement, addElement, handleTextClick, canvasRef]);

  const wrappedHandleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    enhancedElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId, selectedElements, setSelectedElements);
  }, [enhancedElementMouseDown, selectedTool, elements, zoom, canvasPosition, selectedElements]);

  const wrappedHandleElementMouseMove = useCallback((e: React.MouseEvent) => {
    enhancedElementMouseMove(e, selectedElements, zoom, canvasPosition, updateElement, snapEnabled);
  }, [enhancedElementMouseMove, selectedElements, zoom, canvasPosition, updateElement, snapEnabled]);

  // Simple resize handlers (using basic functionality for now)
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    if (selectedTool !== 'select') return;
    e.stopPropagation();
    // TODO: Implement resize functionality
    console.log('Resize started:', handle);
  }, [selectedTool]);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    // TODO: Implement resize functionality
    console.log('Resize move');
  }, []);

  // Keyboard controls
  useKeyboardControls({
    selectedElementId,
    elements,
    updateElement,
    deleteElement: wrappedDeleteElement,
    setSelectedElementId
  });

  // Legacy wrapper functions
  const wrappedUndo = useCallback(() => undo(elements, setElements), [undo, elements, setElements]);
  const wrappedRedo = useCallback(() => redo(elements, setElements), [redo, elements, setElements]);
  const wrappedSaveCanvas = useCallback(() => saveCanvas(elements), [saveCanvas, elements]);
  const wrappedExportCanvas = useCallback(() => exportCanvas(elements), [exportCanvas, elements]);

  return {
    // Basic state
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
    isSelecting,
    selectionBox,
    layers,
    selectedLayerId,
    
    // Enhanced state
    smoothZoom,
    zoomToMouse,
    fitPadding,
    panSpeed,
    penColor,
    smoothing,
    snapSensitivity,
    autoGroup,
    smartRecognition,
    selectedPenMode,
    lineWidth,
    lineStyle,
    comments,
    isCommentPenActive,
    isVoiceEnabled,
    collaborators,
    isAIEnabled,
    
    // Basic setters
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
    
    // Enhanced setters
    setSmoothZoom,
    setZoomToMouse,
    setFitPadding,
    setPanSpeed,
    setPenColor,
    setSmoothing,
    setSnapSensitivity,
    setAutoGroup,
    setSmartRecognition,
    setSelectedPenMode,
    setLineWidth,
    setLineStyle,
    setIsCommentPenActive,
    setIsVoiceEnabled,
    setIsAIEnabled,
    
    // Canvas interaction - using the wrapped functions
    handleCanvasClick: wrappedHandleCanvasClick,
    handleCanvasMouseDown: wrappedHandleCanvasMouseDown,
    handleCanvasMouseMove: wrappedHandleCanvasMouseMove,
    handleCanvasMouseUp: wrappedHandleCanvasMouseUp,
    handleElementMouseDown: wrappedHandleElementMouseDown,
    handleElementMouseMove: wrappedHandleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove,
    
    // Enhanced actions
    handleCopy,
    handleCut,
    handlePaste,
    handleDuplicate,
    handleFlipHorizontal,
    handleFlipVertical,
    handleRotate,
    handleAlign,
    handleDistribute,
    handleAddComment,
    handleResolveComment,
    handleReplyToComment,
    handleFitToSelection,
    
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
    handleGridSizeChange: (size: number) => setGridSize(size),
    handleAlignToGrid: () => console.log('محاذاة للشبكة'),
    handleLayerUpdate: (newLayers: any[]) => setLayers(newLayers),
    handleLayerSelect: (layerId: string) => setSelectedLayerId(layerId),
    handleGroup: () => console.log('تجميع العناصر'),
    handleUngroup: () => console.log('إلغاء تجميع العناصر'),
    handleLock: () => console.log('قفل العناصر'),
    handleUnlock: () => console.log('إلغاء قفل العناصر')
  };
};