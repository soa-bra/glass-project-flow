
import React, { useState } from 'react';
import ArchiveSidebar from './ArchiveSidebar';
import ArchivePanel from './ArchivePanel';

interface ArchiveWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const ArchiveWorkspace: React.FC<ArchiveWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isArchiveSidebarCollapsed, setIsArchiveSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Archive Categories Sidebar */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] sidebar-transition ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        }`}
        style={{
          top: 'var(--sidebar-top-offset)',
          zIndex: 110,
        }}
      >
        <ArchiveSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isCollapsed={isArchiveSidebarCollapsed}
          onToggleCollapse={setIsArchiveSidebarCollapsed}
        />
      </div>

      {/* Archive Content Panel */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] content-slide-in ${
          isSidebarCollapsed 
            ? (isArchiveSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed') 
            : (isArchiveSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded')
        }`}
      >
        <ArchivePanel 
          selectedCategory={selectedCategory}
          isMainSidebarCollapsed={isSidebarCollapsed}
          isArchiveSidebarCollapsed={isArchiveSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default ArchiveWorkspace;
