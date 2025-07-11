import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Type, 
  Square, 
  Circle,
  X,
  Copy,
  RotateCcw,
  Pipette
} from 'lucide-react';
import { CanvasTheme } from '../types/index';
import { CANVAS_THEMES } from '../constants/index';

interface AppearancePanelProps {
  isVisible: boolean;
  onToggle: () => void;
  selectedElementIds: string[];
  theme: CanvasTheme;
  onThemeChange: (theme: CanvasTheme) => void;
  onElementStyleChange: (elementIds: string[], style: Record<string, any>) => void;
}

interface StyleState {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  opacity: number;
  fontSize: number;
  fontWeight: string;
  textColor: string;
  rotation: number;
}

const AppearancePanel: React.FC<AppearancePanelProps> = ({
  isVisible,
  onToggle,
  selectedElementIds,
  theme,
  onThemeChange,
  onElementStyleChange
}) => {
  const [currentStyle, setCurrentStyle] = useState<StyleState>({
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 0,
    opacity: 100,
    fontSize: 16,
    fontWeight: 'normal',
    textColor: '#000000',
    rotation: 0
  });

  const [customColors, setCustomColors] = useState<string[]>([
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ]);

  const hasSelection = selectedElementIds.length > 0;

  const handleStyleChange = (property: keyof StyleState, value: any) => {
    const newStyle = { ...currentStyle, [property]: value };
    setCurrentStyle(newStyle);
    
    if (hasSelection) {
      onElementStyleChange(selectedElementIds, { [property]: value });
    }
  };

  const applyToSelection = () => {
    if (hasSelection) {
      onElementStyleChange(selectedElementIds, currentStyle);
    }
  };

  const resetStyle = () => {
    const defaultStyle: StyleState = {
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 1,
      borderRadius: 0,
      opacity: 100,
      fontSize: 16,
      fontWeight: 'normal',
      textColor: '#000000',
      rotation: 0
    };
    setCurrentStyle(defaultStyle);
    if (hasSelection) {
      onElementStyleChange(selectedElementIds, defaultStyle);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="w-80 h-[600px] flex flex-col bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Palette className="w-4 h-4 text-primary" />
          المظهر والتصميم
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <Tabs defaultValue="colors" className="flex-1">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="colors" className="text-xs">ألوان</TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">نصوص</TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">تخطيط</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="colors" className="space-y-4 mt-0">
              {/* Color Themes */}
              <div>
                <h4 className="text-sm font-medium mb-2">قوالب الألوان</h4>
                <div className="grid grid-cols-1 gap-2">
                  {CANVAS_THEMES.map((themeOption) => (
                    <Button
                      key={themeOption.id}
                      variant={theme.id === themeOption.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onThemeChange(themeOption)}
                      className="justify-start gap-2 h-8"
                    >
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: themeOption.colors.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: themeOption.colors.secondary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: themeOption.colors.accent }}
                        />
                      </div>
                      <span className="text-xs">{themeOption.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Background Color */}
              <div>
                <label className="text-sm font-medium block mb-2">لون الخلفية</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="color"
                    value={currentStyle.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-12 h-8 p-1 cursor-pointer"
                  />
                  <Input
                    value={currentStyle.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
                
                {/* Quick Colors */}
                <div className="grid grid-cols-5 gap-1">
                  {customColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => handleStyleChange('backgroundColor', color)}
                    />
                  ))}
                </div>
              </div>

              {/* Border */}
              <div>
                <label className="text-sm font-medium block mb-2">الحدود</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentStyle.borderColor}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      value={currentStyle.borderColor}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                      className="flex-1 text-xs"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>سمك الحدود</span>
                      <span>{currentStyle.borderWidth}px</span>
                    </div>
                    <Slider
                      value={[currentStyle.borderWidth]}
                      onValueChange={([value]) => handleStyleChange('borderWidth', value)}
                      max={10}
                      min={0}
                      step={1}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>انحناء الزوايا</span>
                      <span>{currentStyle.borderRadius}px</span>
                    </div>
                    <Slider
                      value={[currentStyle.borderRadius]}
                      onValueChange={([value]) => handleStyleChange('borderRadius', value)}
                      max={50}
                      min={0}
                      step={1}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>الشفافية</span>
                  <span>{currentStyle.opacity}%</span>
                </div>
                <Slider
                  value={[currentStyle.opacity]}
                  onValueChange={([value]) => handleStyleChange('opacity', value)}
                  max={100}
                  min={0}
                  step={1}
                  className="h-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4 mt-0">
              {/* Text Color */}
              <div>
                <label className="text-sm font-medium block mb-2">لون النص</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentStyle.textColor}
                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                    className="w-12 h-8 p-1 cursor-pointer"
                  />
                  <Input
                    value={currentStyle.textColor}
                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>حجم الخط</span>
                  <span>{currentStyle.fontSize}px</span>
                </div>
                <Slider
                  value={[currentStyle.fontSize]}
                  onValueChange={([value]) => handleStyleChange('fontSize', value)}
                  max={72}
                  min={8}
                  step={1}
                  className="h-2"
                />
              </div>

              {/* Font Weight */}
              <div>
                <label className="text-sm font-medium block mb-2">وزن الخط</label>
                <div className="grid grid-cols-3 gap-1">
                  {['normal', 'bold', '300'].map((weight) => (
                    <Button
                      key={weight}
                      variant={currentStyle.fontWeight === weight ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStyleChange('fontWeight', weight)}
                      className="text-xs"
                    >
                      {weight === 'normal' ? 'عادي' : weight === 'bold' ? 'عريض' : 'رفيع'}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4 mt-0">
              {/* Rotation */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>الدوران</span>
                  <span>{currentStyle.rotation}°</span>
                </div>
                <Slider
                  value={[currentStyle.rotation]}
                  onValueChange={([value]) => handleStyleChange('rotation', value)}
                  max={360}
                  min={0}
                  step={1}
                  className="h-2"
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Action Buttons */}
        <div className="space-y-2 mt-4">
          <Separator />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={applyToSelection}
              disabled={!hasSelection}
              className="flex-1 text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              تطبيق ({selectedElementIds.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetStyle}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
          
          {!hasSelection && (
            <p className="text-xs text-muted-foreground text-center">
              حدد عناصر لتطبيق التصميم عليها
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearancePanel;