
import React, { useState } from 'react';
import ArchiveSidebar from './ArchiveSidebar';
import ArchivePanel from './ArchivePanel';

interface ArchiveWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const ArchiveWorkspace: React.FC<ArchiveWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedArchiveCategory, setSelectedArchiveCategory] = useState<string | null>(null);
  const [isArchiveSidebarCollapsed, setIsArchiveSidebarCollapsed] = useState(false);

  return (
    <>
      {/* العمود الثاني: سايدبار الأرشيف */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        }`}
        style={{
          top: 'var(--sidebar-top-offset)',
          zIndex: 110,
        }}
      >
        <ArchiveSidebar
          selectedCategory={selectedArchiveCategory}
          onCategorySelect={setSelectedArchiveCategory}
          isCollapsed={isArchiveSidebarCollapsed}
          onToggleCollapse={setIsArchiveSidebarCollapsed}
        />
      </div>

      {/* العمود الثالث: لوحة الأرشيف */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed 
            ? (isArchiveSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed') 
            : (isArchiveSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded')
        }`}
      >
        <ArchivePanel 
          selectedCategory={selectedArchiveCategory}
          isMainSidebarCollapsed={isSidebarCollapsed}
          isArchiveSidebarCollapsed={isArchiveSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default ArchiveWorkspace;
