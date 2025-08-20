// Y.js Supabase Provider for Real-time Collaboration
import * as Y from 'yjs';
import { supabase } from '@/integrations/supabase/client';

export interface UserInfo {
  name: string;
  color: string;
}

export class YSupabaseProvider {
  private doc: Y.Doc;
  private boardId: string;
  private userId: string;
  private userInfo: UserInfo;
  private _connected: boolean = false;
  private channel: any = null;

  public get connected(): boolean { 
    return this._connected; 
  }

  public isConnected(): boolean { 
    return this._connected; 
  }

  public onConnectionChange?: (connected: boolean) => void;
  public onSync?: (isSynced: boolean) => void;
  public onPresenceUpdate?: (users: any[]) => void;

  constructor(doc: Y.Doc, boardId: string, userId: string, userInfo: UserInfo) {
    this.doc = doc;
    this.boardId = boardId;
    this.userId = userId;
    this.userInfo = userInfo;
  }

  // Public getters for compatibility
  get users(): any[] {
    if (!this.channel) return [];
    return Object.values(this.channel.presenceState() || {}).flat();
  }

  // Public methods for compatibility
  updateCursor(cursor: any): void {
    if (!this.channel || !this.connected) return;
    
    this.channel.track({
      ...this.userInfo,
      cursor,
      lastSeen: Date.now()
    });
  }

  updateSelection(selection: any): void {
    if (!this.channel || !this.connected) return;
    
    this.channel.track({
      ...this.userInfo,
      selection,
      lastSeen: Date.now()
    });
  }

  async connect(): Promise<void> {
    try {
      // Create realtime channel for this board
      this.channel = supabase.channel(`board:${this.boardId}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'board_objects',
            filter: `board_id=eq.${this.boardId}`
          }, 
          (payload) => {
            this.handleBoardObjectChange(payload);
          }
        )
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync');
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        });

      const status = await this.channel.subscribe();
      
      if (status === 'SUBSCRIBED') {
        // Track user presence
        await this.channel.track({
          user_id: this.userId,
          name: this.userInfo.name,
          color: this.userInfo.color,
          online_at: new Date().toISOString()
        });

        this._connected = true;
        this.onConnectionChange?.(true);
        this.onSync?.(true);
        console.log('✅ Connected to realtime channel:', this.boardId);
      } else {
        throw new Error('Failed to subscribe to channel');
      }
    } catch (error) {
      console.error('❌ Realtime connection failed:', error);
      this._connected = false;
      this.onConnectionChange?.(false);
      throw error;
    }
  }

  disconnect(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this._connected = false;
    this.onConnectionChange?.(false);
    console.log('🔌 Disconnected from realtime');
  }

  private handleBoardObjectChange(payload: any): void {
    console.log('Board object changed:', payload);
    // Here we would normally sync the changes to Y.js doc
    // For now, just log the change
  }

  async createSnapshot(): Promise<void> {
    if (!this._connected) {
      console.warn('Cannot save snapshot - not connected');
      return;
    }

    try {
      // Convert Y.js document to state vector
      const stateVector = Y.encodeStateAsUpdate(this.doc);
      const base64State = btoa(String.fromCharCode(...new Uint8Array(stateVector)));

      // Save snapshot as a special board object
      const { error } = await supabase
        .from('board_objects')
        .upsert({
          id: `snapshot-${this.boardId}`,
          board_id: this.boardId,
          type: 'text',
          content: base64State,
          metadata: { isSnapshot: true },
          created_by: this.userId,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      
      console.log('📸 Snapshot saved successfully');
    } catch (error) {
      console.error('❌ Failed to save snapshot:', error);
      throw error;
    }
  }

  async loadSnapshot(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('board_objects')
        .select('content')
        .eq('board_id', this.boardId)
        .eq('type', 'text')
        .contains('metadata', { isSnapshot: true })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data?.content) {
        console.log('No snapshot found, starting with empty document');
        return;
      }

      // Apply snapshot to Y.js document
      const stateVector = Uint8Array.from(atob(data.content), c => c.charCodeAt(0));
      Y.applyUpdate(this.doc, stateVector);
      
      console.log('📥 Snapshot loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load snapshot:', error);
    }
  }

  getPresenceState(): any {
    return this.channel?.presenceState() || {};
  }
}