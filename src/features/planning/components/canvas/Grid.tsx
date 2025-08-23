import React from 'react';
import { useCanvasStore } from '../../store/canvas.store';

export const Grid: React.FC = () => {
  const { viewport, grid } = useCanvasStore();
  
  if (!grid.enabled) return null;

  const { size, type } = grid;
  const { zoom, x, y } = viewport;
  
  // Calculate grid pattern based on zoom level
  const scaledSize = size * zoom;
  const offsetX = (x % scaledSize);
  const offsetY = (y % scaledSize);

  return (
    <g className="grid-layer" opacity={0.3}>
      {type === 'dots' && (
        <defs>
          <pattern
            id="grid-dots"
            width={scaledSize}
            height={scaledSize}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <circle
              cx={scaledSize / 2}
              cy={scaledSize / 2}
              r={Math.max(1, zoom * 0.8)}
              fill="currentColor"
              className="text-sb-color-border/40"
            />
          </pattern>
        </defs>
      )}
      
      {type === 'lines' && (
        <defs>
          <pattern
            id="grid-lines"
            width={scaledSize}
            height={scaledSize}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <path
              d={`M ${scaledSize} 0 L 0 0 0 ${scaledSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={Math.max(0.5, zoom * 0.5)}
              className="text-sb-color-border/50"
            />
          </pattern>
        </defs>
      )}
      
      <rect
        width="100%"
        height="100%"
        fill={type === 'dots' ? 'url(#grid-dots)' : 'url(#grid-lines)'}
      />
    </g>
  );
};