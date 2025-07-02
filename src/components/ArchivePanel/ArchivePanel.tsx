
import React from 'react';
import { ArchivePanelLayout } from './ArchivePanelLayout';
import { SpecializedArchivePanel } from './SpecializedArchivePanel';
import { GenericArchivePanel } from './GenericArchivePanel';
import { EmptyArchiveState } from './EmptyArchiveState';

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

  // Categories with specialized panels
  const specializedCategories = ['documents', 'projects', 'media', 'financial', 'contracts'];
  
  if (specializedCategories.includes(selectedCategory)) {
    return (
      <ArchivePanelLayout>
        <SpecializedArchivePanel selectedCategory={selectedCategory} />
      </ArchivePanelLayout>
    );
  }

  // Generic categories with tabbed interface
  return (
    <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
      <GenericArchivePanel selectedCategory={selectedCategory} />
    </div>
  );
};

export default ArchivePanel;
