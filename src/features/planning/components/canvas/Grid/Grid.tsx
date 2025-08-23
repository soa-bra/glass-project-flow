import React from 'react';
import { useCanvasStore } from '../../../store/canvas.store';

export const Grid: React.FC = () => {
  const { gridSize, gridType } = useCanvasStore();

  const renderDotsGrid = () => {
    const dots = [];
    const viewportWidth = 2000; // Extend beyond viewport
    const viewportHeight = 2000;
    
    for (let x = 0; x < viewportWidth; x += gridSize) {
      for (let y = 0; y < viewportHeight; y += gridSize) {
        dots.push(
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={0.5}
            fill="hsl(var(--muted-foreground) / 0.3)"
          />
        );
      }
    }
    
    return dots;
  };

  const renderLinesGrid = () => {
    const lines = [];
    const viewportWidth = 2000;
    const viewportHeight = 2000;
    
    // Vertical lines
    for (let x = 0; x <= viewportWidth; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={viewportHeight}
          stroke="hsl(var(--muted-foreground) / 0.2)"
          strokeWidth={0.5}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= viewportHeight; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={viewportWidth}
          y2={y}
          stroke="hsl(var(--muted-foreground) / 0.2)"
          strokeWidth={0.5}
        />
      );
    }
    
    return lines;
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {gridType === 'dots' && renderDotsGrid()}
      {gridType === 'grid' && renderLinesGrid()}
      {/* Isometric and Hex grids will be implemented later */}
    </svg>
  );
};