import React from 'react';
import { Point } from '../hooks/useSmartPenTool';

interface SmartPenRendererProps {
  currentPath: Point[];
  completedPaths: { path: Point[]; style: any }[];
  isDrawing: boolean;
  lineWidth: number;
  lineStyle: string;
  penMode: string;
  zoom: number;
}

export const SmartPenRenderer: React.FC<SmartPenRendererProps> = ({
  currentPath,
  completedPaths,
  isDrawing,
  lineWidth,
  lineStyle,
  penMode,
  zoom
}) => {
  const getStrokeStyle = () => {
    const baseColor = '#000000';
    const opacity = penMode === 'highlighter' ? 0.3 : 1;
    
    switch (lineStyle) {
      case 'dashed':
        return `stroke-dasharray: ${lineWidth * 3}, ${lineWidth * 2};`;
      case 'dotted':
        return `stroke-dasharray: ${lineWidth}, ${lineWidth};`;
      default:
        return '';
    }
  };

  const getStrokeWidth = () => {
    const scaledWidth = lineWidth / zoom;
    return Math.max(scaledWidth, 0.5);
  };

  const pathToSVGPath = (points: Point[]) => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    if (points.length === 1) {
      // Single point - draw a small circle
      const radius = getStrokeWidth() / 2;
      return `M ${points[0].x - radius} ${points[0].y} A ${radius} ${radius} 0 1 1 ${points[0].x + radius} ${points[0].y}`;
    }
    
    // Use quadratic curves for smoother lines
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      if (i === 1) {
        path += ` L ${curr.x} ${curr.y}`;
      } else {
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        path += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
      }
    }
    
    return path;
  };

  const getPenColor = () => {
    switch (penMode) {
      case 'highlighter':
        return '#ffff00';
      case 'marker':
        return '#ff0000';
      case 'pencil':
        return '#666666';
      default:
        return '#000000';
    }
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Render completed paths */}
      {completedPaths.map((pathData, index) => (
        <path
          key={index}
          d={pathToSVGPath(pathData.path)}
          fill="none"
          stroke={pathData.style?.stroke || getPenColor()}
          strokeWidth={pathData.style?.strokeWidth || getStrokeWidth()}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={penMode === 'highlighter' ? 0.3 : 1}
          style={{ strokeDasharray: getStrokeStyle() }}
        />
      ))}
      
      {/* Render current drawing path */}
      {isDrawing && currentPath.length > 0 && (
        <path
          d={pathToSVGPath(currentPath)}
          fill="none"
          stroke={getPenColor()}
          strokeWidth={getStrokeWidth()}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={penMode === 'highlighter' ? 0.3 : 1}
          style={{ strokeDasharray: getStrokeStyle() }}
        />
      )}
    </svg>
  );
};