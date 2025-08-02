
import React from 'react';
import { Download, Eye } from 'lucide-react';
import { UnifiedArchiveItem } from '@/components/shared/UnifiedArchiveItem';
import { UnifiedActionButton } from '@/components/ui/UnifiedActionButton';
import { SPACING } from '@/components/shared/design-system/constants';

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  author: string;
  department: string;
  version: string;
  classification: string;
  tags: string[];
}

interface DocumentsListItemProps {
  document: Document;
}

export const DocumentsListItem: React.FC<DocumentsListItemProps> = ({ document }) => {
  return (
    <div className="relative">
      <UnifiedArchiveItem
        item={document}
        className="pr-20"
      />
      
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <UnifiedActionButton
          icon={Eye}
          variant="view"
          size="sm"
        />
        <UnifiedActionButton
          icon={Download}
          variant="download"
          size="sm"
        />
      </div>
    </div>
  );
};
