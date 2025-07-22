
import React, { useRef, useEffect } from 'react';
import { CanvasElement } from '../../types';
import { CanvasGrid } from './CanvasGrid';
import { CanvasElement as CanvasElementComponent } from './CanvasElement';
import { SimplifiedSelectionBoundingBox } from '../SimplifiedSelectionBoundingBox';
import { useUnifiedSelection } from '../../hooks/useUnifiedSelection';
import { useSimplifiedCanvasInteraction } from '../../hooks/useSimplifiedCanvasInteraction';
import { useCanvasElements } from '../../hooks/useCanvasElements';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';

interface CanvasProps {
  selectedTool: string;
  selectedSmartElement?: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  onElementsChange?: (elements: CanvasElement[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  selectedTool,
  selectedSmartElement = '',
  zoom,
  canvasPosition,
  showGrid,
  snapEnabled,
  onElementsChange,
  onSelectionChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { saveToHistory } = useCanvasHistory();
  const { elements, addElement, updateElement, deleteElement } = useCanvasElements(saveToHistory);
  const selection = useUnifiedSelection();
  const interaction = useSimplifiedCanvasInteraction(canvasRef);

  // Notify parent of changes
  useEffect(() => {
    onElementsChange?.(elements);
  }, [elements, onElementsChange]);

  useEffect(() => {
    onSelectionChange?.(selection.selectedElementIds);
  }, [selection.selectedElementIds, onSelectionChange]);

  // Get selected elements
  const selectedElements = elements.filter(el => selection.isSelected(el.id));

  // Canvas event handlers
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (selectedTool !== 'select') return;
    
    // Clear selection on canvas click
    selection.clearSelection();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      interaction.startSelectionBox(e, zoom, canvasPosition, snapEnabled);
      return;
    }

    // Handle other tools (text, shape, etc.)
    if (selectedTool === 'text' || selectedTool === 'sticky') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
      const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
      
      addElement(x, y, selectedTool, selectedSmartElement);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      if (interaction.isSelecting) {
        interaction.updateSelectionBox(e, zoom, canvasPosition, snapEnabled);
      } else if (interaction.isDragging) {
        interaction.updateElementDrag(e, zoom, canvasPosition, snapEnabled, updateElement);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (selectedTool === 'select') {
      if (interaction.isSelecting) {
        interaction.endSelectionBox(elements, selection.selectMultiple);
      } else if (interaction.isDragging) {
        interaction.endElementDrag();
      }
    }
  };

  // Element event handlers
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (selectedTool !== 'select') return;

    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    // Handle selection
    if (e.ctrlKey || e.metaKey) {
      selection.toggleElementSelection(elementId);
    } else if (!selection.isSelected(elementId)) {
      selection.selectElement(elementId);
    }

    // Start drag if element is selected
    if (selection.isSelected(elementId)) {
      interaction.startElementDrag(e, elementId, element, zoom, canvasPosition);
    }
  };

  const getCursorStyle = () => {
    switch (selectedTool) {
      case 'hand': return 'grab';
      case 'zoom': return 'zoom-in';
      case 'select': return 'default';
      default: return 'crosshair';
    }
  };

  return (
    <div className="relative w-full h-full bg-white overflow-auto">
      {/* Grid */}
      {showGrid && <CanvasGrid />}

      {/* Main Canvas Area */}
      <div
        ref={canvasRef}
        className="absolute bg-slate-50"
        style={{
          left: 0,
          top: 0,
          width: '10000px',
          height: '10000px',
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
          transformOrigin: '0 0',
          cursor: getCursorStyle()
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {/* Render Elements */}
        {elements.map(element => (
          <CanvasElementComponent
            key={element.id}
            element={element}
            isSelected={selection.isSelected(element.id)}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            onMouseMove={() => {}}
            onMouseUp={() => {}}
          />
        ))}

        {/* Selection Box */}
        {interaction.isSelecting && interaction.selectionBoxBounds && (
          <div
            className="absolute border-2 border-blue-500 border-dashed bg-blue-100/20 pointer-events-none"
            style={{
              left: Math.min(interaction.selectionBoxBounds.start.x, interaction.selectionBoxBounds.end.x),
              top: Math.min(interaction.selectionBoxBounds.start.y, interaction.selectionBoxBounds.end.y),
              width: Math.abs(interaction.selectionBoxBounds.end.x - interaction.selectionBoxBounds.start.x),
              height: Math.abs(interaction.selectionBoxBounds.end.y - interaction.selectionBoxBounds.start.y),
              zIndex: 1002
            }}
          />
        )}
      </div>

      {/* Selection Bounding Box */}
      {selectedElements.length > 0 && (
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
