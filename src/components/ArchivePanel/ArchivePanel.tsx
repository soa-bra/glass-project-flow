
import React from 'react';
import { ArchivePanelLayout } from './ArchivePanelLayout';
import { EmptyArchiveState } from './EmptyArchiveState';
import { ArchiveCategoryPanel } from './ArchiveCategoryPanel';
import { ManagedBox, type BoxStatus } from '@/components/common/ManagedBox';

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
  const status: BoxStatus = selectedCategory ? 'data' : 'empty';

  return (
    <ArchivePanelLayout>
      <ManagedBox
        boxRef="archive-box"
        title="الأرشيف"
        status={status}
        emptyState={<EmptyArchiveState />}
      >
        {selectedCategory ? <ArchiveCategoryPanel selectedCategory={selectedCategory} /> : null}
      </ManagedBox>
    </ArchivePanelLayout>
  );
};

export default ArchivePanel;
