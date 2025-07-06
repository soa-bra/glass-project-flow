import { useState, useCallback, useRef } from 'react';

interface UseLayerInteractionProps {
  selectedTool: string;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  setLayers: (updateFn: (layers: any[]) => any[]) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  lockElement?: (elementId: string) => void;
  isElementLockedByOther?: (elementId: string) => boolean;
}

export function useLayerInteraction({
  selectedTool,
  selectedElementId,
  onSelectElement,
  setLayers,
  canvasRef,
  lockElement = () => {},
  isElementLockedByOther = () => false
}: UseLayerInteractionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleElementSelect = useCallback((elementId: string) => {
    if (isElementLockedByOther(elementId)) return;
    
    onSelectElement(elementId);
    lockElement(elementId);
  }, [onSelectElement, lockElement, isElementLockedByOther]);

  const handleElementDrag = useCallback((elementIndex: number, newPos: { x: number; y: number }) => {
    setLayers(prevLayers => 
      prevLayers.map((layer, index) => 
        index === elementIndex 
          ? { ...layer, x: newPos.x, y: newPos.y }
          : layer
      )
    );
  }, [setLayers]);

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    if (selectedTool !== 'select' || isElementLockedByOther(elementId)) return;

    e.stopPropagation();
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setDragStart({ x: mouseX, y: mouseY });
    handleElementSelect(elementId);
  }, [selectedTool, handleElementSelect, canvasRef, isElementLockedByOther]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !selectedElementId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const deltaX = mouseX - dragStart.x;
    const deltaY = mouseY - dragStart.y;

    // تحديث موقع العنصر
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === selectedElementId 
          ? { 
              ...layer, 
              x: layer.x + deltaX - dragOffset.current.x,
              y: layer.y + deltaY - dragOffset.current.y
            }
          : layer
      )
    );

    dragOffset.current = { x: deltaX, y: deltaY };
  }, [isDragging, dragStart, selectedElementId, setLayers, canvasRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    dragOffset.current = { x: 0, y: 0 };
  }, []);

  const registerCanvasMovement = useCallback((canvas: HTMLDivElement) => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mockEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          stopPropagation: () => {},
          preventDefault: () => {}
        } as React.MouseEvent;
        
        handleMouseMove(mockEvent as React.MouseEvent);
      }
    };

    const handleMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // التحكم بلوحة المفاتيح
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedElementId) return;

    const step = e.shiftKey ? 10 : 1;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setLayers(prevLayers => 
          prevLayers.map(layer => 
            layer.id === selectedElementId 
              ? { ...layer, y: layer.y - step }
              : layer
          )
        );
        break;
      case 'ArrowDown':
        e.preventDefault();
        setLayers(prevLayers => 
          prevLayers.map(layer => 
            layer.id === selectedElementId 
              ? { ...layer, y: layer.y + step }
              : layer
          )
        );
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setLayers(prevLayers => 
          prevLayers.map(layer => 
            layer.id === selectedElementId 
              ? { ...layer, x: layer.x - step }
              : layer
          )
        );
        break;
      case 'ArrowRight':
        e.preventDefault();
        setLayers(prevLayers => 
          prevLayers.map(layer => 
            layer.id === selectedElementId 
              ? { ...layer, x: layer.x + step }
              : layer
          )
        );
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        setLayers(prevLayers => 
          prevLayers.filter(layer => layer.id !== selectedElementId)
        );
        onSelectElement(null);
        break;
    }
  }, [selectedElementId, setLayers, onSelectElement]);

  return {
    isDragging,
    handleElementSelect,
    handleElementDrag,
    handleElementMouseDown: handleMouseDown,
    handleElementMouseMove: handleMouseMove,
    handleElementMouseUp: handleMouseUp,
    registerCanvasMovement,
    handleKeyDown
  };
}