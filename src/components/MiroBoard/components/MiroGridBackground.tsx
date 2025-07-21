import React from 'react';

interface MiroGridBackgroundProps {
  zoom: number;
  position: { x: number; y: number };
}

export const MiroGridBackground: React.FC<MiroGridBackgroundProps> = ({ 
  zoom, 
  position 
}) => {
  const gridSize = 20 * zoom;
  const offsetX = position.x % gridSize;
  const offsetY = position.y % gridSize;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`
        }}
      >
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={gridSize / 2}
              cy={gridSize / 2}
              r={0.5}
              fill="#e5e7eb"
              opacity={zoom > 0.5 ? 0.4 : 0.2}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};