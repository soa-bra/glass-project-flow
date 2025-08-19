import { useUnifiedCanvasState } from './useUnifiedCanvasState';
import { useCanvasElementActions } from './useCanvasElementActions';
import { useCanvasHistory } from './useCanvasHistory';
import { useRefactoredCanvasInteraction } from './useRefactoredCanvasInteraction';
import { useRefactoredCanvasEventHandlers as useCanvasEventHandlers } from './useRefactoredCanvasEventHandlers';
import { useRef, useState, useCallback } from 'react';

/**
 * Master hook للوحة البيضاء - يوحد جميع المكونات بطريقة منظمة
 * هذا هو Hook الرئيسي الذي يجب استخدامه في المكونات
 */
export const useCanvasMaster = (projectId?: string, userId?: string) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // حالة الإعدادات الأساسية
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20);

  // نظام التاريخ
  const { history, historyIndex, saveToHistory, undo, redo } = useCanvasHistory();

  // الحالة الموحدة للعناصر والأدوات
  const canvasState = useUnifiedCanvasState({ saveToHistory });

  // إجراءات العناصر المتقدمة
  const elementActions = useCanvasElementActions({
    selectedElementIds: canvasState.selectedElementIds,
    elements: canvasState.elements,
    updateElement: canvasState.updateElement,
    deleteElement: canvasState.deleteElement,
    addElement: canvasState.addElement
  });

  // التفاعل مع الكانفس
  const interaction = useRefactoredCanvasInteraction(canvasRef);

  // Create wrapper for addElement
  const addElementWrapper = useCallback((element: any) => {
    canvasState.addElement(element.type, element.x, element.y, element.width, element.height, element.content);
  }, [canvasState.addElement]);

  // معالجات الأحداث
  const eventHandlers = useCanvasEventHandlers(
    canvasState.activeTool,
    zoom,
    canvasPosition,
    snapEnabled,
    interaction,
    addElementWrapper,
    canvasState.elements,
    canvasState.selectedElementIds,
    canvasState.clearSelection,
    canvasState.selectElements,
    canvasState.selectElement,
    canvasState.updateElement,
    setCanvasPosition,
    setZoom
  );

  // وظائف إضافية للشبكة والتكبير
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 400));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const handleToggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  // دالة مساعدة لحفظ الحالة
  const exportCanvasData = useCallback(() => {
    return {
      elements: canvasState.elements,
      settings: {
        zoom,
        canvasPosition,
        showGrid,
        snapEnabled,
        gridSize
      },
      metadata: {
        projectId,
        userId,
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    };
  }, [canvasState.elements, zoom, canvasPosition, showGrid, snapEnabled, gridSize, projectId, userId]);

  // دالة لاستيراد البيانات
  const importCanvasData = useCallback((data: any) => {
    if (data.elements && Array.isArray(data.elements)) {
      canvasState.setElements(data.elements);
      if (data.settings) {
        setZoom(data.settings.zoom || 100);
        setCanvasPosition(data.settings.canvasPosition || { x: 0, y: 0 });
        setShowGrid(data.settings.showGrid || false);
        setSnapEnabled(data.settings.snapEnabled || true);
        setGridSize(data.settings.gridSize || 20);
      }
    }
  }, [canvasState]);

  return {
    // المرجع الأساسي
    canvasRef,

    // حالة الكانفس الأساسية
    ...canvasState,

    // إعدادات العرض
    zoom,
    setZoom,
    canvasPosition,
    setCanvasPosition,
    showGrid,
    setShowGrid,
    snapEnabled,
    setSnapEnabled,
    gridSize,
    setGridSize,

    // إجراءات العناصر
    ...elementActions,

    // التاريخ
    history,
    historyIndex,
    undo,
    redo,

    // التفاعل
    interaction,
    ...eventHandlers,

    // وظائف التكبير والشبكة
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleToggleGrid,
    handleToggleSnap,

    // الاستيراد والتصدير
    exportCanvasData,
    importCanvasData
  };
};