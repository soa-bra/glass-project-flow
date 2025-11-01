import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { RotateCw } from 'lucide-react';

export const BoundingBox: React.FC = () => {
  // ✅ جميع الـ Hooks أولاً (قبل أي return)
  const { selectedElementIds, elements, viewport, moveElements, resizeElements, rotateElements } = useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // حساب حدود الإطار المحيط
  const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
  
  // ✅ Return الشرطي بعد كل الـ Hooks
  if (selectedElements.length === 0) return null;
  
  const bounds = {
    minX: Math.min(...selectedElements.map(e => e.position.x)),
    minY: Math.min(...selectedElements.map(e => e.position.y)),
    maxX: Math.max(...selectedElements.map(e => e.position.x + e.size.width)),
    maxY: Math.max(...selectedElements.map(e => e.position.y + e.size.height))
  };
  
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const centerX = bounds.minX + width / 2;
  const centerY = bounds.minY + height / 2;
  
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
  
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  
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
        const origin = { x: centerX, y: centerY };
        
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
      } else if (isRotating) {
        const dx = e.clientX - dragStart.current.x;
        const angle = dx * 0.5; // 0.5 درجة لكل بكسل
        if (angle !== 0) {
          rotateElements(selectedElementIds, angle, { x: centerX, y: centerY });
          dragStart.current = { x: e.clientX, y: e.clientY };
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
      setIsRotating(false);
    };
    
    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, viewport, moveElements, resizeElements, rotateElements, selectedElementIds, width, height, centerX, centerY]);
  
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
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full -top-1.5 -left-1.5 pointer-events-auto cursor-nwse-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full -top-1.5 -right-1.5 pointer-events-auto cursor-nesw-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full -bottom-1.5 -left-1.5 pointer-events-auto cursor-nesw-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full -bottom-1.5 -right-1.5 pointer-events-auto cursor-nwse-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
      
      {/* مقابض تغيير الحجم في المنتصف */}
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full -top-1.5 left-1/2 -translate-x-1/2 pointer-events-auto cursor-ns-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full -bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-auto cursor-ns-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full top-1/2 -translate-y-1/2 -left-1.5 pointer-events-auto cursor-ew-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full top-1/2 -translate-y-1/2 -right-1.5 pointer-events-auto cursor-ew-resize hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      
      {/* مقبض التدوير في الأعلى */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button 
          className="w-8 h-8 bg-white border-2 border-[hsl(var(--accent-blue))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--panel))] cursor-grab active:cursor-grabbing transition-colors"
          onMouseDown={handleRotateStart}
        >
          <RotateCw size={14} className="text-[hsl(var(--accent-blue))]" />
        </button>
      </div>
      
      {/* منطقة السحب للتحريك */}
      <div
        className="absolute inset-0 pointer-events-auto cursor-move"
        onMouseDown={handleDragStart}
      />
    </div>
  );
};
