import React, { useMemo, useState } from 'react';
import {
  MoreVertical,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  Layout,
  CheckSquare,
  Archive,
  FolderPlus,
  X,
  Check,
  MousePointer as MousePointerSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlanningStore } from '@/stores/planningStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';

const BoardsGrid = () => {
  const { boards, deleteBoard, archiveBoard, renameBoard, duplicateBoard, setCurrentBoard } =
    usePlanningStore();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const enterSelection = (seedId?: string) => {
    setSelectionMode(true);
    setSelectedIds(seedId ? new Set([seedId]) : new Set());
  };

  const exitSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) {
        // auto-exit when nothing is selected
        setTimeout(() => setSelectionMode(false), 0);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(boards.map((b) => b.id)));

  const bulkDelete = async () => {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) => deleteBoard(id)));
    toast.success(`تم حذف ${ids.length} لوحة`);
    exitSelection();
  };

  const bulkArchive = async () => {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) => archiveBoard(id)));
    toast.success(`تمت أرشفة ${ids.length} لوحة`);
    exitSelection();
  };

  const bulkGroupIntoFile = () => {
    toast.info(`سيتم جمع ${selectedIds.size} لوحة في ملف (قريباً)`);
  };

  const handleRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setNewName(currentName);
  };

  const confirmRename = (id: string) => {
    if (newName.trim()) renameBoard(id, newName);
    setRenamingId(null);
  };

  const handleSelectBoard = (board: any) => setCurrentBoard(board);

  const selectionToolbar = useMemo(() => {
    if (!selectionMode) return null;
    return (
      <SelectionToolbar
        selectedCount={selectedIds.size}
        totalCount={boards.length}
        onSelectAll={selectAll}
        onDelete={bulkDelete}
        onArchive={bulkArchive}
        onGroup={bulkGroupIntoFile}
        onExit={exitSelection}
      />
    );
  }, [selectionMode, selectedIds, boards.length]);

  if (boards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[hsl(var(--panel))] mx-auto mb-4 flex items-center justify-center">
            <Layout size={48} className="text-[hsl(var(--ink-30))]" />
          </div>
          <p className="text-[16px] text-[hsl(var(--ink-60))]">لا توجد لوحات محفوظة بعد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {selectionToolbar}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {boards.map((board, index) => {
          const isSelected = selectedIds.has(board.id);
          const onCardClick = () => {
            if (selectionMode) toggleSelect(board.id);
            else handleSelectBoard(board);
          };
          return (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <div
                onClick={selectionMode ? onCardClick : undefined}
                className={`rounded-lg bg-white border overflow-hidden transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
                  isSelected
                    ? 'border-[hsl(var(--ink))] ring-2 ring-[hsl(var(--ink))]'
                    : 'border-[hsl(var(--border))]'
                } ${selectionMode ? 'cursor-pointer' : ''}`}
              >
                <div
                  onClick={selectionMode ? undefined : onCardClick}
                  className="h-40 bg-[hsl(var(--panel))] cursor-pointer flex items-center justify-center relative overflow-hidden"
                >
                  {board.thumbnailUrl ? (
                    <img src={board.thumbnailUrl} alt={board.name} className="w-full h-full object-cover" />
                  ) : (
                    <Layout size={48} className="text-[hsl(var(--ink-30))]" />
                  )}
                  {!selectionMode && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink size={32} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {renamingId === board.id ? (
                    <input
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => confirmRename(board.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename(board.id);
                        if (e.key === 'Escape') setRenamingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-[16px] font-semibold text-[hsl(var(--ink))] bg-[hsl(var(--panel))] px-2 py-1 rounded outline-none"
                    />
                  ) : (
                    <h3 className="text-[16px] font-semibold text-[hsl(var(--ink))] mb-2 truncate">
                      {board.name}
                    </h3>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={board.status} />
                      <span className="text-[12px] text-[hsl(var(--ink-60))]">
                        {format(new Date(board.lastModified), 'dd MMM yyyy', { locale: ar })}
                      </span>
                    </div>

                    {selectionMode ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(board.id);
                        }}
                        aria-label={isSelected ? 'إلغاء التحديد' : 'تحديد'}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[hsl(var(--ink))] border-[hsl(var(--ink))]'
                            : 'bg-transparent border-[hsl(var(--ink))]'
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                      </button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-[hsl(var(--panel))] rounded transition-colors">
                            <MoreVertical size={16} className="text-[hsl(var(--ink-60))]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleSelectBoard(board)} className="gap-3 justify-between">
                            <span>فتح</span>
                            <ExternalLink size={16} className="opacity-70 shrink-0" />
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRename(board.id, board.name)} className="gap-3 justify-between">
                            <span>إعادة تسمية</span>
                            <Edit2 size={16} className="opacity-70 shrink-0" />
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateBoard(board.id)} className="gap-3 justify-between">
                            <span>نسخ</span>
                            <Copy size={16} className="opacity-70 shrink-0" />
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => enterSelection(board.id)} className="gap-3 justify-between">
                            <span>تحديد</span>
                            <MousePointerSquare size={16} className="opacity-70 shrink-0" />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteBoard(board.id)}
                            className="text-red-600 gap-3 justify-between"
                          >
                            <span>حذف</span>
                            <Trash2 size={16} className="opacity-70 shrink-0" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const SelectionToolbar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDelete,
  onArchive,
  onGroup,
  onExit,
}: {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onGroup: () => void;
  onExit: () => void;
}) => {
  const disabled = selectedCount === 0;
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-white border border-[hsl(var(--border))] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.06)]">
      <span className="text-[13px] font-semibold text-[hsl(var(--ink))]">
        {selectedCount} / {totalCount} محدد
      </span>
      <div className="flex items-center gap-1">
        <ToolbarBtn label="تحديد الكل" onClick={onSelectAll} icon={<CheckSquare size={16} />} />
        <ToolbarBtn label="حذف" onClick={onDelete} icon={<Trash2 size={16} />} disabled={disabled} tone="danger" />
        <ToolbarBtn label="أرشفة" onClick={onArchive} icon={<Archive size={16} />} disabled={disabled} />
        <ToolbarBtn label="جمع في ملف" onClick={onGroup} icon={<FolderPlus size={16} />} disabled={disabled} />
        <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />
        <ToolbarBtn label="إنهاء التحديد" onClick={onExit} icon={<X size={16} />} />
      </div>
    </div>
  );
};

const ToolbarBtn = ({
  label,
  onClick,
  icon,
  disabled,
  tone,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  tone?: 'danger';
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`p-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      tone === 'danger'
        ? 'text-red-600 hover:bg-red-50'
        : 'text-[hsl(var(--ink))] hover:bg-[hsl(var(--panel))]'
    }`}
  >
    {icon}
  </button>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: { label: 'نشط', color: 'hsl(var(--accent-green))' },
    draft: { label: 'مسودة', color: 'hsl(var(--accent-yellow))' },
    archived: { label: 'مؤرشف', color: 'hsl(var(--ink-30))' },
  };
  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <span
      className="text-[10px] font-medium px-2 py-1 rounded-full"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      {config.label}
    </span>
  );
};

export default BoardsGrid;
