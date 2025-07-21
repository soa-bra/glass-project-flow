import React from 'react';

interface CanvasGridProps {
  showGrid: boolean;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ showGrid }) => {
  if (!showGrid) return null;

  return (
    <div 
      className="absolute inset-0 opacity-15 pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: '12px 12px'
      }}
    />
  );
};