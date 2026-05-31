/**
 * خوارزميات التخطيط التلقائي للخرائط الذهنية
 * نظام إعدادات التخطيط الثلاثي: التعامد، التناظر، الاتجاه
 */

import type { CanvasElement } from '@/types/canvas';
import type { MindMapConnectorData } from '@/types/mindmap-canvas';

// ✅ الأنواع القديمة (للتوافقية)
export type LayoutType = 'tree' | 'radial' | 'organic';

// ✅ نظام الإعدادات الجديد
export interface LayoutSettings {
  orientation: 'horizontal' | 'vertical';  // التعامد: عرضي أو طولي
  symmetry: 'symmetric' | 'unilateral';     // التناظر: تناظري أو أحادي
  direction: 'rtl' | 'ltr';                 // الاتجاه: من اليمين أو من اليسار
}

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  orientation: 'horizontal',
  symmetry: 'unilateral',
  direction: 'rtl'
};

interface LayoutNode {
  id: string;
  element: CanvasElement;
  children: LayoutNode[];
  parent: LayoutNode | null;
  depth: number;
  side?: 'primary' | 'secondary'; // للتخطيط التناظري
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

  const rootNode = nodes.find(n => (n.data as any)?.isRoot) || nodes[0];
  
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
  
  const visited = new Set<string>();
  
  function buildNode(element: CanvasElement, depth: number, parent: LayoutNode | null, side?: 'primary' | 'secondary'): LayoutNode | null {
    if (visited.has(element.id)) {
      return null;
    }
    visited.add(element.id);
    
    const node: LayoutNode = {
      id: element.id,
      element,
      children: [],
      parent,
      depth,
      side
    };
    
    const childIds = childrenMap.get(element.id) || [];
    node.children = childIds
      .map(childId => nodes.find(n => n.id === childId))
      .filter((n): n is CanvasElement => n !== undefined && !visited.has(n.id))
      .map((childElement, index) => {
        // توزيع الأطفال على الجانبين للتخطيط التناظري
        const childSide = side || (index % 2 === 0 ? 'primary' : 'secondary');
        return buildNode(childElement, depth + 1, node, childSide);
      })
      .filter((n): n is LayoutNode => n !== null);
    
    return node;
  }
  
  return buildNode(rootNode, 0, null);
}

/**
 * حساب ارتفاع الشجرة الفرعية (للتخطيط الداخلي)
 */
function calcLayoutSubtreeHeight(node: LayoutNode, spacing: number): number {
  if (node.children.length === 0) {
    return node.element.size.height;
  }
  
  const childrenHeight = node.children.reduce((sum, child) => 
    sum + calcLayoutSubtreeHeight(child, spacing) + spacing, -spacing);
  
  return Math.max(node.element.size.height, childrenHeight);
}

/**
 * حساب عرض الشجرة الفرعية (للتخطيط الداخلي)
 */
function calcLayoutSubtreeWidth(node: LayoutNode, spacing: number): number {
  if (node.children.length === 0) {
    return node.element.size.width;
  }
  
  const childrenWidth = node.children.reduce((sum, child) => 
    sum + calcLayoutSubtreeWidth(child, spacing) + spacing, -spacing);
  
  return Math.max(node.element.size.width, childrenWidth);
}

/**
 * تخطيط أفقي أحادي الاتجاه
 */
function calculateHorizontalUnilateralLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: LayoutSettings,
  horizontalSpacing: number = 250,
  verticalSpacing: number = 100
): LayoutResult[] {
  const results: LayoutResult[] = [];
  const isRTL = settings.direction === 'rtl';
  
  function layoutNode(node: LayoutNode, x: number, y: number): void {
    results.push({
      nodeId: node.id,
      position: { x, y }
    });
    
    if (node.children.length === 0) return;
    
    const subtreeHeights = node.children.map(child => calcLayoutSubtreeHeight(child, verticalSpacing));
    const totalHeight = subtreeHeights.reduce((sum, h) => sum + h + verticalSpacing, -verticalSpacing);
    
    let currentY = y - totalHeight / 2 + subtreeHeights[0] / 2;
    
    // الاتجاه: RTL = يمين، LTR = يسار
    const childX = isRTL 
      ? x + node.element.size.width + horizontalSpacing
      : x - horizontalSpacing;
    
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
 * تخطيط أفقي تناظري (فروع على كلا الجانبين)
 */
function calculateHorizontalSymmetricLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: LayoutSettings,
  horizontalSpacing: number = 250,
  verticalSpacing: number = 100
): LayoutResult[] {
  const results: LayoutResult[] = [];
  const isRTL = settings.direction === 'rtl';
  
  // العقدة الجذر في المركز
  results.push({
    nodeId: root.id,
    position: { x: startX, y: startY }
  });
  
  if (root.children.length === 0) return results;
  
  // تقسيم الأطفال إلى جانبين
  const primaryChildren: LayoutNode[] = [];
  const secondaryChildren: LayoutNode[] = [];
  
  root.children.forEach((child, index) => {
    if (index % 2 === 0) {
      primaryChildren.push(child);
    } else {
      secondaryChildren.push(child);
    }
  });
  
  // تخطيط الجانب الأساسي (يمين في RTL، يسار في LTR)
  function layoutSide(children: LayoutNode[], isPrimary: boolean): void {
    if (children.length === 0) return;
    
    const subtreeHeights = children.map(child => calcLayoutSubtreeHeight(child, verticalSpacing));
    const totalHeight = subtreeHeights.reduce((sum, h) => sum + h + verticalSpacing, -verticalSpacing);
    
    let currentY = startY - totalHeight / 2 + subtreeHeights[0] / 2;
    
    // الاتجاه حسب الجانب
    const directionMultiplier = isPrimary 
      ? (isRTL ? 1 : -1)  // الجانب الأساسي
      : (isRTL ? -1 : 1); // الجانب الثانوي
    
    const childX = startX + directionMultiplier * (root.element.size.width / 2 + horizontalSpacing);
    
    children.forEach((child, index) => {
      layoutBranch(child, childX, currentY, directionMultiplier);
      
      if (index < children.length - 1) {
        currentY += subtreeHeights[index] / 2 + verticalSpacing + subtreeHeights[index + 1] / 2;
      }
    });
  }
  
  // تخطيط فرع مع أطفاله (يحافظ على نفس الاتجاه)
  function layoutBranch(node: LayoutNode, x: number, y: number, directionMultiplier: number): void {
    results.push({
      nodeId: node.id,
      position: { x, y }
    });
    
    if (node.children.length === 0) return;
    
    const subtreeHeights = node.children.map(child => calcLayoutSubtreeHeight(child, verticalSpacing));
    const totalHeight = subtreeHeights.reduce((sum, h) => sum + h + verticalSpacing, -verticalSpacing);
    
    let currentY = y - totalHeight / 2 + subtreeHeights[0] / 2;
    const childX = x + directionMultiplier * (node.element.size.width + horizontalSpacing);
    
    node.children.forEach((child, index) => {
      layoutBranch(child, childX, currentY, directionMultiplier);
      
      if (index < node.children.length - 1) {
        currentY += subtreeHeights[index] / 2 + verticalSpacing + subtreeHeights[index + 1] / 2;
      }
    });
  }
  
  layoutSide(primaryChildren, true);
  layoutSide(secondaryChildren, false);
  
  return results;
}

/**
 * تخطيط عمودي أحادي الاتجاه
 */
function calculateVerticalUnilateralLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: LayoutSettings,
  horizontalSpacing: number = 150,
  verticalSpacing: number = 120
): LayoutResult[] {
  const results: LayoutResult[] = [];
  const isTopDown = settings.direction === 'rtl'; // RTL = من أعلى لأسفل
  
  function layoutNode(node: LayoutNode, x: number, y: number): void {
    results.push({
      nodeId: node.id,
      position: { x, y }
    });
    
    if (node.children.length === 0) return;
    
    const subtreeWidths = node.children.map(child => calcLayoutSubtreeWidth(child, horizontalSpacing));
    const totalWidth = subtreeWidths.reduce((sum, w) => sum + w + horizontalSpacing, -horizontalSpacing);
    
    let currentX = x - totalWidth / 2 + subtreeWidths[0] / 2;
    
    // الاتجاه: RTL = أسفل، LTR = أعلى
    const childY = isTopDown 
      ? y + node.element.size.height + verticalSpacing
      : y - verticalSpacing;
    
    node.children.forEach((child, index) => {
      layoutNode(child, currentX, childY);
      
      if (index < node.children.length - 1) {
        currentX += subtreeWidths[index] / 2 + horizontalSpacing + subtreeWidths[index + 1] / 2;
      }
    });
  }
  
  layoutNode(root, startX, startY);
  return results;
}

