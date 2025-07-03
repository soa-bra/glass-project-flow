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
  return <>
      {/* Planning Categories Sidebar */}
      

      {/* Planning Content Panel */}
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${isSidebarCollapsed ? isPlanningSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed' : isPlanningSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded'}`}>
        <PlanningPanel selectedCategory={selectedCategory} isMainSidebarCollapsed={isSidebarCollapsed} isPlanningSidebarCollapsed={isPlanningSidebarCollapsed} />
      </div>
    </>;
};
export default PlanningWorkspace;