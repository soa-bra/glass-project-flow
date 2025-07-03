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
      {/* Planning Content Panel - Centered horizontally */}
      <div className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] w-full flex justify-center px-8">
        <div className="w-full max-w-[96%] transition-all duration-300">
          <PlanningPanel selectedCategory={selectedCategory} isMainSidebarCollapsed={isSidebarCollapsed} isPlanningSidebarCollapsed={isPlanningSidebarCollapsed} />
        </div>
      </div>
    </>
  );
};
export default PlanningWorkspace;