
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
  updateElement: (elementId: string, updates: any) => void,
  addDrawingElement: (type: string, path: { x: number; y: number }[], lineWidth: number, color: string) => void,
  lineWidth: number = 2,
  lineColor: string = '#000000'
) => {
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    setSelectedElementId(null);
    setSelectedElementIds([]);
  }, [setSelectedElementId, setSelectedElementIds]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') return;

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
      interaction.handleDragCreateEnd(selectedTool, (type: string, x: number, y: number, width: number, height: number) => {
        addElement(type, x, y, width, height);
      });
      return;
    }

    if (selectedTool === 'smart-pen' && interaction.isDrawing) {
      interaction.handleSmartPenEnd(addDrawingElement, lineWidth, lineColor);
      return;
    }

    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionEnd(elements, setSelectedElementIds);
      return;
    }
  }, [selectedTool, elements, addElement, addDrawingElement, setSelectedElementIds, interaction, lineWidth, lineColor]);

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
