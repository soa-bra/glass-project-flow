import React from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import IntegratedPlanningCanvasCard from '@/pages/operations/solidarity/IntegratedPlanningCanvasCard';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

/**
 * حاوية ثابتة تعتمد على عرض الشريط الجانبي.
 * بداخلها نركّب بطاقة الكانفاس الجاهزة IntegratedPlanningCanvasCard.
 */
const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const positionClasses = isSidebarCollapsed
    ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]'
    : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]';

  return (
    <div
      className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 z-0 ${positionClasses}`}
      data-test-id="planning-workspace-fixed"
    >
      <DirectionProvider>
        <IntegratedPlanningCanvasCard />
      </DirectionProvider>
    </div>
  );
};

export default PlanningWorkspace;
