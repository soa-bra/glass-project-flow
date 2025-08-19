import { BaseNode } from './base-node';
import { TextNode as TextNodeData, Point } from '../types';

export class TextNode extends BaseNode {
  declare node: TextNodeData;
  private measuredSize?: { width: number; height: number };

  constructor(node: TextNodeData) {
    super(node);
  }

  render(ctx: CanvasRenderingContext2D, zoom: number): void {
    const { position, scale, rotation } = this.node.transform;
    const style = this.node.style;

    ctx.save();

    // Apply transformations
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.scale(scale.x, scale.y);

    // Set font properties
    const fontSize = this.node.fontSize / zoom; // Adjust font size for zoom
    ctx.font = `${this.node.fontWeight || 'normal'} ${fontSize}px ${this.node.fontFamily}`;
    ctx.textAlign = this.node.textAlign || 'center';
    ctx.textBaseline = 'middle';

    // Apply text color
    ctx.fillStyle = this.node.color;

    // Apply opacity
    if (style.opacity !== undefined) {
      ctx.globalAlpha = style.opacity;
    }

    // Split text into lines
    const lines = this.node.content.split('\n');
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = -totalHeight / 2 + lineHeight / 2;

    // Render each line
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      
      // Draw text stroke if specified
      if (style.stroke && style.strokeWidth) {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.strokeWidth / zoom;
        ctx.strokeText(line, 0, y);
      }

      // Draw text fill
      ctx.fillText(line, 0, y);
    });

    ctx.restore();

    // Update measured size for hit testing
    this.updateMeasuredSize(ctx, fontSize, lines, lineHeight);
  }

  private updateMeasuredSize(
    ctx: CanvasRenderingContext2D, 
    fontSize: number, 
    lines: string[], 
    lineHeight: number
  ): void {
    // Measure text dimensions
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });

    this.measuredSize = {
      width: maxWidth,
      height: lines.length * lineHeight
    };

    // Update node size to match text
    this.node.size.width = this.measuredSize.width;
    this.node.size.height = this.measuredSize.height;
  }

  hitTest(point: Point): boolean {
    if (!this.measuredSize) {
      return this.containsPoint(point);
    }

    const { position } = this.node.transform;
    const { width, height } = this.measuredSize;

    // Create bounds based on text alignment
    let bounds = {
      x: position.x - width / 2,
      y: position.y - height / 2,
      width,
      height
    };

    // Adjust bounds based on text alignment
    switch (this.node.textAlign) {
      case 'left':
        bounds.x = position.x;
        break;
      case 'right':
        bounds.x = position.x - width;
        break;
      case 'center':
      default:
        bounds.x = position.x - width / 2;
        break;
    }

    return point.x >= bounds.x && 
           point.x <= bounds.x + bounds.width &&
           point.y >= bounds.y && 
           point.y <= bounds.y + bounds.height;
  }

  // Update text content
  updateContent(content: string): void {
    this.node.content = content;
    this.measuredSize = undefined; // Force re-measurement
  }

  // Update font properties
  updateFont(fontSize?: number, fontFamily?: string, fontWeight?: 'normal' | 'bold'): void {
    if (fontSize !== undefined) this.node.fontSize = fontSize;
    if (fontFamily !== undefined) this.node.fontFamily = fontFamily;
    if (fontWeight !== undefined) this.node.fontWeight = fontWeight;
    this.measuredSize = undefined; // Force re-measurement
  }

  // Update text alignment
  updateAlignment(textAlign: 'left' | 'center' | 'right'): void {
    this.node.textAlign = textAlign;
  }

  // Update text color
  updateColor(color: string): void {
    this.node.color = color;
  }

  // Get measured text size
  getMeasuredSize(): { width: number; height: number } | undefined {
    return this.measuredSize;
  }

  // Auto-resize to fit content
  autoResize(ctx: CanvasRenderingContext2D): void {
    const fontSize = this.node.fontSize;
    ctx.font = `${this.node.fontWeight || 'normal'} ${fontSize}px ${this.node.fontFamily}`;
    
    const lines = this.node.content.split('\n');
    const lineHeight = fontSize * 1.2;
    
    this.updateMeasuredSize(ctx, fontSize, lines, lineHeight);
  }
}