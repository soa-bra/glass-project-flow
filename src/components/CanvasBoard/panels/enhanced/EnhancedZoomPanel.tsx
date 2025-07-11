import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Move, Target, Settings, Eye } from 'lucide-react';

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
  onPositionChange,
  onFitToScreen,
  onFitToSelection,
  onResetView,
  onPanSpeedChange,
  onSmoothZoomToggle,
  onZoomToMouseToggle,
  onFitPaddingChange,
  onCenterOnElement
}) => {
  const [selectedPreset, setSelectedPreset] = useState('100');

  const zoomLevels = [
    { value: 10, label: '10%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
    { value: 125, label: '125%' },
    { value: 150, label: '150%' },
    { value: 200, label: '200%' },
    { value: 300, label: '300%' },
    { value: 500, label: '500%' }
  ];

  const presetViews = [
    { id: 'fit-screen', label: 'ملاءمة الشاشة', action: onFitToScreen },
    { id: 'fit-selection', label: 'ملاءمة التحديد', action: onFitToSelection },
    { id: 'actual-size', label: 'الحجم الفعلي', action: () => onZoomChange(100) },
    { id: 'reset', label: 'إعادة تعيين', action: onResetView }
  ];

  const handleZoomIn = () => {
    const nextLevel = zoomLevels.find(level => level.value > zoom);
    if (nextLevel) {
      onZoomChange(nextLevel.value);
    } else {
      onZoomChange(Math.min(1000, zoom * 1.25));
    }
  };

  const handleZoomOut = () => {
    const prevLevel = [...zoomLevels].reverse().find(level => level.value < zoom);
    if (prevLevel) {
      onZoomChange(prevLevel.value);
    } else {
      onZoomChange(Math.max(10, zoom * 0.8));
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <ZoomIn className="w-5 h-5 text-blue-500" />
          التحكم في العرض المتقدم
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* مستوى الزوم */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium font-arabic">مستوى الزوم</h4>
            <div className="text-sm font-arabic bg-blue-100 px-3 py-1 rounded-full">
              {Math.round(zoom)}%
            </div>
          </div>
          
          <div className="space-y-3">
            <Slider
              value={[zoom]}
              onValueChange={(value) => onZoomChange(value[0])}
              max={500}
              min={10}
              step={5}
              className="w-full"
            />
            
            {/* أزرار الزوم السريع */}
            <div className="flex gap-2">
              <Button
                onClick={handleZoomOut}
                size="sm"
                variant="outline"
                className="flex-1 text-xs font-arabic rounded-xl"
              >
                <ZoomOut className="w-3 h-3 mr-1" />
                تصغير
              </Button>
              <Button
                onClick={handleZoomIn}
                size="sm"
                variant="outline"
                className="flex-1 text-xs font-arabic rounded-xl"
              >
                <ZoomIn className="w-3 h-3 mr-1" />
                تكبير
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* اختيار سريع للزوم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">مستويات سريعة</h4>
          <div className="grid grid-cols-5 gap-1">
            {zoomLevels.map((level) => (
              <Button
                key={level.value}
                onClick={() => onZoomChange(level.value)}
                variant={Math.abs(zoom - level.value) < 5 ? "default" : "outline"}
                size="sm"
                className={`text-xs font-arabic rounded-lg ${
                  Math.abs(zoom - level.value) < 5 ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* عروض مُعدة مسبقاً */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">عروض مُعدة</h4>
          <div className="grid grid-cols-2 gap-2">
            {presetViews.map((preset) => (
              <Button
                key={preset.id}
                onClick={preset.action}
                size="sm"
                variant="outline"
                className="text-xs font-arabic rounded-xl"
              >
                <Target className="w-3 h-3 mr-1" />
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* موضع الكانفس */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">موضع الكانفس</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 font-arabic bg-gray-50 p-2 rounded-xl">
              <Move className="w-3 h-3" />
              <span>X: {Math.round(canvasPosition.x)}</span>
              <span>Y: {Math.round(canvasPosition.y)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onPositionChange({ x: 0, y: 0 })}
                size="sm"
                variant="outline"
                className="text-xs font-arabic rounded-xl"
              >
                توسيط الكانفس
              </Button>
              <Button
                onClick={() => onPositionChange({ x: canvasPosition.x, y: 0 })}
                size="sm"
                variant="outline"
                className="text-xs font-arabic rounded-xl"
              >
                توسيط عمودي
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* الإعدادات المتقدمة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">الإعدادات المتقدمة</h4>
          
          <div className="space-y-3">
            {/* سرعة التحريك */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-arabic">سرعة التحريك</Label>
                <span className="text-xs text-gray-500">{panSpeed}x</span>
              </div>
              <Slider
                value={[panSpeed]}
                onValueChange={(value) => onPanSpeedChange(value[0])}
                max={10}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* زوم سلس */}
            <div className="flex items-center justify-between">
              <Label htmlFor="smooth-zoom" className="text-sm font-arabic">
                زوم سلس
              </Label>
              <Switch
                id="smooth-zoom"
                checked={smoothZoom}
                onCheckedChange={onSmoothZoomToggle}
              />
            </div>

            {/* زوم نحو الماوس */}
            <div className="flex items-center justify-between">
              <Label htmlFor="zoom-to-mouse" className="text-sm font-arabic">
                زوم نحو الماوس
              </Label>
              <Switch
                id="zoom-to-mouse"
                checked={zoomToMouse}
                onCheckedChange={onZoomToMouseToggle}
              />
            </div>

            {/* هامش الملاءمة */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-arabic">هامش الملاءمة</Label>
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
          </div>
        </div>

        <Separator />

        {/* أدوات العرض */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أدوات العرض</h4>
          <div className="space-y-2">
            <Button
              onClick={() => console.log('تبديل الشبكة')}
              size="sm"
              variant="outline"
              className="w-full text-xs font-arabic rounded-xl justify-start"
            >
              <Eye className="w-3 h-3 mr-2" />
              تبديل إظهار الشبكة
            </Button>
            
            <Button
              onClick={() => console.log('تبديل المساطر')}
              size="sm"
              variant="outline"
              className="w-full text-xs font-arabic rounded-xl justify-start"
            >
              <Settings className="w-3 h-3 mr-2" />
              تبديل المساطر
            </Button>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🔍 عجلة الماوس للزوم السريع</div>
            <div>👆 مفتاح المسافة + السحب للتحريك</div>
            <div>⌨️ Ctrl + 0 للعودة للحجم الطبيعي</div>
            <div>🎯 النقر المزدوج للتوسيط</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedZoomPanel;