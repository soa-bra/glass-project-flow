/**
 * محلل التعارضات - Sprint 7
 * استراتيجيات حل التعارضات بين العمليات المتزامنة
 */

import type { CollabOperation } from './protocol';

export type ConflictResolutionStrategy = 
  | 'last_write_wins'
  | 'first_write_wins'
  | 'merge'
  | 'server_priority'
  | 'client_priority';

export interface ConflictResult {
  resolved: boolean;
  winningOperation: CollabOperation;
  mergedPayload?: Record<string, unknown>;
  discardedOperations: CollabOperation[];
}

/**
 * محلل التعارضات
 */
export class ConflictResolver {
  private strategy: ConflictResolutionStrategy = 'last_write_wins';

  constructor(strategy?: ConflictResolutionStrategy) {
    if (strategy) {
      this.strategy = strategy;
    }
  }

  /**
   * حل تعارض بين عمليتين
   */
  resolve(
    localOp: CollabOperation,
    remoteOp: CollabOperation
  ): ConflictResult {
    // لا تعارض إذا كانت العناصر مختلفة
    if (localOp.elementId !== remoteOp.elementId) {
      return {
        resolved: true,
        winningOperation: localOp,
        discardedOperations: []
      };
    }

    // لا تعارض إذا كانت العمليات من نفس المستخدم
    if (localOp.userId === remoteOp.userId) {
      return {
        resolved: true,
        winningOperation: localOp.timestamp > remoteOp.timestamp ? localOp : remoteOp,
        discardedOperations: [localOp.timestamp > remoteOp.timestamp ? remoteOp : localOp]
      };
    }

    switch (this.strategy) {
      case 'last_write_wins':
        return this.resolveLastWriteWins(localOp, remoteOp);
      
      case 'first_write_wins':
        return this.resolveFirstWriteWins(localOp, remoteOp);
      
      case 'merge':
        return this.resolveMerge(localOp, remoteOp);
      
      case 'server_priority':
        return {
          resolved: true,
          winningOperation: remoteOp,
          discardedOperations: [localOp]
        };
      
      case 'client_priority':
        return {
          resolved: true,
          winningOperation: localOp,
          discardedOperations: [remoteOp]
        };
      
      default:
        return this.resolveLastWriteWins(localOp, remoteOp);
    }
  }

  /**
   * آخر كتابة تفوز
   */
  private resolveLastWriteWins(
    localOp: CollabOperation,
    remoteOp: CollabOperation
  ): ConflictResult {
    if (localOp.timestamp >= remoteOp.timestamp) {
      return {
        resolved: true,
        winningOperation: localOp,
        discardedOperations: [remoteOp]
      };
    }
    return {
      resolved: true,
      winningOperation: remoteOp,
      discardedOperations: [localOp]
    };
  }

  /**
   * أول كتابة تفوز
   */
  private resolveFirstWriteWins(
    localOp: CollabOperation,
    remoteOp: CollabOperation
  ): ConflictResult {
    if (localOp.timestamp <= remoteOp.timestamp) {
      return {
        resolved: true,
        winningOperation: localOp,
        discardedOperations: [remoteOp]
      };
    }
    return {
      resolved: true,
      winningOperation: remoteOp,
      discardedOperations: [localOp]
    };
  }

  /**
   * دمج العمليات
   */
  private resolveMerge(
    localOp: CollabOperation,
    remoteOp: CollabOperation
  ): ConflictResult {
    // عمليات الحذف لها الأولوية
    if (localOp.type === 'delete' || remoteOp.type === 'delete') {
      const deleteOp = localOp.type === 'delete' ? localOp : remoteOp;
      return {
        resolved: true,
        winningOperation: deleteOp,
        discardedOperations: [localOp.type === 'delete' ? remoteOp : localOp]
      };
    }

    // دمج التحديثات
    if (localOp.type === 'update' && remoteOp.type === 'update') {
      const mergedPayload = this.mergePayloads(localOp.payload, remoteOp.payload);
      const winningOp: CollabOperation = {
        ...localOp,
        payload: mergedPayload,
        timestamp: Math.max(localOp.timestamp, remoteOp.timestamp)
      };
      
      return {
        resolved: true,
        winningOperation: winningOp,
        mergedPayload,
        discardedOperations: []
      };
    }

    // دمج الحركة والتحجيم
    if (
      (localOp.type === 'move' && remoteOp.type === 'resize') ||
      (localOp.type === 'resize' && remoteOp.type === 'move')
    ) {
      const mergedPayload = { ...localOp.payload, ...remoteOp.payload };
      const winningOp: CollabOperation = {
        ...localOp,
        type: 'update',
        payload: mergedPayload,
        timestamp: Math.max(localOp.timestamp, remoteOp.timestamp)
      };
      
      return {
        resolved: true,
        winningOperation: winningOp,
        mergedPayload,
        discardedOperations: []
      };
    }

    // افتراضي: آخر كتابة تفوز
    return this.resolveLastWriteWins(localOp, remoteOp);
  }

  /**
   * دمج الحمولات
   */
  private mergePayloads(
    local: Record<string, unknown>,
    remote: Record<string, unknown>
  ): Record<string, unknown> {
    const merged: Record<string, unknown> = {};
    const allKeys = new Set([...Object.keys(local), ...Object.keys(remote)]);

    for (const key of allKeys) {
      if (key in local && key in remote) {
        // كلاهما لديه المفتاح - نختار الأحدث أو ندمج
        if (typeof local[key] === 'object' && typeof remote[key] === 'object') {
          merged[key] = {
            ...(local[key] as object),
            ...(remote[key] as object)
          };
        } else {
          // نفترض أن remote أحدث
          merged[key] = remote[key];
        }
      } else if (key in local) {
        merged[key] = local[key];
      } else {
        merged[key] = remote[key];
      }
    }

    return merged;
  }

  /**
   * تغيير الاستراتيجية
   */
  setStrategy(strategy: ConflictResolutionStrategy): void {
    this.strategy = strategy;
  }

  /**
   * الحصول على الاستراتيجية الحالية
   */
  getStrategy(): ConflictResolutionStrategy {
    return this.strategy;
  }
}

// مثيل افتراضي
export const conflictResolver = new ConflictResolver('merge');
