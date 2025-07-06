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
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${
        isSidebarCollapsed 
          ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-64'
          : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-64'
      }`}>
        <PlanningSidebar 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isCollapsed={isPlanningSidebarCollapsed}
          onToggleCollapse={setIsPlanningSidebarCollapsed}
        />
      </div>

      {/* Planning Content Panel */}
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${
        isSidebarCollapsed 
          ? 'right-[calc(var(--sidebar-width-collapsed)+280px)] w-[calc(100vw-var(--sidebar-width-collapsed)-288px)]'
          : 'right-[calc(var(--sidebar-width-expanded)+280px)] w-[calc(100vw-var(--sidebar-width-expanded)-288px)]'
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