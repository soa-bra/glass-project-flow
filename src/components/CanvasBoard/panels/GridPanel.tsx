import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Grid3X3, AlignCenter, RotateCcw } from 'lucide-react';

interface GridPanelProps {
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  gridShape: string;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onGridShapeChange: (shape: string) => void;
  onAlignToGrid: () => void;
}

const GridPanel: React.FC<GridPanelProps> = ({
  showGrid,
  snapEnabled,
  gridSize,
  gridShape,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridShapeChange,
  onAlignToGrid
}) => {
  const gridShapes = [
    { value: 'dots', label: 'نقاط' },
    { value: 'lines', label: 'خطوط' },
    { value: 'squares', label: 'مربعات' }
  ];

  const gridSizes = [
    { value: 10, label: '10px' },
    { value: 20, label: '20px' },
    { value: 30, label: '30px' },
    { value: 50, label: '50px' }
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-blue-500" />
          إعدادات الشبكة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* تفعيل الشبكة */}
        <div className="flex items-center justify-between">
          <Label htmlFor="grid-visible" className="text-sm font-arabic">
            إظهار الشبكة
          </Label>
          <Switch
            id="grid-visible"
            checked={showGrid}
            onCheckedChange={onGridToggle}
          />
        </div>

        {/* المحاذاة التلقائية */}
        <div className="flex items-center justify-between">
          <Label htmlFor="snap-enabled" className="text-sm font-arabic">
            المحاذاة التلقائية
          </Label>
          <Switch
            id="snap-enabled"
            checked={snapEnabled}
            onCheckedChange={onSnapToggle}
          />
        </div>

        <Separator />

        {/* حجم الشبكة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">حجم الشبكة</h4>
          <div className="space-y-3">
            <Slider
              value={[gridSize]}
              onValueChange={(value) => onGridSizeChange(value[0])}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-sm font-arabic bg-gray-100 px-3 py-1 rounded-full">
                {gridSize}px
              </span>
            </div>
          </div>
        </div>

        {/* اختيار سريع للحجم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أحجام سريعة</h4>
          <div className="grid grid-cols-2 gap-2">
            {gridSizes.map((size) => (
              <Button
                key={size.value}
                onClick={() => onGridSizeChange(size.value)}
                variant={gridSize === size.value ? "default" : "outline"}
                size="sm"
                className={`text-xs font-arabic rounded-xl ${
                  gridSize === size.value ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* شكل الشبكة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">شكل الشبكة</h4>
          <Select value={gridShape} onValueChange={onGridShapeChange}>
            <SelectTrigger className="w-full font-arabic rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gridShapes.map((shape) => (
                <SelectItem key={shape.value} value={shape.value}>
                  {shape.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* أدوات المحاذاة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أدوات المحاذاة</h4>
          <div className="space-y-2">
            <Button
              onClick={onAlignToGrid}
              size="sm"
              variant="outline"
              className="w-full text-xs font-arabic rounded-xl justify-start"
            >
              <AlignCenter className="w-3 h-3 mr-2" />
              محاذاة العناصر للشبكة
            </Button>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🔲 الشبكة تساعد في تنظيم العناصر</div>
            <div>🧲 المحاذاة التلقائية تلتقط العناصر</div>
            <div>📏 اضبط الحجم حسب مستوى التفصيل</div>
            <div>⚡ استخدم أزرار الحجم السريع</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridPanel;