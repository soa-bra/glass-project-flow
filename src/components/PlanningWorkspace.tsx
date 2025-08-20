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
      className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 z-20 ${positionClasses}`}
      data-test-id="planning-workspace-fixed"
    >
      <div className="h-full rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm">
        <DirectionProvider>
          <IntegratedPlanningCanvasCard />
        </DirectionProvider>
      </div>
    </div>
  );
};

export default PlanningWorkspace;
