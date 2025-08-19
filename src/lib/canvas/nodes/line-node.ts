import { BaseNode } from './base-node';
import { LineNode as LineNodeData, Point } from '../types';

export class LineNode extends BaseNode {
  declare node: LineNodeData;

  constructor(node: LineNodeData) {
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
    if (style.opacity !== undefined) {
      ctx.globalAlpha = style.opacity;
    }

    ctx.beginPath();
    this.node.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    ctx.restore();
  }

  hitTest(point: Point): boolean {
    return this.containsPoint(point);
  }
}