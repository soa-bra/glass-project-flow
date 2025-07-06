import { useState, useRef, useCallback } from 'react';
import { CanvasElement, CanvasState } from '../types';

export const useCanvasState = (projectId = 'default', userId = 'user1') => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [showDefaultView, setShowDefaultView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElement = useCallback((x: number, y: number) => {
    if (selectedTool === 'select' || selectedTool === 'hand' || selectedTool === 'zoom') return;

    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: selectedTool as any,
      position: { x, y },
      size: { width: 120, height: 80 },
      content: selectedTool === 'text' ? 'نص جديد' : selectedTool === 'sticky' ? 'ملاحظة' : undefined
    };

    setElements(prev => [...prev, newElement]);
  }, [selectedTool]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    addElement(x, y);
  }, [addElement, zoom, canvasPosition]);

  return {
    // State
    selectedTool,
    selectedElementId,
    showGrid,
    snapEnabled,
    elements,
    showDefaultView,
    searchQuery,
    zoom,
    canvasPosition,
    canvasRef,
    
    // Setters
    setSelectedTool,
    setSelectedElementId,
    setShowGrid,
    setSnapEnabled,
    setElements,
    setShowDefaultView,
    setSearchQuery,
    setZoom,
    setCanvasPosition,
    
    // Actions
    addElement,
    handleCanvasClick
  };
};