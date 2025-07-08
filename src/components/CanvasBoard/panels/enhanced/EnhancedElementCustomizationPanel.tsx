
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Settings, Type, Square } from 'lucide-react';

interface ElementCustomizationPanelProps {
  selectedElement?: any;
  onUpdateElement?: (elementId: string, updates: any) => void;
}

const EnhancedElementCustomizationPanel: React.FC<ElementCustomizationPanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  const [selectedColor, setSelectedColor] = useState('#96d8d0');
  const [borderWidth, setBorderWidth] = useState([2]);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderStyle, setBorderStyle] = useState('solid');

  const colorPalette = [
    '#96d8d0', '#f1b5b9', '#a4e2f6', '#d1e1ea', 
    '#e9eff4', '#bdeed3', '#d9d2fd', '#fbe2aa',
    '#000000', '#ffffff', '#ff6b6b', '#4ecdc4',
    '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'
  ];

  const borderStyles = [
    { value: 'solid', label: 'خط مستمر' },
    { value: 'dashed', label: 'خط متقطع' },
    { value: 'dotted', label: 'خط منقط' },
    { value: 'double', label: 'خط مزدوج' }
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedElement && onUpdateElement) {
      onUpdateElement(selectedElement.id, {
        fill: color,
        style: { ...selectedElement.style, backgroundColor: color }
      });
    }
  };

  const handleBorderWidthChange = (value: number[]) => {
    setBorderWidth(value);
    if (selectedElement && onUpdateElement) {
      onUpdateElement(selectedElement.id, {
        strokeWidth: value[0],
        style: { ...selectedElement.style, borderWidth: `${value[0]}px` }
      });
    }
  };

  const handleBorderColorChange = (color: string) => {
    setBorderColor(color);
    if (selectedElement && onUpdateElement) {
      onUpdateElement(selectedElement.id, {
        stroke: color,
        style: { ...selectedElement.style, borderColor: color }
      });
    }
  };

  const handleBorderStyleChange = (style: string) => {
    setBorderStyle(style);
    if (selectedElement && onUpdateElement) {
      onUpdateElement(selectedElement.id, {
        style: { ...selectedElement.style, borderStyle: style }
      });
    }
  };

  if (!selectedElement) {
    return (
      <Card className="w-80 bg-[#f2f9fb] backdrop-blur-xl shadow-sm border border-white/20 rounded-[24px]">
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center text-gray-500 font-arabic">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>حدد عنصراً لتخصيص مظهره</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 bg-[#f2f9fb] backdrop-blur-xl shadow-sm border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-[#000000] flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#96d8d0]" />
          تخصيص المظهر
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/30 rounded-xl">
            <TabsTrigger 
              value="colors" 
              className="rounded-xl font-arabic text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white data-[state=inactive]:text-[#000000]"
            >
              الألوان
            </TabsTrigger>
            <TabsTrigger 
              value="border" 
              className="rounded-xl font-arabic text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white data-[state=inactive]:text-[#000000]"
            >
              الحدود
            </TabsTrigger>
            <TabsTrigger 
              value="text" 
              className="rounded-xl font-arabic text-sm data-[state=active]:bg-[#000000] data-[state=active]:text-white data-[state=inactive]:text-[#000000]"
            >
              النص
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4 mt-4">
            {/* Color Picker */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">لون التعبئة</h4>
              <div className="grid grid-cols-8 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-[#000000] scale-110' 
                        : 'border-white/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Custom Color Input */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">لون مخصص</h4>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-8 rounded-lg border-white/30 bg-white/50"
                />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 rounded-xl border-white/30 bg-white/50 text-[#000000] font-mono text-sm"
                  placeholder="#96d8d0"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="border" className="space-y-4 mt-4">
            {/* Border Width */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">
                سمك الحد: {borderWidth[0]}px
              </h4>
              <Slider
                value={borderWidth}
                onValueChange={handleBorderWidthChange}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
            
            {/* Border Color */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">لون الحد</h4>
              <div className="grid grid-cols-8 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleBorderColorChange(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      borderColor === color 
                        ? 'border-[#000000] scale-110' 
                        : 'border-white/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Border Style */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">نمط الحد</h4>
              <div className="grid grid-cols-2 gap-2">
                {borderStyles.map((style) => (
                  <Button
                    key={style.value}
                    onClick={() => handleBorderStyleChange(style.value)}
                    variant={borderStyle === style.value ? 'default' : 'outline'}
                    className="rounded-xl font-arabic text-xs"
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4 mt-4">
            {selectedElement?.type === 'text' ? (
              <>
                <div>
                  <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">حجم الخط</h4>
                  <Slider
                    value={[parseInt(selectedElement.style?.fontSize || '16')]}
                    onValueChange={(value) => {
                      if (onUpdateElement) {
                        onUpdateElement(selectedElement.id, {
                          style: { 
                            ...selectedElement.style, 
                            fontSize: `${value[0]}px` 
                          }
                        });
                      }
                    }}
                    max={72}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">لون النص</h4>
                  <div className="grid grid-cols-8 gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          if (onUpdateElement) {
                            onUpdateElement(selectedElement.id, {
                              style: { 
                                ...selectedElement.style, 
                                color: color 
                              }
                            });
                          }
                        }}
                        className="w-8 h-8 rounded-lg border-2 border-white/30 hover:scale-105 transition-all"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 font-arabic">
                <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>تخصيص النص متاح للعناصر النصية فقط</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedElementCustomizationPanel;
