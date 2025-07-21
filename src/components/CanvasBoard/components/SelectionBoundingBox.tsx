
import React, { useState, useCallback, useEffect } from 'react';
import { CanvasElement } from '../types';

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
  const [elementInitialStates, setElementInitialStates] = useState<Map<string, any>>(new Map());

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
    
    if (!boundingBox) return;
    
    setIsResizing(true);
    setResizeHandle(handle);
    setInitialBounds(boundingBox);
    
    // Store initial states of all elements
    const states = new Map();
    selectedElements.forEach(element => {
      states.set(element.id, {
        position: { ...element.position },
        size: { ...element.size }
      });
    });
    setElementInitialStates(states);
  }, [boundingBox, selectedElements]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !initialBounds || !boundingBox) return;

    const rect = document.querySelector('[data-canvas-container]')?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const mouseY = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    let newBounds = { ...initialBounds };
    
    // Calculate new bounds based on handle
    switch (resizeHandle) {
      case 'nw':
        newBounds.width = Math.max(20, initialBounds.width + (initialBounds.x - mouseX));
        newBounds.height = Math.max(20, initialBounds.height + (initialBounds.y - mouseY));
        newBounds.x = mouseX;
        newBounds.y = mouseY;
        break;
      case 'ne':
        newBounds.width = Math.max(20, mouseX - initialBounds.x);
        newBounds.height = Math.max(20, initialBounds.height + (initialBounds.y - mouseY));
        newBounds.y = mouseY;
        break;
      case 'sw':
        newBounds.width = Math.max(20, initialBounds.width + (initialBounds.x - mouseX));
        newBounds.height = Math.max(20, mouseY - initialBounds.y);
        newBounds.x = mouseX;
        break;
      case 'se':
        newBounds.width = Math.max(20, mouseX - initialBounds.x);
        newBounds.height = Math.max(20, mouseY - initialBounds.y);
        break;
      case 'n':
        newBounds.height = Math.max(20, initialBounds.height + (initialBounds.y - mouseY));
        newBounds.y = mouseY;
        break;
      case 's':
        newBounds.height = Math.max(20, mouseY - initialBounds.y);
        break;
      case 'w':
        newBounds.width = Math.max(20, initialBounds.width + (initialBounds.x - mouseX));
        newBounds.x = mouseX;
        break;
      case 'e':
        newBounds.width = Math.max(20, mouseX - initialBounds.x);
        break;
    }

    // Apply snap to grid
    newBounds.x = snapToGrid(newBounds.x);
    newBounds.y = snapToGrid(newBounds.y);
    newBounds.width = snapToGrid(newBounds.width);
    newBounds.height = snapToGrid(newBounds.height);

    // Calculate scale factors
    const scaleX = newBounds.width / initialBounds.width;
    const scaleY = newBounds.height / initialBounds.height;

    // Update each selected element
    selectedElements.forEach(element => {
      const initialState = elementInitialStates.get(element.id);
      if (!initialState) return;

      const relativeX = initialState.position.x - initialBounds.x;
      const relativeY = initialState.position.y - initialBounds.y;

      const newX = newBounds.x + (relativeX * scaleX);
      const newY = newBounds.y + (relativeY * scaleY);
      const newWidth = initialState.size.width * scaleX;
      const newHeight = initialState.size.height * scaleY;

      onUpdateElement(element.id, {
        position: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight }
      });
    });
  }, [isResizing, resizeHandle, initialBounds, zoom, canvasPosition, selectedElements, elementInitialStates, onUpdateElement, snapEnabled]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
    setInitialBounds(null);
    setElementInitialStates(new Map());
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

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

  return (
    <div
      data-canvas-container
      className="absolute pointer-events-none inset-0"
      style={{
        transform,
        transformOrigin: '0 0'
      }}
    >
      {/* Bounding box outline */}
      <div
        className="absolute border-2 border-blue-500 border-dashed bg-blue-500/10"
        style={{
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
          pointerEvents: 'none'
        }}
      />

      {/* Resize handles */}
      {resizeHandles.map(handle => (
        <div
          key={handle.position}
          className="absolute w-2 h-2 bg-blue-500 border border-white cursor-pointer hover:bg-blue-600 pointer-events-auto"
          style={{
            left: boundingBox.x + handle.x,
            top: boundingBox.y + handle.y,
            cursor: handle.cursor
          }}
          onMouseDown={(e) => handleResizeStart(handle.position, e)}
        />
      ))}
    </div>
  );
};
