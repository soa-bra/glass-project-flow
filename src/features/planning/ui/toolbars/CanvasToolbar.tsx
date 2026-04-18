import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  RotateCcw,
  RotateCw,
  Save,
  Clock,
  Share2,
  Settings,
  File,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { usePlanningStore } from '@/stores/planningStore';
import type { CanvasBoard } from '@/types/planning';
import { HistoryPopover } from '../overlays/HistoryPopover';
import { SharePopover } from '../overlays/SharePopover';
import { CanvasPropertiesPopover } from '../overlays/CanvasPropertiesPopover';
import { FileMenuPopover } from '../overlays/FileMenuPopover';
import { LayersMenuPopover } from '../overlays/LayersMenuPopover';
import { useBoardSaveState, formatBoardSaveStatusLabel } from '@/features/planning/hooks/useBoardSaveState';

interface CanvasToolbarProps {
  board: CanvasBoard;
  onBack: () => void;
  onOpenAI: () => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ board, onBack, onOpenAI }) => {
  const { undo, redo, history } = useCanvasStore();
  const { renameBoard } = usePlanningStore();
  const { status, lastSavedAt, canSave, saveBoardState, isDirty } = useBoardSaveState(board);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [boardName, setBoardName] = useState(board.name || 'لوحة جديدة');

  useEffect(() => {
    setBoardName(board.name || 'لوحة جديدة');
  }, [board.id, board.name]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (canSave) {
          void saveBoardState();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canSave, saveBoardState]);

  const handleSaveName = () => {
    const trimmedName = boardName.trim();
    if (!trimmedName) {
      setBoardName(board.name || 'لوحة جديدة');
      setIsEditingName(false);
      return;
    }

    if (trimmedName !== board.name) {
      renameBoard(board.id, trimmedName);
    }

    setIsEditingName(false);
  };

  const saveLabel = useMemo(() => formatBoardSaveStatusLabel(status, lastSavedAt), [status, lastSavedAt]);
  const saveButtonLabel = status === 'saving' ? 'جارٍ الحفظ' : status === 'saved' ? 'تم الحفظ' : 'حفظ';
  const saveButtonDisabled = !canSave || (!isDirty && status === 'clean');

  return (
    <div
      className="flex items-center justify-between px-6 py-3 bg-white border-b border-sb-border"
      role="toolbar"
      aria-label="شريط أدوات اللوحة"
      aria-orientation="horizontal"
    >
      <div className="flex items-center gap-4" role="group" aria-label="التنقل واسم اللوحة">
        <button
          onClick={onBack}
          className="p-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
          aria-label="العودة إلى القائمة"
        >
          <ArrowRight size={20} className="text-sb-ink" aria-hidden="true" />
        </button>

        <div className="h-6 w-px bg-sb-border" role="separator" aria-orientation="vertical" />

        {isEditingName ? (
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveName();
              if (e.key === 'Escape') {
                setBoardName(board.name || 'لوحة جديدة');
                setIsEditingName(false);
              }
            }}
            autoFocus
            className="text-[16px] font-bold text-sb-ink px-2 py-1 border border-sb-ink rounded focus:outline-none"
            aria-label="اسم اللوحة"
          />
        ) : (
          <h2
            className="text-[16px] font-bold text-sb-ink cursor-pointer hover:bg-sb-panel-bg px-2 py-1 rounded"
            onDoubleClick={() => setIsEditingName(true)}
            tabIndex={0}
            role="button"
            aria-label={`اسم اللوحة: ${board.name || 'لوحة جديدة'}. انقر مرتين للتعديل`}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(true)}
          >
            {board.name || 'لوحة جديدة'}
          </h2>
        )}

        <span className="text-[11px] text-sb-ink-40" aria-live="polite">
          {saveLabel}
        </span>
      </div>

      <div className="flex items-center gap-2" role="group" aria-label="أدوات التحكم العامة">
        <div className="relative">
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="flex items-center gap-2 px-4 py-1.5 bg-sb-ink text-white rounded-full transition-opacity hover:opacity-90"
            aria-label="مشاركة اللوحة"
            aria-haspopup="dialog"
            aria-expanded={isShareOpen}
          >
            <Share2 size={18} aria-hidden="true" />
            <span className="text-[12px] font-medium">المشاركين</span>
          </button>
          <SharePopover isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} boardId={board.id} />
        </div>

        <button
          onClick={onOpenAI}
          className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-full hover:opacity-90 transition-opacity"
          aria-label="فتح شريط أوامر الذكاء الصناعي"
        >
          <Sparkles size={18} className="animate-pulse" aria-hidden="true" />
          <span className="text-[12px] font-medium">AI</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="قائمة الملف"
            aria-haspopup="menu"
            aria-expanded={isFileMenuOpen}
          >
            <File size={18} className="text-sb-ink" aria-hidden="true" />
            <span className="text-[13px] font-medium text-sb-ink">ملف</span>
          </button>
          <FileMenuPopover isOpen={isFileMenuOpen} onClose={() => setIsFileMenuOpen(false)} />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="إدارة الطبقات"
            aria-haspopup="dialog"
            aria-expanded={isLayersOpen}
          >
            <Layers size={18} className="text-sb-ink" aria-hidden="true" />
            <span className="text-[13px] font-medium text-sb-ink">الطبقات</span>
          </button>
          <LayersMenuPopover isOpen={isLayersOpen} onClose={() => setIsLayersOpen(false)} />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="سجل العمليات"
            aria-haspopup="dialog"
            aria-expanded={isHistoryOpen}
          >
            <Clock size={18} className="text-sb-ink" aria-hidden="true" />
            <span className="text-[13px] font-medium text-sb-ink">السجل</span>
          </button>
          <HistoryPopover isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="خصائص اللوحة"
            aria-haspopup="dialog"
            aria-expanded={isPropertiesOpen}
          >
            <Settings size={18} className="text-sb-ink" aria-hidden="true" />
          </button>
          <CanvasPropertiesPopover isOpen={isPropertiesOpen} onClose={() => setIsPropertiesOpen(false)} />
        </div>

        <div className="h-6 w-px bg-sb-border mx-2" role="separator" aria-orientation="vertical" />

        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo ? 'hover:bg-sb-panel-bg text-sb-ink' : 'text-sb-ink-20 cursor-not-allowed'
          }`}
          aria-label="تراجع عن آخر إجراء"
          aria-disabled={!canUndo}
          aria-keyshortcuts="Control+Z"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo ? 'hover:bg-sb-panel-bg text-sb-ink' : 'text-sb-ink-20 cursor-not-allowed'
          }`}
          aria-label="إعادة الإجراء الملغي"
          aria-disabled={!canRedo}
          aria-keyshortcuts="Control+Shift+Z Control+Y"
        >
          <RotateCw size={18} aria-hidden="true" />
        </button>
      </div>

      <button
        onClick={() => void saveBoardState()}
        disabled={saveButtonDisabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-[10px] transition-opacity ${
          saveButtonDisabled ? 'bg-[#A7CDBD] text-white cursor-not-allowed' : 'bg-[#3DBE8B] text-white hover:opacity-90'
        }`}
        aria-label="حفظ اللوحة"
        aria-keyshortcuts="Control+S Meta+S"
      >
        <Save size={16} aria-hidden="true" />
        <span className="text-[13px] font-medium">{saveButtonLabel}</span>
      </button>
    </div>
  );
};

export default CanvasToolbar;
