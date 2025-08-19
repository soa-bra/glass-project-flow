import { SnapState, Point, Bounds, CanvasNode } from '../types';
import { SceneGraph } from '../utils/scene-graph';

export interface SnapResult {
  point: Point;
  snapped: boolean;
  snapLines?: SnapLine[];
}

export interface SnapLine {
  type: 'vertical' | 'horizontal';
  position: number;
  start: number;
  end: number;
}

export interface SnapGuide {
  id: string;
  type: 'center-x' | 'center-y' | 'left' | 'right' | 'top' | 'bottom' | 'grid';
  position: number;
  bounds?: Bounds;
}

export class SnapManager {
  private snapState: SnapState;
  private sceneGraph: SceneGraph;
  private activeSnapGuides: SnapGuide[] = [];

  constructor(sceneGraph: SceneGraph, initialState?: Partial<SnapState>) {
    this.snapState = {
      enabled: true,
      threshold: 8,
      snapToGrid: true,
      snapToNodes: true,
      gridSize: 20,
      ...initialState
    };
    this.sceneGraph = sceneGraph;
  }

  // Get current snap state
  getSnapState(): SnapState {
    return { ...this.snapState };
  }

  // Update snap settings
  updateSnapState(patch: Partial<SnapState>): void {
    this.snapState = { ...this.snapState, ...patch };
  }

  // Snap a point to grid and/or nearby nodes
  snapPoint(point: Point, excludeIds: string[] = []): SnapResult {
    if (!this.snapState.enabled) {
      return { point, snapped: false };
    }

    let snappedPoint = { ...point };
    let snapped = false;
    const snapLines: SnapLine[] = [];

    // Generate snap guides
    this.generateSnapGuides(excludeIds);

    // Try to snap to guides
    const xSnap = this.findClosestSnap(point.x, 'x');
    const ySnap = this.findClosestSnap(point.y, 'y');

    if (xSnap) {
      snappedPoint.x = xSnap.position;
      snapped = true;
      snapLines.push({
        type: 'vertical',
        position: xSnap.position,
        start: Math.min(point.y - 100, xSnap.bounds?.y || point.y - 100),
        end: Math.max(point.y + 100, (xSnap.bounds?.y || point.y) + (xSnap.bounds?.height || 200))
      });
    }

    if (ySnap) {
      snappedPoint.y = ySnap.position;
      snapped = true;
      snapLines.push({
        type: 'horizontal',
        position: ySnap.position,
        start: Math.min(point.x - 100, ySnap.bounds?.x || point.x - 100),
        end: Math.max(point.x + 100, (ySnap.bounds?.x || point.x) + (ySnap.bounds?.width || 200))
      });
    }

    return {
      point: snappedPoint,
      snapped,
      snapLines: snapLines.length > 0 ? snapLines : undefined
    };
  }

