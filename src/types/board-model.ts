/**
 * Board Model Layer - النموذج الأساسي للوحة
 * Sprint 1: توحيد Board Model وإقفال أساسيات الكانفس
 */

// ============= الأنواع الأساسية =============

export interface BoardPosition {
  x: number;
  y: number;
}

export interface BoardSize {
  width: number;
  height: number;
}

export interface BoardBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============= أنواع العناصر =============

export type BoardElementType = 
  | 'text'
  | 'shape'
  | 'image'
  | 'frame'
  | 'document'
  | 'sticky'
  | 'drawing'
  | 'connector'
  | 'workflow_node'
  | 'workflow_edge'
  | 'mindmap_node'
  | 'mindmap_connector'
  | 'smart';

// ============= العنصر الأساسي =============

export interface BoardElement {
  id: string;
  type: BoardElementType;
  position: BoardPosition;
  size: BoardSize;
  rotation?: number;
  style?: BoardElementStyle;
  data?: Record<string, unknown>;
  content?: string;
  locked?: boolean;
  hidden?: boolean;
  visible?: boolean;
  zIndex: number;
  parentId?: string;
  layerId?: string;
  metadata?: BoardElementMetadata;
  
  // للتوافق مع الكود الحالي
  shapeType?: string;
  children?: string[];
  title?: string;
}

export interface BoardElementStyle {
  backgroundColor?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  color?: string;
  fontSize?: number | string;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  textDecoration?: string;
  direction?: 'rtl' | 'ltr';
  alignItems?: string;
  border?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  padding?: number;
  margin?: number;
  opacity?: number;
  transform?: string;
  boxShadow?: string;
  [key: string]: unknown;
}

export interface BoardElementMetadata {
  groupId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  version?: number;
  tags?: string[];
  [key: string]: unknown;
}

// ============= الروابط =============

export interface BoardLink {
  id: string;
  fromElementId: string;
  toElementId: string;
  fromAnchor?: AnchorPoint;
  toAnchor?: AnchorPoint;
  style?: BoardLinkStyle;
  label?: string;
  data?: Record<string, unknown>;
}

export type AnchorPoint = 
  | 'center' 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface BoardLinkStyle {
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  arrowStart?: boolean;
  arrowEnd?: boolean;
  curved?: boolean;
}

// ============= الطبقات =============

export interface BoardLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  opacity?: number;
  elements: string[];
  order: number;
}

// ============= إعدادات اللوحة =============

export interface BoardSettings {
  zoom: number;
  pan: BoardPosition;
  gridEnabled: boolean;
  gridSize: number;
  gridType: 'dots' | 'grid' | 'isometric' | 'hex';
  snapToGrid: boolean;
  snapToEdges: boolean;
  snapToCenter: boolean;
  snapToDistribution: boolean;
  background: string;
  theme: 'light' | 'dark';
}

// ============= البيانات الوصفية للوحة =============

export interface BoardMetadata {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  version: number;
  thumbnail?: string;
  tags?: string[];
  isPublic?: boolean;
}

// ============= نموذج اللوحة الكامل =============

export interface BoardModel {
  metadata: BoardMetadata;
  elements: BoardElement[];
  links: BoardLink[];
  layers: BoardLayer[];
  settings: BoardSettings;
}

// ============= أنواع العمليات (Operations) =============

export type BoardOpType = 
  | 'add'
  | 'update'
  | 'delete'
  | 'move'
  | 'resize'
  | 'rotate'
  | 'reorder'
  | 'group'
  | 'ungroup'
  | 'lock'
  | 'unlock'
  | 'style';

export interface BoardOp {
  id: string;
  type: BoardOpType;
  elementId: string;
  payload: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  
  // للتراجع والإعادة
  previousState?: Partial<BoardElement>;
}

export interface BoardOpBatch {
  id: string;
  ops: BoardOp[];
  timestamp: number;
  description?: string;
}

