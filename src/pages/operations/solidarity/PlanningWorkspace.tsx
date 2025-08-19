import React from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import IntegratedPlanningCanvasCard from './IntegratedPlanningCanvasCard';

interface PlanningWorkspaceProps {
  className?: string;
}

export function PlanningWorkspace({ className = '' }: PlanningWorkspaceProps) {
  return (
    <DirectionProvider>
      <div className={`h-full w-full p-4 ${className}`} data-test-id="planning-workspace">
        <div className="h-full w-full">
          <IntegratedPlanningCanvasCard data-test-id="integrated-planning-canvas" />
        </div>
      </div>
    </DirectionProvider>
  );
}

export default PlanningWorkspace;