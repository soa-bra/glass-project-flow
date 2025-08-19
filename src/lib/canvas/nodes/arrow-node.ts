import { BaseNode } from './base-node';
import { ArrowNode as ArrowNodeData, Point } from '../types';

export class ArrowNode extends BaseNode {
  declare node: ArrowNodeData;

  constructor(node: ArrowNodeData) {
    super(node);
  }

  render(ctx: CanvasRenderingContext2D, zoom: number): void {
    const { position, scale, rotation } = this.node.transform;
    const style = this.node.style;

    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.scale(scale.x, scale.y);

    if (style.stroke) {
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = (style.strokeWidth || 1) / zoom;
    }

    // Draw line
    ctx.beginPath();
    ctx.moveTo(this.node.start.x, this.node.start.y);
    ctx.lineTo(this.node.end.x, this.node.end.y);
    ctx.stroke();

    // Draw arrowhead
    const headSize = 10 / zoom;
    const angle = Math.atan2(this.node.end.y - this.node.start.y, this.node.end.x - this.node.start.x);
    
    ctx.save();
    ctx.translate(this.node.end.x, this.node.end.y);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-headSize, -headSize / 2);
    ctx.lineTo(-headSize, headSize / 2);
    ctx.closePath();
    
    if (this.node.arrowStyle === 'filled') {
      ctx.fill();
    } else {
      ctx.stroke();
    }
    
    ctx.restore();
    ctx.restore();
  }

  hitTest(point: Point): boolean {
    return this.containsPoint(point);
  }
}