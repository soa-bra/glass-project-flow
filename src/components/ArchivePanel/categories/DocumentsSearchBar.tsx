
import React from 'react';
import { Search } from 'lucide-react';

interface DocumentsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DocumentsSearchBar: React.FC<DocumentsSearchBarProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="px-6 mb-6">
      <div className="bg-[#f2ffff] p-4 rounded-3xl border border-black/10">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الوثائق..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
