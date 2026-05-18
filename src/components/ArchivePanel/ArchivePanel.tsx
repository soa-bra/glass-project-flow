
import React from 'react';
import { ArchivePanelLayout } from './ArchivePanelLayout';
import { EmptyArchiveState } from './EmptyArchiveState';
import { ArchiveCategoryPanel } from './ArchiveCategoryPanel';

interface ArchivePanelProps {
  selectedCategory: string | null;
  isMainSidebarCollapsed: boolean;
  isArchiveSidebarCollapsed: boolean;
}

const ArchivePanel: React.FC<ArchivePanelProps> = ({
  selectedCategory,
  isMainSidebarCollapsed,
  isArchiveSidebarCollapsed
}) => {
  // Early return for no selection
  if (!selectedCategory) {
    return <EmptyArchiveState />;
  }

  return (
    <ArchivePanelLayout>
      <ArchiveCategoryPanel selectedCategory={selectedCategory} />
    </ArchivePanelLayout>
  );
};

export default ArchivePanel;
