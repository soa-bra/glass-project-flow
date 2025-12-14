import { useCallback, useRef, useState } from 'react';
import { useCanvasStore, type ToolId, type ShapeType } from '@/stores/canvasStore';
import { screenToCanvasCoordinates, snapToGrid as applySnapToGrid } from '@/utils/canvasCoordinates';
import { recognizeShape, pointsToSVGPath, simplifyPath, type Point } from '@/utils/shapeRecognition';
import { toast } from 'sonner';
import type { ArrowData } from '@/types/arrow-connections';

// التحقق إذا كان الشكل سهماً
const isArrowShape = (shapeType: string): boolean => {
  return shapeType.startsWith('arrow_');
};

// إنشاء بيانات السهم الافتراضية بناءً على نوع السهم
const createArrowData = (width: number, height: number, shapeType: string): ArrowData => {
  let startPoint: { x: number; y: number };
  let endPoint: { x: number; y: number };
  let headDirection: 'start' | 'end' | 'both' = 'end';

  switch (shapeType) {
    case 'arrow_right':
      startPoint = { x: 0, y: height / 2 };
      endPoint = { x: width, y: height / 2 };
      break;
    case 'arrow_left':
      startPoint = { x: width, y: height / 2 };
      endPoint = { x: 0, y: height / 2 };
      break;
    case 'arrow_up':
      startPoint = { x: width / 2, y: height };
      endPoint = { x: width / 2, y: 0 };
      break;
    case 'arrow_down':
      startPoint = { x: width / 2, y: 0 };
      endPoint = { x: width / 2, y: height };
      break;
    case 'arrow_up_right':
      startPoint = { x: 0, y: height };
      endPoint = { x: width, y: 0 };
      break;
    case 'arrow_down_right':
      startPoint = { x: 0, y: 0 };
      endPoint = { x: width, y: height };
      break;
    case 'arrow_up_left':
      startPoint = { x: width, y: height };
      endPoint = { x: 0, y: 0 };
      break;
    case 'arrow_down_left':
      startPoint = { x: width, y: 0 };
      endPoint = { x: 0, y: height };
      break;
    case 'arrow_double_horizontal':
      startPoint = { x: 0, y: height / 2 };
      endPoint = { x: width, y: height / 2 };
      headDirection = 'both';
      break;
    case 'arrow_double_vertical':
      startPoint = { x: width / 2, y: 0 };
      endPoint = { x: width / 2, y: height };
      headDirection = 'both';
      break;
    default:
      startPoint = { x: 0, y: height / 2 };
      endPoint = { x: width, y: height / 2 };
  }

  return {
    startPoint,
    middlePoint: null,
    endPoint,
    startConnection: null,
    endConnection: null,
    arrowType: 'straight',
    headDirection
  };
};

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
        // 1️⃣ أولاً: التحقق من وجود عنصر تحت النقر
        const clickedElement = elements.find(el => {
          // تجاهل العناصر النصية والإطارات
          if (el.type === 'text' || el.type === 'frame') return false;
          
          // التحقق من أن النقر داخل حدود العنصر
          const inBounds = (
            snappedPoint.x >= el.position.x &&
            snappedPoint.x <= el.position.x + el.size.width &&
            snappedPoint.y >= el.position.y &&
            snappedPoint.y <= el.position.y + el.size.height
          );
          return inBounds;
        });
        
        // 2️⃣ إذا وجدنا عنصر، أنشئ نص مرتبط
        if (clickedElement) {
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
        } 
        // 3️⃣ وإلا، ابدأ السحب العادي
        else {
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
    
    // حساب المسافة الفعلية المسحوبة
    const dragDistance = tempElement 
      ? Math.max(tempElement.size.width, tempElement.size.height)
      : 0;
    
    // إذا لم يكن هناك tempElement أو المسافة صغيرة جداً → سطر نص
    if (!tempElement || dragDistance < 20) {
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
      
      setTimeout(() => {
        startEditingText(newId);
      }, 50);
      
      toast.success('انقر وابدأ الكتابة');
    } 
    // إذا كان السحب كبير → مربع نص
    else {
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
    // ✅ قراءة أحدث القيم من الـ store مباشرة لضمان تحديث الخصائص فوراً
    const { toolSettings: currentSettings } = useCanvasStore.getState();
    const { shapeType, fillColor, strokeColor, strokeWidth, opacity, iconName, stickyText } = currentSettings.shapes;
    
    setIsDrawing(true);
    setDrawStartPoint(point);

    const initialElement: any = {
      id: 'temp',
      type: 'shape' as const,
      position: point,
      size: { width: 0, height: 0 },
      shapeType: shapeType,
      iconName: iconName,
      stickyText: stickyText,
      style: {
        backgroundColor: fillColor,
        borderRadius: shapeType === 'circle' ? 9999 : 8,
        opacity: opacity
      },
      strokeColor: strokeColor,
      strokeWidth: strokeWidth,
      data: {
        shapeType: shapeType // حفظ shapeType أيضاً في data للتوافق
      }
    };

    // إذا كان الشكل سهماً، أضف بيانات السهم مع حجم افتراضي معقول
    if (isArrowShape(shapeType)) {
      // استخدام حجم افتراضي 100x50 للسهم الجديد حتى يتم تحديثه أثناء السحب
      initialElement.data.arrowData = createArrowData(100, 50, shapeType);
    }

    setTempElement(initialElement);
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

    // تحديث بيانات السهم إذا كان الشكل سهماً
    let updatedData = { ...tempElement.data };
    if (tempElement.shapeType && isArrowShape(tempElement.shapeType)) {
      updatedData.arrowData = createArrowData(width, height, tempElement.shapeType);
    }

    setTempElement({
      ...tempElement,
      position: { x, y },
      size: { width, height },
      data: updatedData
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
