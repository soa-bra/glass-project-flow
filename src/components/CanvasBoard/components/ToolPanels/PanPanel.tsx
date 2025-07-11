import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Move, RotateCcw, Target, Navigation } from 'lucide-react';

interface PanPanelProps {
  position: { x: number; y: number };
  panSpeed: number;
  smoothPanning: boolean;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSpeedChange: (speed: number) => void;
  onSmoothPanningToggle: (enabled: boolean) => void;
  onCenter: () => void;
  onReset: () => void;
}

export const PanPanel: React.FC<PanPanelProps> = ({
  position,
  panSpeed,
  smoothPanning,
  onPositionChange,
  onSpeedChange,
  onSmoothPanningToggle,
  onCenter,
  onReset
}) => {
  const [isLiveUpdate, setIsLiveUpdate] = useState(false);

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">أداة الكف</CardTitle>
        <div className="text-xs text-gray-500">
          تحريك العرض والتنقل
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* الإحداثيات الحالية */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">الإحداثيات الحالية</div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">X:</span>
                <span className="font-mono ml-2">{Math.round(position.x)}px</span>
              </div>
              <div>
                <span className="text-gray-500">Y:</span>
                <span className="font-mono ml-2">{Math.round(position.y)}px</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* سرعة التحريك */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            سرعة التحريك: {panSpeed}x
          </div>
          <Slider
            value={[panSpeed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>بطيء</span>
            <span>سريع</span>
          </div>
        </div>

        <Separator />

        {/* الخيارات المتقدمة */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">الخيارات المتقدمة</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">التحريك السلس</span>
              <Switch
                checked={smoothPanning}
                onCheckedChange={onSmoothPanningToggle}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">التحديث المباشر</span>
              <Switch
                checked={isLiveUpdate}
                onCheckedChange={setIsLiveUpdate}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* أدوات التحكم */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">أدوات التحكم</div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCenter}
              className="w-full justify-start gap-2 text-xs"
              title="توسيط الكانفاس"
            >
              <Target className="w-4 h-4" />
              توسيط الكانفاس
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="w-full justify-start gap-2 text-xs"
              title="إعادة التعيين"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة التعيين
            </Button>
          </div>
        </div>

        <Separator />

        {/* التحكم اليدوي بالإحداثيات */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">التحكم اليدوي</div>
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onPositionChange({ x: position.x, y: position.y - 50 })}
              title="أعلى"
            >
              ↑
            </Button>
            <div></div>
            <div></div>
            <div></div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onPositionChange({ x: position.x - 50, y: position.y })}
              title="يسار"
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={onCenter}
              title="توسيط"
            >
              <Target className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onPositionChange({ x: position.x + 50, y: position.y })}
              title="يمين"
            >
              →
            </Button>
            <div></div>
            
            <div></div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onPositionChange({ x: position.x, y: position.y + 50 })}
              title="أسفل"
            >
              ↓
            </Button>
            <div></div>
            <div></div>
          </div>
        </div>

        <Separator />

        {/* الاختصارات */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>Space:</strong> تفعيل مؤقت</div>
          <div><strong>H:</strong> تفعيل دائم</div>
          <div><strong>Mouse Drag:</strong> تحريك حر</div>
          <div><strong>Double Click:</strong> توسيط العرض</div>
          <div><strong>Ctrl + Arrows:</strong> تحريك بمقدار ثابت</div>
        </div>
      </CardContent>
    </Card>
  );
};