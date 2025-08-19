import { BaseNode } from './base-node';
import { StickyNode as StickyNodeData, Point } from '../types';

export class StickyNode extends BaseNode {
  declare node: StickyNodeData;

  constructor(node: StickyNodeData) {
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
    const cornerRadius = 8;

    // Apply opacity
    if (style.opacity !== undefined) {
      ctx.globalAlpha = style.opacity;
    }

    // Draw sticky note background
    ctx.fillStyle = this.node.color;
    this.drawRoundedRect(ctx, x, y, width, height, cornerRadius);
    ctx.fill();

    // Draw subtle border
    ctx.strokeStyle = this.darkenColor(this.node.color, 0.2);
    ctx.lineWidth = 1 / zoom;
    ctx.stroke();

    // Draw folded corner (top-right)
    const foldSize = 12;
    this.drawFoldedCorner(ctx, x + width - foldSize, y, foldSize);

    // Draw text content
    if (this.node.content) {
      this.renderText(ctx, zoom, x, y, width, height);
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

  private drawFoldedCorner(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    const darkerColor = this.darkenColor(this.node.color, 0.3);
    
    ctx.fillStyle = darkerColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();

    // Fold line
    ctx.strokeStyle = this.darkenColor(this.node.color, 0.4);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size);
    ctx.stroke();
  }

  private renderText(
    ctx: CanvasRenderingContext2D,
    zoom: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const fontSize = Math.max(12, 16 / zoom);
    const padding = 12;
    const lineHeight = fontSize * 1.3;

    ctx.fillStyle = '#333333';
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Wrap text to fit within sticky note
    const words = this.node.content.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width <= width - padding * 2) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    // Draw lines
    lines.forEach((line, index) => {
      const textY = y + padding + index * lineHeight;
      if (textY + lineHeight <= y + height - padding) {
        ctx.fillText(line, x + padding, textY);
      }
    });
  }

  private darkenColor(color: string, factor: number): string {
    // Simple color darkening - in a real implementation, you'd want proper color manipulation
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const num = parseInt(hex, 16);
      const r = Math.floor((num >> 16) * (1 - factor));
      const g = Math.floor(((num >> 8) & 0x00FF) * (1 - factor));
      const b = Math.floor((num & 0x0000FF) * (1 - factor));
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color; // Fallback for non-hex colors
  }

  hitTest(point: Point): boolean {
    const bounds = this.getBounds();
    return point.x >= bounds.x && 
           point.x <= bounds.x + bounds.width &&
           point.y >= bounds.y && 
           point.y <= bounds.y + bounds.height;
  }

  // Update sticky note content
  updateContent(content: string): void {
    this.node.content = content;
  }

  // Update sticky note color
  updateColor(color: string): void {
    this.node.color = color;
  }

  // Get predefined sticky note colors
  static getPresetColors(): string[] {
    return [
      '#FFF740', // Yellow
      '#FF6B6B', // Pink
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEAA7', // Light yellow
      '#DDA0DD', // Plum
      '#98D8C8'  // Mint
    ];
  }
}