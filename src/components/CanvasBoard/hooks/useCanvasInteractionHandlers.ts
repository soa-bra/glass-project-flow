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

  // Canvas interaction handlers
  const wrappedHandleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Canvas mouse down - tool:', selectedTool);
    
    if (selectedTool === 'select') {
      handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
    } else if (selectedTool === 'smart-pen') {
      console.log('Starting smart pen draw');
      handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool)) {
      console.log('Starting drag create for tool:', selectedTool);
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
        addElement(x, y, type, selectedSmartElement, Math.max(width, 50), Math.max(height, 50))
      );
    }
  }, [selectedTool, isSelecting, isDrawing, elements, selectedSmartElement, addElement, handleSelectionEnd, handleSmartPenEnd, handleDragCreateEnd, setSelectedElements]);
  
  const wrappedHandleCanvasClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Canvas click - tool:', selectedTool);
    
    // Clear selection if clicking with select tool
    if (selectedTool === 'select') {
      setSelectedElements([]);
      setSelectedElementId(null);
      return;
    }
    
    // Handle text tool
    if (selectedTool === 'text') {
      console.log('Adding text element');
      handleTextClick(e, zoom, canvasPosition, (type, x, y) => 
        addElement(x, y, type, selectedSmartElement), snapEnabled);
    } 
    // Handle simple click tools
    else if (['sticky', 'comment', 'upload'].includes(selectedTool)) {
      console.log('Adding simple element:', selectedTool);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
        const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
        console.log('Element position:', { x, y });
        addElement(x, y, selectedTool, selectedSmartElement);
      }
    }
    // Handle smart element tool
    else if (selectedTool === 'smart-element' && selectedSmartElement) {
      console.log('Adding smart element:', selectedSmartElement);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
        const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
        console.log('Smart element position:', { x, y });
        addElement(x, y, 'smart-element', selectedSmartElement);
      }
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, selectedSmartElement, addElement, handleTextClick, canvasRef, setSelectedElements, setSelectedElementId]);

  // Element interaction handlers
  const wrappedHandleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    enhancedElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId, selectedElements, setSelectedElements);
  }, [enhancedElementMouseDown, selectedTool, elements, zoom, canvasPosition, selectedElements, setSelectedElementId, setSelectedElements]);

  const wrappedHandleElementMouseMove = useCallback((e: React.MouseEvent) => {
    enhancedElementMouseMove(e, selectedElements, zoom, canvasPosition, updateElement, snapEnabled);
  }, [enhancedElementMouseMove, selectedElements, zoom, canvasPosition, updateElement, snapEnabled]);

  // Resize handlers (placeholder for now)
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    if (selectedTool !== 'select') return;
    e.stopPropagation();
    console.log('Resize started:', handle);
  }, [selectedTool]);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    console.log('Resize move');
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