import React from 'react';
import PlanningEntryScreen from './Planning/PlanningEntryScreen';
import PlanningCanvas from './Planning/PlanningCanvas';
import { usePlanningStore } from '@/stores/planningStore';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  const { currentBoard } = usePlanningStore();

  return (
    <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${
      isSidebarCollapsed 
        ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]'
        : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]'
    }`}>
      <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden bg-white">
        {!currentBoard ? (
          <PlanningEntryScreen />
        ) : (
          <PlanningCanvas board={currentBoard} />
        )}
      </div>
    </div>
  );
};
export default PlanningWorkspace;