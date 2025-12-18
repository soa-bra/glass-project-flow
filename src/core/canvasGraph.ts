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
  /** الموقع النسبي (0-1) على الحافة */
  offset?: number;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  position: Point;
  size: { width: number; height: number };
  rotation?: number;
  /** نقاط الربط المتاحة */
  anchors: NodeAnchor[];
  /** معرف العنصر الأب (للعناصر المجمعة) */
  parentId?: string;
  /** معرفات العناصر الأبناء */
  childIds: string[];
  /** البيانات الإضافية الخاصة بنوع العنصر */
  data?: Record<string, any>;
  /** الطبقة */
  layerId: string;
  /** الترتيب */
  zIndex: number;
  /** مرئي */
  visible: boolean;
  /** مقفل */
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
  /** معرف العنصر المتصل (إذا كان متصلاً) */
  nodeId?: string;
  /** نقطة الربط على العنصر */
  anchor?: NodeAnchor['position'];
  /** الموقع المطلق (إذا لم يكن متصلاً) */
  position: Point;
  /** نمط نهاية الخط */
  style: EdgeEndStyle;
}

export interface EdgeControlPoint {
  id: string;
  position: Point;
  /** نوع نقطة التحكم */
  type: 'start' | 'end' | 'middle' | 'bezier';
  /** هل النقطة نشطة؟ */
  isActive: boolean;
  /** التسمية */
  label?: string;
}

export interface GraphEdge {
  id: string;
  type: EdgeType;
  /** نقطة البداية */
  source: EdgeEndpoint;
  /** نقطة النهاية */
  target: EdgeEndpoint;
  /** نقاط التحكم للمسارات المعقدة */
  controlPoints: EdgeControlPoint[];
  /** نمط الخط */
  style: {
    strokeColor: string;
    strokeWidth: number;
    strokeDash?: number[];
    opacity?: number;
  };
  /** التسمية */
  label?: string;
  /** بيانات إضافية */
  data?: Record<string, any>;
  /** الترتيب */
  zIndex: number;
}

// =============================================================================
// Types - Graph
// =============================================================================

export interface CanvasGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  /** فهرس العلاقات: nodeId -> edgeIds */
  nodeEdgeIndex: Map<string, Set<string>>;
  /** فهرس الأبناء: parentId -> childIds */
  parentChildIndex: Map<string, Set<string>>;
}

export interface GraphQuery {
  /** البحث حسب النوع */
  type?: NodeType | EdgeType;
  /** البحث في منطقة معينة */
  bounds?: Bounds;
  /** البحث حسب العنصر الأب */
  parentId?: string;
  /** البحث حسب الطبقة */
  layerId?: string;
  /** تضمين العناصر المخفية */
  includeHidden?: boolean;
  /** تضمين العناصر المقفلة */
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

  // ===========================================================================
  // Node Operations
  // ===========================================================================

  /**
   * إضافة عنصر جديد
   */
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

    // إضافة للفهرس الأبوي
    if (node.parentId) {
      this.addChildToParent(node.parentId, id);
    }

