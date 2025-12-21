import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CanvasElement } from '@/types/canvas';

interface StickyNoteEditorProps {
  element: CanvasElement;
  onUpdate: (text: string) => void;
  onUpdateSize?: (newHeight: number) => void;
  onClose: () => void;
}

/**
 * محرر نص الستيكي نوت - يظهر عند النقر المزدوج
 */
export const StickyNoteEditor: React.FC<StickyNoteEditorProps> = ({
  element,
  onUpdate,
  onUpdateSize,
  onClose
}) => {
  const initialText = element.stickyText || element.data?.stickyText || '';
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus تلقائي عند الفتح
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  // حساب وتحديث الحجم عند تغيير النص
  const calculateNewHeight = useCallback((newText: string) => {
    const fontSize = Math.max(12, Math.min(element.size.width, element.size.height) * 0.08);
    const paddingInner = 16;
    const availableWidth = element.size.width - (paddingInner * 2);
    const charsPerLine = Math.floor(availableWidth / (fontSize * 0.6));
    const estimatedLines = Math.ceil(newText.length / Math.max(charsPerLine, 1));
    const lineHeight = fontSize * 1.6;
    const estimatedTextHeight = estimatedLines * lineHeight + (paddingInner * 2) + 16;
    
    return Math.max(element.size.height, estimatedTextHeight);
  }, [element.size]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // تحديث الحجم تلقائياً
    if (onUpdateSize) {
      const newHeight = calculateNewHeight(newText);
      if (newHeight > element.size.height) {
        onUpdateSize(newHeight);
      }
    }
  }, [calculateNewHeight, element.size.height, onUpdateSize]);

  // حفظ عند فقدان التركيز
  const handleBlur = useCallback(() => {
    onUpdate(text);
    onClose();
  }, [text, onUpdate, onClose]);

  // حفظ عند الضغط على Escape أو Ctrl+Enter
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onUpdate(text);
      onClose();
    }
    // منع انتشار الحدث لتجنب اختصارات الكانفس
    e.stopPropagation();
  }, [text, onUpdate, onClose]);

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="اكتب ملاحظتك..."
        dir="rtl"
        className="w-full h-full bg-transparent resize-none outline-none text-center"
        style={{ 
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          fontSize: Math.max(12, Math.min(element.size.width, element.size.height) * 0.08),
          color: '#0B0F12',
          lineHeight: 1.6
        }}
      />
    </div>
  );
};

export default StickyNoteEditor;
