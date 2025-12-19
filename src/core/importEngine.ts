/**
 * Import Engine - Sprint 9 Enhanced
 * نظام الاستيراد مع دعم Figma و Miro و Error Recovery
 */

import { ExportableElement } from './exportEngine';
import { FigmaParser, FigmaFile } from './parsers/figmaParser';
import { MiroParser, MiroBoard } from './parsers/miroParser';
import { ImportValidator, ValidationResult } from './validators/importValidator';

// صيغ الاستيراد المدعومة
export type ImportFormat = 'json' | 'svg' | 'figma' | 'miro';

// خيارات الاستيراد
export interface ImportOptions {
  format?: ImportFormat;
  offsetPosition?: { x: number; y: number };
  generateNewIds?: boolean;
  mergeWithExisting?: boolean;
  errorRecovery?: boolean;
  onProgress?: (progress: number, message: string) => void;
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
    sourceFormat?: ImportFormat;
    warnings?: string[];
    recoveredCount?: number;
    validation?: ValidationResult;
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
 */
export class ImportEngine {
  private defaultOptions: ImportOptions = {
    offsetPosition: { x: 0, y: 0 },
    generateNewIds: true,
    mergeWithExisting: true,
    errorRecovery: true,
  };

  private figmaParser = new FigmaParser();
  private miroParser = new MiroParser();
  private validator = new ImportValidator();

  /**
   * استيراد من ملف
   */
  async importFromFile(file: File, options?: ImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      mergedOptions.onProgress?.(10, 'جاري تحليل الملف...');

      const format = mergedOptions.format || this.detectFormat(file);
      
      if (!format) {
        return { success: false, error: 'صيغة غير مدعومة' };
      }

      mergedOptions.onProgress?.(30, `تم اكتشاف صيغة: ${format}`);

      let result: ImportResult;

      switch (format) {
        case 'json':
          result = await this.importFromJSON(file, mergedOptions);
          break;
        case 'svg':
          result = await this.importFromSVG(file, mergedOptions);
          break;
        case 'figma':
          result = await this.importFromFigma(file, mergedOptions);
          break;
        case 'miro':
          result = await this.importFromMiro(file, mergedOptions);
          break;
        default:
          return { success: false, error: 'صيغة غير مدعومة' };
      }

      mergedOptions.onProgress?.(100, 'اكتمل الاستيراد');

      return result;
    } catch (error) {
      console.error('Import error:', error);

      // محاولة الاسترداد
      if (mergedOptions.errorRecovery) {
        return await this.attemptRecovery(file, mergedOptions);
      }

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
      const data = JSON.parse(jsonString);
      
      // التحقق المتقدم
      const validation = this.validator.validate(data);
      
      if (!validation.valid && !mergedOptions.errorRecovery) {
        return {
          success: false,
          error: validation.errors.map(e => e.message).join(', '),
        };
      }

      // استخدام العناصر المستردة إذا كانت متوفرة
      const elements = validation.recoveredElements || data.elements;
      
      return this.processElements(elements, mergedOptions, 'json', validation);
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
    const name = file.name.toLowerCase();

    // التحقق من اسم الملف للأنماط الشائعة
    if (name.includes('figma') || name.includes('.fig')) {
      return 'figma';
    }
    if (name.includes('miro')) {
      return 'miro';
    }

    // التحقق من الامتداد
    if (extension === 'json') {
      return 'json'; // سيتم تحديد النوع الدقيق لاحقًا
    }
    if (extension === 'svg') {
      return 'svg';
    }

    // التحقق من MIME type
    if (file.type === 'application/json') {
      return 'json';
    }
    if (file.type === 'image/svg+xml') {
      return 'svg';
    }

    return null;
  }

  /**
   * تحديد نوع JSON (عادي، Figma، أو Miro)
   */
  private async detectJSONType(data: unknown): Promise<ImportFormat> {
    if (FigmaParser.validate(data)) {
      return 'figma';
    }
    if (MiroParser.validate(data)) {
      return 'miro';
    }
    return 'json';
  }

  /**
   * استيراد من JSON
   */
  private async importFromJSON(file: File, options: ImportOptions): Promise<ImportResult> {
    const text = await file.text();

    try {
      const data = JSON.parse(text);
      
      // اكتشاف نوع JSON
      const actualFormat = await this.detectJSONType(data);
      
      if (actualFormat === 'figma') {
        return this.processFigmaData(data, options);
      }
      if (actualFormat === 'miro') {
        return this.processMiroData(data, options);
      }

      // معالجة JSON عادي
      const validation = this.validator.validate(data);

      if (!validation.valid && !options.errorRecovery) {
        return {
          success: false,
          error: validation.errors.map(e => e.message).join(', '),
        };
      }

      const elements = validation.recoveredElements || (data as ExportedJSON).elements;
      
      return this.processElements(elements, options, 'json', validation);
    } catch {
      if (options.errorRecovery) {
        return this.attemptRecovery(file, options);
      }
      return { success: false, error: 'فشل في تحليل ملف JSON' };
    }
  }

  /**
   * استيراد من Figma
   */
  private async importFromFigma(file: File, options: ImportOptions): Promise<ImportResult> {
    const text = await file.text();

    try {
      const data = JSON.parse(text) as FigmaFile;
      return this.processFigmaData(data, options);
    } catch {
      return { success: false, error: 'فشل في تحليل ملف Figma' };
    }
  }

