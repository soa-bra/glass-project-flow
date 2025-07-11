
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Palette, Settings } from 'lucide-react';

interface ElementCustomizationPanelProps {
  selectedElement?: any;
  onUpdateElement?: (updates: any) => void;
}

const ElementCustomizationPanel: React.FC<ElementCustomizationPanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  const [selectedColor, setSelectedColor] = useState(selectedElement?.color || '#000000');
  const [borderWidth, setBorderWidth] = useState(selectedElement?.borderWidth || 1);
  const [borderColor, setBorderColor] = useState(selectedElement?.borderColor || '#000000');
  const [borderStyle, setBorderStyle] = useState(selectedElement?.borderStyle || 'solid');
  const [fillOpacity, setFillOpacity] = useState(selectedElement?.fillOpacity || 100);

  // مجموعة الألوان المتاحة
  const colorPalette = [
    '#000000', '#ffffff', '#96d8d0', '#f1b5b9', '#a4e2f6', 
    '#d1e1ea', '#e9eff4', '#bdeed3', '#d9d2fd', '#fbe2aa'
  ];

  const borderStyles = [
    { value: 'solid', label: 'متصل' },
    { value: 'dashed', label: 'متقطع' },
    { value: 'dotted', label: 'نقطي' },
    { value: 'none', label: 'بدون حد' }
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onUpdateElement?.({ color });
  };

  const handleBorderWidthChange = (width: number) => {
    setBorderWidth(width);
    onUpdateElement?.({ borderWidth: width });
  };

  const handleBorderColorChange = (color: string) => {
    setBorderColor(color);
    onUpdateElement?.({ borderColor: color });
  };

  const handleBorderStyleChange = (style: string) => {
    setBorderStyle(style);
    onUpdateElement?.({ borderStyle: style });
  };

  const handleOpacityChange = (opacity: number) => {
    setFillOpacity(opacity);
    onUpdateElement?.({ fillOpacity: opacity });
  };

  if (!selectedElement) {
    return (
      <Card className="w-80 bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic text-black flex items-center gap-2">
            <Palette className="w-5 h-5" />
            تخصيص مظهر العنصر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-sm text-gray-500 font-arabic">
              يرجى تحديد عنصر لتخصيص مظهره
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-black flex items-center gap-2">
          <Palette className="w-5 h-5" />
          تخصيص مظهر العنصر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* اختيار اللون الأساسي */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 text-black">لون التعبئة</h4>
          
          {/* مربع اللون المحدد */}
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-12 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: selectedColor }}
              onClick={() => document.getElementById('color-picker')?.click()}
            />
            <input
              id="color-picker"
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="hidden"
            />
            <div className="flex-1">
              <div className="bg-white px-3 py-2 rounded-xl border border-gray-300 font-mono text-sm">
                {selectedColor.toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* لوحة الألوان المحددة مسبقاً */}
          <div className="grid grid-cols-5 gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  selectedColor === color ? 'border-black scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* شفافية التعبئة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2 text-black">شفافية التعبئة</h4>
          <div className="space-y-2">
            <Slider
              value={[fillOpacity]}
              onValueChange={(value) => handleOpacityChange(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="text-xs text-gray-600 text-center font-arabic">
              {fillOpacity}%
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* تخصيص الحدود */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 text-black">تخصيص الحدود</h4>
          
          {/* سُمك الحد */}
          <div className="mb-3">
            <label className="text-xs font-arabic text-gray-700 mb-1 block">سُمك الحد</label>
            <div className="space-y-2">
              <Slider
                value={[borderWidth]}
                onValueChange={(value) => handleBorderWidthChange(value[0])}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-gray-600 text-center font-arabic">
                {borderWidth}px
              </div>
            </div>
          </div>
          
          {/* لون الحد */}
          <div className="mb-3">
            <label className="text-xs font-arabic text-gray-700 mb-1 block">لون الحد</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer"
                style={{ backgroundColor: borderColor }}
                onClick={() => document.getElementById('border-color-picker')?.click()}
              />
              <input
                id="border-color-picker"
                type="color"
                value={borderColor}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                className="hidden"
              />
              <div className="flex-1 bg-white px-2 py-1 rounded-lg border border-gray-300 font-mono text-xs">
                {borderColor.toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* نمط الحد */}
          <div>
            <label className="text-xs font-arabic text-gray-700 mb-1 block">نمط الحد</label>
            <Select value={borderStyle} onValueChange={handleBorderStyleChange}>
              <SelectTrigger className="w-full font-arabic rounded-xl border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {borderStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* أدوات سريعة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2 text-black">أدوات سريعة</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-arabic rounded-xl border-gray-300"
              onClick={() => {
                handleColorChange('#ffffff');
                handleBorderColorChange('#000000');
                handleBorderWidthChange(1);
              }}
            >
              نمط كلاسيكي
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-arabic rounded-xl border-gray-300"
              onClick={() => {
                handleColorChange('#96d8d0');
                handleBorderColorChange('#96d8d0');
                handleBorderWidthChange(0);
              }}
            >
              نمط عصري
            </Button>
          </div>
        </div>

        {/* معاينة */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-xs font-arabic text-gray-600 mb-2 text-center">معاينة</div>
          <div
            className="w-full h-16 rounded-lg mx-auto"
            style={{
              backgroundColor: selectedColor,
              borderWidth: `${borderWidth}px`,
              borderColor: borderColor,
              borderStyle: borderStyle,
              opacity: fillOpacity / 100
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementCustomizationPanel;