/**
 * تخطيط عمودي تناظري
 */
function calculateVerticalSymmetricLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: LayoutSettings,
  horizontalSpacing: number = 150,
  verticalSpacing: number = 120
): LayoutResult[] {
  const results: LayoutResult[] = [];
  const isTopDown = settings.direction === 'rtl';
  
  results.push({
    nodeId: root.id,
    position: { x: startX, y: startY }
  });
  
  if (root.children.length === 0) return results;
  
  const primaryChildren: LayoutNode[] = [];
  const secondaryChildren: LayoutNode[] = [];
  
  root.children.forEach((child, index) => {
    if (index % 2 === 0) {
      primaryChildren.push(child);
    } else {
      secondaryChildren.push(child);
    }
  });
  
  function layoutSide(children: LayoutNode[], isPrimary: boolean): void {
    if (children.length === 0) return;
    
    const subtreeWidths = children.map(child => calcLayoutSubtreeWidth(child, horizontalSpacing));
    const totalWidth = subtreeWidths.reduce((sum, w) => sum + w + horizontalSpacing, -horizontalSpacing);
    
    let currentX = startX - totalWidth / 2 + subtreeWidths[0] / 2;
    
    const directionMultiplier = isPrimary 
      ? (isTopDown ? 1 : -1)
      : (isTopDown ? -1 : 1);
    
    const childY = startY + directionMultiplier * (root.element.size.height / 2 + verticalSpacing);
    
    children.forEach((child, index) => {
      layoutBranch(child, currentX, childY, directionMultiplier);
      
      if (index < children.length - 1) {
        currentX += subtreeWidths[index] / 2 + horizontalSpacing + subtreeWidths[index + 1] / 2;
      }
    });
  }
  
  function layoutBranch(node: LayoutNode, x: number, y: number, directionMultiplier: number): void {
    results.push({
      nodeId: node.id,
      position: { x, y }
    });
    
    if (node.children.length === 0) return;
    
    const subtreeWidths = node.children.map(child => calcLayoutSubtreeWidth(child, horizontalSpacing));
    const totalWidth = subtreeWidths.reduce((sum, w) => sum + w + horizontalSpacing, -horizontalSpacing);
    
    let currentX = x - totalWidth / 2 + subtreeWidths[0] / 2;
    const childY = y + directionMultiplier * (node.element.size.height + verticalSpacing);
    
    node.children.forEach((child, index) => {
      layoutBranch(child, currentX, childY, directionMultiplier);
      
      if (index < node.children.length - 1) {
        currentX += subtreeWidths[index] / 2 + horizontalSpacing + subtreeWidths[index + 1] / 2;
      }
    });
  }
  
  layoutSide(primaryChildren, true);
  layoutSide(secondaryChildren, false);
  
  return results;
}

/**
 * تحديد نقاط الاتصال (Anchors) المناسبة بناءً على إعدادات التخطيط
 */
function getAnchorsForLayout(
  settings: LayoutSettings,
  isSecondary: boolean = false
): { startAnchor: 'top' | 'bottom' | 'left' | 'right'; endAnchor: 'top' | 'bottom' | 'left' | 'right' } {
  if (settings.orientation === 'horizontal') {
    // تخطيط أفقي
    if (settings.symmetry === 'symmetric' && isSecondary) {
      // الجانب الثانوي في التناظري (معكوس)
      return settings.direction === 'rtl'
        ? { startAnchor: 'left', endAnchor: 'right' }
        : { startAnchor: 'right', endAnchor: 'left' };
    }
    // الجانب الأساسي أو أحادي
    return settings.direction === 'rtl'
      ? { startAnchor: 'right', endAnchor: 'left' }   // يمين ← يسار
      : { startAnchor: 'left', endAnchor: 'right' };  // يسار ← يمين
  } else {
    // تخطيط عمودي
    if (settings.symmetry === 'symmetric' && isSecondary) {
      return settings.direction === 'rtl'
        ? { startAnchor: 'top', endAnchor: 'bottom' }
        : { startAnchor: 'bottom', endAnchor: 'top' };
    }
    return settings.direction === 'rtl'
      ? { startAnchor: 'bottom', endAnchor: 'top' }   // أعلى ← أسفل
      : { startAnchor: 'top', endAnchor: 'bottom' };  // أسفل ← أعلى
  }
}

/**
 * تطبيق التخطيط الجديد بناءً على الإعدادات
 */
export function applyLayoutWithSettings(
  settings: LayoutSettings,
  allElements: CanvasElement[],
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
): void {
  const nodes = allElements.filter(el => el.type === 'mindmap_node');
  const connectors = allElements.filter(el => el.type === 'mindmap_connector');
  
  if (nodes.length === 0) return;
  
  const centerX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
  const centerY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length;
  
  const tree = buildTree(nodes, connectors);
  if (!tree) return;
  
  let results: LayoutResult[] = [];
  
  // خريطة لتتبع أي جانب ينتمي إليه كل عقدة (للتناظري)
  const nodeSideMap = new Map<string, 'primary' | 'secondary'>();
  
  // بناء خريطة الجوانب من الشجرة
  function mapNodeSides(node: LayoutNode) {
    if (node.side) {
      nodeSideMap.set(node.id, node.side);
    }
    node.children.forEach(child => mapNodeSides(child));
  }
  mapNodeSides(tree);
  
  if (settings.orientation === 'horizontal') {
    if (settings.symmetry === 'symmetric') {
      results = calculateHorizontalSymmetricLayout(tree, centerX, centerY, settings);
    } else {
      results = calculateHorizontalUnilateralLayout(tree, centerX, centerY, settings);
    }
  } else {
    if (settings.symmetry === 'symmetric') {
      results = calculateVerticalSymmetricLayout(tree, centerX, centerY, settings);
    } else {
      results = calculateVerticalUnilateralLayout(tree, centerX, centerY, settings);
    }
  }
  
  // ✅ الخطوة 1: تحديث جميع مواقع العقد أولاً
  results.forEach(result => {
    updateElement(result.nodeId, {
      position: result.position
    });
  });
  
  // ✅ الخطوة 2: إنشاء خريطة للمواقع الجديدة
  const newPositions = new Map<string, { position: { x: number; y: number }; size: { width: number; height: number } }>();
  results.forEach(result => {
    const node = nodes.find(n => n.id === result.nodeId);
    if (node) {
      newPositions.set(result.nodeId, {
        position: result.position,
        size: node.size
      });
    }
  });
  
  // ✅ الخطوة 3: تحديث جميع الـ connectors مع الـ anchors الصحيحة
  connectors.forEach(connector => {
    const connectorData = connector.data as MindMapConnectorData;
    
    const startNodeData = newPositions.get(connectorData.startNodeId);
    const endNodeData = newPositions.get(connectorData.endNodeId);
    
    const startNode = startNodeData || nodes.find(n => n.id === connectorData.startNodeId);
    const endNode = endNodeData || nodes.find(n => n.id === connectorData.endNodeId);
    
    if (startNode && endNode) {
      const startInfo = 'position' in startNode && 'size' in startNode 
        ? startNode 
        : { position: (startNode as CanvasElement).position, size: (startNode as CanvasElement).size };
      const endInfo = 'position' in endNode && 'size' in endNode 
        ? endNode 
        : { position: (endNode as CanvasElement).position, size: (endNode as CanvasElement).size };
      
      // تحديد إذا كان الـ connector في الجانب الثانوي (للتناظري)
      const endNodeSide = nodeSideMap.get(connectorData.endNodeId);
      const isSecondary = endNodeSide === 'secondary';
      
      // الحصول على الـ anchors المناسبة بناءً على إعدادات التخطيط
      const { startAnchor, endAnchor } = getAnchorsForLayout(settings, isSecondary);
      
      // حساب حدود الـ connector الجديدة
      const padding = 50;
      const minX = Math.min(startInfo.position.x, endInfo.position.x) - padding;
      const minY = Math.min(startInfo.position.y, endInfo.position.y) - padding;
      const maxX = Math.max(startInfo.position.x + startInfo.size.width, endInfo.position.x + endInfo.size.width) + padding;
      const maxY = Math.max(startInfo.position.y + startInfo.size.height, endInfo.position.y + endInfo.size.height) + padding;
      
      // تحديث موقع وحجم والـ anchors للـ connector
      updateElement(connector.id, {
        position: { x: minX, y: minY },
        size: { width: maxX - minX, height: maxY - minY },
        data: {
          ...connectorData,
          startAnchor: { nodeId: connectorData.startNodeId, anchor: startAnchor },
          endAnchor: { nodeId: connectorData.endNodeId, anchor: endAnchor }
        }
      });
    }
  });
}

