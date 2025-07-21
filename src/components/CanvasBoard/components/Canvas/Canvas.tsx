
import React, { useRef, useEffect } from 'react';
import { CanvasElement } from '../../types';
import { CanvasGrid } from './CanvasGrid';
import { CanvasElement as CanvasElementComponent } from './CanvasElement';
import { CanvasDrawingPreview } from './CanvasDrawingPreview';
import { SelectionBoundingBox } from './SelectionBoundingBox';
import { useCanvasInteractionHandlers } from '../../hooks/useCanvasInteractionHandlers';
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
  const [selectedElementIds, setSelectedElementIds] = React.useState<string[]>([]);

  // Notify parent of changes
  useEffect(() => {
    onElementsChange?.(elements);
  }, [elements, onElementsChange]);

  useEffect(() => {
    onSelectionChange?.(selectedElementIds);
  }, [selectedElementIds, onSelectionChange]);

  const {
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp
  } = useCanvasInteractionHandlers(
    selectedTool,
    zoom,
    canvasPosition,
    snapEnabled,
    selectedSmartElement,
    false, // isSelecting
    false, // isDrawing
    addElement,
    setSelectedElementIds,
    elements,
    selectedElementIds,
    updateElement,
    (id: string | null) => setSelectedElementIds(id ? [id] : []),
    canvasRef
  );

  const getCursorStyle = () => {
    switch (selectedTool) {
      case 'hand': return 'grab';
      case 'zoom': return 'zoom-in';
      case 'smart-pen': return 'crosshair';
      case 'text':
      case 'shape':
      case 'smart-element': return 'crosshair';
      default: return 'default';
    }
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Grid */}
      {showGrid && <CanvasGrid />}

      {/* Main Canvas Area */}
      <div
        ref={canvasRef}
        className="absolute inset-0 bg-slate-50"
        style={{
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
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
            isSelected={selectedElementIds.includes(element.id)}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            onMouseMove={handleElementMouseMove}
            onMouseUp={handleElementMouseUp}
          />
        ))}
      </div>

      {/* Selection Bounding Box */}
      {selectedElementIds.length > 0 && (
        <SelectionBoundingBox
          selectedElements={elements.filter(el => selectedElementIds.includes(el.id))}
          zoom={zoom}
          canvasPosition={canvasPosition}
          onUpdateElement={updateElement}
          snapEnabled={snapEnabled}
        />
      )}
    </div>
  );
};
