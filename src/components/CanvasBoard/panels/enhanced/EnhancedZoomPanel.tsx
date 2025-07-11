
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  ZoomIn, ZoomOut, Maximize, RotateCcw, 
  Move, Target, Settings2 
} from 'lucide-react';

interface EnhancedZoomPanelProps {
  zoom: number;
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  smoothZoom: boolean;
  zoomToMouse: boolean;
  fitPadding: number;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onFitToSelection: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onSmoothZoomToggle: (enabled: boolean) => void;
  onZoomToMouseToggle: (enabled: boolean) => void;
  onFitPaddingChange: (padding: number) => void;
  onCenterOnElement: (elementId: string) => void;
}

const EnhancedZoomPanel: React.FC<EnhancedZoomPanelProps> = ({
  zoom,
  canvasPosition,
  panSpeed,
  smoothZoom,
  zoomToMouse,
  fitPadding,
  onZoomChange,
  onFitToScreen,
  onFitToSelection,
  onResetView,
  onPanSpeedChange,
  onSmoothZoomToggle,
  onZoomToMouseToggle,
  onFitPaddingChange
}) => {
  const presetLevels = [10, 25, 50, 100, 200, 500];

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 500);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 10);
    onZoomChange(newZoom);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <ZoomIn className="w-5 h-5 text-blue-500" />
          أداة الزوم
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* التحكم في نسبة العرض */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نسبة العرض</h4>
          <div className="space-y-3">
            {/* أزرار + و - */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                className="w-10 h-10 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => onZoomChange(value[0])}
                  max={500}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                className="w-10 h-10 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            {/* عرض النسبة الحالية */}
            <div className="text-center">
              <span className="text-lg font-bold text-blue-600">{Math.round(zoom)}%</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* النسب المحددة مسبقاً */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نسب محددة</h4>
          <div className="grid grid-cols-3 gap-2">
            {presetLevels.map((level) => (
              <Button
                key={level}
                size="sm"
                variant={zoom === level ? "default" : "outline"}
                onClick={() => onZoomChange(level)}
                className="text-xs font-arabic"
              >
                {level}%
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* الإعدادات الذكية */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الإعدادات الذكية</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onFitToScreen}
              className="flex items-center gap-2 font-arabic justify-start"
            >
              <Maximize className="w-4 h-4" />
              ملائمة الشاشة
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onFitToSelection}
              className="flex items-center gap-2 font-arabic justify-start"
            >
              <Target className="w-4 h-4" />
              ملائمة التحديد
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onZoomChange(100)}
              className="flex items-center gap-2 font-arabic justify-start"
            >
              <Settings2 className="w-4 h-4" />
              الحجم الفعلي
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onResetView}
              className="flex items-center gap-2 font-arabic justify-start"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة التعيين
            </Button>
          </div>
        </div>

        <Separator />

        {/* إعدادات متقدمة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">إعدادات متقدمة</h4>
          <div className="space-y-3">
            {/* سرعة التحريك */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-arabic">سرعة التحريك</span>
                <span className="text-xs text-gray-500">{panSpeed}x</span>
              </div>
              <Slider
                value={[panSpeed]}
                onValueChange={(value) => onPanSpeedChange(value[0])}
                max={3}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* هامش الملائمة */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-arabic">هامش الملائمة</span>
                <span className="text-xs text-gray-500">{fitPadding}px</span>
              </div>
              <Slider
                value={[fitPadding]}
                onValueChange={(value) => onFitPaddingChange(value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* المفاتيح */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-arabic">زوم سلس</span>
                <Switch
                  checked={smoothZoom}
                  onCheckedChange={onSmoothZoomToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-arabic">زوم للماوس</span>
                <Switch
                  checked={zoomToMouse}
                  onCheckedChange={onZoomToMouseToggle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* معلومات الموقع */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">معلومات الموقع</h4>
          <div className="bg-gray-50 p-3 rounded-xl">
            <div className="text-xs font-mono space-y-1">
              <div>X: {Math.round(canvasPosition.x)}px</div>
              <div>Y: {Math.round(canvasPosition.y)}px</div>
              <div>الزوم: {Math.round(zoom)}%</div>
            </div>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🔍 Ctrl+Scroll للزوم التدريجي</div>
            <div>🎯 Ctrl+0 ملائمة الشاشة</div>
            <div>📏 Ctrl+1 الحجم الفعلي</div>
            <div>🖱️ Alt+Drag تكبير مباشر للتحديد</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedZoomPanel;
