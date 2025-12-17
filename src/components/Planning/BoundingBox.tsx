import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { eventPipeline } from '@/core/eventPipeline';
import { canvasKernel, type Bounds, type Point } from '@/core/canvasKernel';

// التحقق إذا كان الشكل سهماً
const isArrowShape = (shapeType: string | undefined): boolean => {
  if (!shapeType) return false;
  return shapeType.startsWith('arrow_');
};

/**
 * مكون الإطار المحيط للعناصر المحددة
 * 
 * ✅ Sprint 4: جميع الحسابات في World Space
 * ✅ العرض يتم عبر CSS transform من الكانفاس
 */
export const BoundingBox: React.FC = () => {
  // ✅ جميع الـ Hooks أولاً (قبل أي return)
  const { 
    selectedElementIds, 
    elements, 
    viewport, 
    moveElements, 
    resizeElements, 
    duplicateElement, 
    resizeFrame, 
    activeTool 
  } = useCanvasStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const dragStart = useRef<Point>({ x: 0, y: 0 });
  const hasDuplicated = useRef(false);
  
  // ✅ حساب حدود الإطار المحيط في World Space
  const selectedElements = useMemo(() => 
    elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );
  
  // حساب عدد العناصر الفعلية (بدون تكرار الأطفال)
  const displayCount = useMemo(() => {
    const frames = selectedElements.filter(el => el.type === 'frame');
    
    if (frames.length > 0) {
      const childIds = frames.flatMap(f => (f as any).children || []);
      const nonChildElements = selectedElements.filter(
        el => !childIds.includes(el.id)
      );
      return nonChildElements.length;
    }
    
    return selectedElements.length;
  }, [selectedElements]);
  
  // ✅ حساب الحدود في World Space باستخدام Canvas Kernel
  const bounds = useMemo((): Bounds & { centerX: number; centerY: number } => {
    if (selectedElements.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
    }
    
    const result = canvasKernel.calculateBounds(selectedElements);
    return result;
  }, [selectedElements]);
  
  // ✅ حساب نقطة المرجع للـ resize (في World Space)
  const getResizeOrigin = useCallback((handle: string): Point => {
    const { x, y, width, height, centerX, centerY } = bounds;
    const maxX = x + width;
    const maxY = y + height;
    
    const originMap: Record<string, Point> = {
      'nw': { x: maxX, y: maxY },
      'ne': { x: x, y: maxY },
      'sw': { x: maxX, y: y },
      'se': { x: x, y: y },
      'n': { x: centerX, y: maxY },
      's': { x: centerX, y: y },
      'w': { x: maxX, y: centerY },
      'e': { x: x, y: centerY }
    };
    return originMap[handle] || { x: centerX, y: centerY };
  }, [bounds]);
  
  // ✅ معالجة حركة الماوس باستخدام Event Pipeline
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // منع التعارض مع سحب نقاط تحكم السهم
      if (useCanvasStore.getState().isInternalDrag) return;
      
      if (isDragging) {
        // تكرار العناصر عند Cmd/Ctrl+Drag
        if ((e.metaKey || e.ctrlKey) && !hasDuplicated.current) {
          selectedElementIds.forEach(id => duplicateElement(id));
          hasDuplicated.current = true;
        }
        
        // ✅ استخدام Event Pipeline لتحويل الدلتا
        const worldDelta = eventPipeline.screenDeltaToWorld(
          e.clientX - dragStart.current.x,
          e.clientY - dragStart.current.y,
          viewport.zoom
        );
        
        let deltaX = worldDelta.x;
        let deltaY = worldDelta.y;
        
        // تقييد الحركة بمحور واحد مع Shift
        if (e.shiftKey) {
          const absX = Math.abs(e.clientX - dragStart.current.x);
          const absY = Math.abs(e.clientY - dragStart.current.y);
          
          if (absX > absY) {
            deltaY = 0;
          } else {
            deltaX = 0;
          }
        }
        
        if (deltaX !== 0 || deltaY !== 0) {
          moveElements(selectedElementIds, deltaX, deltaY);
          dragStart.current = { x: e.clientX, y: e.clientY };
        }
      } else if (isResizing) {
        // ✅ استخدام Event Pipeline لتحويل الدلتا
        const resizeDelta = eventPipeline.screenDeltaToWorld(
          e.clientX - dragStart.current.x,
          e.clientY - dragStart.current.y,
          viewport.zoom
        );
        
        const { width, height } = bounds;
        let scaleX = 1;
        let scaleY = 1;
        const origin = getResizeOrigin(isResizing);
        
        if (isResizing.includes('e')) scaleX = 1 + resizeDelta.x / width;
        if (isResizing.includes('w')) scaleX = 1 - resizeDelta.x / width;
        if (isResizing.includes('s')) scaleY = 1 + resizeDelta.y / height;
        if (isResizing.includes('n')) scaleY = 1 - resizeDelta.y / height;
        
        // منع القيم السالبة أو الصفرية
        scaleX = Math.max(0.1, scaleX);
        scaleY = Math.max(0.1, scaleY);
        
        if (scaleX !== 1 || scaleY !== 1) {
          const isFrame = selectedElements.length === 1 && selectedElements[0].type === 'frame';
          
          if (isFrame) {
            const frameId = selectedElements[0].id;
            const newBounds = {
              x: origin.x - (origin.x - bounds.x) * scaleX,
              y: origin.y - (origin.y - bounds.y) * scaleY,
              width: width * scaleX,
              height: height * scaleY
            };
            resizeFrame(frameId, newBounds);
          } else {
            resizeElements(selectedElementIds, scaleX, scaleY, origin);
          }
          
          dragStart.current = { x: e.clientX, y: e.clientY };
        }
      }
    };
    
    const handleMouseUp = () => {
      // التحقق من وجود العناصر داخل إطار عند الإفلات
      if (isDragging && selectedElements.length > 0) {
        const frames = elements.filter(el => el.type === 'frame');
        const { addChildToFrame, removeChildFromFrame } = useCanvasStore.getState();
        
        selectedElements.forEach(selectedEl => {
          let targetFrameId: string | null = null;
          
          for (const frame of frames) {
            // ✅ استخدام Canvas Kernel للتحقق من الاحتواء
            const isInside = canvasKernel.pointInBounds(
              { 
                x: selectedEl.position.x + selectedEl.size.width / 2, 
                y: selectedEl.position.y + selectedEl.size.height / 2 
              },
              { 
                x: frame.position.x, 
                y: frame.position.y, 
                width: frame.size.width, 
                height: frame.size.height 
              }
            );
            
            if (isInside) {
              targetFrameId = frame.id;
              break;
            }
          }
          
          // إزالة من الإطارات القديمة
          frames.forEach(frame => {
            const children = (frame as any).children || [];
            if (children.includes(selectedEl.id) && frame.id !== targetFrameId) {
              removeChildFromFrame(frame.id, selectedEl.id);
            }
          });
          
          // إضافة للإطار الجديد
          if (targetFrameId) {
            const frame = frames.find(f => f.id === targetFrameId);
            const children = (frame as any)?.children || [];
            if (!children.includes(selectedEl.id)) {
              addChildToFrame(targetFrameId, selectedEl.id);
            }
          }
        });
      }
      
      setIsDragging(false);
      setIsResizing(null);
      hasDuplicated.current = false;
    };
    
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, viewport, moveElements, resizeElements, selectedElementIds, bounds, getResizeOrigin, selectedElements, elements, duplicateElement, resizeFrame]);
  
  // معالجات الأحداث
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  const handleResizeStart = useCallback((e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    setIsResizing(corner);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  // ✅ التحقق من إظهار BoundingBox
  const isAllArrows = useMemo(() => 
    selectedElements.every(el => 
      el.type === 'shape' && isArrowShape(el.shapeType || el.data?.shapeType)
    ),
    [selectedElements]
  );
  
  if (activeTool !== 'selection_tool' || selectedElements.length === 0 || isAllArrows) {
    return null;
  }
  
  // مقبض تغيير الحجم
  const ResizeHandle = ({ position, cursor, onStart }: { 
    position: string; 
    cursor: string; 
    onStart: (e: React.MouseEvent) => void 
  }) => {
    const positionStyles: Record<string, React.CSSProperties> = {
      'nw': { top: -8, left: -8 },
      'ne': { top: -8, right: -8 },
      'sw': { bottom: -8, left: -8 },
      'se': { bottom: -8, right: -8 },
      'n': { top: -8, left: '50%', transform: 'translateX(-50%)' },
      's': { bottom: -8, left: '50%', transform: 'translateX(-50%)' },
      'w': { top: '50%', left: -8, transform: 'translateY(-50%)' },
      'e': { top: '50%', right: -8, transform: 'translateY(-50%)' }
    };
    
    return (
      <div 
        className="absolute pointer-events-auto group"
        style={{ ...positionStyles[position], cursor, width: 16, height: 16 }}
        onMouseDown={onStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform shadow-sm" />
      </div>
    );
  };
  
  return (
    <div
      className="absolute pointer-events-none bounding-box"
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        border: '2px dashed hsl(var(--accent-blue) / 0.8)',
        borderRadius: '4px'
      }}
    >
      {/* مقابض الزوايا */}
      <ResizeHandle position="nw" cursor="nwse-resize" onStart={(e) => handleResizeStart(e, 'nw')} />
      <ResizeHandle position="ne" cursor="nesw-resize" onStart={(e) => handleResizeStart(e, 'ne')} />
      <ResizeHandle position="sw" cursor="nesw-resize" onStart={(e) => handleResizeStart(e, 'sw')} />
      <ResizeHandle position="se" cursor="nwse-resize" onStart={(e) => handleResizeStart(e, 'se')} />
      
      {/* مقابض الأضلاع */}
      <ResizeHandle position="n" cursor="ns-resize" onStart={(e) => handleResizeStart(e, 'n')} />
      <ResizeHandle position="s" cursor="ns-resize" onStart={(e) => handleResizeStart(e, 's')} />
      <ResizeHandle position="w" cursor="ew-resize" onStart={(e) => handleResizeStart(e, 'w')} />
      <ResizeHandle position="e" cursor="ew-resize" onStart={(e) => handleResizeStart(e, 'e')} />
      
      {/* منطقة السحب للتحريك */}
      <div
        className="absolute inset-4 pointer-events-auto cursor-move"
        onMouseDown={handleDragStart}
      />
      
      {/* عداد العناصر (إذا أكثر من عنصر) */}
      {displayCount > 1 && (
        <div 
          className="absolute -top-7 left-0 px-2 py-0.5 text-xs font-medium rounded bg-[hsl(var(--accent-blue))] text-white"
          style={{ direction: 'rtl' }}
        >
          {displayCount} عنصر
        </div>
      )}
    </div>
  );
};
