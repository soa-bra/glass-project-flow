/**
 * بروتوكول التعاون - Sprint 7
 * يحدد أنواع العمليات والأحداث للتزامن
 */

// أنواع العمليات
export type OperationType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'move'
  | 'resize'
  | 'style'
  | 'lock'
  | 'unlock'
  | 'batch';

// حدث التعاون
export interface CollabOperation {
  id: string;
  type: OperationType;
  elementId: string;
  userId: string;
  boardId: string;
  timestamp: number;
  version: number;
  payload: Record<string, unknown>;
  parentVersion?: number;
}

// رسالة البروتوكول
export type ProtocolMessageType = 
  | 'operation'
  | 'ack'
  | 'sync_request'
  | 'sync_response'
  | 'presence_update'
  | 'cursor_move'
  | 'selection_change'
  | 'conflict'
  | 'rollback';

export interface ProtocolMessage {
  type: ProtocolMessageType;
  messageId: string;
  userId: string;
  boardId: string;
  timestamp: number;
  payload: unknown;
}

// رسالة العملية
export interface OperationMessage extends ProtocolMessage {
  type: 'operation';
  payload: CollabOperation;
}

// رسالة التأكيد
export interface AckMessage extends ProtocolMessage {
  type: 'ack';
  payload: {
    operationId: string;
    serverVersion: number;
    success: boolean;
    error?: string;
  };
}

// رسالة طلب المزامنة
export interface SyncRequestMessage extends ProtocolMessage {
  type: 'sync_request';
  payload: {
    lastKnownVersion: number;
  };
}

// رسالة استجابة المزامنة
export interface SyncResponseMessage extends ProtocolMessage {
  type: 'sync_response';
  payload: {
    operations: CollabOperation[];
    currentVersion: number;
    fullState?: Record<string, unknown>;
  };
}

// رسالة الحضور
export interface PresenceMessage extends ProtocolMessage {
  type: 'presence_update';
  payload: {
    status: 'online' | 'away' | 'offline';
    cursor?: { x: number; y: number };
    selection?: string[];
    color: string;
    name: string;
  };
}

// رسالة التعارض
export interface ConflictMessage extends ProtocolMessage {
  type: 'conflict';
  payload: {
    localOperation: CollabOperation;
    serverOperation: CollabOperation;
    resolution: 'server_wins' | 'client_wins' | 'merge';
  };
}

// إنشاء معرف فريد
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// إنشاء معرف عملية
export function generateOperationId(): string {
  return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// إنشاء رسالة عملية
export function createOperationMessage(
  operation: Omit<CollabOperation, 'id' | 'timestamp'>,
  boardId: string,
  userId: string
): OperationMessage {
  return {
    type: 'operation',
    messageId: generateMessageId(),
    userId,
    boardId,
    timestamp: Date.now(),
    payload: {
      ...operation,
      id: generateOperationId(),
      timestamp: Date.now()
    }
  };
}

// تحويل العملية للإرسال
export function serializeOperation(op: CollabOperation): string {
  return JSON.stringify(op);
}

// تحويل العملية من النص
export function deserializeOperation(data: string): CollabOperation | null {
  try {
    return JSON.parse(data);
  } catch {
    console.error('Failed to deserialize operation');
    return null;
  }
}
