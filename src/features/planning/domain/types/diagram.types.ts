// Visual Diagram Canvas Types - Independent Nodes System
// كل عقدة عنصر مستقل على الكانفس - مخطط بصري

export interface VisualNodeData {
  label: string;
  color: string;
  nodeStyle: 'rounded' | 'pill' | 'rectangle' | 'circle';
  isRoot?: boolean;
  isCollapsed?: boolean;
  icon?: string;
  fontSize?: number;
  textColor?: string;
  diagramType: 'visual_diagram'; // لتمييزه عن الخريطة الذهنية
}

export interface VisualConnectionAnchor {
  nodeId: string;
  anchor: 'top' | 'bottom' | 'left' | 'right' | 'center';
  position?: { x: number; y: number };
}

export interface VisualConnectorData {
  startNodeId: string;
  endNodeId: string;
  startAnchor: VisualConnectionAnchor;
  endAnchor: VisualConnectionAnchor;
  curveStyle: 'bezier' | 'straight' | 'elbow';
  color: string;
  strokeWidth: number;
  label?: string;
  labelPosition?: number;
  diagramType: 'visual_diagram';
}

// نقاط الربط على العقدة
export interface VisualAnchorPoint {
  id: string;
  nodeId: string;
  anchor: 'top' | 'bottom' | 'left' | 'right';
  position: { x: number; y: number };
}

// حالة السحب للتوصيل
export interface VisualDragState {
  isDragging: boolean;
  sourceNodeId: string | null;
  sourceAnchor: 'top' | 'bottom' | 'left' | 'right' | null;
  currentPosition: { x: number; y: number } | null;
  nearestAnchor: VisualAnchorPoint | null;
}

// ألوان العقد المتاحة
export const VISUAL_NODE_COLORS = [
  '#3DA8F5', // أزرق
  '#3DBE8B', // أخضر
  '#F6C445', // أصفر
  '#E5564D', // أحمر
  '#9B59B6', // بنفسجي
  '#1ABC9C', // تركواز
  '#E67E22', // برتقالي
  '#34495E', // رمادي داكن
];

// أنماط العقد
export const VISUAL_NODE_STYLES: { id: VisualNodeData['nodeStyle']; label: string }[] = [
  { id: 'rounded', label: 'مستدير الزوايا' },
  { id: 'pill', label: 'كبسولة' },
  { id: 'rectangle', label: 'مستطيل' },
  { id: 'circle', label: 'دائري' },
];

// أنماط الروابط
export const VISUAL_CONNECTOR_STYLES: { id: VisualConnectorData['curveStyle']; label: string }[] = [
  { id: 'bezier', label: 'منحني' },
  { id: 'straight', label: 'مستقيم' },
  { id: 'elbow', label: 'متعرج' },
];

// حساب موقع نقطة الربط على العقدة
export const getVisualAnchorPosition = (
  nodePosition: { x: number; y: number },
  nodeSize: { width: number; height: number },
  anchor: 'top' | 'bottom' | 'left' | 'right' | 'center'
): { x: number; y: number } => {
  const { x, y } = nodePosition;
  const { width, height } = nodeSize;
  
  switch (anchor) {
    case 'top':
      return { x: x + width / 2, y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'center':
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
};

// نوع نقاط الربط الأربع
export type VisualAnchorDirection = 'top' | 'bottom' | 'left' | 'right';

// حساب أقرب نقطة ربط على عقدة من نقطة معينة
export const findNearestVisualAnchor = (
  point: { x: number; y: number },
  nodePosition: { x: number; y: number },
  nodeSize: { width: number; height: number }
): { anchor: VisualAnchorDirection; position: { x: number; y: number }; distance: number } => {
  const anchors: VisualAnchorDirection[] = ['top', 'bottom', 'left', 'right'];
  
  let nearestAnchor: VisualAnchorDirection = 'top';
  let nearestPosition = getVisualAnchorPosition(nodePosition, nodeSize, 'top');
  let nearestDistance = Infinity;
  
  for (const anchor of anchors) {
    const pos = getVisualAnchorPosition(nodePosition, nodeSize, anchor);
    const distance = Math.hypot(point.x - pos.x, point.y - pos.y);
    
    if (distance < nearestDistance) {
      nearestAnchor = anchor;
      nearestPosition = pos;
      nearestDistance = distance;
    }
  }
  
  return { anchor: nearestAnchor, position: nearestPosition, distance: nearestDistance };
};

// إنشاء مسار Bezier بين نقطتين
export const createVisualBezierPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  startAnchor: 'top' | 'bottom' | 'left' | 'right',
  endAnchor: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  
  const controlOffset = Math.max(
    distance * 0.4,
    60,
    Math.min(Math.abs(dx), Math.abs(dy)) * 0.5
  );
  
  let cp1: { x: number; y: number };
  let cp2: { x: number; y: number };
  
  switch (startAnchor) {
    case 'top':
      cp1 = { x: start.x, y: start.y - controlOffset };
      break;
    case 'bottom':
      cp1 = { x: start.x, y: start.y + controlOffset };
      break;
    case 'left':
      cp1 = { x: start.x - controlOffset, y: start.y };
      break;
    case 'right':
      cp1 = { x: start.x + controlOffset, y: start.y };
      break;
  }
  
  switch (endAnchor) {
    case 'top':
      cp2 = { x: end.x, y: end.y - controlOffset };
      break;
    case 'bottom':
      cp2 = { x: end.x, y: end.y + controlOffset };
      break;
    case 'left':
      cp2 = { x: end.x - controlOffset, y: end.y };
      break;
    case 'right':
      cp2 = { x: end.x + controlOffset, y: end.y };
      break;
  }
  
  return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
};

// إنشاء مسار مستقيم
export const createVisualStraightPath = (
  start: { x: number; y: number },
  end: { x: number; y: number }
): string => {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
};

// إنشاء مسار متعرج (Elbow)
export const createVisualElbowPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  startAnchor: 'top' | 'bottom' | 'left' | 'right',
  endAnchor: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  const isStartHorizontal = startAnchor === 'left' || startAnchor === 'right';
  const isEndHorizontal = endAnchor === 'left' || endAnchor === 'right';
  
  if (isStartHorizontal && isEndHorizontal) {
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  } else if (!isStartHorizontal && !isEndHorizontal) {
    return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
  } else if (isStartHorizontal) {
    return `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y}`;
  } else {
    return `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`;
  }
};

// حساب bounds الحقيقي للـ connector
export const calculateVisualConnectorBounds = (
  startNode: { position: { x: number; y: number }; size: { width: number; height: number } } | undefined,
  endNode: { position: { x: number; y: number }; size: { width: number; height: number } } | undefined,
  padding: number = 50
): { position: { x: number; y: number }; size: { width: number; height: number } } => {
  if (!startNode || !endNode) {
    return { position: { x: 0, y: 0 }, size: { width: 100, height: 100 } };
  }
  
  const startPos = getVisualAnchorPosition(startNode.position, startNode.size, 'right');
  const endPos = getVisualAnchorPosition(endNode.position, endNode.size, 'left');
  
  const minX = Math.min(startPos.x, endPos.x) - padding;
  const minY = Math.min(startPos.y, endPos.y) - padding;
  const maxX = Math.max(startPos.x, endPos.x) + padding;
  const maxY = Math.max(startPos.y, endPos.y) + padding;
  
  return {
    position: { x: minX, y: minY },
    size: { width: maxX - minX, height: maxY - minY }
  };
};
