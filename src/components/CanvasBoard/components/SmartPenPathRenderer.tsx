import React from 'react';

interface Point {
  x: number;
  y: number;
}

interface SmartPenPathRendererProps {
  currentPath: Point[];
  completedPaths: Point[][];
  isDrawing: boolean;
  zoom: number;
  canvasPosition: { x: number; y: number };
  lineWidth: number;
  lineColor: string;
}

export const SmartPenPathRenderer: React.FC<SmartPenPathRendererProps> = ({
  currentPath,
  completedPaths,
  isDrawing,
  zoom,
  canvasPosition,
  lineWidth = 2,
  lineColor = '#000000'
}) => {
  const pathToSVGPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      
      if (i === 1) {
        // For the first segment, just draw a line
        path += ` L ${current.x} ${current.y}`;
      } else {
        // Use quadratic curves for smoother lines
        const next = points[i + 1];
        if (next) {
          const cpx = current.x;
          const cpy = current.y;
          const endX = (current.x + next.x) / 2;
          const endY = (current.y + next.y) / 2;
          path += ` Q ${cpx} ${cpy} ${endX} ${endY}`;
        } else {
          // Last point, just draw a line
          path += ` L ${current.x} ${current.y}`;
        }
      }
    }
    
    return path;
  };

  const scaledLineWidth = lineWidth * (zoom / 100);

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
        transformOrigin: '0 0',
        zIndex: 999
      }}
    >
      <svg className="w-full h-full absolute inset-0">
        {/* Render completed paths */}
        {completedPaths.map((path, index) => (
          <path
            key={`completed-${index}`}
            d={pathToSVGPath(path)}
            stroke={lineColor}
            strokeWidth={scaledLineWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        
        {/* Render current path being drawn */}
        {isDrawing && currentPath.length > 0 && (
          <path
            d={pathToSVGPath(currentPath)}
            stroke={lineColor}
            strokeWidth={scaledLineWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        )}
      </svg>
    </div>
  );
};