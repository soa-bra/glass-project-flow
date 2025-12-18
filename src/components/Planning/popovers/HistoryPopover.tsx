import React from 'react';
import { Clock, RotateCcw, Undo2, Redo2, GitBranch } from 'lucide-react';
import { useHistoryManager } from '@/hooks/useHistoryManager';

interface HistoryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPopover: React.FC<HistoryPopoverProps> = ({
  isOpen,
  onClose
}) => {
  const {
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    undo,
    redo,
    history,
    goToState,
    branches,
    currentBranch
  } = useHistoryManager();

  if (!isOpen) return null;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    return `منذ ${hours} ساعة`;
  };

  const getOperationLabel = (type: string): string => {
    const labels: Record<string, string> = {
      insert: 'إضافة عنصر',
      delete: 'حذف عنصر',
      update: 'تحديث عنصر',
      move: 'تحريك عنصر',
      resize: 'تغيير الحجم',
      rotate: 'تدوير',
      group: 'تجميع',
      ungroup: 'فك التجميع'
    };
    return labels[type] || type;
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border p-4 z-50 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-sb-ink-40" />
          <h3 className="text-[14px] font-semibold text-sb-ink">سجل العمليات</h3>
          {currentBranch && (
            <span className="text-[11px] text-sb-ink-40 mr-auto flex items-center gap-1">
              <GitBranch size={12} />
              {currentBranch.name}
            </span>
          )}
        </div>

        {/* Undo/Redo Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { undo(); }}
            disabled={!canUndo}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-sb-border hover:bg-sb-panel-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Undo2 size={14} />
            <span className="text-[12px]">تراجع ({undoCount})</span>
          </button>
          <button
            onClick={() => { redo(); }}
            disabled={!canRedo}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-sb-border hover:bg-sb-panel-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Redo2 size={14} />
            <span className="text-[12px]">إعادة ({redoCount})</span>
          </button>
        </div>

        {/* History List */}
        <div className="space-y-1">
          {history.slice().reverse().map((state) => (
            <button
              key={state.id}
              onClick={() => {
                goToState(state.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-sb-panel-bg rounded-lg transition-colors text-right"
            >
              <div className="flex-1">
                <p className="text-[13px] text-sb-ink">
                  {state.label || state.operations.map(op => getOperationLabel(op.type)).join('، ')}
                </p>
                <p className="text-[11px] text-sb-ink-40">{formatTime(state.timestamp)}</p>
              </div>
              <RotateCcw size={14} className="text-sb-ink-40" />
            </button>
          ))}
        </div>

        {history.length === 0 && (
          <p className="text-[12px] text-sb-ink-40 text-center py-8">
            لا توجد عمليات في السجل
          </p>
        )}
      </div>
    </>
  );
};