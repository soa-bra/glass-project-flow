import React, { useState } from 'react';
import PlanningSidebar from './PlanningSidebar';
import PlanningPanel from './PlanningPanel';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPlanningSidebarCollapsed, setIsPlanningSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Planning Categories Sidebar */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        }`}
        style={{
          top: 'var(--sidebar-top-offset)',
          zIndex: 110,
        }}
      >
        <PlanningSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isCollapsed={isPlanningSidebarCollapsed}
          onToggleCollapse={setIsPlanningSidebarCollapsed}
        />
      </div>

      {/* Planning Content Panel */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed 
            ? (isPlanningSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed') 
            : (isPlanningSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded')
        }`}
      >
        <PlanningPanel 
          selectedCategory={selectedCategory}
          isMainSidebarCollapsed={isSidebarCollapsed}
          isPlanningSidebarCollapsed={isPlanningSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default PlanningWorkspace;