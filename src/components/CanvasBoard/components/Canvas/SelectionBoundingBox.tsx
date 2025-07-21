
import React from 'react';
import { CanvasElement } from '../../types';

interface SelectionBoundingBoxProps {
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  snapEnabled: boolean;
}

export const SelectionBoundingBox: React.FC<SelectionBoundingBoxProps> = ({
  selectedElements
}) => {
  if (selectedElements.length === 0) return null;

  // Calculate bounding box for all selected elements
  const bounds = selectedElements.reduce(
    (acc, element) => {
      const left = element.position.x;
      const top = element.position.y;
      const right = left + element.size.width;
      const bottom = top + element.size.height;

      return {
        left: Math.min(acc.left, left),
        top: Math.min(acc.top, top),
        right: Math.max(acc.right, right),
        bottom: Math.max(acc.bottom, bottom)
      };
    },
    { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  );

  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;

  return (
    <div
      className="absolute border-2 border-blue-500 pointer-events-none"
      style={{
        left: bounds.left,
        top: bounds.top,
        width,
        height,
        zIndex: 1001
      }}
    >
      {/* Corner handles */}
      <div className="absolute w-2 h-2 bg-blue-500 -top-1 -left-1" />
      <div className="absolute w-2 h-2 bg-blue-500 -top-1 -right-1" />
      <div className="absolute w-2 h-2 bg-blue-500 -bottom-1 -left-1" />
      <div className="absolute w-2 h-2 bg-blue-500 -bottom-1 -right-1" />
    </div>
  );
};
