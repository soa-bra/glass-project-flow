import { useCallback, useRef } from 'react';
import { useCanvasStore, type ToolId, type ShapeType } from '@/stores/canvasStore';
import { screenToCanvasCoordinates, snapToGrid as applySnapToGrid } from '@/utils/canvasCoordinates';
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
    toast.info('اختر عنصراً ذكياً من اللوحة الجانبية');
  };

  return {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  };
};
