import { useState, useRef, useCallback } from 'react';
import { CanvasElement } from '../types';

const GRID_SIZE = 24; // حجم الشبكة للسنابينج

export const useCanvasInteraction = () => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  const handleCanvasMouseDown = useCallback((
    e: React.MouseEvent,
    selectedTool: string,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return;
    if (selectedTool === 'select' || selectedTool === 'hand' || selectedTool === 'zoom') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    // تطبيق السنابينج
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, []);

  const handleCanvasMouseMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    // تطبيق السنابينج
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setDrawEnd({ x, y });
  }, [isDrawing, drawStart]);

  const handleCanvasMouseUp = useCallback((
    addElement: (x: number, y: number, width?: number, height?: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);
    
    // فقط إنشاء عنصر إذا كان الحجم كافي
    if (width > 20 && height > 20) {
      addElement(x, y, width, height);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  const handleCanvasClick = useCallback((
    e: React.MouseEvent,
    selectedTool: string,
    zoom: number,
    canvasPosition: { x: number; y: number },
    addElement: (x: number, y: number) => void,
    snapEnabled: boolean = false
  ) => {
    if (selectedTool === 'select' || selectedTool === 'hand' || selectedTool === 'zoom') return;
    // للأدوات التي تحتاج نقرة واحدة فقط
    if (selectedTool !== 'smart-element') {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
      let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
      
      // تطبيق السنابينج
      x = snapToGrid(x, snapEnabled);
      y = snapToGrid(y, snapEnabled);
      
      addElement(x, y);
    }
  }, []);

  const handleElementMouseDown = useCallback((
    e: React.MouseEvent,
    elementId: string,
    selectedTool: string,
    elements: CanvasElement[],
    zoom: number,
    canvasPosition: { x: number; y: number },
    setSelectedElementId: (id: string) => void
  ) => {
    if (selectedTool !== 'select') return;
    
    e.stopPropagation();
    setSelectedElementId(elementId);
    
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
    selectedElementId: string | null,
    zoom: number,
    canvasPosition: { x: number; y: number },
    updateElement: (elementId: string, updates: Partial<CanvasElement>) => void,
    snapEnabled: boolean = false
  ) => {
    if (!isDragging || !selectedElementId || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let mouseY = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    let newX = mouseX - dragOffset.x;
    let newY = mouseY - dragOffset.y;
    
    // تطبيق السنابينج
    newX = snapToGrid(newX, snapEnabled);
    newY = snapToGrid(newY, snapEnabled);
    
    updateElement(selectedElementId, {
      position: {
        x: newX,
        y: newY
      }
    });
  }, [isDragging, dragOffset]);

  const handleElementMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle('');
    }
  }, [isDragging, isResizing]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string, selectedTool: string) => {
    if (selectedTool !== 'select') return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
  }, []);

  const handleResizeMouseMove = useCallback((
    e: React.MouseEvent,
    selectedElementId: string | null,
    elements: CanvasElement[],
    zoom: number,
    canvasPosition: { x: number; y: number },
    updateElement: (elementId: string, updates: Partial<CanvasElement>) => void
  ) => {
    if (!isResizing || !selectedElementId || !canvasRef.current) return;
    
    const element = elements.find(el => el.id === selectedElementId);
    if (!element) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const mouseY = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    let newPosition = { ...element.position };
    let newSize = { ...element.size };
    
    switch (resizeHandle) {
      case 'nw': // top-left
        newSize.width = element.position.x + element.size.width - mouseX;
        newSize.height = element.position.y + element.size.height - mouseY;
        newPosition.x = mouseX;
        newPosition.y = mouseY;
        break;
      case 'ne': // top-right
        newSize.width = mouseX - element.position.x;
        newSize.height = element.position.y + element.size.height - mouseY;
        newPosition.y = mouseY;
        break;
      case 'sw': // bottom-left
        newSize.width = element.position.x + element.size.width - mouseX;
        newSize.height = mouseY - element.position.y;
        newPosition.x = mouseX;
        break;
      case 'se': // bottom-right
        newSize.width = mouseX - element.position.x;
        newSize.height = mouseY - element.position.y;
        break;
      case 'n': // top
        newSize.height = element.position.y + element.size.height - mouseY;
        newPosition.y = mouseY;
        break;
      case 's': // bottom
        newSize.height = mouseY - element.position.y;
        break;
      case 'w': // left
        newSize.width = element.position.x + element.size.width - mouseX;
        newPosition.x = mouseX;
        break;
      case 'e': // right
        newSize.width = mouseX - element.position.x;
        break;
    }
    
    // التأكد من أن الحجم لا يصبح سالبًا
    if (newSize.width > 20 && newSize.height > 20) {
      updateElement(selectedElementId, {
        position: newPosition,
        size: newSize
      });
    }
  }, [isResizing, resizeHandle]);

  return {
    canvasRef,
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasClick,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove
  };
};