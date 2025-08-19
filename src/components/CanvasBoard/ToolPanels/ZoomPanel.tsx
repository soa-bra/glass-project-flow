import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Focus } from 'lucide-react';

interface ZoomPanelProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onActualSize: () => void;
  onResetZoom: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export const ZoomPanel: React.FC<ZoomPanelProps> = ({
  zoom = 100,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onActualSize,
  onResetZoom,
  minZoom = 10,
  maxZoom = 500
}) => {
  const handleSliderChange = (value: number[]) => {
    onZoomChange(value[0]);
  };

  const presetZooms = [25, 50, 75, 100, 125, 150, 200];

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ZoomIn className="w-5 h-5" />
          التكبير
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Zoom Display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{Math.round(zoom)}%</div>
          <div className="text-xs text-muted-foreground">مستوى التكبير الحالي</div>
        </div>

        {/* Zoom Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">تحكم بالتكبير</label>
          <Slider
            value={[zoom]}
            onValueChange={handleSliderChange}
            max={maxZoom}
            min={minZoom}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minZoom}%</span>
            <span>{maxZoom}%</span>
          </div>
        </div>

        {/* Quick Zoom Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            disabled={zoom <= minZoom}
          >
            <ZoomOut className="w-4 h-4 mr-1" />
            تصغير
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            disabled={zoom >= maxZoom}
          >
            <ZoomIn className="w-4 h-4 mr-1" />
            تكبير
          </Button>
        </div>

        {/* Preset Zoom Levels */}
        <div className="space-y-2">
          <label className="text-sm font-medium">مستويات سريعة</label>
          <div className="grid grid-cols-3 gap-1">
            {presetZooms.map((presetZoom) => (
              <Button
                key={presetZoom}
                variant={zoom === presetZoom ? "default" : "outline"}
                size="sm"
                onClick={() => onZoomChange(presetZoom)}
                className="text-xs"
              >
                {presetZoom}%
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFitToScreen}
          >
            <Maximize className="w-4 h-4 mr-1" />
            ملء الشاشة
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onActualSize}
          >
            <Focus className="w-4 h-4 mr-1" />
            الحجم الفعلي
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetZoom}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            إعادة تعيين
          </Button>
        </div>

        {/* Zoom Info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>🖱️ العجلة للتكبير/التصغير</div>
          <div>⌨️ Ctrl + (+/-) للتحكم</div>
          <div>🔍 النقر المزدوج لملء الشاشة</div>
        </div>
      </CardContent>
    </Card>
  );
};