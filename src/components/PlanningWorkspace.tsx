import React, { useState } from 'react';
import PlanningSidebar from './PlanningSidebar';
import PlanningPanel from './PlanningPanel';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPlanningSidebarCollapsed, setIsPlanningSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Planning Sidebar */}
      <PlanningSidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        isCollapsed={isPlanningSidebarCollapsed}
        onToggleCollapse={setIsPlanningSidebarCollapsed}
      />

      {/* Planning Content Panel - positioned after both sidebars */}
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${
        isSidebarCollapsed 
          ? isPlanningSidebarCollapsed
            ? 'right-[calc(var(--sidebar-width-collapsed)+80px)] w-[calc(100vw-var(--sidebar-width-collapsed)-88px)]'
            : 'right-[calc(var(--sidebar-width-collapsed)+320px)] w-[calc(100vw-var(--sidebar-width-collapsed)-328px)]'
          : isPlanningSidebarCollapsed
            ? 'right-[calc(var(--sidebar-width-expanded)+80px)] w-[calc(100vw-var(--sidebar-width-expanded)-88px)]'
            : 'right-[calc(var(--sidebar-width-expanded)+320px)] w-[calc(100vw-var(--sidebar-width-expanded)-328px)]'
      }`}>
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