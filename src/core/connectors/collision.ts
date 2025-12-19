/**
 * Collision Detection - تجنب التداخلات
 * Sprint 3: Connector Tool 2.0
 */

import type { Point } from '@/core/canvasKernel';
import type { ElementBounds } from './anchors';

// =============================================================================
// Types
// =============================================================================

export interface Obstacle {
  id: string;
  bounds: ElementBounds;
  padding?: number;
}

export interface CollisionResult {
  hasCollision: boolean;
  collidingObstacles: string[];
  suggestedPath?: Point[];
}

export interface PathfindingConfig {
  gridSize: number;
  padding: number;
  maxIterations: number;
  diagonalMovement: boolean;
}

const DEFAULT_CONFIG: PathfindingConfig = {
  gridSize: 20,
  padding: 16,
  maxIterations: 1000,
  diagonalMovement: false
};

// =============================================================================
// Collision Detector
// =============================================================================

class CollisionDetector {
  private config: PathfindingConfig = DEFAULT_CONFIG;

  updateConfig(config: Partial<PathfindingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * التحقق من تداخل خط مع عائق
   */
  lineIntersectsRect(
    lineStart: Point,
    lineEnd: Point,
    rect: ElementBounds,
    padding: number = 0
  ): boolean {
    const paddedRect = {
      x: rect.x - padding,
      y: rect.y - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    };

    // التحقق من تقاطع الخط مع حواف المستطيل
    return this.lineIntersectsRectEdges(lineStart, lineEnd, paddedRect);
  }

  /**
   * التحقق من تقاطع خط مع حواف مستطيل
   */
  private lineIntersectsRectEdges(start: Point, end: Point, rect: ElementBounds): boolean {
    const { x, y, width, height } = rect;

    // حواف المستطيل
    const edges: [Point, Point][] = [
      [{ x, y }, { x: x + width, y }], // أعلى
      [{ x: x + width, y }, { x: x + width, y: y + height }], // يمين
      [{ x: x + width, y: y + height }, { x, y: y + height }], // أسفل
      [{ x, y: y + height }, { x, y }] // يسار
    ];

    for (const [edgeStart, edgeEnd] of edges) {
      if (this.linesIntersect(start, end, edgeStart, edgeEnd)) {
        return true;
      }
    }

    // التحقق إذا كان الخط داخل المستطيل بالكامل
    if (this.pointInRect(start, rect) || this.pointInRect(end, rect)) {
      return true;
    }

    return false;
  }

  /**
   * التحقق من تقاطع خطين
   */
  private linesIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
    const det = (a2.x - a1.x) * (b2.y - b1.y) - (b2.x - b1.x) * (a2.y - a1.y);
    if (det === 0) return false;

    const lambda = ((b2.y - b1.y) * (b2.x - a1.x) + (b1.x - b2.x) * (b2.y - a1.y)) / det;
    const gamma = ((a1.y - a2.y) * (b2.x - a1.x) + (a2.x - a1.x) * (b2.y - a1.y)) / det;

    return lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1;
  }

  /**
   * التحقق إذا كانت نقطة داخل مستطيل
   */
  private pointInRect(point: Point, rect: ElementBounds): boolean {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  /**
   * التحقق من تداخل مسار مع مجموعة عوائق
   */
  checkPathCollisions(
    pathPoints: Point[],
    obstacles: Obstacle[],
    excludeIds: string[] = []
  ): CollisionResult {
    const collidingObstacles: string[] = [];

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const start = pathPoints[i];
      const end = pathPoints[i + 1];

      for (const obstacle of obstacles) {
        if (excludeIds.includes(obstacle.id)) continue;

        const padding = obstacle.padding ?? this.config.padding;
        if (this.lineIntersectsRect(start, end, obstacle.bounds, padding)) {
          if (!collidingObstacles.includes(obstacle.id)) {
            collidingObstacles.push(obstacle.id);
          }
        }
      }
    }

    return {
      hasCollision: collidingObstacles.length > 0,
      collidingObstacles
    };
  }

  /**
   * إيجاد مسار خالٍ من التداخلات (A* مبسط)
   */
  findClearPath(
    start: Point,
    end: Point,
    obstacles: Obstacle[],
    excludeIds: string[] = []
  ): Point[] {
    const gridSize = this.config.gridSize;
    const padding = this.config.padding;

    // إنشاء شبكة للبحث
    const bounds = this.calculateSearchBounds(start, end, obstacles, padding);
    const grid = this.createGrid(bounds, gridSize);
    
    // تحديد الخلايا المحظورة
    const blocked = this.markBlockedCells(grid, bounds, obstacles, excludeIds, padding, gridSize);

    // تحويل النقاط إلى إحداثيات الشبكة
    const startCell = this.pointToCell(start, bounds, gridSize);
    const endCell = this.pointToCell(end, bounds, gridSize);

    // البحث باستخدام A*
    const path = this.aStarSearch(startCell, endCell, grid, blocked);

    // تحويل المسار إلى نقاط
    if (path.length > 0) {
      return path.map(cell => this.cellToPoint(cell, bounds, gridSize));
    }

    // إذا لم نجد مساراً، نعيد المسار المباشر
    return [start, end];
  }

  /**
   * حساب حدود منطقة البحث
   */
  private calculateSearchBounds(
    start: Point,
    end: Point,
    obstacles: Obstacle[],
    padding: number
  ): ElementBounds {
    let minX = Math.min(start.x, end.x);
    let maxX = Math.max(start.x, end.x);
    let minY = Math.min(start.y, end.y);
    let maxY = Math.max(start.y, end.y);

    // توسيع الحدود لتشمل العوائق
    for (const obstacle of obstacles) {
      minX = Math.min(minX, obstacle.bounds.x - padding);
      maxX = Math.max(maxX, obstacle.bounds.x + obstacle.bounds.width + padding);
      minY = Math.min(minY, obstacle.bounds.y - padding);
      maxY = Math.max(maxY, obstacle.bounds.y + obstacle.bounds.height + padding);
    }

    // إضافة هامش
    const margin = padding * 2;
    return {
      x: minX - margin,
      y: minY - margin,
      width: maxX - minX + margin * 2,
      height: maxY - minY + margin * 2
    };
  }

  /**
   * إنشاء شبكة البحث
   */
  private createGrid(
    bounds: ElementBounds,
    gridSize: number
  ): { cols: number; rows: number } {
    return {
      cols: Math.ceil(bounds.width / gridSize),
      rows: Math.ceil(bounds.height / gridSize)
    };
  }

  /**
   * تحديد الخلايا المحظورة
   */
  private markBlockedCells(
    grid: { cols: number; rows: number },
    bounds: ElementBounds,
    obstacles: Obstacle[],
    excludeIds: string[],
    padding: number,
    gridSize: number
  ): Set<string> {
    const blocked = new Set<string>();

    for (const obstacle of obstacles) {
      if (excludeIds.includes(obstacle.id)) continue;

      const paddedBounds = {
        x: obstacle.bounds.x - padding,
        y: obstacle.bounds.y - padding,
        width: obstacle.bounds.width + padding * 2,
        height: obstacle.bounds.height + padding * 2
      };

      // تحديد الخلايا التي يغطيها العائق
      const startCol = Math.floor((paddedBounds.x - bounds.x) / gridSize);
      const endCol = Math.ceil((paddedBounds.x + paddedBounds.width - bounds.x) / gridSize);
      const startRow = Math.floor((paddedBounds.y - bounds.y) / gridSize);
      const endRow = Math.ceil((paddedBounds.y + paddedBounds.height - bounds.y) / gridSize);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          if (row >= 0 && row < grid.rows && col >= 0 && col < grid.cols) {
            blocked.add(`${col},${row}`);
          }
        }
      }
    }

    return blocked;
  }

  /**
   * تحويل نقطة إلى خلية
   */
  private pointToCell(point: Point, bounds: ElementBounds, gridSize: number): { col: number; row: number } {
    return {
      col: Math.floor((point.x - bounds.x) / gridSize),
      row: Math.floor((point.y - bounds.y) / gridSize)
    };
  }

  /**
   * تحويل خلية إلى نقطة
   */
  private cellToPoint(cell: { col: number; row: number }, bounds: ElementBounds, gridSize: number): Point {
    return {
      x: bounds.x + cell.col * gridSize + gridSize / 2,
      y: bounds.y + cell.row * gridSize + gridSize / 2
    };
  }

  /**
   * خوارزمية A* للبحث عن المسار
   */
  private aStarSearch(
    start: { col: number; row: number },
    end: { col: number; row: number },
    grid: { cols: number; rows: number },
    blocked: Set<string>
  ): { col: number; row: number }[] {
    const openSet: { col: number; row: number; g: number; h: number; f: number; parent?: any }[] = [];
    const closedSet = new Set<string>();
    
    const heuristic = (a: { col: number; row: number }, b: { col: number; row: number }) =>
      Math.abs(a.col - b.col) + Math.abs(a.row - b.row);

    openSet.push({
      ...start,
      g: 0,
      h: heuristic(start, end),
      f: heuristic(start, end)
    });

    const neighbors = this.config.diagonalMovement
      ? [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
      : [[-1, 0], [1, 0], [0, -1], [0, 1]];

    let iterations = 0;

    while (openSet.length > 0 && iterations < this.config.maxIterations) {
      iterations++;

      // إيجاد العقدة بأقل f
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      const currentKey = `${current.col},${current.row}`;

      if (current.col === end.col && current.row === end.row) {
        // إعادة بناء المسار
        const path: { col: number; row: number }[] = [];
        let node: any = current;
        while (node) {
          path.unshift({ col: node.col, row: node.row });
          node = node.parent;
        }
        return path;
      }

      closedSet.add(currentKey);

      for (const [dc, dr] of neighbors) {
        const col = current.col + dc;
        const row = current.row + dr;
        const key = `${col},${row}`;

        if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) continue;
        if (closedSet.has(key) || blocked.has(key)) continue;

        const g = current.g + (dc !== 0 && dr !== 0 ? 1.414 : 1);
        const h = heuristic({ col, row }, end);
        const f = g + h;

        const existing = openSet.find(n => n.col === col && n.row === row);
        if (!existing) {
          openSet.push({ col, row, g, h, f, parent: current });
        } else if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      }
    }

    return [];
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const collisionDetector = new CollisionDetector();
