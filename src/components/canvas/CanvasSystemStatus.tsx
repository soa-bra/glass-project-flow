import React from 'react';
import { useCanvasEngineContext } from './CanvasEngineProvider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const CanvasSystemStatus: React.FC = () => {
  let engineStatus = 'unavailable';
  let nodeCount = 0;
  let zoom = 1;

  try {
    const { engine, state, isReady } = useCanvasEngineContext();
    
    if (isReady && engine && state) {
      engineStatus = 'active';
      nodeCount = engine.getNodes().length;
      zoom = state.camera.zoom;
    } else if (engine) {
      engineStatus = 'loading';
    }
  } catch {
    engineStatus = 'legacy';
  }

  const getStatusColor = () => {
    switch (engineStatus) {
      case 'active': return 'bg-green-500';
      case 'loading': return 'bg-yellow-500';
      case 'legacy': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (engineStatus) {
      case 'active': return 'Engine نشط';
      case 'loading': return 'جاري التحميل';
      case 'legacy': return 'النظام التقليدي';
      default: return 'غير متاح';
    }
  };

  return (
    <Card className="w-48 bg-white/90 backdrop-blur-sm border-gray-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <Badge variant="outline" className="text-xs">
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="text-xs space-y-1 text-gray-600">
          <div>العقد: {nodeCount}</div>
          <div>التكبير: {zoom.toFixed(2)}x</div>
          <div className="text-[10px] text-gray-400">
            Canvas Integration v2.0
          </div>
        </div>
      </CardContent>
    </Card>
  );
};