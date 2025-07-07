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
  } = useEnhancedCanvasInteraction();

  // Canvas interaction handlers - تحسين معالجات التفاعل
  const wrappedHandleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🎯 Canvas mouse down - tool:', selectedTool, 'position:', { 
      x: e.clientX, 
      y: e.clientY, 
      canvasPos: canvasPosition,
      zoom 
    });
    
    if (selectedTool === 'select') {
      console.log('✅ Starting selection');
      handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
    } else if (selectedTool === 'smart-pen') {
      console.log('✅ Starting smart pen draw');
      handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool)) {
      console.log('✅ Starting drag create for tool:', selectedTool);
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
    console.log('🎯 Canvas mouse up - tool:', selectedTool, 'isSelecting:', isSelecting, 'isDrawing:', isDrawing);
    
    if (selectedTool === 'select' && isSelecting) {
      console.log('✅ Ending selection');
      handleSelectionEnd(elements, (elementIds) => setSelectedElements(elementIds));
    } else if (selectedTool === 'smart-pen' && isDrawing) {
      console.log('✅ Ending smart pen draw');
      handleSmartPenEnd((type, startX, startY, endX, endY) => {
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        console.log('🎨 Creating smart pen element:', { type, x, y, width, height });
        addElement(x, y, type, selectedSmartElement, Math.max(width, 20), Math.max(height, 20));
      });
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && isDrawing) {
      console.log('✅ Ending drag create');
      handleDragCreateEnd(selectedTool, (type, x, y, width, height) => {
        console.log('🎨 Creating dragged element:', { type, x, y, width, height });
        addElement(x, y, type, selectedSmartElement, Math.max(width, 50), Math.max(height, 50));
      });
    }
  }, [selectedTool, isSelecting, isDrawing, elements, selectedSmartElement, addElement, handleSelectionEnd, handleSmartPenEnd, handleDragCreateEnd, setSelectedElements]);
  
  const wrappedHandleCanvasClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🎯 Canvas click - tool:', selectedTool, 'target:', e.target);
    
    // Clear selection if clicking with select tool on empty canvas
    if (selectedTool === 'select') {
      console.log('✅ Clearing selection');
      setSelectedElements([]);
      setSelectedElementId(null);
      return;
    }
    
    // Calculate position for single click tools
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      console.warn('❌ Canvas ref not available');
      return;
    }

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    console.log('📍 Calculated position:', { x, y, clientX: e.clientX, clientY: e.clientY });
    
    // Handle text tool - single click
    if (selectedTool === 'text') {
      console.log('✅ Adding text element at:', { x, y });
      handleTextClick(e, zoom, canvasPosition, (type, textX, textY) => {
        console.log('🎨 Creating text element:', { type, x: textX, y: textY });
        addElement(textX, textY, type, selectedSmartElement);
      }, snapEnabled);
    } 
    // Handle simple click tools
    else if (['sticky', 'comment', 'upload'].includes(selectedTool)) {
      console.log('✅ Adding simple element:', selectedTool, 'at:', { x, y });
      addElement(x, y, selectedTool, selectedSmartElement);
    }
    // Handle smart element tool - single click
    else if (selectedTool === 'smart-element') {
      const elementType = selectedSmartElement || 'timeline';
      console.log('✅ Adding smart element:', elementType, 'at:', { x, y });
      addElement(x, y, 'smart-element', elementType);
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