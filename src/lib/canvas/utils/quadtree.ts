import { Point, Bounds } from '../types';

export interface QuadTreeItem {
  id: string;
  bounds: Bounds;
  data?: any;
}

export class QuadTree {
  private bounds: Bounds;
  private maxItems: number;
  private maxDepth: number;
  private depth: number;
  private items: QuadTreeItem[];
  private nodes: QuadTree[];

  constructor(bounds: Bounds, maxItems = 10, maxDepth = 5, depth = 0) {
    this.bounds = bounds;
    this.maxItems = maxItems;
    this.maxDepth = maxDepth;
    this.depth = depth;
    this.items = [];
    this.nodes = [];
  }

  // Clear the quadtree
  clear(): void {
    this.items = [];
    this.nodes = [];
  }

  // Split the quadtree into 4 subnodes
  private split(): void {
    const subWidth = this.bounds.width / 2;
    const subHeight = this.bounds.height / 2;
    const x = this.bounds.x;
    const y = this.bounds.y;

    this.nodes[0] = new QuadTree(
      { x: x + subWidth, y, width: subWidth, height: subHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );
    this.nodes[1] = new QuadTree(
      { x, y, width: subWidth, height: subHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );
    this.nodes[2] = new QuadTree(
      { x, y: y + subHeight, width: subWidth, height: subHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );
    this.nodes[3] = new QuadTree(
      { x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight },
      this.maxItems,
      this.maxDepth,
      this.depth + 1
    );
  }

  // Determine which node the object belongs to
  private getIndex(bounds: Bounds): number {
    let index = -1;
    const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
    const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    // Object can completely fit within the top quadrants
    const topQuadrant = bounds.y < horizontalMidpoint && bounds.y + bounds.height < horizontalMidpoint;
    // Object can completely fit within the bottom quadrants
    const bottomQuadrant = bounds.y > horizontalMidpoint;

    // Object can completely fit within the left quadrants
    if (bounds.x < verticalMidpoint && bounds.x + bounds.width < verticalMidpoint) {
      if (topQuadrant) {
        index = 1;
      } else if (bottomQuadrant) {
        index = 2;
      }
    }
    // Object can completely fit within the right quadrants
    else if (bounds.x > verticalMidpoint) {
      if (topQuadrant) {
        index = 0;
      } else if (bottomQuadrant) {
        index = 3;
      }
    }

    return index;
  }

  // Insert an item into the quadtree
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

  // Retrieve all items that could collide with the given bounds
  retrieve(bounds: Bounds): QuadTreeItem[] {
    const returnObjects: QuadTreeItem[] = [];

    if (this.nodes.length > 0) {
      const index = this.getIndex(bounds);
      if (index !== -1) {
        returnObjects.push(...this.nodes[index].retrieve(bounds));
      } else {
        // Check all quadrants if the bounds spans multiple quadrants
        for (let i = 0; i < this.nodes.length; i++) {
          returnObjects.push(...this.nodes[i].retrieve(bounds));
        }
      }
    }

    returnObjects.push(...this.items);
    return returnObjects;
  }

  // Get all items in the quadtree
  getAllItems(): QuadTreeItem[] {
    let allItems: QuadTreeItem[] = [...this.items];

    if (this.nodes.length > 0) {
      for (let i = 0; i < this.nodes.length; i++) {
        allItems = allItems.concat(this.nodes[i].getAllItems());
      }
    }

    return allItems;
  }

  // Hit test - find items at a specific point
  hitTest(point: Point): QuadTreeItem[] {
    const pointBounds: Bounds = {
      x: point.x,
      y: point.y,
      width: 1,
      height: 1
    };

    return this.retrieve(pointBounds).filter(item => 
      this.pointInBounds(point, item.bounds)
    );
  }

  private pointInBounds(point: Point, bounds: Bounds): boolean {
    return point.x >= bounds.x && 
           point.x <= bounds.x + bounds.width &&
           point.y >= bounds.y && 
           point.y <= bounds.y + bounds.height;
  }

  // Update an item's position in the quadtree
  update(): void {
    // For performance, we rebuild the entire tree
    const allItems = this.getAllItems();
    this.clear();
    allItems.forEach(item => this.insert(item));
  }
}