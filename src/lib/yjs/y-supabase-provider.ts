import * as Y from 'yjs';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  selection?: string[];
}

export interface YjsOperation {
  id: string;
  boardId: string;
  userId: string;
  operation: Uint8Array;
  timestamp: number;
}

export interface BoardSnapshot {
  id: string;
  boardId: string;
  data: Uint8Array;
  version: number;
  createdAt: Date;
}

export class YSupabaseProvider {
  private doc: Y.Doc;
  private boardId: string;
  private userId: string;
  private channel: RealtimeChannel | null = null;
  private presence: PresenceUser;
  private isConnected = false;
  private operationQueue: Uint8Array[] = [];
  private lastSyncedVersion = 0;
  
  // Event callbacks
  public onSync?: (isSynced: boolean) => void;
  public onPresenceUpdate?: (users: PresenceUser[]) => void;
  public onConnectionChange?: (connected: boolean) => void;

  constructor(
    doc: Y.Doc, 
    boardId: string, 
    userId: string,
    userInfo: { name: string; color: string }
  ) {
    this.doc = doc;
    this.boardId = boardId;
    this.userId = userId;
    this.presence = {
      id: userId,
      name: userInfo.name,
      color: userInfo.color,
    };

    this.setupDocumentListeners();
  }

  private setupDocumentListeners() {
    // Listen to document updates and queue them for sending
    this.doc.on('update', this.handleDocUpdate.bind(this));
    
    // Listen to awareness changes for cursor/selection updates
    this.doc.on('subdocs', this.handleSubdocsChange.bind(this));
  }

  private handleDocUpdate(update: Uint8Array, origin: any) {
    // Don't sync updates that came from remote
    if (origin === 'remote') return;
    
    // Queue the operation for sending
    this.operationQueue.push(update);
    this.sendQueuedOperations();
  }

  private handleSubdocsChange() {
    // Handle subdocument changes if needed
    console.log('Subdocs changed');
  }

  private async sendQueuedOperations() {
    if (!this.isConnected || this.operationQueue.length === 0) return;

    const operations = [...this.operationQueue];
    this.operationQueue = [];

    try {
      // Send operations through realtime channel
      for (const operation of operations) {
        await this.channel?.send({
          type: 'broadcast',
          event: 'yjs-operation',
          payload: {
            boardId: this.boardId,
            userId: this.userId,
          operation: Array.from(operation), // Convert to array for JSON
            timestamp: Date.now(),
          },
        });

        // Also store in op_log table for persistence
        await supabase.from('op_log').insert({
          board_id: this.boardId,
          user_id: this.userId,
          object_id: 'yjs-doc', // Special identifier for YJS operations
          operation_type: 'update', // Use valid enum value
          object_type: 'document',
          data: {
            operation: Array.from(operation),
            timestamp: Date.now(),
            isYjsOperation: true, // Flag to identify YJS ops
          },
        });
      }
    } catch (error) {
      console.error('Failed to send operations:', error);
      // Re-queue failed operations
      this.operationQueue.unshift(...operations);
    }
  }

  async connect(): Promise<void> {
    try {
      // Load initial snapshot and operations
      await this.loadInitialState();

      // Set up realtime channel
      this.channel = supabase.channel(`board:${this.boardId}`, {
        config: {
          presence: { key: this.userId },
        },
      });

      // Listen to YJS operations from other users
      this.channel.on('broadcast', { event: 'yjs-operation' }, (payload) => {
        this.handleRemoteOperation(payload);
      });

      // Listen to presence changes
      this.channel.on('presence', { event: 'sync' }, () => {
        const presenceState = this.channel!.presenceState();
        this.handlePresenceSync(presenceState);
      });

      this.channel.on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Users joined:', newPresences);
        this.onPresenceUpdate?.(this.getCurrentUsers());
      });

