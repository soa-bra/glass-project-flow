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
      {/* Planning Content Panel - 96% width from sidebar edge to right edge */}
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
        isSidebarCollapsed 
          ? 'left-[4%] w-[96%]' 
          : 'left-[20%] w-[80%]'
      } transition-all duration-300`}>
        <PlanningPanel selectedCategory={selectedCategory} isMainSidebarCollapsed={isSidebarCollapsed} isPlanningSidebarCollapsed={isPlanningSidebarCollapsed} />
      </div>
    </>
  );
};
export default PlanningWorkspace;