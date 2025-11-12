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
  
  // Text tool dragging state
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [textBoxStart, setTextBoxStart] = useState<{x: number, y: number} | null>(null);

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
        // التحقق من وجود عنصر تحت النقر (للنص المرتبط)
        const clickedElement = elements.find(el => {
          if (el.type === 'text') return false; // تجاهل العناصر النصية
          
          const inBounds = (
            snappedPoint.x >= el.position.x &&
            snappedPoint.x <= el.position.x + el.size.width &&
            snappedPoint.y >= el.position.y &&
            snappedPoint.y <= el.position.y + el.size.height
          );
          return inBounds;
        });
        
        if (clickedElement) {
          // إنشاء نص مرتبط
          const relativeX = snappedPoint.x - clickedElement.position.x;
          const relativeY = snappedPoint.y - clickedElement.position.y;
          
          const { addText, startEditingText } = useCanvasStore.getState();
          
          const attachedText = {
            type: 'text' as const,
            textType: 'attached' as const,
            position: snappedPoint,
            size: { width: 150, height: 40 },
            content: '',
            fontSize: toolSettings.text.fontSize,
            color: toolSettings.text.color,
            fontFamily: toolSettings.text.fontFamily,
            fontWeight: toolSettings.text.fontWeight,
            alignment: toolSettings.text.alignment,
            attachedTo: clickedElement.id,
            relativePosition: { x: relativeX, y: relativeY }
          };
          
          const newId = addText(attachedText);
          setTimeout(() => startEditingText(newId), 50);
          toast.success('تم إضافة نص مرتبط - سيتحرك مع العنصر');
        } else {
          // بدء سحب محتمل لمربع نص عادي
          handleTextToolDragStart(snappedPoint);
        }
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
      case 'text_tool':
        // تحديث مربع النص المؤقت أثناء السحب
        if (isDraggingText) {
          handleTextToolDragMove(snappedPoint);
        }
        break;
        
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
    // التعامل مع نهاية سحب أداة النص
    if (activeTool === 'text_tool' && isDraggingText) {
      handleTextToolDragEnd();
      return;
    }
    
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
  }, [isDrawing, tempElement, addElement, setIsDrawing, setDrawStartPoint, setTempElement, activeTool, isDraggingText]);

  /**
   * أداة النص: بدء سحب محتمل
   */
  const handleTextToolDragStart = (point: { x: number; y: number }) => {
    setIsDraggingText(true);
    setTextBoxStart(point);
    setIsDrawing(true);
    setDrawStartPoint(point);
  };
  
  /**
   * أداة النص: تحديث مربع النص المؤقت أثناء السحب
   */
  const handleTextToolDragMove = (currentPoint: { x: number; y: number }) => {
    if (!textBoxStart) return;
    
    const width = Math.abs(currentPoint.x - textBoxStart.x);
    const height = Math.abs(currentPoint.y - textBoxStart.y);
    const x = Math.min(currentPoint.x, textBoxStart.x);
    const y = Math.min(currentPoint.y, textBoxStart.y);
    
    // عرض مستطيل مؤقت - الحد الأدنى للحجم 50x30
    if (width > 5 || height > 5) {
      setTempElement({
        id: 'temp-textbox',
        type: 'text',
        position: { x, y },
        size: { width: Math.max(width, 50), height: Math.max(height, 30) },
        style: { 
          border: '2px dashed #3DBE8B',
          backgroundColor: 'rgba(61, 190, 139, 0.05)'
        },
        content: '',
        data: { textType: 'box' }
      } as any);
    }
  };
  
  /**
   * أداة النص: إنهاء السحب وإنشاء النص النهائي
   */
  const handleTextToolDragEnd = () => {
    if (!textBoxStart) return;
    
    const { addText, startEditingText } = useCanvasStore.getState();
    
    // إذا كان السحب صغيراً جداً (نقرة بسيطة)، أنشئ سطر نص
    if (tempElement && (tempElement.size.width < 20 && tempElement.size.height < 20)) {
      const textData = {
        type: 'text' as const,
        textType: 'line' as const,
        position: textBoxStart,
        size: { width: 200, height: 50 },
        content: '',
        fontSize: toolSettings.text.fontSize,
        color: toolSettings.text.color,
        fontFamily: toolSettings.text.fontFamily,
        fontWeight: toolSettings.text.fontWeight,
        alignment: toolSettings.text.alignment
      };

      const newId = addText(textData);
      
      // بدء التحرير فوراً
      setTimeout(() => {
        startEditingText(newId);
      }, 50);
      
      toast.success('انقر وابدأ الكتابة');
    } 
    // إذا كان هناك سحب، أنشئ مربع نص
    else if (tempElement) {
      const textBoxElement = {
        type: 'text' as const,
        textType: 'box' as const,
        position: tempElement.position,
        size: tempElement.size,
        content: '',
        fontSize: toolSettings.text.fontSize,
        color: toolSettings.text.color,
        fontFamily: toolSettings.text.fontFamily,
        fontWeight: toolSettings.text.fontWeight,
        alignment: toolSettings.text.alignment
      };
      
      const newId = addText(textBoxElement);
      
      // بدء التحرير
      setTimeout(() => {
        startEditingText(newId);
      }, 50);
      
      toast.success('تم إنشاء مربع نص - ابدأ الكتابة');
    }
    
    // إعادة تعيين الحالة
    setIsDraggingText(false);
    setTextBoxStart(null);
    setTempElement(null);
    setIsDrawing(false);
    setDrawStartPoint(null);
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
