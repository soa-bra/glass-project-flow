import React, { useRef, useEffect, useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { CanvasElement as CanvasElementComponent } from './CanvasElement';
import { SimplifiedSelectionBoundingBox } from '../SimplifiedSelectionBoundingBox';
import { InfiniteCanvas, InfiniteCanvasRef } from './InfiniteCanvas';
import { useUnifiedSelection } from '../../hooks/useUnifiedSelection';
import { useSimplifiedCanvasInteraction } from '../../hooks/useSimplifiedCanvasInteraction';
import { useCanvasElements } from '../../hooks/useCanvasElements';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';
import { useCanvasEventHandlers, useToolCursor } from '../../hooks';

interface CanvasProps {
  selectedTool: string;
  selectedSmartElement?: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  onElementsChange?: (elements: CanvasElement[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onZoomChange?: (zoom: number) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  selectedTool,
  selectedSmartElement = '',
  zoom,
  canvasPosition,
  showGrid,
  snapEnabled,
  onElementsChange,
  onSelectionChange,
  onZoomChange,
  onPositionChange
}) => {
  const infiniteCanvasRef = useRef<InfiniteCanvasRef>(null);
  const dummyRef = useRef<HTMLDivElement>(null);
  const { saveToHistory } = useCanvasHistory();
  const { elements, addElement, updateElement, deleteElement } = useCanvasElements(saveToHistory);
  const selection = useUnifiedSelection();
  const interaction = useSimplifiedCanvasInteraction(dummyRef);
  
  // Tool cursor and event handlers
  const toolCursor = useToolCursor();
  
  // Create wrapper function to match expected signature
  const addElementWrapper = useCallback((type: string, x: number, y: number, width?: number, height?: number) => {
    addElement(x, y, type, selectedSmartElement, width, height);
  }, [addElement, selectedSmartElement]);

  const eventHandlers = useCanvasEventHandlers(
    selectedTool,
    zoom,
    canvasPosition,
    snapEnabled,
    interaction,
    addElementWrapper,
    elements,
    selection.selectedElementIds,
    (id) => id ? selection.selectElement(id) : selection.clearSelection(),
    selection.selectMultiple,
    updateElement,
    onPositionChange || (() => {}),
    onZoomChange || (() => {})
  );

  // Notify parent of changes
  useEffect(() => {
    onElementsChange?.(elements);
  }, [elements, onElementsChange]);

  useEffect(() => {
    onSelectionChange?.(selection.selectedElementIds);
  }, [selection.selectedElementIds, onSelectionChange]);

  const selectedElements = elements.filter(el => selection.isSelected(el.id));

  return (
    <div 
      className="w-full h-full relative"
      style={{ cursor: toolCursor.getCursorStyle(selectedTool) }}
    >
      <InfiniteCanvas
        ref={infiniteCanvasRef}
        zoom={zoom}
        canvasPosition={canvasPosition}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        onPositionChange={onPositionChange}
        onZoomChange={onZoomChange}
        onCanvasMouseDown={eventHandlers.handleCanvasMouseDown}
        onCanvasMouseMove={eventHandlers.handleCanvasMouseMove}
        onCanvasMouseUp={eventHandlers.handleCanvasMouseUp}
        onCanvasClick={eventHandlers.handleCanvasClick}
      >
        {elements.map((element) => {
          const isSelected = selection.isSelected(element.id);
          return (
            <CanvasElementComponent
              key={element.id}
              element={element}
              isSelected={isSelected}
              onMouseDown={(e) => eventHandlers.handleElementMouseDown(e, element.id)}
              onMouseMove={eventHandlers.handleElementMouseMove}
              onMouseUp={eventHandlers.handleElementMouseUp}
            />
          );
        })}
      </InfiniteCanvas>

      {/* Selection Bounding Box */}
      {selection.selectedElementIds.length > 0 && (
        <SimplifiedSelectionBoundingBox
          selectedElements={selectedElements}
          zoom={zoom}
          canvasPosition={canvasPosition}
          onUpdateElement={updateElement}
          snapEnabled={snapEnabled}
        />
      )}
    </div>
  );
};