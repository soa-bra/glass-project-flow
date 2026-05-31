/**
 * useCanvasPaste - Hook للصق النص من الحافظة الخارجية على الكانفس
 *
 * ✅ يستمع لأحداث paste على مستوى window
 * ✅ ينشئ عنصر نص جديد في موقع المؤشر الأخير أو وسط الـ viewport
 * ✅ يطبق RTL/LTR تلقائياً بناءً على محتوى النص
 * ✅ يدخل وضع التحرير فوراً بعد الإنشاء
 * ✅ يمنع اللصق خارج سياق الكانفس وينظف الـ timeouts
 */

import { useEffect, useCallback, useRef } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import {
  detectTextDirection,
  getAlignmentForDirection,
  prepareTextForPaste,
  isTextEmpty,
} from '@/utils/textDirection';

interface UseCanvasPasteOptions {
  /** موقع المؤشر الأخير على الكانفس */
  lastPointerPosition: React.MutableRefObject<{ x: number; y: number } | null>;
  /** حدود الـ viewport الحالية */
  viewportBounds: { x: number; y: number; width: number; height: number };
  /** هل الـ hook مفعّل */
  enabled?: boolean;
}

const START_EDITING_DELAY_MS = 50;
const RESET_HANDLING_DELAY_MS = 100;

function getCanvasContainer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector('[data-canvas-container="true"]') as HTMLElement | null;
}

function isEditableElement(element: HTMLElement): boolean {
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    element.isContentEditable ||
    !!element.closest('[contenteditable="true"]')
  );
}

function isCanvasPasteContext(container: HTMLElement | null, activeElement: HTMLElement | null): boolean {
  if (!container) return false;
  if (!activeElement) return true;

  if (activeElement === document.body || activeElement === document.documentElement) {
    return true;
  }

  return container.contains(activeElement) || !!activeElement.closest('[data-canvas-container="true"]');
}

export function useCanvasPaste({
  lastPointerPosition,
  viewportBounds,
  enabled = true,
}: UseCanvasPasteOptions) {
  const isHandlingPaste = useRef(false);
  const startEditingTimeoutRef = useRef<number | null>(null);
  const resetHandlingTimeoutRef = useRef<number | null>(null);

  const clearTrackedTimeouts = useCallback(() => {
    if (startEditingTimeoutRef.current) {
      window.clearTimeout(startEditingTimeoutRef.current);
      startEditingTimeoutRef.current = null;
    }

    if (resetHandlingTimeoutRef.current) {
      window.clearTimeout(resetHandlingTimeoutRef.current);
      resetHandlingTimeoutRef.current = null;
    }
  }, []);

  const scheduleHandlingReset = useCallback(() => {
    if (resetHandlingTimeoutRef.current) {
      window.clearTimeout(resetHandlingTimeoutRef.current);
    }

    resetHandlingTimeoutRef.current = window.setTimeout(() => {
      isHandlingPaste.current = false;
      resetHandlingTimeoutRef.current = null;
    }, RESET_HANDLING_DELAY_MS);
  }, []);

  const scheduleStartEditing = useCallback((elementId: string) => {
    if (startEditingTimeoutRef.current) {
      window.clearTimeout(startEditingTimeoutRef.current);
    }

    startEditingTimeoutRef.current = window.setTimeout(() => {
      const { startEditingText, editingTextId } = useCanvasStore.getState();
      if (!editingTextId) {
        startEditingText(elementId);
      }
      startEditingTimeoutRef.current = null;
    }, START_EDITING_DELAY_MS);
  }, []);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && isEditableElement(activeElement)) {
      return;
    }

    const canvasContainer = getCanvasContainer();
    if (!isCanvasPasteContext(canvasContainer, activeElement)) {
      return;
    }

    const { editingTextId } = useCanvasStore.getState();
    if (editingTextId) {
      return;
    }

    if (isHandlingPaste.current) return;
    isHandlingPaste.current = true;

    try {
      const clipboardData = e.clipboardData;
      if (!clipboardData) {
        return;
      }

      const text = clipboardData.getData('text/plain');
      if (isTextEmpty(text)) {
        return;
      }

      e.preventDefault();

      const cleanedText = prepareTextForPaste(text);
      const direction = detectTextDirection(cleanedText);
      const alignment = getAlignmentForDirection(direction);

      let position: { x: number; y: number };
      if (lastPointerPosition.current) {
        position = {
          x: lastPointerPosition.current.x,
          y: lastPointerPosition.current.y,
        };
      } else {
        position = {
          x: viewportBounds.x + viewportBounds.width / 2 - 100,
          y: viewportBounds.y + viewportBounds.height / 2 - 20,
        };
      }

      const isMultiLine = cleanedText.includes('\n');
      const textType = isMultiLine ? 'box' : 'line';

      const lines = cleanedText.split('\n');
      const maxLineLength = Math.max(...lines.map((line) => line.length));
      const estimatedWidth = Math.min(Math.max(200, maxLineLength * 10), 500);
      const estimatedHeight = isMultiLine ? Math.min(lines.length * 24 + 16, 300) : 40;

      const { addText, selectElement } = useCanvasStore.getState();

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
          color: '#0B0F12',
        },
        data: {
          textType,
        },
      });

      if (newElementId) {
        selectElement(newElementId, false);
        scheduleStartEditing(newElementId);
      }
    } catch (error) {
      console.error('Error handling paste:', error);
    } finally {
      scheduleHandlingReset();
    }
  }, [lastPointerPosition, viewportBounds, scheduleHandlingReset, scheduleStartEditing]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste, enabled]);

  useEffect(() => {
    return () => {
      clearTrackedTimeouts();
    };
  }, [clearTrackedTimeouts]);
}

export default useCanvasPaste;
