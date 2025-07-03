import React, { useState } from 'react';
import PlanningPanel from './PlanningPanel';
import PlanningSidebar from './PlanningSidebar';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('strategic');
  const [isPlanningSidebarCollapsed, setIsPlanningSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Planning Sidebar */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-sidebar-main-collapsed' : 'departments-sidebar-main-expanded'
        }`}
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
            : (isPlanningSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-expanded')
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