
import React from 'react';

interface CanvasDrawingPreviewProps {
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  selectedTool: string;
  isSelecting?: boolean;
  selectionBox?: { start: { x: number; y: number }; end: { x: number; y: number } } | null;
}

export const CanvasDrawingPreview: React.FC<CanvasDrawingPreviewProps> = ({
  isDrawing,
  drawStart,
  drawEnd,
  selectedTool,
  isSelecting,
  selectionBox
}) => {
  if (isSelecting && selectionBox) {
    const { start, end } = selectionBox;
    const left = Math.min(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    return (
      <div
        className="absolute border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none"
        style={{
          left,
          top,
          width,
          height
        }}
      />
    );
  }

  if (!isDrawing || !drawStart || !drawEnd) return null;

  const left = Math.min(drawStart.x, drawEnd.x);
  const top = Math.min(drawStart.y, drawEnd.y);
  const width = Math.abs(drawEnd.x - drawStart.x);
  const height = Math.abs(drawEnd.y - drawStart.y);

  const getPreviewStyle = () => {
    switch (selectedTool) {
      case 'shape':
        return 'border-2 border-blue-500 bg-blue-200 bg-opacity-50';
      case 'text':
        return 'border-2 border-gray-500 bg-gray-200 bg-opacity-50';
      case 'smart-element':
        return 'border-2 border-green-500 bg-green-200 bg-opacity-50';
      default:
        return 'border-2 border-gray-500 bg-gray-200 bg-opacity-50';
    }
  };

  return (
    <div
      className={`absolute pointer-events-none ${getPreviewStyle()}`}
      style={{
        left,
        top,
        width: Math.max(width, 20),
        height: Math.max(height, 20)
      }}
    />
  );
};
