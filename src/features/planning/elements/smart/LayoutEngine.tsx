import { useCallback, useRef } from 'react';

// ============= Types =============
export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fixed?: boolean;
  vx?: number;
  vy?: number;
  type?: string;
}

export interface LayoutEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface ForceConfig {
  repulsionStrength: number;
  attractionStrength: number;
  linkDistance: number;
  centerStrength: number;
  damping: number;
  minDistance: number;
  iterations: number;
}

export interface SnapConfig {
  enabled: boolean;
  gridSize: number;
  tolerance: number;
  showGuides: boolean;
}

export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  sourceId: string;
  targetId: string;
}

// ============= Default Configurations =============
export const DEFAULT_FORCE_CONFIG: ForceConfig = {
  repulsionStrength: 5000,
  attractionStrength: 0.1,
  linkDistance: 200,
  centerStrength: 0.05,
  damping: 0.9,
  minDistance: 50,
  iterations: 100,
};

export const DEFAULT_SNAP_CONFIG: SnapConfig = {
  enabled: true,
  gridSize: 20,
  tolerance: 10,
  showGuides: true,
};

// ============= Force-Directed Layout Engine =============
export class ForceDirectedLayout {
  private nodes: Map<string, LayoutNode> = new Map();
  private edges: LayoutEdge[] = [];
  private config: ForceConfig;
  private animationFrame: number | null = null;
  private onUpdate?: (nodes: LayoutNode[]) => void;

  constructor(config: Partial<ForceConfig> = {}) {
    this.config = { ...DEFAULT_FORCE_CONFIG, ...config };
  }

  setNodes(nodes: LayoutNode[]) {
    this.nodes.clear();
    nodes.forEach(node => {
      this.nodes.set(node.id, { ...node, vx: 0, vy: 0 });
    });
  }

  setEdges(edges: LayoutEdge[]) {
    this.edges = edges;
  }

  setConfig(config: Partial<ForceConfig>) {
    this.config = { ...this.config, ...config };
  }

  setOnUpdate(callback: (nodes: LayoutNode[]) => void) {
    this.onUpdate = callback;
  }

  // Calculate repulsion force between nodes
  private calculateRepulsion(node1: LayoutNode, node2: LayoutNode): { fx: number; fy: number } {
    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    
    // Include node sizes in distance calculation
    const minDist = (node1.width + node2.width) / 2 + this.config.minDistance;
    const effectiveDistance = Math.max(distance, minDist);
    
    const force = this.config.repulsionStrength / (effectiveDistance * effectiveDistance);
    
    return {
      fx: (dx / distance) * force,
      fy: (dy / distance) * force,
    };
  }

  // Calculate attraction force between linked nodes
  private calculateAttraction(node1: LayoutNode, node2: LayoutNode, weight: number = 1): { fx: number; fy: number } {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    
    const displacement = distance - this.config.linkDistance;
    const force = displacement * this.config.attractionStrength * weight;
    
    return {
      fx: (dx / distance) * force,
      fy: (dy / distance) * force,
    };
  }

  // Calculate center gravity force
  private calculateCenterForce(node: LayoutNode, centerX: number, centerY: number): { fx: number; fy: number } {
    const dx = centerX - node.x;
    const dy = centerY - node.y;
    
    return {
      fx: dx * this.config.centerStrength,
      fy: dy * this.config.centerStrength,
    };
  }