  // Snap a bounds (for resizing/moving nodes)
  snapBounds(bounds: Bounds, excludeIds: string[] = []): SnapResult & { bounds: Bounds } {
    if (!this.snapState.enabled) {
      return { point: { x: bounds.x, y: bounds.y }, bounds, snapped: false };
    }

    // Generate snap guides
    this.generateSnapGuides(excludeIds);

    let snappedBounds = { ...bounds };
    let snapped = false;
    const snapLines: SnapLine[] = [];

    // Key points to snap
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const left = bounds.x;
    const right = bounds.x + bounds.width;
    const top = bounds.y;
    const bottom = bounds.y + bounds.height;

    // Try to snap each edge and center
    const snapPoints = [
      { value: left, type: 'left' as const },
      { value: right, type: 'right' as const },
      { value: centerX, type: 'center-x' as const },
      { value: top, type: 'top' as const },
      { value: bottom, type: 'bottom' as const },
      { value: centerY, type: 'center-y' as const }
    ];

    for (const snapPoint of snapPoints) {
      const axis = snapPoint.type.includes('x') || ['left', 'right'].includes(snapPoint.type) ? 'x' : 'y';
      const snap = this.findClosestSnap(snapPoint.value, axis);

      if (snap) {
        const delta = snap.position - snapPoint.value;
        
        if (Math.abs(delta) <= this.snapState.threshold) {
          snapped = true;

          // Apply the snap based on which point was snapped
          switch (snapPoint.type) {
            case 'left':
              snappedBounds.x += delta;
              break;
            case 'right':
              snappedBounds.x += delta;
              break;
            case 'center-x':
              snappedBounds.x += delta;
              break;
            case 'top':
              snappedBounds.y += delta;
              break;
            case 'bottom':
              snappedBounds.y += delta;
              break;
            case 'center-y':
              snappedBounds.y += delta;
              break;
          }

          // Add snap line
          if (axis === 'x') {
            snapLines.push({
              type: 'vertical',
              position: snap.position,
              start: Math.min(snappedBounds.y, snap.bounds?.y || snappedBounds.y) - 50,
              end: Math.max(snappedBounds.y + snappedBounds.height, 
                           (snap.bounds?.y || snappedBounds.y) + (snap.bounds?.height || snappedBounds.height)) + 50
            });
          } else {
            snapLines.push({
              type: 'horizontal',
              position: snap.position,
              start: Math.min(snappedBounds.x, snap.bounds?.x || snappedBounds.x) - 50,
              end: Math.max(snappedBounds.x + snappedBounds.width,
                           (snap.bounds?.x || snappedBounds.x) + (snap.bounds?.width || snappedBounds.width)) + 50
            });
          }

          break; // Only snap to the first valid guide found
        }
      }
    }

    return {
      point: { x: snappedBounds.x, y: snappedBounds.y },
      bounds: snappedBounds,
      snapped,
      snapLines: snapLines.length > 0 ? snapLines : undefined
    };
  }

  // Generate snap guides from grid and nearby nodes
  private generateSnapGuides(excludeIds: string[]): void {
    this.activeSnapGuides = [];

    // Generate grid guides (only if snap to grid is enabled)
    if (this.snapState.snapToGrid) {
      // We don't pre-generate all grid lines as they're infinite
      // Instead, we'll handle grid snapping in findClosestSnap
    }

    // Generate node guides
    if (this.snapState.snapToNodes) {
      const allNodes = this.sceneGraph.getAllNodes()
        .filter(node => !excludeIds.includes(node.id) && node.visible !== false);

      allNodes.forEach(node => {
        const bounds = this.sceneGraph.getNodeBounds(node);
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;

        // Add guides for all edges and center
        this.activeSnapGuides.push(
          { id: node.id, type: 'left', position: bounds.x, bounds },
          { id: node.id, type: 'right', position: bounds.x + bounds.width, bounds },
          { id: node.id, type: 'center-x', position: centerX, bounds },
          { id: node.id, type: 'top', position: bounds.y, bounds },
          { id: node.id, type: 'bottom', position: bounds.y + bounds.height, bounds },
          { id: node.id, type: 'center-y', position: centerY, bounds }
        );
      });
    }
  }

  // Find the closest snap position for a coordinate
  private findClosestSnap(coordinate: number, axis: 'x' | 'y'): SnapGuide | null {
    let closestSnap: SnapGuide | null = null;
    let closestDistance = this.snapState.threshold;

    // Check grid snapping first
    if (this.snapState.snapToGrid) {
      const gridPosition = Math.round(coordinate / this.snapState.gridSize) * this.snapState.gridSize;
      const gridDistance = Math.abs(coordinate - gridPosition);
      
      if (gridDistance <= closestDistance) {
        closestSnap = {
          id: 'grid',
          type: 'grid',
          position: gridPosition
        };
        closestDistance = gridDistance;
      }
    }

    // Check node guides
    const relevantGuides = this.activeSnapGuides.filter(guide => {
      if (axis === 'x') {
        return ['left', 'right', 'center-x'].includes(guide.type);
      } else {
        return ['top', 'bottom', 'center-y'].includes(guide.type);
      }
    });

    for (const guide of relevantGuides) {
      const distance = Math.abs(coordinate - guide.position);
      if (distance < closestDistance) {
        closestSnap = guide;
        closestDistance = distance;
      }
    }

    return closestSnap;
  }

  // Get current snap guides (for rendering)
  getActiveSnapGuides(): SnapGuide[] {
    return [...this.activeSnapGuides];
  }

  // Clear active snap guides
  clearSnapGuides(): void {
    this.activeSnapGuides = [];
  }
}