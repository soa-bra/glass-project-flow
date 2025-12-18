/**
 * Operational Transform Engine
 * نظام تحويل العمليات للتعاون الفوري
 */

// أنواع العمليات الأساسية
export type OperationType = 
  | 'insert'      // إضافة عنصر
  | 'delete'      // حذف عنصر
  | 'update'      // تحديث خصائص
  | 'move'        // تحريك عنصر
  | 'resize'      // تغيير حجم
  | 'rotate'      // تدوير
  | 'group'       // تجميع
  | 'ungroup'     // فك تجميع
  | 'reorder'     // إعادة ترتيب الطبقات
  | 'style'       // تغيير الأنماط
  | 'connect'     // ربط موصل
  | 'disconnect'; // فك ربط موصل

// واجهة العملية الأساسية
export interface Operation {
  id: string;
  type: OperationType;
  timestamp: number;
  userId: string;
  targetId: string | string[];
  data: Record<string, any>;
  metadata?: {
    sessionId?: string;
    deviceId?: string;
    source?: 'local' | 'remote';
  };
}

// عملية إضافة عنصر
export interface InsertOperation extends Operation {
  type: 'insert';
  data: {
    element: Record<string, any>;
    index?: number;
  };
}

// عملية حذف عنصر
export interface DeleteOperation extends Operation {
  type: 'delete';
  data: {
    previousState: Record<string, any>;
  };
}

// عملية تحديث
export interface UpdateOperation extends Operation {
  type: 'update';
  data: {
    before: Record<string, any>;
    after: Record<string, any>;
    path?: string[];
  };
}

// عملية تحريك
export interface MoveOperation extends Operation {
  type: 'move';
  data: {
    before: { x: number; y: number };
    after: { x: number; y: number };
  };
}

// عملية تغيير الحجم
export interface ResizeOperation extends Operation {
  type: 'resize';
  data: {
    before: { width: number; height: number };
    after: { width: number; height: number };
  };
}

// نتيجة التحويل
export interface TransformResult {
  op1Prime: Operation | null;
  op2Prime: Operation | null;
}

// محرك التحويل التشغيلي
class OperationalTransformEngine {
  private vectorClock: Map<string, number> = new Map();
  
  /**
   * توليد معرف فريد للعملية
   */
  generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * تحديث الساعة المتجهة
   */
  incrementClock(userId: string): number {
    const current = this.vectorClock.get(userId) || 0;
    const next = current + 1;
    this.vectorClock.set(userId, next);
    return next;
  }
  
  /**
   * التحويل التشغيلي الأساسي
   * يحول عمليتين متزامنتين لتكونا متسقتين
   */
  transform(op1: Operation, op2: Operation): TransformResult {
    // نفس العنصر المستهدف
    if (this.sameTarget(op1.targetId, op2.targetId)) {
      return this.transformSameTarget(op1, op2);
    }
    
    // عناصر مختلفة - لا حاجة للتحويل
    return {
      op1Prime: op1,
      op2Prime: op2
    };
  }
  
  /**
   * تحويل عمليات على نفس العنصر
   */
  private transformSameTarget(op1: Operation, op2: Operation): TransformResult {
    // Delete vs anything
    if (op1.type === 'delete') {
      return {
        op1Prime: op1,
        op2Prime: null // العنصر محذوف، تجاهل op2
      };
    }
    
    if (op2.type === 'delete') {
      return {
        op1Prime: null,
        op2Prime: op2
      };
    }
    
    // Insert vs Insert - حل التعارض بالـ timestamp
    if (op1.type === 'insert' && op2.type === 'insert') {
      return this.transformInsertInsert(op1 as InsertOperation, op2 as InsertOperation);
    }
    
    // Update vs Update
    if (op1.type === 'update' && op2.type === 'update') {
      return this.transformUpdateUpdate(op1 as UpdateOperation, op2 as UpdateOperation);
    }
    
    // Move vs Move
    if (op1.type === 'move' && op2.type === 'move') {
      return this.transformMoveMove(op1 as MoveOperation, op2 as MoveOperation);
    }
    
    // افتراضي: الأحدث يفوز
    if (op1.timestamp > op2.timestamp) {
      return { op1Prime: op1, op2Prime: null };
    }
    return { op1Prime: null, op2Prime: op2 };
  }
  
  /**
   * تحويل عمليتي إضافة
   */
  private transformInsertInsert(op1: InsertOperation, op2: InsertOperation): TransformResult {
    const idx1 = op1.data.index ?? 0;
    const idx2 = op2.data.index ?? 0;
    
    if (idx1 <= idx2) {
      return {
        op1Prime: op1,
        op2Prime: {
          ...op2,
          data: { ...op2.data, index: idx2 + 1 }
        }
      };
    } else {
      return {
        op1Prime: {
          ...op1,
          data: { ...op1.data, index: idx1 + 1 }
        },
        op2Prime: op2
      };
    }
  }
  
