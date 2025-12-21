/**
 * FrameDropZone - مكون منطقة الإفلات للإطار
 * يوفر تأثيرات بصرية أثناء السحب والإفلات
 * 
 * ✅ التحديثات:
 * - خلفية بيضاء وحد أسود خفيف
 * - عنوان الإطار وعداد العناصر خارج الإطار (فوقه)
 * - تأثير وهج أسود ناعم عند السحب
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
  
  // ✅ الحصول على عدد الأطفال الفعلي من الـ store مباشرة (تحديث لحظي)
  const elements = useCanvasStore(state => state.elements);
  const frame = elements.find(el => el.id === frameId);
  const actualChildrenCount = (frame as any)?.children?.length || 0;
  
  const isHovered = hoveredFrameId === frameId;
  const isDragging = draggedElementIds.length > 0;
  const isDropTarget = isHovered && isDragging;
  
  return (
    <>
      {/* ✅ عنوان الإطار وعداد العناصر - خارج الإطار (فوقه) */}
      {(title || isEditingTitle || actualChildrenCount > 0) && (
        <div 
          className="absolute pointer-events-auto flex items-center gap-2"
          style={{
            top: -28,
            right: 0,
            zIndex: 10
          }}
        >
          <div 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200",
              "bg-white border border-[hsl(var(--border))] shadow-sm",
              isDropTarget && "border-[hsl(var(--ink))] shadow-md"
            )}
          >
            {/* عنوان الإطار */}
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => onTitleChange?.(e.target.value)}
                onBlur={onTitleSave}
                onKeyDown={onTitleKeyDown}
                className="outline-none bg-transparent min-w-[80px] text-[11px] text-[hsl(var(--ink))]"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                className="cursor-text text-[hsl(var(--ink))]"
                onDoubleClick={onTitleDoubleClick}
              >
                {title || 'إطار'}
              </span>
            )}
            
            {/* فاصل */}
            {actualChildrenCount > 0 && (
              <span className="text-[hsl(var(--ink-30))]">|</span>
            )}
            
            {/* عداد العناصر */}
            {actualChildrenCount > 0 && (
              <span className="text-[hsl(var(--ink-60))]">
                {actualChildrenCount} عنصر
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* ✅ الإطار نفسه - خلفية بيضاء وحد أسود خفيف */}
      <div 
        className={cn(
          "relative w-full h-full transition-all duration-200 rounded-lg",
          "bg-white border border-[hsl(var(--ink-30))]",
          // ✅ تأثير وهج أسود ناعم عند السحب داخل الإطار
          isDropTarget && "shadow-[0_0_20px_rgba(0,0,0,0.15)] border-[hsl(var(--ink))]"
        )}
        style={{
          pointerEvents: 'auto'
        }}
      >
        {/* ✅ رسالة الإفلات */}
        {isDropTarget && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="px-4 py-2 bg-[hsl(var(--ink))] text-white rounded-full text-sm font-medium shadow-lg">
              إفلات لإضافة {draggedElementIds.length > 1 ? `${draggedElementIds.length} عناصر` : 'العنصر'}
            </span>
          </div>
        )}
        
        {/* ✅ نص الإطار الفارغ */}
        {actualChildrenCount === 0 && !isDropTarget && (
          <div className="absolute inset-0 flex items-center justify-center text-[hsl(var(--ink-30))] text-[11px] pointer-events-none">
            إطار فارغ
          </div>
        )}
      </div>
    </>
  );
};

export default FrameDropZone;
