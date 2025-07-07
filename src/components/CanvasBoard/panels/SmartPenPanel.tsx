import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Pen, Settings, Palette } from 'lucide-react';

interface SmartPenPanelProps {
  selectedPenMode: string;
  lineWidth: number;
  lineStyle: string;
  onPenModeSelect: (mode: string) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
}

const SmartPenPanel: React.FC<SmartPenPanelProps> = ({
  selectedPenMode,
  lineWidth,
  lineStyle,
  onPenModeSelect,
  onLineWidthChange,
  onLineStyleChange
}) => {
  const [selectedColor, setSelectedColor] = useState('#000000');

  const penModes = [
    { id: 'smart-draw', label: 'الرسم الذكي', description: 'تحويل الأشكال إلى أشكال هندسية' },
    { id: 'root-connector', label: 'الجذر', description: 'ربط العناصر ببعضها' },
    { id: 'auto-group', label: 'التجميع التلقائي', description: 'تجميع العناصر المحاطة' },
    { id: 'eraser', label: 'المسح', description: 'حذف العناصر بالرسم فوقها' }
  ];

  const lineStyles = [
    { value: 'solid', label: 'متصل' },
    { value: 'dashed', label: 'متقطع' },
    { value: 'dotted', label: 'نقطي' }
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Pen className="w-5 h-5 text-blue-500" />
          القلم الذكي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* وضع القلم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">وضع القلم</h4>
          <div className="grid grid-cols-1 gap-2">
            {penModes.map((mode) => (
              <Button
                key={mode.id}
                onClick={() => onPenModeSelect(mode.id)}
                variant={selectedPenMode === mode.id ? "default" : "outline"}
                className={`h-auto p-3 text-right font-arabic rounded-xl ${
                  selectedPenMode === mode.id ? 'bg-blue-500 text-white' : ''
                }`}
              >
                <div className="text-left w-full">
                  <div className="font-medium text-sm">{mode.label}</div>
                  <div className="text-xs opacity-75 mt-1">{mode.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* سُمك الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">سُمك الخط</h4>
          <div className="space-y-2">
            <Slider
              value={[lineWidth]}
              onValueChange={(value) => onLineWidthChange(value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center font-arabic">
              {lineWidth}px
            </div>
          </div>
        </div>

        <Separator />

        {/* نمط الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نمط الخط</h4>
          <Select value={lineStyle} onValueChange={onLineStyleChange}>
            <SelectTrigger className="w-full font-arabic rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* لون الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">لون الخط</h4>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer"
            />
            <div className="flex-1 bg-gray-50 px-3 py-2 rounded-xl font-mono text-sm">
              {selectedColor}
            </div>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>✏️ اسحب لرسم خطوط وأشكال</div>
            <div>🔗 استخدم الجذر لربط العناصر</div>
            <div>🎯 الرسم الذكي يحول الخطوط لأشكال هندسية</div>
            <div>🗑️ المسح يحذف ما ترسم عليه</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartPenPanel;