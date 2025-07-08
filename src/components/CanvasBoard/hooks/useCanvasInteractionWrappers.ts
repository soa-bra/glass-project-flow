import { useCallback } from 'react';
import { CanvasElement } from '../types';

export const useCanvasInteractionWrappers = (
  selectedTool: string,
  selectedSmartElement: string,
  selectedElementId: string | null,
  elements: CanvasElement[],
  zoom: number,
  canvasPosition: { x: number; y: number },
  snapEnabled: boolean,
  addElement: (x: number, y: number, type: string, smartElement: string, width?: number, height?: number) => void,
  updateElement: (elementId: string, updates: any) => void,
  setSelectedElementId: (id: string | null) => void,
  handleCanvasMouseDown: any,
  handleCanvasMouseMove: any,
  handleCanvasMouseUp: any,
  handleCanvasClick: any,
  handleElementMouseDown: any,
  handleElementMouseMove: any,
  handleResizeMouseDown: any,
  handleResizeMouseMove: any
) => {
  const wrappedAddElement = useCallback((x: number, y: number, width?: number, height?: number) => {
    addElement(x, y, selectedTool, selectedSmartElement, width, height);
  }, [addElement, selectedTool, selectedSmartElement]);

  const wrappedHandleCanvasMouseDown = useCallback((e: React.MouseEvent) => 
    handleCanvasMouseDown(e, selectedTool, zoom, canvasPosition, snapEnabled), 
    [handleCanvasMouseDown, selectedTool, zoom, canvasPosition, snapEnabled]
  );
  
  const wrappedHandleCanvasMouseMove = useCallback((e: React.MouseEvent) => 
    handleCanvasMouseMove(e, zoom, canvasPosition, snapEnabled), 
    [handleCanvasMouseMove, zoom, canvasPosition, snapEnabled]
  );
  
  const wrappedHandleCanvasMouseUp = useCallback(() => 
    handleCanvasMouseUp(wrappedAddElement), 
    [handleCanvasMouseUp, wrappedAddElement]
  );
  
  const wrappedHandleCanvasClick = useCallback((e: React.MouseEvent) => 
    handleCanvasClick(e, selectedTool, zoom, canvasPosition, wrappedAddElement, snapEnabled), 
    [handleCanvasClick, selectedTool, zoom, canvasPosition, wrappedAddElement, snapEnabled]
  );
  
  const wrappedHandleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => 
    handleElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId), 
    [handleElementMouseDown, selectedTool, elements, zoom, canvasPosition, setSelectedElementId]
  );
  
  const wrappedHandleElementMouseMove = useCallback((e: React.MouseEvent) => 
    handleElementMouseMove(e, selectedElementId, zoom, canvasPosition, updateElement, snapEnabled), 
    [handleElementMouseMove, selectedElementId, zoom, canvasPosition, updateElement, snapEnabled]
  );
  
  const wrappedHandleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => 
    handleResizeMouseDown(e, handle, selectedTool), 
    [handleResizeMouseDown, selectedTool]
  );
  
  const wrappedHandleResizeMouseMove = useCallback((e: React.MouseEvent) => 
    handleResizeMouseMove(e, selectedElementId, elements, zoom, canvasPosition, updateElement), 
    [handleResizeMouseMove, selectedElementId, elements, zoom, canvasPosition, updateElement]
  );

  return {
    addElement: wrappedAddElement,
    handleCanvasClick: wrappedHandleCanvasClick,
    handleCanvasMouseDown: wrappedHandleCanvasMouseDown,
    handleCanvasMouseMove: wrappedHandleCanvasMouseMove,
    handleCanvasMouseUp: wrappedHandleCanvasMouseUp,
    handleElementMouseDown: wrappedHandleElementMouseDown,
    handleElementMouseMove: wrappedHandleElementMouseMove,
    handleResizeMouseDown: wrappedHandleResizeMouseDown,
    handleResizeMouseMove: wrappedHandleResizeMouseMove,
  };
};