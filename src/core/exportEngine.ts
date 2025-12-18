/**
 * Export Engine - Sprint 9
 * نظام التصدير متعدد الصيغ (PDF, PNG, SVG, JSON)
 */

import jsPDF from 'jspdf';

// أنواع التصدير المدعومة
export type ExportFormat = 'pdf' | 'png' | 'svg' | 'json';

// خيارات التصدير
export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  quality?: number; // 0-1 for PNG
  scale?: number;
  background?: string;
  padding?: number;
  includeMetadata?: boolean;
}

// بيانات العنصر للتصدير
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

// نتيجة التصدير
export interface ExportResult {
  success: boolean;
  data?: string | Blob;
  filename?: string;
  error?: string;
}

/**
 * Export Engine Class
 * يدير عمليات التصدير للوحة
 */
export class ExportEngine {
  private defaultOptions: Partial<ExportOptions> = {
    quality: 0.92,
    scale: 2,
    background: '#FFFFFF',
    padding: 20,
    includeMetadata: true,
  };

  /**
   * تصدير العناصر بالصيغة المحددة
   */
  async export(
    elements: ExportableElement[],
    options: ExportOptions
  ): Promise<ExportResult> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const filename = mergedOptions.filename || `canvas-export-${Date.now()}`;

    try {
      switch (mergedOptions.format) {
        case 'pdf':
          return await this.exportToPDF(elements, filename, mergedOptions);
        case 'png':
          return await this.exportToPNG(elements, filename, mergedOptions);
        case 'svg':
          return await this.exportToSVG(elements, filename, mergedOptions);
        case 'json':
          return this.exportToJSON(elements, filename, mergedOptions);
        default:
          return { success: false, error: 'صيغة غير مدعومة' };
      }
    } catch (error) {
      console.error('Export error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في التصدير' 
      };
    }
  }

  /**
   * حساب حدود العناصر
   */
  private calculateBounds(elements: ExportableElement[], padding: number = 0): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  } {
    if (elements.length === 0) {
      return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach((el) => {
      minX = Math.min(minX, el.position.x);
      minY = Math.min(minY, el.position.y);
      maxX = Math.max(maxX, el.position.x + el.size.width);
      maxY = Math.max(maxY, el.position.y + el.size.height);
    });

    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }

  /**
   * التصدير إلى PDF
   */
  private async exportToPDF(
    elements: ExportableElement[],
    filename: string,
    options: Partial<ExportOptions>
  ): Promise<ExportResult> {
    const bounds = this.calculateBounds(elements, options.padding);
    const scale = options.scale || 2;

    // تحديد اتجاه الصفحة
    const orientation = bounds.width > bounds.height ? 'landscape' : 'portrait';
    
    // إنشاء PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [bounds.width, bounds.height],
    });

    // إضافة الخلفية
    if (options.background) {
      pdf.setFillColor(options.background);
      pdf.rect(0, 0, bounds.width, bounds.height, 'F');
    }

    // رسم العناصر
    elements.forEach((element) => {
      const x = element.position.x - bounds.minX;
      const y = element.position.y - bounds.minY;

      this.drawElementToPDF(pdf, element, x, y);
    });

    // إضافة البيانات الوصفية
    if (options.includeMetadata) {
      pdf.setProperties({
        title: filename,
        creator: 'Supra Canvas',
      });
    }

    // حفظ الملف
    const pdfBlob = pdf.output('blob');
    this.downloadBlob(pdfBlob, `${filename}.pdf`);

    return {
      success: true,
      data: pdfBlob,
      filename: `${filename}.pdf`,
    };
  }

  /**
   * رسم عنصر في PDF
   */
  private drawElementToPDF(
    pdf: jsPDF,
    element: ExportableElement,
    x: number,
    y: number
  ): void {
    const { width, height } = element.size;
    const style = element.style || {};

    switch (element.type) {
      case 'text':
        pdf.setFontSize(14);
        pdf.setTextColor(String(style.color || '#000000'));
        pdf.text(element.content || '', x, y + 14);
        break;

      case 'shape':
        const shapeType = String(style.shapeType || 'rectangle');
        pdf.setFillColor(String(style.fillColor || '#3DBE8B'));
        pdf.setDrawColor(String(style.strokeColor || 'transparent'));
        
        if (shapeType === 'circle' || shapeType === 'ellipse') {
          pdf.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 'F');
        } else if (shapeType === 'triangle') {
          pdf.triangle(
            x + width / 2, y,
            x, y + height,
            x + width, y + height,
            'F'
          );
        } else {
          pdf.rect(x, y, width, height, 'F');
        }
        break;

      case 'sticky_note':
        pdf.setFillColor(String(style.fillColor || '#F6C445'));
        pdf.rect(x, y, width, height, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor('#000000');
        if (element.content) {
          pdf.text(element.content, x + 8, y + 20, { maxWidth: width - 16 });
        }
        break;

      case 'image':
        // للصور يمكن إضافة placeholder
        pdf.setFillColor('#E0E0E0');
        pdf.rect(x, y, width, height, 'F');
        pdf.setFontSize(10);
        pdf.setTextColor('#666666');
        pdf.text('صورة', x + width / 2 - 10, y + height / 2);
        break;

      default:
        // رسم مستطيل افتراضي
        pdf.setFillColor('#CCCCCC');
        pdf.rect(x, y, width, height, 'F');
    }
  }

  /**
   * التصدير إلى PNG
   */
  private async exportToPNG(
    elements: ExportableElement[],
    filename: string,
    options: Partial<ExportOptions>
  ): Promise<ExportResult> {
    const bounds = this.calculateBounds(elements, options.padding);
    const scale = options.scale || 2;

    // إنشاء canvas
    const canvas = document.createElement('canvas');
    canvas.width = bounds.width * scale;
    canvas.height = bounds.height * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { success: false, error: 'فشل إنشاء Canvas' };
    }

    // تطبيق المقياس
    ctx.scale(scale, scale);

    // رسم الخلفية
    ctx.fillStyle = options.background || '#FFFFFF';
    ctx.fillRect(0, 0, bounds.width, bounds.height);

    // رسم العناصر
    elements.forEach((element) => {
      const x = element.position.x - bounds.minX;
      const y = element.position.y - bounds.minY;
      
      this.drawElementToCanvas(ctx, element, x, y);
    });

    // تحويل إلى Blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            this.downloadBlob(blob, `${filename}.png`);
            resolve({
              success: true,
              data: blob,
              filename: `${filename}.png`,
            });
          } else {
            resolve({ success: false, error: 'فشل إنشاء الصورة' });
          }
        },
        'image/png',
        options.quality
      );
    });
  }

  /**
   * رسم عنصر في Canvas
   */
  private drawElementToCanvas(
    ctx: CanvasRenderingContext2D,
    element: ExportableElement,
    x: number,
    y: number
  ): void {
    const { width, height } = element.size;
    const style = element.style || {};

    ctx.save();

    // تطبيق الدوران
    if (element.rotation) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }

    switch (element.type) {
      case 'text':
        ctx.font = `${style.fontWeight || 'normal'} ${style.fontSize || 14}px ${style.fontFamily || 'IBM Plex Sans Arabic'}`;
        ctx.fillStyle = String(style.color || '#000000');
        ctx.textBaseline = 'top';
        ctx.fillText(element.content || '', x, y);
        break;

      case 'shape':
        const shapeType = String(style.shapeType || 'rectangle');
        ctx.fillStyle = String(style.fillColor || '#3DBE8B');
        ctx.strokeStyle = String(style.strokeColor || 'transparent');
        ctx.lineWidth = Number(style.strokeWidth || 0);

        ctx.beginPath();
        if (shapeType === 'circle' || shapeType === 'ellipse') {
          ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        } else if (shapeType === 'triangle') {
          ctx.moveTo(x + width / 2, y);
          ctx.lineTo(x, y + height);
          ctx.lineTo(x + width, y + height);
          ctx.closePath();
        } else {
          ctx.rect(x, y, width, height);
        }
        ctx.fill();
        if (Number(style.strokeWidth) > 0) {
          ctx.stroke();
        }
        break;

      case 'sticky_note':
        ctx.fillStyle = String(style.fillColor || '#F6C445');
        ctx.fillRect(x, y, width, height);
        
        // إضافة ظل خفيف
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        
        if (element.content) {
          ctx.fillStyle = '#000000';
          ctx.font = '12px IBM Plex Sans Arabic';
          ctx.fillText(element.content, x + 8, y + 20);
        }
        break;

      case 'drawing':
        // رسم المسارات
        if (style.paths && Array.isArray(style.paths)) {
          ctx.strokeStyle = String(style.strokeColor || '#000000');
          ctx.lineWidth = Number(style.strokeWidth || 2);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          (style.paths as Array<{ x: number; y: number }[]>).forEach((path) => {
            if (path.length > 0) {
              ctx.beginPath();
              ctx.moveTo(x + path[0].x, y + path[0].y);
              path.forEach((point) => {
                ctx.lineTo(x + point.x, y + point.y);
              });
              ctx.stroke();
            }
          });
        }
        break;

      default:
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(x, y, width, height);
    }

    ctx.restore();
  }

  /**
   * التصدير إلى SVG
   */
  private async exportToSVG(
    elements: ExportableElement[],
    filename: string,
    options: Partial<ExportOptions>
  ): Promise<ExportResult> {
    const bounds = this.calculateBounds(elements, options.padding);

    // بناء SVG
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${bounds.width}" 
     height="${bounds.height}" 
     viewBox="0 0 ${bounds.width} ${bounds.height}">
  <defs>
    <style>
      .text { font-family: 'IBM Plex Sans Arabic', sans-serif; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="${options.background || '#FFFFFF'}"/>
  
  <!-- Elements -->
`;

    elements.forEach((element) => {
      const x = element.position.x - bounds.minX;
      const y = element.position.y - bounds.minY;
      svgContent += this.elementToSVG(element, x, y);
    });

    svgContent += '\n</svg>';

    // تحويل إلى Blob
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    this.downloadBlob(blob, `${filename}.svg`);

    return {
      success: true,
      data: svgContent,
      filename: `${filename}.svg`,
    };
  }

  /**
   * تحويل عنصر إلى SVG
   */
  private elementToSVG(element: ExportableElement, x: number, y: number): string {
    const { width, height } = element.size;
    const style = element.style || {};
    const transform = element.rotation 
      ? ` transform="rotate(${element.rotation} ${x + width/2} ${y + height/2})"` 
      : '';

    switch (element.type) {
      case 'text':
        const textColor = style.color || '#000000';
        const fontSize = style.fontSize || 14;
        return `  <text x="${x}" y="${y + Number(fontSize)}" class="text" fill="${textColor}" font-size="${fontSize}"${transform}>${this.escapeXML(element.content || '')}</text>\n`;

      case 'shape':
        const shapeType = String(style.shapeType || 'rectangle');
        const fillColor = style.fillColor || '#3DBE8B';
        const strokeColor = style.strokeColor || 'none';
        const strokeWidth = style.strokeWidth || 0;

        if (shapeType === 'circle' || shapeType === 'ellipse') {
          return `  <ellipse cx="${x + width/2}" cy="${y + height/2}" rx="${width/2}" ry="${height/2}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"${transform}/>\n`;
        } else if (shapeType === 'triangle') {
          const points = `${x + width/2},${y} ${x},${y + height} ${x + width},${y + height}`;
          return `  <polygon points="${points}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"${transform}/>\n`;
        } else {
          return `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"${transform}/>\n`;
        }

      case 'sticky_note':
        const noteColor = style.fillColor || '#F6C445';
        let svg = `  <g${transform}>\n`;
        svg += `    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${noteColor}" filter="url(#shadow)"/>\n`;
        if (element.content) {
          svg += `    <text x="${x + 8}" y="${y + 20}" class="text" fill="#000000" font-size="12">${this.escapeXML(element.content)}</text>\n`;
        }
        svg += `  </g>\n`;
        return svg;

      case 'drawing':
        if (style.paths && Array.isArray(style.paths)) {
          const paths = (style.paths as Array<{ x: number; y: number }[]>).map((path) => {
            if (path.length === 0) return '';
            const d = path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x + p.x} ${y + p.y}`).join(' ');
            return `    <path d="${d}" fill="none" stroke="${style.strokeColor || '#000000'}" stroke-width="${style.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round"/>`;
          }).join('\n');
          return `  <g${transform}>\n${paths}\n  </g>\n`;
        }
        return '';

      default:
        return `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#CCCCCC"${transform}/>\n`;
    }
  }

  /**
   * التصدير إلى JSON
   */
  private exportToJSON(
    elements: ExportableElement[],
    filename: string,
    options: Partial<ExportOptions>
  ): ExportResult {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      metadata: options.includeMetadata ? {
        elementsCount: elements.length,
        bounds: this.calculateBounds(elements, 0),
      } : undefined,
      elements: elements.map((el) => ({
        id: el.id,
        type: el.type,
        position: el.position,
        size: el.size,
        content: el.content,
        style: el.style,
        rotation: el.rotation,
        metadata: options.includeMetadata ? el.metadata : undefined,
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    this.downloadBlob(blob, `${filename}.json`);

    return {
      success: true,
      data: jsonString,
      filename: `${filename}.json`,
    };
  }

  /**
   * تنزيل Blob كملف
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * تحويل الأحرف الخاصة لـ XML
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// إنشاء instance واحد
export const exportEngine = new ExportEngine();
