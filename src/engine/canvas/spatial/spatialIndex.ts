/**
 * Spatial Index - فهرس مكاني للبحث السريع O(log n)
 * ✅ المرحلة 3: تحسينات الأداء
 * 
 * يستخدم Grid-based spatial hashing للبحث السريع عن العناصر
 * بدلاً من O(n) linear search
 */

import type { CanvasElement } from '@/types/canvas';
import type { Bounds } from '../kernel/canvasKernel';

// ============================================
// 🔧 Configuration
// ============================================

const DEFAULT_CELL_SIZE = 200; // حجم الخلية بالبكسل
const MAX_ELEMENTS_BEFORE_REBUILD = 1000;

// ============================================
// 🗺️ Types
// ============================================

interface GridCell {
  elementIds: Set<string>;
}

interface SpatialIndexOptions {
  cellSize?: number;
}

// ============================================
// 📦 Spatial Index Class
// ============================================

class SpatialIndexImpl {
  private grid: Map<string, GridCell> = new Map();
  private elementCells: Map<string, Set<string>> = new Map(); // element -> cells mapping
  private cellSize: number;
  private elementCount: number = 0;
  private lastElementsHash: string = '';

  constructor(options: SpatialIndexOptions = {}) {
    this.cellSize = options.cellSize || DEFAULT_CELL_SIZE;
  }

  /**
   * حساب مفتاح الخلية من الإحداثيات
   */
  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  /**
   * الحصول على جميع مفاتيح الخلايا التي يشغلها العنصر
   */
  private getElementCellKeys(element: CanvasElement): string[] {
    const keys: string[] = [];
    const { x, y } = element.position;
    const { width, height } = element.size;

    const minCellX = Math.floor(x / this.cellSize);
    const maxCellX = Math.floor((x + width) / this.cellSize);
    const minCellY = Math.floor(y / this.cellSize);
    const maxCellY = Math.floor((y + height) / this.cellSize);

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        keys.push(`${cx},${cy}`);
      }
    }

    return keys;
  }

  /**
   * إضافة عنصر للفهرس
   */
  addElement(element: CanvasElement): void {
    const cellKeys = this.getElementCellKeys(element);
    const elementCellSet = new Set<string>();

    for (const key of cellKeys) {
      let cell = this.grid.get(key);
      if (!cell) {
        cell = { elementIds: new Set() };
        this.grid.set(key, cell);
      }
      cell.elementIds.add(element.id);
      elementCellSet.add(key);
    }

    this.elementCells.set(element.id, elementCellSet);
    this.elementCount++;
  }

  /**
   * إزالة عنصر من الفهرس
   */
  removeElement(elementId: string): void {
    const cellKeys = this.elementCells.get(elementId);
    if (!cellKeys) return;

    for (const key of cellKeys) {
      const cell = this.grid.get(key);
      if (cell) {
        cell.elementIds.delete(elementId);
        if (cell.elementIds.size === 0) {
          this.grid.delete(key);
        }
      }
    }

    this.elementCells.delete(elementId);
    this.elementCount--;
  }

  /**
   * تحديث موقع عنصر في الفهرس
   */
  updateElement(element: CanvasElement): void {
    this.removeElement(element.id);
    this.addElement(element);
  }

  /**
   * إعادة بناء الفهرس بالكامل
   */
  rebuild(elements: CanvasElement[]): void {
    this.clear();
    for (const element of elements) {
      this.addElement(element);
    }
    this.lastElementsHash = this.computeElementsHash(elements);
  }

  /**
   * مسح الفهرس
   */
  clear(): void {
    this.grid.clear();
    this.elementCells.clear();
    this.elementCount = 0;
  }

  /**
   * حساب hash للعناصر للكشف عن التغييرات
   */
  private computeElementsHash(elements: CanvasElement[]): string {
    return elements.map(el => 
      `${el.id}:${el.position.x}:${el.position.y}:${el.size.width}:${el.size.height}`
    ).join('|');
  }

  /**
   * التحقق من الحاجة لإعادة البناء
   */
  needsRebuild(elements: CanvasElement[]): boolean {
    if (elements.length !== this.elementCount) return true;
    const currentHash = this.computeElementsHash(elements);
    return currentHash !== this.lastElementsHash;
  }

  /**
   * ✅ البحث عن العناصر في منطقة محددة - O(k) حيث k = عدد الخلايا المتقاطعة
   */
  queryBounds(bounds: Bounds): Set<string> {
    const result = new Set<string>();
    
    const minCellX = Math.floor(bounds.x / this.cellSize);
    const maxCellX = Math.floor((bounds.x + bounds.width) / this.cellSize);
    const minCellY = Math.floor(bounds.y / this.cellSize);
    const maxCellY = Math.floor((bounds.y + bounds.height) / this.cellSize);

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        const key = `${cx},${cy}`;
        const cell = this.grid.get(key);
        if (cell) {
          for (const elementId of cell.elementIds) {
            result.add(elementId);
          }
        }
      }
    }

    return result;
  }

  /**
   * البحث عن العناصر في نقطة محددة
   */
  queryPoint(x: number, y: number): Set<string> {
    const key = this.getCellKey(x, y);
    const cell = this.grid.get(key);
    return cell ? new Set(cell.elementIds) : new Set();
  }

  /**
   * البحث عن العناصر في دائرة
   */
  queryRadius(centerX: number, centerY: number, radius: number): Set<string> {
    return this.queryBounds({
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2
    });
  }

  /**
   * الحصول على إحصائيات الفهرس
   */
  getStats(): { cellCount: number; elementCount: number; avgElementsPerCell: number } {
    let totalElements = 0;
    for (const cell of this.grid.values()) {
      totalElements += cell.elementIds.size;
    }

    return {
      cellCount: this.grid.size,
      elementCount: this.elementCount,
      avgElementsPerCell: this.grid.size > 0 ? totalElements / this.grid.size : 0
    };
  }
}

