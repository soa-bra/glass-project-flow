import React from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import { CanvasEngineProvider } from '@/components/canvas/CanvasEngineProvider';
import IntegratedPlanningCanvasCard from './IntegratedPlanningCanvasCard';

/**
 * صفحة الكانفاس المستقلة - يمكن الوصول إليها عبر /operations/solidarity/planning
 */
export function PlanningCanvasPage() {
  return (
    <DirectionProvider>
      <CanvasEngineProvider 
        options={{
          enableSnapping: true,
          maxHistorySize: 200,
          initialState: {
            tool: 'select',
            snap: {
              enabled: true,
              threshold: 10,
              snapToGrid: true,
              snapToNodes: true,
              gridSize: 20
            }
          }
        }}
      >
        <div className="w-full h-screen bg-background">
          <IntegratedPlanningCanvasCard />
        </div>
      </CanvasEngineProvider>
    </DirectionProvider>
  );
}

export default PlanningCanvasPage;