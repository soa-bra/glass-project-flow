
import React from 'react';
import { BaseSearchBar } from '@/components/shared';
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
      <BaseSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        placeholder="البحث في الوثائق..."
      />
    </div>
  );
};