  /**
   * تحويل عمليتي تحديث
   */
  private transformUpdateUpdate(op1: UpdateOperation, op2: UpdateOperation): TransformResult {
    const path1 = op1.data.path || [];
    const path2 = op2.data.path || [];
    
    // مسارات مختلفة - كلاهما يطبق
    if (!this.pathsOverlap(path1, path2)) {
      return {
        op1Prime: op1,
        op2Prime: op2
      };
    }
    
    // نفس المسار - الأحدث يفوز
    if (op1.timestamp >= op2.timestamp) {
      return {
        op1Prime: op1,
        op2Prime: null
      };
    }
    
    return {
      op1Prime: null,
      op2Prime: op2
    };
  }
  
  /**
   * تحويل عمليتي تحريك
   */
  private transformMoveMove(op1: MoveOperation, op2: MoveOperation): TransformResult {
    // دمج الحركات - استخدام المتوسط أو الأحدث
    if (op1.timestamp >= op2.timestamp) {
      return {
        op1Prime: op1,
        op2Prime: null
      };
    }
    
    return {
      op1Prime: null,
      op2Prime: op2
    };
  }
  
  /**
   * التحقق من تداخل المسارات
   */
  private pathsOverlap(path1: string[], path2: string[]): boolean {
    const minLen = Math.min(path1.length, path2.length);
    for (let i = 0; i < minLen; i++) {
      if (path1[i] !== path2[i]) return false;
    }
    return true;
  }
  
  /**
   * التحقق من تطابق الهدف
   */
  private sameTarget(target1: string | string[], target2: string | string[]): boolean {
    const arr1 = Array.isArray(target1) ? target1 : [target1];
    const arr2 = Array.isArray(target2) ? target2 : [target2];
    return arr1.some(t1 => arr2.includes(t1));
  }
  
  /**
   * عكس عملية (للـ Undo)
   */
  invertOperation(op: Operation): Operation {
    const inverted: Operation = {
      ...op,
      id: this.generateOperationId(),
      timestamp: Date.now()
    };
    
    switch (op.type) {
      case 'insert':
        return {
          ...inverted,
          type: 'delete',
          data: { previousState: (op as InsertOperation).data.element }
        };
        
      case 'delete':
        return {
          ...inverted,
          type: 'insert',
          data: { element: (op as DeleteOperation).data.previousState }
        };
        
      case 'update':
        const updateOp = op as UpdateOperation;
        return {
          ...inverted,
          type: 'update',
          data: {
            before: updateOp.data.after,
            after: updateOp.data.before,
            path: updateOp.data.path
          }
        };
        
      case 'move':
        const moveOp = op as MoveOperation;
        return {
          ...inverted,
          type: 'move',
          data: {
            before: moveOp.data.after,
            after: moveOp.data.before
          }
        };
        
      case 'resize':
        const resizeOp = op as ResizeOperation;
        return {
          ...inverted,
          type: 'resize',
          data: {
            before: resizeOp.data.after,
            after: resizeOp.data.before
          }
        };
        
      default:
        return inverted;
    }
  }
  
  /**
   * دمج عمليات متتالية على نفس العنصر
   */
  composeOperations(ops: Operation[]): Operation[] {
    if (ops.length <= 1) return ops;
    
    const composed: Operation[] = [];
    let current = ops[0];
    
    for (let i = 1; i < ops.length; i++) {
      const next = ops[i];
      
      if (this.canCompose(current, next)) {
        current = this.compose(current, next);
      } else {
        composed.push(current);
        current = next;
      }
    }
    
    composed.push(current);
    return composed;
  }
  
  /**
   * التحقق من إمكانية الدمج
   */
  private canCompose(op1: Operation, op2: Operation): boolean {
    if (!this.sameTarget(op1.targetId, op2.targetId)) return false;
    if (op1.type !== op2.type) return false;
    
    // دمج فقط العمليات المتتالية خلال ثانية
    return Math.abs(op2.timestamp - op1.timestamp) < 1000;
  }
  
  /**
   * دمج عمليتين
   */
  private compose(op1: Operation, op2: Operation): Operation {
    switch (op1.type) {
      case 'move':
        return {
          ...op2,
          data: {
            before: (op1 as MoveOperation).data.before,
            after: (op2 as MoveOperation).data.after
          }
        };
        
      case 'update':
        return {
          ...op2,
          data: {
            before: (op1 as UpdateOperation).data.before,
            after: (op2 as UpdateOperation).data.after,
            path: (op2 as UpdateOperation).data.path
          }
        };
        
      default:
        return op2;
    }
  }
}

// تصدير instance واحد
export const otEngine = new OperationalTransformEngine();
