import React from 'react';
import { CanvasElement } from '../types';
import { MiroStyleElement } from './MiroStyleElement';
import { cn } from '@/lib/utils';

interface MiroStyleCanvasProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedTool: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
  onElementSelect: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
}

export const MiroStyleCanvas: React.FC<MiroStyleCanvasProps> = ({
  elements,
  selectedElementId,
  selectedTool,
  zoom,
  canvasPosition,
  showGrid,
  canvasRef,
  onElementSelect,
  onElementMouseDown,
  onCanvasClick,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp
}) => {
  const getCursorStyle = () => {
    switch (selectedTool) {
      case 'hand':
        return 'grab';
      case 'zoom':
        return 'zoom-in';
      case 'pen':
        return 'crosshair';
      case 'text':
      case 'sticky':
      case 'rectangle':
      case 'circle':
        return 'crosshair';
      case 'select':
      default:
        return 'default';
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-50 overflow-hidden">
      {/* Grid Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: `${24 * (zoom / 100)}px ${24 * (zoom / 100)}px`,
            backgroundPosition: `${canvasPosition.x * (zoom / 100)}px ${canvasPosition.y * (zoom / 100)}px`
          }}
        />
      )}

      {/* Canvas Content */}
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          cursor: getCursorStyle(),
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
          transformOrigin: 'top left'
        }}
        onClick={onCanvasClick}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
      >
        {/* Render Elements */}
        {elements.map((element) => (
          <MiroStyleElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onSelect={() => onElementSelect(element.id)}
            onMouseDown={(e) => onElementMouseDown(e, element.id)}
          />
        ))}
        
        {/* Selection Preview for drawing tools */}
        {(selectedTool === 'rectangle' || selectedTool === 'circle' || selectedTool === 'sticky') && (
          <div className="absolute pointer-events-none">
            {/* This will be handled by drawing preview component */}
          </div>
        )}
      </div>
    </div>
  );
};