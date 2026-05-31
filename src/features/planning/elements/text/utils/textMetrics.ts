/**
 * textMetrics - أدوات حساب أبعاد النص
 * Utilities for calculating text dimensions
 * 
 * @module features/planning/elements/text/utils/textMetrics
 */

interface TextMeasureOptions {
  /** عائلة الخط - Font family */
  fontFamily: string;
  /** حجم الخط - Font size in pixels */
  fontSize: number;
  /** وزن الخط - Font weight */
  fontWeight?: string;
  /** نمط الخط - Font style */
  fontStyle?: string;
  /** الحد الأقصى للعرض - Maximum width */
  maxWidth?: number;
}

interface TextDimensions {
  /** العرض - Width */
  width: number;
  /** الارتفاع - Height */
  height: number;
  /** عدد الأسطر - Number of lines */
  lines: number;
}

// Canvas مؤقت لقياس النص
let measureCanvas: HTMLCanvasElement | null = null;
let measureContext: CanvasRenderingContext2D | null = null;

/**
 * الحصول على سياق القياس
 * Get measurement context
 */
function getMeasureContext(): CanvasRenderingContext2D {
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas');
    measureContext = measureCanvas.getContext('2d');
  }
  return measureContext!;
}

/**
 * قياس أبعاد النص
 * Measure text dimensions
 */
export function measureText(
  text: string, 
  options: TextMeasureOptions
): TextDimensions {
  const ctx = getMeasureContext();
  const { fontFamily, fontSize, fontWeight = 'normal', fontStyle = 'normal', maxWidth } = options;
  
  // تعيين الخط
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  
  // قياس السطر الواحد
  if (!maxWidth || !text.includes('\n')) {
    const metrics = ctx.measureText(text || ' ');
    return {
      width: Math.ceil(metrics.width),
      height: fontSize * 1.4, // ارتفاع السطر
      lines: 1,
    };
  }
  
  // قياس النص متعدد الأسطر
  const lines = wrapText(text, maxWidth, ctx);
  const lineHeight = fontSize * 1.4;
  
  let maxLineWidth = 0;
  lines.forEach(line => {
    const width = ctx.measureText(line).width;
    if (width > maxLineWidth) maxLineWidth = width;
  });
  
  return {
    width: Math.ceil(maxLineWidth),
    height: Math.ceil(lines.length * lineHeight),
    lines: lines.length,
  };
}

/**
 * تقسيم النص إلى أسطر
 * Wrap text into lines
 */
function wrapText(
  text: string, 
  maxWidth: number, 
  ctx: CanvasRenderingContext2D
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];
  
  paragraphs.forEach(paragraph => {
    const words = paragraph.split(' ');
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
  });
  
  return lines.length > 0 ? lines : [''];
}

/**
 * حساب العرض المناسب للنص
 * Calculate appropriate width for text
 */
export function calculateTextWidth(
  text: string, 
  options: Omit<TextMeasureOptions, 'maxWidth'>
): number {
  const dimensions = measureText(text, options);
  return dimensions.width;
}

/**
 * حساب الارتفاع المناسب للنص
 * Calculate appropriate height for text
 */
export function calculateTextHeight(
  text: string, 
  options: TextMeasureOptions
): number {
  const dimensions = measureText(text, options);
  return dimensions.height;
}

/**
 * حساب عدد أسطر النص
 * Calculate number of text lines
 */
export function calculateLineCount(
  text: string, 
  options: TextMeasureOptions
): number {
  const dimensions = measureText(text, options);
  return dimensions.lines;
}

/**
 * التحقق من أن النص يتجاوز الحدود
 * Check if text overflows bounds
 */
export function isTextOverflowing(
  text: string,
  options: TextMeasureOptions & { maxHeight?: number }
): { widthOverflow: boolean; heightOverflow: boolean } {
  const { maxWidth, maxHeight } = options;
  const dimensions = measureText(text, options);
  
  return {
    widthOverflow: maxWidth ? dimensions.width > maxWidth : false,
    heightOverflow: maxHeight ? dimensions.height > maxHeight : false,
  };
}

/**
 * الحصول على موضع المؤشر في النص
 * Get cursor position in text
 */
export function getCursorPosition(
  text: string,
  clickX: number,
  options: TextMeasureOptions
): number {
  const ctx = getMeasureContext();
  const { fontFamily, fontSize, fontWeight = 'normal', fontStyle = 'normal' } = options;
  
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  
  let position = 0;
  let currentWidth = 0;
  
  for (let i = 0; i < text.length; i++) {
    const charWidth = ctx.measureText(text[i]).width;
    const nextWidth = currentWidth + charWidth;
    
    if (clickX <= currentWidth + charWidth / 2) {
      position = i;
      break;
    }
    
    currentWidth = nextWidth;
    position = i + 1;
  }
  
  return position;
}

export default {
  measureText,
  calculateTextWidth,
  calculateTextHeight,
  calculateLineCount,
  isTextOverflowing,
  getCursorPosition,
};
