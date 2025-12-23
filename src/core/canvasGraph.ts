/**
 * Canvas Graph Architecture - بنية الرسم البياني للكانفاس
 * 
 * يوفر نظام إدارة العناصر والموصلات كرسم بياني (Graph):
 * - Nodes: العناصر (أشكال، نصوص، صور، إطارات)
 * - Edges: الموصلات (أسهم، خطوط، روابط)
 * - Relationships: العلاقات بين العناصر
 * 
 * جميع الحسابات في World Space
 */

import { nanoid } from 'nanoid';
import type { Point, Bounds } from './canvasKernel';

// =============================================================================
// Types - Node (العنصر)
// =============================================================================

export type NodeType = 
  | 'shape' 
  | 'text' 
  | 'image' 
  | 'frame' 
  | 'sticky' 
  | 'group'
  | 'file';

export interface NodeAnchor {
  id: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset?: number;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  position: Point;
  size: { width: number; height: number };
  rotation?: number;
  anchors: NodeAnchor[];
  parentId?: string;
  childIds: string[];
  data?: Record<string, any>;
  layerId: string;
  zIndex: number;
  visible: boolean;
  locked: boolean;
}

// =============================================================================
// Types - Edge (الموصل)
// =============================================================================

export type EdgeType = 
  | 'arrow' 
  | 'line' 
  | 'connector' 
  | 'bezier'
  | 'orthogonal';

export type EdgeEndStyle = 
  | 'none' 
  | 'arrow' 
  | 'diamond' 
  | 'circle' 
  | 'square';

export interface EdgeEndpoint {
  nodeId?: string;
  anchor?: NodeAnchor['position'];
  position: Point;
  style: EdgeEndStyle;
}

export interface EdgeControlPoint {
  id: string;
  position: Point;
  type: 'start' | 'end' | 'middle' | 'bezier';
  isActive: boolean;
  label?: string;
}

export interface GraphEdge {
  id: string;
  type: EdgeType;
  source: EdgeEndpoint;
  target: EdgeEndpoint;
  controlPoints: EdgeControlPoint[];
  style: {
    strokeColor: string;
    strokeWidth: number;
    strokeDash?: number[];
    opacity?: number;
  };
  label?: string;
  data?: Record<string, any>;
  zIndex: number;
}

// =============================================================================
// Types - Graph
// =============================================================================

export interface CanvasGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  nodeEdgeIndex: Map<string, Set<string>>;
  parentChildIndex: Map<string, Set<string>>;
}

export interface GraphQuery {
  type?: NodeType | EdgeType;
  bounds?: Bounds;
  parentId?: string;
  layerId?: string;
  includeHidden?: boolean;
  includeLocked?: boolean;
}

// =============================================================================
// Canvas Graph Implementation
// =============================================================================

class CanvasGraphImpl {
  private _graph: CanvasGraph = {
    nodes: new Map(),
    edges: new Map(),
    nodeEdgeIndex: new Map(),
    parentChildIndex: new Map()
  };

  addNode(node: Omit<GraphNode, 'id' | 'anchors' | 'childIds'>): GraphNode {
    const id = nanoid();
    const anchors = this.generateAnchors(id);
    
    const newNode: GraphNode = {
      ...node,
      id,
      anchors,
      childIds: []
    };

    this._graph.nodes.set(id, newNode);
    this._graph.nodeEdgeIndex.set(id, new Set());

    if (node.parentId) {
      this.addChildToParent(node.parentId, id);
    }

    return newNode;
  }

  updateNode(nodeId: string, updates: Partial<GraphNode>): GraphNode | null {
    const node = this._graph.nodes.get(nodeId);
    if (!node) return null;

    const updatedNode = { ...node, ...updates };
    this._graph.nodes.set(nodeId, updatedNode);

    if (updates.position || updates.size) {
      this.updateConnectedEdges(nodeId);
    }

    if (updates.parentId !== undefined && updates.parentId !== node.parentId) {
      if (node.parentId) {
        this.removeChildFromParent(node.parentId, nodeId);
      }
      if (updates.parentId) {
        this.addChildToParent(updates.parentId, nodeId);
      }
    }

    return updatedNode;
  }

