/**
 * History Manager - نظام إدارة التاريخ المتقدم
 * يدعم Undo/Redo مع تفرعات ومجموعات العمليات
 */

import { Operation, otEngine } from './operationalTransform';

// حالة نقطة في التاريخ
export interface HistoryState {
  id: string;
  timestamp: number;
  operations: Operation[];
  snapshot?: Record<string, any>;
  label?: string;
  parentId?: string;
  branchId?: string;
}

// إعدادات مدير التاريخ
export interface HistoryConfig {
  maxHistorySize: number;
  snapshotInterval: number;
  enableBranching: boolean;
  composeTimeout: number;
}

// معلومات الفرع
export interface HistoryBranch {
  id: string;
  name: string;
  createdAt: number;
  parentStateId: string;
  states: string[];
}

// واجهة مستمع التغييرات
export interface HistoryListener {
  onStateChange: (canUndo: boolean, canRedo: boolean) => void;
  onBranchChange?: (branches: HistoryBranch[]) => void;
}

class HistoryManager {
  private states: Map<string, HistoryState> = new Map();
  private branches: Map<string, HistoryBranch> = new Map();
  private currentStateId: string | null = null;
  private currentBranchId: string = 'main';
  private pendingOperations: Operation[] = [];
  private composeTimer: NodeJS.Timeout | null = null;
  private listeners: Set<HistoryListener> = new Set();
  private operationStack: Operation[][] = [];
  private redoStack: Operation[][] = [];
  
  private config: HistoryConfig = {
    maxHistorySize: 100,
    snapshotInterval: 10,
    enableBranching: true,
    composeTimeout: 500
  };
  
  constructor() {
    this.initializeMainBranch();
  }
  
  /**
   * تهيئة الفرع الرئيسي
   */
  private initializeMainBranch(): void {
    const mainBranch: HistoryBranch = {
      id: 'main',
      name: 'الفرع الرئيسي',
      createdAt: Date.now(),
      parentStateId: '',
      states: []
    };
    this.branches.set('main', mainBranch);
  }
  
  /**
   * تسجيل عملية جديدة
   */
  recordOperation(operation: Operation): void {
    this.pendingOperations.push(operation);
    
    // إعادة تعيين مؤقت الدمج
    if (this.composeTimer) {
      clearTimeout(this.composeTimer);
    }
    
    this.composeTimer = setTimeout(() => {
      this.commitPendingOperations();
    }, this.config.composeTimeout);
  }
  
  /**
   * تسجيل مجموعة عمليات كوحدة واحدة
   */
  recordOperationGroup(operations: Operation[], label?: string): void {
    if (operations.length === 0) return;
    
    // مسح العمليات المعلقة
    if (this.composeTimer) {
      clearTimeout(this.composeTimer);
      this.composeTimer = null;
    }
    this.pendingOperations = [];
    
    // دمج العمليات المتتالية
    const composed = otEngine.composeOperations(operations);
    
    // إضافة للمكدس
    this.operationStack.push(composed);
    this.redoStack = []; // مسح الـ redo عند عملية جديدة
    
    // إنشاء حالة جديدة
    this.createState(composed, label);
    
    // تنظيف التاريخ القديم
    this.pruneHistory();
    
    // إشعار المستمعين
    this.notifyListeners();
  }
  
  /**
   * تثبيت العمليات المعلقة
   */
  private commitPendingOperations(): void {
    if (this.pendingOperations.length === 0) return;
    
    const composed = otEngine.composeOperations([...this.pendingOperations]);
    this.operationStack.push(composed);
    this.redoStack = [];
    
    this.createState(composed);
    this.pendingOperations = [];
    this.composeTimer = null;
    
    this.pruneHistory();
    this.notifyListeners();
  }
  
