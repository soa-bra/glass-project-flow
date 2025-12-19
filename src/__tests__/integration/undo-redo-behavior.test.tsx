/**
 * Undo/Redo Behavior Tests
 * 
 * Tests for undo/redo functionality including:
 * - Basic undo/redo operations
 * - Operation grouping
 * - History limits
 * - State snapshots
 * - Branch management
 * - Complex operation sequences
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Types
interface Operation {
  id: string;
  type: 'insert' | 'delete' | 'update' | 'move' | 'resize' | 'group';
  elementId: string;
  data: any;
  previousData?: any;
  timestamp: number;
}

interface HistoryState {
  id: string;
  operations: Operation[];
  timestamp: number;
  label?: string;
  snapshot?: any;
}

interface HistoryBranch {
  id: string;
  name: string;
  states: HistoryState[];
}

// Mock History Manager
class MockHistoryManager {
  private states: HistoryState[] = [];
  private currentIndex: number = -1;
  private branches: HistoryBranch[] = [];
  private currentBranchId: string = 'main';
  private maxStates: number = 100;
  private listeners: Set<() => void> = new Set();
  private pendingOperations: Operation[] = [];
  private groupTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.branches.push({
      id: 'main',
      name: 'Main',
      states: this.states,
    });
  }

  recordOperation(operation: Operation): void {
    // Clear redo stack when new operation is recorded
    if (this.currentIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }

    this.pendingOperations.push(operation);

    if (this.groupTimeout) {
      clearTimeout(this.groupTimeout);
    }

    this.groupTimeout = setTimeout(() => {
      this.commitPendingOperations();
    }, 100);
  }

  recordOperationGroup(operations: Operation[], label?: string): void {
    if (operations.length === 0) return;

    // Clear redo stack
    if (this.currentIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }

    const state: HistoryState = {
      id: `state-${Date.now()}`,
      operations,
      timestamp: Date.now(),
      label,
    };

    this.states.push(state);
    this.currentIndex++;
    this.enforceLimit();
    this.notifyListeners();
  }

  private commitPendingOperations(): void {
    if (this.pendingOperations.length === 0) return;

    const state: HistoryState = {
      id: `state-${Date.now()}`,
      operations: [...this.pendingOperations],
      timestamp: Date.now(),
    };

    this.states.push(state);
    this.currentIndex++;
    this.pendingOperations = [];
    this.enforceLimit();
    this.notifyListeners();
  }

  undo(): Operation[] | null {
    // Commit any pending operations first
    if (this.pendingOperations.length > 0) {
      this.commitPendingOperations();
    }

    if (this.currentIndex < 0) return null;

    const state = this.states[this.currentIndex];
    this.currentIndex--;
    this.notifyListeners();

    return this.invertOperations(state.operations);
  }

  redo(): Operation[] | null {
    if (this.currentIndex >= this.states.length - 1) return null;

    this.currentIndex++;
    const state = this.states[this.currentIndex];
    this.notifyListeners();

    return state.operations;
  }

  private invertOperations(operations: Operation[]): Operation[] {
    return operations.map(op => this.invertOperation(op)).reverse();
  }

  private invertOperation(operation: Operation): Operation {
    switch (operation.type) {
      case 'insert':
        return { ...operation, type: 'delete' };
      case 'delete':
        return { ...operation, type: 'insert' };
      case 'update':
        return {
          ...operation,
          data: operation.previousData,
          previousData: operation.data,
        };
      case 'move':
        return {
          ...operation,
          data: operation.previousData,
          previousData: operation.data,
        };
      case 'resize':
        return {
          ...operation,
          data: operation.previousData,
          previousData: operation.data,
        };
      default:
        return operation;
    }
  }

  canUndo(): boolean {
    return this.currentIndex >= 0 || this.pendingOperations.length > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.states.length - 1;
  }

  getUndoCount(): number {
    return this.currentIndex + 1 + (this.pendingOperations.length > 0 ? 1 : 0);
  }

  getRedoCount(): number {
    return this.states.length - 1 - this.currentIndex;
  }

  getHistory(): HistoryState[] {
    return [...this.states];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  createBranch(name: string): HistoryBranch | null {
    const branchStates = this.states.slice(0, this.currentIndex + 1);
    const branch: HistoryBranch = {
      id: `branch-${Date.now()}`,
      name,
      states: [...branchStates],
    };
    this.branches.push(branch);
    return branch;
  }

  switchBranch(branchId: string): boolean {
    const branch = this.branches.find(b => b.id === branchId);
    if (!branch) return false;

    this.states = [...branch.states];
    this.currentIndex = this.states.length - 1;
    this.currentBranchId = branchId;
    this.notifyListeners();
    return true;
  }

  mergeBranch(sourceBranchId: string): Operation[] {
    const sourceBranch = this.branches.find(b => b.id === sourceBranchId);
    if (!sourceBranch) return [];

    const currentBranch = this.branches.find(b => b.id === this.currentBranchId);
    if (!currentBranch) return [];

    // Find common ancestor and merge operations
    const mergedOps: Operation[] = [];
    sourceBranch.states.forEach(state => {
      mergedOps.push(...state.operations);
    });

    return mergedOps;
  }

  getBranches(): HistoryBranch[] {
    return [...this.branches];
  }

  getCurrentBranch(): string {
    return this.currentBranchId;
  }

  goToState(stateId: string): Operation[] {
    const targetIndex = this.states.findIndex(s => s.id === stateId);
    if (targetIndex === -1) return [];

    const operations: Operation[] = [];

    if (targetIndex < this.currentIndex) {
      // Need to undo
      for (let i = this.currentIndex; i > targetIndex; i--) {
        operations.push(...this.invertOperations(this.states[i].operations));
      }
    } else if (targetIndex > this.currentIndex) {
      // Need to redo
      for (let i = this.currentIndex + 1; i <= targetIndex; i++) {
        operations.push(...this.states[i].operations);
      }
    }

    this.currentIndex = targetIndex;
    this.notifyListeners();
    return operations;
  }

  clear(): void {
    this.states = [];
    this.currentIndex = -1;
    this.pendingOperations = [];
    this.branches = [{
      id: 'main',
      name: 'Main',
      states: this.states,
    }];
    this.currentBranchId = 'main';
    this.notifyListeners();
  }

  createSnapshot(): any {
    return {
      states: [...this.states],
      currentIndex: this.currentIndex,
      branches: [...this.branches],
    };
  }

  restoreSnapshot(snapshot: any): void {
    this.states = [...snapshot.states];
    this.currentIndex = snapshot.currentIndex;
    this.branches = [...snapshot.branches];
    this.notifyListeners();
  }

  private enforceLimit(): void {
    if (this.states.length > this.maxStates) {
      const excess = this.states.length - this.maxStates;
      this.states = this.states.slice(excess);
      this.currentIndex -= excess;
      if (this.currentIndex < -1) this.currentIndex = -1;
    }
  }

  addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  setMaxStates(max: number): void {
    this.maxStates = max;
    this.enforceLimit();
  }
}

// Helper functions
const createOperation = (
  type: Operation['type'],
  elementId: string,
  data: any,
  previousData?: any
): Operation => ({
  id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  elementId,
  data,
  previousData,
  timestamp: Date.now(),
});

describe('Undo/Redo Behavior', () => {
  let historyManager: MockHistoryManager;

  beforeEach(() => {
    historyManager = new MockHistoryManager();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Basic Undo/Redo', () => {
    it('should undo single operation', () => {
      const op = createOperation('insert', 'el-1', { x: 100, y: 100 });
      historyManager.recordOperationGroup([op]);

      expect(historyManager.canUndo()).toBe(true);

      const undoOps = historyManager.undo();

      expect(undoOps).not.toBeNull();
      expect(undoOps![0].type).toBe('delete');
      expect(historyManager.canUndo()).toBe(false);
    });

    it('should redo single operation', () => {
      const op = createOperation('insert', 'el-1', { x: 100, y: 100 });
      historyManager.recordOperationGroup([op]);
      historyManager.undo();

      expect(historyManager.canRedo()).toBe(true);

      const redoOps = historyManager.redo();

      expect(redoOps).not.toBeNull();
      expect(redoOps![0].type).toBe('insert');
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should handle multiple undo operations', () => {
      for (let i = 0; i < 5; i++) {
        const op = createOperation('insert', `el-${i}`, { x: i * 100 });
        historyManager.recordOperationGroup([op]);
      }

      expect(historyManager.getUndoCount()).toBe(5);

      for (let i = 0; i < 5; i++) {
        historyManager.undo();
      }

      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.getRedoCount()).toBe(5);
    });

    it('should handle multiple redo operations', () => {
      for (let i = 0; i < 3; i++) {
        const op = createOperation('insert', `el-${i}`, { x: i * 100 });
        historyManager.recordOperationGroup([op]);
      }

      historyManager.undo();
      historyManager.undo();
      historyManager.undo();

      expect(historyManager.getRedoCount()).toBe(3);

      historyManager.redo();
      historyManager.redo();
      historyManager.redo();

      expect(historyManager.canRedo()).toBe(false);
      expect(historyManager.getUndoCount()).toBe(3);
    });

    it('should return null when nothing to undo', () => {
      const result = historyManager.undo();
      expect(result).toBeNull();
    });

    it('should return null when nothing to redo', () => {
      const result = historyManager.redo();
      expect(result).toBeNull();
    });
  });

  describe('Operation Inversion', () => {
    it('should invert insert to delete', () => {
      const op = createOperation('insert', 'el-1', { x: 100 });
      historyManager.recordOperationGroup([op]);

      const undoOps = historyManager.undo();

      expect(undoOps![0].type).toBe('delete');
      expect(undoOps![0].elementId).toBe('el-1');
    });

    it('should invert delete to insert', () => {
      const op = createOperation('delete', 'el-1', { x: 100 });
      historyManager.recordOperationGroup([op]);

      const undoOps = historyManager.undo();

      expect(undoOps![0].type).toBe('insert');
    });

    it('should invert update with previous data', () => {
      const op = createOperation(
        'update',
        'el-1',
        { fill: 'blue' },
        { fill: 'red' }
      );
      historyManager.recordOperationGroup([op]);

      const undoOps = historyManager.undo();

      expect(undoOps![0].data).toEqual({ fill: 'red' });
      expect(undoOps![0].previousData).toEqual({ fill: 'blue' });
    });

    it('should invert move operation', () => {
      const op = createOperation(
        'move',
        'el-1',
        { x: 200, y: 200 },
        { x: 100, y: 100 }
      );
      historyManager.recordOperationGroup([op]);

      const undoOps = historyManager.undo();

      expect(undoOps![0].data).toEqual({ x: 100, y: 100 });
    });

    it('should invert resize operation', () => {
      const op = createOperation(
        'resize',
        'el-1',
        { width: 200, height: 200 },
        { width: 100, height: 100 }
      );
      historyManager.recordOperationGroup([op]);

      const undoOps = historyManager.undo();

      expect(undoOps![0].data).toEqual({ width: 100, height: 100 });
    });

    it('should reverse operation order when undoing', () => {
      const ops = [
        createOperation('insert', 'el-1', {}),
        createOperation('insert', 'el-2', {}),
        createOperation('insert', 'el-3', {}),
      ];
      historyManager.recordOperationGroup(ops);

      const undoOps = historyManager.undo();

      expect(undoOps![0].elementId).toBe('el-3');
      expect(undoOps![1].elementId).toBe('el-2');
      expect(undoOps![2].elementId).toBe('el-1');
    });
  });

  describe('Operation Grouping', () => {
    it('should group operations recorded close together', () => {
      const op1 = createOperation('move', 'el-1', { x: 110 }, { x: 100 });
      const op2 = createOperation('move', 'el-1', { x: 120 }, { x: 110 });
      const op3 = createOperation('move', 'el-1', { x: 130 }, { x: 120 });

      historyManager.recordOperation(op1);
      historyManager.recordOperation(op2);
      historyManager.recordOperation(op3);

      // Fast forward timers to trigger grouping
      vi.advanceTimersByTime(150);

      expect(historyManager.getUndoCount()).toBe(1);
    });

    it('should create separate groups for operations with delay', () => {
      const op1 = createOperation('move', 'el-1', { x: 110 }, { x: 100 });
      historyManager.recordOperation(op1);
      vi.advanceTimersByTime(150);

      const op2 = createOperation('move', 'el-1', { x: 200 }, { x: 110 });
      historyManager.recordOperation(op2);
      vi.advanceTimersByTime(150);

      expect(historyManager.getUndoCount()).toBe(2);
    });

    it('should handle labeled operation groups', () => {
      const ops = [
        createOperation('insert', 'el-1', {}),
        createOperation('update', 'el-1', { fill: 'red' }),
      ];
      historyManager.recordOperationGroup(ops, 'Create and style element');

      const history = historyManager.getHistory();
      expect(history[0].label).toBe('Create and style element');
    });

    it('should undo entire group at once', () => {
      const ops = [
        createOperation('insert', 'el-1', {}),
        createOperation('insert', 'el-2', {}),
        createOperation('insert', 'el-3', {}),
      ];
      historyManager.recordOperationGroup(ops);

      const undoOps = historyManager.undo();

      expect(undoOps!.length).toBe(3);
      expect(historyManager.canUndo()).toBe(false);
    });
  });

  describe('History Limits', () => {
    it('should respect maximum history size', () => {
      historyManager.setMaxStates(10);

      for (let i = 0; i < 15; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      expect(historyManager.getHistory().length).toBe(10);
    });

    it('should preserve most recent states when limit exceeded', () => {
      historyManager.setMaxStates(5);

      for (let i = 0; i < 10; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      const history = historyManager.getHistory();
      expect(history[0].operations[0].elementId).toBe('el-5');
      expect(history[4].operations[0].elementId).toBe('el-9');
    });

    it('should adjust current index when old states removed', () => {
      historyManager.setMaxStates(5);

      for (let i = 0; i < 10; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      expect(historyManager.getCurrentIndex()).toBe(4);
    });
  });

  describe('Redo Stack Clearing', () => {
    it('should clear redo stack on new operation', () => {
      const op1 = createOperation('insert', 'el-1', {});
      const op2 = createOperation('insert', 'el-2', {});
      historyManager.recordOperationGroup([op1]);
      historyManager.recordOperationGroup([op2]);

      historyManager.undo();
      expect(historyManager.canRedo()).toBe(true);

      const op3 = createOperation('insert', 'el-3', {});
      historyManager.recordOperationGroup([op3]);

      expect(historyManager.canRedo()).toBe(false);
    });

    it('should preserve history before current position', () => {
      for (let i = 0; i < 5; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      historyManager.undo();
      historyManager.undo();

      const op = createOperation('insert', 'el-new', {});
      historyManager.recordOperationGroup([op]);

      expect(historyManager.getHistory().length).toBe(4);
    });
  });

  describe('Branch Management', () => {
    it('should create new branch from current state', () => {
      const op1 = createOperation('insert', 'el-1', {});
      const op2 = createOperation('insert', 'el-2', {});
      historyManager.recordOperationGroup([op1]);
      historyManager.recordOperationGroup([op2]);

      const branch = historyManager.createBranch('Feature A');

      expect(branch).not.toBeNull();
      expect(branch!.name).toBe('Feature A');
      expect(branch!.states.length).toBe(2);
    });

    it('should switch between branches', () => {
      const op1 = createOperation('insert', 'el-1', {});
      historyManager.recordOperationGroup([op1]);

      const branch = historyManager.createBranch('Alt');
      const op2 = createOperation('insert', 'el-2', {});
      historyManager.recordOperationGroup([op2]);

      const switched = historyManager.switchBranch(branch!.id);

      expect(switched).toBe(true);
      expect(historyManager.getHistory().length).toBe(1);
    });

    it('should return false for non-existent branch', () => {
      const switched = historyManager.switchBranch('non-existent');
      expect(switched).toBe(false);
    });

    it('should list all branches', () => {
      historyManager.createBranch('Branch A');
      historyManager.createBranch('Branch B');

      const branches = historyManager.getBranches();

      expect(branches.length).toBe(3); // main + 2 created
    });

    it('should merge branch operations', () => {
      const op1 = createOperation('insert', 'el-1', {});
      historyManager.recordOperationGroup([op1]);

      const branch = historyManager.createBranch('Feature');
      
      const op2 = createOperation('insert', 'el-2', {});
      historyManager.recordOperationGroup([op2]);

      const mergedOps = historyManager.mergeBranch(branch!.id);

      expect(mergedOps.length).toBeGreaterThan(0);
    });
  });

  describe('State Navigation', () => {
    it('should navigate to specific state by ID', () => {
      for (let i = 0; i < 5; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      const history = historyManager.getHistory();
      const targetState = history[2];

      historyManager.goToState(targetState.id);

      expect(historyManager.getCurrentIndex()).toBe(2);
    });

    it('should return undo operations when navigating backward', () => {
      for (let i = 0; i < 5; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      const history = historyManager.getHistory();
      const ops = historyManager.goToState(history[1].id);

      // Should undo states 4, 3, 2 (3 operations)
      expect(ops.length).toBe(3);
    });

    it('should return redo operations when navigating forward', () => {
      for (let i = 0; i < 5; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      historyManager.undo();
      historyManager.undo();
      historyManager.undo();

      const history = historyManager.getHistory();
      const ops = historyManager.goToState(history[4].id);

      expect(ops.length).toBe(3);
    });

    it('should return empty array for current state', () => {
      const op = createOperation('insert', 'el-1', {});
      historyManager.recordOperationGroup([op]);

      const history = historyManager.getHistory();
      const ops = historyManager.goToState(history[0].id);

      expect(ops.length).toBe(0);
    });

    it('should return empty array for non-existent state', () => {
      const ops = historyManager.goToState('non-existent');
      expect(ops.length).toBe(0);
    });
  });

  describe('Clear History', () => {
    it('should clear all history', () => {
      for (let i = 0; i < 5; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      historyManager.clear();

      expect(historyManager.getHistory().length).toBe(0);
      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should reset branches to main only', () => {
      historyManager.createBranch('A');
      historyManager.createBranch('B');

      historyManager.clear();

      expect(historyManager.getBranches().length).toBe(1);
      expect(historyManager.getCurrentBranch()).toBe('main');
    });
  });

  describe('Snapshots', () => {
    it('should create snapshot of current state', () => {
      for (let i = 0; i < 3; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      const snapshot = historyManager.createSnapshot();

      expect(snapshot.states.length).toBe(3);
      expect(snapshot.currentIndex).toBe(2);
    });

    it('should restore from snapshot', () => {
      for (let i = 0; i < 5; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      const snapshot = historyManager.createSnapshot();

      historyManager.clear();
      historyManager.restoreSnapshot(snapshot);

      expect(historyManager.getHistory().length).toBe(5);
      expect(historyManager.getCurrentIndex()).toBe(4);
    });
  });

  describe('Listeners', () => {
    it('should notify listeners on state change', () => {
      const listener = vi.fn();
      historyManager.addListener(listener);

      const op = createOperation('insert', 'el-1', {});
      historyManager.recordOperationGroup([op]);

      expect(listener).toHaveBeenCalled();
    });

    it('should notify on undo', () => {
      const op = createOperation('insert', 'el-1', {});
      historyManager.recordOperationGroup([op]);

      const listener = vi.fn();
      historyManager.addListener(listener);

      historyManager.undo();

      expect(listener).toHaveBeenCalled();
    });

    it('should notify on redo', () => {
      const op = createOperation('insert', 'el-1', {});
      historyManager.recordOperationGroup([op]);
      historyManager.undo();

      const listener = vi.fn();
      historyManager.addListener(listener);

      historyManager.redo();

      expect(listener).toHaveBeenCalled();
    });

    it('should unsubscribe listener', () => {
      const listener = vi.fn();
      const unsubscribe = historyManager.addListener(listener);

      unsubscribe();

      const op = createOperation('insert', 'el-1', {});
      historyManager.recordOperationGroup([op]);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Complex Sequences', () => {
    it('should handle interleaved undo/redo/new operations', () => {
      const op1 = createOperation('insert', 'el-1', {});
      const op2 = createOperation('insert', 'el-2', {});
      const op3 = createOperation('insert', 'el-3', {});

      historyManager.recordOperationGroup([op1]);
      historyManager.recordOperationGroup([op2]);
      historyManager.undo();
      historyManager.recordOperationGroup([op3]);

      expect(historyManager.getHistory().length).toBe(2);
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should handle rapid undo/redo cycles', () => {
      for (let i = 0; i < 10; i++) {
        const op = createOperation('insert', `el-${i}`, {});
        historyManager.recordOperationGroup([op]);
      }

      // Rapid undo
      for (let i = 0; i < 5; i++) {
        historyManager.undo();
      }

      // Rapid redo
      for (let i = 0; i < 3; i++) {
        historyManager.redo();
      }

      expect(historyManager.getCurrentIndex()).toBe(7);
      expect(historyManager.getUndoCount()).toBe(8);
      expect(historyManager.getRedoCount()).toBe(2);
    });

    it('should handle mixed operation types', () => {
      const ops = [
        createOperation('insert', 'el-1', { x: 0, y: 0 }),
        createOperation('move', 'el-1', { x: 100, y: 100 }, { x: 0, y: 0 }),
        createOperation('resize', 'el-1', { width: 200 }, { width: 100 }),
        createOperation('update', 'el-1', { fill: 'blue' }, { fill: 'red' }),
        createOperation('delete', 'el-1', {}),
      ];

      ops.forEach(op => historyManager.recordOperationGroup([op]));

      // Undo all
      while (historyManager.canUndo()) {
        historyManager.undo();
      }

      expect(historyManager.canUndo()).toBe(false);

      // Redo all
      while (historyManager.canRedo()) {
        historyManager.redo();
      }

      expect(historyManager.canRedo()).toBe(false);
      expect(historyManager.getUndoCount()).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty operation group', () => {
      historyManager.recordOperationGroup([]);
      expect(historyManager.getHistory().length).toBe(0);
    });

    it('should handle commit with no pending operations', () => {
      vi.advanceTimersByTime(150);
      expect(historyManager.getHistory().length).toBe(0);
    });

    it('should handle undo immediately after record', () => {
      const op = createOperation('insert', 'el-1', {});
      historyManager.recordOperation(op);
      
      // Undo before timeout (should commit pending first)
      const undoOps = historyManager.undo();

      expect(undoOps).not.toBeNull();
    });

    it('should handle operations with undefined previousData', () => {
      const op = createOperation('update', 'el-1', { fill: 'blue' });
      historyManager.recordOperationGroup([op]);

      const undoOps = historyManager.undo();

      expect(undoOps![0].data).toBeUndefined();
    });
  });
});
