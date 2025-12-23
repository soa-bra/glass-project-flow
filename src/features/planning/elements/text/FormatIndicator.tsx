/**
 * FormatIndicator - مؤشر حالة التنسيق الحالية
 * 
 * ✅ يعرض التنسيقات النشطة (Bold, Italic, Underline)
 * ✅ يتحدث تلقائياً عند تغيير التحديد
 * ✅ تصميم أنيق ومتناسق مع الـ Design System
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

interface FormatIndicatorProps {
  /** Reference للمحرر */
  editorRef: React.RefObject<HTMLDivElement>;
  /** هل يمكن التراجع */
  canUndo?: boolean;
  /** هل يمكن الإعادة */
  canRedo?: boolean;
  /** دالة التراجع */
  onUndo?: () => void;
  /** دالة الإعادة */
  onRedo?: () => void;
  /** عدد خطوات Undo المتاحة */
  undoCount?: number;
  /** عدد خطوات Redo المتاحة */
  redoCount?: number;
  /** الموضع */
  position?: 'top' | 'bottom';
  /** إخفاء المؤشر */
  hidden?: boolean;
}

export const FormatIndicator: React.FC<FormatIndicatorProps> = ({
  editorRef,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  undoCount = 0,
  redoCount = 0,
  position = 'bottom',
  hidden = false
}) => {
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  });

  /**
   * فحص حالة التنسيق الحالية
   */
  const checkFormatState = useCallback(() => {
    if (!editorRef.current) return;
    
    // استخدام queryCommandState لفحص التنسيقات النشطة
    const newState: FormatState = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough')
    };
    
    setFormatState(newState);
  }, [editorRef]);

  /**
   * مستمع لتغيير التحديد
   */
  useEffect(() => {
    const handleSelectionChange = () => {
      // التحقق من أن التحديد داخل المحرر
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        checkFormatState();
      }
    };

    // فحص التنسيق عند تغيير التحديد
    document.addEventListener('selectionchange', handleSelectionChange);
    
    // فحص أولي
    checkFormatState();
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [checkFormatState, editorRef]);

  if (hidden) return null;

  const hasActiveFormats = formatState.bold || formatState.italic || formatState.underline;
  const hasHistory = canUndo || canRedo;

  // إذا لم يكن هناك تنسيقات نشطة ولا سجل، لا نعرض شيء
  if (!hasActiveFormats && !hasHistory) return null;

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-lg",
        "bg-[hsl(var(--background))]/80 backdrop-blur-sm",
        "border border-[hsl(var(--border))]/50",
        "shadow-sm",
        "transition-all duration-200",
        position === 'top' ? 'absolute -top-8 left-0' : 'absolute -bottom-8 left-0'
      )}
      data-format-indicator
    >
      {/* مؤشرات التنسيق النشط */}
      {hasActiveFormats && (
        <div className="flex items-center gap-1 border-l border-[hsl(var(--border))]/50 pl-1.5 ml-1">
          {formatState.bold && (
            <div 
              className="p-1 rounded bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
              title="عريض (Bold)"
            >
              <Bold className="w-3 h-3" />
            </div>
          )}
          {formatState.italic && (
            <div 
              className="p-1 rounded bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
              title="مائل (Italic)"
            >
              <Italic className="w-3 h-3" />
            </div>
          )}
          {formatState.underline && (
            <div 
              className="p-1 rounded bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
              title="تسطير (Underline)"
            >
              <Underline className="w-3 h-3" />
            </div>
          )}
        </div>
      )}

      {/* أزرار Undo/Redo */}
      {hasHistory && (
        <div className="flex items-center gap-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              "p-1 rounded transition-all duration-150",
              canUndo 
                ? "hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] cursor-pointer" 
                : "text-[hsl(var(--muted-foreground))]/40 cursor-not-allowed"
            )}
            title={`تراجع (Ctrl+Z)${undoCount > 0 ? ` - ${undoCount} خطوة` : ''}`}
            data-format-button
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={cn(
              "p-1 rounded transition-all duration-150",
              canRedo 
                ? "hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] cursor-pointer" 
                : "text-[hsl(var(--muted-foreground))]/40 cursor-not-allowed"
            )}
            title={`إعادة (Ctrl+Shift+Z)${redoCount > 0 ? ` - ${redoCount} خطوة` : ''}`}
            data-format-button
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FormatIndicator;
