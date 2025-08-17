import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Palette, Save, Copy } from 'lucide-react';

interface AppearancePanelProps {
  selectedElement?: any;
  onUpdateElement?: (elementId: string, updates: any) => void;
}

export const AppearancePanel: React.FC<AppearancePanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  const [fillColor, setFillColor] = useState('#96d8d0');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState([2]);
  const [opacity, setOpacity] = useState([100]);

  const presetColors = [
    '#96d8d0', '#f1b5b9', '#a4e2f6', '#d1e1ea',
    '#e9eff4', '#bdeed3', '#a4e2f6', '#d9d2fd', '#fbe2aa'
  ];

  const borderStyles = ['متصل', 'متقطع', 'نقطي'];

  return (
    <Card className="h-full bg-background/95 backdrop-blur border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          تخصيص المظهر
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-3 pt-0">
        {/* Color Picker */}
        <div className="space-y-2">
          <label className="text-xs font-medium">لون التعبئة</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="flex-1 h-8 text-xs"
            />
          </div>
          <div className="grid grid-cols-5 gap-1">
            {presetColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                className={`w-6 h-6 rounded border-2 border-border bg-[${color}]`}
                onClick={() => setFillColor(color)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Border Controls */}
        <div className="space-y-3">
          <label className="text-xs font-medium">الحدود</label>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
            
            <div>
              <span className="text-xs text-muted-foreground">السمك: {borderWidth[0]}px</span>
              <Slider
                value={borderWidth}
                onValueChange={setBorderWidth}
                max={10}
                min={0}
                step={1}
                className="mt-1"
              />
            </div>

            <select className="w-full p-2 text-xs border rounded">
              {borderStyles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>

        <Separator />

        {/* Opacity */}
        <div className="space-y-2">
          <label className="text-xs font-medium">الشفافية: {opacity[0]}%</label>
          <Slider
            value={opacity}
            onValueChange={setOpacity}
            max={100}
            min={0}
            step={5}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
            <Save className="h-3 w-3 mr-1" />
            حفظ النمط
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
            <Copy className="h-3 w-3 mr-1" />
            تطبيق للكل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearancePanel;