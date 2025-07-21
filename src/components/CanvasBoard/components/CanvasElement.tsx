import React from 'react';
import { CanvasElement as CanvasElementType } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { ElementResizeHandles } from './ElementResizeHandles';

interface CanvasElementProps {
  element: CanvasElementType;
  selectedElementId?: string | null;
  selectedTool?: string;
  isSelected?: boolean;
  zoom?: number;
  snapEnabled?: boolean;
  gridSize?: number;
  onElementSelect?: (id: string) => void;
  onElementMouseDown?: (e: React.MouseEvent, elementId: string) => void;
  onElementMouseMove?: (e: React.MouseEvent) => void;
  onElementMouseUp?: () => void;
  onResizeMouseDown?: (e: React.MouseEvent, handle: string) => void;
  onSelect?: () => void;
  onUpdate?: (updates: any) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  selectedElementId,
  selectedTool = 'select',
  isSelected = false,
  zoom = 100,
  snapEnabled = false,
  gridSize = 24,
  onElementSelect,
  onElementMouseDown,
  onElementMouseMove,
  onElementMouseUp,
  onResizeMouseDown,
  onSelect,
  onUpdate
}) => {
  const handleSelect = () => {
    if (onSelect) onSelect();
    if (onElementSelect) onElementSelect(element.id);
  };

  return (
    <div key={element.id}>
      {/* العنصر الأساسي */}
      <div
        className={`absolute border-2 ${isSelected || selectedElementId === element.id ? 'border-blue-500' : 'border-transparent'} 
                  ${element.locked ? 'cursor-not-allowed' : (selectedTool === 'select' ? 'cursor-move' : 'cursor-pointer')} 
                  hover:border-blue-300 transition-colors`}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (selectedTool === 'select') {
            handleSelect();
          }
        }}
        onMouseDown={(e) => {
          if (selectedTool === 'select' && !element.locked) {
            e.stopPropagation();
            if (onElementMouseDown) onElementMouseDown(e, element.id);
          }
        }}
        onMouseMove={onElementMouseMove}
        onMouseUp={onElementMouseUp}
      >
        <ElementRenderer element={element} />
      </div>

      {/* Resize Handles */}
      <ElementResizeHandles
        element={element}
        selectedElementId={selectedElementId}
        selectedTool={selectedTool}
        onResizeMouseDown={onResizeMouseDown}
      />
    </div>
  );
};