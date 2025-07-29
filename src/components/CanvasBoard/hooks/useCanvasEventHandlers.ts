
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
  interaction: any,
  addElement: (type: string, x: number, y: number, width?: number, height?: number) => void,
  elements: any[],
  selectedElementIds: string[],
  setSelectedElementId: (id: string | null) => void,
  setSelectedElementIds: (ids: string[]) => void,
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
    addElement('smart-pen', path[0].x, path[0].y);
  });
  const fileUploadTool = useFileUploadTool((element) => {
    // Add file element to canvas
    addElement(element.type, element.position.x, element.position.y, element.size.width, element.size.height);
  });
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

    if (selectedTool === 'hand') {
      handTool.startPan(e);
      return;
    }

    if (selectedTool === 'zoom') {
      zoomTool.handleZoomClick(e, !e.shiftKey); // Shift+click to zoom out
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
      smartPenTool.startDrawing(e);
      return;
    }
  }, [selectedTool, zoom, canvasPosition, addElement, snapEnabled, interaction, handTool, zoomTool, smartPenTool]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'hand' && handTool.isDragging) {
      handTool.updatePan(e);
      return;
    }

    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    if (selectedTool === 'smart-pen' && smartPenTool.isDrawing) {
      smartPenTool.continueDrawing(e);
      return;
    }

    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionMove(e, zoom, canvasPosition, snapEnabled);
      return;
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, interaction, handTool, smartPenTool]);

  const handleCanvasMouseUp = useCallback(() => {
    if (selectedTool === 'hand' && handTool.isDragging) {
      handTool.endPan();
      return;
    }

    if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && interaction.isDrawing) {
      interaction.handleDragCreateEnd(selectedTool, addElement);
      return;
    }

    if (selectedTool === 'smart-pen' && smartPenTool.isDrawing) {
      smartPenTool.endDrawing();
      return;
    }

    if (selectedTool === 'select' && interaction.isSelecting) {
      interaction.handleSelectionEnd(elements, setSelectedElementIds);
      return;
    }
  }, [selectedTool, elements, addElement, setSelectedElementIds, interaction, handTool, smartPenTool]);

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
    handleResizeMouseMove,
    // Tool-specific functionality
    toolCursor,
    handTool,
    zoomTool,
    smartPenTool,
    fileUploadTool
  };
};
