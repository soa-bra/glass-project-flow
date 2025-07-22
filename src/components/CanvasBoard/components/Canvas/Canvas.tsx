
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
    handleElementMouseUp,
    isSelecting,
    selectionBox
  } = useCanvasInteractionHandlers(
    selectedTool,
    zoom,
    canvasPosition,
    snapEnabled,
    selectedSmartElement,
    addElement,
    elements,
    selectedElementIds,
    setSelectedElementIds,
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
    <div className="relative w-full h-full bg-white overflow-auto">
      {/* Grid */}
      {showGrid && <CanvasGrid />}

      {/* Main Canvas Area - Infinite Space */}
      <div
        ref={canvasRef}
        className="absolute bg-slate-50"
        style={{
          left: 0,
          top: 0,
          width: '10000px', // Large canvas for infinite space
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
            isSelected={selectedElementIds.includes(element.id)}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            onMouseMove={handleElementMouseMove}
            onMouseUp={handleElementMouseUp}
          />
        ))}

        {/* Selection Box - Multi-select with drag */}
        {isSelecting && selectionBox && (
          <div
            className="absolute border-2 border-blue-500 border-dashed bg-blue-100/20 pointer-events-none"
            style={{
              left: Math.min(selectionBox.start.x, selectionBox.end.x),
              top: Math.min(selectionBox.start.y, selectionBox.end.y),
              width: Math.abs(selectionBox.end.x - selectionBox.start.x),
              height: Math.abs(selectionBox.end.y - selectionBox.start.y),
              zIndex: 1002
            }}
          />
        )}
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
