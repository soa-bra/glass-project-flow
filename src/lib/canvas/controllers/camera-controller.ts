import { Camera, Point, Bounds, Viewport } from '../types';

export class CameraController {
  private camera: Camera;
  private viewport: Viewport;
  private panSpeed: number = 1;
  private zoomSpeed: number = 0.1;

  constructor(initialCamera: Camera, viewport: Viewport) {
    this.camera = { ...initialCamera };
    this.viewport = viewport;
  }

  // Get current camera state
  getCamera(): Camera {
    return { ...this.camera };
  }

  // Get viewport
  getViewport(): Viewport {
    return this.viewport;
  }

  // Update viewport size
  updateViewport(viewport: Viewport): void {
    this.viewport = viewport;
  }

  // Pan camera by delta
  pan(delta: Point): void {
    this.camera.position.x -= delta.x / this.camera.zoom;
    this.camera.position.y -= delta.y / this.camera.zoom;
  }

  // Set camera position
  setPosition(position: Point): void {
    this.camera.position = { ...position };
  }

  // Zoom at a specific point (screen coordinates)
  zoomAt(screenPoint: Point, deltaZoom: number): void {
    const oldZoom = this.camera.zoom;
    const newZoom = this.clampZoom(oldZoom * (1 + deltaZoom));
    
    if (newZoom === oldZoom) return;

    // Convert screen point to world coordinates
    const worldPoint = this.screenToWorld(screenPoint);
    
    // Update zoom
    this.camera.zoom = newZoom;
    
    // Adjust position to keep the world point under the cursor
    const newScreenPoint = this.worldToScreen(worldPoint);
    const screenDelta = {
      x: screenPoint.x - newScreenPoint.x,
      y: screenPoint.y - newScreenPoint.y
    };
    
    this.camera.position.x -= screenDelta.x / this.camera.zoom;
    this.camera.position.y -= screenDelta.y / this.camera.zoom;
  }

  // Set zoom level
  setZoom(zoom: number): void {
    this.camera.zoom = this.clampZoom(zoom);
  }

  // Zoom to fit bounds in viewport
  zoomToBounds(bounds: Bounds, padding: number = 50): void {
    const viewportWidth = this.viewport.size.width - padding * 2;
    const viewportHeight = this.viewport.size.height - padding * 2;
    
    const scaleX = viewportWidth / bounds.width;
    const scaleY = viewportHeight / bounds.height;
    const scale = Math.min(scaleX, scaleY);
    
    this.camera.zoom = this.clampZoom(scale);
    this.camera.position = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
  }

  // Convert screen coordinates to world coordinates
  screenToWorld(screenPoint: Point): Point {
    const centerX = this.viewport.size.width / 2;
    const centerY = this.viewport.size.height / 2;
    
    return {
      x: this.camera.position.x + (screenPoint.x - centerX) / this.camera.zoom,
      y: this.camera.position.y + (screenPoint.y - centerY) / this.camera.zoom
    };
  }

  // Convert world coordinates to screen coordinates
  worldToScreen(worldPoint: Point): Point {
    const centerX = this.viewport.size.width / 2;
    const centerY = this.viewport.size.height / 2;
    
    return {
      x: centerX + (worldPoint.x - this.camera.position.x) * this.camera.zoom,
      y: centerY + (worldPoint.y - this.camera.position.y) * this.camera.zoom
    };
  }

  // Get visible world bounds (what's currently visible in the viewport)
  getVisibleBounds(): Bounds {
    const topLeft = this.screenToWorld({ x: 0, y: 0 });
    const bottomRight = this.screenToWorld({
      x: this.viewport.size.width,
      y: this.viewport.size.height
    });
    
    return {
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y
    };
  }

  // Check if a bounds is visible in current viewport
  isVisible(bounds: Bounds): boolean {
    const viewBounds = this.getVisibleBounds();
    
    return !(bounds.x + bounds.width < viewBounds.x ||
             viewBounds.x + viewBounds.width < bounds.x ||
             bounds.y + bounds.height < viewBounds.y ||
             viewBounds.y + viewBounds.height < bounds.y);
  }

  // Clamp zoom to min/max values
  private clampZoom(zoom: number): number {
    return Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, zoom));
  }

  // Animate camera to target position and zoom
  animateTo(
    targetPosition: Point,
    targetZoom?: number,
    duration: number = 500
  ): Promise<void> {
    return new Promise((resolve) => {
      const startPosition = { ...this.camera.position };
      const startZoom = this.camera.zoom;
      const endZoom = targetZoom !== undefined ? this.clampZoom(targetZoom) : startZoom;
      
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate position
        this.camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * eased;
        this.camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * eased;
        
        // Interpolate zoom
        this.camera.zoom = startZoom + (endZoom - startZoom) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
}
