
import React, { useState, useCallback, useEffect } from 'react';
import { CanvasElement } from '../../types';
import { useCanvasStyles } from '@/hooks/useCanvasStyles';

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
  const [initialElements, setInitialElements] = useState<CanvasElement[]>([]);

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
    
    const boundingBox = calculateBoundingBox();
    if (!boundingBox) return;

    setIsResizing(true);
    setResizeHandle(handle);
    setInitialBounds(boundingBox);
    setInitialElements([...selectedElements]);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !initialBounds || !resizeHandle) return;

    const zoomFactor = zoom / 100;
    const deltaX = e.movementX / zoomFactor;
    const deltaY = e.movementY / zoomFactor;

    let newBounds = { ...initialBounds };

    // Calculate new bounds based on resize handle
    switch (resizeHandle) {
      case 'nw': // top-left
        newBounds.width = Math.max(20, newBounds.width - deltaX);
        newBounds.height = Math.max(20, newBounds.height - deltaY);
        newBounds.x = initialBounds.x + initialBounds.width - newBounds.width;
        newBounds.y = initialBounds.y + initialBounds.height - newBounds.height;
        break;
      case 'ne': // top-right
        newBounds.width = Math.max(20, newBounds.width + deltaX);
        newBounds.height = Math.max(20, newBounds.height - deltaY);
        newBounds.y = initialBounds.y + initialBounds.height - newBounds.height;
        break;
      case 'sw': // bottom-left
        newBounds.width = Math.max(20, newBounds.width - deltaX);
        newBounds.height = Math.max(20, newBounds.height + deltaY);
        newBounds.x = initialBounds.x + initialBounds.width - newBounds.width;
        break;
      case 'se': // bottom-right
        newBounds.width = Math.max(20, newBounds.width + deltaX);
        newBounds.height = Math.max(20, newBounds.height + deltaY);
        break;
      case 'n': // top
        newBounds.height = Math.max(20, newBounds.height - deltaY);
        newBounds.y = initialBounds.y + initialBounds.height - newBounds.height;
        break;
      case 's': // bottom
        newBounds.height = Math.max(20, newBounds.height + deltaY);
        break;
      case 'e': // right
        newBounds.width = Math.max(20, newBounds.width + deltaX);
        break;
      case 'w': // left
        newBounds.width = Math.max(20, newBounds.width - deltaX);
        newBounds.x = initialBounds.x + initialBounds.width - newBounds.width;
        break;
    }

    // Apply snap to grid
    if (snapEnabled) {
      newBounds.x = snapToGrid(newBounds.x);
      newBounds.y = snapToGrid(newBounds.y);
      newBounds.width = snapToGrid(newBounds.width);
      newBounds.height = snapToGrid(newBounds.height);
    }

    // Calculate scaling factors
    const scaleX = newBounds.width / initialBounds.width;
    const scaleY = newBounds.height / initialBounds.height;

    // Update selected elements proportionally
    initialElements.forEach((element, index) => {
      if (index < selectedElements.length) {
        // Calculate relative position within the original bounding box
        const relativeX = (element.position.x - initialBounds.x) / initialBounds.width;
        const relativeY = (element.position.y - initialBounds.y) / initialBounds.height;
        const relativeWidth = element.size.width / initialBounds.width;
        const relativeHeight = element.size.height / initialBounds.height;

        // Apply scaling
        const newX = newBounds.x + relativeX * newBounds.width;
        const newY = newBounds.y + relativeY * newBounds.height;
        const newWidth = relativeWidth * newBounds.width;
        const newHeight = relativeHeight * newBounds.height;

        onUpdateElement(selectedElements[index].id, {
          position: { x: newX, y: newY },
          size: { width: Math.max(20, newWidth), height: Math.max(20, newHeight) }
        });
      }
    });

    setInitialBounds(newBounds);
  }, [isResizing, initialBounds, resizeHandle, zoom, snapEnabled, initialElements, selectedElements, onUpdateElement]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle('');
    setInitialBounds(null);
    setInitialElements([]);
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
  if (!boundingBox) return null;

  // Apply canvas transform
  const transformedX = boundingBox.x + canvasPosition.x;
  const transformedY = boundingBox.y + canvasPosition.y;
  const transformedWidth = boundingBox.width;
  const transformedHeight = boundingBox.height;

  const zoomFactor = zoom / 100;

  const { boundingBoxClasses, resizeHandleClasses } = useCanvasStyles({
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 }
  });

  return (
    <div
      className={boundingBoxClasses(transformedX, transformedY, transformedWidth, transformedHeight, zoomFactor)}
    >
      {/* Corner handles */}
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.topLeft}`}
        onMouseDown={(e) => handleResizeStart('nw', e)}
      />
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.topRight}`}
        onMouseDown={(e) => handleResizeStart('ne', e)}
      />
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.bottomLeft}`}
        onMouseDown={(e) => handleResizeStart('sw', e)}
      />
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.bottomRight}`}
        onMouseDown={(e) => handleResizeStart('se', e)}
      />

      {/* Edge handles */}
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.topCenter}`}
        onMouseDown={(e) => handleResizeStart('n', e)}
      />
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.bottomCenter}`}
        onMouseDown={(e) => handleResizeStart('s', e)}
      />
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.rightCenter}`}
        onMouseDown={(e) => handleResizeStart('e', e)}
      />
      <div 
        className={`${resizeHandleClasses.base} ${resizeHandleClasses.leftCenter}`}
        onMouseDown={(e) => handleResizeStart('w', e)}
      />
    </div>
  );
};
