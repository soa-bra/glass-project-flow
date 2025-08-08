import React, { useRef, useEffect, useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { CanvasElement as CanvasElementComponent } from './CanvasElement';
import { SimplifiedSelectionBoundingBox } from '../SimplifiedSelectionBoundingBox';
import { CanvasDiagnostics } from '../CanvasDiagnostics';
import { InfiniteCanvas, InfiniteCanvasRef } from './InfiniteCanvas';
import { useUnifiedSelection } from '../../hooks/useUnifiedSelection';
import { useSimplifiedCanvasInteraction } from '../../hooks/useSimplifiedCanvasInteraction';
import { useCanvasElements } from '../../hooks/useCanvasElements';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';
import { useRefactoredCanvasEventHandlers } from '../../hooks/useRefactoredCanvasEventHandlers';

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
  elements?: CanvasElement[];
  selectedElementIds?: string[];
  showDiagnostics?: boolean;
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
  onPositionChange,
  elements: externalElements,
  selectedElementIds: externalSelectedIds,
  showDiagnostics = false, ...rest
}) => {
  const infiniteCanvasRef = useRef<InfiniteCanvasRef>(null);
  const dummyRef = useRef<HTMLDivElement>(null);
  const { saveToHistory } = useCanvasHistory();
  const { elements, setElements, addElement, updateElement, deleteElement } = useCanvasElements(saveToHistory);
  const selection = useUnifiedSelection();
  const interaction = useSimplifiedCanvasInteraction(dummyRef);
  
  // Create wrapper function to match expected signature
  const addElementWrapper = useCallback((element: any) => {
    // Handle both old and new element formats
    if (element.position && element.size) {
      // New format with position and size
      addElement(element.position.x, element.position.y, element.type, selectedSmartElement, element.size.width, element.size.height);
    } else {
      // Old format with x, y, width, height
      addElement(element.x || 0, element.y || 0, element.type, selectedSmartElement, element.width || 100, element.height || 100);
    }
  }, [addElement, selectedSmartElement]);

  const eventHandlers = useRefactoredCanvasEventHandlers(
    selectedTool,
    zoom,
    canvasPosition,
    snapEnabled,
    interaction,
    addElementWrapper,
    elements,
    selection.selectedElementIds,
    selection.clearSelection,
    selection.selectMultiple,
    selection.selectElement,
    updateElement,
    onPositionChange || (() => {}),
    onZoomChange || (() => {}),
    selectedSmartElement
  );

  // Sync external elements and notify parent
  useEffect(() => {
    if (externalElements) setElements(externalElements);
    onElementsChange?.(elements);
  }, [externalElements, elements, onElementsChange, setElements]);

  useEffect(() => {
    onSelectionChange?.(selection.selectedElementIds);
  }, [selection.selectedElementIds, onSelectionChange]);

  useEffect(() => {
    if (externalSelectedIds) {
      selection.selectMultiple(externalSelectedIds);
    }
  }, [externalSelectedIds, selection.selectMultiple]);

  const selectedElements = elements.filter(el => selection.isSelected(el.id));

  return (
    <div 
      className="w-full h-full relative"
      style={{ cursor: eventHandlers.toolCursor.getCursorStyle(selectedTool) }}
      onWheel={eventHandlers.handleWheelZoom}
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
        {/* Smart pen path overlay with correct transform */}
        {eventHandlers.enhancedSmartPenTool && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
              transformOrigin: '0 0'
            }}
          >
            <svg className="w-full h-full" style={{ zIndex: 998 }}>
              {eventHandlers.enhancedSmartPenTool.currentPath.length > 0 && (
                <path
                  d={eventHandlers.enhancedSmartPenTool.currentPath.reduce((acc, point, index) => {
                    return index === 0 ? `M ${point.x} ${point.y}` : acc + ` L ${point.x} ${point.y}`;
                  }, '')}
                  stroke="#000000"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>
        )}

        {/* Transform wrapper for all canvas elements */}
        <div 
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
            transformOrigin: '0 0'
          }}
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
        </div>
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

      {/* Diagnostics Panel */}
      <CanvasDiagnostics
        selectedTool={selectedTool}
        elements={elements}
        selectedElementIds={selection.selectedElementIds}
        zoom={zoom}
        canvasPosition={canvasPosition}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        isVisible={showDiagnostics}
      />
    </div>
  );
};