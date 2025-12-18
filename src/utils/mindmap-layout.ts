/**
 * خوارزميات التخطيط التلقائي للخرائط الذهنية
 */

import type { CanvasElement } from '@/types/canvas';
import type { MindMapConnectorData } from '@/types/mindmap-canvas';

export type LayoutType = 'tree' | 'radial' | 'organic';

interface LayoutNode {
  id: string;
  element: CanvasElement;
  children: LayoutNode[];
  parent: LayoutNode | null;
  depth: number;
}

interface LayoutResult {
  nodeId: string;
  position: { x: number; y: number };
}

/**
 * بناء شجرة من العقد والروابط
 */
function buildTree(
  nodes: CanvasElement[],
  connectors: CanvasElement[]
): LayoutNode | null {
  if (nodes.length === 0) return null;

  // البحث عن العقدة الجذر
  const rootNode = nodes.find(n => (n.data as any)?.isRoot) || nodes[0];
  
  // بناء خريطة الاتصالات
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();
  
  connectors.forEach(conn => {
    const data = conn.data as MindMapConnectorData;
    if (!data.startNodeId || !data.endNodeId) return;
    
    if (!childrenMap.has(data.startNodeId)) {
      childrenMap.set(data.startNodeId, []);
    }
    childrenMap.get(data.startNodeId)!.push(data.endNodeId);
    parentMap.set(data.endNodeId, data.startNodeId);
  });
  
  // بناء الشجرة بشكل تكراري
  function buildNode(element: CanvasElement, depth: number, parent: LayoutNode | null): LayoutNode {
    const node: LayoutNode = {
      id: element.id,
      element,
      children: [],
      parent,
      depth
    };
    
    const childIds = childrenMap.get(element.id) || [];
    node.children = childIds
      .map(childId => nodes.find(n => n.id === childId))
      .filter((n): n is CanvasElement => n !== undefined)
      .map(childElement => buildNode(childElement, depth + 1, node));
    
    return node;
  }
  
  return buildNode(rootNode, 0, null);
}

/**
 * تخطيط شجري (من اليمين لليسار - RTL)
 */
function calculateTreeLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  horizontalSpacing: number = 250,
  verticalSpacing: number = 100
): LayoutResult[] {
  const results: LayoutResult[] = [];
  
  function calculateSubtreeHeight(node: LayoutNode): number {
    if (node.children.length === 0) {
      return node.element.size.height;
    }
    
    const childrenHeight = node.children.reduce((sum, child) => 
      sum + calculateSubtreeHeight(child) + verticalSpacing, -verticalSpacing);
    
    return Math.max(node.element.size.height, childrenHeight);
  }
  
  function layoutNode(node: LayoutNode, x: number, y: number): void {
    // وضع العقدة الحالية
    results.push({
      nodeId: node.id,
      position: { x, y }
    });
    
    if (node.children.length === 0) return;
    
    // حساب ارتفاع كل فرع فرعي
    const subtreeHeights = node.children.map(child => calculateSubtreeHeight(child));
    const totalHeight = subtreeHeights.reduce((sum, h) => sum + h + verticalSpacing, -verticalSpacing);
    
    // البدء من أعلى المنطقة المخصصة
    let currentY = y - totalHeight / 2 + subtreeHeights[0] / 2;
    
    // وضع الأطفال (من اليسار - لأن RTL)
    const childX = x - horizontalSpacing;
    
    node.children.forEach((child, index) => {
      layoutNode(child, childX, currentY);
      
      if (index < node.children.length - 1) {
        currentY += subtreeHeights[index] / 2 + verticalSpacing + subtreeHeights[index + 1] / 2;
      }
    });
  }
  
  layoutNode(root, startX, startY);
  return results;
}

/**
 * تخطيط شعاعي (دائري)
 */
function calculateRadialLayout(
  root: LayoutNode,
  centerX: number,
  centerY: number,
  initialRadius: number = 200,
  radiusIncrement: number = 150
): LayoutResult[] {
  const results: LayoutResult[] = [];
  
  // العقدة الجذر في المركز
  results.push({
    nodeId: root.id,
    position: { x: centerX, y: centerY }
  });
  
  if (root.children.length === 0) return results;
  
  // جمع العقد حسب العمق
  const nodesByDepth = new Map<number, LayoutNode[]>();
  
  function collectByDepth(node: LayoutNode): void {
    const depth = node.depth;
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)!.push(node);
    node.children.forEach(collectByDepth);
  }
  
  root.children.forEach(child => collectByDepth(child));
  
  // ترتيب العقد في كل مستوى بشكل دائري
  nodesByDepth.forEach((nodes, depth) => {
    const radius = initialRadius + (depth - 1) * radiusIncrement;
    const angleStep = (2 * Math.PI) / nodes.length;
    const startAngle = -Math.PI / 2; // البدء من الأعلى
    
    nodes.forEach((node, index) => {
      const angle = startAngle + index * angleStep;
      results.push({
        nodeId: node.id,
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        }
      });
    });
  });
  
  return results;
}

