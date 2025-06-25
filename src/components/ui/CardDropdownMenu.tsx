
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface CardDropdownMenuProps {
  onSelect: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export const CardDropdownMenu: React.FC<CardDropdownMenuProps> = ({
  onSelect,
  onEdit,
  onArchive,
  onDelete
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 font-arabic"
          style={{
            backgroundColor: '#F7FFFF',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#858789',
            fontFamily: 'IBM Plex Sans Arabic',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-50"
      >
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm font-arabic"
          style={{ fontFamily: 'IBM Plex Sans Arabic' }}
        >
          تحديد
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm font-arabic"
          style={{ fontFamily: 'IBM Plex Sans Arabic' }}
        >
          تعديل
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
          className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm font-arabic"
          style={{ fontFamily: 'IBM Plex Sans Arabic' }}
        >
          أرشفة
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm text-red-600 font-arabic"
          style={{ fontFamily: 'IBM Plex Sans Arabic' }}
        >
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