      this.channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Users left:', leftPresences);
        this.onPresenceUpdate?.(this.getCurrentUsers());
      });

      // Subscribe to channel
      await this.channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.onConnectionChange?.(true);

          // Share initial presence
          await this.updatePresence(this.presence);

          // Send queued operations
          this.sendQueuedOperations();

          console.log('YSupabaseProvider connected to board:', this.boardId);
        }
      });

      if (!this.isConnected) {
        throw new Error('Failed to subscribe to channel');
      }

    } catch (error) {
      console.error('Failed to connect YSupabaseProvider:', error);
      throw error;
    }
  }

  private async loadInitialState() {
    try {
      // Load latest snapshot
      const { data: snapshot, error: snapshotError } = await supabase
        .from('snapshots')
        .select('*')
        .eq('board_id', this.boardId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (snapshotError && snapshotError.code !== 'PGRST116') {
        throw snapshotError;
      }

      let baseVersion = 0;
      if (snapshot) {
        // Apply snapshot to document
        // Handle data as JSON array from Supabase
        let snapshotData: Uint8Array;
        if (Array.isArray(snapshot.data)) {
          snapshotData = new Uint8Array(snapshot.data as number[]);
        } else {
          // Handle other JSON data formats
          console.warn('Unexpected snapshot data format, skipping');
          return;
        }
        
        Y.applyUpdate(this.doc, snapshotData, 'remote');
        baseVersion = 0; // snapshots table doesn't have version field
        console.log('Loaded snapshot');
      }

      // Load operations since snapshot
      const { data: operations, error: opsError } = await supabase
        .from('op_log')
        .select('*')
        .eq('board_id', this.boardId)
        .eq('object_type', 'document')
        .eq('operation_type', 'update')
        .gt('created_at', snapshot?.created_at || new Date(0))
        .order('created_at', { ascending: true });

      if (opsError) {
        throw opsError;
      }

      // Apply operations (only YJS operations)  
      if (operations) {
        for (const op of operations) {
          // Only apply YJS operations
          if (op.data && typeof op.data === 'object' && !Array.isArray(op.data)) {
            const dataObj = op.data as { [key: string]: any };
            if (dataObj.isYjsOperation && dataObj.operation) {
              const operationData = new Uint8Array(dataObj.operation);
              Y.applyUpdate(this.doc, operationData, 'remote');
            }
          }
        }
        console.log('Applied', operations.length, 'YJS operations since snapshot');
      }

      this.lastSyncedVersion = baseVersion + (operations?.length || 0);
      this.onSync?.(true);

    } catch (error) {
      console.error('Failed to load initial state:', error);
      throw error;
    }
  }

  private handleRemoteOperation(payload: any) {
    try {
      const { operation, userId, timestamp } = payload.payload;
      
      // Don't apply our own operations
      if (userId === this.userId) return;

      // Convert array back to Uint8Array
      const operationData = new Uint8Array(operation);
      
      // Apply the update to our document
      Y.applyUpdate(this.doc, operationData, 'remote');
      
      console.log('Applied remote operation from user:', userId);
    } catch (error) {
      console.error('Failed to apply remote operation:', error);
    }
  }

  private handlePresenceSync(presenceState: any) {
    const users = this.getCurrentUsers();
    this.onPresenceUpdate?.(users);
  }

  private getCurrentUsers(): PresenceUser[] {
    if (!this.channel) return [];
    
    const presenceState = this.channel.presenceState();
    const users: PresenceUser[] = [];
    
    Object.entries(presenceState).forEach(([userId, presences]: [string, any[]]) => {
      if (presences.length > 0) {
        users.push(presences[0] as PresenceUser);
      }
    });
    
    return users;
  }

  async updatePresence(update: Partial<PresenceUser>): Promise<void> {
    if (!this.channel || !this.isConnected) return;

    this.presence = { ...this.presence, ...update };
    
    try {
      await this.channel.track(this.presence);
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  }

  async updateCursor(x: number, y: number): Promise<void> {
    await this.updatePresence({ cursor: { x, y } });
  }

  async updateSelection(selection: string[]): Promise<void> {
    await this.updatePresence({ selection });
  }

  async createSnapshot(): Promise<void> {
    try {
      const docState = Y.encodeStateAsUpdate(this.doc);

      const { error } = await supabase.from('snapshots').insert({
        board_id: this.boardId,
        name: `Auto-snapshot ${new Date().toISOString()}`,
        description: 'Automatic snapshot created by YSupabaseProvider',
        created_by: this.userId,
        data: Array.from(docState), // Convert to array for JSON storage
        file_size: docState.length,
      });

      if (error) {
        throw error;
      }

      this.lastSyncedVersion = this.lastSyncedVersion + 1;
      console.log('Created snapshot, version:', this.lastSyncedVersion);
    } catch (error) {
      console.error('Failed to create snapshot:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.unsubscribe();
      this.channel = null;
    }
    
    this.isConnected = false;
    this.onConnectionChange?.(false);
    console.log('YSupabaseProvider disconnected');
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get currentPresence(): PresenceUser {
    return this.presence;
  }

  get users(): PresenceUser[] {
    return this.getCurrentUsers();
  }
}