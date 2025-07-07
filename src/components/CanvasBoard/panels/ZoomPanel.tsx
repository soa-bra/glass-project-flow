import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import { ZOOM_OPTIONS } from '../constants';

interface ZoomPanelProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canvasPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
}

const ZoomPanel: React.FC<ZoomPanelProps> = ({
  zoom,
  onZoomChange,
  canvasPosition,
  onPositionChange,
  onFitToScreen,
  onResetView
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 150);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 50);
    onZoomChange(newZoom);
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onPositionChange({
      ...canvasPosition,
      [axis]: value
    });
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <ZoomIn className="w-5 h-5 text-green-500" />
          أداة الزوم
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* أزرار الزوم السريع */}
        <div className="flex items-center gap-2">
          <Button onClick={handleZoomOut} size="sm" variant="outline" className="flex-1">
            <ZoomOut className="w-4 h-4 mr-1" />
            تصغير
          </Button>
          <Button onClick={handleZoomIn} size="sm" variant="outline" className="flex-1">
            <ZoomIn className="w-4 h-4 mr-1" />
            تكبير
          </Button>
        </div>

        {/* التحكم الدقيق */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium font-arabic">التحكم الدقيق</h4>
          
          {/* مستوى الزوم */}
          <div>
            <Label className="text-xs font-arabic">مستوى الزوم (%)</Label>
            <Input
              type="number"
              value={zoom}
              onChange={(e) => onZoomChange(parseInt(e.target.value) || 100)}
              min={50}
              max={150}
              className="h-8 text-xs"
            />
          </div>

          {/* الاتجاه الأفقي */}
          <div>
            <Label className="text-xs font-arabic">الاتجاه الأفقي (X)</Label>
            <Input
              type="number"
              value={canvasPosition.x}
              onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>

          {/* الاتجاه العمودي */}
          <div>
            <Label className="text-xs font-arabic">الاتجاه العمودي (Y)</Label>
            <Input
              type="number"
              value={canvasPosition.y}
              onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* قائمة النسب المئوية */}
        <div>
          <Label className="text-xs font-arabic mb-2 block">نسب الزوم السريع</Label>
          <Select value={zoom.toString()} onValueChange={(value) => {
            if (value === 'fit') {
              onFitToScreen();
            } else {
              onZoomChange(parseInt(value));
            }
          }}>
            <SelectTrigger className="font-arabic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ZOOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* أزرار إضافية */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onFitToScreen} size="sm" variant="outline" className="text-xs font-arabic">
            <Move className="w-3 h-3 mr-1" />
            ملاءمة الشاشة
          </Button>
          <Button onClick={onResetView} size="sm" variant="outline" className="text-xs font-arabic">
            <RotateCcw className="w-3 h-3 mr-1" />
            إعادة تعيين
          </Button>
        </div>

        {/* معلومات الحالة */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">الحالة الحالية:</h4>
          <div className="text-xs text-green-800 font-arabic space-y-1">
            <div>الزوم: {zoom}%</div>
            <div>الموقع: ({canvasPosition.x}, {canvasPosition.y})</div>
          </div>
        </div>

        {/* تعليمات */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">تعليمات:</h4>
          <ul className="text-xs text-blue-800 font-arabic space-y-1">
            <li>• استخدم عجلة الماوس للزوم</li>
            <li>• Ctrl + عجلة الماوس للزوم السريع</li>
            <li>• استخدم شريط التمرير للتنقل</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoomPanel;