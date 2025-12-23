/**
 * Snap Engine - محرك المحاذاة الذكية المركزي
 * 
 * يوفر نظام محاذاة موحد يدعم:
 * - Grid Snapping: المحاذاة للشبكة
 * - Element Snapping: المحاذاة للعناصر الأخرى
 * - Center Alignment: محاذاة المركز
 * - Edge Snapping: محاذاة الحواف
 * - Distribution Guides: خطوط التوزيع المتساوي
 * 
 * جميع الحسابات تتم في World Space
 */

import { canvasKernel, type Point, type Bounds } from '@/engine/canvas/kernel/canvasKernel';

// =============================================================================
// Types
// =============================================================================

export interface SnapConfig {
  /** تفعيل المحاذاة للشبكة */
  gridEnabled: boolean;
  /** حجم خلية الشبكة */
  gridSize: number;
  /** تفعيل المحاذاة للعناصر */
  elementSnapEnabled: boolean;
  /** مسافة الكشف للمحاذاة (بالبكسل في World Space) */
  snapThreshold: number;
  /** تفعيل محاذاة المركز */
  centerSnapEnabled: boolean;
  /** تفعيل محاذاة الحواف */
  edgeSnapEnabled: boolean;
  /** تفعيل خطوط التوزيع */
  distributionGuidesEnabled: boolean;
}

export interface SnapLine {
  /** نوع الخط */
  type: 'vertical' | 'horizontal';
  /** الموقع في World Space */
  position: number;
  /** نقطة البداية */
  start: Point;
  /** نقطة النهاية */
  end: Point;
  /** نوع المحاذاة */
  snapType: 'grid' | 'edge' | 'center' | 'distribution';
  /** معرف العنصر المرتبط (إن وُجد) */
  elementId?: string;
}

export interface SnapResult {
  /** النقطة بعد المحاذاة */
  snappedPoint: Point;
  /** هل تمت المحاذاة؟ */
  didSnap: boolean;
  /** هل تمت المحاذاة أفقياً؟ */
  snappedX: boolean;
  /** هل تمت المحاذاة عمودياً؟ */
  snappedY: boolean;
  /** خطوط الإرشاد للعرض */
  guides: SnapLine[];
  /** المسافة من أقرب نقطة محاذاة X */
  deltaX: number;
  /** المسافة من أقرب نقطة محاذاة Y */
  deltaY: number;
}

export interface ElementSnapTarget {
  id: string;
  bounds: Bounds;
  centerX: number;
  centerY: number;
}

export interface SnapCandidate {
  position: number;
  type: 'edge' | 'center' | 'distribution';
  elementId?: string;
  distance: number;
}

// =============================================================================
// Default Configuration
// =============================================================================

const DEFAULT_SNAP_CONFIG: SnapConfig = {
  gridEnabled: true,
  gridSize: 20,
  elementSnapEnabled: true,
  snapThreshold: 8,
  centerSnapEnabled: true,
  edgeSnapEnabled: true,
  distributionGuidesEnabled: true
};

// =============================================================================
// Snap Engine Class
// =============================================================================

class SnapEngineImpl {
  private _config: SnapConfig = { ...DEFAULT_SNAP_CONFIG };
  private _targets: ElementSnapTarget[] = [];

  /**
   * تحديث إعدادات المحاذاة
   */
  updateConfig(config: Partial<SnapConfig>): void {
    this._config = { ...this._config, ...config };
  }

  /**
   * الحصول على الإعدادات الحالية
   */
  get config(): SnapConfig {
    return { ...this._config };
  }

  /**
   * تحديث قائمة العناصر المستهدفة للمحاذاة
   */
  updateTargets(elements: Array<{ id: string; position: Point; size: { width: number; height: number } }>, excludeIds: string[] = []): void {
    this._targets = elements
      .filter(el => !excludeIds.includes(el.id))
      .map(el => ({
        id: el.id,
        bounds: {
          x: el.position.x,
          y: el.position.y,
          width: el.size.width,
          height: el.size.height
        },
        centerX: el.position.x + el.size.width / 2,
        centerY: el.position.y + el.size.height / 2
      }));
  }

  // ===========================================================================
  // Core Snap Functions
  // ===========================================================================

