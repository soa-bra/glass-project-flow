// Command Types for Planning Board History System
export interface Command {
  id: string;
  type: CommandType;
  timestamp: number;
  userId?: string;
  data: any;
  description: string;
}

export type CommandType =
  | 'insert_element'
  | 'update_element'
  | 'delete_element'
  | 'move_element'
  | 'resize_element'
  | 'rotate_element'
  | 'style_element'
  | 'group_elements'
  | 'ungroup_elements'
  | 'duplicate_element'
  | 'insert_frame'
  | 'update_frame'
  | 'delete_frame'
  | 'create_layer'
  | 'update_layer'
  | 'delete_layer'
  | 'move_to_layer'
  | 'insert_connector'
  | 'update_connector'
  | 'delete_connector'
  | 'batch_update'
  | 'smart_conversion'
  | 'ai_generation';

export interface InsertElementCommand {
  type: 'insert_element';
  elementId: string;
  element: any;
  layerId?: string;
  frameId?: string;
}

export interface UpdateElementCommand {
  type: 'update_element';
  elementId: string;
  updates: any;
  previousState: any;
}

export interface DeleteElementCommand {
  type: 'delete_element';
  elementId: string;
  element: any;
}

export interface MoveElementCommand {
  type: 'move_element';
  elementId: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export interface BatchCommand {
  type: 'batch_update';
  commands: Command[];
  description: string;
}

export interface HistoryState {
  past: Command[];
  present: Command | null;
  future: Command[];
  maxHistorySize: number;
  canUndo: boolean;
  canRedo: boolean;
}

export interface UndoRedoAction {
  type: 'undo' | 'redo';
  command: Command;
}

export interface CommandExecutor {
  execute(command: Command): Promise<void>;
  undo(command: Command): Promise<void>;
  redo(command: Command): Promise<void>;
}