  removeNode(nodeId: string): boolean {
    const node = this._graph.nodes.get(nodeId);
    if (!node) return false;

    const connectedEdges = this._graph.nodeEdgeIndex.get(nodeId);
    if (connectedEdges) {
      connectedEdges.forEach(edgeId => this.removeEdge(edgeId));
    }

    if (node.parentId) {
      this.removeChildFromParent(node.parentId, nodeId);
    }

    node.childIds.forEach(childId => {
      const childNode = this._graph.nodes.get(childId);
      if (childNode) {
        this.updateNode(childId, { parentId: undefined });
      }
    });

    this._graph.nodeEdgeIndex.delete(nodeId);
    this._graph.parentChildIndex.delete(nodeId);
    
    return this._graph.nodes.delete(nodeId);
  }

  getNode(nodeId: string): GraphNode | undefined {
    return this._graph.nodes.get(nodeId);
  }

  getAllNodes(): GraphNode[] {
    return Array.from(this._graph.nodes.values());
  }

  queryNodes(query: GraphQuery): GraphNode[] {
    let nodes = Array.from(this._graph.nodes.values());

    if (query.type) {
      nodes = nodes.filter(n => n.type === query.type);
    }
    if (query.parentId) {
      nodes = nodes.filter(n => n.parentId === query.parentId);
    }
    if (query.layerId) {
      nodes = nodes.filter(n => n.layerId === query.layerId);
    }
    if (!query.includeHidden) {
      nodes = nodes.filter(n => n.visible);
    }
    if (!query.includeLocked) {
      nodes = nodes.filter(n => !n.locked);
    }
    if (query.bounds) {
      nodes = nodes.filter(n => this.nodeIntersectsBounds(n, query.bounds!));
    }

    return nodes;
  }

  addEdge(edge: Omit<GraphEdge, 'id'>): GraphEdge {
    const id = nanoid();
    const newEdge: GraphEdge = { ...edge, id };

    this._graph.edges.set(id, newEdge);

    if (edge.source.nodeId) {
      this._graph.nodeEdgeIndex.get(edge.source.nodeId)?.add(id);
    }
    if (edge.target.nodeId) {
      this._graph.nodeEdgeIndex.get(edge.target.nodeId)?.add(id);
    }

    return newEdge;
  }

  updateEdge(edgeId: string, updates: Partial<GraphEdge>): GraphEdge | null {
    const edge = this._graph.edges.get(edgeId);
    if (!edge) return null;

    if (updates.source?.nodeId !== undefined && updates.source.nodeId !== edge.source.nodeId) {
      if (edge.source.nodeId) {
        this._graph.nodeEdgeIndex.get(edge.source.nodeId)?.delete(edgeId);
      }
      if (updates.source.nodeId) {
        this._graph.nodeEdgeIndex.get(updates.source.nodeId)?.add(edgeId);
      }
    }

    if (updates.target?.nodeId !== undefined && updates.target.nodeId !== edge.target.nodeId) {
      if (edge.target.nodeId) {
        this._graph.nodeEdgeIndex.get(edge.target.nodeId)?.delete(edgeId);
      }
      if (updates.target.nodeId) {
        this._graph.nodeEdgeIndex.get(updates.target.nodeId)?.add(edgeId);
      }
    }

    const updatedEdge = { ...edge, ...updates };
    this._graph.edges.set(edgeId, updatedEdge);

    return updatedEdge;
  }

