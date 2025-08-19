import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { ZOOM_OPTIONS } from '../../../constants';

interface ZoomToolPanelProps {
  zoom: number;
  canvasPosition: { x: number; y: number };
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
}

export const ZoomToolPanel: React.FC<ZoomToolPanelProps> = ({
  zoom,
  canvasPosition,
  onZoomChange,
  onPositionChange,
  onFitToScreen,
  onResetView
}) => {
  const handleZoomSelect = (value: string) => {
    if (value === 'fit') {
      onFitToScreen();
    } else {
      onZoomChange(parseInt(value));
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 200);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 25);
    onZoomChange(newZoom);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic">التحكم في الزوم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <Select value={zoom.toString()} onValueChange={handleZoomSelect}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={`${zoom}%`} />
              </SelectTrigger>
              <SelectContent>
                {ZOOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFitToScreen}
              className="flex-1"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              ملاءمة الشاشة
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
          <CardTitle className="text-sm font-arabic">موضع اللوحة</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};