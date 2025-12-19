/**
 * Realtime API - Sprint 7
 * محول WebSocket للتزامن الفوري
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { CollabOperation } from '@/core/collab/protocol';

export type RealtimeEventType = 
  | 'connected'
  | 'disconnected'
  | 'operation'
  | 'presence'
  | 'cursor'
  | 'selection'
  | 'error';

export interface RealtimeEvent {
  type: RealtimeEventType;
  payload: unknown;
  userId?: string;
  timestamp: number;
}

export type RealtimeCallback = (event: RealtimeEvent) => void;

/**
 * مدير الاتصال الفوري
 */
export class RealtimeManager {
  private channel: RealtimeChannel | null = null;
  private boardId: string | null = null;
  private userId: string | null = null;
  private listeners: Map<RealtimeEventType, Set<RealtimeCallback>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * الاتصال بلوحة
   */
  async connect(boardId: string, userId: string): Promise<boolean> {
    if (this.channel) {
      await this.disconnect();
    }

    this.boardId = boardId;
    this.userId = userId;

    try {
      this.channel = supabase.channel(`board:${boardId}`, {
        config: {
          presence: { key: userId },
          broadcast: { self: false }
        }
      });

      // الاشتراك في الأحداث
      this.channel
        .on('presence', { event: 'sync' }, () => {
          const state = this.channel?.presenceState();
          this.emit('presence', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          this.emit('presence', { type: 'join', userId: key, presences: newPresences });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          this.emit('presence', { type: 'leave', userId: key, presences: leftPresences });
        })
        .on('broadcast', { event: 'operation' }, ({ payload }) => {
          this.emit('operation', payload);
        })
        .on('broadcast', { event: 'cursor' }, ({ payload }) => {
          this.emit('cursor', payload);
        })
        .on('broadcast', { event: 'selection' }, ({ payload }) => {
          this.emit('selection', payload);
        });

      this.channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected', { boardId, userId });
        }
      });
      
      return true;
    } catch (error) {
      console.error('Realtime connection error:', error);
      this.emit('error', { error });
      return false;
    }
  }

  /**
   * قطع الاتصال
   */
  async disconnect(): Promise<void> {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.isConnected = false;
    this.emit('disconnected', {});
  }

  /**
   * إرسال عملية
   */
  sendOperation(operation: CollabOperation): void {
    if (!this.channel || !this.isConnected) {
      console.warn('Not connected, operation queued');
      return;
    }

    this.channel.send({
      type: 'broadcast',
      event: 'operation',
      payload: operation
    });
  }

  /**
   * إرسال موقع المؤشر
   */
  sendCursor(x: number, y: number): void {
    if (!this.channel || !this.isConnected) return;

    this.channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        userId: this.userId,
        x,
        y,
        timestamp: Date.now()
      }
    });
  }

  /**
   * إرسال التحديد
   */
  sendSelection(elementIds: string[]): void {
    if (!this.channel || !this.isConnected) return;

    this.channel.send({
      type: 'broadcast',
      event: 'selection',
      payload: {
        userId: this.userId,
        elementIds,
        timestamp: Date.now()
      }
    });
  }

  /**
   * تحديث الحضور
   */
  async updatePresence(data: Record<string, unknown>): Promise<void> {
    if (!this.channel) return;

    await this.channel.track({
      ...data,
      odId: this.userId,
      online_at: new Date().toISOString()
    });
  }

  /**
   * الاشتراك في حدث
   */
  on(event: RealtimeEventType, callback: RealtimeCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * إرسال حدث
   */
  private emit(type: RealtimeEventType, payload: unknown): void {
    const event: RealtimeEvent = {
      type,
      payload,
      userId: this.userId || undefined,
      timestamp: Date.now()
    };

    this.listeners.get(type)?.forEach(cb => cb(event));
  }

  /**
   * حالة الاتصال
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * معرف اللوحة الحالية
   */
  get currentBoardId(): string | null {
    return this.boardId;
  }
}

// مثيل افتراضي
export const realtimeManager = new RealtimeManager();
