import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Hand, Move, RotateCcw, Zap, MousePointer } from 'lucide-react';

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
  const [smoothPanning, setSmoothPanning] = React.useState(true);
  const [invertDirection, setInvertDirection] = React.useState(false);

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Hand className="w-5 h-5 text-blue-500" />
          أداة الكف
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* الموضع الحالي */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الموضع الحالي</h4>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-sm font-arabic">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-gray-500" />
                <span>الإحداثيات:</span>
              </div>
              <div className="font-mono">
                X: {Math.round(canvasPosition.x)}, Y: {Math.round(canvasPosition.y)}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* سرعة التحريك */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">سرعة التحريك</h4>
          <div className="space-y-3">
            <Slider
              value={[panSpeed]}
              onValueChange={(value) => onPanSpeedChange(value[0])}
              max={5}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 font-arabic">
              <span>بطيء</span>
              <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-800">
                {panSpeed.toFixed(1)}x
              </span>
              <span>سريع</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* إعدادات متقدمة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">إعدادات متقدمة</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="smooth-panning" className="text-sm font-arabic">
                التحريك السلس
              </Label>
              <Switch
                id="smooth-panning"
                checked={smoothPanning}
                onCheckedChange={setSmoothPanning}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="invert-direction" className="text-sm font-arabic">
                عكس الاتجاه
              </Label>
              <Switch
                id="invert-direction"
                checked={invertDirection}
                onCheckedChange={setInvertDirection}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* أدوات التحكم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أدوات التحكم</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => onPositionChange({ x: 0, y: 0 })}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl justify-start"
            >
              <Move className="w-3 h-3 mr-2" />
              توسيط الكانفس
            </Button>
            <Button
              onClick={onResetView}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl justify-start"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              إعادة تعيين العرض
            </Button>
          </div>
        </div>

        <Separator />

        {/* اختصارات المفاتيح */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">اختصارات المفاتيح</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-arabic text-gray-600">سحب الكانفس</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">أنقر + سحب</code>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-arabic text-gray-600">التحريك السريع</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">Space + سحب</code>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-arabic text-gray-600">إعادة التوسيط</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">Ctrl + 0</code>
            </div>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>✋ استخدم الكف لتحريك الكانفس</div>
            <div>🎯 انقر مع السحب للتنقل</div>
            <div>⚡ زيادة السرعة للتحريك السريع</div>
            <div>🔄 التحريك السلس لحركة أكثر انسيابية</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HandPanel;