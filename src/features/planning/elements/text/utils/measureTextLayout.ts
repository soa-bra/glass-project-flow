import type { CanvasElement } from '@/types/canvas';

interface MeasureTextLayoutInput {
  element: CanvasElement;
  htmlContent?: string;
}

interface MeasuredTextLayout {
  width: number;
  height: number;
}

const FALLBACK_LAYOUT: MeasuredTextLayout = { width: 120, height: 28 };

const stripHtmlToText = (html: string): string => {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const temp = document.createElement('div');
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || '').replace(/\u00a0/g, ' ').trim();
};

export const measureTextLayout = ({ element, htmlContent }: MeasureTextLayoutInput): MeasuredTextLayout => {
  if (typeof document === 'undefined') {
    return {
      width: element.size?.width || FALLBACK_LAYOUT.width,
      height: element.size?.height || FALLBACK_LAYOUT.height,
    };
  }

  const textType = element.data?.textType || 'line';
  const content = typeof htmlContent === 'string' ? htmlContent : element.content || '';
  const plainText = stripHtmlToText(content);
  const style = element.style || {};

  const padding = Number(element.data?.padding ?? 0);
  const minWidth = Number(element.data?.minWidth ?? 48);
  const minHeight = Number(element.data?.minHeight ?? 24);
  const widthHint = Math.max(element.size?.width || minWidth, minWidth);

  const measurementNode = document.createElement('div');
  measurementNode.style.position = 'fixed';
  measurementNode.style.left = '-99999px';
  measurementNode.style.top = '-99999px';
  measurementNode.style.visibility = 'hidden';
  measurementNode.style.pointerEvents = 'none';
  measurementNode.style.boxSizing = 'border-box';
  measurementNode.style.padding = `${padding}px`;
  measurementNode.style.fontFamily = style.fontFamily || 'IBM Plex Sans Arabic';
  measurementNode.style.fontSize = `${style.fontSize || 16}px`;
  measurementNode.style.fontWeight = style.fontWeight || 'normal';
  measurementNode.style.fontStyle = style.fontStyle || 'normal';
  measurementNode.style.lineHeight = style.lineHeight ? String(style.lineHeight) : '1.35';
  measurementNode.style.letterSpacing = style.letterSpacing ? String(style.letterSpacing) : 'normal';
  measurementNode.style.direction = style.direction || 'rtl';
  measurementNode.style.textAlign = style.textAlign || 'right';
  measurementNode.style.unicodeBidi = 'plaintext';
  measurementNode.style.overflowWrap = 'break-word';
  measurementNode.style.wordBreak = 'break-word';

  if (textType === 'box') {
    measurementNode.style.width = `${widthHint}px`;
    measurementNode.style.minWidth = `${widthHint}px`;
    measurementNode.style.maxWidth = `${widthHint}px`;
    measurementNode.style.whiteSpace = 'pre-wrap';
  } else {
    measurementNode.style.display = 'inline-block';
    measurementNode.style.width = 'fit-content';
    measurementNode.style.whiteSpace = 'pre';
  }

  measurementNode.textContent = plainText.length > 0 ? plainText : 'اكتب شيئاً...';
  document.body.appendChild(measurementNode);

  const measuredWidth = Math.ceil(measurementNode.offsetWidth);
  const measuredHeight = Math.ceil(measurementNode.offsetHeight);
  document.body.removeChild(measurementNode);

  if (textType === 'box') {
    return {
      width: widthHint,
      height: Math.max(minHeight, measuredHeight),
    };
  }

  return {
    width: Math.max(minWidth, measuredWidth),
    height: Math.max(minHeight, measuredHeight),
  };
};

export default measureTextLayout;