  /**
   * إنشاء حالة جديدة في التاريخ
   */
  private createState(operations: Operation[], label?: string): HistoryState {
    const stateId = `state_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const state: HistoryState = {
      id: stateId,
      timestamp: Date.now(),
      operations,
      label,
      parentId: this.currentStateId || undefined,
      branchId: this.currentBranchId
    };
    
    // إضافة snapshot كل فترة
    const branch = this.branches.get(this.currentBranchId);
    if (branch && branch.states.length % this.config.snapshotInterval === 0) {
      // يمكن إضافة snapshot للحالة الكاملة هنا
    }
    
    this.states.set(stateId, state);
    this.currentStateId = stateId;
    
    // تحديث الفرع
    if (branch) {
      branch.states.push(stateId);
    }
    
    return state;
  }
  
  /**
   * التراجع عن آخر عملية
   */
  undo(): Operation[] | null {
    // تثبيت العمليات المعلقة أولاً
    if (this.pendingOperations.length > 0) {
      this.commitPendingOperations();
    }
    
    if (this.operationStack.length === 0) return null;
    
    const operations = this.operationStack.pop()!;
    this.redoStack.push(operations);
    
    // عكس العمليات
    const inverted = operations.map(op => otEngine.invertOperation(op)).reverse();
    
    // تحديث الحالة الحالية
    this.updateCurrentState();
    this.notifyListeners();
    
    return inverted;
  }
  
  /**
   * إعادة آخر عملية تم التراجع عنها
   */
  redo(): Operation[] | null {
    if (this.redoStack.length === 0) return null;
    
    const operations = this.redoStack.pop()!;
    this.operationStack.push(operations);
    
    // تحديث الحالة الحالية
    this.updateCurrentState();
    this.notifyListeners();
    
    return operations;
  }
  
  /**
   * تحديث مرجع الحالة الحالية
   */
  private updateCurrentState(): void {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch) return;
    
    const index = Math.min(this.operationStack.length, branch.states.length) - 1;
    this.currentStateId = index >= 0 ? branch.states[index] : null;
  }
  
  /**
   * إنشاء فرع جديد
   */
  createBranch(name: string): HistoryBranch | null {
    if (!this.config.enableBranching || !this.currentStateId) return null;
    
    const branchId = `branch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const newBranch: HistoryBranch = {
      id: branchId,
      name,
      createdAt: Date.now(),
      parentStateId: this.currentStateId,
      states: []
    };
    
    this.branches.set(branchId, newBranch);
    this.currentBranchId = branchId;
    
    this.notifyBranchChange();
    return newBranch;
  }
  
  /**
   * التبديل إلى فرع آخر
   */
  switchBranch(branchId: string): boolean {
    const branch = this.branches.get(branchId);
    if (!branch) return false;
    
    this.currentBranchId = branchId;
    
    // تحديث الحالة الحالية لآخر حالة في الفرع
    if (branch.states.length > 0) {
      this.currentStateId = branch.states[branch.states.length - 1];
    } else {
      this.currentStateId = branch.parentStateId || null;
    }
    
    this.notifyListeners();
    this.notifyBranchChange();
    return true;
  }
  
  /**
   * دمج فرع في الفرع الحالي
   */
  mergeBranch(sourceBranchId: string): Operation[] {
    const sourceBranch = this.branches.get(sourceBranchId);
    if (!sourceBranch) return [];
    
    const operations: Operation[] = [];
    
    // جمع كل العمليات من الفرع المصدر
    for (const stateId of sourceBranch.states) {
      const state = this.states.get(stateId);
      if (state) {
        operations.push(...state.operations);
      }
    }
    
    // تطبيق العمليات على الفرع الحالي
    if (operations.length > 0) {
      this.recordOperationGroup(operations, `دمج من: ${sourceBranch.name}`);
    }
    
    return operations;
  }
  
  /**
   * الحصول على قائمة الحالات في الفرع الحالي
   */
  getHistory(): HistoryState[] {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch) return [];
    
