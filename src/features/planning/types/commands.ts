// ===============================
// Commands Types - Planning Board
// أنواع أوامر وإجراءات لوحة التخطيط
// ===============================

import { CanvasElement, Position, Size, Transform, ElementStyle } from './canvas';

// Base command interface
export interface BaseCommand {
  id: string;
  type: CommandType;
  timestamp: number;
  userId: string;
  description: string;
  data: Record<string, any>;
}

export type CommandType = 
  | 'create-element'
  | 'update-element'
  | 'delete-element'
  | 'move-element'
  | 'resize-element'
  | 'style-element'
  | 'group-elements'
  | 'ungroup-elements'
  | 'create-frame'
  | 'update-frame'
  | 'delete-frame'
  | 'create-connector'
  | 'update-connector'
  | 'delete-connector'
  | 'viewport-change'
  | 'grid-change'
  | 'layer-change'
  | 'batch-operation';

// Element Commands
export interface CreateElementCommand extends BaseCommand {
  type: 'create-element';
  data: {
    element: CanvasElement;
    position?: Position;
    parentId?: string;
  };
}

export interface UpdateElementCommand extends BaseCommand {
  type: 'update-element';
  data: {
    elementId: string;
    changes: Partial<CanvasElement>;
    oldValues: Partial<CanvasElement>;
  };
}

export interface DeleteElementCommand extends BaseCommand {
  type: 'delete-element';
  data: {
    elementId: string;
    element: CanvasElement; // for undo
    childrenIds?: string[]; // cascade delete
  };
}

export interface MoveElementCommand extends BaseCommand {
  type: 'move-element';
  data: {
    elementId: string;
    newPosition: Position;
    oldPosition: Position;
    deltaX: number;
    deltaY: number;
  };
}

export interface ResizeElementCommand extends BaseCommand {
  type: 'resize-element';
  data: {
    elementId: string;
    newSize: Size;
    oldSize: Size;
    newPosition?: Position; // if position changed during resize
    oldPosition?: Position;
  };
}

export interface StyleElementCommand extends BaseCommand {
  type: 'style-element';
  data: {
    elementId: string;
    newStyle: Partial<ElementStyle>;
    oldStyle: Partial<ElementStyle>;
  };
}

// Group Commands
export interface GroupElementsCommand extends BaseCommand {
  type: 'group-elements';
  data: {
    elementIds: string[];
    groupId: string;
    groupPosition: Position;
    groupSize: Size;
  };
}

export interface UngroupElementsCommand extends BaseCommand {
  type: 'ungroup-elements';
  data: {
    groupId: string;
    elementIds: string[];
    originalPositions: Record<string, Position>;
  };
}

// Frame Commands
export interface CreateFrameCommand extends BaseCommand {
  type: 'create-frame';
  data: {
    frame: CanvasElement;
    elementIds?: string[]; // elements to add to frame
  };
}

export interface UpdateFrameCommand extends BaseCommand {
  type: 'update-frame';
  data: {
    frameId: string;
    changes: Partial<CanvasElement>;
    oldValues: Partial<CanvasElement>;
  };
}

export interface DeleteFrameCommand extends BaseCommand {
  type: 'delete-frame';
  data: {
    frameId: string;
    frame: CanvasElement;
    childrenIds: string[];
    orphanBehavior: 'delete' | 'unparent' | 'move-to-parent';
  };
}

// Connector Commands  
export interface CreateConnectorCommand extends BaseCommand {
  type: 'create-connector';
  data: {
    connector: CanvasElement;
    sourceId: string;
    targetId: string;
  };
}

export interface UpdateConnectorCommand extends BaseCommand {
  type: 'update-connector';
  data: {
    connectorId: string;
    changes: Partial<CanvasElement>;
    oldValues: Partial<CanvasElement>;
  };
}

export interface DeleteConnectorCommand extends BaseCommand {
  type: 'delete-connector';
  data: {
    connectorId: string;
    connector: CanvasElement;
  };
}

// Viewport Commands
export interface ViewportChangeCommand extends BaseCommand {
  type: 'viewport-change';
  data: {
    newViewport: {
      x: number;
      y: number;
      zoom: number;
    };
    oldViewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
}

// Batch Commands
export interface BatchOperationCommand extends BaseCommand {
  type: 'batch-operation';
  data: {
    commands: BaseCommand[];
    atomic: boolean; // all or nothing
  };
}

// Command execution context
export interface CommandContext {
  board: any; // Board state
  selection: string[];
  viewport: any; // Viewport state
  user: {
    id: string;
    role: string;
    permissions: string[];
  };
  timestamp: number;
}

// Command validation
export interface CommandValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Command execution result
export interface CommandResult {
  success: boolean;
  command: BaseCommand;
  changes?: any;
  error?: string;
  undoCommand?: BaseCommand;
}

// Command middleware
export interface CommandMiddleware {
  name: string;
  execute: (command: BaseCommand, context: CommandContext) => Promise<CommandResult | null>;
  priority: number;
}

// Command queue
export interface CommandQueue {
  commands: BaseCommand[];
  processing: boolean;
  maxSize: number;
  retryAttempts: number;
}

// Undo/Redo system
export interface UndoRedoSystem {
  undoStack: BaseCommand[];
  redoStack: BaseCommand[];
  maxStackSize: number;
  canUndo: boolean;
  canRedo: boolean;
}

// Command patterns for common operations
export interface CommandPattern {
  name: string;
  description: string;
  commands: BaseCommand[];
  shortcut?: string;
}

// Macro commands (recorded sequences)
export interface MacroCommand {
  id: string;
  name: string;
  description: string;
  commands: BaseCommand[];
  createdBy: string;
  createdAt: number;
  usageCount: number;
}

// Command analytics
export interface CommandAnalytics {
  commandType: CommandType;
  count: number;
  averageExecutionTime: number;
  errorRate: number;
  lastExecuted: number;
}

// Smart command suggestions
export interface CommandSuggestion {
  command: BaseCommand;
  confidence: number;
  reasoning: string;
  context: string[];
}

// Command conflict resolution
export interface CommandConflict {
  commands: BaseCommand[];
  conflictType: ConflictType;
  resolution: ConflictResolution;
  timestamp: number;
}

export type ConflictType = 
  | 'concurrent-edit'
  | 'version-mismatch'
  | 'permission-denied'
  | 'element-missing'
  | 'validation-failed';

export type ConflictResolution = 
  | 'merge'
  | 'override'
  | 'reject'
  | 'manual'
  | 'queue';

// Command optimization
export interface CommandOptimization {
  original: BaseCommand[];
  optimized: BaseCommand[];
  reductionRatio: number;
  optimizationType: OptimizationType[];
}

export type OptimizationType = 
  | 'merge-similar'
  | 'remove-redundant'
  | 'batch-operations'
  | 'compress-paths'
  | 'eliminate-intermediates';