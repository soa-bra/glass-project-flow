/**
 * Collaboration Engine - Sprint 8
 * نظام التعاون الفوري مع Supabase Realtime
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

const COLLABORATOR_COLORS = [
  '#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D',
  '#9B59B6', '#E67E22', '#1ABC9C', '#E91E63',
];

export class CollaborationEngine {
  private channel: RealtimeChannel | null = null;
  private boardId: string | null = null;
  private odId: string | null = null;
  private userName: string = 'مستخدم';
  private userColor: string = COLLABORATOR_COLORS[0];
  private collaborators: Map<string, CollaboratorPresence> = new Map();
  private elementLocks: Map<string, string> = new Map();
  private eventVersion: number = 0;
  
  private onCollaboratorsChange?: (collaborators: CollaboratorPresence[]) => void;
  private onRemoteCursorMove?: (odId: string, cursor: { x: number; y: number }) => void;
  private onRemoteElementChange?: (event: CollaborationEvent) => void;
  private onLockChange?: (elementId: string, lockedBy: string | null) => void;
  private onConflict?: (event: CollaborationEvent, localVersion: number) => void;

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

  async joinBoard(boardId: string): Promise<void> {
    if (this.channel) await this.leaveBoard();

    this.boardId = boardId;
    this.channel = supabase.channel(`board:${boardId}`, {
      config: { presence: { key: this.odId || 'anonymous' } },
    });

    this.channel
      .on('presence', { event: 'sync' }, () => this.handlePresenceSync())
      .on('presence', { event: 'join' }, ({ key, newPresences }) => 
        this.handlePresenceJoin(key, newPresences))
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => 
        this.handlePresenceLeave(key, leftPresences))
      .on('broadcast', { event: 'element_change' }, ({ payload }) => 
        this.handleRemoteElementChange(payload as CollaborationEvent))
      .on('broadcast', { event: 'cursor_move' }, ({ payload }) => 
        this.handleRemoteCursorMove(payload as { odId: string; cursor: { x: number; y: number } }))
      .on('broadcast', { event: 'lock_change' }, ({ payload }) => 
        this.handleLockChange(payload as { elementId: string; odId: string | null }));

    await this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') await this.trackPresence();
    });
  }

  async leaveBoard(): Promise<void> {
    if (this.channel) {
      try {
        await this.channel.untrack();
        await supabase.removeChannel(this.channel);
      } catch (err) {
        console.warn('[CollaborationEngine] Error leaving board:', err);
      }
      this.channel = null;
    }
    this.boardId = null;
    this.collaborators.clear();
    this.elementLocks.clear();
  }

  private async trackPresence(): Promise<void> {
    if (!this.channel || !this.odId) return;
    await this.channel.track({
      odId: this.odId,
      boardId: this.boardId || '',
      cursor: null,
      selection: [],
      color: this.userColor,
      name: this.userName,
      lastSeen: Date.now(),
    });
  }

  async updateCursor(x: number, y: number): Promise<void> {
    if (!this.channel || !this.odId) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'cursor_move',
      payload: { odId: this.odId, cursor: { x, y } },
    });
  }

  async updateSelection(elementIds: string[]): Promise<void> {
    if (!this.channel || !this.odId) return;
    const presence = this.collaborators.get(this.odId);
    if (presence) {
      await this.channel.track({ ...presence, selection: elementIds, lastSeen: Date.now() });
    }
  }

  async broadcastElementChange(type: CollaborationEventType, payload: Record<string, unknown>): Promise<void> {
    if (!this.channel || !this.odId || !this.boardId) return;
    this.eventVersion++;
    await this.channel.send({
      type: 'broadcast',
      event: 'element_change',
      payload: {
        type,
        odId: this.odId,
        boardId: this.boardId,
        payload,
        timestamp: Date.now(),
        version: this.eventVersion,
      },
    });
  }

  async acquireLock(elementId: string): Promise<boolean> {
    if (!this.channel || !this.odId) return false;
    const currentLock = this.elementLocks.get(elementId);
    if (currentLock && currentLock !== this.odId) return false;

    this.elementLocks.set(elementId, this.odId);
    await this.channel.send({
      type: 'broadcast',
      event: 'lock_change',
      payload: { elementId, odId: this.odId },
    });
    return true;
  }

  async releaseLock(elementId: string): Promise<void> {
    if (!this.channel || !this.odId) return;
    if (this.elementLocks.get(elementId) !== this.odId) return;

    this.elementLocks.delete(elementId);
    await this.channel.send({
      type: 'broadcast',
      event: 'lock_change',
      payload: { elementId, odId: null },
    });
  }

  isElementLocked(elementId: string): boolean {
    const lockOwner = this.elementLocks.get(elementId);
    return lockOwner !== undefined && lockOwner !== this.odId;
  }

  getLockOwner(elementId: string): string | null {
    return this.elementLocks.get(elementId) || null;
  }

  getCollaborators(): CollaboratorPresence[] {
    return Array.from(this.collaborators.values()).filter(c => c.odId !== this.odId);
  }

  getCurrentUser(): { odId: string; color: string; name: string } | null {
    if (!this.odId) return null;
    return { odId: this.odId, color: this.userColor, name: this.userName };
  }

  private handlePresenceSync(): void {
    if (!this.channel) return;
    const state = this.channel.presenceState();
    this.collaborators.clear();
    Object.entries(state).forEach(([key, presences]) => {
      if (presences.length > 0) {
        this.collaborators.set(key, { ...presences[0] as unknown as CollaboratorPresence, odId: key });
      }
    });
    this.onCollaboratorsChange?.(this.getCollaborators());
  }

  private handlePresenceJoin(key: string, newPresences: unknown[]): void {
    if (newPresences.length > 0) {
      this.collaborators.set(key, { ...newPresences[0] as CollaboratorPresence, odId: key });
      this.onCollaboratorsChange?.(this.getCollaborators());
    }
  }

  private handlePresenceLeave(key: string, _leftPresences: unknown[]): void {
    this.collaborators.delete(key);
    this.elementLocks.forEach((odId, elementId) => {
      if (odId === key) {
        this.elementLocks.delete(elementId);
        this.onLockChange?.(elementId, null);
      }
    });
    this.onCollaboratorsChange?.(this.getCollaborators());
  }

  private handleRemoteElementChange(event: CollaborationEvent): void {
    if (event.odId === this.odId) return;
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

  private assignColor(odId: string): string {
    let hash = 0;
    for (let i = 0; i < odId.length; i++) {
      hash = ((hash << 5) - hash) + odId.charCodeAt(i);
      hash |= 0;
    }
    return COLLABORATOR_COLORS[Math.abs(hash) % COLLABORATOR_COLORS.length];
  }

  destroy(): void {
    this.leaveBoard();
    this.onCollaboratorsChange = undefined;
    this.onRemoteCursorMove = undefined;
    this.onRemoteElementChange = undefined;
    this.onLockChange = undefined;
    this.onConflict = undefined;
  }
}

export const collaborationEngine = new CollaborationEngine();
