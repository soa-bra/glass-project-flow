import React, { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/stores/canvasStore';

interface TextEditorProps {
  element: CanvasElement;
  onUpdate: (content: string) => void;
  onClose: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate, onClose }) => {
  const [content, setContent] = useState(element.content || '');
  const editorRef = useRef<HTMLDivElement>(null);
  const { updateTextStyle } = useCanvasStore();
  
  // تطبيق التنسيق على النص المظلل
  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onUpdate(newContent);
    }
  };
  
  useEffect(() => {
    // Focus on mount وتحميل المحتوى
    if (editorRef.current) {
      editorRef.current.innerHTML = element.content || '';
      editorRef.current.focus();
      
      // ضع المؤشر في نهاية النص
      const range = document.createRange();
      const selection = window.getSelection();
      if (editorRef.current.childNodes.length > 0) {
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter = حفظ (لنص السطر فقط، في مربع النص نسمح بأسطر متعددة)
    if (e.key === 'Enter' && !e.shiftKey && element.data?.textType === 'line') {
      e.preventDefault();
      if (editorRef.current) {
        onUpdate(editorRef.current.innerHTML);
      }
      onClose();
      return;
    }
    
    // Shift+Enter = سطر جديد في مربع النص
    if (e.key === 'Enter' && e.shiftKey && element.data?.textType === 'box') {
      // السماح بالسلوك الافتراضي (إضافة سطر جديد)
      return;
    }
    
    // Escape = إلغاء
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    
    // Cmd/Ctrl+B = Bold على النص المظلل
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      applyFormatting('bold');
      return;
    }
    
    // Cmd/Ctrl+I = Italic على النص المظلل
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      applyFormatting('italic');
      return;
    }
    
    // Cmd/Ctrl+U = Underline على النص المظلل
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault();
      applyFormatting('underline');
      return;
    }
    
    // Cmd/Ctrl+A = تحديد الكل
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault();
      const range = document.createRange();
      const selection = window.getSelection();
      if (editorRef.current) {
        range.selectNodeContents(editorRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      return;
    }
  };
  
  // مشاركة دالة applyFormatting مع TextPanel عبر window
  useEffect(() => {
    (window as any).applyTextFormatting = applyFormatting;
    return () => {
      delete (window as any).applyTextFormatting;
    };
  }, []);

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        const newContent = e.currentTarget.innerHTML;
        setContent(newContent);
      }}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        if (editorRef.current) {
          onUpdate(editorRef.current.innerHTML);
        }
        onClose();
      }}
      style={{
        fontFamily: element.style?.fontFamily || 'IBM Plex Sans Arabic',
        fontSize: `${element.style?.fontSize || 14}px`,
        color: element.style?.color || '#0B0F12',
        textAlign: (element.style?.textAlign as any) || 'right',
        width: '100%',
        height: '100%',
        outline: 'none',
        padding: '8px',
        minHeight: '1em',
        whiteSpace: element.data?.textType === 'box' ? 'pre-wrap' : 'nowrap',
        wordWrap: element.data?.textType === 'box' ? 'break-word' : 'normal',
        overflow: element.data?.textType === 'box' ? 'auto' : 'visible'
      }}
    />
  );
};
