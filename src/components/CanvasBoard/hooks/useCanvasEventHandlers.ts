
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
    setSelectedElementId(null);
    setSelectedElementIds([]);
  }, [setSelectedElementId, setSelectedElementIds]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      // Start multi-selection if clicking on empty canvas
      interaction.handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'text') {
      interaction.handleTextClick(e, zoom, canvasPosition, addElement, snapEnabled);
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
    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, interaction]);

  const handleCanvasMouseUp = useCallback(() => {
    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateEnd(selectedTool, addElement);
      return;
    }

    if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenEnd(addElement);
      return;
    }

    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionEnd(elements, setSelectedElementIds);
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
    // Logic for resize start
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
    handleResizeMouseMove
  };
};
