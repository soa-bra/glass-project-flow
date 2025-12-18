// Mind Map Canvas Types - Independent Nodes System
// كل عقدة عنصر مستقل على الكانفس

export interface MindMapNodeData {
  label: string;
  color: string;
  nodeStyle: 'rounded' | 'pill' | 'rectangle' | 'circle';
  isRoot?: boolean;
  isCollapsed?: boolean; // ✅ لطي/توسيع الفروع
  icon?: string;
  fontSize?: number;
  textColor?: string;
}

export interface MindMapConnectionAnchor {
  nodeId: string;
  anchor: 'top' | 'bottom' | 'left' | 'right' | 'center';
  position?: { x: number; y: number }; // مخزنة بالنسبة للعنصر
}

export interface MindMapConnectorData {
  startNodeId: string;
  endNodeId: string;
  startAnchor: MindMapConnectionAnchor;
  endAnchor: MindMapConnectionAnchor;
  curveStyle: 'bezier' | 'straight' | 'elbow';
  color: string;
  strokeWidth: number;
  label?: string;
  labelPosition?: number; // 0-1 على المسار
}

// نقاط الربط على العقدة
export interface NodeAnchorPoint {
  id: string;
  nodeId: string;
  anchor: 'top' | 'bottom' | 'left' | 'right';
  position: { x: number; y: number }; // إحداثيات الشاشة
}

// حالة السحب للتوصيل
export interface MindMapDragState {
  isDragging: boolean;
  sourceNodeId: string | null;
  sourceAnchor: 'top' | 'bottom' | 'left' | 'right' | null;
  currentPosition: { x: number; y: number } | null;
  nearestAnchor: NodeAnchorPoint | null;
}

// ألوان العقد المتاحة
export const NODE_COLORS = [
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
export const NODE_STYLES: { id: MindMapNodeData['nodeStyle']; label: string }[] = [
  { id: 'rounded', label: 'مستدير الزوايا' },
  { id: 'pill', label: 'كبسولة' },
  { id: 'rectangle', label: 'مستطيل' },
  { id: 'circle', label: 'دائري' },
];

// أنماط الروابط
export const CONNECTOR_STYLES: { id: MindMapConnectorData['curveStyle']; label: string }[] = [
  { id: 'bezier', label: 'منحني' },
  { id: 'straight', label: 'مستقيم' },
  { id: 'elbow', label: 'متعرج' },
];

// حساب موقع نقطة الربط على العقدة
export const getAnchorPosition = (
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
export type AnchorDirection = 'top' | 'bottom' | 'left' | 'right';

// حساب أقرب نقطة ربط على عقدة من نقطة معينة
export const findNearestAnchor = (
  point: { x: number; y: number },
  nodePosition: { x: number; y: number },
  nodeSize: { width: number; height: number }
): { anchor: AnchorDirection; position: { x: number; y: number }; distance: number } => {
  const anchors: AnchorDirection[] = ['top', 'bottom', 'left', 'right'];
  
  let nearestAnchor: AnchorDirection = 'top';
  let nearestPosition = getAnchorPosition(nodePosition, nodeSize, 'top');
  let nearestDistance = Infinity;
  
  for (const anchor of anchors) {
    const pos = getAnchorPosition(nodePosition, nodeSize, anchor);
    const distance = Math.hypot(point.x - pos.x, point.y - pos.y);
    
    if (distance < nearestDistance) {
      nearestAnchor = anchor;
      nearestPosition = pos;
      nearestDistance = distance;
    }
  }
  
  return { anchor: nearestAnchor, position: nearestPosition, distance: nearestDistance };
};

// إنشاء مسار Bezier بين نقطتين - محسّن للمنحنيات السلسة
export const createBezierPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  startAnchor: 'top' | 'bottom' | 'left' | 'right',
  endAnchor: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  
  // ✅ حساب محسّن للـ controlOffset للحصول على منحنيات سلسة
  // القيمة تعتمد على المسافة بين النقطتين مع حد أدنى لضمان الانحناء
  const controlOffset = Math.max(
    distance * 0.4,  // 40% من المسافة
    60,              // حد أدنى 60px
    Math.min(Math.abs(dx), Math.abs(dy)) * 0.5  // نصف أقصر بُعد
  );
  
  // حساب نقاط التحكم بناءً على اتجاه الربط
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
export const createStraightPath = (
  start: { x: number; y: number },
  end: { x: number; y: number }
): string => {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
};

// إنشاء مسار متعرج (Elbow)
export const createElbowPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  startAnchor: 'top' | 'bottom' | 'left' | 'right',
  endAnchor: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // تحديد مسار متعرج بناءً على اتجاه البداية والنهاية
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

// ✅ حساب bounds الحقيقي للـ connector بناءً على مواقع العقدتين
export const calculateConnectorBounds = (
  startNode: { position: { x: number; y: number }; size: { width: number; height: number } } | undefined,
  endNode: { position: { x: number; y: number }; size: { width: number; height: number } } | undefined,
  padding: number = 50
): { position: { x: number; y: number }; size: { width: number; height: number } } => {
  if (!startNode || !endNode) {
    return { position: { x: 0, y: 0 }, size: { width: 100, height: 100 } };
  }
  
  // حساب نقاط الربط
  const startPos = getAnchorPosition(startNode.position, startNode.size, 'right');
  const endPos = getAnchorPosition(endNode.position, endNode.size, 'left');
  
  // حساب الـ bounding box
  const minX = Math.min(startPos.x, endPos.x) - padding;
  const minY = Math.min(startPos.y, endPos.y) - padding;
  const maxX = Math.max(startPos.x, endPos.x) + padding;
  const maxY = Math.max(startPos.y, endPos.y) + padding;
  
  return {
    position: { x: minX, y: minY },
    size: { width: maxX - minX, height: maxY - minY }
  };
};
