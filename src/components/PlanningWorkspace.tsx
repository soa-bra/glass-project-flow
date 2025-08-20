import React from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import IntegratedPlanningCanvasCard from '@/pages/operations/solidarity/IntegratedPlanningCanvasCard';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  return (
    <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${isSidebarCollapsed ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]' : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]'}`}>
      <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden bg-white">
        <DirectionProvider>
          <div className="h-full w-full p-4">
            <IntegratedPlanningCanvasCard />
          </div>
        </DirectionProvider>
      </div>
    </div>
  );
};
export default PlanningWorkspace;