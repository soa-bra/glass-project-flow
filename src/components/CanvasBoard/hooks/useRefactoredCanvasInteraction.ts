
import { useCanvasSelectionInteraction } from './useCanvasSelectionInteraction';
import { useCanvasDrawingInteraction } from './useCanvasDrawingInteraction';
import { useCanvasElementInteraction } from './useCanvasElementInteraction';

export const useRefactoredCanvasInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const selectionInteraction = useCanvasSelectionInteraction(canvasRef);
  const drawingInteraction = useCanvasDrawingInteraction(canvasRef);
  const elementInteraction = useCanvasElementInteraction(canvasRef);

  return {
    // Selection methods
    isSelecting: selectionInteraction.isSelecting,
    selectionBox: selectionInteraction.selectionBox,
    handleSelectionStart: selectionInteraction.handleSelectionStart,
    handleSelectionMove: selectionInteraction.handleSelectionMove,
    handleSelectionEnd: selectionInteraction.handleSelectionEnd,
    
    // Drawing methods
    isDrawing: drawingInteraction.isDrawing,
    drawStart: drawingInteraction.drawStart,
    drawEnd: drawingInteraction.drawEnd,
    handleSmartPenStart: drawingInteraction.handleSmartPenStart,
    handleSmartPenMove: drawingInteraction.handleSmartPenMove,
    handleSmartPenEnd: drawingInteraction.handleSmartPenEnd,
    handleDragCreate: drawingInteraction.handleDragCreate,
    handleDragCreateMove: drawingInteraction.handleDragCreateMove,
    handleDragCreateEnd: drawingInteraction.handleDragCreateEnd,
    handleTextClick: drawingInteraction.handleTextClick,
    
    // Element manipulation methods
    isDragging: elementInteraction.isDragging,
    isResizing: elementInteraction.isResizing,
    handleElementMouseDown: elementInteraction.handleElementMouseDown,
    handleElementMouseMove: elementInteraction.handleElementMouseMove,
    handleElementMouseUp: elementInteraction.handleElementMouseUp
  };
};
