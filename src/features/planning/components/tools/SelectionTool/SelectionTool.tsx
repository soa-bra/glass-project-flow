import React, { useRef, useState, useCallback } from 'react';
import { useCanvasStore } from '../../../store/canvas.store';
import { useToolsStore } from '../../../store/tools.store';

interface SelectionToolProps {
  onSelectionChange?: (selectedIds: string[]) => void;
}

export const SelectionTool: React.FC<SelectionToolProps> = ({ onSelectionChange }) => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  } | null>(null);

  const {
    elements,
    selectedElementIds,
    selectElement,
    selectMultiple,
    clearSelection,
    updateElement,
    zoom,
    pan
  } = useCanvasStore();

  const { activeTool } = useToolsStore();

  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: screenX, y: screenY };
    
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (screenX - rect.left - pan.x) / zoom,
      y: (screenY - rect.top - pan.y) / zoom
    };
  }, [zoom, pan]);

  const isPointInElement = useCallback((point: { x: number; y: number }, element: any) => {
    return (
      point.x >= element.position.x &&
      point.x <= element.position.x + element.size.width &&
      point.y >= element.position.y &&
      point.y <= element.position.y + element.size.height
    );
  }, []);

  const getElementsInSelectionBox = useCallback(() => {
    if (!selectionBox) return [];
    
    const { start, end } = selectionBox;
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    return elements.filter(element => {
      const elementCenter = {
        x: element.position.x + element.size.width / 2,
        y: element.position.y + element.size.height / 2
      };
      
      return (
        elementCenter.x >= minX &&
        elementCenter.x <= maxX &&
        elementCenter.y >= minY &&
        elementCenter.y <= maxY
      );
    }).map(el => el.id);
  }, [elements, selectionBox]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool !== 'selection') return;
    
    const canvasPoint = screenToCanvas(e.clientX, e.clientY);
    
    // Check if clicking on an element
    const clickedElement = elements.find(element => 
      isPointInElement(canvasPoint, element)
    );

    if (clickedElement) {
      // Select element
      const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
      selectElement(clickedElement.id, isMultiSelect);
    } else {
      // Start selection box
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        clearSelection();
      }
      
      setSelectionBox({
        start: canvasPoint,
        end: canvasPoint
      });
      setIsDragging(true);
    }
  }, [activeTool, elements, isPointInElement, screenToCanvas, selectElement, clearSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectionBox) return;
    
    const canvasPoint = screenToCanvas(e.clientX, e.clientY);
    setSelectionBox(prev => prev ? {
      ...prev,
      end: canvasPoint
    } : null);
  }, [isDragging, selectionBox, screenToCanvas]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && selectionBox) {
      const selectedIds = getElementsInSelectionBox();
      if (selectedIds.length > 0) {
        selectMultiple(selectedIds);
      }
    }
    
    setIsDragging(false);
    setSelectionBox(null);
  }, [isDragging, selectionBox, getElementsInSelectionBox, selectMultiple]);

  const renderSelectionBox = () => {
    if (!selectionBox) return null;
    
    const { start, end } = selectionBox;
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    return (
      <rect
        x={minX}
        y={minY}
        width={maxX - minX}
        height={maxY - minY}
        fill="rgba(59, 130, 246, 0.1)"
        stroke="rgb(59, 130, 246)"
        strokeWidth={1 / zoom}
        strokeDasharray={`${4 / zoom} ${2 / zoom}`}
      />
    );
  };

  if (activeTool !== 'selection') return null;

  return (
    <svg
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: 'default' }}
    >
      {renderSelectionBox()}
    </svg>
  );
};