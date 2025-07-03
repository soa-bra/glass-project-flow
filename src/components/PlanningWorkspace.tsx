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
      {/* Planning Categories Sidebar */}
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-10 ${
        isSidebarCollapsed ? 'left-[4%]' : 'left-[20%]'
      } ${isPlanningSidebarCollapsed ? 'w-[4%]' : 'w-[27%]'} transition-all duration-300`}>
        <PlanningSidebar 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isCollapsed={isPlanningSidebarCollapsed}
          onToggleCollapse={setIsPlanningSidebarCollapsed}
        />
      </div>

      {/* Planning Content Panel */}
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
        isSidebarCollapsed 
          ? isPlanningSidebarCollapsed 
            ? 'left-[8%] w-[69%]' 
            : 'left-[31%] w-[69%]'
          : isPlanningSidebarCollapsed 
            ? 'left-[24%] w-[69%]' 
            : 'left-[47%] w-[69%]'
      } transition-all duration-300`}>
        <PlanningPanel selectedCategory={selectedCategory} isMainSidebarCollapsed={isSidebarCollapsed} isPlanningSidebarCollapsed={isPlanningSidebarCollapsed} />
      </div>
    </>
  );
};
export default PlanningWorkspace;