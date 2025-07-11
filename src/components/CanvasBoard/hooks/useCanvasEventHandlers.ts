
import { useCallback } from 'react';

export const useCanvasEventHandlers = (
  selectedTool: string,
  zoom: number,
  canvasPosition: { x: number; y: number },
  snapEnabled: boolean,
  interaction: any,
  addElement: (type: string, x: number, y: number, width?: number, height?: number) => void,
  elements: any[],
  selectedElementIds: string[],
  setSelectedElementId: (id: string | null) => void,
  setSelectedElementIds: (ids: string[]) => void,
  updateElement: (elementId: string, updates: any) => void
) => {
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      setSelectedElementId(null);
      setSelectedElementIds([]);
    }
  }, [selectedTool, setSelectedElementId, setSelectedElementIds]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      interaction.handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'text') {
      interaction.handleTextClick(e, zoom, canvasPosition, (type: string, x: number, y: number) => {
        addElement(type, x, y);
      }, snapEnabled);
      return;
    }

    if (['shape', 'smart-element', 'text-box'].includes(selectedTool)) {
      interaction.handleDragCreate(e, selectedTool, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'smart-pen') {
      interaction.handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
      return;
    }
  }, [selectedTool, zoom, canvasPosition, addElement, snapEnabled, interaction]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, interaction]);

  const handleCanvasMouseUp = useCallback(() => {
    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionEnd(elements, setSelectedElementIds);
      return;
    }

    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateEnd(selectedTool, (type: string, x: number, y: number, width: number, height: number) => {
        addElement(type, x, y, width, height);
      });
      return;
    }

    if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenEnd((type: string, startX: number, startY: number, endX: number, endY: number) => {
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        addElement(type, x, y, Math.max(width, 20), Math.max(height, 20));
      });
      return;
    }
  }, [selectedTool, elements, addElement, setSelectedElementIds, interaction]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    interaction.handleElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, setSelectedElementId, selectedElementIds, setSelectedElementIds);
  }, [selectedTool, elements, zoom, canvasPosition, selectedElementIds, interaction, setSelectedElementId, setSelectedElementIds]);

  const handleElementMouseMove = useCallback((e: React.MouseEvent) => {
    interaction.handleElementMouseMove(e, selectedElementIds, zoom, canvasPosition, updateElement, snapEnabled);
  }, [selectedElementIds, zoom, canvasPosition, updateElement, snapEnabled, interaction]);

  const handleElementMouseUp = useCallback(() => {
    interaction.handleElementMouseUp();
  }, [interaction]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    // Resize logic will be implemented later
  }, []);

  const handleResizeMouseMove = useCallback((e: React.MouseEvent) => {
    // Resize logic will be implemented later
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
    handleResizeMouseMove
  };
};
