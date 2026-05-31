/**
 * Export Engine - نظام التصدير
 * @module engine/canvas/io
 */

import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

/**
 * صيغ التصدير المدعومة
 */
export type ExportFormat = 'json' | 'svg' | 'png' | 'pdf';

/**
 * عنصر قابل للتصدير
 */
export interface ExportableElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  style?: Record<string, unknown>;
  rotation?: number;
  metadata?: Record<string, unknown>;
}

/**
 * خيارات التصدير
 */
export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  scale?: number;
  quality?: number;
  includeMetadata?: boolean;
  background?: string;
}

/**
 * نتيجة التصدير
 */
export interface ExportResult {
  success: boolean;
  filename?: string;
  data?: Blob | string;
  error?: string;
}

/**
 * محرك التصدير
 */
export class ExportEngine {
  private version = '1.0.0';

  /**
   * تصدير العناصر
   */
  async export(
    elements: ExportableElement[],
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const filename = options.filename || `canvas-export-${Date.now()}`;
      
      switch (options.format) {
        case 'json':
          return this.exportToJSON(elements, filename, options);
        case 'svg':
          return this.exportToSVG(elements, filename, options);
        case 'png':
          return this.exportToPNG(elements, filename, options);
        case 'pdf':
          return this.exportToPDF(elements, filename, options);
        default:
          return { success: false, error: `صيغة غير مدعومة: ${options.format}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير متوقع في التصدير',
      };
    }
  }

  /**
   * تصدير إلى JSON
   */
  private async exportToJSON(
    elements: ExportableElement[],
    filename: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    const data = {
      version: this.version,
      exportedAt: new Date().toISOString(),
      elements,
      metadata: options.includeMetadata ? {
        elementCount: elements.length,
        format: 'json',
      } : undefined,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const fullFilename = `${filename}.json`;

    saveAs(blob, fullFilename);

    return {
      success: true,
      filename: fullFilename,
      data: blob,
    };
  }

  /**
   * تصدير إلى SVG
   */
  private async exportToSVG(
    elements: ExportableElement[],
    filename: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    const bounds = this.calculateBounds(elements);
    const padding = 20;
    const width = bounds.maxX - bounds.minX + padding * 2;
    const height = bounds.maxY - bounds.minY + padding * 2;

    const svgElements = elements.map(el => this.elementToSVG(el, bounds.minX - padding, bounds.minY - padding));

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${options.background || '#FFFFFF'}"/>
  ${svgElements.join('\n  ')}
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const fullFilename = `${filename}.svg`;

    saveAs(blob, fullFilename);

    return {
      success: true,
      filename: fullFilename,
      data: blob,
    };
  }

  /**
   * تصدير إلى PNG
   */
  private async exportToPNG(
    elements: ExportableElement[],
    filename: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    const scale = options.scale || 2;
    const quality = options.quality || 0.92;
    const bounds = this.calculateBounds(elements);
    const padding = 20;
    const width = (bounds.maxX - bounds.minX + padding * 2) * scale;
    const height = (bounds.maxY - bounds.minY + padding * 2) * scale;

    // إنشاء canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return { success: false, error: 'فشل إنشاء سياق الرسم' };
    }

    // رسم الخلفية
    ctx.fillStyle = options.background || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // رسم العناصر
    ctx.scale(scale, scale);
    elements.forEach(el => {
      this.renderElementToCanvas(ctx, el, bounds.minX - padding, bounds.minY - padding);
    });

    // تحويل إلى blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const fullFilename = `${filename}.png`;
            saveAs(blob, fullFilename);
            resolve({
              success: true,
              filename: fullFilename,
              data: blob,
            });
          } else {
            resolve({ success: false, error: 'فشل إنشاء الصورة' });
          }
        },
        'image/png',
        quality
      );
    });
  }

  /**
   * تصدير إلى PDF
   */
  private async exportToPDF(
    elements: ExportableElement[],
    filename: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    const scale = options.scale || 2;
    const bounds = this.calculateBounds(elements);
    const padding = 20;
    const width = bounds.maxX - bounds.minX + padding * 2;
    const height = bounds.maxY - bounds.minY + padding * 2;

    // إنشاء canvas للرسم
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return { success: false, error: 'فشل إنشاء سياق الرسم' };
    }

    // رسم الخلفية
    ctx.fillStyle = options.background || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم العناصر
    ctx.scale(scale, scale);
    elements.forEach(el => {
      this.renderElementToCanvas(ctx, el, bounds.minX - padding, bounds.minY - padding);
    });

    // إنشاء PDF
    const orientation = width > height ? 'landscape' : 'portrait';
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [width, height],
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);

    const fullFilename = `${filename}.pdf`;
    pdf.save(fullFilename);

    return {
      success: true,
      filename: fullFilename,
    };
  }

  /**
   * حساب حدود العناصر
   */
  private calculateBounds(elements: ExportableElement[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    if (elements.length === 0) {
      return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach(el => {
      minX = Math.min(minX, el.position.x);
      minY = Math.min(minY, el.position.y);
      maxX = Math.max(maxX, el.position.x + el.size.width);
      maxY = Math.max(maxY, el.position.y + el.size.height);
    });

    return { minX, minY, maxX, maxY };
  }

  /**
   * تحويل عنصر إلى SVG
   */
  private elementToSVG(element: ExportableElement, offsetX: number, offsetY: number): string {
    const x = element.position.x - offsetX;
    const y = element.position.y - offsetY;
    const { width, height } = element.size;
    const fill = (element.style?.fill as string) || '#E5E7EB';
    const stroke = (element.style?.stroke as string) || '#374151';
    const strokeWidth = (element.style?.strokeWidth as number) || 1;

    const rotation = element.rotation || 0;
    const transform = rotation ? ` transform="rotate(${rotation} ${x + width/2} ${y + height/2})"` : '';

    switch (element.type) {
      case 'text':
        return `<text x="${x}" y="${y + 20}" font-family="IBM Plex Sans Arabic, sans-serif" font-size="14" fill="${stroke}"${transform}>${element.content || ''}</text>`;
      
      case 'sticky_note':
        return `<g${transform}>
          <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1" rx="4"/>
          <text x="${x + 8}" y="${y + 20}" font-family="IBM Plex Sans Arabic, sans-serif" font-size="12" fill="#92400E">${element.content || ''}</text>
        </g>`;
      
      case 'image':
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="1"${transform}/>`;
      
      case 'connector':
        return `<line x1="${x}" y1="${y}" x2="${x + width}" y2="${y + height}" stroke="${stroke}" stroke-width="${strokeWidth}"${transform}/>`;
      
      default:
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="4"${transform}/>`;
    }
  }

  /**
   * رسم عنصر على canvas
   */
  private renderElementToCanvas(
    ctx: CanvasRenderingContext2D,
    element: ExportableElement,
    offsetX: number,
    offsetY: number
  ): void {
    const x = element.position.x - offsetX;
    const y = element.position.y - offsetY;
    const { width, height } = element.size;
    const fill = (element.style?.fill as string) || '#E5E7EB';
    const stroke = (element.style?.stroke as string) || '#374151';

    ctx.save();

    // تطبيق الدوران
    if (element.rotation) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }

    switch (element.type) {
      case 'text':
        ctx.fillStyle = stroke;
        ctx.font = '14px "IBM Plex Sans Arabic", sans-serif';
        ctx.fillText(element.content || '', x, y + 20);
        break;

      case 'sticky_note':
        ctx.fillStyle = '#FEF3C7';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1;
        this.roundRect(ctx, x, y, width, height, 4);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#92400E';
        ctx.font = '12px "IBM Plex Sans Arabic", sans-serif';
        ctx.fillText(element.content || '', x + 8, y + 20);
        break;

      default:
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        this.roundRect(ctx, x, y, width, height, 4);
        ctx.fill();
        ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * رسم مستطيل بحواف دائرية
   */
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

/**
 * مثيل المحرك الافتراضي
 */
export const exportEngine = new ExportEngine();
