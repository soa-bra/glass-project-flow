import React from 'react';
import EnhancedCollaborativeCanvas from '@/apps/brain/canvas/EnhancedCollaborativeCanvas';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { CanvasEngineProvider } from '@/components/canvas/CanvasEngineProvider';

interface Props {
  className?: string;
  'data-test-id'?: string;
  boardAlias?: string;
  useEnhanced?: boolean;
}

export default function IntegratedPlanningCanvasCard({
  className = '',
  'data-test-id': dataTestId = 'integrated-planning-canvas',
  boardAlias = 'integrated-planning-default',
  useEnhanced = true,
}: Props) {
  if (useEnhanced) {
    return (
      <AuthProvider>
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
          <div
            className={`relative w-full h-full overflow-hidden bg-white ${className}`}
            data-test-id={dataTestId}
          >
            <EnhancedCollaborativeCanvas 
              boardAlias={boardAlias} 
              useEngineOptimization={true}
            />
          </div>
        </CanvasEngineProvider>
      </AuthProvider>
    );
  }

  // Fallback to legacy CollaborativeCanvas
  const CollaborativeCanvas = React.lazy(() => import('@/apps/brain/canvas/CollaborativeCanvas'));
  
  return (
    <AuthProvider>
      <div
        className={`relative w-full h-full overflow-hidden bg-white ${className}`}
        data-test-id={dataTestId}
      >
        <React.Suspense fallback={<div className="flex items-center justify-center h-full">جاري التحميل...</div>}>
          <CollaborativeCanvas boardAlias={boardAlias} />
        </React.Suspense>
      </div>
    </AuthProvider>
  );
}
