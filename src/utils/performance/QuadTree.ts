/**
 * QuadTree implementation for spatial partitioning of canvas elements
 * يحسن الأداء من خلال تقسيم العناصر مكانياً وعرض ما هو ظاهر فقط
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QuadTreeItem {
  id: string;
  bounds: BoundingBox;
  data: any;
}

export class QuadTree {
  private maxItems = 10;
  private maxDepth = 5;
  private bounds: BoundingBox;
  private depth: number;
  private items: QuadTreeItem[] = [];
  private nodes: QuadTree[] = [];

  constructor(bounds: BoundingBox, maxItems = 10, maxDepth = 5, depth = 0) {
    this.bounds = bounds;
    this.maxItems = maxItems;
    this.maxDepth = maxDepth;
    this.depth = depth;
  }

  /**
   * تقسيم العقدة إلى 4 أرباع
   */
  private split(): void {
    const halfWidth = this.bounds.width / 2;
    const halfHeight = this.bounds.height / 2;
    const x = this.bounds.x;
    const y = this.bounds.y;

    // الربع الشمالي الشرقي
    this.nodes[0] = new QuadTree(
      { x: x + halfWidth, y: y, width: halfWidth, height: halfHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );

    // الربع الشمالي الغربي
    this.nodes[1] = new QuadTree(
      { x: x, y: y, width: halfWidth, height: halfHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );

    // الربع الجنوبي الغربي
    this.nodes[2] = new QuadTree(
      { x: x, y: y + halfHeight, width: halfWidth, height: halfHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );

    // الربع الجنوبي الشرقي
    this.nodes[3] = new QuadTree(
      { x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );
  }

  /**
   * تحديد الربع الذي ينتمي إليه العنصر
   */
  private getIndex(bounds: BoundingBox): number {
    let index = -1;
    const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
    const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    const topQuadrant = bounds.y < horizontalMidpoint && bounds.y + bounds.height < horizontalMidpoint;
    const bottomQuadrant = bounds.y > horizontalMidpoint;

    if (bounds.x < verticalMidpoint && bounds.x + bounds.width < verticalMidpoint) {
      if (topQuadrant) {
        index = 1; // شمالي غربي
      } else if (bottomQuadrant) {
        index = 2; // جنوبي غربي
      }
    } else if (bounds.x > verticalMidpoint) {
      if (topQuadrant) {
        index = 0; // شمالي شرقي
      } else if (bottomQuadrant) {
        index = 3; // جنوبي شرقي
      }
    }

    return index;
  }

  /**
   * إدراج عنصر جديد في QuadTree
   */
  insert(item: QuadTreeItem): void {
    if (this.nodes.length > 0) {
      const index = this.getIndex(item.bounds);
      if (index !== -1) {
        this.nodes[index].insert(item);
        return;
      }
    }

    this.items.push(item);

    if (this.items.length > this.maxItems && this.depth < this.maxDepth) {
      if (this.nodes.length === 0) {
        this.split();
      }

      let i = 0;
      while (i < this.items.length) {
        const index = this.getIndex(this.items[i].bounds);
        if (index !== -1) {
          this.nodes[index].insert(this.items.splice(i, 1)[0]);
        } else {
          i++;
        }
      }
    }
  }

  /**
   * استرجاع العناصر الموجودة في منطقة معينة (viewport culling)
   */
  retrieve(bounds: BoundingBox): QuadTreeItem[] {
    const returnObjects: QuadTreeItem[] = [];

    if (this.nodes.length > 0) {
      const index = this.getIndex(bounds);
      if (index !== -1) {
        returnObjects.push(...this.nodes[index].retrieve(bounds));
      } else {
        // إذا كان العنصر يتقاطع مع عدة أرباع
        for (const node of this.nodes) {
          if (this.intersects(bounds, node.bounds)) {
            returnObjects.push(...node.retrieve(bounds));
          }
        }
      }
    }

    // إضافة العناصر في العقدة الحالية
    for (const item of this.items) {
      if (this.intersects(bounds, item.bounds)) {
        returnObjects.push(item);
      }
    }

    return returnObjects;
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
   * مسح جميع العناصر
   */
  clear(): void {
    this.items = [];
    this.nodes = [];
  }

  /**
   * إعادة بناء QuadTree مع عناصر جديدة
   */
  rebuild(items: QuadTreeItem[]): void {
    this.clear();
    for (const item of items) {
      this.insert(item);
    }
  }

  /**
   * حساب عدد العناصر الإجمالي
   */
  getTotalItems(): number {
    let total = this.items.length;
    for (const node of this.nodes) {
      total += node.getTotalItems();
    }
    return total;
  }
}