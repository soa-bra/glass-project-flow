import { useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { 
  useSelectionTool, 
  useElementCreationTool, 
  useElementDragTool,
  useHandTool,
  useZoomTool,
  useEnhancedSmartPen,
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
  
  const enhancedSmartPenTool = useEnhancedSmartPen(
    zoom,
    canvasPosition,
    2, // lineWidth
    'solid', // lineStyle
    'pen', // penMode
    (path, style) => {
      if (path.length > 0) {
        const bounds = enhancedSmartPenTool?.getPathBounds(path);
        addElement({
          id: `path-${Date.now()}`,
          type: 'line',
          position: { x: bounds?.minX || path[0].x, y: bounds?.minY || path[0].y },
          size: { 
            width: bounds ? bounds.maxX - bounds.minX : 100, 
            height: bounds ? bounds.maxY - bounds.minY : 100 
          },
          data: { path, style },
          style: { stroke: style.stroke, strokeWidth: style.strokeWidth, fill: 'none' }
        });
      }
    }
  );
  
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
    // Convert screen coordinates to canvas coordinates 
    // considering zoom and canvas position
    const x = (e.clientX - rect.left - canvasPosition.x) / (zoom / 100);
    const y = (e.clientY - rect.top - canvasPosition.y) / (zoom / 100);
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
      case 'comment':
        // Handle comment creation with prompt
        setTimeout(() => {
          const content = prompt('أدخل التعليق:');
          if (content && content.trim()) {
            addElement({
              id: `comment-${Date.now()}`,
              type: 'comment',
              position: coords,
              size: { width: 200, height: 60 },
              content: content,
              style: {
                backgroundColor: '#fff3cd',
                borderColor: '#ffc107',
                borderWidth: 1,
                padding: '8px',
                borderRadius: '8px'
              }
            });
          }
        }, 100);
        break;
      case 'zoom':
        zoomTool.handleZoomClick(e, true);
        break;
      default:
        clearSelection();
        break;
    }
  }, [selectedTool, elementCreationTool, clearSelection, getCanvasCoordinates, snapEnabled, selectedSmartElement, addElement, zoomTool]);

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
        if (e.shiftKey) {
          zoomTool.handleZoomClick(e, false); // Zoom out
        } else {
          zoomTool.handleZoomClick(e, true); // Zoom in
        }
        break;
      case 'shape':
        elementCreationTool.createShapeElement(coords.x, coords.y, snapEnabled);
        break;
      case 'sticky':
        elementCreationTool.createStickyElement(coords.x, coords.y, snapEnabled);
        break;
      case 'smart-pen':
        enhancedSmartPenTool.startDrawing(e);
        break;
    }
  }, [selectedTool, selectionTool, handTool, zoomTool, elementCreationTool, enhancedSmartPenTool, zoom, canvasPosition, snapEnabled, getCanvasCoordinates]);

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
        if (enhancedSmartPenTool.isDrawing) {
          enhancedSmartPenTool.continueDrawing(e);
        }
        break;
    }
  }, [selectedTool, selectionTool, handTool, enhancedSmartPenTool, toolCursor, zoom, canvasPosition, snapEnabled]);

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    switch (selectedTool) {
      case 'select':
        selectionTool.endSelection(elements, selectMultiple);
        break;
      case 'hand':
        handTool.endPan();
        break;
      case 'smart-pen':
        enhancedSmartPenTool.endDrawing();
        break;
    }
  }, [selectedTool, selectionTool, handTool, enhancedSmartPenTool, elements, selectMultiple]);

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

  // File upload handler
  const handleFileUpload = useCallback((files: FileList, position: { x: number; y: number }) => {
    Array.from(files).forEach((file, index) => {
      const offsetPosition = {
        x: position.x + index * 20,
        y: position.y + index * 20
      };
      
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          addElement({
            id: `image-${Date.now()}-${index}`,
            type: 'image',
            position: offsetPosition,
            size: { 
              width: Math.min(img.naturalWidth, 300), 
              height: Math.min(img.naturalHeight, 200) 
            },
            data: { src: URL.createObjectURL(file) },
            style: { borderRadius: '4px' }
          });
        };
        img.src = URL.createObjectURL(file);
      } else {
        addElement({
          id: `upload-${Date.now()}-${index}`,
          type: 'upload',
          position: offsetPosition,
          size: { width: 150, height: 100 },
          content: file.name,
          data: { 
            file: URL.createObjectURL(file), 
            fileName: file.name,
            fileType: file.type 
          },
          style: {
            backgroundColor: '#f8f9fa',
            borderColor: '#dee2e6',
            borderWidth: 2,
            borderRadius: '8px',
            padding: '16px'
          }
        });
      }
    });
  }, [addElement]);

  // Wheel zoom handler with proper canvas coordinate adjustment
  const handleWheelZoom = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      // Get mouse position relative to canvas for zoom center
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const delta = e.deltaY > 0 ? -10 : 10; // Smaller steps for smoother zoom
      const newZoom = Math.min(Math.max(zoom + delta, 10), 500);
      
      // Adjust canvas position to zoom towards mouse cursor
      const zoomRatio = newZoom / zoom;
      const newCanvasX = mouseX - (mouseX - canvasPosition.x) * zoomRatio;
      const newCanvasY = mouseY - (mouseY - canvasPosition.y) * zoomRatio;
      
      onZoomChange(newZoom);
      onPositionChange({ x: newCanvasX, y: newCanvasY });
    }
  }, [zoom, canvasPosition, onZoomChange, onPositionChange]);

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
    
    // File upload handler
    handleFileUpload,
    
    // Wheel zoom handler
    handleWheelZoom,
    
    // Tool controllers for additional functionality
    toolCursor,
    handTool,
    zoomTool,
    enhancedSmartPenTool,
    fileUploadTool,
    selectionTool,
    elementCreationTool,
    elementDragTool
  };
};