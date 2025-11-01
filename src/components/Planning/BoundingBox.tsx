import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

export const BoundingBox: React.FC = () => {
  // ✅ جميع الـ Hooks أولاً (قبل أي return)
  const { selectedElementIds, elements, viewport, moveElements, resizeElements } = useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // حساب حدود الإطار المحيط بشكل آمن
  const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
  
  const bounds = selectedElements.length > 0 ? {
    minX: Math.min(...selectedElements.map(e => e.position.x)),
    minY: Math.min(...selectedElements.map(e => e.position.y)),
    maxX: Math.max(...selectedElements.map(e => e.position.x + e.size.width)),
    maxY: Math.max(...selectedElements.map(e => e.position.y + e.size.height))
  } : { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const centerX = bounds.minX + width / 2;
  const centerY = bounds.minY + height / 2;
  
  // حساب نقطة المرجع بناءً على المقبض المسحوب (النقطة المقابلة تكون ثابتة)
  const getResizeOrigin = (handle: string): { x: number; y: number } => {
    const originMap: Record<string, { x: number; y: number }> = {
      'nw': { x: bounds.maxX, y: bounds.maxY }, // عكس: جنوب شرق
      'ne': { x: bounds.minX, y: bounds.maxY }, // عكس: جنوب غرب
      'sw': { x: bounds.maxX, y: bounds.minY }, // عكس: شمال شرق
      'se': { x: bounds.minX, y: bounds.minY }, // عكس: شمال غرب
      'n': { x: centerX, y: bounds.maxY },      // عكس: جنوب
      's': { x: centerX, y: bounds.minY },      // عكس: شمال
      'w': { x: bounds.maxX, y: centerY },      // عكس: شرق
      'e': { x: bounds.minX, y: centerY }       // عكس: غرب
    };
    return originMap[handle] || { x: centerX, y: centerY };
  };
  
  // ✅ useEffect قبل أي return شرطي
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.current.x) / viewport.zoom;
        const dy = (e.clientY - dragStart.current.y) / viewport.zoom;
        if (dx !== 0 || dy !== 0) {
          moveElements(selectedElementIds, dx, dy);
          dragStart.current = { x: e.clientX, y: e.clientY };
        }
      } else if (isResizing) {
        const dx = (e.clientX - dragStart.current.x) / viewport.zoom;
        const dy = (e.clientY - dragStart.current.y) / viewport.zoom;
        
        let scaleX = 1;
        let scaleY = 1;
        const origin = getResizeOrigin(isResizing);
        
        if (isResizing.includes('e')) {
          scaleX = 1 + dx / width;
        }
        if (isResizing.includes('w')) {
          scaleX = 1 - dx / width;
        }
        if (isResizing.includes('s')) {
          scaleY = 1 + dy / height;
        }
        if (isResizing.includes('n')) {
          scaleY = 1 - dy / height;
        }
        
        if (scaleX !== 1 || scaleY !== 1) {
          resizeElements(selectedElementIds, scaleX, scaleY, origin);
          dragStart.current = { x: e.clientX, y: e.clientY };
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };
    
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, viewport, moveElements, resizeElements, selectedElementIds, width, height, centerX, centerY, bounds]);
  
  // معالجات الأحداث
  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleResizeStart = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    setIsResizing(corner);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  
  // ✅ Return الشرطي في النهاية بعد كل الـ Hooks
  if (selectedElements.length === 0) return null;
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: bounds.minX,
        top: bounds.minY,
        width,
        height,
        border: '2px dashed hsl(var(--accent-blue) / 0.8)',
        borderRadius: '4px'
      }}
    >
      {/* مقابض تغيير الحجم في الزوايا */}
      <div 
        className="absolute -top-2 -left-2 pointer-events-auto cursor-nwse-resize group"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      <div 
        className="absolute -top-2 -right-2 pointer-events-auto cursor-nesw-resize group"
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      <div 
        className="absolute -bottom-2 -left-2 pointer-events-auto cursor-nesw-resize group"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      <div 
        className="absolute -bottom-2 -right-2 pointer-events-auto cursor-nwse-resize group"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      
      {/* مقابض تغيير الحجم في المنتصف */}
      <div 
        className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-auto cursor-ns-resize group"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      <div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto cursor-ns-resize group"
        onMouseDown={(e) => handleResizeStart(e, 's')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      <div 
        className="absolute top-1/2 -translate-y-1/2 -left-2 pointer-events-auto cursor-ew-resize group"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      <div 
        className="absolute top-1/2 -translate-y-1/2 -right-2 pointer-events-auto cursor-ew-resize group"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
        style={{ width: '16px', height: '16px' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border-[1.5px] border-[hsl(var(--accent-blue))] rounded-full group-hover:scale-150 transition-transform" />
      </div>
      
      {/* منطقة السحب للتحريك */}
      <div
        className="absolute inset-4 pointer-events-auto cursor-move"
        onMouseDown={handleDragStart}
      />
    </div>
  );
};