/**
 * تخطيط عضوي (force-directed مبسط)
 */
function calculateOrganicLayout(
  nodes: CanvasElement[],
  connectors: CanvasElement[],
  centerX: number,
  centerY: number,
  iterations: number = 50
): LayoutResult[] {
  if (nodes.length === 0) return [];
  
  // تهيئة المواقع العشوائية حول المركز
  const positions = new Map<string, { x: number; y: number }>();
  const velocities = new Map<string, { x: number; y: number }>();
  
  // البحث عن العقدة الجذر
  const rootNode = nodes.find(n => (n.data as any)?.isRoot);
  
  nodes.forEach((node, index) => {
    if (rootNode && node.id === rootNode.id) {
      // العقدة الجذر في المركز
      positions.set(node.id, { x: centerX, y: centerY });
    } else {
      // توزيع أولي عشوائي
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = 150 + Math.random() * 100;
      positions.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
    velocities.set(node.id, { x: 0, y: 0 });
  });
  
  // بناء خريطة الاتصالات
  const connections = new Set<string>();
  connectors.forEach(conn => {
    const data = conn.data as MindMapConnectorData;
    if (data.startNodeId && data.endNodeId) {
      connections.add(`${data.startNodeId}-${data.endNodeId}`);
      connections.add(`${data.endNodeId}-${data.startNodeId}`);
    }
  });
  
  // محاكاة القوى
  const repulsionStrength = 5000;
  const attractionStrength = 0.01;
  const damping = 0.9;
  const minDistance = 100;
  
  for (let iter = 0; iter < iterations; iter++) {
    // قوى التنافر بين جميع العقد
    nodes.forEach(nodeA => {
      const posA = positions.get(nodeA.id)!;
      let forceX = 0;
      let forceY = 0;
      
      nodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        
        const posB = positions.get(nodeB.id)!;
        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        
        if (distance < minDistance * 3) {
          const force = repulsionStrength / (distance * distance);
          forceX += (dx / distance) * force;
          forceY += (dy / distance) * force;
        }
      });
      
      const vel = velocities.get(nodeA.id)!;
      vel.x = (vel.x + forceX) * damping;
      vel.y = (vel.y + forceY) * damping;
    });
    
    // قوى الجذب للعقد المتصلة
    connectors.forEach(conn => {
      const data = conn.data as MindMapConnectorData;
      if (!data.startNodeId || !data.endNodeId) return;
      
      const posA = positions.get(data.startNodeId);
      const posB = positions.get(data.endNodeId);
      if (!posA || !posB) return;
      
      const dx = posB.x - posA.x;
      const dy = posB.y - posA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const idealDistance = 200;
      const force = (distance - idealDistance) * attractionStrength;
      
      const velA = velocities.get(data.startNodeId)!;
      const velB = velocities.get(data.endNodeId)!;
      
      if (distance > 0) {
        velA.x += (dx / distance) * force;
        velA.y += (dy / distance) * force;
        velB.x -= (dx / distance) * force;
        velB.y -= (dy / distance) * force;
      }
    });
    
    // تطبيق السرعات على المواقع
    nodes.forEach(node => {
      // العقدة الجذر ثابتة
      if (rootNode && node.id === rootNode.id) return;
      
      const pos = positions.get(node.id)!;
      const vel = velocities.get(node.id)!;
      pos.x += vel.x;
      pos.y += vel.y;
    });
  }
  
  return nodes.map(node => ({
    nodeId: node.id,
    position: positions.get(node.id)!
  }));
}

/**
 * تطبيق التخطيط على عقد الخريطة الذهنية
 */
export function applyMindMapLayout(
  layoutType: LayoutType,
  allElements: CanvasElement[],
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
): void {
  // فلترة عقد وروابط الخريطة الذهنية
  const nodes = allElements.filter(el => el.type === 'mindmap_node');
  const connectors = allElements.filter(el => el.type === 'mindmap_connector');
  
  if (nodes.length === 0) return;
  
  // حساب مركز العقد الحالية
  const centerX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
  const centerY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length;
  
  let results: LayoutResult[] = [];
  
  switch (layoutType) {
    case 'tree': {
      const tree = buildTree(nodes, connectors);
      if (tree) {
        results = calculateTreeLayout(tree, centerX, centerY);
      }
      break;
    }
    case 'radial': {
      const tree = buildTree(nodes, connectors);
      if (tree) {
        results = calculateRadialLayout(tree, centerX, centerY);
      }
      break;
    }
    case 'organic': {
      results = calculateOrganicLayout(nodes, connectors, centerX, centerY);
      break;
    }
  }
  
  // تطبيق المواقع الجديدة
  results.forEach(result => {
    updateElement(result.nodeId, {
      position: result.position
    });
  });
}

/**
 * الحصول على اسم التخطيط بالعربية
 */
export function getLayoutName(type: LayoutType): string {
  switch (type) {
    case 'tree': return 'شجري';
    case 'radial': return 'شعاعي';
    case 'organic': return 'عضوي';
    default: return type;
  }
}
