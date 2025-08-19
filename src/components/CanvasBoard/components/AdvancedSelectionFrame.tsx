import React, { useCallback, useState } from 'react';
import { CanvasElement } from '@/types/canvas';

interface AdvancedSelectionFrameProps {
  selectedElements: CanvasElement[];
  zoom: number;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onStartResize: (handle: string) => void;
  onStartMove: () => void;
}

type ResizeHandle = 
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  | 'top' | 'bottom' | 'left' | 'right';

export const AdvancedSelectionFrame: React.FC<AdvancedSelectionFrameProps> = ({
  selectedElements,
  zoom,
  onElementUpdate,
  onStartResize,
  onStartMove
}) => {
  const [isDragging, setIsDragging] = useState(false);

  if (selectedElements.length === 0) return null;

  // Calculate bounding box for all selected elements
  const boundingBox = selectedElements.reduce((box, element) => {
    const left = element.position.x;
    const top = element.position.y;
    const right = element.position.x + element.size.width;
    const bottom = element.position.y + element.size.height;

    return {
      left: Math.min(box.left, left),
      top: Math.min(box.top, top),
      right: Math.max(box.right, right),
      bottom: Math.max(box.bottom, bottom)
    };
  }, {
    left: Infinity,
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity
  });

  const frameWidth = boundingBox.right - boundingBox.left;
  const frameHeight = boundingBox.bottom - boundingBox.top;

  const handleSize = 8 / zoom; // Adjust handle size based on zoom

  const handles: Array<{
    position: ResizeHandle;
    x: number;
    y: number;
    cursor: string;
  }> = [
    // Corner handles
    { position: 'top-left', x: boundingBox.left - handleSize/2, y: boundingBox.top - handleSize/2, cursor: 'nw-resize' },
    { position: 'top-right', x: boundingBox.right - handleSize/2, y: boundingBox.top - handleSize/2, cursor: 'ne-resize' },
    { position: 'bottom-left', x: boundingBox.left - handleSize/2, y: boundingBox.bottom - handleSize/2, cursor: 'sw-resize' },
    { position: 'bottom-right', x: boundingBox.right - handleSize/2, y: boundingBox.bottom - handleSize/2, cursor: 'se-resize' },
    
    // Edge handles
    { position: 'top', x: boundingBox.left + frameWidth/2 - handleSize/2, y: boundingBox.top - handleSize/2, cursor: 'n-resize' },
    { position: 'bottom', x: boundingBox.left + frameWidth/2 - handleSize/2, y: boundingBox.bottom - handleSize/2, cursor: 's-resize' },
    { position: 'left', x: boundingBox.left - handleSize/2, y: boundingBox.top + frameHeight/2 - handleSize/2, cursor: 'w-resize' },
    { position: 'right', x: boundingBox.right - handleSize/2, y: boundingBox.top + frameHeight/2 - handleSize/2, cursor: 'e-resize' }
  ];

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    onStartResize(handle);
  }, [onStartResize]);

  const handleFrameMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start move if clicking on the frame itself, not the handles
    const target = e.target as HTMLElement;
    if (!target.classList.contains('selection-frame')) return;
    
    e.stopPropagation();
    setIsDragging(true);
    onStartMove();
  }, [onStartMove]);

  return (
    <g className="selection-frame-group">
      {/* Selection frame */}
      <rect
        className="selection-frame"
        x={boundingBox.left}
        y={boundingBox.top}
        width={frameWidth}
        height={frameHeight}
        fill="none"
        stroke="#2563eb"
        strokeWidth={1 / zoom}
        strokeDasharray={`${4 / zoom} ${4 / zoom}`}
        style={{ cursor: 'move' }}
        onMouseDown={handleFrameMouseDown}
      />

      {/* Resize handles */}
      {handles.map((handle) => (
        <rect
          key={handle.position}
          x={handle.x}
          y={handle.y}
          width={handleSize}
          height={handleSize}
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth={1 / zoom}
          style={{ cursor: handle.cursor }}
          onMouseDown={(e) => handleMouseDown(e, handle.position)}
          className="resize-handle"
        />
      ))}

      {/* Selection info */}
      <text
        x={boundingBox.left}
        y={boundingBox.top - 10 / zoom}
        fontSize={12 / zoom}
        fill="#2563eb"
        className="selection-info"
      >
        {selectedElements.length > 1 
          ? `${selectedElements.length} عناصر محددة`
          : selectedElements[0]?.type || 'عنصر محدد'
        }
      </text>
    </g>
  );
};