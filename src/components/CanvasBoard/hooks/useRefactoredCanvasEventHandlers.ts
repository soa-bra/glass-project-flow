import { useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { 
  useSelectionTool, 
  useElementCreationTool, 
  useElementDragTool,
  useHandTool,
  useZoomTool,
  useSmartPenTool,
  useFileUploadTool,
  useToolCursor
} from './tools';

export const useRefactoredCanvasEventHandlers = (
  selectedTool: string,
  zoom: number,
  canvasPosition: { x: number; y: number },
  snapEnabled: boolean,
  simplifiedInteraction: any,
  addElement: (element: any) => void,
  elements: CanvasElement[],
  selectedElementIds: string[],
  clearSelection: () => void,
  selectMultiple: (ids: string[]) => void,
  selectElement: (id: string) => void,
  updateElement: (elementId: string, updates: any) => void,
  onPositionChange: (position: { x: number; y: number }) => void,
  onZoomChange: (zoom: number) => void,
  selectedSmartElement?: string
) => {
  // Initialize all tool controllers
  const toolCursor = useToolCursor();
  const handTool = useHandTool(onPositionChange, canvasPosition);
  const zoomTool = useZoomTool(zoom, onZoomChange, onPositionChange);
  
  const smartPenTool = useSmartPenTool(zoom, canvasPosition, (path) => {
    if (path.length > 0) {
      addElement({
        id: `path-${Date.now()}`,
        type: 'line',
        position: { x: path[0].x, y: path[0].y },
        size: { width: 100, height: 100 },
        data: { path },
        style: { stroke: '#000000', strokeWidth: 2, fill: 'none' }
      });
    }
  });
  
  const fileUploadTool = useFileUploadTool(addElement);
  
  const selectionTool = useSelectionTool(
    simplifiedInteraction, 
    selectedElementIds, 
    selectElement, 
    selectMultiple, 
    clearSelection
  );
  
  const elementCreationTool = useElementCreationTool(addElement, selectedSmartElement);
  const elementDragTool = useElementDragTool(simplifiedInteraction, elements, updateElement);

  // Utility function to get canvas coordinates
  const getCanvasCoordinates = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasPosition.x) / zoom;
    const y = (e.clientY - rect.top - canvasPosition.y) / zoom;
    return { x, y };
  }, [zoom, canvasPosition]);

  // Canvas event handlers
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e);
    
    switch (selectedTool) {
      case 'text':
        elementCreationTool.createTextElement(coords.x, coords.y, snapEnabled);
        break;
      case 'smart-element':
        elementCreationTool.createSmartElement(coords.x, coords.y, selectedSmartElement || '', snapEnabled);
        break;
      default:
        clearSelection();
        break;
    }
  }, [selectedTool, elementCreationTool, clearSelection, getCanvasCoordinates, snapEnabled, selectedSmartElement]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const coords = getCanvasCoordinates(e);
    
    switch (selectedTool) {
      case 'select':
        selectionTool.startSelection(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'hand':
        handTool.startPan(e);
        break;
      case 'zoom':
        zoomTool.handleZoomClick(e, !e.shiftKey);
        break;
      case 'shape':
        elementCreationTool.createShapeElement(coords.x, coords.y, snapEnabled);
        break;
      case 'sticky':
        elementCreationTool.createStickyElement(coords.x, coords.y, snapEnabled);
        break;
      case 'smart-pen':
        smartPenTool.startDrawing(e);
        break;
    }
  }, [selectedTool, selectionTool, handTool, zoomTool, elementCreationTool, smartPenTool, zoom, canvasPosition, snapEnabled, getCanvasCoordinates]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    // Update cursor
    const cursorStyle = toolCursor.getCursorStyle(selectedTool);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = cursorStyle;
    }

    switch (selectedTool) {
      case 'select':
        selectionTool.updateSelection(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'hand':
        if (handTool.isDragging) {
          handTool.updatePan(e);
        }
        break;
      case 'smart-pen':
        if (smartPenTool.isDrawing) {
          smartPenTool.continueDrawing(e);
        }
        break;
    }
  }, [selectedTool, selectionTool, handTool, smartPenTool, toolCursor, zoom, canvasPosition, snapEnabled]);

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    switch (selectedTool) {
      case 'select':
        selectionTool.endSelection(elements, selectMultiple);
        break;
      case 'hand':
        handTool.endPan();
        break;
      case 'smart-pen':
        smartPenTool.endDrawing();
        break;
    }
  }, [selectedTool, selectionTool, handTool, smartPenTool, elements, selectMultiple]);

  // Element interaction handlers
  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    if (selectedTool === 'select') {
      const isMultiSelect = e.ctrlKey || e.metaKey;
      selectionTool.handleElementClick(e, elementId, isMultiSelect);
      
      // Start dragging
      const element = elements.find(el => el.id === elementId);
      if (element) {
        elementDragTool.startElementDrag(e, elementId, element, zoom, canvasPosition);
      }
    }
  }, [selectedTool, selectionTool, elementDragTool, elements, zoom, canvasPosition]);

  const handleElementMouseMove = useCallback((e: React.MouseEvent) => {
    if (elementDragTool.isDragging) {
      elementDragTool.updateElementDrag(e, zoom, canvasPosition, snapEnabled);
    }
  }, [elementDragTool, zoom, canvasPosition, snapEnabled]);

  const handleElementMouseUp = useCallback(() => {
    elementDragTool.endElementDrag();
  }, [elementDragTool]);

  // Resize handlers (placeholder for backward compatibility)
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
  }, []);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    // Placeholder for resize functionality
  }, []);

  return {
    // Canvas handlers
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    
    // Element handlers
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    
    // Resize handlers
    handleResizeMouseDown,
    handleResizeMouseMove,
    
    // Tool controllers for additional functionality
    toolCursor,
    handTool,
    zoomTool,
    smartPenTool,
    fileUploadTool,
    selectionTool,
    elementCreationTool,
    elementDragTool
  };
};