    return newNode;
  }

  /**
   * تحديث عنصر
   */
  updateNode(nodeId: string, updates: Partial<GraphNode>): GraphNode | null {
    const node = this._graph.nodes.get(nodeId);
    if (!node) return null;

    const updatedNode = { ...node, ...updates };
    this._graph.nodes.set(nodeId, updatedNode);

    // تحديث الموصلات المتصلة
    if (updates.position || updates.size) {
      this.updateConnectedEdges(nodeId);
    }

    // تحديث العلاقة الأبوية
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

  /**
   * حذف عنصر
   */
  removeNode(nodeId: string): boolean {
    const node = this._graph.nodes.get(nodeId);
    if (!node) return false;

    // حذف الموصلات المتصلة
    const connectedEdges = this._graph.nodeEdgeIndex.get(nodeId);
    if (connectedEdges) {
      connectedEdges.forEach(edgeId => this.removeEdge(edgeId));
    }

    // حذف من الفهرس الأبوي
    if (node.parentId) {
      this.removeChildFromParent(node.parentId, nodeId);
    }

    // حذف الأبناء (إذا كان إطاراً أو مجموعة)
    node.childIds.forEach(childId => {
      const childNode = this._graph.nodes.get(childId);
      if (childNode) {
        this.updateNode(childId, { parentId: undefined });
      }
    });

    // حذف الفهارس
    this._graph.nodeEdgeIndex.delete(nodeId);
    this._graph.parentChildIndex.delete(nodeId);
    
    return this._graph.nodes.delete(nodeId);
  }

  /**
   * الحصول على عنصر
   */
  getNode(nodeId: string): GraphNode | undefined {
    return this._graph.nodes.get(nodeId);
  }

  /**
   * الحصول على جميع العناصر
   */
  getAllNodes(): GraphNode[] {
    return Array.from(this._graph.nodes.values());
  }

  /**
   * استعلام العناصر
   */
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

  // ===========================================================================
  // Edge Operations
  // ===========================================================================

  /**
   * إضافة موصل جديد
   */
  addEdge(edge: Omit<GraphEdge, 'id'>): GraphEdge {
    const id = nanoid();
    
    const newEdge: GraphEdge = {
      ...edge,
      id
    };

    this._graph.edges.set(id, newEdge);

    // تحديث فهرس العلاقات
    if (edge.source.nodeId) {
      const nodeEdges = this._graph.nodeEdgeIndex.get(edge.source.nodeId);
      if (nodeEdges) {
        nodeEdges.add(id);
      }
    }

    if (edge.target.nodeId) {
      const nodeEdges = this._graph.nodeEdgeIndex.get(edge.target.nodeId);
      if (nodeEdges) {
        nodeEdges.add(id);
      }
    }

    return newEdge;
  }

  /**
   * تحديث موصل
   */
  updateEdge(edgeId: string, updates: Partial<GraphEdge>): GraphEdge | null {
    const edge = this._graph.edges.get(edgeId);
    if (!edge) return null;

    // تحديث الفهرس إذا تغيرت الاتصالات
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

  /**
   * حذف موصل
   */
  removeEdge(edgeId: string): boolean {
    const edge = this._graph.edges.get(edgeId);
    if (!edge) return false;

    // حذف من فهرس العلاقات
    if (edge.source.nodeId) {
      this._graph.nodeEdgeIndex.get(edge.source.nodeId)?.delete(edgeId);
    }
    if (edge.target.nodeId) {
      this._graph.nodeEdgeIndex.get(edge.target.nodeId)?.delete(edgeId);
    }

    return this._graph.edges.delete(edgeId);
  }

  /**
   * الحصول على موصل
   */
  getEdge(edgeId: string): GraphEdge | undefined {
    return this._graph.edges.get(edgeId);
  }

  /**
   * الحصول على جميع الموصلات
   */
  getAllEdges(): GraphEdge[] {
    return Array.from(this._graph.edges.values());
  }

  /**
   * الحصول على الموصلات المتصلة بعنصر
   */
  getNodeEdges(nodeId: string): GraphEdge[] {
    const edgeIds = this._graph.nodeEdgeIndex.get(nodeId);
    if (!edgeIds) return [];

    return Array.from(edgeIds)
      .map(id => this._graph.edges.get(id))
      .filter((e): e is GraphEdge => e !== undefined);
  }

  // ===========================================================================
  // Relationship Operations
  // ===========================================================================

  /**
   * الحصول على أبناء عنصر
   */
  getChildren(nodeId: string): GraphNode[] {
    const childIds = this._graph.parentChildIndex.get(nodeId);
    if (!childIds) return [];

    return Array.from(childIds)
      .map(id => this._graph.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined);
  }

  /**
   * الحصول على الأب
   */
  getParent(nodeId: string): GraphNode | undefined {
    const node = this._graph.nodes.get(nodeId);
    if (!node?.parentId) return undefined;
    return this._graph.nodes.get(node.parentId);
  }

  /**
   * الحصول على جميع الأسلاف
   */
  getAncestors(nodeId: string): GraphNode[] {
    const ancestors: GraphNode[] = [];
    let current = this.getParent(nodeId);
    
    while (current) {
      ancestors.push(current);
      current = this.getParent(current.id);
    }
    
    return ancestors;
  }

  /**
   * الحصول على جميع الأحفاد
   */
  getDescendants(nodeId: string): GraphNode[] {
    const descendants: GraphNode[] = [];
    const stack = [...this.getChildren(nodeId)];
    
    while (stack.length > 0) {
      const node = stack.pop()!;
      descendants.push(node);
      stack.push(...this.getChildren(node.id));
    }
    
    return descendants;
  }

  /**
   * نقل عناصر إلى أب جديد
   */
  reparent(nodeIds: string[], newParentId: string | null): void {
    nodeIds.forEach(nodeId => {
      const node = this._graph.nodes.get(nodeId);
      if (!node) return;

      if (node.parentId) {
        this.removeChildFromParent(node.parentId, nodeId);
      }

      if (newParentId) {
        this.addChildToParent(newParentId, nodeId);
      }

      this.updateNode(nodeId, { parentId: newParentId || undefined });
    });
  }

  // ===========================================================================
  // Anchor & Connection Helpers
  // ===========================================================================

  /**
   * توليد نقاط الربط لعنصر
   */
  private generateAnchors(nodeId: string): NodeAnchor[] {
    const positions: NodeAnchor['position'][] = [
      'top', 'bottom', 'left', 'right', 'center',
      'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ];

    return positions.map(position => ({
      id: `${nodeId}-${position}`,
      position
    }));
  }

  /**
   * حساب موقع نقطة ربط
   */
  getAnchorPosition(nodeId: string, anchor: NodeAnchor['position']): Point | null {
    const node = this._graph.nodes.get(nodeId);
    if (!node) return null;

    const { x, y } = node.position;
    const { width, height } = node.size;

    const anchorPositions: Record<NodeAnchor['position'], Point> = {
      'center': { x: x + width / 2, y: y + height / 2 },
      'top': { x: x + width / 2, y },
      'bottom': { x: x + width / 2, y: y + height },
      'left': { x, y: y + height / 2 },
      'right': { x: x + width, y: y + height / 2 },
      'top-left': { x, y },
      'top-right': { x: x + width, y },
      'bottom-left': { x, y: y + height },
      'bottom-right': { x: x + width, y: y + height }
    };

    return anchorPositions[anchor];
  }

  /**
   * إيجاد أقرب نقطة ربط لنقطة معينة
   */
  findNearestAnchor(nodeId: string, point: Point, threshold: number = 20): { anchor: NodeAnchor['position']; position: Point; distance: number } | null {
    const node = this._graph.nodes.get(nodeId);
    if (!node) return null;

    let nearest: { anchor: NodeAnchor['position']; position: Point; distance: number } | null = null;

    for (const anchor of node.anchors) {
      const anchorPos = this.getAnchorPosition(nodeId, anchor.position);
      if (!anchorPos) continue;

      const distance = Math.hypot(point.x - anchorPos.x, point.y - anchorPos.y);
      
      if (distance <= threshold && (!nearest || distance < nearest.distance)) {
        nearest = { anchor: anchor.position, position: anchorPos, distance };
      }
    }

    return nearest;
  }

  /**
   * تحديث الموصلات المتصلة بعنصر
   */
  private updateConnectedEdges(nodeId: string): void {
    const edges = this.getNodeEdges(nodeId);
    
    edges.forEach(edge => {
      let updates: Partial<GraphEdge> = {};

      if (edge.source.nodeId === nodeId && edge.source.anchor) {
        const newPos = this.getAnchorPosition(nodeId, edge.source.anchor);
        if (newPos) {
          updates.source = { ...edge.source, position: newPos };
        }
      }

      if (edge.target.nodeId === nodeId && edge.target.anchor) {
        const newPos = this.getAnchorPosition(nodeId, edge.target.anchor);
        if (newPos) {
          updates.target = { ...edge.target, position: newPos };
        }
      }

      if (Object.keys(updates).length > 0) {
        this.updateEdge(edge.id, updates);
      }
    });
  }

  // ===========================================================================
  // Parent-Child Index Helpers
  // ===========================================================================

  private addChildToParent(parentId: string, childId: string): void {
    let children = this._graph.parentChildIndex.get(parentId);
    if (!children) {
      children = new Set();
      this._graph.parentChildIndex.set(parentId, children);
    }
    children.add(childId);

    // تحديث childIds في العنصر الأب
    const parent = this._graph.nodes.get(parentId);
    if (parent && !parent.childIds.includes(childId)) {
      parent.childIds.push(childId);
    }
  }

  private removeChildFromParent(parentId: string, childId: string): void {
    const children = this._graph.parentChildIndex.get(parentId);
    if (children) {
      children.delete(childId);
    }

    // تحديث childIds في العنصر الأب
    const parent = this._graph.nodes.get(parentId);
    if (parent) {
      parent.childIds = parent.childIds.filter(id => id !== childId);
    }
  }

  // ===========================================================================
  // Geometry Helpers
  // ===========================================================================

  private nodeIntersectsBounds(node: GraphNode, bounds: Bounds): boolean {
    return (
      node.position.x < bounds.x + bounds.width &&
      node.position.x + node.size.width > bounds.x &&
      node.position.y < bounds.y + bounds.height &&
      node.position.y + node.size.height > bounds.y
    );
  }

  // ===========================================================================
  // Serialization
  // ===========================================================================

  /**
   * تصدير الرسم البياني
   */
  export(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
      nodes: this.getAllNodes(),
      edges: this.getAllEdges()
    };
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
   * مسح الرسم البياني
   */
  clear(): void {
    this._graph = {
      nodes: new Map(),
      edges: new Map(),
      nodeEdgeIndex: new Map(),
      parentChildIndex: new Map()
    };
  }

  // ===========================================================================
  // Statistics
  // ===========================================================================

  /**
   * إحصائيات الرسم البياني
   */
  getStats(): {
    nodeCount: number;
    edgeCount: number;
    connectedNodes: number;
    isolatedNodes: number;
  } {
    const nodeCount = this._graph.nodes.size;
    const edgeCount = this._graph.edges.size;
    
    let connectedNodes = 0;
    this._graph.nodeEdgeIndex.forEach(edges => {
      if (edges.size > 0) connectedNodes++;
    });

    return {
      nodeCount,
      edgeCount,
      connectedNodes,
      isolatedNodes: nodeCount - connectedNodes
    };
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const canvasGraph = new CanvasGraphImpl();

// =============================================================================
// Helper Types for Integration
// =============================================================================

export interface GraphEventPayload {
  type: 'node-added' | 'node-updated' | 'node-removed' | 'edge-added' | 'edge-updated' | 'edge-removed';
  nodeId?: string;
  edgeId?: string;
  data?: any;
}

export type GraphEventListener = (event: GraphEventPayload) => void;