  removeEdge(edgeId: string): boolean {
    const edge = this._graph.edges.get(edgeId);
    if (!edge) return false;

    if (edge.source.nodeId) {
      this._graph.nodeEdgeIndex.get(edge.source.nodeId)?.delete(edgeId);
    }
    if (edge.target.nodeId) {
      this._graph.nodeEdgeIndex.get(edge.target.nodeId)?.delete(edgeId);
    }

    return this._graph.edges.delete(edgeId);
  }

  getEdge(edgeId: string): GraphEdge | undefined {
    return this._graph.edges.get(edgeId);
  }

  getAllEdges(): GraphEdge[] {
    return Array.from(this._graph.edges.values());
  }

  getNodeEdges(nodeId: string): GraphEdge[] {
    const edgeIds = this._graph.nodeEdgeIndex.get(nodeId);
    if (!edgeIds) return [];

    return Array.from(edgeIds)
      .map(id => this._graph.edges.get(id))
      .filter((e): e is GraphEdge => e !== undefined);
  }

  getChildren(nodeId: string): GraphNode[] {
    const childIds = this._graph.parentChildIndex.get(nodeId);
    if (!childIds) return [];

    return Array.from(childIds)
      .map(id => this._graph.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined);
  }

  getParent(nodeId: string): GraphNode | undefined {
    const node = this._graph.nodes.get(nodeId);
    if (!node?.parentId) return undefined;
    return this._graph.nodes.get(node.parentId);
  }

  /**
   * استيراد رسم بياني
   */
  import(data: { nodes: GraphNode[]; edges: GraphEdge[] }): void {
    this.clear();
    
    data.nodes.forEach(node => {
      this._graph.nodes.set(node.id, node);
      this._graph.nodeEdgeIndex.set(node.id, new Set());
      
      if (node.parentId) {
        this.addChildToParent(node.parentId, node.id);
      }
    });
    
    data.edges.forEach(edge => {
      this._graph.edges.set(edge.id, edge);
      
      if (edge.source.nodeId) {
        this._graph.nodeEdgeIndex.get(edge.source.nodeId)?.add(edge.id);
      }
      if (edge.target.nodeId) {
        this._graph.nodeEdgeIndex.get(edge.target.nodeId)?.add(edge.id);
      }
    });
  }

  /**
   * نقل العناصر لأب جديد
   */
  reparent(nodeIds: string[], newParentId: string | null): void {
    nodeIds.forEach(nodeId => {
      const node = this._graph.nodes.get(nodeId);
      if (!node) return;

      // إزالة من الأب القديم
      if (node.parentId) {
        this.removeChildFromParent(node.parentId, nodeId);
      }

      // إضافة للأب الجديد
      if (newParentId) {
        this.addChildToParent(newParentId, nodeId);
      }

      // تحديث العنصر
      this._graph.nodes.set(nodeId, {
        ...node,
        parentId: newParentId || undefined
      });
    });
  }

