import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Square, Circle } from 'lucide-react';

interface ElementCustomizationPanelProps {
  visible?: boolean;
  selectedElement?: any;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

const ElementCustomizationPanel: React.FC<ElementCustomizationPanelProps> = ({
  visible = true,
  selectedElement,
  onElementUpdate
}) => {
  const [fillColor, setFillColor] = useState('#96d8d0');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState([2]);
  const [opacity, setOpacity] = useState([100]);

  const colorPalette = [
    '#96d8d0', '#f1b5b9', '#a4e2f6', '#d1e1ea', 
    '#e9eff4', '#bdeed3', '#d9d2fd', '#fbe2aa'
  ];

  const handleColorChange = (color: string, type: 'fill' | 'border') => {
    if (type === 'fill') {
      setFillColor(color);
    } else {
      setBorderColor(color);
    }
    
    if (selectedElement && onElementUpdate) {
      onElementUpdate(selectedElement.id, {
        [type === 'fill' ? 'fillColor' : 'borderColor']: color
      });
    }
  };

  if (!visible || !selectedElement) return null;

  return (
    <div className="fixed top-4 left-4 z-40" style={{ width: '6%' }}>
      <Card className="bg-soabra-new-canvas-floating-panels rounded-[32px] shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-soabra-new-canvas-text font-arabic">
            تخصيص العنصر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-soabra-new-canvas-palette-5 rounded-2xl">
              <TabsTrigger 
                value="colors" 
                className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
              >
                الألوان
              </TabsTrigger>
              <TabsTrigger 
                value="borders" 
                className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
              >
                الحدود
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
                  لون التعبئة
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {colorPalette.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className={`h-8 w-8 p-0 rounded-lg border-2 ${
                        fillColor === color ? 'border-soabra-new-canvas-active-tab' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color, 'fill')}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={fillColor}
                  onChange={(e) => handleColorChange(e.target.value, 'fill')}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
                  الشفافية
                </h4>
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {opacity[0]}%
                </div>
              </div>
            </TabsContent>

            <TabsContent value="borders" className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
                  لون الحد
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {colorPalette.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className={`h-8 w-8 p-0 rounded-lg border-2 ${
                        borderColor === color ? 'border-soabra-new-canvas-active-tab' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color, 'border')}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={borderColor}
                  onChange={(e) => handleColorChange(e.target.value, 'border')}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
                  سمك الحد
                </h4>
                <Slider
                  value={borderWidth}
                  onValueChange={setBorderWidth}
                  max={20}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {borderWidth[0]}px
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElementCustomizationPanel;