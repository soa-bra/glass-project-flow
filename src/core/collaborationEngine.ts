/**
 * Collaboration Engine - Sprint 8
 * نظام التعاون الفوري مع Supabase Realtime
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// أنواع المستخدم المتصل
export interface CollaboratorPresence {
  odId: string;
  boardId: string;
  cursor: { x: number; y: number } | null;
  selection: string[];
  color: string;
  name: string;
  avatar?: string;
  lastSeen: number;
}

// أنواع الأحداث
export type CollaborationEventType = 
  | 'element_created'
  | 'element_updated'
  | 'element_deleted'
  | 'element_moved'
  | 'element_resized'
  | 'cursor_moved'
  | 'selection_changed'
  | 'lock_acquired'
  | 'lock_released';

export interface CollaborationEvent {
  type: CollaborationEventType;
  odId: string;
  boardId: string;
  payload: Record<string, unknown>;
  timestamp: number;
  version: number;
}

// ألوان المستخدمين
const COLLABORATOR_COLORS = [
  '#3DBE8B', // green
  '#3DA8F5', // blue
  '#F6C445', // yellow
  '#E5564D', // red
  '#9B59B6', // purple
  '#E67E22', // orange
  '#1ABC9C', // teal
  '#E91E63', // pink
];

/**
 * Collaboration Engine Class
 * يدير التعاون الفوري بين المستخدمين
 */
export class CollaborationEngine {
  private channel: RealtimeChannel | null = null;
  private boardId: string | null = null;
  private odId: string | null = null;
  private userName: string = 'مستخدم';
  private userColor: string = COLLABORATOR_COLORS[0];
  
  private collaborators: Map<string, CollaboratorPresence> = new Map();
  private elementLocks: Map<string, string> = new Map(); // elementId -> odId
  private eventVersion: number = 0;
  private pendingEvents: CollaborationEvent[] = [];
  
  // Callbacks
  private onCollaboratorsChange?: (collaborators: CollaboratorPresence[]) => void;
  private onRemoteCursorMove?: (odId: string, cursor: { x: number; y: number }) => void;
  private onRemoteElementChange?: (event: CollaborationEvent) => void;
  private onLockChange?: (elementId: string, lockedBy: string | null) => void;
  private onConflict?: (event: CollaborationEvent, localVersion: number) => void;

  /**
   * تهيئة المحرك
   */
  initialize(config: {
    odId: string;
    userName?: string;
    onCollaboratorsChange?: (collaborators: CollaboratorPresence[]) => void;
    onRemoteCursorMove?: (odId: string, cursor: { x: number; y: number }) => void;
    onRemoteElementChange?: (event: CollaborationEvent) => void;
    onLockChange?: (elementId: string, lockedBy: string | null) => void;
    onConflict?: (event: CollaborationEvent, localVersion: number) => void;
  }) {
    this.odId = config.odId;
    this.userName = config.userName || 'مستخدم';
    this.userColor = this.assignColor(config.odId);
    
    this.onCollaboratorsChange = config.onCollaboratorsChange;
    this.onRemoteCursorMove = config.onRemoteCursorMove;
    this.onRemoteElementChange = config.onRemoteElementChange;
    this.onLockChange = config.onLockChange;
    this.onConflict = config.onConflict;
  }

