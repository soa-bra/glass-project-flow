import { BaseNode } from './base-node';
import { RectNode as RectNodeData, Point } from '../types';

export class RectNode extends BaseNode {
  declare node: RectNodeData;

  constructor(node: RectNodeData) {
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

    // Calculate rectangle coordinates (centered)
    const x = -width / 2;
    const y = -height / 2;

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

    // Draw rectangle with optional border radius
    if (this.node.radius && this.node.radius > 0) {
      this.drawRoundedRect(ctx, x, y, width, height, this.node.radius);
    } else {
      ctx.rect(x, y, width, height);
    }

    // Fill and stroke
    if (style.fill) {
      ctx.fill();
    }
    if (style.stroke) {
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawRoundedRect(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  hitTest(point: Point): boolean {
    // Simple bounds checking for now
    // Could be enhanced for rotated rectangles
    const bounds = this.getBounds();
    return point.x >= bounds.x && 
           point.x <= bounds.x + bounds.width &&
           point.y >= bounds.y && 
           point.y <= bounds.y + bounds.height;
  }

  // Set border radius
  setRadius(radius: number): void {
    this.node.radius = Math.max(0, radius);
  }
}