// ============================================
// 🏭 Singleton Instance
// ============================================

export const spatialIndex = new SpatialIndexImpl();

// ============================================
// 🪝 React Hook للاستخدام مع Canvas Store
// ============================================

import { useCallback, useRef, useEffect } from 'react';

export function useSpatialIndex() {
  const indexRef = useRef(spatialIndex);
  const lastUpdateRef = useRef<number>(0);

  /**
   * تحديث الفهرس إذا لزم الأمر
   */
  const updateIndex = useCallback((elements: CanvasElement[]) => {
    const now = Date.now();
    
    // Throttle updates to max once per 100ms
    if (now - lastUpdateRef.current < 100) return;
    
    if (indexRef.current.needsRebuild(elements)) {
      indexRef.current.rebuild(elements);
      lastUpdateRef.current = now;
    }
  }, []);

  /**
   * البحث عن العناصر في منطقة
   */
  const queryBounds = useCallback((bounds: Bounds): Set<string> => {
    return indexRef.current.queryBounds(bounds);
  }, []);

  /**
   * البحث عن العناصر في نقطة
   */
  const queryPoint = useCallback((x: number, y: number): Set<string> => {
    return indexRef.current.queryPoint(x, y);
  }, []);

  /**
   * الحصول على إحصائيات
   */
  const getStats = useCallback(() => {
    return indexRef.current.getStats();
  }, []);

  return {
    updateIndex,
    queryBounds,
    queryPoint,
    getStats
  };
}

// ============================================
// 🛠️ Utility Functions
// ============================================

/**
 * التحقق من تقاطع عنصر مع bounds باستخدام الفهرس المكاني
 */
export function queryIntersectingElements(
  bounds: Bounds,
  elements: CanvasElement[],
  visibilityMap?: Map<string, boolean>
): CanvasElement[] {
  // تحديث الفهرس إذا لزم الأمر
  if (spatialIndex.needsRebuild(elements)) {
    spatialIndex.rebuild(elements);
  }

  // الحصول على المرشحين من الفهرس المكاني
  const candidateIds = spatialIndex.queryBounds(bounds);
  
  // إنشاء map للبحث السريع
  const elementMap = new Map(elements.map(el => [el.id, el]));

  // تصفية المرشحين
  const result: CanvasElement[] = [];
  
  for (const id of candidateIds) {
    const element = elementMap.get(id);
    if (!element) continue;

    // التحقق من الرؤية
    if (visibilityMap) {
      const layerVisible = visibilityMap.get(element.layerId) ?? true;
      if (!layerVisible || !element.visible) continue;
    } else if (!element.visible) {
      continue;
    }

    // التحقق الدقيق من التقاطع
    const elementBounds: Bounds = {
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height
    };

    if (boundsIntersect(bounds, elementBounds)) {
      result.push(element);
    }
  }

  return result;
}

/**
 * التحقق من تقاطع bounds
 */
function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

/**
 * البحث عن العنصر في نقطة محددة (للـ hit testing)
 */
export function findElementAtPoint(
  x: number,
  y: number,
  elements: CanvasElement[],
  visibilityMap?: Map<string, boolean>
): CanvasElement | null {
  // تحديث الفهرس إذا لزم الأمر
  if (spatialIndex.needsRebuild(elements)) {
    spatialIndex.rebuild(elements);
  }

  // الحصول على المرشحين
  const candidateIds = spatialIndex.queryPoint(x, y);
  
  // إنشاء map للبحث السريع
  const elementMap = new Map(elements.map(el => [el.id, el]));

  // البحث عن العنصر الأعلى في الـ z-index
  let topElement: CanvasElement | null = null;
  let topZIndex = -Infinity;

  for (const id of candidateIds) {
    const element = elementMap.get(id);
    if (!element) continue;

    // التحقق من الرؤية
    if (visibilityMap) {
      const layerVisible = visibilityMap.get(element.layerId) ?? true;
      if (!layerVisible || !element.visible) continue;
    } else if (!element.visible) {
      continue;
    }

    // التحقق الدقيق من أن النقطة داخل العنصر
    const { x: ex, y: ey } = element.position;
    const { width, height } = element.size;

    if (x >= ex && x <= ex + width && y >= ey && y <= ey + height) {
      const zIndex = element.zIndex ?? 0;
      if (zIndex > topZIndex) {
        topZIndex = zIndex;
        topElement = element;
      }
    }
  }

  return topElement;
}
