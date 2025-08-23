import React from 'react';
import { useCanvasStore } from '../../store/canvas.store';

interface SnapGuidesProps {
  vertical: number[];
  horizontal: number[];
}

export const SnapGuides: React.FC<SnapGuidesProps> = ({ vertical, horizontal }) => {
  // Use large values for guide lines to ensure they span the entire visible area
  const viewBox = { width: 10000, height: 10000 };

  return (
    <g className="snap-guides-layer" opacity={0.8}>
      {/* Vertical guides */}
      {vertical.map((x, index) => (
        <line
          key={`vertical-${index}`}
          x1={x}
          y1={-viewBox.height}
          x2={x}
          y2={viewBox.height}
          stroke="hsl(var(--primary))"
          strokeWidth={1}
          strokeDasharray="4 4"
          className="pointer-events-none"
        />
      ))}
      
      {/* Horizontal guides */}
      {horizontal.map((y, index) => (
        <line
          key={`horizontal-${index}`}
          x1={-viewBox.width}
          y1={y}
          x2={viewBox.width}
          y2={y}
          stroke="hsl(var(--primary))"
          strokeWidth={1}
          strokeDasharray="4 4"
          className="pointer-events-none"
        />
      ))}
    </g>
  );
};