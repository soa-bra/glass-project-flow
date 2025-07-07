import { useState, useRef, useCallback } from 'react';
import { CanvasElement } from '../types';

const GRID_SIZE = 24;

export const useEnhancedCanvasInteraction = () => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  // Selection box handling
  const handleSelectionStart = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setIsSelecting(true);
    setSelectionBox({ start: { x, y }, end: { x, y } });
  }, []);

  const handleSelectionMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isSelecting || !selectionBox || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setSelectionBox(prev => prev ? { ...prev, end: { x, y } } : null);
  }, [isSelecting, selectionBox]);

  const handleSelectionEnd = useCallback((
    elements: CanvasElement[],
    onMultiSelect: (elementIds: string[]) => void
  ) => {
    if (!isSelecting || !selectionBox) return;
    
    const { start, end } = selectionBox;
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);
    
    // Find elements within selection box
    const selectedElements = elements.filter(element => {
      const elemX = element.position.x;
      const elemY = element.position.y;
      const elemMaxX = elemX + element.size.width;
      const elemMaxY = elemY + element.size.height;
      
      return elemX >= minX && elemMaxX <= maxX && elemY >= minY && elemMaxY <= maxY;
    });
    
    onMultiSelect(selectedElements.map(el => el.id));
    
    setIsSelecting(false);
    setSelectionBox(null);
  }, [isSelecting, selectionBox]);

  // Enhanced drawing for smart pen
  const handleSmartPenStart = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, []);

  const handleSmartPenMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setDrawEnd({ x, y });
  }, [isDrawing, drawStart]);

  const handleSmartPenEnd = useCallback((
    addElement: (type: string, startX: number, startY: number, endX: number, endY: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    addElement('line', drawStart.x, drawStart.y, drawEnd.x, drawEnd.y);
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  // Shape and smart element drag creation
  const handleDragCreate = useCallback((
    e: React.MouseEvent,
    selectedTool: string,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return;
    if (!['shape', 'smart-element', 'text-box'].includes(selectedTool)) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, []);

  const handleDragCreateMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setDrawEnd({ x, y });
  }, [isDrawing, drawStart]);

  const handleDragCreateEnd = useCallback((
    selectedTool: string,
    addElement: (type: string, x: number, y: number, width: number, height: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);
    
    if (width > 20 && height > 20) {
      addElement(selectedTool, x, y, width, height);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  // Single click for text
  const handleTextClick = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    addElement: (type: string, x: number, y: number) => void,
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    addElement('text', x, y);
  }, []);

  // Element manipulation (existing functionality)
  const handleElementMouseDown = useCallback((
    e: React.MouseEvent,
    elementId: string,
    selectedTool: string,
    elements: CanvasElement[],
    zoom: number,
    canvasPosition: { x: number; y: number },
    setSelectedElementId: (id: string) => void,
    selectedElementIds: string[],
    setSelectedElementIds: (ids: string[]) => void
  ) => {
    if (selectedTool !== 'select') return;
    
    e.stopPropagation();
    
    // Handle multi-selection with Ctrl
    if (e.ctrlKey || e.metaKey) {
      if (selectedElementIds.includes(elementId)) {
        setSelectedElementIds(selectedElementIds.filter(id => id !== elementId));
      } else {
        setSelectedElementIds([...selectedElementIds, elementId]);
      }
    } else {
      setSelectedElementId(elementId);
      setSelectedElementIds([elementId]);
    }
    
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const mouseY = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    setIsDragging(true);
    setDragOffset({
      x: mouseX - element.position.x,
      y: mouseY - element.position.y
    });
  }, []);

  const handleElementMouseMove = useCallback((
    e: React.MouseEvent,
    selectedElementIds: string[],
    zoom: number,
    canvasPosition: { x: number; y: number },
    updateElement: (elementId: string, updates: Partial<CanvasElement>) => void,
    snapEnabled: boolean = false
  ) => {
    if (!isDragging || selectedElementIds.length === 0 || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let mouseY = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    let newX = mouseX - dragOffset.x;
    let newY = mouseY - dragOffset.y;
    
    newX = snapToGrid(newX, snapEnabled);
    newY = snapToGrid(newY, snapEnabled);
    
    // Move all selected elements
    selectedElementIds.forEach(elementId => {
      updateElement(elementId, {
        position: { x: newX, y: newY }
      });
    });
  }, [isDragging, dragOffset]);

  const handleElementMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  return {
    canvasRef,
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    isSelecting,
    selectionBox,
    
    // Selection methods
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    
    // Smart pen methods
    handleSmartPenStart,
    handleSmartPenMove,
    handleSmartPenEnd,
    
    // Drag create methods
    handleDragCreate,
    handleDragCreateMove,
    handleDragCreateEnd,
    
    // Text click method
    handleTextClick,
    
    // Element manipulation methods
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp
  };
};