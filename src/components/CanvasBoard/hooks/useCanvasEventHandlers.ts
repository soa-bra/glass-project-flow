import { useCallback } from 'react';
import { useToolCursor } from './useToolCursor';
import { useHandTool } from './useHandTool';
import { useZoomTool } from './useZoomTool';
import { useSmartPenTool } from './useSmartPenTool';
import { useFileUploadTool } from './useFileUploadTool';

export const useCanvasEventHandlers = (
  selectedTool: string,
  zoom: number,
  canvasPosition: { x: number; y: number },
  snapEnabled: boolean,
  simplifiedInteraction: any,
  addElement: (element: any) => void,
  elements: any[],
  selectedElementIds: string[],
  clearSelection: () => void,
  selectMultiple: (ids: string[]) => void,
  selectElement: (id: string) => void,
  updateElement: (elementId: string, updates: any) => void,
  onPositionChange: (position: { x: number; y: number }) => void,
  onZoomChange: (zoom: number) => void
) => {
  // Initialize tool-specific hooks
  const toolCursor = useToolCursor();
  const handTool = useHandTool(onPositionChange, canvasPosition);
  const zoomTool = useZoomTool(zoom, onZoomChange, onPositionChange);
  const smartPenTool = useSmartPenTool(zoom, canvasPosition, (path) => {
    // Convert path to canvas element
    if (path.length > 0) {
      addElement({
        id: `path-${Date.now()}`,
        type: 'path',
        x: path[0].x,
        y: path[0].y,
        width: 100,
        height: 100,
        path: path,
        style: { stroke: '#000000', strokeWidth: 2, fill: 'none' }
      });
    }
  });
  const fileUploadTool = useFileUploadTool((element) => {
    // Add file element to canvas
    addElement(element);
  });

  // Canvas event handlers
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Clear selection when clicking on empty canvas
    clearSelection();
    
    // Handle tool-specific clicks
    switch (selectedTool) {
      case 'text':
        // Create text element at click position
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvasPosition.x) / zoom;
        const y = (e.clientY - rect.top - canvasPosition.y) / zoom;
        
        addElement({
          id: `text-${Date.now()}`,
          type: 'text',
          x: snapEnabled ? Math.round(x / 20) * 20 : x,
          y: snapEnabled ? Math.round(y / 20) * 20 : y,
          width: 200,
          height: 40,
          content: 'نص جديد',
          style: { fontSize: 16, color: '#000000' }
        });
        break;
    }
  }, [clearSelection, selectedTool, canvasPosition, zoom, snapEnabled, addElement]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    switch (selectedTool) {
      case 'select':
        // Start selection using simplified interaction
        if (simplifiedInteraction) {
          simplifiedInteraction.startSelectionBox(e, zoom, canvasPosition, snapEnabled);
        }
        break;
      case 'hand':
        handTool.startPan(e);
        break;
      case 'zoom':
        zoomTool.handleZoomClick(e, !e.shiftKey); // Shift+click to zoom out
        break;
      case 'shape':
        // Start shape creation
        const shapeX = (clientX - canvasPosition.x) / zoom;
        const shapeY = (clientY - canvasPosition.y) / zoom;
        
        addElement({
          id: `shape-${Date.now()}`,
          type: 'shape',
          x: snapEnabled ? Math.round(shapeX / 20) * 20 : shapeX,
          y: snapEnabled ? Math.round(shapeY / 20) * 20 : shapeY,
          width: 100,
          height: 100,
          style: { 
            fill: '#3b82f6', 
            stroke: '#1e40af', 
            strokeWidth: 2,
            shape: 'rectangle'
          }
        });
        break;
      case 'smart-pen':
        smartPenTool.startDrawing(e);
        break;
      case 'sticky':
        // Create sticky note
        const stickyX = (clientX - canvasPosition.x) / zoom;
        const stickyY = (clientY - canvasPosition.y) / zoom;
        
        addElement({
          id: `sticky-${Date.now()}`,
          type: 'sticky',
          x: snapEnabled ? Math.round(stickyX / 20) * 20 : stickyX,
          y: snapEnabled ? Math.round(stickyY / 20) * 20 : stickyY,
          width: 200,
          height: 150,
          content: 'ملاحظة جديدة',
          style: { backgroundColor: '#fef08a', color: '#854d0e' }
        });
        break;
    }
  }, [selectedTool, handTool, zoomTool, smartPenTool, simplifiedInteraction, zoom, canvasPosition, snapEnabled, addElement]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    // Update cursor based on tool
    const cursorStyle = toolCursor.getCursorStyle(selectedTool);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = cursorStyle;
    }

    switch (selectedTool) {
      case 'select':
        if (simplifiedInteraction && simplifiedInteraction.isSelecting) {
          simplifiedInteraction.updateSelectionBox(e, zoom, canvasPosition, snapEnabled);
        }
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
  }, [selectedTool, handTool, smartPenTool, toolCursor, simplifiedInteraction, zoom, canvasPosition, snapEnabled]);

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    switch (selectedTool) {
      case 'select':
        if (simplifiedInteraction && simplifiedInteraction.isSelecting) {
          simplifiedInteraction.endSelectionBox(elements, (elementIds) => {
            selectMultiple(elementIds);
          });
        }
        break;
      case 'hand':
        handTool.endPan();
        break;
      case 'smart-pen':
        smartPenTool.endDrawing();
        break;
    }
  }, [selectedTool, handTool, smartPenTool, simplifiedInteraction, elements, selectMultiple]);

  // Element interaction handlers
  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    if (selectedTool === 'select') {
      // Handle element selection
      if (e.ctrlKey || e.metaKey) {
        // Multi-select mode
        if (selectedElementIds.includes(elementId)) {
          selectMultiple(selectedElementIds.filter(id => id !== elementId));
        } else {
          selectMultiple([...selectedElementIds, elementId]);
        }
      } else {
        selectElement(elementId);
      }
      
      // Start element dragging if simplified interaction supports it
      if (simplifiedInteraction && simplifiedInteraction.startElementDrag) {
        const element = elements.find(el => el.id === elementId);
        if (element) {
          simplifiedInteraction.startElementDrag(e, elementId, element, zoom, canvasPosition);
        }
      }
    }
  }, [selectedTool, elements, zoom, canvasPosition, selectedElementIds, simplifiedInteraction, selectElement, selectMultiple]);

  const handleElementMouseMove = useCallback((e: React.MouseEvent) => {
    if (simplifiedInteraction && simplifiedInteraction.isDragging && simplifiedInteraction.updateElementDrag) {
      simplifiedInteraction.updateElementDrag(e, zoom, canvasPosition, updateElement, snapEnabled);
    }
  }, [simplifiedInteraction, zoom, canvasPosition, updateElement, snapEnabled]);

  const handleElementMouseUp = useCallback(() => {
    if (simplifiedInteraction && simplifiedInteraction.endElementDrag) {
      simplifiedInteraction.endElementDrag();
    }
  }, [simplifiedInteraction]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    // Logic for resize start
    e.stopPropagation();
  }, []);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    // Logic for resize move
  }, []);

  return {
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove,
    // Tool-specific functionality
    toolCursor,
    handTool,
    zoomTool,
    smartPenTool,
    fileUploadTool
  };
};