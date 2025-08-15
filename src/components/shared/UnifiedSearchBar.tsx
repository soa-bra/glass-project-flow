import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoaCard, SoaIcon } from '@/components/ui';
import { buildCardClasses, TYPOGRAPHY, LAYOUT } from './design-system/constants';

interface UnifiedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'البحث...',
  className = '',
}) => {
  return (
    <SoaCard className={cn('', className)}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pr-12 pl-4 py-3 bg-transparent border border-soabra-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-soabra-ink-30 font-arabic text-soabra-ink"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soabra-ink-60 w-5 h-5" />
      </div>
    </SoaCard>
  );
};