import { ConnectionState, Connection, ConnectionPoint, AnchorPoint, ConnectionEvent, LinkData } from '../types/connection';
import { CanvasNode, Point, Bounds } from '../types';
import { SceneGraph } from '../utils/scene-graph';
import { supabase } from '@/integrations/supabase/client';

export class ConnectionManager {
  private state: ConnectionState;
  private sceneGraph: SceneGraph;
  private listeners: ((event: ConnectionEvent) => void)[] = [];
  private boardId: string;

  constructor(sceneGraph: SceneGraph, boardId: string) {
    this.sceneGraph = sceneGraph;
    this.boardId = boardId;
    this.state = {
      activeConnection: null,
      pendingConnection: null,
      connections: new Map(),
      anchorPoints: new Map(),
      selectedConnectionId: null
    };
  }

  // Generate anchor points for a node
  generateAnchorPoints(node: CanvasNode): AnchorPoint[] {
    const bounds = this.sceneGraph.getNodeBounds(node);
    const anchors: AnchorPoint[] = [];

    // Top anchor
    anchors.push({
      id: `${node.id}-top`,
      position: { x: bounds.x + bounds.width / 2, y: bounds.y },
      side: 'top',
      nodeId: node.id,
      active: false
    });

    // Bottom anchor
    anchors.push({
      id: `${node.id}-bottom`,
      position: { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
      side: 'bottom',
      nodeId: node.id,
      active: false
    });

    // Left anchor
    anchors.push({
      id: `${node.id}-left`,
      position: { x: bounds.x, y: bounds.y + bounds.height / 2 },
      side: 'left',
      nodeId: node.id,
      active: false
    });

    // Right anchor
    anchors.push({
      id: `${node.id}-right`,
      position: { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
      side: 'right',
      nodeId: node.id,
      active: false
    });

    return anchors;
  }

  // Update anchor points for selected nodes
  updateAnchorsForSelection(selectedNodeIds: string[]): void {
    this.state.anchorPoints.clear();

    selectedNodeIds.forEach(nodeId => {
      const node = this.sceneGraph.getNode(nodeId);
      if (node) {
        const anchors = this.generateAnchorPoints(node);
        this.state.anchorPoints.set(nodeId, anchors);
      }
    });
  }

  // Get anchor points for rendering
  getAllAnchorPoints(): AnchorPoint[] {
    const allAnchors: AnchorPoint[] = [];
    this.state.anchorPoints.forEach(anchors => {
      allAnchors.push(...anchors);
    });
    return allAnchors;
  }

  // Start connection from anchor point
  startConnection(anchorId: string): void {
    const anchor = this.findAnchorById(anchorId);
    if (!anchor) return;

    const connectionPoint: ConnectionPoint = {
      x: anchor.position.x,
      y: anchor.position.y,
      nodeId: anchor.nodeId,
      side: anchor.side
    };

    this.state.pendingConnection = {
      fromPoint: connectionPoint,
      tempPath: [anchor.position]
    };

    this.notifyListeners({
      type: 'anchor-click',
      anchorId,
      data: { action: 'start-connection' }
    });
  }

  // Update temporary connection path
  updateTempPath(point: Point): void {
    if (!this.state.pendingConnection) return;

    // Generate orthogonal path
    const fromPoint = this.state.pendingConnection.fromPoint!;
    const orthogonalPath = this.generateOrthogonalPath(fromPoint.side, fromPoint, point);
    
    this.state.pendingConnection.tempPath = orthogonalPath;
  }

  // Complete connection to another anchor
  completeConnection(targetAnchorId: string): void {
    if (!this.state.pendingConnection) return;

    const targetAnchor = this.findAnchorById(targetAnchorId);
    if (!targetAnchor || targetAnchor.nodeId === this.state.pendingConnection.fromPoint?.nodeId) {
      this.cancelConnection();
      return;
    }

    const toPoint: ConnectionPoint = {
      x: targetAnchor.position.x,
      y: targetAnchor.position.y,
      nodeId: targetAnchor.nodeId,
      side: targetAnchor.side
    };

    this.createConnection(this.state.pendingConnection.fromPoint!, toPoint);
    this.state.pendingConnection = null;
  }

  // Cancel pending connection
  cancelConnection(): void {
    this.state.pendingConnection = null;
  }

  // Create actual connection and save to database
  private async createConnection(fromPoint: ConnectionPoint, toPoint: ConnectionPoint): Promise<void> {
    const connectionId = crypto.randomUUID();
    
    const orthogonalPath = this.generateOrthogonalPath(
      fromPoint.side, 
      fromPoint, 
      toPoint,
      toPoint.side
    );

    const connection: Connection = {
      id: connectionId,
      fromPoint,
      toPoint,
      path: {
        type: 'orthogonal',
        points: orthogonalPath,
        nodes: [] // Will be populated when user edits path
      },
      style: {
        stroke: 'hsl(var(--primary))',
        strokeWidth: 2,
        markerEnd: 'arrow'
      }
    };

    // Save to Supabase
    const { error } = await supabase
      .from('links')
      .insert({
        id: connectionId,
        board_id: this.boardId,
        from_object_id: fromPoint.nodeId,
        to_object_id: toPoint.nodeId,
        style: {
          type: connection.path.type,
          stroke: connection.style.stroke,
          strokeWidth: connection.style.strokeWidth,
          markerEnd: connection.style.markerEnd
        },
        created_by: (await supabase.auth.getUser()).data.user?.id || ''
      });

    if (!error) {
      this.state.connections.set(connectionId, connection);
      this.notifyListeners({
        type: 'connection-created',
        connectionId,
        connection
      });
    }
  }

  // Generate orthogonal path between two points
  private generateOrthogonalPath(
    fromSide: string,
    fromPoint: Point,
    toPoint: Point,
    toSide?: string
  ): Point[] {
    const path: Point[] = [fromPoint];
    
    const dx = toPoint.x - fromPoint.x;
    const dy = toPoint.y - fromPoint.y;
    
    // Simple orthogonal routing
    if (fromSide === 'right' || fromSide === 'left') {
      const midX = fromPoint.x + (fromSide === 'right' ? 50 : -50);
      path.push({ x: midX, y: fromPoint.y });
      path.push({ x: midX, y: toPoint.y });
    } else {
      const midY = fromPoint.y + (fromSide === 'bottom' ? 50 : -50);
      path.push({ x: fromPoint.x, y: midY });
      path.push({ x: toPoint.x, y: midY });
    }
    
    path.push(toPoint);
    return path;
  }

  // Find anchor by ID
  private findAnchorById(anchorId: string): AnchorPoint | undefined {
    for (const anchors of this.state.anchorPoints.values()) {
      const anchor = anchors.find(a => a.id === anchorId);
      if (anchor) return anchor;
    }
    return undefined;
  }

  // Get all connections
  getConnections(): Connection[] {
    return Array.from(this.state.connections.values());
  }

  // Get connection by ID
  getConnection(id: string): Connection | undefined {
    return this.state.connections.get(id);
  }

  // Select connection
  selectConnection(id: string): void {
    this.state.selectedConnectionId = id;
  }

  // Get pending connection state
  getPendingConnection() {
    return this.state.pendingConnection;
  }

  // Load connections from database
  async loadConnections(): Promise<void> {
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .eq('board_id', this.boardId);

    if (!error && links) {
      links.forEach(link => {
        const connection = this.linkToConnection(link);
        if (connection) {
          this.state.connections.set(connection.id, connection);
        }
      });
    }
  }

  // Convert database link to connection
  private linkToConnection(link: LinkData): Connection | null {
    const fromNode = this.sceneGraph.getNode(link.from_object_id);
    const toNode = this.sceneGraph.getNode(link.to_object_id);
    
    if (!fromNode || !toNode) return null;

    const fromBounds = this.sceneGraph.getNodeBounds(fromNode);
    const toBounds = this.sceneGraph.getNodeBounds(toNode);

    // Determine connection points (simplified)
    const fromPoint: ConnectionPoint = {
      x: fromBounds.x + fromBounds.width,
      y: fromBounds.y + fromBounds.height / 2,
      nodeId: link.from_object_id,
      side: 'right'
    };

    const toPoint: ConnectionPoint = {
      x: toBounds.x,
      y: toBounds.y + toBounds.height / 2,
      nodeId: link.to_object_id,
      side: 'left'
    };

    return {
      id: link.id,
      fromPoint,
      toPoint,
      path: {
        type: 'orthogonal',
        points: this.generateOrthogonalPath('right', fromPoint, toPoint, 'left')
      },
      style: {
        stroke: link.style?.stroke || 'hsl(var(--primary))',
        strokeWidth: link.style?.strokeWidth || 2,
        markerEnd: link.style?.markerEnd || 'arrow'
      },
      title: link.label,
      notes: ''
    };
  }

  // Analyze connections with AI
  async analyzeConnections(): Promise<any> {
    const elements = this.sceneGraph.getAllNodes().map(node => ({
      id: node.id,
      type: node.type,
      content: (node as any).content || '',
      position: node.transform.position,
      metadata: node.metadata || {}
    }));

    const links = Array.from(this.state.connections.values()).map(conn => ({
      id: conn.id,
      from_object_id: conn.fromPoint.nodeId,
      to_object_id: conn.toPoint.nodeId,
      style: conn.style
    }));

    const { data, error } = await supabase.functions.invoke('analyze-links', {
      body: { elements, links }
    });

    if (error) {
      console.error('AI analysis failed:', error);
      return null;
    }

    return data;
  }

  // Event listeners
  addEventListener(listener: (event: ConnectionEvent) => void): void {
    this.listeners.push(listener);
  }

  removeEventListener(listener: (event: ConnectionEvent) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(event: ConnectionEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
}