    return branch.states
      .map(id => this.states.get(id))
      .filter((state): state is HistoryState => state !== undefined);
  }
  
  /**
   * الانتقال إلى حالة معينة
   */
  goToState(stateId: string): Operation[] {
    const targetState = this.states.get(stateId);
    if (!targetState) return [];
    
    const branch = this.branches.get(this.currentBranchId);
    if (!branch) return [];
    
    const targetIndex = branch.states.indexOf(stateId);
    if (targetIndex === -1) return [];
    
    const currentIndex = this.currentStateId 
      ? branch.states.indexOf(this.currentStateId)
      : -1;
    
    const operations: Operation[] = [];
    
    if (targetIndex < currentIndex) {
      // نحتاج للتراجع
      for (let i = currentIndex; i > targetIndex; i--) {
        const state = this.states.get(branch.states[i]);
        if (state) {
          const inverted = state.operations.map(op => otEngine.invertOperation(op)).reverse();
          operations.push(...inverted);
        }
      }
    } else if (targetIndex > currentIndex) {
      // نحتاج للإعادة
      for (let i = currentIndex + 1; i <= targetIndex; i++) {
        const state = this.states.get(branch.states[i]);
        if (state) {
          operations.push(...state.operations);
        }
      }
    }
    
    this.currentStateId = stateId;
    this.notifyListeners();
    
    return operations;
  }
  
  /**
   * تنظيف التاريخ القديم
   */
  private pruneHistory(): void {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch) return;
    
    while (branch.states.length > this.config.maxHistorySize) {
      const oldStateId = branch.states.shift();
      if (oldStateId) {
        this.states.delete(oldStateId);
      }
    }
    
    // تنظيف مكدس العمليات أيضاً
    while (this.operationStack.length > this.config.maxHistorySize) {
      this.operationStack.shift();
    }
  }
  
  /**
   * هل يمكن التراجع؟
   */
  canUndo(): boolean {
    return this.operationStack.length > 0 || this.pendingOperations.length > 0;
  }
  
  /**
   * هل يمكن الإعادة؟
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  
  /**
   * الحصول على عدد خطوات التراجع المتاحة
   */
  getUndoCount(): number {
    return this.operationStack.length + (this.pendingOperations.length > 0 ? 1 : 0);
  }
  
  /**
   * الحصول على عدد خطوات الإعادة المتاحة
   */
  getRedoCount(): number {
    return this.redoStack.length;
  }
  
  /**
   * مسح كل التاريخ
   */
  clear(): void {
    this.states.clear();
    this.branches.clear();
    this.operationStack = [];
    this.redoStack = [];
    this.pendingOperations = [];
    this.currentStateId = null;
    this.currentBranchId = 'main';
    
    if (this.composeTimer) {
      clearTimeout(this.composeTimer);
      this.composeTimer = null;
    }
    
    this.initializeMainBranch();
    this.notifyListeners();
  }
  
  /**
   * تحديث الإعدادات
   */
  updateConfig(config: Partial<HistoryConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * إضافة مستمع
   */
  addListener(listener: HistoryListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  /**
   * إشعار المستمعين بتغيير الحالة
   */
  private notifyListeners(): void {
    const canUndo = this.canUndo();
    const canRedo = this.canRedo();
    
    this.listeners.forEach(listener => {
      listener.onStateChange(canUndo, canRedo);
    });
  }
  
  /**
   * إشعار المستمعين بتغيير الفروع
   */
  private notifyBranchChange(): void {
    const branches = Array.from(this.branches.values());
    
    this.listeners.forEach(listener => {
      listener.onBranchChange?.(branches);
    });
  }
  
  /**
   * الحصول على جميع الفروع
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
   * تصدير التاريخ
   */
  export(): { states: HistoryState[]; branches: HistoryBranch[] } {
    return {
      states: Array.from(this.states.values()),
      branches: Array.from(this.branches.values())
    };
  }
  
  /**
   * استيراد التاريخ
   */
  import(data: { states: HistoryState[]; branches: HistoryBranch[] }): void {
    this.clear();
    
    data.states.forEach(state => {
      this.states.set(state.id, state);
    });
    
    data.branches.forEach(branch => {
      this.branches.set(branch.id, branch);
    });
    
    // العودة للفرع الرئيسي
    this.switchBranch('main');
  }
}

// تصدير instance واحد
export const historyManager = new HistoryManager();
