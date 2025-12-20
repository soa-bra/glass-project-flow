import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CanvasElement } from '@/types/canvas';

interface StickyNoteEditorProps {
  element: CanvasElement;
  onUpdate: (text: string) => void;
  onClose: () => void;
}

/**
 * محرر نص الستيكي نوت - يظهر عند النقر المزدوج
 */
export const StickyNoteEditor: React.FC<StickyNoteEditorProps> = ({
  element,
  onUpdate,
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
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="اكتب ملاحظتك..."
        dir="rtl"
        className="w-full h-full bg-transparent resize-none outline-none text-center"
        style={{ 
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          fontSize: Math.max(12, Math.min(element.size.width, element.size.height) * 0.1),
          color: '#0B0F12',
          lineHeight: 1.5
        }}
      />
    </div>
  );
};

export default StickyNoteEditor;
