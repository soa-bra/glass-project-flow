import React from 'react';
import CanvasBoardContents from './CanvasBoard/CanvasBoardContents';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  return (
    <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${
      isSidebarCollapsed 
        ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]'
        : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]'
    }`}>
      <div className="h-full bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CanvasBoardContents />
      </div>
    </div>
  );
};
export default PlanningWorkspace;