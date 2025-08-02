
import React from 'react';
import { UnifiedSearchBar } from '@/components/shared/UnifiedSearchBar';
import { SPACING } from '@/components/shared/design-system/constants';

interface DocumentsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DocumentsSearchBar: React.FC<DocumentsSearchBarProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className={`px-6 ${SPACING.CARD_MARGIN}`}>
      <UnifiedSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        placeholder="البحث في الوثائق..."
      />
    </div>
  );
};
