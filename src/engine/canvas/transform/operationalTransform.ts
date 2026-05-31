/**
 * Operational Transform - نظام تحويل العمليات
 * @module engine/canvas/transform
 */

/**
 * أنواع العمليات
 */
export type OperationType = 'insert' | 'delete' | 'update' | 'move' | 'resize';

/**
 * عملية
 */
export interface Operation {
  id: string;
  type: OperationType;
  timestamp: number;
  userId: string;
  targetId: string | string[];
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * نتيجة التحويل
 */
export interface TransformResult {
  operation: Operation;
  transformed: boolean;
  conflict?: string;
}

/**
 * محرك تحويل العمليات
 */
export class OTEngine {
  private operationCounter = 0;

  /**
   * توليد معرّف عملية
   */
  generateOperationId(): string {
    return `op_${Date.now()}_${++this.operationCounter}`;
  }

  /**
   * تحويل عملية بناءً على عملية أخرى
   */
  transform(op1: Operation, op2: Operation): TransformResult {
    // إذا كانت العمليتان على عناصر مختلفة، لا حاجة للتحويل
    if (!this.targetsOverlap(op1.targetId, op2.targetId)) {
      return { operation: op1, transformed: false };
    }

    // تحويل حسب نوع العمليتين
    switch (op1.type) {
      case 'insert':
        return this.transformInsert(op1, op2);
      case 'delete':
        return this.transformDelete(op1, op2);
      case 'update':
        return this.transformUpdate(op1, op2);
      case 'move':
        return this.transformMove(op1, op2);
      case 'resize':
        return this.transformResize(op1, op2);
      default:
        return { operation: op1, transformed: false };
    }
  }

  /**
   * التحقق من تداخل الأهداف
   */
  private targetsOverlap(target1: string | string[], target2: string | string[]): boolean {
    const ids1 = Array.isArray(target1) ? target1 : [target1];
    const ids2 = Array.isArray(target2) ? target2 : [target2];
    
    return ids1.some(id => ids2.includes(id));
  }

  /**
   * تحويل عملية إدراج
   */
  private transformInsert(op1: Operation, op2: Operation): TransformResult {
    if (op2.type === 'delete') {
      // إذا تم حذف العنصر الهدف، إلغاء الإدراج
      return {
        operation: op1,
        transformed: true,
        conflict: 'target_deleted',
      };
    }
    
    return { operation: op1, transformed: false };
  }

  /**
   * تحويل عملية حذف
   */
  private transformDelete(op1: Operation, op2: Operation): TransformResult {
    if (op2.type === 'delete') {
      // إذا تم حذف العنصر مسبقاً، تجاهل العملية
      return {
        operation: op1,
        transformed: true,
        conflict: 'already_deleted',
      };
    }
    
    return { operation: op1, transformed: false };
  }

  /**
   * تحويل عملية تحديث
   */
  private transformUpdate(op1: Operation, op2: Operation): TransformResult {
    if (op2.type === 'delete') {
      return {
        operation: op1,
        transformed: true,
        conflict: 'target_deleted',
      };
    }

    if (op2.type === 'update') {
      // دمج التحديثات - الأحدث يفوز
      if (op2.timestamp > op1.timestamp) {
        return {
          operation: {
            ...op1,
            data: {
              ...op1.data,
              after: { ...op1.data.after, ...op2.data.after },
            },
          },
          transformed: true,
        };
      }
    }
    
    return { operation: op1, transformed: false };
  }

  /**
   * تحويل عملية تحريك
   */
  private transformMove(op1: Operation, op2: Operation): TransformResult {
    if (op2.type === 'delete') {
      return {
        operation: op1,
        transformed: true,
        conflict: 'target_deleted',
      };
    }

    if (op2.type === 'move') {
      // تطبيق الموضع النهائي من العملية الأحدث
      if (op2.timestamp > op1.timestamp) {
        return {
          operation: {
            ...op1,
            data: {
              before: op2.data.after,
              after: op1.data.after,
            },
          },
          transformed: true,
        };
      }
    }
    
    return { operation: op1, transformed: false };
  }

  /**
   * تحويل عملية تغيير الحجم
   */
  private transformResize(op1: Operation, op2: Operation): TransformResult {
    if (op2.type === 'delete') {
      return {
        operation: op1,
        transformed: true,
        conflict: 'target_deleted',
      };
    }

    if (op2.type === 'resize') {
      // تطبيق الحجم النهائي من العملية الأحدث
      if (op2.timestamp > op1.timestamp) {
        return {
          operation: {
            ...op1,
            data: {
              before: op2.data.after,
              after: op1.data.after,
            },
          },
          transformed: true,
        };
      }
    }
    
    return { operation: op1, transformed: false };
  }

  /**
   * تطبيق سلسلة تحويلات
   */
  transformChain(operation: Operation, operations: Operation[]): Operation {
    let result = operation;
    
    for (const op of operations) {
      const transformed = this.transform(result, op);
      result = transformed.operation;
    }
    
    return result;
  }

  /**
   * التحقق من قابلية الدمج
   */
  canMerge(op1: Operation, op2: Operation): boolean {
    // نفس المستخدم، نفس الهدف، نفس النوع، خلال ثانية واحدة
    return (
      op1.userId === op2.userId &&
      this.targetsOverlap(op1.targetId, op2.targetId) &&
      op1.type === op2.type &&
      Math.abs(op1.timestamp - op2.timestamp) < 1000
    );
  }

  /**
   * دمج عمليتين
   */
  merge(op1: Operation, op2: Operation): Operation | null {
    if (!this.canMerge(op1, op2)) return null;

    return {
      ...op2,
      data: {
        before: op1.data.before,
        after: op2.data.after,
      },
    };
  }
}

/**
 * مثيل المحرك الافتراضي
 */
export const otEngine = new OTEngine();
