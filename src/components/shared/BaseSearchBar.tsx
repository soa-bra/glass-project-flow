import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildCardClasses, TYPOGRAPHY, LAYOUT } from './design-system/constants';

interface UnifiedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const BaseSearchBar: React.FC<UnifiedSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'البحث...',
  className = '',
}) => {
  return (
    <div className={cn(buildCardClasses('p-4'), className)}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pr-12 pl-4 py-3 border border-black/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 ${TYPOGRAPHY.ARABIC_FONT}`}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
};