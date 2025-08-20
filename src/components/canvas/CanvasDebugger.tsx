import React, { useState, useEffect } from 'react';
import { useCanvasEngineContext } from './CanvasEngineProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const CanvasDebugger: React.FC = () => {
  const { engine, state, isReady } = useCanvasEngineContext();
  const [showDebugger, setShowDebugger] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Auto-refresh every 2 seconds
  useEffect(() => {
    if (!showDebugger) return;
    const interval = setInterval(() => {
      setRefreshCounter(c => c + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [showDebugger]);

  // Show/hide with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setShowDebugger(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!showDebugger) return null;

  const engineMetrics = engine?.getSceneGraph().getStats();
  const cameraInfo = state?.camera;
  const selectionInfo = state?.selection;

  return (
    <div className="fixed top-4 left-4 z-50 w-80 max-h-96 overflow-auto">
      <Card className="bg-black/90 text-white border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Canvas Engine Debugger
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDebugger(false)}
              className="h-6 w-6 p-0 text-white hover:bg-gray-700"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <strong>Status:</strong>{' '}
            <Badge variant={isReady ? "default" : "destructive"} className="text-xs">
              {isReady ? 'Ready' : 'Loading'}
            </Badge>
          </div>

          {state && (
            <>
              <div>
                <strong>Camera:</strong>
                <div className="ml-2 text-gray-300">
                  Position: ({cameraInfo?.position.x.toFixed(1)}, {cameraInfo?.position.y.toFixed(1)})
                  <br />
                  Zoom: {cameraInfo?.zoom.toFixed(2)}x
                  <br />
                  Range: {cameraInfo?.minZoom}x - {cameraInfo?.maxZoom}x
                </div>
              </div>

              <div>
                <strong>Selection:</strong>
                <div className="ml-2 text-gray-300">
                  Count: {selectionInfo?.selectedIds.length || 0}
                  <br />
                  Hovered: {selectionInfo?.hoveredId || 'none'}
                  <br />
                  Multi: {selectionInfo?.isMultiSelect ? 'Yes' : 'No'}
                </div>
              </div>

              <div>
                <strong>Tool:</strong> {state.tool}
              </div>

              <div>
                <strong>Viewport:</strong>
                <div className="ml-2 text-gray-300">
                  {state.viewport.size.width}×{state.viewport.size.height}
                </div>
              </div>
            </>
          )}

          {engineMetrics && (
            <div>
              <strong>Scene:</strong>
              <div className="ml-2 text-gray-300">
                Nodes: {engineMetrics.nodeCount}
                <br />
                Visible: {engineMetrics.visibleNodeCount}
                <br />
                Bounds: {engineMetrics.sceneBounds.width.toFixed(0)}×{engineMetrics.sceneBounds.height.toFixed(0)}
              </div>
            </div>
          )}

          <div>
            <strong>Performance:</strong>
            <div className="ml-2 text-gray-300">
              Refresh: #{refreshCounter}
              <br />
              FPS: ~60 (estimated)
              <br />
              Memory: {(performance as any).memory ? 
                `${((performance as any).memory.usedJSHeapSize / 1048576).toFixed(1)}MB` : 
                'N/A'
              }
            </div>
          </div>

          <div className="pt-2 border-t border-gray-600">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                console.log('Canvas Engine State:', { engine, state, metrics: engineMetrics });
              }}
              className="w-full text-xs"
            >
              Log Full State
            </Button>
          </div>

          <div className="text-gray-400 text-[10px]">
            Press Ctrl+Shift+D to toggle
          </div>
        </CardContent>
      </Card>
    </div>
  );
};