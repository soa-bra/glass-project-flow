import React from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import IntegratedPlanningCanvasCard from './IntegratedPlanningCanvasCard';

/**
 * صفحة التخطيط التضامني: ترندر بطاقة الكانفاس وتملأ الشاشة.
 * IntegratedPlanningCanvasCard تحتوي على تركيب الكانفاس (CollaborativeCanvas) وكل ما يلزمه.
 */
interface PlanningWorkspaceProps {
  className?: string;
}

export function PlanningWorkspace({ className = '' }: PlanningWorkspaceProps) {
  return (
    <DirectionProvider>
      <div
        className={`w-full min-h-[calc(100vh-var(--sidebar-top-offset))] p-4 ${className}`}
        data-test-id="planning-workspace"
      >
        <div className="h-[calc(100vh-var(--sidebar-top-offset)-2rem)] w-full">
          {/* البطاقة تركّب الكانفاس وتضبط حجمه داخليًا */}
          <IntegratedPlanningCanvasCard data-test-id="integrated-planning-canvas" />
        </div>
      </div>
    </DirectionProvider>
  );
}

export default PlanningWorkspace;
