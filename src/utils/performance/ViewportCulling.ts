import { QuadTree, QuadTreeItem, BoundingBox } from './QuadTree';
import { CanvasElement } from '../../components/CanvasBoard/types';

/**
 * Viewport Culling system using QuadTree
 * يعرض فقط العناصر الموجودة في مجال الرؤية الحالي
 */

export interface ViewportConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  margin?: number; // هامش إضافي لـ pre-loading
}

export class ViewportCulling {
  private quadTree: QuadTree;
  private canvasBounds: BoundingBox;
  private cache: Map<string, QuadTreeItem> = new Map();

  constructor(canvasBounds: BoundingBox) {
    this.canvasBounds = canvasBounds;
    this.quadTree = new QuadTree(canvasBounds, 10, 5);
  }

  /**
   * تحويل CanvasElement إلى QuadTreeItem
   */
  private elementToQuadTreeItem(element: CanvasElement): QuadTreeItem {
    return {
      id: element.id,
      bounds: {
        x: element.position.x,
        y: element.position.y,
        width: element.size.width,
        height: element.size.height
      },
      data: element
    };
  }

  /**
   * تحديث عناصر QuadTree
   */
  updateElements(elements: CanvasElement[]): void {
    const newItems = elements.map(element => this.elementToQuadTreeItem(element));
    this.quadTree.rebuild(newItems);
    
    // تحديث الcache
    this.cache.clear();
    newItems.forEach(item => this.cache.set(item.id, item));
  }

  /**
   * الحصول على العناصر المرئية في viewport
   */
  getVisibleElements(viewport: ViewportConfig): CanvasElement[] {
    const margin = viewport.margin || 100; // هامش إضافي لـ smooth scrolling
    
    // حساب منطقة الرؤية مع الهامش والزوم
    const viewportBounds: BoundingBox = {
      x: viewport.x - margin,
      y: viewport.y - margin,
      width: (viewport.width / (viewport.zoom / 100)) + (margin * 2),
      height: (viewport.height / (viewport.zoom / 100)) + (margin * 2)
    };

    const visibleItems = this.quadTree.retrieve(viewportBounds);
    return visibleItems.map(item => item.data as CanvasElement);
  }

  /**
   * تحديث عنصر واحد في QuadTree
   */
  updateElement(element: CanvasElement): void {
    const item = this.elementToQuadTreeItem(element);
    
    // إزالة العنصر القديم وإضافة الجديد
    this.cache.set(element.id, item);
    
    // إعادة بناء QuadTree مع العناصر المحدثة
    const allItems = Array.from(this.cache.values());
    this.quadTree.rebuild(allItems);
  }

  /**
   * إزالة عنصر من QuadTree
   */
  removeElement(elementId: string): void {
    this.cache.delete(elementId);
    
    // إعادة بناء QuadTree بدون العنصر المحذوف
    const allItems = Array.from(this.cache.values());
    this.quadTree.rebuild(allItems);
  }

  /**
   * حساب إحصائيات الأداء
   */
  getPerformanceStats(): {
    totalElements: number;
    quadTreeItems: number;
    memoryUsage: number;
  } {
    return {
      totalElements: this.cache.size,
      quadTreeItems: this.quadTree.getTotalItems(),
      memoryUsage: this.cache.size * 8 // تقدير تقريبي بالKB
    };
  }

  /**
   * فحص ما إذا كان العنصر مرئياً
   */
  isElementVisible(elementId: string, viewport: ViewportConfig): boolean {
    const item = this.cache.get(elementId);
    if (!item) return false;

    const viewportBounds: BoundingBox = {
      x: viewport.x,
      y: viewport.y,
      width: viewport.width / (viewport.zoom / 100),
      height: viewport.height / (viewport.zoom / 100)
    };

    return this.intersects(item.bounds, viewportBounds);
  }

  /**
   * فحص التقاطع بين مربعين
   */
  private intersects(a: BoundingBox, b: BoundingBox): boolean {
    return !(
      a.x > b.x + b.width ||
      a.x + a.width < b.x ||
      a.y > b.y + b.height ||
      a.y + a.height < b.y
    );
  }

  /**
   * إعادة تعيين حدود الcanvas
   */
  updateCanvasBounds(bounds: BoundingBox): void {
    this.canvasBounds = bounds;
    const allItems = Array.from(this.cache.values());
    this.quadTree = new QuadTree(bounds, 10, 5);
    this.quadTree.rebuild(allItems);
  }
}