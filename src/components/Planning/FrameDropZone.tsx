/**
 * FrameDropZone - مكون منطقة الإفلات للإطار
 * يوفر تأثيرات بصرية أثناء السحب والإفلات
 */

import React from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { cn } from '@/lib/utils';

interface FrameDropZoneProps {
  frameId: string;
  title?: string;
  childrenCount: number;
  onTitleDoubleClick?: (e: React.MouseEvent) => void;
  isEditingTitle?: boolean;
  editedTitle?: string;
  onTitleChange?: (value: string) => void;
  onTitleSave?: () => void;
  onTitleKeyDown?: (e: React.KeyboardEvent) => void;
  titleInputRef?: React.RefObject<HTMLInputElement>;
}

export const FrameDropZone: React.FC<FrameDropZoneProps> = ({
  frameId,
  title,
  childrenCount,
  onTitleDoubleClick,
  isEditingTitle,
  editedTitle,
  onTitleChange,
  onTitleSave,
  onTitleKeyDown,
  titleInputRef
}) => {
  const hoveredFrameId = useCanvasStore(state => state.hoveredFrameId);
  const draggedElementIds = useCanvasStore(state => state.draggedElementIds);
  
  const isHovered = hoveredFrameId === frameId;
  const isDragging = draggedElementIds.length > 0;
  const isDropTarget = isHovered && isDragging;
  
  return (
    <div 
      className={cn(
        "relative w-full h-full transition-all duration-200 rounded-lg",
        // تأثير الإبراز عند السحب فوق الإطار
        isDropTarget && "ring-2 ring-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/10"
      )}
      style={{
        pointerEvents: 'auto'
      }}
    >
      {/* عنوان الإطار */}
      {(title || isEditingTitle) && (
        <div 
          className={cn(
            "absolute top-2 right-2 px-2 py-1 backdrop-blur-sm rounded-lg text-[11px] font-medium shadow-sm border pointer-events-auto transition-colors duration-200",
            isDropTarget 
              ? "bg-[hsl(var(--accent-green))]/20 border-[hsl(var(--accent-green))] text-[hsl(var(--accent-green))]"
              : "bg-white/90 border-[hsl(var(--border))] text-[hsl(var(--ink))]"
          )}
          onDoubleClick={onTitleDoubleClick}
        >
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => onTitleChange?.(e.target.value)}
              onBlur={onTitleSave}
              onKeyDown={onTitleKeyDown}
              className="outline-none bg-transparent min-w-[80px] text-[11px]"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="cursor-text">{title}</span>
          )}
        </div>
      )}
      
      {/* رسالة الإفلات */}
      {isDropTarget && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="px-3 py-1.5 bg-[hsl(var(--accent-green))] text-white rounded-full text-sm font-medium animate-pulse shadow-lg">
            إفلات لإضافة {draggedElementIds.length > 1 ? `${draggedElementIds.length} عناصر` : 'العنصر'}
          </span>
        </div>
      )}
      
      {/* عداد العناصر */}
      {childrenCount > 0 && !isDropTarget && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-[hsl(var(--ink))]/90 backdrop-blur-sm text-white rounded-lg text-[10px] font-medium shadow-sm pointer-events-none">
          {childrenCount} عنصر
        </div>
      )}
      
      {/* نص الإطار الفارغ */}
      {childrenCount === 0 && !isDropTarget && (
        <div className="absolute inset-0 flex items-center justify-center text-[hsl(var(--ink-30))] text-[11px] pointer-events-none">
          إطار فارغ
        </div>
      )}
    </div>
  );
};

export default FrameDropZone;
