import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
  const zoomLevels = [
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
    { value: 125, label: '125%' },
    { value: 150, label: '150%' },
    { value: 200, label: '200%' },
    { value: 300, label: '300%' }
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <ZoomIn className="w-5 h-5 text-blue-500" />
          أداة الزوم
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* مستوى الزوم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">مستوى الزوم</h4>
          <div className="space-y-3">
            <Slider
              value={[zoom]}
              onValueChange={(value) => onZoomChange(value[0])}
              max={300}
              min={25}
              step={25}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-sm font-arabic bg-gray-100 px-3 py-1 rounded-full">
                {zoom}%
              </span>
            </div>
          </div>
        </div>

        {/* اختيار سريع للزوم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">اختيار سريع</h4>
          <div className="grid grid-cols-2 gap-2">
            {zoomLevels.map((level) => (
              <Button
                key={level.value}
                onClick={() => onZoomChange(level.value)}
                variant={zoom === level.value ? "default" : "outline"}
                size="sm"
                className={`text-xs font-arabic rounded-xl ${
                  zoom === level.value ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* أدوات الزوم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أدوات الزوم</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onZoomChange(Math.min(300, zoom + 25))}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl"
            >
              <ZoomIn className="w-3 h-3 mr-1" />
              تكبير
            </Button>
            <Button
              onClick={() => onZoomChange(Math.max(25, zoom - 25))}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl"
            >
              <ZoomOut className="w-3 h-3 mr-1" />
              تصغير
            </Button>
            <Button
              onClick={onFitToScreen}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl"
            >
              <Maximize className="w-3 h-3 mr-1" />
              ملاءمة الشاشة
            </Button>
            <Button
              onClick={onResetView}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              إعادة تعيين
            </Button>
          </div>
        </div>

        <Separator />

        {/* موضع الكانفس */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">موضع الكانفس</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 font-arabic">
              <Move className="w-3 h-3" />
              <span>X: {Math.round(canvasPosition.x)}</span>
              <span>Y: {Math.round(canvasPosition.y)}</span>
            </div>
            <Button
              onClick={() => onPositionChange({ x: 0, y: 0 })}
              size="sm"
              variant="outline"
              className="w-full text-xs font-arabic rounded-xl"
            >
              توسيط الكانفس
            </Button>
          </div>
        </div>

        <Separator />

        {/* سرعة التحريك */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">سرعة التحريك</h4>
          <div className="space-y-2">
            <Slider
              value={[panSpeed]}
              onValueChange={(value) => onPanSpeedChange(value[0])}
              max={5}
              min={0.5}
              step={0.5}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center font-arabic">
              {panSpeed}x
            </div>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🔍 استخدم عجلة الماوس للزوم</div>
            <div>👆 اسحب لتحريك الكانفس</div>
            <div>⌨️ Ctrl + 0 لإعادة التعيين</div>
            <div>📐 Ctrl + Scroll للزوم السريع</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoomPanel;