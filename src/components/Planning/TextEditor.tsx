import React, { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/stores/canvasStore';

interface TextEditorProps {
  element: CanvasElement;
  onUpdate: (content: string) => void;
  onClose: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate, onClose }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { updateTextStyle, startTyping, stopTyping } = useCanvasStore();
  
  // ✅ تعيين المحتوى الأولي مرة واحدة فقط
  useEffect(() => {
    if (editorRef.current && element.content) {
      editorRef.current.innerHTML = element.content;
    }
  }, []); // ✅ مرة واحدة فقط عند mount
  
  // ✅ cursor positioning محسّن
  useEffect(() => {
    startTyping();
    
    if (editorRef.current) {
      setTimeout(() => {
        const editor = editorRef.current;
        if (!editor) return;
        
        editor.focus();
        
        // ✅ إنشاء text node فارغ إذا لزم الأمر
        if (editor.childNodes.length === 0) {
          editor.appendChild(document.createTextNode(''));
        }
        
        const range = document.createRange();
        const selection = window.getSelection();
        
        // ✅ وضع المؤشر في النهاية
        range.selectNodeContents(editor);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }, 50);
    }
    
    return () => stopTyping();
  }, [startTyping, stopTyping]);
  
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // حفظ المحتوى بعد التنسيق
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onUpdate(newContent);
    }
  };

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
      const editor = editorRef.current;
      
      // تطبيق الـ styles مباشرة
      Object.assign(editor.style, {
        fontFamily: element.style.fontFamily || 'IBM Plex Sans Arabic',
        fontSize: `${element.style.fontSize || 16}px`,
        fontWeight: element.style.fontWeight || 'normal',
        color: element.style.color || '#0B0F12',
        textAlign: element.style.textAlign || 'right',
        direction: element.style.direction || 'rtl'
      });
      
      // تحديث dir attribute
      editor.setAttribute('dir', element.style.direction || 'rtl');
      
      // ✅ إعادة حساب المحاذاة الأفقية والرأسية
      editor.style.alignItems = element.style.textAlign === 'center' ? 'center' : 
                                 element.style.textAlign === 'left' ? 'flex-start' : 'flex-end';
      editor.style.justifyContent = element.style.alignItems || 'flex-start';
    }
  }, [element.style?.fontFamily, element.style?.fontSize, element.style?.fontWeight, 
      element.style?.color, element.style?.textAlign, element.style?.direction, 
      element.style?.alignItems]);
  
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
      dir={element.style?.direction || 'rtl'}
      onInput={(e) => {
        const newContent = e.currentTarget.innerHTML || '';
        onUpdate(newContent);
      }}
      onKeyDown={handleKeyDown}
      onBlur={(e) => {
        // ✅ تحسين: فقط أغلق إذا كان blur خارج TextPanel
        const relatedTarget = e.relatedTarget as HTMLElement;
        const isClickingPanel = relatedTarget?.closest('[data-text-panel]');
        
        if (!isClickingPanel) {
          if (editorRef.current) {
            onUpdate(editorRef.current.innerHTML);
          }
          stopTyping();
          onClose();
        }
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
        // ✅ المحاذاة الأفقية بناءً على textAlign
        alignItems: element.style?.textAlign === 'center' ? 'center' : 
                    element.style?.textAlign === 'left' ? 'flex-start' : 'flex-end',
        // ✅ المحاذاة الرأسية بناءً على alignItems
        justifyContent: element.style?.alignItems || 'flex-start'
      }}
    />
  );
};
