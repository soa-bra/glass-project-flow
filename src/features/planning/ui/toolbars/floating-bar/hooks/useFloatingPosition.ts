/**
 * useFloatingPosition - حساب موقع الشريط الطافي
 * Event-driven بدلاً من polling
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { CanvasElement } from "@/types/canvas";

interface Position {
  x: number;
  y: number;
}

interface ViewportState {
  zoom: number;
  pan: { x: number; y: number };
}

interface UseFloatingPositionProps {
  activeElements: CanvasElement[];
  editingTextId: string | null;
  viewport: ViewportState;
  hasSelection: boolean;
}

/**
 * حساب موقع الشريط الطافي بناءً على التحديد أو العنصر المحرر
 * يستخدم rAF و ResizeObserver بدلاً من setInterval
 */
export function useFloatingPosition({
  activeElements,
  editingTextId,
  viewport,
  hasSelection,
}: UseFloatingPositionProps): Position {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });

  const calculatePosition = useCallback(() => {
    if (!hasSelection) return;

    // إذا كان هناك نص قيد التحرير، نحاول إيجاد موقع الـ DOM element
    if (editingTextId) {
      const editorElement = document.querySelector(`[data-element-id="${editingTextId}"]`);
      if (editorElement) {
        const rect = editorElement.getBoundingClientRect();
        const newX = rect.left + rect.width / 2;
        const newY = Math.max(70, rect.top - 60);

        // تحديث فقط إذا تغير الموقع بشكل ملحوظ
        if (Math.abs(newX - lastPositionRef.current.x) > 2 || 
            Math.abs(newY - lastPositionRef.current.y) > 2) {
          lastPositionRef.current = { x: newX, y: newY };
          setPosition({ x: newX, y: newY });
        }
        return;
      }
    }

    // Fallback: حساب من بيانات العناصر
    if (activeElements.length === 0) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    activeElements.forEach((el) => {
      const x = el.position.x;
      const y = el.position.y;
      const width = el.size?.width || 200;
      const height = el.size?.height || 100;

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + width > maxX) maxX = x + width;
      if (y + height > maxY) maxY = y + height;
    });

    const selectionCenterX = (minX + maxX) / 2;
    const screenCenterX = selectionCenterX * viewport.zoom + viewport.pan.x;
    const screenTopY = minY * viewport.zoom + viewport.pan.y - 60;

    const newX = screenCenterX;
    const newY = Math.max(70, screenTopY);

    if (Math.abs(newX - lastPositionRef.current.x) > 2 || 
        Math.abs(newY - lastPositionRef.current.y) > 2) {
      lastPositionRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });
    }
  }, [hasSelection, activeElements, editingTextId, viewport.zoom, viewport.pan.x, viewport.pan.y]);

  // تحديث الموقع عند تغير التبعيات
  useEffect(() => {
    // حساب فوري
    calculatePosition();

    // استخدام rAF للتحديثات المتتابعة
    const scheduleUpdate = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        calculatePosition();
        rafRef.current = null;
      });
    };

    // الاستماع لتغييرات DOM عبر MutationObserver
    const observer = new MutationObserver(() => {
      scheduleUpdate();
    });

    // مراقبة عنصر التحرير إذا وجد
    if (editingTextId) {
      const editorElement = document.querySelector(`[data-element-id="${editingTextId}"]`);
      if (editorElement) {
        observer.observe(editorElement, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
    }

    // ResizeObserver للتعامل مع تغييرات الحجم
    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    if (editingTextId) {
      const editorElement = document.querySelector(`[data-element-id="${editingTextId}"]`);
      if (editorElement) {
        resizeObserver.observe(editorElement);
      }
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [calculatePosition, editingTextId]);

  return position;
}

export default useFloatingPosition;