  /**
   * إيجاد أقرب نقطة ربط
   */
  findNearestAnchor(
    nodeId: string, 
    point: Point, 
    threshold: number = 20
  ): { anchor: string; position: { x: number; y: number }; distance: number } | null {
    const node = this._graph.nodes.get(nodeId);
    if (!node) return null;

    let nearestAnchor: string | null = null;
    let nearestPosition: Point | null = null;
    let minDistance = threshold;

    node.anchors.forEach(anchor => {
      const anchorPos = this.getAnchorPosition(node, anchor);
      const distance = Math.sqrt(
        Math.pow(point.x - anchorPos.x, 2) + 
        Math.pow(point.y - anchorPos.y, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestAnchor = anchor.id;
        nearestPosition = anchorPos;
      }
    });

    if (nearestAnchor && nearestPosition) {
      return { anchor: nearestAnchor, position: nearestPosition, distance: minDistance };
    }

    return null;
  }

  /**
   * الحصول على موقع نقطة الربط
   */
  private getAnchorPosition(node: GraphNode, anchor: NodeAnchor): Point {
    const { x, y } = node.position;
    const { width, height } = node.size;

    switch (anchor.position) {
      case 'top': return { x: x + width / 2, y };
      case 'bottom': return { x: x + width / 2, y: y + height };
      case 'left': return { x, y: y + height / 2 };
      case 'right': return { x: x + width, y: y + height / 2 };
      case 'center': return { x: x + width / 2, y: y + height / 2 };
      case 'top-left': return { x, y };
      case 'top-right': return { x: x + width, y };
      case 'bottom-left': return { x, y: y + height };
      case 'bottom-right': return { x: x + width, y: y + height };
      default: return { x: x + width / 2, y: y + height / 2 };
    }
  }

  /**
   * الحصول على الإحصائيات
   */
  getStats(): {
    nodeCount: number;
    edgeCount: number;
    connectedNodes: number;
    isolatedNodes: number;
  } {
    const nodes = this.getAllNodes();
    const edges = this.getAllEdges();

    let connectedNodes = 0;
    let isolatedNodes = 0;

    nodes.forEach(node => {
      const connectedEdges = this._graph.nodeEdgeIndex.get(node.id);
      if (!connectedEdges || connectedEdges.size === 0) {
        isolatedNodes++;
      } else {
        connectedNodes++;
      }
    });

    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      connectedNodes,
      isolatedNodes
    };
  }

  /**
   * حساب المكونات المتصلة
   */
  private countConnectedComponents(): number {
    const visited = new Set<string>();
    let components = 0;

    this._graph.nodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        this.dfs(nodeId, visited);
        components++;
      }
    });

    return components;
  }

  /**
   * بحث العمق أولاً
   */
  private dfs(nodeId: string, visited: Set<string>): void {
    visited.add(nodeId);

    const edgeIds = this._graph.nodeEdgeIndex.get(nodeId);
    if (!edgeIds) return;

    edgeIds.forEach(edgeId => {
      const edge = this._graph.edges.get(edgeId);
      if (!edge) return;

      const neighborId = edge.source.nodeId === nodeId 
        ? edge.target.nodeId 
        : edge.source.nodeId;

      if (neighborId && !visited.has(neighborId)) {
        this.dfs(neighborId, visited);
      }
    });
  }

  clear(): void {
    this._graph.nodes.clear();
    this._graph.edges.clear();
    this._graph.nodeEdgeIndex.clear();
    this._graph.parentChildIndex.clear();
  }

  // Private helpers
  private generateAnchors(nodeId: string): NodeAnchor[] {
    const positions: NodeAnchor['position'][] = [
      'top', 'bottom', 'left', 'right', 'center',
      'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ];

    return positions.map(position => ({
      id: `${nodeId}_${position}`,
      position
    }));
  }

  private addChildToParent(parentId: string, childId: string): void {
    if (!this._graph.parentChildIndex.has(parentId)) {
      this._graph.parentChildIndex.set(parentId, new Set());
    }
    this._graph.parentChildIndex.get(parentId)!.add(childId);

    const parent = this._graph.nodes.get(parentId);
    if (parent && !parent.childIds.includes(childId)) {
      parent.childIds.push(childId);
    }
  }

  private removeChildFromParent(parentId: string, childId: string): void {
    this._graph.parentChildIndex.get(parentId)?.delete(childId);
    
    const parent = this._graph.nodes.get(parentId);
    if (parent) {
      parent.childIds = parent.childIds.filter(id => id !== childId);
    }
  }

  private updateConnectedEdges(_nodeId: string): void {
    // Implementation for updating connected edges when node moves
  }

  private nodeIntersectsBounds(node: GraphNode, bounds: Bounds): boolean {
    return !(
      node.position.x + node.size.width < bounds.x ||
      node.position.x > bounds.x + bounds.width ||
      node.position.y + node.size.height < bounds.y ||
      node.position.y > bounds.y + bounds.height
    );
  }
}

export const canvasGraph = new CanvasGraphImpl();
