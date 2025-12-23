/**
 * useCanvasPaste - Hook للصق النص من الحافظة الخارجية على الكانفس
 * 
 * ✅ يستمع لأحداث paste على مستوى window
 * ✅ ينشئ عنصر نص جديد في موقع المؤشر الأخير أو وسط الـ viewport
 * ✅ يطبق RTL/LTR تلقائياً بناءً على محتوى النص
 * ✅ يدخل وضع التحرير فوراً بعد الإنشاء
 */

import { useEffect, useCallback, useRef } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { 
  detectTextDirection, 
  getAlignmentForDirection, 
  prepareTextForPaste,
  isTextEmpty 
} from '@/utils/textDirection';

interface UseCanvasPasteOptions {
  /** موقع المؤشر الأخير على الكانفس */
  lastPointerPosition: React.MutableRefObject<{ x: number; y: number } | null>;
  /** حدود الـ viewport الحالية */
  viewportBounds: { x: number; y: number; width: number; height: number };
  /** هل الـ hook مفعّل */
  enabled?: boolean;
}

export function useCanvasPaste({
  lastPointerPosition,
  viewportBounds,
  enabled = true
}: UseCanvasPasteOptions) {
  const isHandlingPaste = useRef(false);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    // ✅ تجاهل إذا كان التركيز داخل محرر نص أو حقل إدخال
    const activeElement = document.activeElement;
    if (activeElement) {
      const tagName = activeElement.tagName.toLowerCase();
      const isEditable = 
        tagName === 'input' || 
        tagName === 'textarea' || 
        (activeElement as HTMLElement).isContentEditable ||
        activeElement.closest('[contenteditable="true"]');
      
      if (isEditable) {
        // ✅ السماح باللصق داخل المحرر الحالي
        return;
      }
    }

    // ✅ تجاهل إذا كان هناك محرر نص نشط
    const { editingTextId } = useCanvasStore.getState();
    if (editingTextId) {
      return;
    }

    // ✅ منع التكرار
    if (isHandlingPaste.current) return;
    isHandlingPaste.current = true;

    try {
      // قراءة النص من الحافظة
      const clipboardData = e.clipboardData;
      if (!clipboardData) {
        isHandlingPaste.current = false;
        return;
      }

      const text = clipboardData.getData('text/plain');
      
      // تجاهل إذا كان النص فارغاً
      if (isTextEmpty(text)) {
        isHandlingPaste.current = false;
        return;
      }

      e.preventDefault();

      // ✅ تنظيف النص من علامات الاتجاه الغريبة
      const cleanedText = prepareTextForPaste(text);
      
      // ✅ تحديد اتجاه النص
      const direction = detectTextDirection(cleanedText);
      const alignment = getAlignmentForDirection(direction);

      // ✅ تحديد موضع العنصر الجديد
      let position: { x: number; y: number };
      
      if (lastPointerPosition.current) {
        // استخدام آخر موقع للمؤشر
        position = {
          x: lastPointerPosition.current.x,
          y: lastPointerPosition.current.y
        };
      } else {
        // استخدام وسط الـ viewport
        position = {
          x: viewportBounds.x + viewportBounds.width / 2 - 100,
          y: viewportBounds.y + viewportBounds.height / 2 - 20
        };
      }

      // ✅ تحديد إذا كان النص متعدد الأسطر
      const isMultiLine = cleanedText.includes('\n');
      const textType = isMultiLine ? 'box' : 'line';

      // ✅ حساب الأبعاد بناءً على المحتوى
      const lines = cleanedText.split('\n');
      const maxLineLength = Math.max(...lines.map(l => l.length));
      const estimatedWidth = Math.min(Math.max(200, maxLineLength * 10), 500);
      const estimatedHeight = isMultiLine ? Math.min(lines.length * 24 + 16, 300) : 40;

      // ✅ إنشاء عنصر النص الجديد
      const { addText, startEditingText, selectElement } = useCanvasStore.getState();
      
      const newElementId = addText({
        position,
        size: { width: estimatedWidth, height: estimatedHeight },
        content: cleanedText,
        textType,
        direction,
        alignment,
        style: {
          direction,
          textAlign: alignment,
          fontFamily: 'IBM Plex Sans Arabic',
          fontSize: 14,
          color: '#0B0F12'
        },
        data: {
          textType
        }
      });

      // ✅ تحديد العنصر والدخول في وضع التحرير
      if (newElementId) {
        selectElement(newElementId, false);
        // تأخير بسيط لضمان إضافة العنصر للـ DOM
        setTimeout(() => {
          startEditingText(newElementId);
        }, 50);
      }
    } catch (error) {
      console.error('Error handling paste:', error);
    } finally {
      // إعادة تعيين العلم بعد فترة قصيرة
      setTimeout(() => {
        isHandlingPaste.current = false;
      }, 100);
    }
  }, [lastPointerPosition, viewportBounds]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('paste', handlePaste);
    
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste, enabled]);
}

export default useCanvasPaste;
