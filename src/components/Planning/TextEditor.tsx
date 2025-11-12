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
  
  useEffect(() => {
    // Focus on mount
    if (editorRef.current) {
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
      onUpdate(content);
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
    
    // Cmd/Ctrl+B = Bold
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      const currentWeight = element.style?.fontWeight || 'normal';
      const newWeight = currentWeight === '700' || currentWeight === 'bold' ? 'normal' : '700';
      updateTextStyle(element.id, { fontWeight: newWeight });
      return;
    }
    
    // Cmd/Ctrl+I = Italic
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      const currentStyle = element.style?.fontStyle || 'normal';
      const newStyle = currentStyle === 'italic' ? 'normal' : 'italic';
      updateTextStyle(element.id, { fontStyle: newStyle });
      return;
    }
    
    // Cmd/Ctrl+U = Underline
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault();
      const currentDecor = element.style?.textDecoration || 'none';
      const newDecor = currentDecor === 'underline' ? 'none' : 'underline';
      updateTextStyle(element.id, { textDecoration: newDecor });
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
  
  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        const newContent = e.currentTarget.textContent || '';
        setContent(newContent);
      }}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        onUpdate(content);
        onClose();
      }}
      style={{
        fontFamily: element.style?.fontFamily || 'IBM Plex Sans Arabic',
        fontSize: `${element.style?.fontSize || 14}px`,
        fontWeight: element.style?.fontWeight || 'normal',
        fontStyle: element.style?.fontStyle || 'normal',
        textDecoration: element.style?.textDecoration || 'none',
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
    >
      {content}
    </div>
  );
};
