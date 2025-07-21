
import { useCallback } from 'react';
import { useRefactoredCanvasInteraction } from './useRefactoredCanvasInteraction';

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
  const interaction = useRefactoredCanvasInteraction(canvasRef);

  // Canvas interaction handlers - optimized for performance
  const wrappedHandleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Route to appropriate handler based on tool
    switch (selectedTool) {
      case 'select':
        interaction.handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'smart-pen':
        interaction.handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'shape':
      case 'smart-element':
      case 'text-box':
        interaction.handleDragCreate(e, selectedTool, zoom, canvasPosition, snapEnabled);
        break;
      default:
        // Do nothing for other tools like hand, zoom, etc.
        break;
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, interaction]);
  
  const wrappedHandleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionMove(e, zoom, canvasPosition, snapEnabled);
    } else if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenMove(e, zoom, canvasPosition, snapEnabled);
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateMove(e, zoom, canvasPosition, snapEnabled);
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, interaction]);
  
  const wrappedHandleCanvasMouseUp = useCallback(() => {
    // Handle completion based on current tool and state
    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionEnd(elements, (elementIds) => setSelectedElements(elementIds));
    } else if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenEnd((type, startX, startY, endX, endY) => {
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        addElement(x, y, type, selectedSmartElement, Math.max(width, 20), Math.max(height, 20));
      });
    } else if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateEnd(selectedTool, (type, x, y, width, height) => {
        addElement(x, y, type, selectedSmartElement, Math.max(width, 30), Math.max(height, 30));
      });
    }
  }, [selectedTool, elements, selectedSmartElement, addElement, interaction, setSelectedElements]);
  
  const wrappedHandleCanvasClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Handle different tool behaviors
    if (selectedTool === 'select') {
      // Clear selection on empty canvas click (only if not clicking on an element)
      const target = e.target as HTMLElement;
      if (target === canvasRef.current || target.closest('[data-canvas-element]') === null) {
        setSelectedElements([]);
        setSelectedElementId(null);
      }
      return;
    }
    
    // Calculate position for single click tools
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    // Route to appropriate creation method
    switch (selectedTool) {
      case 'text':
        interaction.handleTextClick(e, zoom, canvasPosition, (type, textX, textY) => {
          addElement(textX, textY, type, selectedSmartElement);
        }, snapEnabled);
        break;
      case 'sticky':
      case 'comment':
      case 'upload':
        addElement(x, y, selectedTool, selectedSmartElement);
        break;
      case 'smart-element':
        const elementType = selectedSmartElement || 'timeline';
        addElement(x, y, 'smart-element', elementType);
        break;
      default:
        break;
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, selectedSmartElement, addElement, interaction, canvasRef, setSelectedElements, setSelectedElementId]);

  // Element interaction handlers
  const wrappedHandleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    interaction.handleElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId, selectedElements, setSelectedElements);
  }, [interaction, selectedTool, elements, zoom, canvasPosition, selectedElements, setSelectedElementId, setSelectedElements]);

  const wrappedHandleElementMouseMove = useCallback((e: React.MouseEvent) => {
    interaction.handleElementMouseMove(e, selectedElements, zoom, canvasPosition, updateElement, snapEnabled);
  }, [interaction, selectedElements, zoom, canvasPosition, updateElement, snapEnabled]);

  // Resize handlers
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    if (selectedTool !== 'select') return;
    e.stopPropagation();
  }, [selectedTool]);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    // Resize logic would go here
  }, []);

  return {
    handleCanvasClick: wrappedHandleCanvasClick,
    handleCanvasMouseDown: wrappedHandleCanvasMouseDown,
    handleCanvasMouseMove: wrappedHandleCanvasMouseMove,
    handleCanvasMouseUp: wrappedHandleCanvasMouseUp,
    handleElementMouseDown: wrappedHandleElementMouseDown,
    handleElementMouseMove: wrappedHandleElementMouseMove,
    handleElementMouseUp: interaction.handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove,
    // Selection state
    isSelecting: interaction.isSelecting,
    selectionBox: interaction.selectionBox,
  };
};