  // Single simulation step
  private step(): boolean {
    const nodesArray = Array.from(this.nodes.values());
    const forces: Map<string, { fx: number; fy: number }> = new Map();
    
    // Initialize forces
    nodesArray.forEach(node => {
      forces.set(node.id, { fx: 0, fy: 0 });
    });
    
    // Calculate center
    let centerX = 0, centerY = 0;
    nodesArray.forEach(node => {
      centerX += node.x;
      centerY += node.y;
    });
    centerX /= nodesArray.length || 1;
    centerY /= nodesArray.length || 1;
    
    // Calculate repulsion forces
    for (let i = 0; i < nodesArray.length; i++) {
      for (let j = i + 1; j < nodesArray.length; j++) {
        const node1 = nodesArray[i];
        const node2 = nodesArray[j];
        const repulsion = this.calculateRepulsion(node1, node2);
        
        const f1 = forces.get(node1.id)!;
        const f2 = forces.get(node2.id)!;
        
        f1.fx += repulsion.fx;
        f1.fy += repulsion.fy;
        f2.fx -= repulsion.fx;
        f2.fy -= repulsion.fy;
      }
    }
    
    // Calculate attraction forces from edges
    this.edges.forEach(edge => {
      const source = this.nodes.get(edge.source);
      const target = this.nodes.get(edge.target);
      
      if (source && target) {
        const attraction = this.calculateAttraction(source, target, edge.weight);
        
        const fSource = forces.get(source.id)!;
        const fTarget = forces.get(target.id)!;
        
        fSource.fx += attraction.fx;
        fSource.fy += attraction.fy;
        fTarget.fx -= attraction.fx;
        fTarget.fy -= attraction.fy;
      }
    });
    
    // Calculate center force
    nodesArray.forEach(node => {
      const centerForce = this.calculateCenterForce(node, centerX, centerY);
      const f = forces.get(node.id)!;
      f.fx += centerForce.fx;
      f.fy += centerForce.fy;
    });
    
    // Apply forces and check for convergence
    let totalMovement = 0;
    
    nodesArray.forEach(node => {
      if (node.fixed) return;
      
      const f = forces.get(node.id)!;
      
      // Update velocity with damping
      node.vx = (node.vx || 0) * this.config.damping + f.fx;
      node.vy = (node.vy || 0) * this.config.damping + f.fy;
      
      // Update position
      node.x += node.vx!;
      node.y += node.vy!;
      
      totalMovement += Math.abs(node.vx!) + Math.abs(node.vy!);
      
      this.nodes.set(node.id, node);
    });
    
    // Check for convergence
    return totalMovement > 0.5;
  }

  // Run simulation
  run(animated: boolean = false): Promise<LayoutNode[]> {
    return new Promise((resolve) => {
      if (animated) {
        let iteration = 0;
        const animate = () => {
          const shouldContinue = this.step() && iteration < this.config.iterations;
          this.onUpdate?.(Array.from(this.nodes.values()));
          
          if (shouldContinue) {
            iteration++;
            this.animationFrame = requestAnimationFrame(animate);
          } else {
            this.animationFrame = null;
            resolve(Array.from(this.nodes.values()));
          }
        };
        animate();
      } else {
        for (let i = 0; i < this.config.iterations; i++) {
          if (!this.step()) break;
        }
        resolve(Array.from(this.nodes.values()));
      }
    });
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  getNodes(): LayoutNode[] {
    return Array.from(this.nodes.values());
  }
}

// ============= Snap & Alignment Engine =============
export class SnapAlignmentEngine {
  private config: SnapConfig;

  constructor(config: Partial<SnapConfig> = {}) {
    this.config = { ...DEFAULT_SNAP_CONFIG, ...config };
  }

