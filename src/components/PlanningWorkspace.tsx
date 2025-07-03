import React, { useState } from 'react';
import PlanningSidebar from './PlanningSidebar';
import PlanningPanel from './PlanningPanel';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      {/* Planning Categories Sidebar - Hidden */}
      <div className="hidden">
        <PlanningSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isCollapsed={true}
          onToggleCollapse={() => {}}
        />
      </div>

      {/* Planning Content Panel - Takes 96% width */}
      <div
        className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))]"
        style={{
          left: '4%', // Start after the 4% main sidebar
          width: '96%', // Take remaining 96% width
          zIndex: 100,
        }}
      >
        <PlanningPanel 
          selectedCategory={selectedCategory}
          isMainSidebarCollapsed={true}
          isPlanningSidebarCollapsed={true}
        />
      </div>
    </>
  );
};

export default PlanningWorkspace;