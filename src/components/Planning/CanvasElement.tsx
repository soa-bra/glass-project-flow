import React, { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement as CanvasElementType } from '@/types/canvas';
import { SmartElementRenderer } from './SmartElements/SmartElementRenderer';
import type { CanvasSmartElement } from '@/types/canvas-elements';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  snapToGrid?: (x: number, y: number) => { x: number; y: number };
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  snapToGrid
}) => {
  const { updateElement, viewport } = useCanvasStore();
  const elementRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  
  // Check if element's layer is visible and unlocked
  const layers = useCanvasStore(state => state.layers);
  const elementLayer = layers.find(l => l.id === element.layerId);
  const isVisible = element.visible !== false && (elementLayer?.visible !== false);
  const isLocked = element.locked || elementLayer?.locked;
  
  if (!isVisible) return null;
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    
    e.stopPropagation();
    
    const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    onSelect(multiSelect);
    
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.position.x,
      elementY: element.position.y
    };
  }, [element, onSelect, isLocked]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || isLocked) return;
    
    const deltaX = (e.clientX - dragStartRef.current.x) / viewport.zoom;
    const deltaY = (e.clientY - dragStartRef.current.y) / viewport.zoom;
    
    let newX = dragStartRef.current.elementX + deltaX;
    let newY = dragStartRef.current.elementY + deltaY;
    
    // Apply snap to grid if enabled
    if (snapToGrid) {
      const snapped = snapToGrid(newX, newY);
      newX = snapped.x;
      newY = snapped.y;
    }
    
    updateElement(element.id, {
      position: { x: newX, y: newY }
    });
  }, [element, updateElement, snapToGrid, viewport, isLocked]);
  
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);
  
  // Add global mouse listeners when dragging
  useEffect(() => {
    if (isDraggingRef.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);
  
  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className={`absolute select-none ${isLocked ? 'cursor-not-allowed' : 'cursor-move'}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        border: isSelected ? '2px solid hsl(var(--accent-green))' : '1px solid hsl(var(--border))',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: element.style?.backgroundColor || '#FFFFFF',
        boxShadow: isSelected 
          ? '0 0 0 2px rgba(61, 190, 139, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        opacity: isLocked ? 0.6 : 1,
        pointerEvents: isLocked ? 'none' : 'auto',
        ...element.style
      }}
    >
      {/* Element Content */}
      {element.type === 'text' && (
        <div className="text-[14px] text-[hsl(var(--ink))]">
          {element.content || 'نص جديد'}
        </div>
      )}
      
      {element.type === 'sticky' && (
        <div className="text-[13px] text-[hsl(var(--ink))] leading-relaxed">
          {element.content || 'ملاحظة لاصقة'}
        </div>
      )}
      
      {element.type === 'shape' && (
        <div className="w-full h-full bg-[hsl(var(--panel))] rounded-lg" />
      )}
      
      {element.type === 'smart' && (
        <SmartElementRenderer 
          element={element as CanvasSmartElement}
          onUpdate={(data) => updateElement(element.id, { data })}
        />
      )}
      
      {/* Selection Handles (shown only when selected) */}
      {isSelected && !isLocked && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-[hsl(var(--accent-green))] rounded-full cursor-nwse-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--accent-green))] rounded-full cursor-nesw-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[hsl(var(--accent-green))] rounded-full cursor-nesw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[hsl(var(--accent-green))] rounded-full cursor-nwse-resize" />
        </>
      )}
    </div>
  );
};

export default CanvasElement;
