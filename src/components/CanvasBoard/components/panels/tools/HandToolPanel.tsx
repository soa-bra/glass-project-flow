import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Hand, MousePointer, RotateCcw } from 'lucide-react';

interface HandToolPanelProps {
  panSpeed: number;
  canvasPosition: { x: number; y: number };
  onPanSpeedChange: (speed: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onResetView: () => void;
}

export const HandToolPanel: React.FC<HandToolPanelProps> = ({
  panSpeed,
  canvasPosition,
  onPanSpeedChange,
  onPositionChange,
  onResetView
}) => {
  const centerView = () => {
    onPositionChange({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic flex items-center gap-2">
            <Hand className="w-4 h-4" />
            إعدادات أداة الكف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              سرعة السحب: {panSpeed}x
            </label>
            <Slider
              value={[panSpeed]}
              onValueChange={(value) => onPanSpeedChange(value[0])}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>بطيء</span>
              <span>سريع</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic">التحكم في العرض</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">المحور X:</span>
              <span className="font-mono ml-2">{Math.round(canvasPosition.x)}px</span>
            </div>
            <div>
              <span className="text-muted-foreground">المحور Y:</span>
              <span className="font-mono ml-2">{Math.round(canvasPosition.y)}px</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={centerView}
              className="flex-1"
            >
              <MousePointer className="w-4 h-4 mr-2" />
              توسيط العرض
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onResetView}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic">نصائح الاستخدام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• اضغط واسحب لتحريك اللوحة</p>
            <p>• استخدم عجلة الماوس للزوم أثناء السحب</p>
            <p>• اضغط مفتاح Space مؤقتاً لتفعيل أداة الكف</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};