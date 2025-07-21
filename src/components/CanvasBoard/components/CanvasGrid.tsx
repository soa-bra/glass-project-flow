import React from 'react';

interface CanvasGridProps {
  showGrid?: boolean;
  size?: number;
  type?: "dots" | "lines" | "isometric" | "hex";
  zoom?: number;
  position?: { x: number; y: number };
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ 
  showGrid = true, 
  size = 24, 
  type = "dots", 
  zoom = 100, 
  position = { x: 0, y: 0 } 
}) => {
  if (!showGrid) return null;

  const getGridPattern = () => {
    const adjustedSize = (size * zoom) / 100;
    
    switch (type) {
      case "lines":
        return {
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${adjustedSize}px ${adjustedSize}px`
        };
      case "dots":
      default:
        return {
          backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 1px, transparent 1px)',
          backgroundSize: `${adjustedSize}px ${adjustedSize}px`
        };
    }
  };

  return (
    <div 
      className="absolute inset-0 opacity-15 pointer-events-none"
      style={{
        ...getGridPattern(),
        backgroundPosition: `${position.x % size}px ${position.y % size}px`
      }}
    />
  );
};