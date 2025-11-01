import { useCallback, useRef, useState } from 'react';
import { useCanvasStore, type ToolId, type ShapeType } from '@/stores/canvasStore';
import { screenToCanvasCoordinates, snapToGrid as applySnapToGrid } from '@/utils/canvasCoordinates';
import { recognizeShape, pointsToSVGPath, simplifyPath, type Point } from '@/utils/shapeRecognition';
import { toast } from 'sonner';

export const useToolInteraction = (containerRef: React.RefObject<HTMLDivElement>) => {
  const {
    activeTool,
    toolSettings,
    viewport,
    settings,
    isDrawing,
    drawStartPoint,
    tempElement,
    elements,
    setIsDrawing,
    setDrawStartPoint,
    setTempElement,
    addElement,
    updateElement,
    clearSelection
  } = useCanvasStore();

  const isDraggingRef = useRef(false);

  /**
   * معالج بدء النقر على الكانفاس
   */
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // تجاهل النقرات على العناصر الموجودة
    if ((e.target as HTMLElement).closest('[data-canvas-element]')) {
      return;
    }

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const canvasPoint = screenToCanvasCoordinates(
      e.clientX,
      e.clientY,
      viewport,
      containerRect
    );

    const snappedPoint = applySnapToGrid(
      canvasPoint.x,
      canvasPoint.y,
      settings.gridSize,
      settings.snapToGrid
    );

    switch (activeTool) {
      case 'text_tool':
        handleTextToolClick(snappedPoint);
        break;

      case 'shapes_tool':
        handleShapesToolStart(snappedPoint);
        break;

      case 'smart_pen':
        // يتم التعامل معه عبر PenInputLayer
        break;

      case 'frame_tool':
        // ✨ يتم التعامل معه الآن عبر FrameInputLayer
        break;
      
      case 'file_uploader':
        // يتم التعامل معه عبر FileUploadPanel
        toast.info('استخدم لوحة رفع الملفات أو اسحب ملفاً على الكانفاس');
        break;

      case 'smart_element_tool':
        handleSmartElementClick(snappedPoint);
        break;

      case 'selection_tool':
        // يتم التعامل معها في InfiniteCanvas
        break;

      default:
        break;
    }
  }, [activeTool, viewport, settings, containerRef]);

  /**
   * معالج حركة الماوس أثناء الرسم
   */
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !drawStartPoint) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const canvasPoint = screenToCanvasCoordinates(
      e.clientX,
      e.clientY,
      viewport,
      containerRect
    );

    const snappedPoint = applySnapToGrid(
      canvasPoint.x,
      canvasPoint.y,
      settings.gridSize,
      settings.snapToGrid
    );

    switch (activeTool) {
      case 'shapes_tool':
        handleShapesToolMove(snappedPoint);
        break;

      case 'smart_pen':
        // يتم التعامل معه عبر PenInputLayer
        break;

      case 'frame_tool':
        // ✨ يتم التعامل معه الآن عبر FrameInputLayer
        break;

      default:
        break;
    }
  }, [isDrawing, drawStartPoint, activeTool, viewport, settings, containerRef]);

  /**
   * معالج رفع زر الماوس (إنهاء الرسم)
   */
  const handleCanvasMouseUp = useCallback(() => {
    if (isDrawing && tempElement) {
      // تحويل العنصر المؤقت إلى عنصر دائم
      const finalElement = { ...tempElement };
      delete (finalElement as any).id;
      
      addElement(finalElement);
      toast.success('تم إضافة العنصر');
    }

    setIsDrawing(false);
    setDrawStartPoint(null);
    setTempElement(null);
  }, [isDrawing, tempElement, addElement, setIsDrawing, setDrawStartPoint, setTempElement]);

  /**
   * أداة النص: إنشاء صندوق نص عند النقر
   */
  const handleTextToolClick = (point: { x: number; y: number }) => {
    const textElement = {
      type: 'text' as const,
      position: point,
      size: { width: 200, height: 50 },
      content: 'اكتب هنا...',
      style: {
        fontSize: toolSettings.text.fontSize,
        color: toolSettings.text.color,
        fontFamily: toolSettings.text.fontFamily,
        fontWeight: toolSettings.text.fontWeight
      }
    };

    addElement(textElement);
    toast.success('تم إضافة نص جديد');
  };

  /**
   * أداة الأشكال: بدء رسم شكل
   */
  const handleShapesToolStart = (point: { x: number; y: number }) => {
    setIsDrawing(true);
    setDrawStartPoint(point);

    const initialElement = {
      id: 'temp',
      type: 'shape' as const,
      position: point,
      size: { width: 0, height: 0 },
      shapeType: toolSettings.shapes.shapeType,
      style: {
        backgroundColor: toolSettings.shapes.fillColor,
        borderRadius: toolSettings.shapes.shapeType === 'circle' ? 9999 : 8,
        opacity: toolSettings.shapes.opacity
      },
      strokeColor: toolSettings.shapes.strokeColor,
      strokeWidth: toolSettings.shapes.strokeWidth
    };

    setTempElement(initialElement as any);
  };

  /**
   * أداة الأشكال: تحديث حجم الشكل أثناء السحب
   */
  const handleShapesToolMove = (currentPoint: { x: number; y: number }) => {
    if (!drawStartPoint || !tempElement) return;

    const width = Math.abs(currentPoint.x - drawStartPoint.x);
    const height = Math.abs(currentPoint.y - drawStartPoint.y);
    const x = Math.min(currentPoint.x, drawStartPoint.x);
    const y = Math.min(currentPoint.y, drawStartPoint.y);

    setTempElement({
      ...tempElement,
      position: { x, y },
      size: { width, height }
    });
  };

  /**
   * أداة العناصر الذكية: إنشاء عنصر ذكي
   */
  const handleSmartElementClick = (point: { x: number; y: number }) => {
    const { selectedSmartElement } = useCanvasStore.getState();
    
    if (!selectedSmartElement) {
      toast.info('اختر عنصراً ذكياً من اللوحة الجانبية أولاً');
      return;
    }

    // أحجام افتراضية للعناصر الذكية
    const defaultSizes: Record<string, { width: number; height: number }> = {
      'thinking_board': { width: 400, height: 300 },
      'kanban': { width: 600, height: 400 },
      'voting': { width: 350, height: 250 },
      'brainstorming': { width: 400, height: 300 },
      'timeline': { width: 700, height: 200 },
      'decisions_matrix': { width: 500, height: 400 },
      'gantt': { width: 800, height: 400 },
      'interactive_sheet': { width: 600, height: 400 },
      'mind_map': { width: 500, height: 400 },
      'project_card': { width: 320, height: 180 },
      'finance_card': { width: 300, height: 200 },
      'csr_card': { width: 300, height: 200 },
      'crm_card': { width: 300, height: 200 },
      'root_connector': { width: 400, height: 100 }
    };

    // بيانات افتراضية للعناصر الذكية
    const defaultData: Record<string, any> = {
      'thinking_board': { items: [], tags: [] },
      'kanban': { 
        columns: [
          { id: '1', title: 'قيد الانتظار', cards: [] },
          { id: '2', title: 'قيد التنفيذ', cards: [] },
          { id: '3', title: 'مكتمل', cards: [] }
        ] 
      },
      'voting': { question: 'سؤال التصويت', options: [], totalVotes: 0 },
      'brainstorming': { mode: 'collaborative', ideas: [] },
      'timeline': { unit: 'month', items: [] },
      'decisions_matrix': { criteria: [], options: [] },
      'gantt': { tasks: [], dependencies: [] },
      'interactive_sheet': { rows: 10, cols: 10, cells: {} },
      'mind_map': { root: { id: '1', label: 'العنوان', children: [] } },
      'project_card': { title: 'مشروع جديد', status: 'active', progress: 0 },
      'finance_card': { budget: 0, spent: 0, currency: 'SAR' },
      'csr_card': { initiative: 'مبادرة جديدة', impact: [] },
      'crm_card': { client: 'عميل جديد', interactions: [] },
      'root_connector': { title: 'رابط', description: '', start: null, end: null }
    };

    const smartElement = {
      type: 'smart' as const,
      smartType: selectedSmartElement,
      position: point,
      size: defaultSizes[selectedSmartElement] || { width: 400, height: 300 },
      data: defaultData[selectedSmartElement] || {}
    };
    
    addElement(smartElement);
    toast.success('تم إضافة العنصر الذكي');
    
    // إعادة تعيين العنصر المختار
    useCanvasStore.getState().setSelectedSmartElement(null);
  };

  return {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  };
};
