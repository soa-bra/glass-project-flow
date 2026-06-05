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
import type { PlanningElementPersistenceState, PlanningElementPersistenceStatus } from '@/features/planning/hooks/usePlanningElementPersistence';
import { PresenceAvatars } from '../collaboration/PresenceAvatars';
import { RealtimeStatusBadge } from '../collaboration/RealtimeStatusBadge';
import type { PresencePeer, RealtimeConnectionStatus } from '../../hooks/usePlanningRealtime';
import { Users } from 'lucide-react';

interface CanvasToolbarProps {
  board: CanvasBoard;
  onBack: () => void;
  peers?: PresencePeer[];
  selfName?: string;
  realtimeStatus?: RealtimeConnectionStatus;
  lastSyncAt?: number | null;
  canEdit?: boolean;
  elementPersistence?: PlanningElementPersistenceState;
}

export function formatElementPersistenceStatusLabel(status: PlanningElementPersistenceStatus): string {
  switch (status) {
    case 'pending':
      return 'تغييرات عناصر بانتظار الحفظ';
    case 'saving':
      return 'جارٍ حفظ العناصر';
    case 'saved':
      return 'العناصر محفوظة';
    case 'error':
      return 'فشل حفظ العناصر';
    case 'disabled':
      return 'حفظ العناصر للقراءة فقط';
    case 'idle':
    default:
      return 'حفظ العناصر جاهز';
  }
}

function getElementPersistenceBadgeClass(status: PlanningElementPersistenceStatus): string {
  switch (status) {
    case 'pending':
    case 'saving':
      return 'bg-[#FFF7D6] text-[#8A5A00] border-[#F3D56B]';
    case 'saved':
      return 'bg-[#E6F7EF] text-[#177A50] border-[#A7E3C5]';
    case 'error':
      return 'bg-[#FDECEC] text-[#B42318] border-[#F5B5B0]';
    case 'disabled':
      return 'bg-sb-panel-bg text-sb-ink/60 border-sb-border';
    case 'idle':
    default:
      return 'bg-sb-panel-bg text-sb-ink/70 border-sb-border';
  }
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  board,
  onBack,
  peers = [],
  selfName,
  realtimeStatus = 'idle',
  lastSyncAt = null,
  canEdit: _canEdit = true,
  elementPersistence,
}) => {
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
  const elementPersistenceLabel = elementPersistence
    ? formatElementPersistenceStatusLabel(elementPersistence.status)
    : null;
  const saveButtonLabel = status === 'saving' ? 'جارٍ الحفظ' : status === 'saved' ? 'تم الحفظ' : 'حفظ';
  const saveButtonDisabled = !canSave || (!isDirty && status === 'clean');

  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-white border-b border-sb-border">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 hover:bg-sb-panel-bg rounded-lg transition-colors" aria-label="العودة إلى القائمة">
          <ArrowRight size={16} className="text-sb-ink" />
        </button>
        <div className="h-5 w-px bg-sb-border" />
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
            className="text-[14px] font-bold text-sb-ink px-2 py-0.5 border border-sb-ink rounded focus:outline-none"
            aria-label="اسم اللوحة"
          />
        ) : (
          <h2
            className="text-[14px] font-bold text-sb-ink cursor-pointer hover:bg-sb-panel-bg px-2 py-0.5 rounded"
            onDoubleClick={() => setIsEditingName(true)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(true)}
          >
            {board.name || 'لوحة جديدة'}
          </h2>
        )}
        <span className="text-[10px] text-sb-ink-40">{saveLabel}</span>
        {elementPersistence && elementPersistenceLabel && (
          <span
            className={`max-w-[180px] truncate rounded-full border px-2 py-0.5 text-[10px] font-medium ${getElementPersistenceBadgeClass(elementPersistence.status)}`}
            title={elementPersistence.error ?? elementPersistenceLabel}
          >
            {elementPersistenceLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <RealtimeStatusBadge status={realtimeStatus} lastSyncAt={lastSyncAt} />

        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-sb-panel-bg border border-sb-border"
          aria-label="المتعاونون النشِطون"
          dir="rtl"
        >
          <Users size={12} className="text-sb-ink/70" />
          <span className="text-[11px] font-semibold text-sb-ink">
            {peers.length + 1}
          </span>
          {selfName && (
            <span className="text-[11px] text-sb-ink/70 max-w-[120px] truncate">
              أنت: {selfName}
            </span>
          )}
          <PresenceAvatars peers={peers} />
        </div>

        <div className="h-5 w-px bg-sb-border" />
        <div className="relative">
          <button onClick={() => setIsShareOpen(!isShareOpen)} className="flex items-center gap-1.5 px-3 py-1 bg-sb-ink text-white rounded-full transition-opacity hover:opacity-90">
            <Share2 size={14} />
            <span className="text-[11px] font-medium">المشاركين</span>
          </button>
          <SharePopover isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} boardId={board.id} />
        </div>




        <div className="relative">
          <button onClick={() => setIsFileMenuOpen(!isFileMenuOpen)} className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-sb-panel-bg rounded-lg transition-colors">
            <File size={14} className="text-sb-ink" />
            <span className="text-[11px] font-medium text-sb-ink">ملف</span>
          </button>
          <FileMenuPopover isOpen={isFileMenuOpen} onClose={() => setIsFileMenuOpen(false)} />
        </div>

        <div className="relative">
          <button onClick={() => setIsLayersOpen(!isLayersOpen)} className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-sb-panel-bg rounded-lg transition-colors">
            <Layers size={14} className="text-sb-ink" />
            <span className="text-[11px] font-medium text-sb-ink">الطبقات</span>
          </button>
          <LayersMenuPopover isOpen={isLayersOpen} onClose={() => setIsLayersOpen(false)} />
        </div>

        <div className="relative">
          <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-sb-panel-bg rounded-lg transition-colors">
            <Clock size={14} className="text-sb-ink" />
            <span className="text-[11px] font-medium text-sb-ink">السجل</span>
          </button>
          <HistoryPopover isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>

        <div className="relative">
          <button onClick={() => setIsPropertiesOpen(!isPropertiesOpen)} className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-sb-panel-bg rounded-lg transition-colors">
            <Settings size={14} className="text-sb-ink" />
          </button>
          <CanvasPropertiesPopover isOpen={isPropertiesOpen} onClose={() => setIsPropertiesOpen(false)} />
        </div>

        <div className="h-5 w-px bg-sb-border mx-1" />

        <button onClick={undo} disabled={!canUndo} className={`p-1.5 rounded-lg transition-colors ${canUndo ? 'hover:bg-sb-panel-bg text-sb-ink' : 'text-sb-ink-20 cursor-not-allowed'}`}>
          <RotateCcw size={14} />
        </button>
        <button onClick={redo} disabled={!canRedo} className={`p-1.5 rounded-lg transition-colors ${canRedo ? 'hover:bg-sb-panel-bg text-sb-ink' : 'text-sb-ink-20 cursor-not-allowed'}`}>
          <RotateCw size={14} />
        </button>
      </div>

      <button
        onClick={() => void saveBoardState()}
        disabled={saveButtonDisabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] transition-opacity ${saveButtonDisabled ? 'bg-[#A7CDBD] text-white cursor-not-allowed' : 'bg-[#3DBE8B] text-white hover:opacity-90'}`}
      >
        <Save size={14} />
        <span className="text-[11px] font-medium">{saveButtonLabel}</span>
      </button>
    </div>
  );
};

export default CanvasToolbar;