/**
 * تطبيق التخطيط (الواجهة القديمة للتوافقية)
 */
export function applyMindMapLayout(
  layoutType: LayoutType,
  allElements: CanvasElement[],
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
): void {
  // تحويل النوع القديم إلى الإعدادات الجديدة
  const settings: LayoutSettings = {
    orientation: layoutType === 'radial' ? 'horizontal' : 'horizontal',
    symmetry: layoutType === 'radial' ? 'symmetric' : 'unilateral',
    direction: 'rtl'
  };
  
  if (layoutType === 'organic') {
    // التخطيط العضوي يبقى كما هو
    const nodes = allElements.filter(el => el.type === 'mindmap_node');
    const connectors = allElements.filter(el => el.type === 'mindmap_connector');
    
    if (nodes.length === 0) return;
    
    const centerX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
    const centerY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length;
    
    const results = calculateOrganicLayout(nodes, connectors, centerX, centerY);
    results.forEach(result => {
      updateElement(result.nodeId, {
        position: result.position
      });
    });
    return;
  }
  
  applyLayoutWithSettings(settings, allElements, updateElement);
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
  
  const positions = new Map<string, { x: number; y: number }>();
  const velocities = new Map<string, { x: number; y: number }>();
  
  const rootNode = nodes.find(n => (n.data as any)?.isRoot);
  
  nodes.forEach((node, index) => {
    if (rootNode && node.id === rootNode.id) {
      positions.set(node.id, { x: centerX, y: centerY });
    } else {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = 150 + Math.random() * 100;
      positions.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
    velocities.set(node.id, { x: 0, y: 0 });
  });
  
  const connections = new Set<string>();
  connectors.forEach(conn => {
    const data = conn.data as MindMapConnectorData;
    if (data.startNodeId && data.endNodeId) {
      connections.add(`${data.startNodeId}-${data.endNodeId}`);
      connections.add(`${data.endNodeId}-${data.startNodeId}`);
    }
  });
  
  const repulsionStrength = 5000;
  const attractionStrength = 0.01;
  const damping = 0.9;
  const minDistance = 100;
  
  for (let iter = 0; iter < iterations; iter++) {
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
    
    nodes.forEach(node => {
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
 * الحصول على اسم التخطيط بالعربية (للتوافقية)
 */
export function getLayoutName(type: LayoutType): string {
  switch (type) {
    case 'tree': return 'شجري';
    case 'radial': return 'شعاعي';
    case 'organic': return 'عضوي';
    default: return type;
  }
}

/**
 * اكتشاف التداخل بين العقد
 */
export function detectOverlaps(
  nodes: CanvasElement[],
  padding: number = 20
): { nodeId1: string; nodeId2: string; overlapX: number; overlapY: number }[] {
  const overlaps: { nodeId1: string; nodeId2: string; overlapX: number; overlapY: number }[] = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      
      const ax1 = a.position.x - padding;
      const ay1 = a.position.y - padding;
      const ax2 = a.position.x + a.size.width + padding;
      const ay2 = a.position.y + a.size.height + padding;
      
      const bx1 = b.position.x - padding;
      const by1 = b.position.y - padding;
      const bx2 = b.position.x + b.size.width + padding;
      const by2 = b.position.y + b.size.height + padding;
      
      const overlapX = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
      const overlapY = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
      
      if (overlapX > 0 && overlapY > 0) {
        overlaps.push({
          nodeId1: a.id,
          nodeId2: b.id,
          overlapX,
          overlapY
        });
      }
    }
  }
  
  return overlaps;
}

/**
 * حل التداخلات بإزاحة العقد
 */
export function resolveOverlaps(
  elements: CanvasElement[],
  overlaps: { nodeId1: string; nodeId2: string; overlapX: number; overlapY: number }[]
): Map<string, { deltaX: number; deltaY: number }> {
  const adjustments = new Map<string, { deltaX: number; deltaY: number }>();
  
  overlaps.forEach(({ nodeId1, nodeId2, overlapX, overlapY }) => {
    const node1 = elements.find(e => e.id === nodeId1);
    const node2 = elements.find(e => e.id === nodeId2);
    if (!node1 || !node2) return;
    
    // تحديد اتجاه الإزاحة (الإزاحة الأصغر)
    if (overlapY < overlapX) {
      // إزاحة رأسية
      const moveAmount = (overlapY / 2) + 10;
      const node1Above = node1.position.y < node2.position.y;
      
      const adj1 = adjustments.get(nodeId1) || { deltaX: 0, deltaY: 0 };
      const adj2 = adjustments.get(nodeId2) || { deltaX: 0, deltaY: 0 };
      
      adj1.deltaY += node1Above ? -moveAmount : moveAmount;
      adj2.deltaY += node1Above ? moveAmount : -moveAmount;
      
      adjustments.set(nodeId1, adj1);
      adjustments.set(nodeId2, adj2);
    } else {
      // إزاحة أفقية
      const moveAmount = (overlapX / 2) + 10;
      const node1Left = node1.position.x < node2.position.x;
      
      const adj1 = adjustments.get(nodeId1) || { deltaX: 0, deltaY: 0 };
      const adj2 = adjustments.get(nodeId2) || { deltaX: 0, deltaY: 0 };
      
      adj1.deltaX += node1Left ? -moveAmount : moveAmount;
      adj2.deltaX += node1Left ? moveAmount : -moveAmount;
      
      adjustments.set(nodeId1, adj1);
      adjustments.set(nodeId2, adj2);
    }
  });
  
  return adjustments;
}

/**
 * إيجاد موقع متاح لفرع جديد (تجنب التداخل)
 */
export function findAvailableSlot(
  parentElement: CanvasElement,
  siblingBounds: { top: number; bottom: number }[],
  newNodeHeight: number,
  verticalGap: number = 80
): number {
  const parentCenterY = parentElement.position.y + parentElement.size.height / 2;
  
  if (siblingBounds.length === 0) {
    return parentCenterY;
  }
  
  // ترتيب الأشقاء حسب الموقع
  const sorted = [...siblingBounds].sort((a, b) => a.top - b.top);
  
  // محاولة التوزيع المتناظر
  const totalSiblings = siblingBounds.length;
  const newIndex = totalSiblings;
  const direction = newIndex % 2 === 0 ? 1 : -1;
  const step = Math.ceil((newIndex + 1) / 2);
  
  let proposedY = parentCenterY + direction * step * (newNodeHeight + verticalGap);
  
  // التحقق من عدم التداخل مع الأشقاء
  const halfHeight = newNodeHeight / 2;
  let hasOverlap = true;
  let attempts = 0;
  
  while (hasOverlap && attempts < 20) {
    hasOverlap = false;
    const proposedTop = proposedY - halfHeight - verticalGap / 2;
    const proposedBottom = proposedY + halfHeight + verticalGap / 2;
    
    for (const sibling of sorted) {
      if (proposedBottom > sibling.top && proposedTop < sibling.bottom) {
        hasOverlap = true;
        if (direction > 0) {
          proposedY = sibling.bottom + halfHeight + verticalGap;
        } else {
          proposedY = sibling.top - halfHeight - verticalGap;
        }
        break;
      }
    }
    attempts++;
  }
  
  return proposedY;
}

/**
 * التحقق مما إذا كان أي جد للعقدة مطوياً
 * يُستخدم لإخفاء العقد والروابط التي يكون أي من أجدادها مطوياً
 */
export function isAncestorCollapsed(
  nodeId: string,
  elements: CanvasElement[]
): boolean {
  let currentId: string | null = nodeId;
  
  while (currentId) {
    // البحث عن الـ connector الذي ينتهي عند هذه العقدة
    const parentConnector = elements.find(el => 
      el.type === 'mindmap_connector' && 
      (el.data as MindMapConnectorData)?.endNodeId === currentId
    );
    
    if (!parentConnector) break; // وصلنا للجذر
    
    const parentNodeId = (parentConnector.data as MindMapConnectorData)?.startNodeId;
    const parentNode = elements.find(el => el.id === parentNodeId);
    
    // إذا كان أي جد مطوياً، أرجع true
    if ((parentNode?.data as any)?.isCollapsed) {
      return true;
    }
    
    currentId = parentNodeId || null;
  }
  
  return false;
}

/**
 * الحصول على جميع أحفاد عقدة معينة
 */
export function getAllDescendants(
  nodeId: string,
  elements: CanvasElement[]
): string[] {
  const descendants: string[] = [];
  
  const childConnectors = elements.filter(el => 
    el.type === 'mindmap_connector' && 
    (el.data as MindMapConnectorData)?.startNodeId === nodeId
  );
  
  childConnectors.forEach(conn => {
    const childId = (conn.data as MindMapConnectorData)?.endNodeId;
    if (childId) {
      descendants.push(childId);
      descendants.push(...getAllDescendants(childId, elements));
    }
  });
  
  return descendants;
}

/**
 * حساب ارتفاع الشجرة الفرعية لعقدة معينة (شاملة جميع الأحفاد)
 */
export function calculateSubtreeHeight(
  nodeId: string,
  elements: CanvasElement[],
  verticalGap: number = 80
): number {
  const node = elements.find(el => el.id === nodeId);
  if (!node) return 0;
  
  const childConnectors = elements.filter(el => 
    el.type === 'mindmap_connector' && 
    (el.data as MindMapConnectorData)?.startNodeId === nodeId
  );
  
  // إذا لم يكن هناك أطفال، ارتفاع الشجرة = ارتفاع العقدة
  if (childConnectors.length === 0) {
    return node.size.height;
  }
  
  // حساب مجموع ارتفاعات الأشجار الفرعية للأطفال
  let totalChildrenHeight = 0;
  childConnectors.forEach((conn, index) => {
    const childId = (conn.data as MindMapConnectorData)?.endNodeId;
    if (childId) {
      totalChildrenHeight += calculateSubtreeHeight(childId, elements, verticalGap);
      if (index < childConnectors.length - 1) {
        totalChildrenHeight += verticalGap;
      }
    }
  });
  
  // الارتفاع هو الأكبر بين ارتفاع العقدة ومجموع ارتفاعات الأطفال
  return Math.max(node.size.height, totalChildrenHeight);
}

/**
 * إعادة توزيع الفروع بشكل متناظر حول الأصل
 * - الفرع الأوسط (إذا كان العدد فردي) يكون على خط مستقيم مع الأصل
 * - الفروع توزع بالتساوي أعلى وأسفل
 */
export function redistributeBranches(
  parentId: string,
  elements: CanvasElement[],
  verticalGap: number = 80
): Map<string, { x: number; y: number }> {
  const adjustments = new Map<string, { x: number; y: number }>();
  
  // الحصول على العقدة الأب
  const parentNode = elements.find(el => el.id === parentId);
  if (!parentNode) return adjustments;
  
  // الحصول على جميع الأبناء المباشرين
  const childConnectors = elements.filter(el => 
    el.type === 'mindmap_connector' && 
    (el.data as MindMapConnectorData)?.startNodeId === parentId
  );
  
  if (childConnectors.length === 0) return adjustments;
  
  // جمع الأبناء مع ارتفاع شجرتهم الفرعية
  const children: { id: string; node: CanvasElement; subtreeHeight: number; connectorId: string }[] = [];
  
  childConnectors.forEach(conn => {
    const childId = (conn.data as MindMapConnectorData)?.endNodeId;
    const childNode = elements.find(el => el.id === childId);
    if (childNode) {
      const subtreeHeight = calculateSubtreeHeight(childId, elements, verticalGap);
      children.push({ 
        id: childId, 
        node: childNode, 
        subtreeHeight,
        connectorId: conn.id 
      });
    }
  });
  
  if (children.length === 0) return adjustments;
  
  const parentCenterY = parentNode.position.y + parentNode.size.height / 2;
  
  // حساب الارتفاع الكلي للفروع (مع المسافات بينها)
  const totalHeight = children.reduce((sum, c, index) => {
    return sum + c.subtreeHeight + (index < children.length - 1 ? verticalGap : 0);
  }, 0);
  
  // البدء من أعلى نقطة (بحيث يكون المركز في منتصف الأب)
  let currentY = parentCenterY - totalHeight / 2;
  
  // توزيع الأبناء متناظرياً
  children.forEach((child) => {
    // مركز الشجرة الفرعية لهذا الطفل
    const childSubtreeCenterY = currentY + child.subtreeHeight / 2;
    
    // حساب الموقع الجديد للعقدة (مركز العقدة = مركز شجرتها الفرعية)
    const newY = childSubtreeCenterY - child.node.size.height / 2;
    
    // حساب الفرق عن الموقع الحالي
    const deltaY = newY - child.node.position.y;
    
    // إضافة التعديل لهذه العقدة
    adjustments.set(child.id, {
      x: child.node.position.x,
      y: newY
    });
    
    // إضافة التعديلات لجميع أحفاد هذه العقدة
    const descendants = getAllDescendants(child.id, elements);
    descendants.forEach(descId => {
      const descNode = elements.find(el => el.id === descId);
      if (descNode) {
        adjustments.set(descId, {
          x: descNode.position.x,
          y: descNode.position.y + deltaY
        });
      }
    });
    
    // الانتقال للفرع التالي
    currentY += child.subtreeHeight + verticalGap;
  });
  
  return adjustments;
}

/**
 * إعادة توزيع الفروع بشكل تصاعدي (من العقدة المحددة إلى الجذر)
 * هذا يضمن أن تغيير فرع يؤثر على جميع الأجداد
 */
export function redistributeUpwards(
  nodeId: string,
  elements: CanvasElement[],
  verticalGap: number = 80
): Map<string, { x: number; y: number }> {
  const allAdjustments = new Map<string, { x: number; y: number }>();
  let currentId: string | null = nodeId;
  let currentElements = [...elements];
  
  while (currentId) {
    // إعادة توزيع فروع العقدة الحالية
    const adjustments = redistributeBranches(currentId, currentElements, verticalGap);
    
    // دمج التعديلات
    adjustments.forEach((pos, id) => {
      allAdjustments.set(id, pos);
    });
    
    // تطبيق التعديلات على نسخة العناصر للحسابات التالية
    currentElements = currentElements.map(el => {
      const adj = allAdjustments.get(el.id);
      if (adj) {
        return { ...el, position: adj };
      }
      return el;
    });
    
    // البحث عن الجد
    const parentConnector = elements.find(el => 
      el.type === 'mindmap_connector' && 
      (el.data as MindMapConnectorData)?.endNodeId === currentId
    );
    
    currentId = parentConnector 
      ? (parentConnector.data as MindMapConnectorData)?.startNodeId || null
      : null;
  }
  
  return allAdjustments;
}
