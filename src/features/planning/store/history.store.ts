import { create } from 'zustand';
import { HistoryState, Command, CommandType, CommandExecutor } from '../types/commands.types';

interface HistoryStore extends HistoryState {
  // History Actions
  executeCommand: (command: Command) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clearHistory: () => void;
  getHistoryList: () => Command[];
  jumpToCommand: (commandId: string) => Promise<void>;
  
  // Command Creation Helpers
  createInsertCommand: (elementId: string, element: any, description?: string) => Command;
  createUpdateCommand: (elementId: string, updates: any, previousState: any, description?: string) => Command;
  createDeleteCommand: (elementId: string, element: any, description?: string) => Command;
  createBatchCommand: (commands: Command[], description: string) => Command;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  // Initial State
  past: [],
  present: null,
  future: [],
  maxHistorySize: 50,
  canUndo: false,
  canRedo: false,

  // History Actions
  executeCommand: async (command) => {
    set((state) => {
      const newPast = [...state.past];
      
      // Add current command to past
      if (state.present) {
        newPast.push(state.present);
      }
      
      // Limit history size
      if (newPast.length > state.maxHistorySize) {
        newPast.shift();
      }
      
      return {
        past: newPast,
        present: command,
        future: [], // Clear future when new command is executed
        canUndo: true,
        canRedo: false
      };
    });

    // TODO: Execute command through command executor
    console.log('Executing command:', command);
  },

  undo: async () => {
    const { past, present, future } = get();
    
    if (past.length === 0 || !present) return;
    
    const previousCommand = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    set({
      past: newPast,
      present: previousCommand,
      future: [present, ...future],
      canUndo: newPast.length > 0,
      canRedo: true
    });

    // TODO: Execute undo through command executor
    console.log('Undoing command:', present);
  },

  redo: async () => {
    const { past, present, future } = get();
    
    if (future.length === 0 || !present) return;
    
    const nextCommand = future[0];
    const newFuture = future.slice(1);
    
    set({
      past: [...past, present],
      present: nextCommand,
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0
    });

    // TODO: Execute redo through command executor
    console.log('Redoing command:', nextCommand);
  },

  clearHistory: () => set({
    past: [],
    present: null,
    future: [],
    canUndo: false,
    canRedo: false
  }),

  getHistoryList: () => {
    const { past, present } = get();
    const history = [...past];
    if (present) {
      history.push(present);
    }
    return history.slice(-10); // Last 10 commands
  },

  jumpToCommand: async (commandId) => {
    const { past, present, future } = get();
    const allCommands = [...past, ...(present ? [present] : []), ...future];
    
    const targetIndex = allCommands.findIndex(cmd => cmd.id === commandId);
    if (targetIndex === -1) return;
    
    const targetCommand = allCommands[targetIndex];
    const newPast = allCommands.slice(0, targetIndex);
    const newFuture = allCommands.slice(targetIndex + 1);
    
    set({
      past: newPast,
      present: targetCommand,
      future: newFuture,
      canUndo: newPast.length > 0,
      canRedo: newFuture.length > 0
    });

    // TODO: Execute jump through command executor
    console.log('Jumping to command:', targetCommand);
  },

  // Command Creation Helpers
  createInsertCommand: (elementId, element, description = 'إدراج عنصر') => ({
    id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'insert_element' as CommandType,
    timestamp: Date.now(),
    userId: 'current_user', // TODO: Get from auth
    data: { elementId, element },
    description
  }),

  createUpdateCommand: (elementId, updates, previousState, description = 'تحديث عنصر') => ({
    id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'update_element' as CommandType,
    timestamp: Date.now(),
    userId: 'current_user', // TODO: Get from auth
    data: { elementId, updates, previousState },
    description
  }),

  createDeleteCommand: (elementId, element, description = 'حذف عنصر') => ({
    id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'delete_element' as CommandType,
    timestamp: Date.now(),
    userId: 'current_user', // TODO: Get from auth
    data: { elementId, element },
    description
  }),

  createBatchCommand: (commands, description) => ({
    id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'batch_update' as CommandType,
    timestamp: Date.now(),
    userId: 'current_user', // TODO: Get from auth
    data: { commands },
    description
  })
}));