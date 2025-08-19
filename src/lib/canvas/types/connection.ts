// Connection and Link Types

export interface ConnectionPoint {
  x: number;
  y: number;
  nodeId: string;
  side: 'top' | 'bottom' | 'left' | 'right';
}

export interface Connection {
  id: string;
  fromPoint: ConnectionPoint;
  toPoint: ConnectionPoint;
  path: ConnectionPath;
  style: ConnectionStyle;
  title?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ConnectionPath {
  type: 'orthogonal' | 'curved' | 'straight';
  points: Array<{ x: number; y: number }>;
  nodes?: Array<{ x: number; y: number; id: string }>; // Editable nodes
}

export interface ConnectionStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  markerStart?: string;
  markerEnd?: string;
}

export interface AnchorPoint {
  id: string;
  position: { x: number; y: number };
  side: 'top' | 'bottom' | 'left' | 'right';
  nodeId: string;
  active: boolean;
}

export interface LinkData {
  id: string;
  board_id: string;
  from_object_id: string;
  to_object_id: string;
  style?: any; // JSON type from Supabase
  label?: string | null;
  created_by: string;
  created_at: string;
}

// Connection state management
export interface ConnectionState {
  activeConnection: Connection | null;
  pendingConnection: {
    fromPoint: ConnectionPoint | null;
    tempPath: Array<{ x: number; y: number }>;
  } | null;
  connections: Map<string, Connection>;
  anchorPoints: Map<string, AnchorPoint[]>; // nodeId -> anchor points
  selectedConnectionId: string | null;
}

export interface ConnectionEvent {
  type: 'connection-created' | 'connection-updated' | 'connection-deleted' | 'anchor-hover' | 'anchor-click';
  connectionId?: string;
  anchorId?: string;
  connection?: Connection;
  data?: any;
}