  /**
   * الانضمام إلى لوحة
   */
  async joinBoard(boardId: string): Promise<void> {
    if (this.channel) {
      await this.leaveBoard();
    }

    this.boardId = boardId;
    const channelName = `board:${boardId}`;

    this.channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: this.odId || 'anonymous',
        },
      },
    });

    // الاستماع لتحديثات الحضور
    this.channel.on('presence', { event: 'sync' }, () => {
      this.handlePresenceSync();
    });

    this.channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      this.handlePresenceJoin(key, newPresences);
    });

    this.channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      this.handlePresenceLeave(key, leftPresences);
    });

    // الاستماع لأحداث البث
    this.channel.on('broadcast', { event: 'element_change' }, ({ payload }) => {
      this.handleRemoteElementChange(payload as CollaborationEvent);
    });

    this.channel.on('broadcast', { event: 'cursor_move' }, ({ payload }) => {
      this.handleRemoteCursorMove(payload as { odId: string; cursor: { x: number; y: number } });
    });

    this.channel.on('broadcast', { event: 'lock_change' }, ({ payload }) => {
      this.handleLockChange(payload as { elementId: string; odId: string | null });
    });

    // الاشتراك وتتبع الحضور
    await this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.trackPresence();
      }
    });
  }

  /**
   * مغادرة اللوحة
   */
  async leaveBoard(): Promise<void> {
    if (this.channel) {
      try {
        await this.channel.untrack();
        // ✅ التحقق من وجود القناة قبل إزالتها
        if (this.channel) {
          await supabase.removeChannel(this.channel);
        }
      } catch (err) {
        console.warn('[CollaborationEngine] Error leaving board:', err);
      }
      this.channel = null;
    }
    
    this.boardId = null;
    this.collaborators.clear();
    this.elementLocks.clear();
    this.pendingEvents = [];
  }

  /**
   * تتبع حضور المستخدم
   */
  private async trackPresence(): Promise<void> {
    if (!this.channel || !this.odId) return;

    const presence: CollaboratorPresence = {
      odId: this.odId,
      boardId: this.boardId || '',
      cursor: null,
      selection: [],
      color: this.userColor,
      name: this.userName,
      lastSeen: Date.now(),
    };

    await this.channel.track(presence);
  }

  /**
   * تحديث موقع المؤشر
   */
  async updateCursor(x: number, y: number): Promise<void> {
    if (!this.channel || !this.odId) return;

    // بث موقع المؤشر
    await this.channel.send({
      type: 'broadcast',
      event: 'cursor_move',
      payload: {
        odId: this.odId,
        cursor: { x, y },
      },
    });

    // تحديث الحضور
    const currentPresence = this.collaborators.get(this.odId);
    if (currentPresence) {
      await this.channel.track({
        ...currentPresence,
        cursor: { x, y },
        lastSeen: Date.now(),
      });
    }
  }

  /**
   * تحديث التحديد
   */
  async updateSelection(elementIds: string[]): Promise<void> {
    if (!this.channel || !this.odId) return;

    const currentPresence = this.collaborators.get(this.odId);
    if (currentPresence) {
      await this.channel.track({
        ...currentPresence,
        selection: elementIds,
        lastSeen: Date.now(),
      });
    }
  }

  /**
   * بث تغيير عنصر
   */
  async broadcastElementChange(
    type: CollaborationEventType,
    payload: Record<string, unknown>
  ): Promise<void> {
    if (!this.channel || !this.odId || !this.boardId) return;

    this.eventVersion++;
    
    const event: CollaborationEvent = {
      type,
      odId: this.odId,
      boardId: this.boardId,
      payload,
      timestamp: Date.now(),
      version: this.eventVersion,
    };

    await this.channel.send({
      type: 'broadcast',
      event: 'element_change',
      payload: event,
    });
  }

  /**
   * طلب قفل عنصر
   */
  async acquireLock(elementId: string): Promise<boolean> {
    if (!this.channel || !this.odId) return false;

    const currentLock = this.elementLocks.get(elementId);
    if (currentLock && currentLock !== this.odId) {
      return false; // العنصر مقفل من مستخدم آخر
    }

    this.elementLocks.set(elementId, this.odId);

    await this.channel.send({
      type: 'broadcast',
      event: 'lock_change',
      payload: {
        elementId,
        odId: this.odId,
      },
    });

    return true;
  }

  /**
   * تحرير قفل عنصر
   */
  async releaseLock(elementId: string): Promise<void> {
    if (!this.channel || !this.odId) return;

    const currentLock = this.elementLocks.get(elementId);
    if (currentLock !== this.odId) return;

    this.elementLocks.delete(elementId);

    await this.channel.send({
      type: 'broadcast',
      event: 'lock_change',
      payload: {
        elementId,
        odId: null,
      },
    });
  }

  /**
   * التحقق من حالة القفل
   */
  isElementLocked(elementId: string): boolean {
    const lockOwner = this.elementLocks.get(elementId);
    return lockOwner !== undefined && lockOwner !== this.odId;
  }

  /**
   * الحصول على مالك القفل
   */
  getLockOwner(elementId: string): string | null {
    return this.elementLocks.get(elementId) || null;
  }

  /**
   * الحصول على المتعاونين
   */
  getCollaborators(): CollaboratorPresence[] {
    return Array.from(this.collaborators.values()).filter(
      (c) => c.odId !== this.odId
    );
  }

  /**
   * الحصول على معلومات المستخدم الحالي
   */
  getCurrentUser(): { odId: string; color: string; name: string } | null {
    if (!this.odId) return null;
    return {
      odId: this.odId,
      color: this.userColor,
      name: this.userName,
    };
  }

  // === معالجات الأحداث ===

  private handlePresenceSync(): void {
    if (!this.channel) return;

    const state = this.channel.presenceState();
    this.collaborators.clear();

    Object.entries(state).forEach(([key, presences]) => {
      if (presences.length > 0) {
        const presence = presences[0] as unknown as CollaboratorPresence;
        this.collaborators.set(key, {
          ...presence,
          odId: key,
        });
      }
    });

    this.onCollaboratorsChange?.(this.getCollaborators());
  }

  private handlePresenceJoin(key: string, newPresences: unknown[]): void {
    if (newPresences.length > 0) {
      const presence = newPresences[0] as CollaboratorPresence;
      this.collaborators.set(key, {
        ...presence,
        odId: key,
      });
      this.onCollaboratorsChange?.(this.getCollaborators());
    }
  }

  private handlePresenceLeave(key: string, _leftPresences: unknown[]): void {
    this.collaborators.delete(key);
    
    // تحرير أي أقفال للمستخدم المغادر
    this.elementLocks.forEach((odId, elementId) => {
      if (odId === key) {
        this.elementLocks.delete(elementId);
        this.onLockChange?.(elementId, null);
      }
    });

    this.onCollaboratorsChange?.(this.getCollaborators());
  }

  private handleRemoteElementChange(event: CollaborationEvent): void {
    // تجاهل الأحداث من المستخدم الحالي
    if (event.odId === this.odId) return;

    // التحقق من التعارضات
    if (event.version <= this.eventVersion) {
      this.onConflict?.(event, this.eventVersion);
      return;
    }

    this.eventVersion = Math.max(this.eventVersion, event.version);
    this.onRemoteElementChange?.(event);
  }

  private handleRemoteCursorMove(payload: { odId: string; cursor: { x: number; y: number } }): void {
    if (payload.odId === this.odId) return;
    this.onRemoteCursorMove?.(payload.odId, payload.cursor);
  }

  private handleLockChange(payload: { elementId: string; odId: string | null }): void {
    if (payload.odId) {
      this.elementLocks.set(payload.elementId, payload.odId);
    } else {
      this.elementLocks.delete(payload.elementId);
    }
    this.onLockChange?.(payload.elementId, payload.odId);
  }

  /**
   * تعيين لون للمستخدم
   */
  private assignColor(odId: string): string {
    // استخدام hash بسيط للحصول على لون ثابت لكل مستخدم
    let hash = 0;
    for (let i = 0; i < odId.length; i++) {
      hash = ((hash << 5) - hash) + odId.charCodeAt(i);
      hash |= 0;
    }
    return COLLABORATOR_COLORS[Math.abs(hash) % COLLABORATOR_COLORS.length];
  }

  /**
   * تنظيف الموارد
   */
  destroy(): void {
    this.leaveBoard();
    this.onCollaboratorsChange = undefined;
    this.onRemoteCursorMove = undefined;
    this.onRemoteElementChange = undefined;
    this.onLockChange = undefined;
    this.onConflict = undefined;
  }
}

// إنشاء instance واحد
export const collaborationEngine = new CollaborationEngine();
