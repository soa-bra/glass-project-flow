import React, { useMemo } from 'react';
import type { CanvasElement } from '@/types/canvas';
import { sanitizeHTMLForDisplay } from '@/utils/sanitize';

interface TextRendererProps {
  element: CanvasElement;
  width: number;
  height: number;
  onDoubleClick?: (e: React.MouseEvent) => void;
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
  height,
  onDoubleClick
}) => {
  const textType = element.data?.textType || (element as any).textType || 'line';
  const content = element.content || '';

  const direction =
    element.style?.direction ||
    (element as any).direction ||
    'rtl';

  const fontFamily =
    element.style?.fontFamily ||
    (element as any).fontFamily ||
    'IBM Plex Sans Arabic';

  const fontSize =
    element.style?.fontSize ||
    (element as any).fontSize ||
    16;

  const fontWeight =
    element.style?.fontWeight ||
    (element as any).fontWeight ||
    'normal';

  const fontStyle =
    element.style?.fontStyle ||
    'normal';

  const textDecoration =
    element.style?.textDecoration ||
    'none';

  const color =
    element.style?.color ||
    (element as any).color ||
    '#0B0F12';

  const textAlign =
    element.style?.textAlign ||
    (element as any).alignment ||
    'right';

  const verticalAlign =
    element.style?.alignItems ||
    (element as any).verticalAlign ||
    'flex-start';

  const textAnchor = useMemo(() => {
    if (direction === 'rtl') {
      return textAlign === 'left' ? 'start' : textAlign === 'center' ? 'middle' : 'end';
    }
    return textAlign === 'right' ? 'end' : textAlign === 'center' ? 'middle' : 'start';
  }, [textAlign, direction]);

  const xPosition = useMemo(() => {
    if (textAlign === 'center') return '50%';
    if (direction === 'rtl') {
      return textAlign === 'left' ? '8px' : `${width - 8}px`;
    }
    return textAlign === 'right' ? `${width - 8}px` : '8px';
  }, [textAlign, direction, width]);

  const yPosition = useMemo(() => {
    if (verticalAlign === 'center') return '50%';
    if (verticalAlign === 'flex-end') return `${height - 8}px`;
    return `${fontSize + 8}px`;
  }, [verticalAlign, height, fontSize]);

  const dominantBaseline = useMemo(() => {
    if (verticalAlign === 'center') return 'middle';
    if (verticalAlign === 'flex-end') return 'text-after-edge';
    return 'text-before-edge';
  }, [verticalAlign]);

  const hasHTMLContent = content.includes('<') && content.includes('>');
  const isEmpty = !content.trim();

  const plainText = useMemo(() => {
    if (!hasHTMLContent) return content;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || '';
  }, [content, hasHTMLContent]);

  if (textType === 'line' && !hasHTMLContent) {
    return (
      <svg
        width={width}
        height={height}
        className="overflow-visible cursor-text"
        style={{ pointerEvents: 'auto' }}
        onDoubleClick={onDoubleClick}
      >
        {!isEmpty && (
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
              fill: color,
              userSelect: 'none',
            }}
          >
            {plainText}
          </text>
        )}
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible cursor-text"
      style={{ pointerEvents: 'auto' }}
      onDoubleClick={onDoubleClick}
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
            color,
            textAlign: textAlign as any,
            padding: '0',
            boxSizing: 'border-box',
            userSelect: 'none',
            overflow: textType === 'box' ? 'hidden' : 'visible',
            whiteSpace: textType === 'box' ? 'pre-wrap' : 'nowrap',
            wordWrap: textType === 'box' ? 'break-word' : 'normal',
            unicodeBidi: 'plaintext',
          }}
          dangerouslySetInnerHTML={{
            __html: isEmpty ? '' : sanitizeHTMLForDisplay(content, '')
          }}
        />
      </foreignObject>
    </svg>
  );
};

export default TextRenderer;
