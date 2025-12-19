// Proper TypeScript interfaces for Canvas Elements

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  border?: string;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  opacity?: number;
  transform?: string;
  zIndex?: number;
}

export interface CanvasElementBase {
  id: string;
  type: string;
  position: CanvasPosition;
  size: CanvasSize;
  style?: CanvasStyle;
  content?: string;
  locked?: boolean;
  visible?: boolean;
  layerId?: string;
  metadata?: Record<string, unknown>;
}

export interface CanvasTextElement extends CanvasElementBase {
  type: 'text';
  content: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface CanvasShapeElement extends CanvasElementBase {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'line';
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
}

export interface CanvasImageElement extends CanvasElementBase {
  type: 'image';
  src: string;
  alt?: string;
}

export interface CanvasStickyElement extends CanvasElementBase {
  type: 'sticky';
  content: string;
  color?: string;
}

export interface CanvasSmartElement extends CanvasElementBase {
  type: 'smart';
  smartType: 'thinking_board' | 'kanban' | 'voting' | 'brainstorming' | 'timeline' 
    | 'decisions_matrix' | 'gantt' | 'interactive_sheet' | 'mind_map' 
    | 'project_card' | 'finance_card' | 'csr_card' | 'crm_card' | 'root_connector';
  data: any;
}

// Workflow Node Element
export interface CanvasWorkflowNodeElement extends CanvasElementBase {
  type: 'workflow_node';
  nodeType: 'start' | 'end' | 'process_step' | 'task_stage' | 'decision' | 'approval' | 'notification' | 'delay' | 'parallel' | 'merge';
  label: string;
  description?: string;
  assignees?: string[];
  dueDate?: string;
  status?: 'idle' | 'active' | 'completed' | 'blocked' | 'skipped';
  workflowId?: string;
  conditions?: Array<{
    id: string;
    type: 'document_status' | 'task_complete' | 'approval' | 'custom';
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
    targetElementId?: string;
  }>;
  actions?: Array<{
    id: string;
    type: 'notify' | 'assign' | 'update_status' | 'create_task' | 'send_email' | 'webhook' | 'custom';
    config: Record<string, any>;
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    assignee?: string;
  }>;
}

// Workflow Edge Element
export interface CanvasWorkflowEdgeElement extends CanvasElementBase {
  type: 'workflow_edge';
  fromNodeId: string;
  toNodeId: string;
  fromAnchor?: 'top' | 'right' | 'bottom' | 'left';
  toAnchor?: 'top' | 'right' | 'bottom' | 'left';
  label?: string;
  edgeType?: 'default' | 'conditional' | 'parallel' | 'loop';
  pathType?: 'straight' | 'curved' | 'orthogonal';
  animated?: boolean;
  workflowId?: string;
  condition?: {
    id: string;
    expression: string;
    label?: string;
  };
}

export interface CanvasFrameElement extends CanvasElementBase {
  type: 'frame';
  title?: string;
  childrenIds?: string[];
  frameStyle?: 'rectangle' | 'rounded' | 'circle';
  strokeWidth?: number;
  strokeColor?: string;
}

export interface CanvasFileElement extends CanvasElementBase {
  type: 'file';
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  thumbnailUrl?: string;
}

export type CanvasElementType = 
  | CanvasTextElement 
  | CanvasShapeElement 
  | CanvasImageElement 
  | CanvasStickyElement 
  | CanvasSmartElement
  | CanvasFrameElement
  | CanvasFileElement
  | CanvasWorkflowNodeElement
  | CanvasWorkflowEdgeElement
  | CanvasElementBase;

export interface CanvasEventHandlers {
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: Partial<CanvasElementType>) => void;
  onElementDelete?: (elementId: string) => void;
  onElementMove?: (elementId: string, position: CanvasPosition) => void;
  onElementResize?: (elementId: string, size: CanvasSize) => void;
}

export interface CanvasToolSettings {
  selectedTool: string;
  brushSize: number;
  color: string;
  opacity: number;
}

export interface CanvasViewportSettings {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}