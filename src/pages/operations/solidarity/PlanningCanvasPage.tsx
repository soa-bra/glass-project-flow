import React from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import { CanvasEngineProvider } from '@/components/canvas/CanvasEngineProvider';
import IntegratedPlanningCanvasCard from './IntegratedPlanningCanvasCard';
import { CanvasDebugger } from '@/components/canvas/CanvasDebugger';

/**
 * صفحة الكانفاس المستقلة المحسنة - يمكن الوصول إليها عبر /operations/solidarity/planning
 */
export function PlanningCanvasPage() {
  return (
    <DirectionProvider>
      <CanvasEngineProvider 
        options={{
          enableSnapping: true,
          maxHistorySize: 300,
          initialState: {
            tool: 'select',
            snap: {
              enabled: true,
              threshold: 8,
              snapToGrid: true,
              snapToNodes: true,
              gridSize: 20
            },
            camera: {
              position: { x: 0, y: 0 },
              zoom: 1,
              minZoom: 0.1,
              maxZoom: 5
            }
          }
        }}
      >
        <div className="w-full h-screen bg-background relative">
          <IntegratedPlanningCanvasCard 
            useEnhanced={true}
            data-test-id="enhanced-planning-canvas"
          />
          
          {/* Canvas Engine Debugger - Ctrl+Shift+D to toggle */}
          <CanvasDebugger />
        </div>
      </CanvasEngineProvider>
    </DirectionProvider>
  );
}

export default PlanningCanvasPage;