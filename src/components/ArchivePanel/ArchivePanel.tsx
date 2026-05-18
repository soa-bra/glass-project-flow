
import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { canAccessBox } from '@/auth/permissions';
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
  const archiveRead = usePermission('archive.read');
  const archiveExport = usePermission('archive.export');
  const archiveManage = usePermission('archive.manage_docs');
  const granted = new Set<string>();
  if (archiveRead.allowed) granted.add('archive.read');
  if (archiveExport.allowed) granted.add('archive.export');
  if (archiveManage.allowed) granted.add('archive.manage_docs');

  if (archiveRead.isLoading || archiveExport.isLoading || archiveManage.isLoading) {
    return <div className="h-full flex items-center justify-center text-sm text-gray-500">جار التحقق من الصلاحيات...</div>;
  }

  if (!canAccessBox('archive', granted)) {
    return <div className="h-full flex items-center justify-center text-sm text-gray-500">لا تملك صلاحية الوصول إلى الأرشيف.</div>;
  }

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
