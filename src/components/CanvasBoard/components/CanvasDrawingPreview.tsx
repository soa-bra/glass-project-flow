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
  isSelecting = false,
  selectionBox = null
}) => {
  return (
    <>
      {/* مؤشر الرسم للعناصر التي تحتاج سحب */}
      {isDrawing && drawStart && drawEnd && ['smart-element', 'shape', 'text-box'].includes(selectedTool) && (
        <div
          className="absolute border-2 border-dashed border-blue-500 bg-blue-50 opacity-50 pointer-events-none"
          style={{
            left: Math.min(drawStart.x, drawEnd.x),
            top: Math.min(drawStart.y, drawEnd.y),
            width: Math.abs(drawEnd.x - drawStart.x),
            height: Math.abs(drawEnd.y - drawStart.y)
          }}
        />
      )}

      {/* مؤشر الرسم للقلم الذكي */}
      {isDrawing && drawStart && drawEnd && selectedTool === 'smart-pen' && (
        <div className="absolute pointer-events-none">
          <svg 
            className="absolute pointer-events-none"
            style={{
              left: Math.min(drawStart.x, drawEnd.x),
              top: Math.min(drawStart.y, drawEnd.y),
              width: Math.abs(drawEnd.x - drawStart.x) + 4,
              height: Math.abs(drawEnd.y - drawStart.y) + 4
            }}
          >
            <line
              x1={drawStart.x < drawEnd.x ? 2 : Math.abs(drawEnd.x - drawStart.x) + 2}
              y1={drawStart.y < drawEnd.y ? 2 : Math.abs(drawEnd.y - drawStart.y) + 2}
              x2={drawEnd.x < drawStart.x ? 2 : Math.abs(drawEnd.x - drawStart.x) + 2}
              y2={drawEnd.y < drawStart.y ? 2 : Math.abs(drawEnd.y - drawStart.y) + 2}
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4,4"
              opacity="0.7"
            />
          </svg>
        </div>
      )}

      {/* صندوق التحديد المتعدد */}
      {isSelecting && selectionBox && (
        <div
          className="absolute border-2 border-dashed border-green-500 bg-green-50 opacity-30 pointer-events-none"
          style={{
            left: Math.min(selectionBox.start.x, selectionBox.end.x),
            top: Math.min(selectionBox.start.y, selectionBox.end.y),
            width: Math.abs(selectionBox.end.x - selectionBox.start.x),
            height: Math.abs(selectionBox.end.y - selectionBox.start.y)
          }}
        />
      )}
    </>
  );
};