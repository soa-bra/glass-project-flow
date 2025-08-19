import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Hand, RotateCcw, Move } from 'lucide-react';

interface HandPanelProps {
  panSpeed: number;
  canvasPosition: { x: number; y: number };
  onPanSpeedChange: (speed: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onResetView: () => void;
}

const HandPanel: React.FC<HandPanelProps> = ({
  panSpeed,
  canvasPosition,
  onPanSpeedChange,
  onPositionChange,
  onResetView
}) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand size={16} />
          أداة اليد
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">سرعة التحريك</p>
          <Slider
            value={[panSpeed]}
            onValueChange={(values) => onPanSpeedChange(values[0])}
            max={10}
            min={1}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>بطيء</span>
            <span>سريع</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">الموضع الحالي</p>
          <div className="text-xs bg-muted p-2 rounded">
            X: {Math.round(canvasPosition.x)}, Y: {Math.round(canvasPosition.y)}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onResetView}
          >
            <RotateCcw size={14} className="mr-2" />
            إعادة تعيين العرض
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onPositionChange({ x: 0, y: 0 })}
          >
            <Move size={14} className="mr-2" />
            وسط اللوحة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HandPanel;