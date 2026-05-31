/**
 * خوارزميات التخطيط التلقائي للمخطط البصري
 */

import type { CanvasElement } from '@/types/canvas';
import type { VisualConnectorData } from '@/types/visual-diagram-canvas';
import { getVisualAnchorPosition } from '@/types/visual-diagram-canvas';

// نظام الإعدادات
export interface VisualLayoutSettings {
  orientation: 'horizontal' | 'vertical';
  symmetry: 'symmetric' | 'unilateral';
  direction: 'rtl' | 'ltr';
}

export const DEFAULT_VISUAL_LAYOUT_SETTINGS: VisualLayoutSettings = {
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
  side?: 'primary' | 'secondary';
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
  
  connectors.forEach(conn => {
    const data = conn.data as VisualConnectorData;
    if (!data.startNodeId || !data.endNodeId) return;
    
    if (!childrenMap.has(data.startNodeId)) {
      childrenMap.set(data.startNodeId, []);
    }
    childrenMap.get(data.startNodeId)!.push(data.endNodeId);
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
        const childSide = side || (index % 2 === 0 ? 'primary' : 'secondary');
        return buildNode(childElement, depth + 1, node, childSide);
      })
      .filter((n): n is LayoutNode => n !== null);
    
    return node;
  }
  
  return buildNode(rootNode, 0, null);
}

function calcLayoutSubtreeHeight(node: LayoutNode, spacing: number): number {
  if (node.children.length === 0) {
    return node.element.size.height;
  }
  
  const childrenHeight = node.children.reduce((sum, child) => 
    sum + calcLayoutSubtreeHeight(child, spacing) + spacing, -spacing);
  
  return Math.max(node.element.size.height, childrenHeight);
}

function calcLayoutSubtreeWidth(node: LayoutNode, spacing: number): number {
  if (node.children.length === 0) {
    return node.element.size.width;
  }
  
  const childrenWidth = node.children.reduce((sum, child) => 
    sum + calcLayoutSubtreeWidth(child, spacing) + spacing, -spacing);
  
  return Math.max(node.element.size.width, childrenWidth);
}

function calculateHorizontalUnilateralLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: VisualLayoutSettings,
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

function calculateHorizontalSymmetricLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: VisualLayoutSettings,
  horizontalSpacing: number = 250,
  verticalSpacing: number = 100
): LayoutResult[] {
  const results: LayoutResult[] = [];
  const isRTL = settings.direction === 'rtl';
  
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
    
    const subtreeHeights = children.map(child => calcLayoutSubtreeHeight(child, verticalSpacing));
    const totalHeight = subtreeHeights.reduce((sum, h) => sum + h + verticalSpacing, -verticalSpacing);
    
    let currentY = startY - totalHeight / 2 + subtreeHeights[0] / 2;
    
    const directionMultiplier = isPrimary 
      ? (isRTL ? 1 : -1)
      : (isRTL ? -1 : 1);
    
    const childX = startX + directionMultiplier * (root.element.size.width / 2 + horizontalSpacing);
    
    children.forEach((child, index) => {
      layoutBranch(child, childX, currentY, directionMultiplier);
      
      if (index < children.length - 1) {
        currentY += subtreeHeights[index] / 2 + verticalSpacing + subtreeHeights[index + 1] / 2;
      }
    });
  }
  
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

function calculateVerticalUnilateralLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: VisualLayoutSettings,
  horizontalSpacing: number = 150,
  verticalSpacing: number = 120
): LayoutResult[] {
  const results: LayoutResult[] = [];
  const isTopDown = settings.direction === 'rtl';
  
  function layoutNode(node: LayoutNode, x: number, y: number): void {
    results.push({
      nodeId: node.id,
      position: { x, y }
    });
    
    if (node.children.length === 0) return;
    
    const subtreeWidths = node.children.map(child => calcLayoutSubtreeWidth(child, horizontalSpacing));
    const totalWidth = subtreeWidths.reduce((sum, w) => sum + w + horizontalSpacing, -horizontalSpacing);
    
    let currentX = x - totalWidth / 2 + subtreeWidths[0] / 2;
    
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

function calculateVerticalSymmetricLayout(
  root: LayoutNode,
  startX: number,
  startY: number,
  settings: VisualLayoutSettings,
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

function getAnchorsForLayout(
  settings: VisualLayoutSettings,
  isSecondary: boolean = false
): { startAnchor: 'top' | 'bottom' | 'left' | 'right'; endAnchor: 'top' | 'bottom' | 'left' | 'right' } {
  if (settings.orientation === 'horizontal') {
    if (settings.symmetry === 'symmetric' && isSecondary) {
      return settings.direction === 'rtl'
        ? { startAnchor: 'left', endAnchor: 'right' }
        : { startAnchor: 'right', endAnchor: 'left' };
    }
    return settings.direction === 'rtl'
      ? { startAnchor: 'right', endAnchor: 'left' }
      : { startAnchor: 'left', endAnchor: 'right' };
  } else {
    if (settings.symmetry === 'symmetric' && isSecondary) {
      return settings.direction === 'rtl'
        ? { startAnchor: 'top', endAnchor: 'bottom' }
        : { startAnchor: 'bottom', endAnchor: 'top' };
    }
    return settings.direction === 'rtl'
      ? { startAnchor: 'bottom', endAnchor: 'top' }
      : { startAnchor: 'top', endAnchor: 'bottom' };
  }
}

/**
 * تطبيق التخطيط على المخطط البصري
 */
export function applyVisualDiagramLayout(
  settings: VisualLayoutSettings,
  allElements: CanvasElement[],
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
): void {
  const nodes = allElements.filter(el => el.type === 'visual_node');
  const connectors = allElements.filter(el => el.type === 'visual_connector');
  
  if (nodes.length === 0) return;
  
  const centerX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
  const centerY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length;
  
  const tree = buildTree(nodes, connectors);
  if (!tree) return;
  
  let results: LayoutResult[] = [];
  
  const nodeSideMap = new Map<string, 'primary' | 'secondary'>();
  
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
  
  // تحديث مواقع العقد
  results.forEach(result => {
    updateElement(result.nodeId, {
      position: result.position
    });
  });
  
  // إنشاء خريطة للمواقع الجديدة
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
  
  // تحديث الـ connectors
  connectors.forEach(connector => {
    const connectorData = connector.data as VisualConnectorData;
    
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
      
      // تحديد إذا كان الـ connector في الجانب الثانوي
      const childSide = nodeSideMap.get(connectorData.endNodeId);
      const isSecondary = childSide === 'secondary';
      
      // الحصول على الـ anchors المناسبة
      const { startAnchor, endAnchor } = getAnchorsForLayout(settings, isSecondary);
      
      const startPos = getVisualAnchorPosition(startInfo.position, startInfo.size, startAnchor);
      const endPos = getVisualAnchorPosition(endInfo.position, endInfo.size, endAnchor);
      
      const padding = 50;
      const minX = Math.min(startPos.x, endPos.x) - padding;
      const minY = Math.min(startPos.y, endPos.y) - padding;
      const maxX = Math.max(startPos.x, endPos.x) + padding;
      const maxY = Math.max(startPos.y, endPos.y) + padding;
      
      updateElement(connector.id, {
        position: { x: minX, y: minY },
        size: { width: maxX - minX, height: maxY - minY },
        data: {
          ...connectorData,
          startAnchor: { ...connectorData.startAnchor, anchor: startAnchor },
          endAnchor: { ...connectorData.endAnchor, anchor: endAnchor }
        }
      });
    }
  });
}

/**
 * التحقق من طي الجد - للمخطط البصري
 */
export function isVisualAncestorCollapsed(
  nodeId: string,
  elements: CanvasElement[]
): boolean {
  const connectors = elements.filter(el => el.type === 'visual_connector');
  const nodes = elements.filter(el => el.type === 'visual_node');
  
  // إيجاد الـ parent
  const parentConnector = connectors.find(conn => {
    const data = conn.data as VisualConnectorData;
    return data.endNodeId === nodeId;
  });
  
  if (!parentConnector) return false;
  
  const parentId = (parentConnector.data as VisualConnectorData).startNodeId;
  const parentNode = nodes.find(n => n.id === parentId);
  
  if (!parentNode) return false;
  
  // إذا كان الأب مطوياً
  if ((parentNode.data as any)?.isCollapsed) {
    return true;
  }
  
  // التحقق من الأجداد
  return isVisualAncestorCollapsed(parentId, elements);
}
