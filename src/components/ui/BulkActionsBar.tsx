
import React from 'react';
import { Trash2, Archive } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onArchive: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onDelete,
  onArchive
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <span 
        className="text-sm text-gray-600 font-arabic"
        style={{ fontFamily: 'IBM Plex Sans Arabic' }}
      >
        {selectedCount} محدد
      </span>
      <button
        onClick={onArchive}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-arabic"
        style={{ fontFamily: 'IBM Plex Sans Arabic' }}
      >
        <Archive size={14} />
        أرشفة
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-arabic"
        style={{ fontFamily: 'IBM Plex Sans Arabic' }}
      >
        <Trash2 size={14} />
        حذف
      </button>
    </div>
  );
};
