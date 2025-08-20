import { CanvasNode, Point, Bounds } from '../types';
import { QuadTree, QuadTreeItem } from './quadtree';

export class SceneGraph {
  private nodes: Map<string, CanvasNode>;
  private quadTree: QuadTree;
  private rootBounds: Bounds;
  private isDirty: boolean;

  constructor(initialBounds: Bounds = { x: -10000, y: -10000, width: 20000, height: 20000 }) {
    this.nodes = new Map();
    this.rootBounds = initialBounds;
    this.quadTree = new QuadTree(this.rootBounds);
    this.isDirty = false;
  }

  // Add a node to the scene graph
  addNode(node: CanvasNode): void {
    this.nodes.set(node.id, node);
    this.isDirty = true;
  }

  // Update a node in the scene graph
  updateNode(id: string, patch: Partial<CanvasNode>): CanvasNode | null {
    const existingNode = this.nodes.get(id);
    if (!existingNode) return null;

    // If type is being changed, reject the update to maintain type safety
    if (patch.type && patch.type !== existingNode.type) {
      console.warn(`Cannot change node type from ${existingNode.type} to ${patch.type}`);
      return null;
    }

    const updatedNode = { ...existingNode, ...patch } as CanvasNode;
    this.nodes.set(id, updatedNode);
    this.isDirty = true;
    
    return updatedNode;
  }

  // Remove a node from the scene graph
  removeNode(id: string): boolean {
    const removed = this.nodes.delete(id);
    if (removed) {
      this.isDirty = true;
    }
    return removed;
  }

  // Get a node by ID
  getNode(id: string): CanvasNode | undefined {
    return this.nodes.get(id);
  }

  // Get all nodes
  getAllNodes(): CanvasNode[] {
    return Array.from(this.nodes.values());
  }

  // Get visible nodes in viewport
  getVisibleNodes(viewportBounds: Bounds): CanvasNode[] {
    this.updateQuadTreeIfNeeded();
    
    const items = this.quadTree.retrieve(viewportBounds);
    return items
      .map(item => this.nodes.get(item.id))
      .filter((node): node is CanvasNode => node !== undefined && node.visible !== false);
  }

  // Hit test - find nodes at a point
  hitTest(point: Point): CanvasNode[] {
    this.updateQuadTreeIfNeeded();
    
    const items = this.quadTree.hitTest(point);
    return items
      .map(item => this.nodes.get(item.id))
      .filter((node): node is CanvasNode => node !== undefined && node.visible !== false)
      .sort((a, b) => {
        // Sort by z-index if available, otherwise by creation order
        const aZ = (a.metadata?.zIndex as number) || 0;
        const bZ = (b.metadata?.zIndex as number) || 0;
        return bZ - aZ; // Higher z-index first
      });
  }

  // Get nodes within a bounds (for selection)
  getNodesInBounds(bounds: Bounds): CanvasNode[] {
    this.updateQuadTreeIfNeeded();
    
    const items = this.quadTree.retrieve(bounds);
    return items
      .map(item => this.nodes.get(item.id))
      .filter((node): node is CanvasNode => {
        if (!node || node.visible === false) return false;
        const nodeBounds = this.getNodeBounds(node);
        return this.boundsIntersect(bounds, nodeBounds);
      });
  }

  // Calculate bounding box for a node
  getNodeBounds(node: CanvasNode): Bounds {
    const { position } = node.transform;
    const { width, height } = node.size;
    
    return {
      x: position.x - width / 2,
      y: position.y - height / 2,
      width,
      height
    };
  }

  // Check if two bounds intersect
  private boundsIntersect(a: Bounds, b: Bounds): boolean {
    return !(a.x + a.width < b.x || 
             b.x + b.width < a.x || 
             a.y + a.height < b.y || 
             b.y + b.height < a.y);
  }

  // Update QuadTree if the scene has changed
  private updateQuadTreeIfNeeded(): void {
    if (!this.isDirty) return;

    this.quadTree.clear();
    
    for (const node of this.nodes.values()) {
      if (node.visible === false) continue;
      
      const bounds = this.getNodeBounds(node);
      const item: QuadTreeItem = {
        id: node.id,
        bounds,
        data: node
      };
      
      this.quadTree.insert(item);
    }
    
    this.isDirty = false;
  }

  // Get bounds that encompass all nodes
  getSceneBounds(): Bounds {
    if (this.nodes.size === 0) {
      return { x: 0, y: 0, width: 100, height: 100 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of this.nodes.values()) {
      if (node.visible === false) continue;
      
      const bounds = this.getNodeBounds(node);
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  // Clear all nodes
  clear(): void {
    this.nodes.clear();
    this.quadTree.clear();
    this.isDirty = false;
  }

  // Get statistics
  getStats() {
    return {
      nodeCount: this.nodes.size,
      visibleNodeCount: Array.from(this.nodes.values()).filter(n => n.visible !== false).length,
      sceneBounds: this.getSceneBounds()
    };
  }

  // Enhanced API methods for better integration

  // Get node bounds by ID (missing method)
  getNodeBoundsById(id: string): { x: number; y: number; width: number; height: number } | null {
    const node = this.nodes.get(id);
    if (!node) return null;
    return this.getNodeBounds(node);
  }

  // Count nodes (simple accessor)
  count(): number {
    return this.nodes.size;
  }

  // Render method (placeholder for compatibility)
  render(): void {
    // This method is implemented by the actual rendering layer
    // SceneGraph is primarily for data management
    this.updateQuadTreeIfNeeded();
  }
}