
import React, { useState, useCallback, useEffect } from 'react';
import { CanvasElement } from '../../types';

interface SelectionBoundingBoxProps {
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  snapEnabled: boolean;
}

export const SelectionBoundingBox: React.FC<SelectionBoundingBoxProps> = ({
  selectedElements,
  zoom,
  canvasPosition,
  onUpdateElement,
  snapEnabled
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [initialBounds, setInitialBounds] = useState<any>(null);

  if (selectedElements.length === 0) return null;

  // Calculate bounding box for all selected elements
  const calculateBoundingBox = () => {
    if (selectedElements.length === 0) return null;

    const bounds = selectedElements.reduce(
      (acc, element) => {
        const left = element.position.x;
        const top = element.position.y;
        const right = left + element.size.width;
        const bottom = top + element.size.height;

        return {
          left: Math.min(acc.left, left),
          top: Math.min(acc.top, top),
          right: Math.max(acc.right, right),
          bottom: Math.max(acc.bottom, bottom)
        };
      },
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );

    return {
      x: bounds.left,
      y: bounds.top,
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
    };
  };

  const snapToGrid = (value: number): number => {
    if (!snapEnabled) return value;
    const gridSize = 24;
    return Math.round(value / gridSize) * gridSize;
  };

  const handleResizeStart = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    
    const boundingBox = calculateBoundingBox();
    if (boundingBox) {
      setInitialBounds({
        ...boundingBox,
        mouseX: e.clientX,
        mouseY: e.clientY,
        elements: selectedElements.map(el => ({ ...el }))
      });
    }
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !initialBounds || !resizeHandle) return;

    const deltaX = (e.clientX - initialBounds.mouseX) / (zoom / 100);
    const deltaY = (e.clientY - initialBounds.mouseY) / (zoom / 100);

    let newBounds = { ...initialBounds };

    // Calculate new bounds based on resize handle
    switch (resizeHandle) {
      case 'nw': // top-left
        newBounds.x = snapToGrid(initialBounds.x + deltaX);
        newBounds.y = snapToGrid(initialBounds.y + deltaY);
        newBounds.width = snapToGrid(initialBounds.width - deltaX);
        newBounds.height = snapToGrid(initialBounds.height - deltaY);
        break;
      case 'ne': // top-right
        newBounds.y = snapToGrid(initialBounds.y + deltaY);
        newBounds.width = snapToGrid(initialBounds.width + deltaX);
        newBounds.height = snapToGrid(initialBounds.height - deltaY);
        break;
      case 'sw': // bottom-left
        newBounds.x = snapToGrid(initialBounds.x + deltaX);
        newBounds.width = snapToGrid(initialBounds.width - deltaX);
        newBounds.height = snapToGrid(initialBounds.height + deltaY);
        break;
      case 'se': // bottom-right
        newBounds.width = snapToGrid(initialBounds.width + deltaX);
        newBounds.height = snapToGrid(initialBounds.height + deltaY);
        break;
      case 'n': // top
        newBounds.y = snapToGrid(initialBounds.y + deltaY);
        newBounds.height = snapToGrid(initialBounds.height - deltaY);
        break;
      case 's': // bottom
        newBounds.height = snapToGrid(initialBounds.height + deltaY);
        break;
      case 'e': // right
        newBounds.width = snapToGrid(initialBounds.width + deltaX);
        break;
      case 'w': // left
        newBounds.x = snapToGrid(initialBounds.x + deltaX);
        newBounds.width = snapToGrid(initialBounds.width - deltaX);
        break;
    }

    // Ensure minimum size
    newBounds.width = Math.max(20, newBounds.width);
    newBounds.height = Math.max(20, newBounds.height);

    // Calculate scaling factors
    const scaleX = newBounds.width / initialBounds.width;
    const scaleY = newBounds.height / initialBounds.height;

    // Update selected elements
    selectedElements.forEach((element, index) => {
      const originalElement = initialBounds.elements[index];
      
      // Calculate relative position within the bounding box
      const relativeX = (originalElement.position.x - initialBounds.x) / initialBounds.width;
      const relativeY = (originalElement.position.y - initialBounds.y) / initialBounds.height;
      const relativeWidth = originalElement.size.width / initialBounds.width;
      const relativeHeight = originalElement.size.height / initialBounds.height;

      // Apply scaling
      const newX = newBounds.x + relativeX * newBounds.width;
      const newY = newBounds.y + relativeY * newBounds.height;
      const newWidth = relativeWidth * newBounds.width;
      const newHeight = relativeHeight * newBounds.height;

      onUpdateElement(element.id, {
        position: { x: newX, y: newY },
        size: { width: Math.max(20, newWidth), height: Math.max(20, newHeight) }
      });
    });
  }, [isResizing, initialBounds, resizeHandle, zoom, snapToGrid, selectedElements, onUpdateElement]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle('');
    setInitialBounds(null);
  }, []);

  // Add event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const boundingBox = calculateBoundingBox();
  if (!boundingBox || selectedElements.length === 0) return null;

  return (
    <div
      className="absolute border-2 border-blue-500 pointer-events-none"
      style={{
        left: boundingBox.x,
        top: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
        zIndex: 1001,
        transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
        transformOrigin: '0 0'
      }}
    >
      {/* Corner handles */}
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize pointer-events-auto"
        style={{ top: -6, left: -6 }}
        onMouseDown={(e) => handleResizeStart('nw', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-ne-resize pointer-events-auto"
        style={{ top: -6, right: -6 }}
        onMouseDown={(e) => handleResizeStart('ne', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-sw-resize pointer-events-auto"
        style={{ bottom: -6, left: -6 }}
        onMouseDown={(e) => handleResizeStart('sw', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize pointer-events-auto"
        style={{ bottom: -6, right: -6 }}
        onMouseDown={(e) => handleResizeStart('se', e)}
      />

      {/* Edge handles */}
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-n-resize pointer-events-auto"
        style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeStart('n', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-s-resize pointer-events-auto"
        style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeStart('s', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-e-resize pointer-events-auto"
        style={{ top: '50%', right: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeStart('e', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-w-resize pointer-events-auto"
        style={{ top: '50%', left: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeStart('w', e)}
      />
    </div>
  );
};
