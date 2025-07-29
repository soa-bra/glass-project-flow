
import { useState, useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';

const GRID_SIZE = 24;

interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  draggedElementId: string | null;
}

interface SelectionBoxState {
  isSelecting: boolean;
  startPoint: { x: number; y: number } | null;
  endPoint: { x: number; y: number } | null;
}

export const useSimplifiedCanvasInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    draggedElementId: null
  });

  const [selectionBox, setSelectionBox] = useState<SelectionBoxState>({
    isSelecting: false,
    startPoint: null,
    endPoint: null
  });

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  const getCanvasCoordinates = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number }
  ) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    return { x, y };
  }, [canvasRef]);

  // Element drag operations
  const startElementDrag = useCallback((
    e: React.MouseEvent,
    elementId: string,
    element: CanvasElement,
    zoom: number,
    canvasPosition: { x: number; y: number }
  ) => {
    const coords = getCanvasCoordinates(e, zoom, canvasPosition);
    
    setDragState({
      isDragging: true,
      dragOffset: {
        x: coords.x - element.position.x,
        y: coords.y - element.position.y
      },
      draggedElementId: elementId
    });
  }, [getCanvasCoordinates]);

  const updateElementDrag = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void,
    snapEnabled: boolean
  ) => {
    if (!dragState.isDragging || !dragState.draggedElementId) return;

    const coords = getCanvasCoordinates(e, zoom, canvasPosition);
    let newX = coords.x - dragState.dragOffset.x;
    let newY = coords.y - dragState.dragOffset.y;

    newX = snapToGrid(newX, snapEnabled);
    newY = snapToGrid(newY, snapEnabled);

    onUpdateElement(dragState.draggedElementId, {
      position: { x: newX, y: newY }
    });
  }, [dragState, getCanvasCoordinates, snapToGrid]);

  const endElementDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      draggedElementId: null
    });
  }, []);

  // Selection box operations
  const startSelectionBox = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean
  ) => {
    const coords = getCanvasCoordinates(e, zoom, canvasPosition);
    const snappedCoords = {
      x: snapToGrid(coords.x, snapEnabled),
      y: snapToGrid(coords.y, snapEnabled)
    };

    setSelectionBox({
      isSelecting: true,
      startPoint: snappedCoords,
      endPoint: snappedCoords
    });
  }, [getCanvasCoordinates, snapToGrid]);

  const updateSelectionBox = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean
  ) => {
    if (!selectionBox.isSelecting || !selectionBox.startPoint) return;

    const coords = getCanvasCoordinates(e, zoom, canvasPosition);
    const snappedCoords = {
      x: snapToGrid(coords.x, snapEnabled),
      y: snapToGrid(coords.y, snapEnabled)
    };

    setSelectionBox(prev => ({
      ...prev,
      endPoint: snappedCoords
    }));
  }, [selectionBox.isSelecting, selectionBox.startPoint, getCanvasCoordinates, snapToGrid]);

  const endSelectionBox = useCallback((
    elements: CanvasElement[],
    onSelectionChange: (elementIds: string[]) => void
  ) => {
    if (!selectionBox.isSelecting || !selectionBox.startPoint || !selectionBox.endPoint) {
      setSelectionBox({
        isSelecting: false,
        startPoint: null,
        endPoint: null
      });
      return;
    }

    const { startPoint, endPoint } = selectionBox;
    const minX = Math.min(startPoint.x, endPoint.x);
    const maxX = Math.max(startPoint.x, endPoint.x);
    const minY = Math.min(startPoint.y, endPoint.y);
    const maxY = Math.max(startPoint.y, endPoint.y);

    // Only select if box is large enough
    const boxArea = (maxX - minX) * (maxY - minY);
    if (boxArea < 100) {
      onSelectionChange([]);
    } else {
      const selectedElements = elements.filter(element => {
        const elemLeft = element.position.x;
        const elemRight = elemLeft + element.size.width;
        const elemTop = element.position.y;
        const elemBottom = elemTop + element.size.height;

        return !(elemRight < minX || elemLeft > maxX || elemBottom < minY || elemTop > maxY);
      });

      onSelectionChange(selectedElements.map(el => el.id));
    }

    setSelectionBox({
      isSelecting: false,
      startPoint: null,
      endPoint: null
    });
  }, [selectionBox]);

  return {
    // Drag state
    isDragging: dragState.isDragging,
    startElementDrag,
    updateElementDrag,
    endElementDrag,
    
    // Selection box state
    isSelecting: selectionBox.isSelecting,
    selectionBoxBounds: selectionBox.startPoint && selectionBox.endPoint ? {
      start: selectionBox.startPoint,
      end: selectionBox.endPoint
    } : null,
    startSelectionBox,
    updateSelectionBox,
    endSelectionBox
  };
};
