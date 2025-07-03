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
      {/* Planning Content Panel - positioned after sidebar with 10px margin */}
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] sidebar-transition content-slide-in ${
        isSidebarCollapsed 
          ? 'right-[calc(var(--sidebar-width-collapsed)+18px)] w-[calc(100vw-var(--sidebar-width-collapsed)-26px)]'
          : 'right-[calc(var(--sidebar-width-expanded)+18px)] w-[calc(100vw-var(--sidebar-width-expanded)-26px)]'
      }`}>
        <PlanningPanel selectedCategory={selectedCategory} isMainSidebarCollapsed={isSidebarCollapsed} isPlanningSidebarCollapsed={isPlanningSidebarCollapsed} />
      </div>
    </>
  );
};
export default PlanningWorkspace;