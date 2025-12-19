/**
 * مدير التزامن - Sprint 7
 * إدارة العمليات المعلقة والتزامن مع الخادم
 */

import type { CollabOperation, ProtocolMessage } from './protocol';
import { ConflictResolver, conflictResolver } from './conflictResolver';

export interface SyncState {
  localVersion: number;
  serverVersion: number;
  pendingOperations: CollabOperation[];
  acknowledgedOperations: Set<string>;
  lastSyncTime: number;
  isOnline: boolean;
}

export type SyncEventType = 
  | 'operation_sent'
  | 'operation_acknowledged'
  | 'operation_failed'
  | 'sync_started'
  | 'sync_completed'
  | 'conflict_detected'
  | 'conflict_resolved'
  | 'connection_lost'
  | 'connection_restored';

export interface SyncEvent {
  type: SyncEventType;
  timestamp: number;
  data?: unknown;
}

/**
 * مدير التزامن
 */
export class SyncManager {
  private state: SyncState = {
    localVersion: 0,
    serverVersion: 0,
    pendingOperations: [],
    acknowledgedOperations: new Set(),
    lastSyncTime: 0,
    isOnline: true
  };

  private conflictResolver: ConflictResolver;
  private eventListeners: Map<SyncEventType, Set<(event: SyncEvent) => void>> = new Map();
  private operationBuffer: CollabOperation[] = [];
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private bufferDelay = 50; // ms

  constructor(resolver?: ConflictResolver) {
    this.conflictResolver = resolver || conflictResolver;
  }

  /**
   * إضافة عملية للتزامن
   */
  addOperation(operation: CollabOperation): void {
    // إضافة للمخزن المؤقت
    this.operationBuffer.push(operation);
    this.state.localVersion++;
    operation.version = this.state.localVersion;

    // جدولة الإرسال
    this.scheduleFlush();
  }

  /**
   * جدولة إرسال العمليات المخزنة
   */
  private scheduleFlush(): void {
    if (this.flushTimeout) return;

    this.flushTimeout = setTimeout(() => {
      this.flushOperations();
      this.flushTimeout = null;
    }, this.bufferDelay);
  }

  /**
   * إرسال العمليات المخزنة
   */
  private flushOperations(): void {
    if (this.operationBuffer.length === 0) return;

    const operations = [...this.operationBuffer];
    this.operationBuffer = [];

    // دمج العمليات المتتالية على نفس العنصر
    const mergedOps = this.mergeConsecutiveOperations(operations);

    // إضافة للعمليات المعلقة
    this.state.pendingOperations.push(...mergedOps);

    // إرسال الحدث
    this.emit('operation_sent', { operations: mergedOps });
  }

  /**
   * دمج العمليات المتتالية
   */
  private mergeConsecutiveOperations(ops: CollabOperation[]): CollabOperation[] {
    if (ops.length <= 1) return ops;

    const grouped = new Map<string, CollabOperation[]>();

    for (const op of ops) {
      const existing = grouped.get(op.elementId) || [];
      existing.push(op);
      grouped.set(op.elementId, existing);
    }

    const merged: CollabOperation[] = [];

    for (const [elementId, elementOps] of grouped) {
      if (elementOps.length === 1) {
        merged.push(elementOps[0]);
        continue;
      }

      // دمج عمليات نفس العنصر
      const lastOp = elementOps[elementOps.length - 1];
      const mergedPayload: Record<string, unknown> = {};

      for (const op of elementOps) {
        Object.assign(mergedPayload, op.payload);
      }

      merged.push({
        ...lastOp,
        payload: mergedPayload
      });
    }

    return merged;
  }

  /**
   * استلام تأكيد من الخادم
   */
  acknowledgeOperation(operationId: string, serverVersion: number): void {
    this.state.acknowledgedOperations.add(operationId);
    this.state.serverVersion = Math.max(this.state.serverVersion, serverVersion);

    // إزالة من المعلقة
    this.state.pendingOperations = this.state.pendingOperations.filter(
      op => op.id !== operationId
    );

    this.emit('operation_acknowledged', { operationId, serverVersion });
  }

  /**
   * استلام عملية من الخادم
   */
  receiveRemoteOperation(operation: CollabOperation): CollabOperation | null {
    // تحقق من التعارضات مع العمليات المعلقة
    for (const pendingOp of this.state.pendingOperations) {
      if (pendingOp.elementId === operation.elementId) {
        const result = this.conflictResolver.resolve(pendingOp, operation);
        
        this.emit('conflict_detected', {
          local: pendingOp,
          remote: operation
        });

        if (result.winningOperation.id === operation.id) {
          // العملية البعيدة فازت
          this.state.pendingOperations = this.state.pendingOperations.filter(
            op => op.id !== pendingOp.id
          );
        }

        this.emit('conflict_resolved', result);
        
        return result.winningOperation;
      }
    }

    this.state.serverVersion = Math.max(this.state.serverVersion, operation.version);
    return operation;
  }

  /**
   * طلب مزامنة كاملة
   */
  requestFullSync(): { lastVersion: number } {
    this.emit('sync_started', {});
    return { lastVersion: this.state.serverVersion };
  }

  /**
   * استلام استجابة المزامنة
   */
  handleSyncResponse(
    operations: CollabOperation[],
    currentVersion: number
  ): CollabOperation[] {
    this.state.serverVersion = currentVersion;
    this.state.lastSyncTime = Date.now();

    // تطبيق العمليات المفقودة
    const applicableOps: CollabOperation[] = [];

    for (const op of operations) {
      const result = this.receiveRemoteOperation(op);
      if (result) {
        applicableOps.push(result);
      }
    }

    // إعادة إرسال العمليات المعلقة
    if (this.state.pendingOperations.length > 0) {
      this.emit('operation_sent', { operations: this.state.pendingOperations });
    }

    this.emit('sync_completed', { 
      appliedOperations: applicableOps.length,
      currentVersion 
    });

    return applicableOps;
  }

  /**
   * تغيير حالة الاتصال
   */
  setOnlineStatus(isOnline: boolean): void {
    const wasOffline = !this.state.isOnline;
    this.state.isOnline = isOnline;

    if (!isOnline) {
      this.emit('connection_lost', {});
    } else if (wasOffline) {
      this.emit('connection_restored', {});
      // طلب مزامنة بعد العودة
      this.requestFullSync();
    }
  }

  /**
   * الحصول على الحالة
   */
  getState(): Readonly<SyncState> {
    return { ...this.state };
  }

  /**
   * الاشتراك في الأحداث
   */
  on(event: SyncEventType, callback: (event: SyncEvent) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);

    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  /**
   * إرسال حدث
   */
  private emit(type: SyncEventType, data?: unknown): void {
    const event: SyncEvent = { type, timestamp: Date.now(), data };
    this.eventListeners.get(type)?.forEach(cb => cb(event));
  }

  /**
   * إعادة تعيين
   */
  reset(): void {
    this.state = {
      localVersion: 0,
      serverVersion: 0,
      pendingOperations: [],
      acknowledgedOperations: new Set(),
      lastSyncTime: 0,
      isOnline: true
    };
    this.operationBuffer = [];
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
}

// مثيل افتراضي
export const syncManager = new SyncManager();
