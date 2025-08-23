// ===============================
// Board Name - Editable Board Title
// اسم اللوحة - عنوان قابل للتعديل
// ===============================

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { COLORS, TYPOGRAPHY, LAYOUT } from '@/components/shared/design-system/constants';
import { useCanvasStore } from '../../store/canvas.store';
import { Edit2, Check, X } from 'lucide-react';

export const BoardName: React.FC = () => {
  const { board, updateBoardName } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (!board) return;
    setEditValue(board.name);
    setIsEditing(true);
  };

  const confirmEdit = () => {
    if (editValue.trim() && board) {
      updateBoardName(editValue.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      confirmEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  if (!board) return null;

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={confirmEdit}
            className={cn(
              "px-3 py-1 rounded-lg border",
              "bg-sb-white border-sb-border",
              "text-right",
              TYPOGRAPHY.H3,
              TYPOGRAPHY.ARABIC_FONT,
              COLORS.PRIMARY_TEXT,
              "focus:outline-none focus:ring-2 focus:ring-sb-ink/20",
              "min-w-48"
            )}
            placeholder="اسم اللوحة"
          />
          <button
            onClick={confirmEdit}
            className={cn(
              "p-1 rounded hover:bg-sb-border/50 transition-colors",
              "text-green-600"
            )}
            title="حفظ"
          >
            <Check size={16} />
          </button>
          <button
            onClick={cancelEdit}
            className={cn(
              "p-1 rounded hover:bg-sb-border/50 transition-colors",
              "text-red-600"
            )}
            title="إلغاء"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={startEditing}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-lg",
            "hover:bg-sb-border/30 transition-colors group",
            "text-right"
          )}
          title="تعديل اسم اللوحة"
        >
          <h1 className={cn(
            TYPOGRAPHY.H3,
            TYPOGRAPHY.ARABIC_FONT,
            COLORS.PRIMARY_TEXT,
            "max-w-64 truncate"
          )}>
            {board.name}
          </h1>
          <Edit2 
            size={16} 
            className={cn(
              "opacity-0 group-hover:opacity-70 transition-opacity",
              COLORS.SECONDARY_TEXT
            )}
          />
        </button>
      )}
      
      {/* Board Info */}
      <div className={cn(
        "text-xs px-2 py-1 rounded-full",
        "bg-sb-border/30",
        COLORS.MUTED_TEXT,
        TYPOGRAPHY.ARABIC_FONT
      )}>
        {Object.keys(board.elements || {}).length} عنصر
      </div>
    </div>
  );
};

export default BoardName;