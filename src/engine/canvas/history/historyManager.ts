/**
 * History Manager - نظام إدارة التاريخ
 * @module engine/canvas/history
 */

import { Operation } from '../transform/operationalTransform';

/**
 * حالة في التاريخ
 */
export interface HistoryState {
  id: string;
  timestamp: number;
  operations: Operation[];
  label?: string;
  branchId?: string;
}

/**
 * فرع في التاريخ
 */
export interface HistoryBranch {
  id: string;
  name: string;
  createdAt: number;
  parentStateId: string;
  states: HistoryState[];
}

/**
 * مستمع التاريخ
 */
export interface HistoryListener {
  onStateChange?: (canUndo: boolean, canRedo: boolean) => void;
  onBranchChange?: (branches: HistoryBranch[]) => void;
}

/**
 * مدير التاريخ
 */
export class HistoryManager {
  private undoStack: HistoryState[] = [];
  private redoStack: HistoryState[] = [];
  private branches: Map<string, HistoryBranch> = new Map();
  private currentBranchId: string = 'main';
  private listeners: Set<HistoryListener> = new Set();
  private maxSize: number = 100;

  constructor() {
    // إنشاء الفرع الرئيسي
    this.branches.set('main', {
      id: 'main',
      name: 'الفرع الرئيسي',
      createdAt: Date.now(),
      parentStateId: '',
      states: [],
    });
  }

  /**
   * إضافة مستمع
   */
  addListener(listener: HistoryListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * إشعار المستمعين
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener.onStateChange?.(this.canUndo(), this.canRedo());
      listener.onBranchChange?.(this.getBranches());
    });
  }

  /**
   * تسجيل عملية
   */
  recordOperation(operation: Operation): void {
    const state: HistoryState = {
      id: `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      operations: [operation],
    };

    this.undoStack.push(state);
    this.redoStack = []; // مسح الـ redo عند إضافة عملية جديدة

    // الحد من حجم المكدس
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.notifyListeners();
  }

  /**
   * تسجيل مجموعة عمليات
   */
  recordOperationGroup(operations: Operation[], label?: string): void {
    const state: HistoryState = {
      id: `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      operations,
      label,
    };

    this.undoStack.push(state);
    this.redoStack = [];

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.notifyListeners();
  }

  /**
   * التراجع
   */
  undo(): Operation[] | null {
    const state = this.undoStack.pop();
    if (!state) return null;

    this.redoStack.push(state);
    
    // عكس العمليات
    const reversedOperations = this.reverseOperations(state.operations);
    
    this.notifyListeners();
    return reversedOperations;
  }

  /**
   * الإعادة
   */
  redo(): Operation[] | null {
    const state = this.redoStack.pop();
    if (!state) return null;

    this.undoStack.push(state);
    
    this.notifyListeners();
    return state.operations;
  }

  /**
   * عكس العمليات
   */
  private reverseOperations(operations: Operation[]): Operation[] {
    return operations.map(op => {
      const reversed: Operation = { ...op };
      
      switch (op.type) {
        case 'insert':
          reversed.type = 'delete';
          break;
        case 'delete':
          reversed.type = 'insert';
          break;
        case 'update':
        case 'move':
        case 'resize':
          // تبديل before و after
          reversed.data = {
            before: op.data.after,
            after: op.data.before,
          };
          break;
      }
      
      return reversed;
    }).reverse();
  }

  /**
   * هل يمكن التراجع؟
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * هل يمكن الإعادة؟
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * عدد عمليات التراجع
   */
  getUndoCount(): number {
    return this.undoStack.length;
  }

  /**
   * عدد عمليات الإعادة
   */
  getRedoCount(): number {
    return this.redoStack.length;
  }

  /**
   * الحصول على التاريخ
   */
  getHistory(): HistoryState[] {
    return [...this.undoStack];
  }

  /**
   * إنشاء فرع
   */
  createBranch(name: string): HistoryBranch | null {
    const lastState = this.undoStack[this.undoStack.length - 1];
    
    const branch: HistoryBranch = {
      id: `branch_${Date.now()}`,
      name,
      createdAt: Date.now(),
      parentStateId: lastState?.id || '',
      states: [],
    };

    this.branches.set(branch.id, branch);
    this.notifyListeners();
    
    return branch;
  }

  /**
   * التبديل للفرع
   */
  switchBranch(branchId: string): boolean {
    if (!this.branches.has(branchId)) return false;
    
    this.currentBranchId = branchId;
    this.notifyListeners();
    
    return true;
  }

  /**
   * دمج فرع
   */
  mergeBranch(sourceBranchId: string): Operation[] {
    const branch = this.branches.get(sourceBranchId);
    if (!branch) return [];

    const operations: Operation[] = [];
    
    branch.states.forEach(state => {
      operations.push(...state.operations);
      this.undoStack.push(state);
    });

    this.branches.delete(sourceBranchId);
    this.notifyListeners();
    
    return operations;
  }

  /**
   * الحصول على الفروع
   */
  getBranches(): HistoryBranch[] {
    return Array.from(this.branches.values());
  }

  /**
   * الحصول على الفرع الحالي
   */
  getCurrentBranch(): HistoryBranch | undefined {
    return this.branches.get(this.currentBranchId);
  }

  /**
   * الانتقال لحالة
   */
  goToState(stateId: string): Operation[] {
    const index = this.undoStack.findIndex(s => s.id === stateId);
    if (index === -1) return [];

    const operations: Operation[] = [];
    
    // التراجع حتى الحالة المطلوبة
    while (this.undoStack.length > index + 1) {
      const undoOps = this.undo();
      if (undoOps) operations.push(...undoOps);
    }

    return operations;
  }

  /**
   * مسح التاريخ
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.notifyListeners();
  }
}

/**
 * مثيل المدير الافتراضي
 */
export const historyManager = new HistoryManager();
