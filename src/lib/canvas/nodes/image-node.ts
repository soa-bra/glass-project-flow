import { BaseNode } from './base-node';
import { ImageNode as ImageNodeData, Point } from '../types';

export class ImageNode extends BaseNode {
  declare node: ImageNodeData;
  private imageElement?: HTMLImageElement;
  private loaded = false;

  constructor(node: ImageNodeData) {
    super(node);
    this.loadImage();
  }

  private loadImage(): void {
    if (this.node.src) {
      this.imageElement = new Image();
      this.imageElement.onload = () => {
        this.loaded = true;
        if (this.node.preserveAspectRatio) {
          this.adjustSize();
        }
      };
      this.imageElement.src = this.node.src;
    }
  }

  private adjustSize(): void {
    if (!this.imageElement) return;
    
    const aspectRatio = this.imageElement.naturalWidth / this.imageElement.naturalHeight;
    const currentRatio = this.node.size.width / this.node.size.height;
    
    if (aspectRatio > currentRatio) {
      this.node.size.height = this.node.size.width / aspectRatio;
    } else {
      this.node.size.width = this.node.size.height * aspectRatio;
    }
  }

  render(ctx: CanvasRenderingContext2D, zoom: number): void {
    const { position, scale, rotation } = this.node.transform;
    const { width, height } = this.node.size;

    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.scale(scale.x, scale.y);

    const x = -width / 2;
    const y = -height / 2;

    if (this.loaded && this.imageElement) {
      ctx.drawImage(this.imageElement, x, y, width, height);
    } else {
      // Placeholder
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(x, y, width, height);
      
      ctx.fillStyle = '#666';
      ctx.font = `${12 / zoom}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('Loading...', 0, 0);
    }

    ctx.restore();
  }

  hitTest(point: Point): boolean {
    return this.containsPoint(point);
  }

  updateSrc(src: string): void {
    this.node.src = src;
    this.loaded = false;
    this.loadImage();
  }
}