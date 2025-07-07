import React from 'react';
import { CanvasElement as CanvasElementType } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { ElementResizeHandles } from './ElementResizeHandles';

interface CanvasElementProps {
  element: CanvasElementType;
  selectedElementId: string | null;
  selectedTool: string;
  onElementSelect: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onElementMouseMove: (e: React.MouseEvent) => void;
  onElementMouseUp: () => void;
  onResizeMouseDown: (e: React.MouseEvent, handle: string) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  selectedElementId,
  selectedTool,
  onElementSelect,
  onElementMouseDown,
  onElementMouseMove,
  onElementMouseUp,
  onResizeMouseDown
}) => {
  console.log('🎨 CanvasElement render:', {
    id: element.id,
    type: element.type,
    selected: selectedElementId === element.id,
    tool: selectedTool,
    position: element.position,
    size: element.size
  });

  return (
    <div key={element.id}>
      {/* العنصر الأساسي */}
      <div
        className={`absolute border-2 ${selectedElementId === element.id ? 'border-blue-500' : 'border-transparent'} 
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
            onElementSelect(element.id);
            console.log('Element selected:', element.type, element.id);
          }
        }}
        onMouseDown={(e) => {
          if (selectedTool === 'select' && !element.locked) {
            e.stopPropagation();
            onElementMouseDown(e, element.id);
            console.log('Element mouse down:', element.id);
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