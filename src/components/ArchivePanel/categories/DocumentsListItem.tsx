import React from 'react';
import { Download, Eye } from 'lucide-react';
import { BaseArchiveItem } from '@/components/shared/BaseArchiveItem';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

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
    <div className="relative rounded-[18px] ring-1 ring-[rgba(11,15,18,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
      <BaseArchiveItem item={document} className="pr-20" />
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <BaseActionButton icon={<Eye className="w-4 h-4" />} variant="view" size="sm" />
        <BaseActionButton icon={<Download className="w-4 h-4" />} variant="download" size="sm" />
      </div>
    </div>
  );
};
