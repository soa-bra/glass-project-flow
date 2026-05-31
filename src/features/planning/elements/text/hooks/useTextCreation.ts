/**
 * useTextCreation - Hook لإنشاء عناصر نص جديدة
 * Hook for creating new text elements on canvas
 * 
 * @module features/planning/elements/text/hooks/useTextCreation
 */

import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import { DEFAULT_TEXT_ELEMENT, type TextType } from '../TextElement';

interface CreateTextOptions {
  /** نوع النص - Text type */
  textType?: TextType;
  /** المحتوى الأولي - Initial content */
  content?: string;
  /** عرض مخصص - Custom width */
  width?: number;
  /** ارتفاع مخصص - Custom height */
  height?: number;
  /** عائلة الخط - Font family */
  fontFamily?: string;
  /** حجم الخط - Font size */
  fontSize?: number;
  /** لون النص - Text color */
  color?: string;
  /** الاتجاه - Direction */
  direction?: 'rtl' | 'ltr';
  /** بدء التحرير فوراً - Start editing immediately */
  startEditing?: boolean;
}

interface UseTextCreationReturn {
  /** إنشاء عنصر نص جديد - Create new text element */
  createText: (x: number, y: number, options?: CreateTextOptions) => string;
  /** إنشاء عنصر نص سطري - Create line text element */
  createLineText: (x: number, y: number) => string;
  /** إنشاء مربع نص - Create box text element */
  createBoxText: (x: number, y: number, width?: number, height?: number) => string;
}

/**
 * Hook لإنشاء عناصر النص
 * Hook for text element creation
 */
export function useTextCreation(): UseTextCreationReturn {
  const { 
    addElement, 
    startEditingText, 
    toolSettings 
  } = useCanvasStore();

  /**
   * إنشاء عنصر نص جديد
   * Create a new text element
   */
  const createText = useCallback((
    x: number, 
    y: number, 
    options: CreateTextOptions = {}
  ): string => {
    const id = nanoid();
    const textSettings = toolSettings.text;
    
    const {
      textType = 'line',
      content = '',
      width = textType === 'box' ? 200 : 150,
      height = textType === 'box' ? 100 : 30,
      fontFamily = textSettings.fontFamily || DEFAULT_TEXT_ELEMENT.fontFamily,
      fontSize = textSettings.fontSize || DEFAULT_TEXT_ELEMENT.fontSize,
      color = textSettings.color || DEFAULT_TEXT_ELEMENT.color,
      direction = textSettings.direction || DEFAULT_TEXT_ELEMENT.direction,
      startEditing = true,
    } = options;

    const element: CanvasElement = {
      id,
      type: 'text',
      position: { x, y },
      size: { width, height },
      content,
      visible: true,
      locked: false,
      layerId: 'default',
      style: {
        fontFamily,
        fontSize,
        fontWeight: textSettings.fontWeight || 'normal',
        color,
        textAlign: textSettings.alignment || 'right',
        direction,
        alignItems: 'flex-start',
      },
      data: {
        textType,
        autoGrow: true,
        minWidth: 50,
        minHeight: 20,
      },
    };

    addElement(element);

    // بدء التحرير فوراً إذا مطلوب
    if (startEditing) {
      // تأخير قصير للسماح للـ DOM بالتحديث
      setTimeout(() => {
        startEditingText(id);
      }, 50);
    }

    return id;
  }, [addElement, startEditingText, toolSettings.text]);

  /**
   * إنشاء عنصر نص سطري
   * Create a line text element
   */
  const createLineText = useCallback((x: number, y: number): string => {
    return createText(x, y, { textType: 'line' });
  }, [createText]);

  /**
   * إنشاء مربع نص
   * Create a box text element
   */
  const createBoxText = useCallback((
    x: number, 
    y: number, 
    width: number = 200, 
    height: number = 100
  ): string => {
    return createText(x, y, { textType: 'box', width, height });
  }, [createText]);

  return {
    createText,
    createLineText,
    createBoxText,
  };
}

export default useTextCreation;
