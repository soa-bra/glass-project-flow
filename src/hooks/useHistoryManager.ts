/**
 * useHistoryManager - Hook للتكامل مع نظام التاريخ
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { historyManager, HistoryBranch, HistoryState } from '@/core/historyManager';
import { Operation, OperationType, otEngine } from '@/core/operationalTransform';
import { useCanvasStore } from '@/stores/canvasStore';

interface UseHistoryManagerResult {
  // حالة Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  
  // العمليات
  undo: () => void;
  redo: () => void;
  
  // تسجيل العمليات
  recordInsert: (elementId: string, element: Record<string, any>) => void;
  recordDelete: (elementId: string, previousState: Record<string, any>) => void;
  recordUpdate: (elementId: string, before: Record<string, any>, after: Record<string, any>, path?: string[]) => void;
  recordMove: (elementId: string | string[], before: { x: number; y: number }, after: { x: number; y: number }) => void;
  recordResize: (elementId: string, before: { width: number; height: number }, after: { width: number; height: number }) => void;
  recordGroup: (operations: Operation[], label?: string) => void;
  
  // الفروع
  branches: HistoryBranch[];
  currentBranch: HistoryBranch | undefined;
  createBranch: (name: string) => HistoryBranch | null;
  switchBranch: (branchId: string) => boolean;
  mergeBranch: (sourceBranchId: string) => void;
  
  // التاريخ
  history: HistoryState[];
  goToState: (stateId: string) => void;
  
  // أدوات
  clear: () => void;
}

export function useHistoryManager(): UseHistoryManagerResult {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
  const [branches, setBranches] = useState<HistoryBranch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<HistoryBranch | undefined>();
  const [history, setHistory] = useState<HistoryState[]>([]);
  
  const userId = useRef(`user_${Math.random().toString(36).substr(2, 9)}`);
  
  const { 
    addElement, 
    updateElement, 
    deleteElement, 
    moveElements
  } = useCanvasStore();
  
  // الاشتراك في تغييرات التاريخ
  useEffect(() => {
    const unsubscribe = historyManager.addListener({
      onStateChange: (newCanUndo, newCanRedo) => {
        setCanUndo(newCanUndo);
        setCanRedo(newCanRedo);
        setUndoCount(historyManager.getUndoCount());
        setRedoCount(historyManager.getRedoCount());
        setHistory(historyManager.getHistory());
      },
      onBranchChange: (newBranches) => {
        setBranches(newBranches);
        setCurrentBranch(historyManager.getCurrentBranch());
      }
    });
    
    // تحديث الحالة الأولية
    setCanUndo(historyManager.canUndo());
    setCanRedo(historyManager.canRedo());
    setBranches(historyManager.getBranches());
    setCurrentBranch(historyManager.getCurrentBranch());
    setHistory(historyManager.getHistory());
    
    return unsubscribe;
  }, []);
  
  // إنشاء عملية
  const createOperation = useCallback((
    type: OperationType,
    targetId: string | string[],
    data: Record<string, any>
  ): Operation => {
    return {
      id: otEngine.generateOperationId(),
      type,
      timestamp: Date.now(),
      userId: userId.current,
      targetId,
      data,
      metadata: { source: 'local' }
    };
  }, []);
  
  // تسجيل إضافة عنصر
  const recordInsert = useCallback((elementId: string, element: Record<string, any>) => {
    const operation = createOperation('insert', elementId, { element });
    historyManager.recordOperation(operation);
  }, [createOperation]);
  
  // تسجيل حذف عنصر
  const recordDelete = useCallback((elementId: string, previousState: Record<string, any>) => {
    const operation = createOperation('delete', elementId, { previousState });
    historyManager.recordOperation(operation);
  }, [createOperation]);
  
  // تسجيل تحديث
  const recordUpdate = useCallback((
    elementId: string,
    before: Record<string, any>,
    after: Record<string, any>,
    path?: string[]
  ) => {
    const operation = createOperation('update', elementId, { before, after, path });
    historyManager.recordOperation(operation);
  }, [createOperation]);
  
  // تسجيل تحريك
  const recordMove = useCallback((
    elementId: string | string[],
    before: { x: number; y: number },
    after: { x: number; y: number }
  ) => {
    const operation = createOperation('move', elementId, { before, after });
    historyManager.recordOperation(operation);
  }, [createOperation]);
  
  // تسجيل تغيير الحجم
  const recordResize = useCallback((
    elementId: string,
    before: { width: number; height: number },
    after: { width: number; height: number }
  ) => {
    const operation = createOperation('resize', elementId, { before, after });
    historyManager.recordOperation(operation);
  }, [createOperation]);
  
  // تسجيل مجموعة عمليات
  const recordGroup = useCallback((operations: Operation[], label?: string) => {
    historyManager.recordOperationGroup(operations, label);
  }, []);
  
  // تطبيق العمليات على الـ store
  const applyOperations = useCallback((operations: Operation[]) => {
    operations.forEach(op => {
      switch (op.type) {
        case 'insert':
          addElement(op.data.element);
          break;
          
        case 'delete':
          deleteElement(Array.isArray(op.targetId) ? op.targetId[0] : op.targetId);
          break;
          
        case 'update':
          const targetId = Array.isArray(op.targetId) ? op.targetId[0] : op.targetId;
          updateElement(targetId, op.data.after);
          break;
          
        case 'move':
          const moveTargets = Array.isArray(op.targetId) ? op.targetId : [op.targetId];
          const dx = op.data.after.x - op.data.before.x;
          const dy = op.data.after.y - op.data.before.y;
          moveElements(moveTargets, dx, dy);
          break;
          
        case 'resize':
          const resizeTarget = Array.isArray(op.targetId) ? op.targetId[0] : op.targetId;
          updateElement(resizeTarget, {
            size: {
              width: op.data.after.width,
              height: op.data.after.height
            }
          });
          break;
      }
    });
  }, [addElement, deleteElement, updateElement, moveElements]);
  
  // التراجع
  const undo = useCallback(() => {
    const operations = historyManager.undo();
    if (operations) {
      applyOperations(operations);
    }
  }, [applyOperations]);
  
  // الإعادة
  const redo = useCallback(() => {
    const operations = historyManager.redo();
    if (operations) {
      applyOperations(operations);
    }
  }, [applyOperations]);
  
  // إنشاء فرع
  const handleCreateBranch = useCallback((name: string) => {
    return historyManager.createBranch(name);
  }, []);
  
  // التبديل للفرع
  const handleSwitchBranch = useCallback((branchId: string) => {
    return historyManager.switchBranch(branchId);
  }, []);
  
  // دمج فرع
  const handleMergeBranch = useCallback((sourceBranchId: string) => {
    const operations = historyManager.mergeBranch(sourceBranchId);
    applyOperations(operations);
  }, [applyOperations]);
  
  // الانتقال لحالة
  const handleGoToState = useCallback((stateId: string) => {
    const operations = historyManager.goToState(stateId);
    applyOperations(operations);
  }, [applyOperations]);
  
  // مسح التاريخ
  const clear = useCallback(() => {
    historyManager.clear();
  }, []);
  
  return {
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    undo,
    redo,
    recordInsert,
    recordDelete,
    recordUpdate,
    recordMove,
    recordResize,
    recordGroup,
    branches,
    currentBranch,
    createBranch: handleCreateBranch,
    switchBranch: handleSwitchBranch,
    mergeBranch: handleMergeBranch,
    history,
    goToState: handleGoToState,
    clear
  };
}
