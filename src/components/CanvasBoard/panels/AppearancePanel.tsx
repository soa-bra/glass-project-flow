/**
 * @fileoverview Enhanced Appearance Panel for element styling
 * @author AI Assistant
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Save, Copy } from 'lucide-react';

interface AppearancePanelProps {
  selectedElement: any;
  onUpdateElement: (elementId: string, updates: any) => void;
}

/**
 * Enhanced Appearance Panel Component
 * Provides comprehensive styling options for selected elements
 */
const AppearancePanel: React.FC<AppearancePanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  const [fillColor, setFillColor] = useState('#f0f0f0');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(1);
  const [opacity, setOpacity] = useState(100);

  const presetColors = [
    '#96d8d0', '#f1b5b9', '#a4e2f6', '#d1e1ea',
    '#e9eff4', '#bdeed3', '#d9d2fd', '#fbe2aa'
  ];

  useEffect(() => {
    if (selectedElement?.style) {
      setFillColor(selectedElement.style.fillColor || '#f0f0f0');
      setBorderColor(selectedElement.style.borderColor || '#000000');
      setBorderWidth(selectedElement.style.borderWidth || 1);
      setOpacity((selectedElement.style.opacity || 1) * 100);
    }
  }, [selectedElement]);

  const handleUpdate = () => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        fillColor,
        borderColor,
        borderWidth,
        opacity: opacity / 100
      }
    });
  };

  if (!selectedElement) {
    return (
      <Card className="h-full glass-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5" />
            لوحة المظهر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            اختر عنصراً لتخصيص مظهره
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-section">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="w-5 h-5 text-primary" />
          لوحة المظهر
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Fill Color */}
        <div className="space-y-3">
          <label className="text-sm font-medium">لون التعبئة</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <Input
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="flex-1"
            />
          </div>
          
          {/* Preset Colors */}
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setFillColor(color)}
                className="w-8 h-8 rounded border-2 border-gray-200 hover:border-primary transition-colors"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Border */}
        <div className="space-y-3">
          <label className="text-sm font-medium">الحدود</label>
          
          <div className="flex gap-2">
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <Input
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">السماكة</span>
              <span className="text-sm text-muted-foreground">{borderWidth}px</span>
            </div>
            <Slider
              value={[borderWidth]}
              onValueChange={(value) => setBorderWidth(value[0])}
              min={0}
              max={10}
              step={1}
            />
          </div>
          
          <Select defaultValue="solid">
            <SelectTrigger>
              <SelectValue placeholder="نمط الحد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">متصل</SelectItem>
              <SelectItem value="dashed">متقطع</SelectItem>
              <SelectItem value="dotted">نقطي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">الشفافية</label>
            <span className="text-sm text-muted-foreground">{opacity}%</span>
          </div>
          <Slider
            value={[opacity]}
            onValueChange={(value) => setOpacity(value[0])}
            min={0}
            max={100}
            step={5}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleUpdate} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            حفظ النمط
          </Button>
          <Button variant="outline" className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            تطبيق على الكل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearancePanel;