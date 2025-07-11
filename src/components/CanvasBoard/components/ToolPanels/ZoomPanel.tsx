import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Move } from 'lucide-react';

interface ZoomPanelProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
  onActualSize: () => void;
  onReset: () => void;
}

const presetZoomLevels = [
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

export const ZoomPanel: React.FC<ZoomPanelProps> = ({
  zoom,
  onZoomChange,
  onFitToScreen,
  onActualSize,
  onReset
}) => {
  const [customZoom, setCustomZoom] = useState(zoom);

  const handleSliderChange = (value: number[]) => {
    const newZoom = value[0];
    setCustomZoom(newZoom);
    onZoomChange(newZoom);
  };

  const handlePresetZoom = (value: number) => {
    setCustomZoom(value);
    onZoomChange(value);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(500, zoom + 25);
    handlePresetZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(25, zoom - 25);
    handlePresetZoom(newZoom);
  };

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">أداة الزوم</CardTitle>
        <div className="text-xs text-gray-500">
          التكبير الحالي: {zoom}%
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* التحكم السريع */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">التحكم السريع</div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="p-2"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 500}
              className="p-2"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="p-2"
              title="إعادة التعيين"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* السلايدر */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            تحكم دقيق: {customZoom}%
          </div>
          <Slider
            value={[customZoom]}
            onValueChange={handleSliderChange}
            min={25}
            max={500}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>25%</span>
            <span>500%</span>
          </div>
        </div>

        <Separator />

        {/* النسب المحددة مسبقاً */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">النسب المحددة</div>
          <div className="grid grid-cols-3 gap-2">
            {presetZoomLevels.map((level) => (
              <Button
                key={level.value}
                variant={zoom === level.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePresetZoom(level.value)}
                className="text-xs"
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* الإعدادات الذكية */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">الإعدادات الذكية</div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFitToScreen}
              className="w-full justify-start gap-2 text-xs"
              title="ملائمة الشاشة (Ctrl+0)"
            >
              <Maximize className="w-4 h-4" />
              ملائمة الشاشة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onActualSize}
              className="w-full justify-start gap-2 text-xs"
              title="الحجم الفعلي (Ctrl+1)"
            >
              <Move className="w-4 h-4" />
              الحجم الفعلي
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

        {/* معلومات إضافية */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>Ctrl + Scroll:</strong> زوم تدريجي</div>
          <div><strong>Ctrl + 0:</strong> ملائمة الشاشة</div>
          <div><strong>Ctrl + 1:</strong> الحجم الفعلي</div>
          <div><strong>Ctrl + +/-:</strong> تكبير/تصغير</div>
          <div><strong>Alt + Drag:</strong> زوم للمنطقة</div>
        </div>
      </CardContent>
    </Card>
  );
};