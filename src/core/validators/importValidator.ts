/**
 * Import Validator - التحقق المتقدم للاستيراد
 */

import { ExportableElement } from '../exportEngine';

/**
 * خطأ التحقق
 */
export interface ValidationError {
  code: string;
  message: string;
  elementIndex?: number;
  field?: string;
  recoverable: boolean;
}

/**
 * تحذير التحقق
 */
export interface ValidationWarning {
  code: string;
  message: string;
  elementIndex?: number;
  field?: string;
  suggestion?: string;
}

/**
 * نتيجة التحقق
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  recoveredElements?: ExportableElement[];
  stats: {
    totalElements: number;
    validElements: number;
    recoveredElements: number;
    skippedElements: number;
  };
}

/**
 * أنواع العناصر المسموحة
 */
const VALID_ELEMENT_TYPES = [
  'text', 'shape', 'sticky_note', 'image', 'drawing', 
  'connector', 'template', 'frame', 'group', 'smart'
];

/**
 * محقق الاستيراد
 */
export class ImportValidator {
  /**
   * التحقق من البيانات المستوردة
   */
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const recoveredElements: ExportableElement[] = [];
    
    let totalElements = 0;
    let validElements = 0;
    let recoveredCount = 0;
    let skippedElements = 0;

    // التحقق من البنية الأساسية
    if (!data || typeof data !== 'object') {
      errors.push({
        code: 'INVALID_ROOT',
        message: 'البيانات ليست كائنًا صالحًا',
        recoverable: false,
      });
      
      return {
        valid: false,
        errors,
        warnings,
        stats: { totalElements: 0, validElements: 0, recoveredElements: 0, skippedElements: 0 },
      };
    }

    const obj = data as Record<string, unknown>;

    // التحقق من وجود العناصر
    if (!obj.elements) {
      // محاولة البحث عن العناصر في أماكن أخرى
      if (obj.widgets && Array.isArray(obj.widgets)) {
        obj.elements = obj.widgets;
        warnings.push({
          code: 'ELEMENTS_ALIAS',
          message: 'تم استخدام "widgets" بدلاً من "elements"',
          suggestion: 'سيتم معالجة البيانات بشكل صحيح',
        });
      } else if (obj.objects && Array.isArray(obj.objects)) {
        obj.elements = obj.objects;
        warnings.push({
          code: 'ELEMENTS_ALIAS',
          message: 'تم استخدام "objects" بدلاً من "elements"',
          suggestion: 'سيتم معالجة البيانات بشكل صحيح',
        });
      } else {
        errors.push({
          code: 'MISSING_ELEMENTS',
          message: 'مصفوفة العناصر غير موجودة',
          recoverable: false,
        });
        
        return {
          valid: false,
          errors,
          warnings,
          stats: { totalElements: 0, validElements: 0, recoveredElements: 0, skippedElements: 0 },
        };
      }
    }

    if (!Array.isArray(obj.elements)) {
      errors.push({
        code: 'INVALID_ELEMENTS',
        message: 'العناصر ليست مصفوفة',
        recoverable: false,
      });
      
      return {
        valid: false,
        errors,
        warnings,
        stats: { totalElements: 0, validElements: 0, recoveredElements: 0, skippedElements: 0 },
      };
    }

    totalElements = obj.elements.length;

    // التحقق من كل عنصر
    (obj.elements as unknown[]).forEach((element, index) => {
      const result = this.validateElement(element, index);
      
      errors.push(...result.errors);
      warnings.push(...result.warnings);

      if (result.recovered) {
        recoveredElements.push(result.recovered);
        
        if (result.wasRecovered) {
          recoveredCount++;
        } else {
          validElements++;
        }
      } else {
        skippedElements++;
      }
    });

    // تحديد صحة الملف
    const criticalErrors = errors.filter(e => !e.recoverable);
    const isValid = criticalErrors.length === 0 && recoveredElements.length > 0;

