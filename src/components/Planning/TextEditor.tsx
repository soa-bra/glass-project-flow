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
  const { updateTextStyle, startTyping, stopTyping } = useCanvasStore();
  
  useEffect(() => {
    startTyping(); // ✅ تفعيل وضع الكتابة
    
    // Focus on mount with proper cursor positioning for RTL/LTR
    if (editorRef.current) {
      // تأخير بسيط لضمان تحميل المحتوى
      setTimeout(() => {
        editorRef.current?.focus();
        
        // ✅ منطق محسّن لوضع المؤشر في النهاية (يعمل مع RTL/LTR)
        const range = document.createRange();
        const selection = window.getSelection();
        
        if (editorRef.current) {
          // استخدام selectNodeContents لتحديد كل المحتوى ثم collapse إلى النهاية
          range.selectNodeContents(editorRef.current);
          range.collapse(false); // false = في النهاية
          
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 50); // ✅ زيادة التأخير من 10ms إلى 50ms لضمان تحميل المحتوى
    }
    
    return () => {
      stopTyping(); // ✅ إيقاف وضع الكتابة عند unmount
    };
  }, [startTyping, stopTyping]);
  
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // حفظ المحتوى بعد التنسيق
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onUpdate(newContent);
    }
  };

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
      applyFormat('bold');
      return;
    }
    
    // Cmd/Ctrl+I = Italic
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      applyFormat('italic');
      return;
    }
    
    // Cmd/Ctrl+U = Underline
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault();
      applyFormat('underline');
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

  // ✅ تحديث فوري للـ style عند تغييره من TextPanel
  useEffect(() => {
    if (editorRef.current && element.style) {
      const currentRef = editorRef.current;
      
      // تطبيق التغييرات الفورية على المحرر
      currentRef.style.fontFamily = element.style.fontFamily || 'IBM Plex Sans Arabic';
      currentRef.style.fontSize = `${element.style.fontSize || 16}px`;
      currentRef.style.fontWeight = element.style.fontWeight || 'normal';
      currentRef.style.color = element.style.color || '#0B0F12';
      currentRef.style.textAlign = element.style.textAlign || 'right';
      currentRef.style.direction = element.style.direction || 'rtl';
      
      // تحديث HTML attribute أيضاً
      currentRef.setAttribute('dir', element.style.direction || 'rtl');
      
      // تطبيق المحاذاة الرأسية
      if (element.style.alignItems) {
        currentRef.style.alignItems = element.style.alignItems;
      }
    }
  }, [element.style]);
  
  // تصدير دالة applyFormat للوصول إليها من TextPanel
  useEffect(() => {
    if (editorRef.current) {
      (window as any).__currentTextEditor = {
        applyFormat,
        editorRef: editorRef.current
      };
    }
    return () => {
      (window as any).__currentTextEditor = null;
    };
  }, []);
  
  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      dir={element.style?.direction || 'rtl'} // ✅ إضافة HTML attribute
      onInput={(e) => {
        const newContent = e.currentTarget.innerHTML || '';
        setContent(newContent);
      }}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        onUpdate(content);
        stopTyping(); // ✅ إيقاف عند blur أيضاً
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
        direction: (element.style?.direction as any) || 'rtl',
        unicodeBidi: 'plaintext', // ✅ إضافة unicode-bidi لدقة RTL
        width: '100%',
        height: '100%',
        outline: 'none',
        padding: '8px',
        minHeight: '1em',
        whiteSpace: element.data?.textType === 'box' ? 'pre-wrap' : 'nowrap',
        wordWrap: element.data?.textType === 'box' ? 'break-word' : 'normal',
        overflow: element.data?.textType === 'box' ? 'auto' : 'visible',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: element.style?.alignItems || 'flex-start'
      }}
    >
      {content ? <span dangerouslySetInnerHTML={{ __html: content }} /> : ''}
    </div>
  );
};