  /**
   * محاذاة نقطة واحدة
   */
  snapPoint(point: Point, excludeElementIds: string[] = []): SnapResult {
    const guides: SnapLine[] = [];
    let snappedX = point.x;
    let snappedY = point.y;
    let didSnapX = false;
    let didSnapY = false;
    let deltaX = 0;
    let deltaY = 0;

    // 1. Grid Snapping
    if (this._config.gridEnabled && this._config.gridSize > 0) {
      const gridResult = this.snapToGrid(point);
      if (Math.abs(gridResult.x - point.x) <= this._config.snapThreshold) {
        snappedX = gridResult.x;
        didSnapX = true;
        deltaX = gridResult.x - point.x;
      }
      if (Math.abs(gridResult.y - point.y) <= this._config.snapThreshold) {
        snappedY = gridResult.y;
        didSnapY = true;
        deltaY = gridResult.y - point.y;
      }
    }

    // 2. Element Snapping (يتجاوز Grid إذا كان أقرب)
    if (this._config.elementSnapEnabled) {
      const elementResult = this.snapToElements(point, excludeElementIds);
      
      if (elementResult.candidateX && Math.abs(elementResult.candidateX.distance) < Math.abs(deltaX) || !didSnapX) {
        if (elementResult.candidateX && Math.abs(elementResult.candidateX.distance) <= this._config.snapThreshold) {
          snappedX = elementResult.candidateX.position;
          didSnapX = true;
          deltaX = elementResult.candidateX.distance;
          guides.push(...elementResult.guidesX);
        }
      }
      
      if (elementResult.candidateY && Math.abs(elementResult.candidateY.distance) < Math.abs(deltaY) || !didSnapY) {
        if (elementResult.candidateY && Math.abs(elementResult.candidateY.distance) <= this._config.snapThreshold) {
          snappedY = elementResult.candidateY.position;
          didSnapY = true;
          deltaY = elementResult.candidateY.distance;
          guides.push(...elementResult.guidesY);
        }
      }
    }

    return {
      snappedPoint: { x: snappedX, y: snappedY },
      didSnap: didSnapX || didSnapY,
      snappedX: didSnapX,
      snappedY: didSnapY,
      guides,
      deltaX,
      deltaY
    };
  }

