import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore } from '@/stores/interactionStore';
import { eventPipeline } from '@/core/eventPipeline';
import { canvasKernel, type Bounds, type Point } from '@/core/canvasKernel';
import { snapEngine, type SnapLine } from '@/core/snapEngine';
import { selectionCoordinator } from '@/core/selectionCoordinator';
import { Frame } from 'lucide-react';

// التحقق إذا كان الشكل سهماً
const isArrowShape = (shapeType: string | undefined): boolean => {
  if (!shapeType) return false;
  return shapeType.startsWith('arrow_');
};

/**
 * مكون الإطار المحيط للعناصر المحددة
 * 
 * ✅ Sprint 4: جميع الحسابات في World Space
 * ✅ Sprint 5: دعم Snap Engine للمحاذاة الذكية
 * ✅ العرض يتم عبر CSS transform من الكانفاس
 */

interface BoundingBoxProps {
  onGuidesChange?: (guides: SnapLine[]) => void;
}

export const BoundingBox: React.FC<BoundingBoxProps> = ({ onGuidesChange }) => {
  // ✅ جميع الـ Hooks أولاً (قبل أي return)
  const { 
    selectedElementIds, 
    elements, 
    viewport, 
    settings,
    moveElements, 
    resizeElements, 
    duplicateElement, 
    resizeFrame, 
    activeTool,
    createFrameFromSelection
  } = useCanvasStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const dragStart = useRef<Point>({ x: 0, y: 0 });
  const elementStartPos = useRef<Point>({ x: 0, y: 0 });
  const lastAppliedPos = useRef<Point>({ x: 0, y: 0 }); // ✅ Fix: تتبع آخر موقع مُطبَّق
  const hasDuplicated = useRef(false);
  
  // ✅ دالة للحصول على جميع عناصر المجموعة
  const getGroupElementIds = useCallback((elementIds: string[]): string[] => {
    const result = new Set<string>(elementIds);
    
    // للبحث عن groupIds للعناصر المحددة
    const groupIds = new Set<string>();
    elementIds.forEach(id => {
      const element = elements.find(el => el.id === id);
      if (element?.metadata?.groupId) {
        groupIds.add(element.metadata.groupId);
      }
    });
    
    // إضافة جميع العناصر التي تنتمي لنفس المجموعات
    if (groupIds.size > 0) {
      elements.forEach(el => {
        if (el.metadata?.groupId && groupIds.has(el.metadata.groupId)) {
          result.add(el.id);
        }
      });
    }
    
    return Array.from(result);
  }, [elements]);
  
  // ✅ حساب حدود الإطار المحيط في World Space (مع المجموعات)
  const expandedSelectedIds = useMemo(() => 
    getGroupElementIds(selectedElementIds),
    [selectedElementIds, getGroupElementIds]
  );
  
  // ✅ حساب حدود الإطار المحيط في World Space
  const selectedElements = useMemo(() => 
    elements.filter(el => expandedSelectedIds.includes(el.id)),
    [elements, expandedSelectedIds]
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
  
  // ✅ تحديث Snap Engine targets عند تغيير العناصر
  useEffect(() => {
    snapEngine.updateConfig({
      gridEnabled: settings.snapToGrid,
      gridSize: settings.gridSize,
      elementSnapEnabled: settings.snapToGrid, // ✅ Fix: ربط بتفعيل السناب
      snapThreshold: 8,
      centerSnapEnabled: settings.snapToGrid,
      edgeSnapEnabled: settings.snapToGrid
    });
    
    const validElements = elements.filter(el => el.visible !== false && el.locked !== true);
    snapEngine.updateTargets(validElements, selectedElementIds);
  }, [elements, selectedElementIds, settings.snapToGrid, settings.gridSize]);

  // ✅ Pointer ID للـ Capture
  const activePointerIdRef = useRef<number | null>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // ✅ معالجة حركة الـ Pointer باستخدام Pointer Capture
  const handlePointerMove = useCallback((e: PointerEvent) => {
    // تحقق من أن هذا هو الـ pointer الصحيح
    if (activePointerIdRef.current !== e.pointerId) return;
    
    // منع التعارض مع سحب نقاط تحكم السهم - استخدام interactionStore
    if (useInteractionStore.getState().isInternalDrag()) return;
    
    if (isDragging) {
      // تكرار العناصر عند Cmd/Ctrl+Drag
      if (e.metaKey && e.ctrlKey && !hasDuplicated.current) {
        expandedSelectedIds.forEach(id => duplicateElement(id));
        hasDuplicated.current = true;
      }
      
      // ✅ استخدام Event Pipeline لتحويل الدلتا
      const worldDelta = eventPipeline.screenDeltaToWorld(
        e.clientX - dragStart.current.x,
        e.clientY - dragStart.current.y,
        viewport.zoom
      );
      
      // حساب الموضع الجديد المقترح
      let newX = elementStartPos.current.x + worldDelta.x;
      let newY = elementStartPos.current.y + worldDelta.y;
      
      // تقييد الحركة بمحور واحد مع Shift
      if (e.shiftKey) {
        const absX = Math.abs(worldDelta.x);
        const absY = Math.abs(worldDelta.y);
        
        if (absX > absY) {
          newY = elementStartPos.current.y;
        } else {
          newX = elementStartPos.current.x;
        }
      }
      
      // ✅ Fix: تحديد الموقع النهائي
      let finalX = newX;
      let finalY = newY;
      
      // ✅ Sprint 5: تطبيق Snap Engine فقط إذا مفعّل
      if (settings.snapToGrid) {
        const snapResult = snapEngine.snapBounds(
          { x: newX, y: newY, width: bounds.width, height: bounds.height },
          expandedSelectedIds
        );
        
        finalX = snapResult.snappedBounds.x;
        finalY = snapResult.snappedBounds.y;
        
        // إرسال خطوط الإرشاد للعرض
        if (onGuidesChange) {
          onGuidesChange(snapResult.guides);
        }
      } else {
        // مسح الخطوط إذا السناب معطل
        if (onGuidesChange) {
          onGuidesChange([]);
        }
      }
      
      // ✅ Fix: حساب Delta من آخر موقع مُطبَّق (لا من bounds الحالية)
      const finalDeltaX = finalX - lastAppliedPos.current.x;
      const finalDeltaY = finalY - lastAppliedPos.current.y;
      
      if (finalDeltaX !== 0 || finalDeltaY !== 0) {
        moveElements(expandedSelectedIds, finalDeltaX, finalDeltaY);
        // ✅ Fix: تحديث آخر موقع مُطبَّق
        lastAppliedPos.current = { x: finalX, y: finalY };
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
          resizeElements(expandedSelectedIds, scaleX, scaleY, origin);
        }
        
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    }
  }, [isDragging, isResizing, viewport, moveElements, resizeElements, selectedElementIds, bounds, getResizeOrigin, selectedElements, duplicateElement, resizeFrame, onGuidesChange, settings.snapToGrid]);
  
  // ✅ معالجة إنهاء السحب
  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    
    // تحرير Pointer Capture
    if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
    activePointerIdRef.current = null;
    
    // ✅ المرحلة 3: تحرير قفل Selection Coordinator
    selectionCoordinator.releaseEvent();
    
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
    
    // مسح خطوط الإرشاد
    if (onGuidesChange) {
      onGuidesChange([]);
    }
  }, [isDragging, selectedElements, elements, onGuidesChange]);
  
  // ✅ إضافة مستمعي Pointer Events على الـ window عند السحب
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, isResizing, handlePointerMove, handlePointerUp]);
  
  // ✅ المرحلة 3: معالجات الأحداث باستخدام Selection Coordinator
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // ✅ التحقق من Selection Coordinator
    const event = selectionCoordinator.createSelectionEvent('bounding-box-drag', e);
    if (!selectionCoordinator.lockEvent('bounding-box-drag')) {
      return; // حدث آخر له أولوية أعلى
    }
    
    // ✅ Pointer Capture لضمان استلام جميع الأحداث
    if (e.currentTarget instanceof Element) {
      e.currentTarget.setPointerCapture(e.pointerId);
      activePointerIdRef.current = e.pointerId;
    }
    
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    
    // ✅ Fix: استخدام bounds.x و bounds.y لأنها تمثل الموقع الفعلي للمجموعة
    elementStartPos.current = { x: bounds.x, y: bounds.y };
    lastAppliedPos.current = { x: bounds.x, y: bounds.y };
  }, [bounds.x, bounds.y]);
  
  const handleResizeStart = useCallback((e: React.PointerEvent, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    // ✅ المرحلة 3: التحقق من Selection Coordinator
    if (!selectionCoordinator.lockEvent('resize-start')) {
      return; // حدث آخر له أولوية أعلى
    }
    
    // ✅ Pointer Capture
    if (e.currentTarget instanceof Element) {
      e.currentTarget.setPointerCapture(e.pointerId);
      activePointerIdRef.current = e.pointerId;
    }
    
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
  
  // ✅ التحقق مما إذا كانت العناصر مجمّعة
  const isGrouped = useMemo(() => {
    if (selectedElements.length === 0) return false;
    const groupIds = new Set(
      selectedElements
        .map(el => el.metadata?.groupId)
        .filter(Boolean)
    );
    return groupIds.size > 0;
  }, [selectedElements]);
  
  if (activeTool !== 'selection_tool' || selectedElements.length === 0 || isAllArrows) {
    return null;
  }
  
  // ✅ مقبض تغيير الحجم مع Pointer Events
  const ResizeHandle = ({ position, cursor, onStart }: { 
    position: string; 
    cursor: string; 
    onStart: (e: React.PointerEvent) => void 
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
        className="absolute pointer-events-auto group touch-none"
        style={{ ...positionStyles[position], cursor, width: 16, height: 16 }}
        onPointerDown={onStart}
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
        border: isGrouped 
          ? '2px solid hsl(var(--accent-green) / 0.9)' 
          : '2px dashed hsl(var(--accent-blue) / 0.8)',
        borderRadius: '4px',
        // ✅ خلفية خفيفة للمجموعات
        backgroundColor: isGrouped ? 'hsl(var(--accent-green) / 0.05)' : 'transparent',
        // ✅ المرحلة 1: z-index عالي لضمان استقبال أحداث السحب
        zIndex: 9998
      }}
    >
      {/* ✅ مؤشر المجموعة */}
      {isGrouped && (
        <div 
          className="absolute -top-7 right-0 px-2 py-0.5 text-xs font-medium rounded bg-[hsl(var(--accent-green))] text-white flex items-center gap-1"
          style={{ direction: 'rtl' }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          مجموعة
        </div>
      )}
      
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
      
      {/* ✅ منطقة السحب للتحريك - تغطي كامل المنطقة */}
      <div
        ref={dragAreaRef}
        className="absolute inset-0 pointer-events-auto cursor-move touch-none"
        onPointerDown={handleDragStart}
      />
      
      {/* عداد العناصر (إذا أكثر من عنصر وليست مجموعة) */}
      {displayCount > 1 && !isGrouped && (
        <div 
          className="absolute -top-7 left-0 px-2 py-0.5 text-xs font-medium rounded bg-[hsl(var(--accent-blue))] text-white"
          style={{ direction: 'rtl' }}
        >
          {displayCount} عنصر
        </div>
      )}
      
      {/* ✅ زر تحويل إلى إطار (يظهر عند تحديد عناصر غير إطارات) */}
      {displayCount >= 1 && !selectedElements.some(el => el.type === 'frame') && (
        <div className="absolute -top-9 right-0 flex gap-1.5 pointer-events-auto" style={{ direction: 'rtl' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              createFrameFromSelection();
            }}
            className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--ink))] hover:bg-[hsl(var(--ink-80))] text-white rounded-lg text-[11px] font-medium shadow-lg transition-colors"
            title="تحويل إلى إطار"
          >
            <Frame className="w-3.5 h-3.5" />
            <span>إطار</span>
          </button>
        </div>
      )}
    </div>
  );
};
