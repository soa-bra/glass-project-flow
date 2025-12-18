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
  
  // بناء الشجرة بشكل تكراري مع منع الدورات
  const visited = new Set<string>();
  
  function buildNode(element: CanvasElement, depth: number, parent: LayoutNode | null): LayoutNode | null {
    // ✅ منع الدورات اللانهائية
    if (visited.has(element.id)) {
      return null;
    }
    visited.add(element.id);
    
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
      .filter((n): n is CanvasElement => n !== undefined && !visited.has(n.id))
      .map(childElement => buildNode(childElement, depth + 1, node))
      .filter((n): n is LayoutNode => n !== null);
    
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
