import React, { useState } from 'react';
import SettingsSidebar from './SettingsSidebar';
import SettingsPanel from './SettingsPanel';

interface SettingsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSettingsSidebarCollapsed, setIsSettingsSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Settings Categories Sidebar */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] sidebar-transition ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        }`}
        style={{
          top: 'var(--sidebar-top-offset)',
          zIndex: 110,
        }}
      >
        <SettingsSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isCollapsed={isSettingsSidebarCollapsed}
          onToggleCollapse={setIsSettingsSidebarCollapsed}
        />
      </div>

      {/* Settings Content Panel */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] content-slide-in ${
          isSidebarCollapsed 
            ? (isSettingsSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed') 
            : (isSettingsSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded')
        }`}
      >
        <SettingsPanel 
          selectedCategory={selectedCategory}
          isMainSidebarCollapsed={isSidebarCollapsed}
          isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default SettingsWorkspace;