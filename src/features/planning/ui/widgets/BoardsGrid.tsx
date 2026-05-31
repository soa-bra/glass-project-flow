import React, { useState } from 'react';
import { MoreVertical, Trash2, Edit2, Copy, ExternalLink, Layout } from 'lucide-react';
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

const BoardsGrid = () => {
  const { boards, deleteBoard, renameBoard, duplicateBoard, setCurrentBoard } = usePlanningStore();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setNewName(currentName);
  };

  const confirmRename = (id: string) => {
    if (newName.trim()) {
      renameBoard(id, newName);
    }
    setRenamingId(null);
  };

  const handleSelectBoard = (board: any) => {
    setCurrentBoard(board);
  };

  if (boards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[hsl(var(--panel))] mx-auto mb-4 flex items-center justify-center">
            <Layout size={48} className="text-[hsl(var(--ink-30))]" />
          </div>
          <p className="text-[16px] text-[hsl(var(--ink-60))]">
            لا توجد لوحات محفوظة بعد
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <h2 className="text-[20px] font-bold text-[hsl(var(--ink))] mb-6">
        اللوحات المحفوظة ({boards.length})
      </h2>
      
      <div className="grid grid-cols-4 gap-6">
        {boards.map((board, index) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
          >
            <div className="rounded-[24px] bg-white border border-[hsl(var(--border))] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              {/* Thumbnail */}
              <div
                onClick={() => handleSelectBoard(board)}
                className="h-40 bg-[hsl(var(--panel))] cursor-pointer flex items-center justify-center relative overflow-hidden"
              >
                {board.thumbnailUrl ? (
                  <img src={board.thumbnailUrl} alt={board.name} className="w-full h-full object-cover" />
                ) : (
                  <Layout size={48} className="text-[hsl(var(--ink-30))]" />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink size={32} className="text-white" />
                </div>
              </div>

              {/* Info */}
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

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-[hsl(var(--panel))] rounded transition-colors">
                        <MoreVertical size={16} className="text-[hsl(var(--ink-60))]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleSelectBoard(board)}>
                        <ExternalLink size={14} className="ml-2" />
                        فتح
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRename(board.id, board.name)}>
                        <Edit2 size={14} className="ml-2" />
                        إعادة تسمية
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateBoard(board.id)}>
                        <Copy size={14} className="ml-2" />
                        نسخ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteBoard(board.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={14} className="ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Status Badge Component
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
      style={{ 
        backgroundColor: `${config.color}20`,
        color: config.color 
      }}
    >
      {config.label}
    </span>
  );
};

export default BoardsGrid;
