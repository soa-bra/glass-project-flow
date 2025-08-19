import * as Y from 'yjs';
import { InfiniteCanvasEngine } from './canvas-engine';
import { YSupabaseProvider } from '../yjs/y-supabase-provider';
import type { CanvasNode, Point, Size } from './types';

export class CanvasState {
  private engine: InfiniteCanvasEngine;
  private doc: Y.Doc;
  private provider: YSupabaseProvider | null = null;
  private nodesMap: Y.Map<any>;
  private metadata: Y.Map<any>;
  
  // Prevent infinite loops during sync
  private isSyncing = false;

  constructor(engine: InfiniteCanvasEngine) {
    this.engine = engine;
    this.doc = new Y.Doc();
    
    // Create shared data structures
    this.nodesMap = this.doc.getMap('nodes');
    this.metadata = this.doc.getMap('metadata');
    
    this.setupYjsListeners();
  }

  private setupYjsListeners() {
    // Listen to changes in the nodes map
    this.nodesMap.observe((event) => {
      if (this.isSyncing) return;
      
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'add') {
          const nodeData = this.nodesMap.get(key);
          this.handleRemoteNodeAdd(key, nodeData);
        } else if (change.action === 'update') {
          const nodeData = this.nodesMap.get(key);
          this.handleRemoteNodeUpdate(key, nodeData);
        } else if (change.action === 'delete') {
          this.handleRemoteNodeDelete(key);
        }
      });
    });

    // Listen to engine changes and sync to YJS
    this.engine.on('nodeAdded', (node) => {
      if (!this.isSyncing) {
        this.syncNodeToYjs(node);
      }
    });

    this.engine.on('nodeUpdated', (node) => {
      if (!this.isSyncing) {
        this.syncNodeToYjs(node);
      }
    });

    this.engine.on('nodeRemoved', (nodeId) => {
      if (!this.isSyncing) {
        this.removeNodeFromYjs(nodeId);
      }
    });
  }

  private handleRemoteNodeAdd(nodeId: string, nodeData: any) {
    this.isSyncing = true;
    try {
      const node = this.deserializeNode(nodeData);
      this.engine.addNode(node);
    } catch (error) {
      console.error('Failed to add remote node:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private handleRemoteNodeUpdate(nodeId: string, nodeData: any) {
    this.isSyncing = true;
    try {
      const node = this.deserializeNode(nodeData);
      this.engine.updateNode(nodeId, node);
    } catch (error) {
      console.error('Failed to update remote node:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private handleRemoteNodeDelete(nodeId: string) {
    this.isSyncing = true;
    try {
      this.engine.removeNode(nodeId);
    } catch (error) {
      console.error('Failed to remove remote node:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private syncNodeToYjs(node: CanvasNode) {
    const serializedNode = this.serializeNode(node);
    this.nodesMap.set(node.id, serializedNode);
  }

  private removeNodeFromYjs(nodeId: string) {
    this.nodesMap.delete(nodeId);
  }

  private serializeNode(node: CanvasNode): any {
    return {
      id: node.id,
      type: node.type,
      transform: node.transform,
      size: node.size,
      style: node.style,
      metadata: node.metadata,
      // Type-specific data
      ...(node.type === 'text' && { content: (node as any).content }),
      ...(node.type === 'sticky' && { 
        content: (node as any).content,
        color: (node as any).color 
      }),
      ...(node.type === 'frame' && { 
        title: (node as any).title,
        children: (node as any).children 
      }),
      ...(node.type === 'image' && { 
        src: (node as any).src,
        alt: (node as any).alt 
      }),
      // Line/Arrow specific
      ...((['line', 'arrow'].includes(node.type)) && {
        points: (node as any).points
      }),
      lastModified: Date.now(),
    };
  }

  private deserializeNode(data: any): CanvasNode {
    const baseNode = {
      id: data.id,
      type: data.type,
      transform: data.transform || { 
        position: { x: 0, y: 0 }, 
        rotation: 0, 
        scale: { x: 1, y: 1 } 
      },
      size: data.size || { width: 100, height: 100 },
      style: data.style || {},
      metadata: data.metadata || {},
    };

    // Add type-specific properties
    switch (data.type) {
      case 'text':
        return { 
          ...baseNode, 
          content: data.content || '', 
          fontSize: data.fontSize || 14,
          fontFamily: data.fontFamily || 'Inter',
          color: data.color || '#000000'
        } as any;
      
      case 'sticky':
        return { 
          ...baseNode, 
          content: data.content || '', 
          color: data.color || '#ffeb3b' 
        } as any;
      
      case 'frame':
        return { 
          ...baseNode, 
          title: data.title || '', 
          children: data.children || [] 
        } as any;
      
      case 'image':
        return { 
          ...baseNode, 
          src: data.src || '', 
          preserveAspectRatio: data.preserveAspectRatio || true
        } as any;
      
      case 'line':
        return { 
          ...baseNode, 
          points: data.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }] 
        } as any;
        
      case 'arrow':
        return { 
          ...baseNode, 
          start: data.start || { x: 0, y: 0 },
          end: data.end || { x: 100, y: 100 }
        } as any;
      
      default:
        return baseNode as CanvasNode;
    }
  }

  async connectToBoard(
    boardId: string, 
    userId: string, 
    userInfo: { name: string; color: string }
  ): Promise<void> {
    // Disconnect existing provider if any
    if (this.provider) {
      await this.provider.disconnect();
    }

    // Create new provider
    this.provider = new YSupabaseProvider(this.doc, boardId, userId, userInfo);
    
    // Set up provider event handlers
    this.provider.onSync = (isSynced) => {
      console.log('Canvas sync status:', isSynced);
    };

    this.provider.onPresenceUpdate = (users) => {
      console.log('Users in canvas:', users);
      // Emit presence update for UI components
      this.engine.emit('presenceUpdate', users);
    };

    this.provider.onConnectionChange = (connected) => {
      console.log('Canvas connection status:', connected);
      this.engine.emit('connectionChange', connected);
    };

    // Connect to Supabase
    await this.provider.connect();
    
    // Load current engine state into YJS (for the first user)
    if (this.nodesMap.size === 0) {
      const currentNodes = this.engine.getNodes();
      currentNodes.forEach(node => {
        this.syncNodeToYjs(node);
      });
    }
  }

  async updateUserCursor(x: number, y: number): Promise<void> {
    if (this.provider) {
      await this.provider.updateCursor(x, y);
    }
  }

  async updateUserSelection(nodeIds: string[]): Promise<void> {
    if (this.provider) {
      await this.provider.updateSelection(nodeIds);
    }
  }

  async createSnapshot(): Promise<void> {
    if (this.provider) {
      await this.provider.createSnapshot();
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider) {
      await this.provider.disconnect();
      this.provider = null;
    }
  }

  // Export/Import for testing
  toSnapshot(): any {
    return {
      nodes: Object.fromEntries(this.nodesMap.entries()),
      metadata: Object.fromEntries(this.metadata.entries()),
      version: this.doc.clientID,
    };
  }

  fromSnapshot(snapshot: any): void {
    this.isSyncing = true;
    try {
      // Clear current state
      this.nodesMap.clear();
      this.metadata.clear();
      
      // Load nodes
      if (snapshot.nodes) {
        Object.entries(snapshot.nodes).forEach(([id, nodeData]) => {
          this.nodesMap.set(id, nodeData);
        });
      }
      
      // Load metadata
      if (snapshot.metadata) {
        Object.entries(snapshot.metadata).forEach(([key, value]) => {
          this.metadata.set(key, value);
        });
      }
    } finally {
      this.isSyncing = false;
    }
  }

  // Getters
  get isConnected(): boolean {
    return this.provider?.connected || false;
  }

  get currentUsers(): any[] {
    return this.provider?.users || [];
  }

  get document(): Y.Doc {
    return this.doc;
  }
}