// ============= أحداث اللوحة =============

export type BoardEventType = 
  | 'element:added'
  | 'element:updated'
  | 'element:deleted'
  | 'element:moved'
  | 'element:resized'
  | 'element:selected'
  | 'element:deselected'
  | 'layer:added'
  | 'layer:updated'
  | 'layer:deleted'
  | 'link:added'
  | 'link:deleted'
  | 'viewport:changed'
  | 'history:undo'
  | 'history:redo';

export interface BoardEvent {
  type: BoardEventType;
  elementId?: string;
  data: Record<string, unknown>;
  timestamp: number;
}

// ============= تصنيفات العناصر الخاصة =============

// Frame Element
export interface BoardFrameElement extends BoardElement {
  type: 'frame';
  children: string[];
  title?: string;
  frameStyle?: 'rectangle' | 'rounded' | 'circle';
}

// Document Element
export interface BoardDocumentElement extends BoardElement {
  type: 'document';
  data: {
    sourceUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    page?: number;
    pageCount?: number;
    status?: 'draft' | 'pending' | 'approved' | 'rejected';
    extractedText?: string;
    thumbnailUrl?: string;
  };
}

// Text Element
export interface BoardTextElement extends BoardElement {
  type: 'text';
  content: string;
  data?: {
    textType?: 'line' | 'box' | 'attached';
    attachedTo?: string;
    relativePosition?: BoardPosition;
  };
}

// Shape Element
export interface BoardShapeElement extends BoardElement {
  type: 'shape';
  shapeType: string;
  data?: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    arrowData?: Record<string, unknown>;
  };
}

// Workflow Node Element
export interface BoardWorkflowNodeElement extends BoardElement {
  type: 'workflow_node';
  data: {
    nodeType: 'process_step' | 'task_stage' | 'decision' | 'start' | 'end';
    label: string;
    status?: 'idle' | 'active' | 'done' | 'blocked' | 'overdue';
    assignees?: string[];
    dueDate?: string;
    tasks?: WorkflowTask[];
    conditions?: WorkflowCondition[];
    actions?: WorkflowAction[];
  };
}

// Workflow Edge Element
export interface BoardWorkflowEdgeElement extends BoardElement {
  type: 'workflow_edge';
  data: {
    fromNodeId: string;
    toNodeId: string;
    label?: string;
    conditions?: WorkflowCondition[];
    actions?: WorkflowAction[];
  };
}

// ============= أنواع Workflow الفرعية =============

export interface WorkflowTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee?: string;
  dueDate?: string;
}

export interface WorkflowCondition {
  id: string;
  type: 'field' | 'expression' | 'document_status';
  field?: string;
  operator?: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
  value?: unknown;
  expression?: string;
}

export interface WorkflowAction {
  id: string;
  type: 'notify' | 'assign' | 'update_field' | 'create_task' | 'webhook';
  config: Record<string, unknown>;
}

// ============= الدوال المساعدة =============

export const createDefaultBoardSettings = (): BoardSettings => ({
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridEnabled: true,
  gridSize: 20,
  gridType: 'grid',
  snapToGrid: false,
  snapToEdges: true,
  snapToCenter: true,
  snapToDistribution: false,
  background: '#FFFFFF',
  theme: 'light'
});

export const createDefaultBoardMetadata = (title: string = 'لوحة جديدة'): BoardMetadata => ({
  id: '',
  title,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  isPublic: false
});

export const createDefaultBoardLayer = (id: string, name: string = 'الطبقة الافتراضية'): BoardLayer => ({
  id,
  name,
  visible: true,
  locked: false,
  elements: [],
  order: 0
});

export const createEmptyBoard = (title: string = 'لوحة جديدة'): BoardModel => ({
  metadata: createDefaultBoardMetadata(title),
  elements: [],
  links: [],
  layers: [createDefaultBoardLayer('default')],
  settings: createDefaultBoardSettings()
});
