import { useCallback, useRef, useState } from 'react';
import { useCanvasStore, type ToolId, type ShapeType } from '@/stores/canvasStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { eventPipeline } from '@/engine/canvas/events/eventPipeline';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';
import { recognizeShape, pointsToSVGPath, simplifyPath, type Point } from '@/utils/shapeRecognition';
import { toast } from 'sonner';
import { createStraightArrowData, type ArrowData } from '@/types/arrow-connections';
import type { SmartElementType } from '@/types/smart-elements';

const DEFAULT_SHAPE_SIZE = { width: 120, height: 120 };
const DEFAULT_ARROW_SIZE = { width: 120, height: 60 };

// التحقق إذا كان الشكل سهماً
const isArrowShape = (shapeType: string): boolean => {
  return shapeType.startsWith('arrow_');
};

// إنشاء بيانات السهم الافتراضية بناءً على نوع السهم
const createArrowData = (width: number, height: number, shapeType: string): ArrowData => {
  let startPoint: { x: number; y: number };
  let endPoint: { x: number; y: number };
  let headDirection: 'start' | 'end' | 'both' | 'none' = 'end';

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

  return createStraightArrowData(startPoint, endPoint, headDirection);
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
    if ((e.target as HTMLElement).closest('[data-canvas-element]')) {
      return;
    }

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const canvasPoint = eventPipeline.screenToWorld(
      e.clientX,
      e.clientY,
      containerRect,
      viewport
    );

    const snappedPoint = canvasKernel.snapToGrid(
      canvasPoint,
      settings.gridSize,
      settings.snapToGrid
    );

    switch (activeTool) {
      case 'text_tool':
        const clickedElement = elements.find(el => {
          if (el.type === 'text' || el.type === 'frame') return false;
          const inBounds = (
            snappedPoint.x >= el.position.x &&
            snappedPoint.x <= el.position.x + el.size.width &&
            snappedPoint.y >= el.position.y &&
            snappedPoint.y <= el.position.y + el.size.height
          );
          return inBounds;
        });
        
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
        } else {
          handleTextToolDragStart(snappedPoint);
        }
        break;

      case 'shapes_tool':
        const { toolSettings: currentSettings } = useCanvasStore.getState();
        const currentShapeType = currentSettings.shapes.shapeType;
        
        if (currentShapeType === 'sticky') {
          const STICKY_DEFAULT_SIZE = { width: 200, height: 200 };
          
          addElement({
            type: 'shape',
            shapeType: 'sticky',
            position: {
              x: snappedPoint.x - STICKY_DEFAULT_SIZE.width / 2,
              y: snappedPoint.y - STICKY_DEFAULT_SIZE.height / 2
            },
            size: STICKY_DEFAULT_SIZE,
            style: {
              backgroundColor: currentSettings.shapes.fillColor || '#FEF9C3'
            },
            stickyText: '',
            data: {
              shapeType: 'sticky',
              stickyText: ''
            }
          });
          
          toast.success('تم إضافة ستيكي نوت - انقر مرتين للكتابة');
          return;
        }
        
        handleShapesToolStart(snappedPoint);
        break;

      case 'smart_pen':
        break;

      case 'frame_tool':
        break;
      
      case 'file_uploader':
        toast.info('استخدم لوحة رفع الملفات أو اسحب ملفاً على الكانفاس');
        break;

      case 'smart_element_tool':
        handleSmartElementClick(snappedPoint);
        break;

      case 'smart_doc_tool':
        handleSmartDocClick(snappedPoint);
        break;

      case 'sticky_tool':
        handleStickyToolClick(snappedPoint);
        break;

      case 'mindmap_tool':
        handleMindMapToolClick(snappedPoint);
        break;

      case 'selection_tool':
        break;

      default:
        break;
    }
  }, [activeTool, viewport, settings, containerRef]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !drawStartPoint) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const canvasPoint = eventPipeline.screenToWorld(
      e.clientX,
      e.clientY,
      containerRect,
      viewport
    );

    const snappedPoint = canvasKernel.snapToGrid(
      canvasPoint,
      settings.gridSize,
      settings.snapToGrid
    );

    switch (activeTool) {
      case 'text_tool':
        if (isDraggingText) {
          handleTextToolDragMove(snappedPoint);
        }
        break;
        
      case 'shapes_tool':
        handleShapesToolMove(snappedPoint);
        break;

      case 'smart_pen':
        break;

      case 'frame_tool':
        break;

      default:
        break;
    }
  }, [isDrawing, drawStartPoint, activeTool, viewport, settings, containerRef]);

  const handleCanvasMouseUp = useCallback(() => {
    if (activeTool === 'text_tool' && isDraggingText) {
      handleTextToolDragEnd();
      return;
    }
    
    if (isDrawing && tempElement) {
      const finalElement = { ...tempElement } as any;
      delete finalElement.id;

      if (finalElement.type === 'shape') {
        const isArrow = isArrowShape(finalElement.shapeType || finalElement.data?.shapeType || '');
        const fallbackSize = isArrow ? DEFAULT_ARROW_SIZE : DEFAULT_SHAPE_SIZE;
        const hasVisibleSize = finalElement.size.width >= 8 || finalElement.size.height >= 8;

        if (!hasVisibleSize && drawStartPoint) {
          finalElement.size = fallbackSize;
          finalElement.position = {
            x: drawStartPoint.x - fallbackSize.width / 2,
            y: drawStartPoint.y - fallbackSize.height / 2,
          };
        } else {
          finalElement.size = {
            width: Math.max(finalElement.size.width, fallbackSize.width / 3),
            height: Math.max(finalElement.size.height, fallbackSize.height / 3),
          };
        }

        if (isArrow) {
          finalElement.data = {
            ...(finalElement.data || {}),
            arrowData: createArrowData(finalElement.size.width, finalElement.size.height, finalElement.shapeType),
          };
        }
      }
      
      addElement(finalElement);
      toast.success('تم إضافة العنصر');
    }

    setIsDrawing(false);
    setDrawStartPoint(null);
    setTempElement(null);
  }, [isDrawing, tempElement, addElement, setIsDrawing, setDrawStartPoint, setTempElement, activeTool, isDraggingText, drawStartPoint]);

  const handleTextToolDragStart = (point: { x: number; y: number }) => {
    setIsDraggingText(true);
    setTextBoxStart(point);
    setIsDrawing(true);
    setDrawStartPoint(point);
  };
  
  const handleTextToolDragMove = (currentPoint: { x: number; y: number }) => {
    if (!textBoxStart) return;
    
    const width = Math.abs(currentPoint.x - textBoxStart.x);
    const height = Math.abs(currentPoint.y - textBoxStart.y);
    const x = Math.min(currentPoint.x, textBoxStart.x);
    const y = Math.min(currentPoint.y, textBoxStart.y);
    
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
  
  const handleTextToolDragEnd = () => {
    if (!textBoxStart) return;
    
    const { addText, startEditingText } = useCanvasStore.getState();
    const dragDistance = tempElement 
      ? Math.max(tempElement.size.width, tempElement.size.height)
      : 0;
    
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = useCanvasStore.getState().elements.find(e => e.id === newId);
          if (el) {
            startEditingText(newId);
          }
        });
      });
    } else {
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = useCanvasStore.getState().elements.find(e => e.id === newId);
          if (el) {
            startEditingText(newId);
          }
        });
      });
    }
    
    setIsDraggingText(false);
    setTextBoxStart(null);
    setTempElement(null);
    setIsDrawing(false);
    setDrawStartPoint(null);
  };

  const handleShapesToolStart = (point: { x: number; y: number }) => {
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
        shapeType: shapeType
      }
    };

    if (isArrowShape(shapeType)) {
      initialElement.data.arrowData = createArrowData(100, 50, shapeType);
    }

    setTempElement(initialElement);
  };

  const handleShapesToolMove = (currentPoint: { x: number; y: number }) => {
    if (!drawStartPoint || !tempElement) return;

    const width = Math.abs(currentPoint.x - drawStartPoint.x);
    const height = Math.abs(currentPoint.y - drawStartPoint.y);
    const x = Math.min(currentPoint.x, drawStartPoint.x);
    const y = Math.min(currentPoint.y, drawStartPoint.y);

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

  const handleSmartElementClick = (point: { x: number; y: number }) => {
    const { selectedSmartElement, addElement: addCanvasElement } = useCanvasStore.getState();
    const SMART_DOC_TYPES = ['interactive_sheet', 'smart_text_doc'];
    
    if (!selectedSmartElement) {
      toast.info('اختر عنصراً ذكياً من اللوحة الجانبية أولاً');
      return;
    }

    if (SMART_DOC_TYPES.includes(selectedSmartElement)) {
      toast.info('استخدم أداة المستند الذكي (D) لإضافة هذا العنصر');
      return;
    }

    if (selectedSmartElement === 'mind_map') {
      addCanvasElement({
        type: 'mindmap_node',
        position: { x: point.x - 90, y: point.y - 30 },
        size: { width: 180, height: 60 },
        data: {
          label: 'الفكرة الرئيسية',
          color: '#3B82F6',
          nodeStyle: 'rounded',
          isRoot: true,
          fontSize: 16,
          textColor: '#FFFFFF'
        }
      });
      
      toast.success('تم إنشاء عقدة خريطة ذهنية - اسحب من نقاط الربط لإضافة فروع');
      useCanvasStore.getState().setSelectedSmartElement(null);
      return;
    }

    const { addSmartElement } = useSmartElementsStore.getState();
    
    addSmartElement(
      selectedSmartElement as SmartElementType,
      point,
      { title: selectedSmartElement }
    );
    
    toast.success('تم إضافة العنصر الذكي');
    useCanvasStore.getState().setSelectedSmartElement(null);
  };

  const handleSmartDocClick = (point: { x: number; y: number }) => {
    const { selectedSmartDoc } = useCanvasStore.getState();
    
    if (!selectedSmartDoc) {
      toast.info('اختر نوع المستند الذكي من اللوحة الجانبية أولاً');
      return;
    }

    if (selectedSmartDoc !== 'interactive_sheet' && selectedSmartDoc !== 'smart_text_doc') {
      toast.info('اختر نوع المستند الذكي من اللوحة الجانبية');
      return;
    }

    const { addSmartElement } = useSmartElementsStore.getState();
    const initialData: Record<string, any> = {};
    
    if (selectedSmartDoc === 'interactive_sheet') {
      initialData.title = 'جدول تفاعلي';
      initialData.rows = 10;
      initialData.columns = 5;
      initialData.enableFormulas = true;
    } else if (selectedSmartDoc === 'smart_text_doc') {
      initialData.title = 'مستند نصي ذكي';
      initialData.content = '';
      initialData.format = 'rich';
      initialData.aiAssist = true;
    }

    addSmartElement(
      selectedSmartDoc as SmartElementType,
      point,
      initialData
    );
    
    toast.success(`تم إضافة ${selectedSmartDoc === 'interactive_sheet' ? 'الجدول التفاعلي' : 'المستند النصي الذكي'}`);
    useCanvasStore.getState().setSelectedSmartDoc(null);
  };

  const handleStickyToolClick = (point: { x: number; y: number }) => {
    const STICKY_DEFAULT_SIZE = { width: 200, height: 200 };
    const colors = ['#FEF9C3', '#DCFCE7', '#DBEAFE', '#FCE7F3', '#FED7AA'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    addElement({
      type: 'shape',
      shapeType: 'sticky',
      position: {
        x: point.x - STICKY_DEFAULT_SIZE.width / 2,
        y: point.y - STICKY_DEFAULT_SIZE.height / 2
      },
      size: STICKY_DEFAULT_SIZE,
      style: {
        backgroundColor: randomColor
      },
      stickyText: '',
      data: {
        shapeType: 'sticky',
        stickyText: ''
      }
    });
    
    toast.success('تم إضافة ستيكي نوت - انقر مرتين للكتابة');
  };

  const handleMindMapToolClick = (point: { x: number; y: number }) => {
    addElement({
      type: 'mindmap_node',
      position: { x: point.x - 90, y: point.y - 30 },
      size: { width: 180, height: 60 },
      data: {
        label: 'فكرة جديدة',
        color: '#3B82F6',
        nodeStyle: 'rounded',
        isRoot: false,
        fontSize: 14,
        textColor: '#FFFFFF'
      }
    });
    
    toast.success('تم إنشاء عقدة - اسحب من نقاط الربط لإضافة فروع');
  };

  return {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  };
};
