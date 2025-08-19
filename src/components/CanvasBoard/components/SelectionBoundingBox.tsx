import React, { useState, useCallback } from 'react';
import { CanvasElement } from '../types';
import { DYNAMIC_CLASSES } from '@/components/shared/design-system/constants';

interface SelectionBoundingBoxProps {
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  onUpdateElement: (elementId: string, updates: any) => void;
  snapEnabled?: boolean;
}

export const SelectionBoundingBox: React.FC<SelectionBoundingBoxProps> = ({
  selectedElements,
  zoom,
  canvasPosition,
  onUpdateElement,
  snapEnabled = false
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialBounds, setInitialBounds] = useState<any>(null);

  // Calculate bounding box for all selected elements
  const calculateBoundingBox = useCallback(() => {
    if (selectedElements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedElements.forEach(element => {
      minX = Math.min(minX, element.position.x);
      minY = Math.min(minY, element.position.y);
      maxX = Math.max(maxX, element.position.x + element.size.width);
      maxY = Math.max(maxY, element.position.y + element.size.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }, [selectedElements]);

  const boundingBox = calculateBoundingBox();

  const snapToGrid = (value: number) => {
    return snapEnabled ? Math.round(value / 24) * 24 : value;
  };

  const handleResizeStart = useCallback((handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setInitialBounds(boundingBox);
  }, [boundingBox]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !initialBounds) return;

    const deltaX = e.movementX / (zoom / 100);
    const deltaY = e.movementY / (zoom / 100);

    // Calculate new bounds based on resize handle
    let newBounds = { ...initialBounds };

    switch (resizeHandle) {
      case 'nw': // Top-left
        newBounds.width = Math.max(20, newBounds.width - deltaX);
        newBounds.height = Math.max(20, newBounds.height - deltaY);
        newBounds.x = snapToGrid(newBounds.x + deltaX);
        newBounds.y = snapToGrid(newBounds.y + deltaY);
        break;
      case 'ne': // Top-right
        newBounds.width = Math.max(20, newBounds.width + deltaX);
        newBounds.height = Math.max(20, newBounds.height - deltaY);
        newBounds.y = snapToGrid(newBounds.y + deltaY);
        break;
      case 'sw': // Bottom-left
        newBounds.width = Math.max(20, newBounds.width - deltaX);
        newBounds.height = Math.max(20, newBounds.height + deltaY);
        newBounds.x = snapToGrid(newBounds.x + deltaX);
        break;
      case 'se': // Bottom-right
        newBounds.width = Math.max(20, newBounds.width + deltaX);
        newBounds.height = Math.max(20, newBounds.height + deltaY);
        break;
      case 'n': // Top
        newBounds.height = Math.max(20, newBounds.height - deltaY);
        newBounds.y = snapToGrid(newBounds.y + deltaY);
        break;
      case 's': // Bottom
        newBounds.height = Math.max(20, newBounds.height + deltaY);
        break;
      case 'w': // Left
        newBounds.width = Math.max(20, newBounds.width - deltaX);
        newBounds.x = snapToGrid(newBounds.x + deltaX);
        break;
      case 'e': // Right
        newBounds.width = Math.max(20, newBounds.width + deltaX);
        break;
    }

    // Calculate scale factors
    const scaleX = newBounds.width / initialBounds.width;
    const scaleY = newBounds.height / initialBounds.height;

    // Update each selected element
    selectedElements.forEach(element => {
      const relativeX = element.position.x - initialBounds.x;
      const relativeY = element.position.y - initialBounds.y;

      const newX = newBounds.x + (relativeX * scaleX);
      const newY = newBounds.y + (relativeY * scaleY);
      const newWidth = element.size.width * scaleX;
      const newHeight = element.size.height * scaleY;

      onUpdateElement(element.id, {
        position: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight }
      });
    });

    setInitialBounds(newBounds);
  }, [isResizing, resizeHandle, initialBounds, zoom, selectedElements, onUpdateElement, snapEnabled]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
    setInitialBounds(null);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  if (!boundingBox || selectedElements.length === 0) return null;

  const transform = `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoom / 100})`;

  const resizeHandles = [
    { position: 'nw', cursor: 'nw-resize', x: -4, y: -4 },
    { position: 'n', cursor: 'n-resize', x: boundingBox.width / 2 - 4, y: -4 },
    { position: 'ne', cursor: 'ne-resize', x: boundingBox.width - 4, y: -4 },
    { position: 'e', cursor: 'e-resize', x: boundingBox.width - 4, y: boundingBox.height / 2 - 4 },
    { position: 'se', cursor: 'se-resize', x: boundingBox.width - 4, y: boundingBox.height - 4 },
    { position: 's', cursor: 's-resize', x: boundingBox.width / 2 - 4, y: boundingBox.height - 4 },
    { position: 'sw', cursor: 'sw-resize', x: -4, y: boundingBox.height - 4 },
    { position: 'w', cursor: 'w-resize', x: -4, y: boundingBox.height / 2 - 4 },
  ];

  const transformContainerClasses = `absolute pointer-events-none transform origin-[0_0]`;
  const boundingBoxClasses = `absolute border-2 border-blue-500 border-dashed bg-blue-500/10 pointer-events-none ${DYNAMIC_CLASSES.createPositionClasses(boundingBox.x, boundingBox.y)} ${DYNAMIC_CLASSES.createSizeClasses(boundingBox.width, boundingBox.height)}`;

  return (
    <div
      className={transformContainerClasses}
      style={{ transform, transformOrigin: '0 0' }}
    >
      {/* Bounding box outline */}
      <div className={boundingBoxClasses} />

      {/* Resize handles */}
      {resizeHandles.map(handle => {
        const handleClasses = `absolute w-2 h-2 bg-blue-500 border border-white hover:bg-blue-600 pointer-events-auto ${DYNAMIC_CLASSES.createPositionClasses(boundingBox.x + handle.x, boundingBox.y + handle.y)}`;
        return (
          <div
            key={handle.position}
            className={handleClasses}
            style={{ cursor: handle.cursor }}
            onMouseDown={(e) => handleResizeStart(handle.position, e)}
          />
        );
      })}
    </div>
  );
};