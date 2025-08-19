import { BaseNode } from './base-node';
import { FrameNode as FrameNodeData, Point } from '../types';

export class FrameNode extends BaseNode {
  declare node: FrameNodeData;

  constructor(node: FrameNodeData) {
    super(node);
  }

  render(ctx: CanvasRenderingContext2D, zoom: number): void {
    const { position, scale, rotation } = this.node.transform;
    const { width, height } = this.node.size;
    const style = this.node.style;

    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.scale(scale.x, scale.y);

    const x = -width / 2;
    const y = -height / 2;

    // Draw frame background
    if (style.fill) {
      ctx.fillStyle = style.fill;
      ctx.fillRect(x, y, width, height);
    }

    // Draw frame border
    if (style.stroke) {
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = (style.strokeWidth || 2) / zoom;
      ctx.strokeRect(x, y, width, height);
    }

    // Draw title
    if (this.node.title) {
      ctx.fillStyle = '#333';
      ctx.font = `${14 / zoom}px Arial`;
      ctx.fillText(this.node.title, x + 10, y + 20);
    }

    ctx.restore();
  }

  hitTest(point: Point): boolean {
    return this.containsPoint(point);
  }
}