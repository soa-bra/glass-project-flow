
import React from 'react';

interface CanvasGridProps {
  showGrid: boolean;
  gridColor?: string;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ showGrid, gridColor = '#e9eff4' }) => {
  if (!showGrid) return null;

  return (
    <div 
      className="absolute inset-0 opacity-15 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        backgroundPosition: '12px 12px'
      }}
    />
  );
};
