import React, { useMemo } from 'react';
import type { CanvasElement } from '@/types/canvas';
import { sanitizeHTMLForDisplay } from '@/utils/sanitize';

interface TextRendererProps {
  element: CanvasElement;
  width: number;
  height: number;
}

/**
 * مكون لعرض النص باستخدام SVG
 * - يدعم النص السطري (line) والنص المربع (box)
 * - يدعم النص العربي RTL بشكل كامل
 * - يتكامل مع نظام التحويلات (zoom, pan)
 */
export const TextRenderer: React.FC<TextRendererProps> = ({
  element,
  width,
  height
}) => {
  const textType = element.data?.textType || 'line';
  const content = element.content || '';
  const direction = element.style?.direction || 'rtl';
  const fontFamily = element.style?.fontFamily || 'IBM Plex Sans Arabic';
  const fontSize = element.style?.fontSize || 16;
  const fontWeight = element.style?.fontWeight || 'normal';
  const fontStyle = element.style?.fontStyle || 'normal';
  const textDecoration = element.style?.textDecoration || 'none';
  const color = element.style?.color || '#0B0F12';
  const textAlign = element.style?.textAlign || 'right';
  const verticalAlign = element.style?.alignItems || 'flex-start';

  // حساب المحاذاة الأفقية لـ SVG
  const textAnchor = useMemo(() => {
    if (direction === 'rtl') {
      return textAlign === 'left' ? 'start' : textAlign === 'center' ? 'middle' : 'end';
    }
    return textAlign === 'right' ? 'end' : textAlign === 'center' ? 'middle' : 'start';
  }, [textAlign, direction]);

  // حساب موضع X بناءً على المحاذاة
  const xPosition = useMemo(() => {
    if (textAlign === 'center') return '50%';
    if (direction === 'rtl') {
      return textAlign === 'left' ? '8px' : `${width - 8}px`;
    }
    return textAlign === 'right' ? `${width - 8}px` : '8px';
  }, [textAlign, direction, width]);

  // حساب موضع Y بناءً على المحاذاة العمودية
  const yPosition = useMemo(() => {
    if (verticalAlign === 'center') return '50%';
    if (verticalAlign === 'flex-end') return `${height - 8}px`;
    return `${fontSize + 8}px`;
  }, [verticalAlign, height, fontSize]);

  // baseline alignment
  const dominantBaseline = useMemo(() => {
    if (verticalAlign === 'center') return 'middle';
    if (verticalAlign === 'flex-end') return 'text-after-edge';
    return 'text-before-edge';
  }, [verticalAlign]);

  // التحقق من وجود محتوى HTML (قوائم، تنسيقات)
  const hasHTMLContent = content.includes('<') && content.includes('>');

  // نص عرض بديل للمحتوى الفارغ
  const displayContent = content.trim() || 'انقر مرتين للكتابة...';
  const isPlaceholder = !content.trim();

  // استخراج النص الخام من HTML
  const plainText = useMemo(() => {
    if (!hasHTMLContent) return displayContent;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || displayContent;
  }, [content, hasHTMLContent, displayContent]);

  // للنص السطري البسيط (بدون HTML)
  if (textType === 'line' && !hasHTMLContent) {
    return (
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ pointerEvents: 'none' }}
      >
        <text
          x={xPosition}
          y={yPosition}
          textAnchor={textAnchor}
          dominantBaseline={dominantBaseline}
          direction={direction}
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight,
            fontStyle,
            textDecoration,
            fill: isPlaceholder ? 'hsl(var(--ink-30))' : color,
            userSelect: 'none',
          }}
        >
          {plainText}
        </text>
      </svg>
    );
  }

  // للنص المربع أو النص مع HTML (قوائم، تنسيقات)
  // نستخدم foreignObject للحفاظ على التنسيقات
  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      style={{ pointerEvents: 'none' }}
    >
      <foreignObject x="0" y="0" width={width} height={height}>
        <div
          dir={direction}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: verticalAlign === 'center' ? 'center' 
                          : verticalAlign === 'flex-end' ? 'flex-end' 
                          : 'flex-start',
            fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight,
            fontStyle,
            textDecoration,
            color: isPlaceholder ? 'hsl(var(--ink-30))' : color,
            textAlign: textAlign as any,
            padding: '8px',
            boxSizing: 'border-box',
            userSelect: 'none',
            overflow: textType === 'box' ? 'hidden' : 'visible',
            whiteSpace: textType === 'box' ? 'pre-wrap' : 'nowrap',
            wordWrap: textType === 'box' ? 'break-word' : 'normal',
            unicodeBidi: 'plaintext',
          }}
          dangerouslySetInnerHTML={{ 
            __html: isPlaceholder ? displayContent : sanitizeHTMLForDisplay(content, displayContent) 
          }}
        />
      </foreignObject>
    </svg>
  );
};

export default TextRenderer;
