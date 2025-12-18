/**
 * Import Engine - Sprint 9
 * نظام الاستيراد للوحة
 */

import { ExportableElement } from './exportEngine';

// صيغ الاستيراد المدعومة
export type ImportFormat = 'json' | 'svg';

// خيارات الاستيراد
export interface ImportOptions {
  format?: ImportFormat;
  offsetPosition?: { x: number; y: number };
  generateNewIds?: boolean;
  mergeWithExisting?: boolean;
}

// نتيجة الاستيراد
export interface ImportResult {
  success: boolean;
  elements?: ExportableElement[];
  error?: string;
  metadata?: {
    version?: string;
    elementsCount?: number;
    importedAt?: string;
  };
}

// هيكل ملف JSON المصدّر
interface ExportedJSON {
  version: string;
  exportedAt: string;
  metadata?: {
    elementsCount: number;
    bounds: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
      width: number;
      height: number;
    };
  };
  elements: ExportableElement[];
}

/**
 * Import Engine Class
 * يدير عمليات الاستيراد للوحة
 */
export class ImportEngine {
  private defaultOptions: ImportOptions = {
    offsetPosition: { x: 0, y: 0 },
    generateNewIds: true,
    mergeWithExisting: true,
  };

  /**
   * استيراد من ملف
   */
  async importFromFile(file: File, options?: ImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      const format = this.detectFormat(file);
      
      switch (format) {
        case 'json':
          return await this.importFromJSON(file, mergedOptions);
        case 'svg':
          return await this.importFromSVG(file, mergedOptions);
        default:
          return { success: false, error: 'صيغة غير مدعومة' };
      }
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الاستيراد',
      };
    }
  }

  /**
   * استيراد من نص JSON
   */
  async importFromJSONString(jsonString: string, options?: ImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      const data = JSON.parse(jsonString) as ExportedJSON;
      return this.processJSONData(data, mergedOptions);
    } catch (error) {
      return {
        success: false,
        error: 'فشل في تحليل JSON',
      };
    }
  }

  /**
   * اكتشاف صيغة الملف
   */
  private detectFormat(file: File): ImportFormat | null {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'json') return 'json';
    if (extension === 'svg') return 'svg';
    
    // التحقق من MIME type
    if (file.type === 'application/json') return 'json';
    if (file.type === 'image/svg+xml') return 'svg';
    
    return null;
  }

  /**
   * استيراد من JSON
   */
  private async importFromJSON(file: File, options: ImportOptions): Promise<ImportResult> {
    const text = await file.text();
    
    try {
      const data = JSON.parse(text) as ExportedJSON;
      return this.processJSONData(data, options);
    } catch {
      return { success: false, error: 'فشل في تحليل ملف JSON' };
    }
  }

  /**
   * معالجة بيانات JSON
   */
  private processJSONData(data: ExportedJSON, options: ImportOptions): ImportResult {
    // التحقق من صحة البنية
    if (!data.elements || !Array.isArray(data.elements)) {
      return { success: false, error: 'بنية ملف غير صالحة' };
    }

    // معالجة العناصر
    const elements = data.elements.map((element) => {
      const processedElement: ExportableElement = {
        ...element,
        id: options.generateNewIds ? this.generateId() : element.id,
        position: {
          x: element.position.x + (options.offsetPosition?.x || 0),
          y: element.position.y + (options.offsetPosition?.y || 0),
        },
      };

      return processedElement;
    });

    return {
      success: true,
      elements,
      metadata: {
        version: data.version,
        elementsCount: elements.length,
        importedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * استيراد من SVG
   */
  private async importFromSVG(file: File, options: ImportOptions): Promise<ImportResult> {
    const text = await file.text();
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      
      // التحقق من أخطاء التحليل
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        return { success: false, error: 'فشل في تحليل ملف SVG' };
      }

      const elements = this.parseSVGElements(doc, options);

      return {
        success: true,
        elements,
        metadata: {
          elementsCount: elements.length,
          importedAt: new Date().toISOString(),
        },
      };
    } catch {
      return { success: false, error: 'فشل في تحليل ملف SVG' };
    }
  }

  /**
   * تحليل عناصر SVG
   */
  private parseSVGElements(doc: Document, options: ImportOptions): ExportableElement[] {
    const elements: ExportableElement[] = [];
    const svg = doc.querySelector('svg');
    
    if (!svg) return elements;

    // تحليل المستطيلات
    svg.querySelectorAll('rect').forEach((rect) => {
      const x = parseFloat(rect.getAttribute('x') || '0');
      const y = parseFloat(rect.getAttribute('y') || '0');
      const width = parseFloat(rect.getAttribute('width') || '100');
      const height = parseFloat(rect.getAttribute('height') || '100');
      const fill = rect.getAttribute('fill') || '#CCCCCC';

      // تجاهل الخلفية
      if (width === parseFloat(svg.getAttribute('width') || '0')) return;

      elements.push({
        id: options.generateNewIds ? this.generateId() : rect.id || this.generateId(),
        type: 'shape',
        position: {
          x: x + (options.offsetPosition?.x || 0),
          y: y + (options.offsetPosition?.y || 0),
        },
        size: { width, height },
        style: {
          shapeType: 'rectangle',
          fillColor: fill,
          strokeColor: rect.getAttribute('stroke') || 'transparent',
          strokeWidth: parseFloat(rect.getAttribute('stroke-width') || '0'),
        },
      });
    });

    // تحليل الدوائر
    svg.querySelectorAll('ellipse, circle').forEach((el) => {
      const isCircle = el.tagName === 'circle';
      const cx = parseFloat(el.getAttribute('cx') || '0');
      const cy = parseFloat(el.getAttribute('cy') || '0');
      const rx = isCircle 
        ? parseFloat(el.getAttribute('r') || '50')
        : parseFloat(el.getAttribute('rx') || '50');
      const ry = isCircle 
        ? parseFloat(el.getAttribute('r') || '50')
        : parseFloat(el.getAttribute('ry') || '50');

      elements.push({
        id: options.generateNewIds ? this.generateId() : el.id || this.generateId(),
        type: 'shape',
        position: {
          x: cx - rx + (options.offsetPosition?.x || 0),
          y: cy - ry + (options.offsetPosition?.y || 0),
        },
        size: { width: rx * 2, height: ry * 2 },
        style: {
          shapeType: isCircle ? 'circle' : 'ellipse',
          fillColor: el.getAttribute('fill') || '#3DBE8B',
          strokeColor: el.getAttribute('stroke') || 'transparent',
          strokeWidth: parseFloat(el.getAttribute('stroke-width') || '0'),
        },
      });
    });

    // تحليل النصوص
    svg.querySelectorAll('text').forEach((text) => {
      const x = parseFloat(text.getAttribute('x') || '0');
      const y = parseFloat(text.getAttribute('y') || '0');
      const fontSize = parseFloat(text.getAttribute('font-size') || '14');

      elements.push({
        id: options.generateNewIds ? this.generateId() : text.id || this.generateId(),
        type: 'text',
        position: {
          x: x + (options.offsetPosition?.x || 0),
          y: y - fontSize + (options.offsetPosition?.y || 0),
        },
        size: { width: 200, height: fontSize + 10 },
        content: text.textContent || '',
        style: {
          color: text.getAttribute('fill') || '#000000',
          fontSize,
          fontFamily: text.getAttribute('font-family') || 'IBM Plex Sans Arabic',
        },
      });
    });

    // تحليل المسارات
    svg.querySelectorAll('path').forEach((path) => {
      const d = path.getAttribute('d');
      if (!d) return;

      const points = this.parsePathD(d);
      if (points.length === 0) return;

      // حساب الحدود
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      points.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });

      elements.push({
        id: options.generateNewIds ? this.generateId() : path.id || this.generateId(),
        type: 'drawing',
        position: {
          x: minX + (options.offsetPosition?.x || 0),
          y: minY + (options.offsetPosition?.y || 0),
        },
        size: { width: maxX - minX || 1, height: maxY - minY || 1 },
        style: {
          paths: [points.map((p) => ({ x: p.x - minX, y: p.y - minY }))],
          strokeColor: path.getAttribute('stroke') || '#000000',
          strokeWidth: parseFloat(path.getAttribute('stroke-width') || '2'),
        },
      });
    });

    return elements;
  }

  /**
   * تحليل سمة d للمسار
   */
  private parsePathD(d: string): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const commands = d.match(/[ML]\s*[\d.-]+\s*[\d.-]+/gi) || [];

    commands.forEach((cmd) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts.length >= 3) {
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y });
        }
      }
    });

    return points;
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * التحقق من صحة ملف الاستيراد
   */
  async validateFile(file: File): Promise<{ valid: boolean; format?: ImportFormat; error?: string }> {
    const format = this.detectFormat(file);
    
    if (!format) {
      return { valid: false, error: 'صيغة ملف غير مدعومة' };
    }

    // التحقق من حجم الملف (الحد الأقصى 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'حجم الملف كبير جداً (الحد الأقصى 10MB)' };
    }

    return { valid: true, format };
  }
}

// إنشاء instance واحد
export const importEngine = new ImportEngine();
