import { Point } from '../types';

export interface ConnectionPoint {
  x: number;
  y: number;
  nodeId: string;
  side: string;
}

export interface AnchorPoint {
  id: string;
  position: Point;
  side: 'top' | 'bottom' | 'left' | 'right';
  nodeId: string;
  active: boolean;
}

export interface Connection {
  id: string;
  fromPoint: ConnectionPoint;
  toPoint: ConnectionPoint;
  path: {
    type: string;
    points: Point[];
    nodes?: any[];
  };
  style: {
    stroke: string;
    strokeWidth: number;
    markerEnd?: string;
    strokeDasharray?: string;
  };
  title?: string;
  notes?: string;
}

export interface ConnectionState {
  activeConnection: string | null;
  pendingConnection: {
    fromPoint?: ConnectionPoint;
    tempPath: Point[];
  } | null;
  connections: Map<string, Connection>;
  anchorPoints: Map<string, AnchorPoint[]>;
  selectedConnectionId: string | null;
}

export interface ConnectionEvent {
  type: string;
  anchorId?: string;
  connectionId?: string;
  connection?: Connection;
  data?: any;
}

export interface LinkData {
  id: string;
  board_id: string;
  from_object_id: string;
  to_object_id: string;
  label?: string;
  style?: any;
  created_by: string;
}