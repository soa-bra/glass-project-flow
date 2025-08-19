import { CanvasNode, Point, Bounds, NodeStyle } from '../types';

export abstract class BaseNode {
  protected node: CanvasNode;

  constructor(node: CanvasNode) {
    this.node = node;
  }

  // Get the node data
  getNode(): CanvasNode {
    return this.node;
  }

  // Update node data
  updateNode(patch: Partial<CanvasNode>): void {
    this.node = { ...this.node, ...patch } as CanvasNode;
  }

  // Get node bounds in world coordinates
  getBounds(): Bounds {
    const { position } = this.node.transform;
    const { width, height } = this.node.size;
    
    return {
      x: position.x - width / 2,
      y: position.y - height / 2,
      width,
      height
    };
  }

  // Check if point is inside node
  containsPoint(point: Point): boolean {
    const bounds = this.getBounds();
    return point.x >= bounds.x && 
           point.x <= bounds.x + bounds.width &&
           point.y >= bounds.y && 
           point.y <= bounds.y + bounds.height;
  }

  // Get distance from point to node center
  distanceToPoint(point: Point): number {
    const { position } = this.node.transform;
    const dx = point.x - position.x;
    const dy = point.y - position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Move node by delta
  move(delta: Point): void {
    this.node.transform.position.x += delta.x;
    this.node.transform.position.y += delta.y;
  }

  // Set node position
  setPosition(position: Point): void {
    this.node.transform.position = { ...position };
  }

  // Rotate node
  rotate(angle: number): void {
    this.node.transform.rotation += angle;
  }

  // Set node rotation
  setRotation(rotation: number): void {
    this.node.transform.rotation = rotation;
  }

  // Scale node
  scale(scale: Point): void {
    this.node.transform.scale.x *= scale.x;
    this.node.transform.scale.y *= scale.y;
  }

  // Set node scale
  setScale(scale: Point): void {
    this.node.transform.scale = { ...scale };
  }

  // Resize node
  resize(newSize: { width?: number; height?: number }): void {
    if (newSize.width !== undefined) {
      this.node.size.width = Math.max(1, newSize.width);
    }
    if (newSize.height !== undefined) {
      this.node.size.height = Math.max(1, newSize.height);
    }
  }

  // Update style
  updateStyle(style: Partial<NodeStyle>): void {
    this.node.style = { ...this.node.style, ...style };
  }

  // Set visibility
  setVisible(visible: boolean): void {
    this.node.visible = visible;
  }

  // Set locked state
  setLocked(locked: boolean): void {
    this.node.locked = locked;
  }

  // Clone the node
  clone(newId: string): CanvasNode {
    return {
      ...this.node,
      id: newId,
      transform: {
        position: { ...this.node.transform.position },
        rotation: this.node.transform.rotation,
        scale: { ...this.node.transform.scale }
      },
      size: { ...this.node.size },
      style: { ...this.node.style },
      metadata: this.node.metadata ? { ...this.node.metadata } : undefined
    };
  }

  // Abstract method for rendering (to be implemented by subclasses)
  abstract render(ctx: CanvasRenderingContext2D, zoom: number): void;

  // Abstract method for hit testing (to be implemented by subclasses)
  abstract hitTest(point: Point): boolean;
}