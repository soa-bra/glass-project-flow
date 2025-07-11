
import React from 'react';

interface CanvasDrawingPreviewProps {
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  currentPath?: { x: number; y: number }[];
  selectedTool: string;
  lineWidth?: number;
  lineColor?: string;
  isSelecting?: boolean;
  selectionBox?: { start: { x: number; y: number }; end: { x: number; y: number } } | null;
}

export const CanvasDrawingPreview: React.FC<CanvasDrawingPreviewProps> = ({
  isDrawing,
  drawStart,
  drawEnd,
  currentPath = [],
  selectedTool,
  lineWidth = 2,
  lineColor = '#000000',
  isSelecting = false,
  selectionBox = null
}) => {
  if (!isDrawing) return null;

  // Selection box preview
  if (isSelecting && selectionBox) {
    const { start, end } = selectionBox;
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);

    return (
      <div
        className="absolute border-2 border-dashed border-blue-500 bg-blue-100/20 pointer-events-none"
        style={{
          left: x,
          top: y,
          width,
          height,
          zIndex: 1000
        }}
      />
    );
  }

  // Smart pen drawing preview
  if (selectedTool === 'smart-pen' && currentPath.length > 1) {
    const pathString = currentPath
      .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
      .join(' ');

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 999 }}
      >
        <path
          d={pathString}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.8}
        />
      </svg>
    );
  }

  // Shape preview for drag creation
  if (['shape', 'smart-element', 'text-box'].includes(selectedTool) && drawStart && drawEnd) {
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);

    return (
      <div
        className="absolute border-2 border-dashed border-gray-400 bg-gray-100/20 pointer-events-none"
        style={{
          left: x,
          top: y,
          width,
          height,
          zIndex: 998
        }}
      />
    );
  }

  return null;
};