  /**
   * محاذاة حدود عنصر (bounds)
   */
  snapBounds(bounds: Bounds, excludeElementIds: string[] = []): SnapResult & { snappedBounds: Bounds } {
    const guides: SnapLine[] = [];
    let deltaX = 0;
    let deltaY = 0;
    let didSnapX = false;
    let didSnapY = false;

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const right = bounds.x + bounds.width;
    const bottom = bounds.y + bounds.height;

    // جمع جميع المرشحين للمحاذاة الأفقية
    const xCandidates: SnapCandidate[] = [];
    // جمع جميع المرشحين للمحاذاة العمودية
    const yCandidates: SnapCandidate[] = [];

    // 1. Grid Snapping للزوايا
    if (this._config.gridEnabled && this._config.gridSize > 0) {
      const gridSnappedLeft = Math.round(bounds.x / this._config.gridSize) * this._config.gridSize;
      const gridSnappedTop = Math.round(bounds.y / this._config.gridSize) * this._config.gridSize;
      
      xCandidates.push({
        position: gridSnappedLeft,
        type: 'edge',
        distance: gridSnappedLeft - bounds.x
      });
      
      yCandidates.push({
        position: gridSnappedTop,
        type: 'edge',
        distance: gridSnappedTop - bounds.y
      });
    }

    // 2. Element Snapping
    if (this._config.elementSnapEnabled) {
      const targets = this._targets.filter(t => !excludeElementIds.includes(t.id));
      
      for (const target of targets) {
        const targetRight = target.bounds.x + target.bounds.width;
        const targetBottom = target.bounds.y + target.bounds.height;

        // Edge Snapping
        if (this._config.edgeSnapEnabled) {
          // Left edge to left/right edges
          xCandidates.push(
            { position: target.bounds.x, type: 'edge', elementId: target.id, distance: target.bounds.x - bounds.x },
            { position: targetRight, type: 'edge', elementId: target.id, distance: targetRight - bounds.x }
          );
          // Right edge to left/right edges
          xCandidates.push(
            { position: target.bounds.x - bounds.width, type: 'edge', elementId: target.id, distance: target.bounds.x - right },
            { position: targetRight - bounds.width, type: 'edge', elementId: target.id, distance: targetRight - right }
          );
          
          // Top edge to top/bottom edges
          yCandidates.push(
            { position: target.bounds.y, type: 'edge', elementId: target.id, distance: target.bounds.y - bounds.y },
            { position: targetBottom, type: 'edge', elementId: target.id, distance: targetBottom - bounds.y }
          );
          // Bottom edge to top/bottom edges
          yCandidates.push(
            { position: target.bounds.y - bounds.height, type: 'edge', elementId: target.id, distance: target.bounds.y - bottom },
            { position: targetBottom - bounds.height, type: 'edge', elementId: target.id, distance: targetBottom - bottom }
          );
        }

        // Center Snapping
        if (this._config.centerSnapEnabled) {
          xCandidates.push({
            position: target.centerX - bounds.width / 2,
            type: 'center',
            elementId: target.id,
            distance: target.centerX - centerX
          });
          
          yCandidates.push({
            position: target.centerY - bounds.height / 2,
            type: 'center',
            elementId: target.id,
            distance: target.centerY - centerY
          });
        }
      }
    }

    // إيجاد أفضل مرشح
    const bestX = this.findBestCandidate(xCandidates, this._config.snapThreshold);
    const bestY = this.findBestCandidate(yCandidates, this._config.snapThreshold);

    let snappedX = bounds.x;
    let snappedY = bounds.y;

    if (bestX) {
      snappedX = bestX.position;
      deltaX = bestX.distance;
      didSnapX = true;
      guides.push(...this.createGuidesForCandidate(bestX, 'vertical', bounds, snappedX, snappedY));
    }

    if (bestY) {
      snappedY = bestY.position;
      deltaY = bestY.distance;
      didSnapY = true;
      guides.push(...this.createGuidesForCandidate(bestY, 'horizontal', bounds, snappedX, snappedY));
    }

    return {
      snappedPoint: { x: snappedX, y: snappedY },
      snappedBounds: {
        x: snappedX,
        y: snappedY,
        width: bounds.width,
        height: bounds.height
      },
      didSnap: didSnapX || didSnapY,
      snappedX: didSnapX,
      snappedY: didSnapY,
      guides,
      deltaX,
      deltaY
    };
  }

  // ===========================================================================
  // Internal Helpers
  // ===========================================================================

  /**
   * محاذاة للشبكة
   */
  private snapToGrid(point: Point): Point {
    return canvasKernel.snapToGrid(point, this._config.gridSize, true);
  }

  /**
   * محاذاة للعناصر
   */
  private snapToElements(point: Point, excludeIds: string[]): {
    candidateX: SnapCandidate | null;
    candidateY: SnapCandidate | null;
    guidesX: SnapLine[];
    guidesY: SnapLine[];
  } {
    const xCandidates: SnapCandidate[] = [];
    const yCandidates: SnapCandidate[] = [];
    const guidesX: SnapLine[] = [];
    const guidesY: SnapLine[] = [];

    const targets = this._targets.filter(t => !excludeIds.includes(t.id));

    for (const target of targets) {
      const targetRight = target.bounds.x + target.bounds.width;
      const targetBottom = target.bounds.y + target.bounds.height;

      // Edge snapping
      if (this._config.edgeSnapEnabled) {
        xCandidates.push(
          { position: target.bounds.x, type: 'edge', elementId: target.id, distance: target.bounds.x - point.x },
          { position: targetRight, type: 'edge', elementId: target.id, distance: targetRight - point.x }
        );
        
        yCandidates.push(
          { position: target.bounds.y, type: 'edge', elementId: target.id, distance: target.bounds.y - point.y },
          { position: targetBottom, type: 'edge', elementId: target.id, distance: targetBottom - point.y }
        );
      }

      // Center snapping
      if (this._config.centerSnapEnabled) {
        xCandidates.push({
          position: target.centerX,
          type: 'center',
          elementId: target.id,
          distance: target.centerX - point.x
        });
        
        yCandidates.push({
          position: target.centerY,
          type: 'center',
          elementId: target.id,
          distance: target.centerY - point.y
        });
      }
    }

    const candidateX = this.findBestCandidate(xCandidates, this._config.snapThreshold);
    const candidateY = this.findBestCandidate(yCandidates, this._config.snapThreshold);

    // إنشاء خطوط الإرشاد
    if (candidateX) {
      const target = this._targets.find(t => t.id === candidateX.elementId);
      if (target) {
        guidesX.push({
          type: 'vertical',
          position: candidateX.position,
          start: { x: candidateX.position, y: Math.min(point.y, target.bounds.y) - 50 },
          end: { x: candidateX.position, y: Math.max(point.y, target.bounds.y + target.bounds.height) + 50 },
          snapType: candidateX.type,
          elementId: candidateX.elementId
        });
      }
    }

    if (candidateY) {
      const target = this._targets.find(t => t.id === candidateY.elementId);
      if (target) {
        guidesY.push({
          type: 'horizontal',
          position: candidateY.position,
          start: { x: Math.min(point.x, target.bounds.x) - 50, y: candidateY.position },
          end: { x: Math.max(point.x, target.bounds.x + target.bounds.width) + 50, y: candidateY.position },
          snapType: candidateY.type,
          elementId: candidateY.elementId
        });
      }
    }

    return { candidateX, candidateY, guidesX, guidesY };
  }

