import React from 'react';
import PlanningPanel from './PlanningPanel';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({ isSidebarCollapsed }) => {
  return (
    <>
      {/* Planning Content Panel - Full Width */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-panel-main-collapsed' : 'departments-panel-departments-collapsed'
        }`}
      >
        <PlanningPanel 
          isMainSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default PlanningWorkspace;