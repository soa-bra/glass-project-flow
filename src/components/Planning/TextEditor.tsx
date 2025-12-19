import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/stores/canvasStore';
import { FloatingToolbar } from '@/components/ui/floating-toolbar';
import { createPortal } from 'react-dom';
import { sanitizeHTML } from '@/utils/sanitize';

interface TextEditorProps {
  element: CanvasElement;
  onUpdate: (content: string) => void;
  onClose: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate, onClose }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { updateTextStyle, startTyping, stopTyping, updateElement } = useCanvasStore();
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  
  // حساب موضع الـ toolbar - مع هامش كافٍ فوق النص
  const updateToolbarPosition = useCallback(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const toolbarHeight = 50;
      const margin = 16;
      
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - toolbarHeight - margin, // هامش كافٍ فوق النص
      });
      setShowToolbar(true);
    }
  }, []);
  
  // ✅ تعيين المحتوى الأولي مرة واحدة فقط (مع تعقيم XSS)
  useEffect(() => {
    if (editorRef.current && element.content) {
      editorRef.current.innerHTML = sanitizeHTML(element.content);
    }
  }, []); // ✅ مرة واحدة فقط عند mount
  
  // ✅ cursor positioning محسّن + إظهار toolbar
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
        
        // إظهار الـ toolbar
        updateToolbarPosition();
      }, 50);
    }
    
    return () => stopTyping();
  }, [startTyping, stopTyping, updateToolbarPosition]);
  
  // ✅ تطبيق التنسيق على التظليل الداخلي فقط
  const applyFormat = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;
    
    // ✅ التحقق من أن التظليل داخل المحرر
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // لا يوجد تظليل - إعادة الـ focus فقط
      editorRef.current.focus();
      return;
    }
    
    const range = selection.getRangeAt(0);
    
    // ✅ التأكد من أن التظليل داخل المحرر
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      // التظليل خارج المحرر - تجاهل
      editorRef.current.focus();
      return;
    }
    
    // ✅ إعادة الـ focus للمحرر قبل تنفيذ الأمر
    editorRef.current.focus();
    
    document.execCommand(command, false, value);
    
    // حفظ المحتوى بعد التنسيق (مع تعقيم)
    if (editorRef.current) {
      const newContent = sanitizeHTML(editorRef.current.innerHTML);
      onUpdate(newContent);
    }
  }, [onUpdate]);

  const toggleList = useCallback((listType: 'ul' | 'ol') => {
    if (!editorRef.current) return;
    
    // ✅ إعادة الـ focus أولاً
    editorRef.current.focus();
    
    const command = listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(command, false);
    
    // تحديث المحتوى (مع تعقيم)
    onUpdate(sanitizeHTML(editorRef.current.innerHTML));
  }, [onUpdate]);

  const removeFormatting = useCallback(() => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    // إزالة التنسيقات العادية
    document.execCommand('removeFormat', false);
    
    // ✅ التحقق من وجود قوائم قبل إزالتها
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const node = selection.anchorNode;
      const parentList = node?.parentElement?.closest('ul, ol');
      
      if (parentList) {
        const listType = parentList.tagName.toLowerCase();
        if (listType === 'ul') {
          document.execCommand('insertUnorderedList', false);
        } else if (listType === 'ol') {
          document.execCommand('insertOrderedList', false);
        }
      }
    }
    
    onUpdate(sanitizeHTML(editorRef.current.innerHTML));
  }, [onUpdate]);

  const handleAlignChange = useCallback((align: 'left' | 'center' | 'right') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // تحديث الـ style في الـ store
    updateElement(element.id, {
      style: {
        ...element.style,
        textAlign: align,
      }
    });
  }, [element.id, element.style, updateElement]);

  const handleVerticalAlignChange = useCallback((align: 'flex-start' | 'center' | 'flex-end') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    updateElement(element.id, {
      style: {
        ...element.style,
        alignItems: align,
      }
    });
  }, [element.id, element.style, updateElement]);

  const handleDirectionChange = useCallback((direction: 'rtl' | 'ltr') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // تحديث الاتجاه والمحاذاة معاً
    const newAlign = direction === 'rtl' ? 'right' : 'left';
    updateElement(element.id, {
      style: {
        ...element.style,
        direction,
        textAlign: newAlign,
      }
    });
  }, [element.id, element.style, updateElement]);

  const handleFontFamilyChange = useCallback((fontFamily: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    updateElement(element.id, {
      style: {
        ...element.style,
        fontFamily,
      }
    });
  }, [element.id, element.style, updateElement]);

  const handleFontSizeChange = useCallback((fontSize: number) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    updateElement(element.id, {
      style: {
        ...element.style,
        fontSize,
      }
    });
  }, [element.id, element.style, updateElement]);

  const handleColorChange = useCallback((color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    updateElement(element.id, {
      style: {
        ...element.style,
        color,
      }
    });
  }, [element.id, element.style, updateElement]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter = حفظ (لنص السطر فقط، في مربع النص نسمح بأسطر متعددة)
    if (e.key === 'Enter' && !e.shiftKey && element.data?.textType === 'line') {
      // ✅ التحقق من وجود قائمة نشطة
      const selection = window.getSelection();
      const isInsideList = selection?.anchorNode?.parentElement?.closest('ul, ol');
      
      if (isInsideList) {
        // السماح بالسلوك الافتراضي (إضافة عنصر جديد للقائمة)
        return;
      }
      
      e.preventDefault();
      if (editorRef.current) {
        onUpdate(sanitizeHTML(editorRef.current.innerHTML));
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
        toggleList,
        removeFormatting,
        editorRef: editorRef.current
      };
    }
    return () => {
      (window as any).__currentTextEditor = null;
    };
  }); // ✅ بدون [] ليتم تحديثه في كل render
  
  // ✅ التحقق من وجود قوائم في المحتوى
  const hasLists = element.content?.includes('<ul>') || element.content?.includes('<ol>');
  
  const currentAlign = (element.style?.textAlign as 'left' | 'center' | 'right') || 'right';
  
  return (
    <>
      {/* ✅ Wrapper مع Flexbox للمحاذاة العمودية */}
      <div 
        ref={wrapperRef}
        className="flex flex-col"
        style={{ 
          width: '100%', 
          height: '100%',
          // ✅ المحاذاة العمودية باستخدام justifyContent
          justifyContent: element.style?.alignItems === 'center' ? 'center' 
                        : element.style?.alignItems === 'flex-end' ? 'flex-end' 
                        : 'flex-start',
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dir={element.style?.direction || 'rtl'}
          onInput={(e) => {
            const newContent = sanitizeHTML(e.currentTarget.innerHTML || '');
            onUpdate(newContent);
          }}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            // ✅ تحسين: فقط أغلق إذا كان blur خارج TextPanel أو FloatingToolbar
            const relatedTarget = e.relatedTarget as HTMLElement;
            const isClickingPanel = relatedTarget?.closest('[data-text-panel]');
            const isClickingToolbar = relatedTarget?.closest('[data-floating-toolbar]');
            
            if (!isClickingPanel && !isClickingToolbar) {
              if (editorRef.current) {
                onUpdate(sanitizeHTML(editorRef.current.innerHTML));
              }
              setShowToolbar(false);
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
            // ✅ RTL صحيح مع unicodeBidi
            unicodeBidi: 'plaintext',
            WebkitUserModify: 'read-write-plaintext-only',
            width: '100%',
            outline: 'none',
            padding: '8px',
            minHeight: '1em',
            // ✅ السماح بأسطر متعددة عند وجود قوائم
            whiteSpace: hasLists || element.data?.textType === 'box' ? 'pre-wrap' : 'nowrap',
            wordWrap: hasLists || element.data?.textType === 'box' ? 'break-word' : 'normal',
            overflow: element.data?.textType === 'box' ? 'auto' : 'visible'
          }}
        />
      </div>
      
      {/* Floating Toolbar - rendered via portal */}
      {createPortal(
        <FloatingToolbar
          position={toolbarPosition}
          onApplyFormat={applyFormat}
          onToggleList={toggleList}
          onRemoveFormatting={removeFormatting}
          onAlignChange={handleAlignChange}
          onVerticalAlignChange={handleVerticalAlignChange}
          onDirectionChange={handleDirectionChange}
          onFontFamilyChange={handleFontFamilyChange}
          onFontSizeChange={handleFontSizeChange}
          onColorChange={handleColorChange}
          currentAlign={currentAlign}
          currentVerticalAlign={(element.style?.alignItems as 'flex-start' | 'center' | 'flex-end') || 'flex-start'}
          currentDirection={(element.style?.direction as 'rtl' | 'ltr') || 'rtl'}
          currentFontFamily={element.style?.fontFamily || 'IBM Plex Sans Arabic'}
          currentFontSize={element.style?.fontSize || 16}
          currentColor={element.style?.color || '#0B0F12'}
          isVisible={showToolbar}
        />,
        document.body
      )}
    </>
  );
};