    return {
      valid: isValid,
      errors,
      warnings,
      recoveredElements: recoveredElements.length > 0 ? recoveredElements : undefined,
      stats: {
        totalElements,
        validElements,
        recoveredElements: recoveredCount,
        skippedElements,
      },
    };
  }

  /**
   * التحقق من عنصر واحد
   */
  private validateElement(element: unknown, index: number): {
    recovered: ExportableElement | null;
    wasRecovered: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let wasRecovered = false;

    if (!element || typeof element !== 'object') {
      errors.push({
        code: 'INVALID_ELEMENT',
        message: `العنصر ${index} ليس كائنًا صالحًا`,
        elementIndex: index,
        recoverable: false,
      });
      
      return { recovered: null, wasRecovered: false, errors, warnings };
    }

    const el = { ...element } as Record<string, unknown>;

    // التحقق من النوع
    if (!el.type || typeof el.type !== 'string') {
      warnings.push({
        code: 'MISSING_TYPE',
        message: `العنصر ${index} يفتقد نوعًا`,
        elementIndex: index,
        field: 'type',
        suggestion: 'سيتم استخدام "shape" كنوع افتراضي',
      });
      el.type = 'shape';
      wasRecovered = true;
    } else if (!VALID_ELEMENT_TYPES.includes(el.type as string)) {
      warnings.push({
        code: 'UNKNOWN_TYPE',
        message: `العنصر ${index} له نوع غير معروف: ${el.type}`,
        elementIndex: index,
        field: 'type',
        suggestion: 'سيتم تحويله إلى "shape"',
      });
      el.type = 'shape';
      wasRecovered = true;
    }

    // التحقق من الموضع
    if (!el.position || typeof el.position !== 'object') {
      warnings.push({
        code: 'MISSING_POSITION',
        message: `العنصر ${index} يفتقد موضعًا`,
        elementIndex: index,
        field: 'position',
        suggestion: 'سيتم استخدام الموضع الافتراضي (0, 0)',
      });
      el.position = { x: 0, y: 0 };
      wasRecovered = true;
    } else {
      const pos = el.position as Record<string, unknown>;
      
      if (typeof pos.x !== 'number' || isNaN(pos.x)) {
        pos.x = 0;
        wasRecovered = true;
      }
      if (typeof pos.y !== 'number' || isNaN(pos.y)) {
        pos.y = 0;
        wasRecovered = true;
      }
    }

    // التحقق من الحجم
    if (!el.size || typeof el.size !== 'object') {
      warnings.push({
        code: 'MISSING_SIZE',
        message: `العنصر ${index} يفتقد حجمًا`,
        elementIndex: index,
        field: 'size',
        suggestion: 'سيتم استخدام الحجم الافتراضي (100x100)',
      });
      el.size = { width: 100, height: 100 };
      wasRecovered = true;
    } else {
      const size = el.size as Record<string, unknown>;
      
      if (typeof size.width !== 'number' || isNaN(size.width) || size.width <= 0) {
        size.width = 100;
        wasRecovered = true;
      }
      if (typeof size.height !== 'number' || isNaN(size.height) || size.height <= 0) {
        size.height = 100;
        wasRecovered = true;
      }
    }

    // التحقق من المعرّف
    if (!el.id || typeof el.id !== 'string') {
      el.id = `recovered_${index}_${Date.now()}`;
      wasRecovered = true;
    }

    // التحقق من الدوران
    if (el.rotation !== undefined && (typeof el.rotation !== 'number' || isNaN(el.rotation as number))) {
      el.rotation = 0;
      wasRecovered = true;
    }

    // بناء العنصر المسترد
    const recovered: ExportableElement = {
      id: String(el.id),
      type: String(el.type),
      position: el.position as { x: number; y: number },
      size: el.size as { width: number; height: number },
      content: el.content as string | undefined,
      style: el.style as Record<string, unknown> | undefined,
      rotation: el.rotation as number | undefined,
      metadata: el.metadata as Record<string, unknown> | undefined,
    };

    return { recovered, wasRecovered, errors, warnings };
  }

  /**
   * التحقق السريع من صحة البيانات
   */
  quickValidate(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const obj = data as Record<string, unknown>;
    
    return (
      (Array.isArray(obj.elements) && obj.elements.length > 0) ||
      (Array.isArray(obj.widgets) && obj.widgets.length > 0) ||
      (Array.isArray(obj.objects) && obj.objects.length > 0)
    );
  }
}

export const importValidator = new ImportValidator();
