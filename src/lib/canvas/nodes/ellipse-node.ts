import { BaseNode } from './base-node';
import { EllipseNode as EllipseNodeData, Point } from '../types';

export class EllipseNode extends BaseNode {
  declare node: EllipseNodeData;

  constructor(node: EllipseNodeData) {
    super(node);
  }

  render(ctx: CanvasRenderingContext2D, zoom: number): void {
    const { position, scale, rotation } = this.node.transform;
    const { width, height } = this.node.size;
    const style = this.node.style;

    ctx.save();

    // Apply transformations
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.scale(scale.x, scale.y);

    // Apply style
    if (style.fill) {
      ctx.fillStyle = style.fill;
    }
    if (style.stroke) {
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = (style.strokeWidth || 1) / zoom;
    }
    if (style.opacity !== undefined) {
      ctx.globalAlpha = style.opacity;
    }

    // Draw ellipse
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, 2 * Math.PI);

    // Fill and stroke
    if (style.fill) {
      ctx.fill();
    }
    if (style.stroke) {
      ctx.stroke();
    }

    ctx.restore();
  }

  hitTest(point: Point): boolean {
    const { position } = this.node.transform;
    const { width, height } = this.node.size;

    // Calculate normalized coordinates
    const dx = (point.x - position.x) / (width / 2);
    const dy = (point.y - position.y) / (height / 2);

    // Point is inside ellipse if distance from center <= 1
    return (dx * dx + dy * dy) <= 1;
  }

  // Check if this is a circle (width === height)
  isCircle(): boolean {
    return this.node.size.width === this.node.size.height;
  }

  // Get radius (only meaningful if it's a circle)
  getRadius(): number {
    return Math.min(this.node.size.width, this.node.size.height) / 2;
  }
}