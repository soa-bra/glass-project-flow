import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Palette, Square, Circle } from 'lucide-react';
import { CanvasElement } from '../../types';

interface ElementStylePanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (elementId: string, updates: any) => void;
}

export const ElementStylePanel: React.FC<ElementStylePanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderStyle, setBorderStyle] = useState('solid');

  const colorPalette = [
    '#000000', '#ffffff', '#96d8d0', '#f1b5b9', '#a4e2f6',
    '#d1e1ea', '#e9eff4', '#bdeed3', '#d9d2fd', '#fbe2aa',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9'
  ];

  const borderStyles = [
    { value: 'solid', label: 'مصمت' },
    { value: 'dashed', label: 'متقطع' },
    { value: 'dotted', label: 'نقاط' },
    { value: 'double', label: 'مزدوج' }
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { fill: color });
    }
  };

  const handleBorderWidthChange = (value: number[]) => {
    const width = value[0];
    setBorderWidth(width);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { strokeWidth: width });
    }
  };

  const handleBorderColorChange = (color: string) => {
    setBorderColor(color);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { stroke: color });
    }
  };

  const handleBorderStyleChange = (style: string) => {
    setBorderStyle(style);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { strokeDashArray: style === 'dashed' ? [5, 5] : style === 'dotted' ? [2, 2] : [] });
    }
  };

  if (!selectedElement) {
    return (
      <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Palette className="w-12 h-12 text-[#96d8d0] mx-auto mb-3" />
            <p className="text-sm font-arabic text-black/70">
              اختر عنصرًا لتخصيص مظهره
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Palette className="w-5 h-5 text-[#96d8d0]" />
          تخصيص المظهر
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
        {/* Fill Color */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 text-black">لون التعبئة</h4>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colorPalette.map((color) => (
              <Button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-12 h-12 rounded-[12px] border-2 p-0 ${
                  selectedColor === color ? 'border-black' : 'border-[#d1e1ea]'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          {/* Custom Color Picker */}
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-16 h-12 rounded-[12px] border-[#d1e1ea] cursor-pointer"
            />
            <Input
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 font-arabic text-sm rounded-[12px] border-[#d1e1ea] text-black"
            />
          </div>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Border Settings */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 text-black">إعدادات الحد</h4>
          
          {/* Border Width */}
          <div className="mb-4">
            <label className="text-xs font-arabic text-black/70 mb-2 block">سمك الحد: {borderWidth}px</label>
            <Slider
              value={[borderWidth]}
              onValueChange={handleBorderWidthChange}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Border Color */}
          <div className="mb-4">
            <label className="text-xs font-arabic text-black/70 mb-2 block">لون الحد</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {colorPalette.slice(0, 10).map((color) => (
                <Button
                  key={`border-${color}`}
                  onClick={() => handleBorderColorChange(color)}
                  className={`w-8 h-8 rounded-[8px] border-2 p-0 ${
                    borderColor === color ? 'border-black' : 'border-[#d1e1ea]'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="color"
                value={borderColor}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                className="w-12 h-8 rounded-[8px] border-[#d1e1ea] cursor-pointer"
              />
              <Input
                type="text"
                value={borderColor}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                className="flex-1 text-xs rounded-[8px] border-[#d1e1ea] text-black"
              />
            </div>
          </div>

          {/* Border Style */}
          <div>
            <label className="text-xs font-arabic text-black/70 mb-2 block">نمط الحد</label>
            <div className="grid grid-cols-2 gap-2">
              {borderStyles.map((style) => (
                <Button
                  key={style.value}
                  onClick={() => handleBorderStyleChange(style.value)}
                  variant={borderStyle === style.value ? "default" : "outline"}
                  size="sm"
                  className={`rounded-[12px] text-xs font-arabic ${
                    borderStyle === style.value 
                      ? 'bg-[#96d8d0] text-black hover:bg-[#96d8d0]/80' 
                      : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
                  }`}
                >
                  {style.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Quick Shapes */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 text-black">أشكال سريعة</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
            >
              <Square className="w-4 h-4 mr-2" />
              مربع
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none"
            >
              <Circle className="w-4 h-4 mr-2" />
              دائرة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};