  /**
   * إيجاد أفضل مرشح للمحاذاة
   */
  private findBestCandidate(candidates: SnapCandidate[], threshold: number): SnapCandidate | null {
    let best: SnapCandidate | null = null;
    let minDistance = threshold;

    for (const candidate of candidates) {
      const absDistance = Math.abs(candidate.distance);
      if (absDistance < minDistance) {
        minDistance = absDistance;
        best = candidate;
      }
    }

    return best;
  }

  /**
   * إنشاء خطوط إرشاد لمرشح
   */
  private createGuidesForCandidate(
    candidate: SnapCandidate,
    type: 'vertical' | 'horizontal',
    bounds: Bounds,
    snappedX: number,
    snappedY: number
  ): SnapLine[] {
    const guides: SnapLine[] = [];
    const target = this._targets.find(t => t.id === candidate.elementId);

    // دعم Grid Guides (بدون elementId)
    if (!target) {
      if (type === 'vertical') {
        guides.push({
          type: 'vertical',
          position: snappedX,
          start: { x: snappedX, y: snappedY - 30 },
          end: { x: snappedX, y: snappedY + bounds.height + 30 },
          snapType: 'grid'
        });
      } else {
        guides.push({
          type: 'horizontal',
          position: snappedY,
          start: { x: snappedX - 30, y: snappedY },
          end: { x: snappedX + bounds.width + 30, y: snappedY },
          snapType: 'grid'
        });
      }
      return guides;
    }

    if (type === 'vertical') {
      const x = candidate.type === 'center' 
        ? target.centerX 
        : (candidate.distance > 0 ? target.bounds.x + target.bounds.width : target.bounds.x);
      
      guides.push({
        type: 'vertical',
        position: x,
        start: { x, y: Math.min(snappedY, target.bounds.y) - 20 },
        end: { x, y: Math.max(snappedY + bounds.height, target.bounds.y + target.bounds.height) + 20 },
        snapType: candidate.type,
        elementId: candidate.elementId
      });
    } else {
      const y = candidate.type === 'center'
        ? target.centerY
        : (candidate.distance > 0 ? target.bounds.y + target.bounds.height : target.bounds.y);
      
      guides.push({
        type: 'horizontal',
        position: y,
        start: { x: Math.min(snappedX, target.bounds.x) - 20, y },
        end: { x: Math.max(snappedX + bounds.width, target.bounds.x + target.bounds.width) + 20, y },
        snapType: candidate.type,
        elementId: candidate.elementId
      });
    }

    return guides;
  }

  /**
   * مسح الأهداف
   */
  clearTargets(): void {
    this._targets = [];
  }

  /**
   * إعادة تعيين الإعدادات
   */
  resetConfig(): void {
    this._config = { ...DEFAULT_SNAP_CONFIG };
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const snapEngine = new SnapEngineImpl();
