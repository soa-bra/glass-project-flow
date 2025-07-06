import { useState, useRef, useCallback } from 'react';
import { CanvasElement, CanvasState } from '../types';
import { toast } from 'sonner';

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
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [selectedSmartElement, setSelectedSmartElement] = useState<string>('brainstorm');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addElement = useCallback((x: number, y: number, width?: number, height?: number) => {
    if (selectedTool === 'select' || selectedTool === 'hand' || selectedTool === 'zoom') return;

    const elementType = selectedTool === 'smart-element' ? selectedSmartElement : selectedTool;
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: elementType as any,
      position: { x, y },
      size: { width: width || 120, height: height || 80 },
      content: selectedTool === 'text' ? 'نص جديد' : selectedTool === 'sticky' ? 'ملاحظة' : undefined
    };

    setElements(prev => {
      const newElements = [...prev, newElement];
      saveToHistory(newElements);
      return newElements;
    });
  }, [selectedTool, selectedSmartElement, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      toast.success('تم التراجع');
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      toast.success('تم الإعادة');
    }
  }, [historyIndex, history]);

  const saveCanvas = useCallback(() => {
    const canvasData = {
      projectId,
      userId,
      elements,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`canvas_${projectId}`, JSON.stringify(canvasData));
    toast.success('تم حفظ اللوحة');
  }, [projectId, userId, elements]);

  const exportCanvas = useCallback(() => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `canvas_${projectId}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('تم تصدير اللوحة');
  }, [elements, projectId]);

  const convertToProject = useCallback(() => {
    if (elements.length === 0) {
      toast.error('لا توجد عناصر للتحويل');
      return;
    }
    
    const projectData = {
      name: `مشروع من اللوحة ${new Date().toLocaleDateString('ar')}`,
      elements: elements.filter(el => el.type !== 'shape'),
      createdAt: new Date().toISOString()
    };
    
    console.log('تحويل العناصر إلى مشروع:', projectData);
    toast.success('تم تحويل العناصر إلى مشروع');
  }, [elements]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => {
      const newElements = prev.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      );
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => {
      const newElements = prev.filter(el => el.id !== elementId);
      saveToHistory(newElements);
      return newElements;
    });
    setSelectedElementId(null);
    toast.success('تم حذف العنصر');
  }, [saveToHistory]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    if (selectedTool === 'select' || selectedTool === 'hand' || selectedTool === 'zoom') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, [selectedTool, zoom, canvasPosition]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    setDrawEnd({ x, y });
  }, [isDrawing, drawStart, zoom, canvasPosition]);

  const handleCanvasMouseUp = useCallback(() => {
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
  }, [isDrawing, drawStart, drawEnd, addElement]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select' || selectedTool === 'hand' || selectedTool === 'zoom') return;
    // للأدوات التي تحتاج نقرة واحدة فقط
    if (selectedTool !== 'smart-element') {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
      const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
      
      addElement(x, y);
    }
  }, [selectedTool, addElement, zoom, canvasPosition]);

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
    history,
    historyIndex,
    isDrawing,
    drawStart,
    drawEnd,
    selectedSmartElement,
    
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
    setSelectedSmartElement,
    
    // Actions
    addElement,
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    undo,
    redo,
    saveCanvas,
    exportCanvas,
    convertToProject,
    updateElement,
    deleteElement
  };
};