  /**
   * معالجة بيانات Figma
   */
  private processFigmaData(data: FigmaFile, options: ImportOptions): ImportResult {
    if (!FigmaParser.validate(data)) {
      return { success: false, error: 'بنية ملف Figma غير صالحة' };
    }

    const elements = this.figmaParser.parse(data);
    
    return this.processElements(elements, options, 'figma');
  }

  /**
   * استيراد من Miro
   */
  private async importFromMiro(file: File, options: ImportOptions): Promise<ImportResult> {
    const text = await file.text();

    try {
      const data = JSON.parse(text) as MiroBoard;
      return this.processMiroData(data, options);
    } catch {
      return { success: false, error: 'فشل في تحليل ملف Miro' };
    }
  }

  /**
   * معالجة بيانات Miro
   */
  private processMiroData(data: MiroBoard, options: ImportOptions): ImportResult {
    if (!MiroParser.validate(data)) {
      return { success: false, error: 'بنية ملف Miro غير صالحة' };
    }

    const elements = this.miroParser.parse(data);
    
    return this.processElements(elements, options, 'miro');
  }

  /**
   * استيراد من SVG
   */
  private async importFromSVG(file: File, options: ImportOptions): Promise<ImportResult> {
    const text = await file.text();

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');

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
          sourceFormat: 'svg',
        },
      };
    } catch {
      return { success: false, error: 'فشل في تحليل ملف SVG' };
    }
  }

  /**
   * معالجة العناصر وتطبيق الخيارات
   */
  private processElements(
    elements: ExportableElement[],
    options: ImportOptions,
    sourceFormat: ImportFormat,
    validation?: ValidationResult
  ): ImportResult {
    const processedElements = elements.map((element) => ({
      ...element,
      id: options.generateNewIds ? this.generateId() : element.id,
      position: {
        x: element.position.x + (options.offsetPosition?.x || 0),
        y: element.position.y + (options.offsetPosition?.y || 0),
      },
    }));

    return {
      success: true,
      elements: processedElements,
      metadata: {
        elementsCount: processedElements.length,
        importedAt: new Date().toISOString(),
        sourceFormat,
        warnings: validation?.warnings.map(w => w.message),
        recoveredCount: validation?.stats.recoveredElements,
        validation,
      },
    };
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

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
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

    // تحليل الصور
    svg.querySelectorAll('image').forEach((img) => {
      const x = parseFloat(img.getAttribute('x') || '0');
      const y = parseFloat(img.getAttribute('y') || '0');
      const width = parseFloat(img.getAttribute('width') || '100');
      const height = parseFloat(img.getAttribute('height') || '100');
      const href = img.getAttribute('href') || img.getAttribute('xlink:href') || '';

      elements.push({
        id: options.generateNewIds ? this.generateId() : img.id || this.generateId(),
        type: 'image',
        position: {
          x: x + (options.offsetPosition?.x || 0),
          y: y + (options.offsetPosition?.y || 0),
        },
        size: { width, height },
        style: {
          src: href,
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
   * محاولة استرداد البيانات التالفة
   */
  private async attemptRecovery(file: File, options: ImportOptions): Promise<ImportResult> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const validation = this.validator.validate(data);

      if (validation.recoveredElements && validation.recoveredElements.length > 0) {
        options.onProgress?.(90, `تم استرداد ${validation.recoveredElements.length} عنصر`);

        return this.processElements(validation.recoveredElements, options, 'json', validation);
      }

      return {
        success: false,
        error: 'فشل استرداد البيانات: ' + validation.errors.map((e) => e.message).join(', '),
        metadata: {
          validation,
        },
      };
    } catch {
      return {
        success: false,
        error: 'فشل تحليل الملف - الملف تالف',
      };
    }
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
  async validateFile(file: File): Promise<{ 
    valid: boolean; 
    format?: ImportFormat; 
    error?: string;
    detectedType?: string;
  }> {
    const format = this.detectFormat(file);

    if (!format) {
      return { valid: false, error: 'صيغة ملف غير مدعومة' };
    }

    // التحقق من حجم الملف (الحد الأقصى 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, error: 'حجم الملف كبير جداً (الحد الأقصى 50MB)' };
    }

    // محاولة قراءة الملف للتحقق من صحته
    if (format === 'json') {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const actualFormat = await this.detectJSONType(data);
        
        return { 
          valid: true, 
          format: actualFormat,
          detectedType: actualFormat === 'figma' ? 'Figma' : actualFormat === 'miro' ? 'Miro' : 'JSON',
        };
      } catch {
        return { valid: false, error: 'ملف JSON غير صالح' };
      }
    }

    return { valid: true, format };
  }

  /**
   * الحصول على الصيغ المدعومة
   */
  getSupportedFormats(): { extension: string; name: string; mimeType: string }[] {
    return [
      { extension: '.json', name: 'JSON', mimeType: 'application/json' },
      { extension: '.svg', name: 'SVG', mimeType: 'image/svg+xml' },
      { extension: '.fig', name: 'Figma', mimeType: 'application/json' },
    ];
  }
}

export const importEngine = new ImportEngine();
