import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Hand, Move, RotateCcw, Navigation, MousePointer, ArrowUpDown, ArrowLeftRight } from 'lucide-react';

interface HandPanelProps {
  panSpeed: number;
  onPanSpeedChange: (speed: number) => void;
  canvasPosition: { x: number; y: number };
  onResetPosition: () => void;
  onCenterCanvas: () => void;
  isDragging: boolean;
  isActive: boolean;
}

export const HandPanel: React.FC<HandPanelProps> = ({
  panSpeed = 1,
  onPanSpeedChange,
  canvasPosition = { x: 0, y: 0 },
  onResetPosition,
  onCenterCanvas,
  isDragging = false,
  isActive = false
}) => {
  const handleSpeedChange = (value: number[]) => {
    onPanSpeedChange(value[0]);
  };

  const speedPresets = [0.5, 1, 1.5, 2, 3];

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="w-5 h-5" />
          أداة اليد
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tool Status */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">
              {isActive ? 'نشط' : 'غير نشط'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {isDragging ? '🟢 جاري التحريك' : '⚪ في وضع الانتظار'}
          </div>
        </div>

        {/* Pan Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">سرعة التحريك</label>
          <Slider
            value={[panSpeed]}
            onValueChange={handleSpeedChange}
            max={5}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>بطيء</span>
            <span className="font-medium">{panSpeed.toFixed(1)}x</span>
            <span>سريع</span>
          </div>
        </div>

        {/* Speed Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">سرعات محددة مسبقاً</label>
          <div className="grid grid-cols-5 gap-1">
            {speedPresets.map((speed) => (
              <Button
                key={speed}
                variant={panSpeed === speed ? "default" : "outline"}
                size="sm"
                onClick={() => onPanSpeedChange(speed)}
                className="text-xs"
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>

        {/* Canvas Position */}
        <div className="space-y-2">
          <label className="text-sm font-medium">موقع اللوحة</label>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" />
                <span className="text-xs">X:</span>
              </div>
              <span className="text-xs font-mono">{Math.round(canvasPosition.x)}px</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span className="text-xs">Y:</span>
              </div>
              <span className="text-xs font-mono">{Math.round(canvasPosition.y)}px</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCenterCanvas}
          >
            <Navigation className="w-4 h-4 mr-1" />
            توسيط اللوحة
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetPosition}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            إعادة تعيين الموقع
          </Button>
        </div>

        {/* Usage Instructions */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>🖱️ اسحب لتحريك اللوحة</div>
          <div>⌨️ مفاتيح الأسهم للحركة الدقيقة</div>
          <div>🔧 Space + سحب كبديل سريع</div>
          <div>💡 استخدم العجلة للتكبير أثناء التحريك</div>
        </div>
      </CardContent>
    </Card>
  );
};