/**
 * Import Engine - نظام الاستيراد
 * @module engine/canvas/io
 */

import { ExportableElement } from './exportEngine';

/**
 * خيارات الاستيراد
 */
export interface ImportOptions {
  generateNewIds?: boolean;
  offset?: { x: number; y: number };
  offsetPosition?: { x: number; y: number };
  validateElements?: boolean;
  mergeMode?: 'replace' | 'append' | 'merge';
  errorRecovery?: boolean;
}

/**
 * نتيجة الاستيراد
 */
export interface ImportResult {
  success: boolean;
  elements?: ExportableElement[];
  error?: string;
  warnings?: string[];
  metadata?: {
    version?: string;
    importedAt?: string;
    elementCount?: number;
  };
}

/**
 * نتيجة التحقق
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  format?: string;
}

/**
 * محرك الاستيراد
 */
export class ImportEngine {
  /**
   * التحقق من صحة الملف
   */
  async validateFile(file: File): Promise<ValidationResult> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    const supportedFormats = ['json', 'svg', 'fig'];
    
    if (!extension || !supportedFormats.includes(extension)) {
      return {
        valid: false,
        error: `صيغة غير مدعومة: ${extension}`,
      };
    }

    // التحقق من حجم الملف (الحد الأقصى 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return {
        valid: false,
        error: 'حجم الملف كبير جداً (الحد الأقصى 10MB)',
      };
    }

    return {
      valid: true,
      format: extension,
    };
  }

  /**
   * استيراد من ملف
   */
  async importFromFile(file: File, options?: ImportOptions): Promise<ImportResult> {
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const content = await this.readFileContent(file);

      switch (extension) {
        case 'json':
          return this.importFromJSONString(content, options);
        case 'svg':
          return this.importFromSVG(content, options);
        default:
          return { success: false, error: `صيغة غير مدعومة: ${extension}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في قراءة الملف',
      };
    }
  }

  /**
   * استيراد من نص JSON
   */
  async importFromJSONString(jsonString: string, options?: ImportOptions): Promise<ImportResult> {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.elements || !Array.isArray(data.elements)) {
        return {
          success: false,
          error: 'الملف لا يحتوي على عناصر صالحة',
        };
      }

      let elements: ExportableElement[] = data.elements;

      // توليد معرّفات جديدة
      if (options?.generateNewIds) {
        elements = elements.map(el => ({
          ...el,
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }));
      }

      // تطبيق الإزاحة
      if (options?.offset) {
        elements = elements.map(el => ({
          ...el,
          position: {
            x: el.position.x + (options.offset?.x || 0),
            y: el.position.y + (options.offset?.y || 0),
          },
        }));
      }

      return {
        success: true,
        elements,
        metadata: {
          version: data.version,
          importedAt: new Date().toISOString(),
          elementCount: elements.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في تحليل JSON',
      };
    }
  }

  /**
   * استيراد من SVG
   */
  private async importFromSVG(svgContent: string, options?: ImportOptions): Promise<ImportResult> {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svg = doc.querySelector('svg');

      if (!svg) {
        return { success: false, error: 'ملف SVG غير صالح' };
      }

      const elements: ExportableElement[] = [];
      let index = 0;

      // استخراج المستطيلات
      svg.querySelectorAll('rect').forEach(rect => {
        const x = parseFloat(rect.getAttribute('x') || '0');
        const y = parseFloat(rect.getAttribute('y') || '0');
        const width = parseFloat(rect.getAttribute('width') || '100');
        const height = parseFloat(rect.getAttribute('height') || '100');

        elements.push({
          id: options?.generateNewIds 
            ? `imported_${Date.now()}_${index++}` 
            : `svg_rect_${index++}`,
          type: 'shape',
          position: { 
            x: x + (options?.offset?.x || 0), 
            y: y + (options?.offset?.y || 0) 
          },
          size: { width, height },
          style: {
            fill: rect.getAttribute('fill') || '#E5E7EB',
            stroke: rect.getAttribute('stroke') || '#374151',
          },
        });
      });

      // استخراج النصوص
      svg.querySelectorAll('text').forEach(text => {
        const x = parseFloat(text.getAttribute('x') || '0');
        const y = parseFloat(text.getAttribute('y') || '0');

        elements.push({
          id: options?.generateNewIds 
            ? `imported_${Date.now()}_${index++}` 
            : `svg_text_${index++}`,
          type: 'text',
          position: { 
            x: x + (options?.offset?.x || 0), 
            y: y + (options?.offset?.y || 0) 
          },
          size: { width: 200, height: 30 },
          content: text.textContent || '',
        });
      });

      return {
        success: true,
        elements,
        metadata: {
          importedAt: new Date().toISOString(),
          elementCount: elements.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في تحليل SVG',
      };
    }
  }

  /**
   * قراءة محتوى الملف
   */
  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsText(file);
    });
  }
}

/**
 * مثيل المحرك الافتراضي
 */
export const importEngine = new ImportEngine();
