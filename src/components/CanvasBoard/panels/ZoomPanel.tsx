import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Move } from 'lucide-react';

interface ZoomPanelProps {
  zoom: number;
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
}

const ZoomPanel: React.FC<ZoomPanelProps> = ({
  zoom,
  canvasPosition,
  panSpeed,
  onZoomChange,
  onPositionChange,
  onFitToScreen,
  onResetView,
  onPanSpeedChange
}) => {
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ZoomIn size={16} />
          التكبير والتصغير
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">التكبير</span>
            <span className="text-sm font-mono">{zoomPercentage}%</span>
          </div>
          <Slider
            value={[zoom]}
            onValueChange={(values) => onZoomChange(values[0])}
            max={5}
            min={0.1}
            step={0.1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span>500%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onZoomChange(zoom + 0.2)}
            size="sm"
          >
            <ZoomIn size={14} />
          </Button>
          <Button
            variant="outline"
            onClick={() => onZoomChange(zoom - 0.2)}
            size="sm"
          >
            <ZoomOut size={14} />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onFitToScreen}
          >
            <Maximize size={14} className="mr-2" />
            احتواء الشاشة
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={onResetView}
          >
            <RotateCcw size={14} className="mr-2" />
            إعادة تعيين العرض
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">الموضع الحالي</p>
          <div className="text-xs bg-muted p-2 rounded">
            X: {Math.round(canvasPosition.x)}, Y: {Math.round(canvasPosition.y)}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onPositionChange({ x: 0, y: 0 })}
            size="sm"
          >
            <Move size={14} className="mr-2" />
            توسيط اللوحة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoomPanel;