// Texture Atlas for Canvas Performance
export interface TextureInfo {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export class TextureAtlas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private textures = new Map<string, TextureInfo>();
  private freeRects: Array<{ x: number; y: number; width: number; height: number }> = [];
  private maxSize: number;
  private currentY = 0;
  private currentRowHeight = 0;

  constructor(maxSize = 2048) {
    this.maxSize = maxSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = maxSize;
    this.canvas.height = maxSize;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Initialize with full atlas as free space
    this.freeRects.push({ x: 0, y: 0, width: maxSize, height: maxSize });
  }

  addTexture(id: string, source: HTMLImageElement | HTMLCanvasElement): TextureInfo | null {
    if (this.textures.has(id)) {
      return this.textures.get(id)!;
    }

    const width = source.width;
    const height = source.height;

    // Find best fit using shelf packing algorithm
    const position = this.findBestFit(width, height);
    if (!position) {
      console.warn(`Cannot fit texture ${id} (${width}x${height}) in atlas`);
      return null;
    }

    // Draw texture to atlas
    this.ctx.drawImage(source, position.x, position.y, width, height);

    const textureInfo: TextureInfo = {
      id,
      x: position.x,
      y: position.y,
      width,
      height,
      originalWidth: width,
      originalHeight: height
    };

    this.textures.set(id, textureInfo);
    return textureInfo;
  }

  private findBestFit(width: number, height: number): { x: number; y: number } | null {
    // Try to fit in current row first
    if (this.currentY + height <= this.maxSize) {
      let currentX = 0;
      
      // Find space in current row
      for (const texture of this.textures.values()) {
        if (texture.y === this.currentY) {
          currentX = Math.max(currentX, texture.x + texture.width);
        }
      }

      if (currentX + width <= this.maxSize) {
        this.currentRowHeight = Math.max(this.currentRowHeight, height);
        return { x: currentX, y: this.currentY };
      }
    }

    // Move to next row
    this.currentY += this.currentRowHeight;
    this.currentRowHeight = height;

    if (this.currentY + height <= this.maxSize && width <= this.maxSize) {
      return { x: 0, y: this.currentY };
    }

    return null; // Cannot fit
  }

  getTexture(id: string): TextureInfo | undefined {
    return this.textures.get(id);
  }

  renderTexture(
    ctx: CanvasRenderingContext2D,
    textureId: string,
    dx: number,
    dy: number,
    dw?: number,
    dh?: number
  ): boolean {
    const texture = this.textures.get(textureId);
    if (!texture) return false;

    const drawWidth = dw || texture.width;
    const drawHeight = dh || texture.height;

    ctx.drawImage(
      this.canvas,
      texture.x, texture.y, texture.width, texture.height,
      dx, dy, drawWidth, drawHeight
    );

    return true;
  }

  removeTexture(id: string): void {
    this.textures.delete(id);
    // Note: In a production implementation, you'd want to track free space
    // and allow reuse of removed texture areas
  }

  getAtlasCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getAtlasUsage(): number {
    let usedArea = 0;
    for (const texture of this.textures.values()) {
      usedArea += texture.width * texture.height;
    }
    return usedArea / (this.maxSize * this.maxSize);
  }

  clear(): void {
    this.textures.clear();
    this.ctx.clearRect(0, 0, this.maxSize, this.maxSize);
    this.currentY = 0;
    this.currentRowHeight = 0;
  }

  // Create texture from canvas element
  static async createTextureFromCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = canvas.width;
    textureCanvas.height = canvas.height;
    
    const ctx = textureCanvas.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0);
    
    return textureCanvas;
  }

  // Create texture from URL
  static async createTextureFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
}