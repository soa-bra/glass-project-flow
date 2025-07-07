import { useCallback } from 'react';
import { useEnhancedCanvasInteraction } from './useEnhancedCanvasInteraction';

export const useCanvasInteractionHandlers = (
  selectedTool: string,
  zoom: number,
  canvasPosition: { x: number; y: number },
  snapEnabled: boolean,
  selectedSmartElement: string,
  isSelecting: boolean,
  isDrawing: boolean,
  addElement: (x: number, y: number, type: string, smartElement: string, width?: number, height?: number) => void,
  setSelectedElements: (elements: string[]) => void,
  elements: any[],
  selectedElements: string[],
  updateElement: (elementId: string, updates: any) => void,
  setSelectedElementId: (id: string | null) => void,
  canvasRef: React.RefObject<HTMLDivElement>
) => {
  const {
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
  } = useEnhancedCanvasInteraction(canvasRef);

  // Canvas interaction handlers - optimized for performance
  const wrappedHandleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🎯 Canvas mouse down:', selectedTool);
    
    // Route to appropriate handler based on tool
    switch (selectedTool) {
      case 'select':
        handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'smart-pen':
        handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'shape':
      case 'smart-element':
      case 'text-box':
        handleDragCreate(e, selectedTool, zoom, canvasPosition, snapEnabled);
        break;
      default:
        // Do nothing for other tools like hand, zoom, etc.
        break;
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
    // Handle completion based on current tool and state
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
      handleDragCreateEnd(selectedTool, (type, x, y, width, height) => {
        addElement(x, y, type, selectedSmartElement, Math.max(width, 30), Math.max(height, 30));
      });
    }
  }, [selectedTool, isSelecting, isDrawing, elements, selectedSmartElement, addElement, handleSelectionEnd, handleSmartPenEnd, handleDragCreateEnd, setSelectedElements]);
  
  const wrappedHandleCanvasClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🎯 Canvas click:', selectedTool);
    
    // Handle different tool behaviors
    if (selectedTool === 'select') {
      // Clear selection on empty canvas click
      setSelectedElements([]);
      setSelectedElementId(null);
      return;
    }
    
    // Calculate position for single click tools
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      console.log('❌ Canvas ref not available');
      return;
    }

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    console.log('📍 Click position:', { x, y, tool: selectedTool });
    
    // Route to appropriate creation method
    switch (selectedTool) {
      case 'text':
        console.log('✏️ Creating text element');
        handleTextClick(e, zoom, canvasPosition, (type, textX, textY) => {
          console.log('📝 Text element created at:', { textX, textY });
          addElement(textX, textY, type, selectedSmartElement);
        }, snapEnabled);
        break;
      case 'sticky':
      case 'comment':
      case 'upload':
        console.log('📌 Creating single-click element:', selectedTool);
        addElement(x, y, selectedTool, selectedSmartElement);
        break;
      case 'smart-element':
        const elementType = selectedSmartElement || 'timeline';
        console.log('🧠 Creating smart element:', elementType);
        addElement(x, y, 'smart-element', elementType);
        break;
      default:
        console.log('🚫 No click action for tool:', selectedTool);
        break;
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, selectedSmartElement, addElement, handleTextClick, canvasRef, setSelectedElements, setSelectedElementId]);

  // Element interaction handlers - تحسين معالجات العناصر
  const wrappedHandleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    console.log('🎯 Element mouse down:', elementId, 'tool:', selectedTool);
    enhancedElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId, selectedElements, setSelectedElements);
  }, [enhancedElementMouseDown, selectedTool, elements, zoom, canvasPosition, selectedElements, setSelectedElementId, setSelectedElements]);

  const wrappedHandleElementMouseMove = useCallback((e: React.MouseEvent) => {
    enhancedElementMouseMove(e, selectedElements, zoom, canvasPosition, updateElement, snapEnabled);
  }, [enhancedElementMouseMove, selectedElements, zoom, canvasPosition, updateElement, snapEnabled]);

  // Resize handlers - تحسين معالجات تغيير الحجم
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    if (selectedTool !== 'select') return;
    e.stopPropagation();
    console.log('🎯 Resize started:', handle);
  }, [selectedTool]);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    console.log('🎯 Resize move');
  }, []);

  return {
    handleCanvasClick: wrappedHandleCanvasClick,
    handleCanvasMouseDown: wrappedHandleCanvasMouseDown,
    handleCanvasMouseMove: wrappedHandleCanvasMouseMove,
    handleCanvasMouseUp: wrappedHandleCanvasMouseUp,
    handleElementMouseDown: wrappedHandleElementMouseDown,
    handleElementMouseMove: wrappedHandleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove,
  };
};