  setConfig(config: Partial<SnapConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Snap to grid
  snapToGrid(x: number, y: number): { x: number; y: number } {
    if (!this.config.enabled) return { x, y };
    
    return {
      x: Math.round(x / this.config.gridSize) * this.config.gridSize,
      y: Math.round(y / this.config.gridSize) * this.config.gridSize,
    };
  }

  // Find alignment guides
  findAlignmentGuides(
    draggingNode: LayoutNode,
    otherNodes: LayoutNode[]
  ): { guides: AlignmentGuide[]; snappedPosition: { x: number; y: number } } {
    const guides: AlignmentGuide[] = [];
    let snappedX = draggingNode.x;
    let snappedY = draggingNode.y;
    
    const dragCenterX = draggingNode.x + draggingNode.width / 2;
    const dragCenterY = draggingNode.y + draggingNode.height / 2;
    const dragLeft = draggingNode.x;
    const dragRight = draggingNode.x + draggingNode.width;
    const dragTop = draggingNode.y;
    const dragBottom = draggingNode.y + draggingNode.height;
    
    otherNodes.forEach(node => {
      if (node.id === draggingNode.id) return;
      
      const nodeCenterX = node.x + node.width / 2;
      const nodeCenterY = node.y + node.height / 2;
      const nodeLeft = node.x;
      const nodeRight = node.x + node.width;
      const nodeTop = node.y;
      const nodeBottom = node.y + node.height;
      
      // Check horizontal alignments
      // Center to center
      if (Math.abs(dragCenterX - nodeCenterX) < this.config.tolerance) {
        guides.push({
          type: 'vertical',
          position: nodeCenterX,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedX = nodeCenterX - draggingNode.width / 2;
      }
      
      // Left to left
      if (Math.abs(dragLeft - nodeLeft) < this.config.tolerance) {
        guides.push({
          type: 'vertical',
          position: nodeLeft,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedX = nodeLeft;
      }
      
      // Right to right
      if (Math.abs(dragRight - nodeRight) < this.config.tolerance) {
        guides.push({
          type: 'vertical',
          position: nodeRight,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedX = nodeRight - draggingNode.width;
      }
      
      // Left to right
      if (Math.abs(dragLeft - nodeRight) < this.config.tolerance) {
        guides.push({
          type: 'vertical',
          position: nodeRight,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedX = nodeRight;
      }
      
      // Right to left
      if (Math.abs(dragRight - nodeLeft) < this.config.tolerance) {
        guides.push({
          type: 'vertical',
          position: nodeLeft,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedX = nodeLeft - draggingNode.width;
      }
      
      // Check vertical alignments
      // Center to center
      if (Math.abs(dragCenterY - nodeCenterY) < this.config.tolerance) {
        guides.push({
          type: 'horizontal',
          position: nodeCenterY,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedY = nodeCenterY - draggingNode.height / 2;
      }
      
      // Top to top
      if (Math.abs(dragTop - nodeTop) < this.config.tolerance) {
        guides.push({
          type: 'horizontal',
          position: nodeTop,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedY = nodeTop;
      }
      
      // Bottom to bottom
      if (Math.abs(dragBottom - nodeBottom) < this.config.tolerance) {
        guides.push({
          type: 'horizontal',
          position: nodeBottom,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedY = nodeBottom - draggingNode.height;
      }
      
      // Top to bottom
      if (Math.abs(dragTop - nodeBottom) < this.config.tolerance) {
        guides.push({
          type: 'horizontal',
          position: nodeBottom,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedY = nodeBottom;
      }
      
      // Bottom to top
      if (Math.abs(dragBottom - nodeTop) < this.config.tolerance) {
        guides.push({
          type: 'horizontal',
          position: nodeTop,
          sourceId: draggingNode.id,
          targetId: node.id,
        });
        snappedY = nodeTop - draggingNode.height;
      }
    });
    
    return { guides, snappedPosition: { x: snappedX, y: snappedY } };
  }

  // Distribute nodes evenly
  distributeHorizontally(nodes: LayoutNode[]): LayoutNode[] {
    if (nodes.length < 3) return nodes;
    
    const sorted = [...nodes].sort((a, b) => a.x - b.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    const totalWidth = sorted.reduce((sum, n) => sum + n.width, 0);
    const availableSpace = (last.x + last.width) - first.x - totalWidth;
    const gap = availableSpace / (sorted.length - 1);
    
    let currentX = first.x;
    return sorted.map((node, i) => {
      if (i === 0) {
        currentX += node.width + gap;
        return node;
      }
      const newNode = { ...node, x: currentX };
      currentX += node.width + gap;
      return newNode;
    });
  }

  distributeVertically(nodes: LayoutNode[]): LayoutNode[] {
    if (nodes.length < 3) return nodes;
    
    const sorted = [...nodes].sort((a, b) => a.y - b.y);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    const totalHeight = sorted.reduce((sum, n) => sum + n.height, 0);
    const availableSpace = (last.y + last.height) - first.y - totalHeight;
    const gap = availableSpace / (sorted.length - 1);
    
    let currentY = first.y;
    return sorted.map((node, i) => {
      if (i === 0) {
        currentY += node.height + gap;
        return node;
      }
      const newNode = { ...node, y: currentY };
      currentY += node.height + gap;
      return newNode;
    });
  }

  // Align nodes
  alignLeft(nodes: LayoutNode[]): LayoutNode[] {
    const minX = Math.min(...nodes.map(n => n.x));
    return nodes.map(node => ({ ...node, x: minX }));
  }

  alignRight(nodes: LayoutNode[]): LayoutNode[] {
    const maxRight = Math.max(...nodes.map(n => n.x + n.width));
    return nodes.map(node => ({ ...node, x: maxRight - node.width }));
  }

  alignTop(nodes: LayoutNode[]): LayoutNode[] {
    const minY = Math.min(...nodes.map(n => n.y));
    return nodes.map(node => ({ ...node, y: minY }));
  }

  alignBottom(nodes: LayoutNode[]): LayoutNode[] {
    const maxBottom = Math.max(...nodes.map(n => n.y + n.height));
    return nodes.map(node => ({ ...node, y: maxBottom - node.height }));
  }

  alignCenterHorizontally(nodes: LayoutNode[]): LayoutNode[] {
    const centers = nodes.map(n => n.x + n.width / 2);
    const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
    return nodes.map(node => ({ ...node, x: avgCenter - node.width / 2 }));
  }

  alignCenterVertically(nodes: LayoutNode[]): LayoutNode[] {
    const centers = nodes.map(n => n.y + n.height / 2);
    const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
    return nodes.map(node => ({ ...node, y: avgCenter - node.height / 2 }));
  }
}

// ============= Overlap Prevention =============
export class OverlapResolver {
  private padding: number;

  constructor(padding: number = 20) {
    this.padding = padding;
  }

  setPadding(padding: number) {
    this.padding = padding;
  }

  // Check if two nodes overlap
  checkOverlap(node1: LayoutNode, node2: LayoutNode): boolean {
    return !(
      node1.x + node1.width + this.padding < node2.x ||
      node2.x + node2.width + this.padding < node1.x ||
      node1.y + node1.height + this.padding < node2.y ||
      node2.y + node2.height + this.padding < node1.y
    );
  }

  // Resolve overlaps between all nodes
  resolveOverlaps(nodes: LayoutNode[], maxIterations: number = 50): LayoutNode[] {
    const result = nodes.map(n => ({ ...n }));
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let hasOverlap = false;
      
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          if (this.checkOverlap(result[i], result[j])) {
            hasOverlap = true;
            this.separateNodes(result[i], result[j]);
          }
        }
      }
      
      if (!hasOverlap) break;
    }
    
    return result;
  }

  // Separate two overlapping nodes
  private separateNodes(node1: LayoutNode, node2: LayoutNode) {
    const center1X = node1.x + node1.width / 2;
    const center1Y = node1.y + node1.height / 2;
    const center2X = node2.x + node2.width / 2;
    const center2Y = node2.y + node2.height / 2;
    
    const dx = center2X - center1X;
    const dy = center2Y - center1Y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    
    const minDistX = (node1.width + node2.width) / 2 + this.padding;
    const minDistY = (node1.height + node2.height) / 2 + this.padding;
    
    // Calculate overlap amount
    const overlapX = minDistX - Math.abs(dx);
    const overlapY = minDistY - Math.abs(dy);
    
    // Push nodes apart in the direction of least overlap
    if (overlapX < overlapY && overlapX > 0) {
      const pushX = (overlapX / 2 + 1) * (dx < 0 ? -1 : 1);
      if (!node1.fixed) node1.x -= pushX;
      if (!node2.fixed) node2.x += pushX;
    } else if (overlapY > 0) {
      const pushY = (overlapY / 2 + 1) * (dy < 0 ? -1 : 1);
      if (!node1.fixed) node1.y -= pushY;
      if (!node2.fixed) node2.y += pushY;
    }
  }
}

// ============= Auto-Connect Engine =============
export interface AutoConnectConfig {
  maxDistance: number;
  connectionTypes: string[];
  preferredDirection: 'horizontal' | 'vertical' | 'auto';
}

export const DEFAULT_AUTO_CONNECT_CONFIG: AutoConnectConfig = {
  maxDistance: 300,
  connectionTypes: ['data-flow', 'dependency', 'reference'],
  preferredDirection: 'auto',
};

export class AutoConnectEngine {
  private config: AutoConnectConfig;

  constructor(config: Partial<AutoConnectConfig> = {}) {
    this.config = { ...DEFAULT_AUTO_CONNECT_CONFIG, ...config };
  }

  // Find potential connections between nodes
  findPotentialConnections(
    nodes: LayoutNode[],
    existingEdges: LayoutEdge[]
  ): LayoutEdge[] {
    const potentialEdges: LayoutEdge[] = [];
    const existingSet = new Set(existingEdges.map(e => `${e.source}-${e.target}`));
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        
        // Calculate distance between node centers
        const center1X = node1.x + node1.width / 2;
        const center1Y = node1.y + node1.height / 2;
        const center2X = node2.x + node2.width / 2;
        const center2Y = node2.y + node2.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(center2X - center1X, 2) + 
          Math.pow(center2Y - center1Y, 2)
        );
        
        // Check if within connection range
        if (distance <= this.config.maxDistance) {
          const edgeKey = `${node1.id}-${node2.id}`;
          const reverseKey = `${node2.id}-${node1.id}`;
          
          if (!existingSet.has(edgeKey) && !existingSet.has(reverseKey)) {
            potentialEdges.push({
              source: node1.id,
              target: node2.id,
              weight: 1 - (distance / this.config.maxDistance),
            });
          }
        }
      }
    }
    
    return potentialEdges;
  }

  // Get optimal connection points between two nodes
  getConnectionPoints(
    source: LayoutNode,
    target: LayoutNode
  ): { sourcePoint: { x: number; y: number }; targetPoint: { x: number; y: number } } {
    const sourceCenter = {
      x: source.x + source.width / 2,
      y: source.y + source.height / 2,
    };
    const targetCenter = {
      x: target.x + target.width / 2,
      y: target.y + target.height / 2,
    };
    
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    
    let sourceAnchor: 'top' | 'right' | 'bottom' | 'left';
    let targetAnchor: 'top' | 'right' | 'bottom' | 'left';
    
    if (this.config.preferredDirection === 'horizontal' || 
        (this.config.preferredDirection === 'auto' && Math.abs(dx) > Math.abs(dy))) {
      sourceAnchor = dx > 0 ? 'right' : 'left';
      targetAnchor = dx > 0 ? 'left' : 'right';
    } else {
      sourceAnchor = dy > 0 ? 'bottom' : 'top';
      targetAnchor = dy > 0 ? 'top' : 'bottom';
    }
    
    return {
      sourcePoint: this.getAnchorPoint(source, sourceAnchor),
      targetPoint: this.getAnchorPoint(target, targetAnchor),
    };
  }

  private getAnchorPoint(
    node: LayoutNode,
    anchor: 'top' | 'right' | 'bottom' | 'left'
  ): { x: number; y: number } {
    switch (anchor) {
      case 'top':
        return { x: node.x + node.width / 2, y: node.y };
      case 'right':
        return { x: node.x + node.width, y: node.y + node.height / 2 };
      case 'bottom':
        return { x: node.x + node.width / 2, y: node.y + node.height };
      case 'left':
        return { x: node.x, y: node.y + node.height / 2 };
    }
  }
}

// ============= Combined Layout Manager =============
export class LayoutManager {
  public forceLayout: ForceDirectedLayout;
  public snapEngine: SnapAlignmentEngine;
  public overlapResolver: OverlapResolver;
  public autoConnect: AutoConnectEngine;

  constructor() {
    this.forceLayout = new ForceDirectedLayout();
    this.snapEngine = new SnapAlignmentEngine();
    this.overlapResolver = new OverlapResolver();
    this.autoConnect = new AutoConnectEngine();
  }

  // Apply full layout with all engines
  async applyLayout(
    nodes: LayoutNode[],
    edges: LayoutEdge[],
    options: {
      useForce?: boolean;
      resolveOverlaps?: boolean;
      animated?: boolean;
    } = {}
  ): Promise<{ nodes: LayoutNode[]; potentialEdges: LayoutEdge[] }> {
    const { useForce = true, resolveOverlaps = true, animated = false } = options;
    
    let resultNodes = [...nodes];
    
    if (useForce && nodes.length > 1) {
      this.forceLayout.setNodes(resultNodes);
      this.forceLayout.setEdges(edges);
      resultNodes = await this.forceLayout.run(animated);
    }
    
    if (resolveOverlaps) {
      resultNodes = this.overlapResolver.resolveOverlaps(resultNodes);
    }
    
    const potentialEdges = this.autoConnect.findPotentialConnections(resultNodes, edges);
    
    return { nodes: resultNodes, potentialEdges };
  }
}

// ============= React Hook =============
export const useLayoutManager = () => {
  const managerRef = useRef<LayoutManager | null>(null);
  
  if (!managerRef.current) {
    managerRef.current = new LayoutManager();
  }
  
  const applyForceLayout = useCallback(async (
    nodes: LayoutNode[],
    edges: LayoutEdge[],
    animated: boolean = true
  ) => {
    return managerRef.current!.applyLayout(nodes, edges, { useForce: true, animated });
  }, []);
  
  const snapToGuides = useCallback((
    draggingNode: LayoutNode,
    otherNodes: LayoutNode[]
  ) => {
    return managerRef.current!.snapEngine.findAlignmentGuides(draggingNode, otherNodes);
  }, []);
  
  const resolveOverlaps = useCallback((nodes: LayoutNode[]) => {
    return managerRef.current!.overlapResolver.resolveOverlaps(nodes);
  }, []);
  
  const distributeHorizontally = useCallback((nodes: LayoutNode[]) => {
    return managerRef.current!.snapEngine.distributeHorizontally(nodes);
  }, []);
  
  const distributeVertically = useCallback((nodes: LayoutNode[]) => {
    return managerRef.current!.snapEngine.distributeVertically(nodes);
  }, []);
  
  const alignNodes = useCallback((
    nodes: LayoutNode[],
    alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v'
  ) => {
    switch (alignment) {
      case 'left': return managerRef.current!.snapEngine.alignLeft(nodes);
      case 'right': return managerRef.current!.snapEngine.alignRight(nodes);
      case 'top': return managerRef.current!.snapEngine.alignTop(nodes);
      case 'bottom': return managerRef.current!.snapEngine.alignBottom(nodes);
      case 'center-h': return managerRef.current!.snapEngine.alignCenterHorizontally(nodes);
      case 'center-v': return managerRef.current!.snapEngine.alignCenterVertically(nodes);
    }
  }, []);
  
  const findAutoConnections = useCallback((
    nodes: LayoutNode[],
    existingEdges: LayoutEdge[]
  ) => {
    return managerRef.current!.autoConnect.findPotentialConnections(nodes, existingEdges);
  }, []);
  
  const getConnectionPoints = useCallback((
    source: LayoutNode,
    target: LayoutNode
  ) => {
    return managerRef.current!.autoConnect.getConnectionPoints(source, target);
  }, []);
  
  return {
    manager: managerRef.current,
    applyForceLayout,
    snapToGuides,
    resolveOverlaps,
    distributeHorizontally,
    distributeVertically,
    alignNodes,
    findAutoConnections,
    getConnectionPoints,
  };
};

export default LayoutManager;
