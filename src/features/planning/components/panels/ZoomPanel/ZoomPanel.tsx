import React from 'react';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCanvasStore } from '../../../store/canvas.store';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

export const ZoomPanel: React.FC = () => {
  const { 
    zoom, 
    setZoom, 
    setPan, 
    fitToScreen, 
    fitToSelection,
    selectedElementIds 
  } = useCanvasStore();

  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0] / 100);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(5, zoom * 1.2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.1, zoom / 1.2));
  };

  const handleFitToScreen = () => {
    fitToScreen();
  };

  const handleFitToSelection = () => {
    if (selectedElementIds.length > 0) {
      fitToSelection();
    }
  };

  const handleActualSize = () => {
    setZoom(1);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const presetZoomLevels = [10, 25, 50, 100, 150, 200, 300, 500];

  return (
    <ToolPanelContainer title="التكبير والتصغير">
      <div className="space-y-4">
        {/* Current Zoom */}
        <div className="text-center">
          <div className="text-2xl font-bold">{zoomPercentage}%</div>
          <div className="text-xs text-muted-foreground">مستوى التكبير الحالي</div>
        </div>

        <Separator />

        {/* Zoom Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="flex items-center gap-2"
            disabled={zoom <= 0.1}
          >
            <ZoomOut className="h-4 w-4" />
            تصغير
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="flex items-center gap-2"
            disabled={zoom >= 5}
          >
            <ZoomIn className="h-4 w-4" />
            تكبير
          </Button>
        </div>

        <Separator />

        {/* Zoom Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">مستوى التكبير</Label>
            <span className="text-sm text-muted-foreground">{zoomPercentage}%</span>
          </div>
          <Slider
            value={[zoomPercentage]}
            onValueChange={handleZoomChange}
            max={500}
            min={10}
            step={10}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Preset Zoom Levels */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">مستويات محددة</Label>
          <div className="grid grid-cols-4 gap-1">
            {presetZoomLevels.map((level) => (
              <Button
                key={level}
                variant={zoomPercentage === level ? "default" : "outline"}
                size="sm"
                onClick={() => setZoom(level / 100)}
                className="text-xs p-2"
              >
                {level}%
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Fit Options */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitToScreen}
            className="w-full flex items-center gap-2"
          >
            <Maximize className="h-4 w-4" />
            ملائمة الشاشة
          </Button>
          
          {selectedElementIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToSelection}
              className="w-full flex items-center gap-2"
            >
              <Maximize className="h-4 w-4" />
              ملائمة التحديد
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleActualSize}
            className="w-full"
          >
            الحجم الفعلي (100%)
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            إعادة تعيين
          </Button>
        </div>

        <Separator />

        {/* Keyboard Shortcuts */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="font-medium">اختصارات لوحة المفاتيح:</div>
          <div>Ctrl + 0: ملائمة الشاشة</div>
          <div>Ctrl + 1: الحجم الفعلي</div>
          <div>Ctrl + +: تكبير</div>
          <div>Ctrl + -: تصغير</div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};