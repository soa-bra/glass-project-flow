import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  Pipette, 
  RotateCcw, 
  Save, 
  Star,
  Grid3X3,
  Circle
} from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/components/shared/design-system/constants';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onSave?: (color: string) => void;
  savedColors?: string[];
}

interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export const FeatureColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  onSave,
  savedColors = []
}) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [hsvColor, setHsvColor] = useState<HSVColor>({ h: 0, s: 50, v: 50 });
  const [rgbColor, setRgbColor] = useState<RGBColor>({ r: 128, g: 128, b: 128 });
  const [alpha, setAlpha] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  
  const wheelRef = useRef<HTMLCanvasElement>(null);
  const saturationRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  // Default color palette using design tokens
  const defaultColors = [
    COLORS.PALETTE_RED, COLORS.PALETTE_ORANGE, COLORS.PALETTE_YELLOW, COLORS.PALETTE_LIME, 
    COLORS.PALETTE_GREEN, COLORS.PALETTE_MINT, COLORS.PALETTE_CYAN, COLORS.PALETTE_BLUE, 
    COLORS.PALETTE_NAVY, COLORS.PALETTE_PURPLE, COLORS.PALETTE_MAGENTA, COLORS.PALETTE_PINK,
    COLORS.PALETTE_BLACK, COLORS.PALETTE_DARK_GRAY, COLORS.PALETTE_GRAY, COLORS.PALETTE_LIGHT_GRAY,
    COLORS.PALETTE_WHITE, COLORS.PALETTE_BROWN, COLORS.PALETTE_BEIGE, COLORS.PALETTE_PLUM,
    COLORS.PALETTE_LIGHT_GREEN, COLORS.PALETTE_KHAKI, COLORS.PALETTE_SKY_BLUE, COLORS.PALETTE_TAN
  ];

  // Color conversion utilities
  const hexToRgb = useCallback((hex: string): RGBColor => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }, []);

  const rgbToHsv = useCallback((r: number, g: number, b: number): HSVColor => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const s = max === 0 ? 0 : Math.round((diff / max) * 100);
    const v = Math.round(max * 100);
    
    return { h, s, v };
  }, []);

  const hsvToRgb = useCallback((h: number, s: number, v: number): RGBColor => {
    h /= 60;
    s /= 100;
    v /= 100;
    
    const c = v * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = v - c;
    
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 1) { r = c; g = x; b = 0; }
    else if (h >= 1 && h < 2) { r = x; g = c; b = 0; }
    else if (h >= 2 && h < 3) { r = 0; g = c; b = x; }
    else if (h >= 3 && h < 4) { r = 0; g = x; b = c; }
    else if (h >= 4 && h < 5) { r = x; g = 0; b = c; }
    else if (h >= 5 && h < 6) { r = c; g = 0; b = x; }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }, []);

  // Draw color wheel
  const drawColorWheel = useCallback(() => {
    const canvas = wheelRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    
    // Create gradient for hue wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, radius * 0.3, endAngle, startAngle, true);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, []);

  // Draw saturation/brightness picker
  const drawSaturationPicker = useCallback(() => {
    const canvas = saturationRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create base color
    const baseColor = hsvToRgb(hsvColor.h, 100, 100);
    ctx.fillStyle = rgbToHex(baseColor.r, baseColor.g, baseColor.b);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add white to black gradient (saturation)
    const whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add transparent to black gradient (brightness)
    const blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [hsvColor.h, hsvToRgb, rgbToHex]);

  // Handle color wheel click
  const handleWheelClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = wheelRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= radius && distance >= radius * 0.3) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const hue = angle < 0 ? angle + 360 : angle;
      
      setHsvColor(prev => ({ ...prev, h: hue }));
    }
  }, []);

  // Handle saturation picker click
  const handleSaturationClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = saturationRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const saturation = (x / canvas.width) * 100;
    const value = ((canvas.height - y) / canvas.height) * 100;
    
    setHsvColor(prev => ({ ...prev, s: saturation, v: value }));
  }, []);

  // Update colors when HSV changes
  useEffect(() => {
    const rgb = hsvToRgb(hsvColor.h, hsvColor.s, hsvColor.v);
    setRgbColor(rgb);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setCurrentColor(hex);
    onChange(hex);
  }, [hsvColor, hsvToRgb, rgbToHex, onChange]);

  // Initialize color wheel
  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  // Update saturation picker when hue changes
  useEffect(() => {
    drawSaturationPicker();
  }, [drawSaturationPicker]);

  // Initialize from prop color
  useEffect(() => {
    if (color !== currentColor) {
      const rgb = hexToRgb(color);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHsvColor(hsv);
      setRgbColor(rgb);
      setCurrentColor(color);
    }
  }, [color, currentColor, hexToRgb, rgbToHsv]);

  const handleSaveColor = () => {
    if (onSave) {
      onSave(currentColor);
      setRecentColors(prev => {
        const newColors = [currentColor, ...prev.filter(c => c !== currentColor)];
        return newColors.slice(0, 12);
      });
      toast.success('تم حفظ اللون');
    }
  };

  const handleColorSelect = (selectedColor: string) => {
    setCurrentColor(selectedColor);
    onChange(selectedColor);
    
    const rgb = hexToRgb(selectedColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setHsvColor(hsv);
    setRgbColor(rgb);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          أداة الألوان المتقدمة
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="wheel" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="wheel" className="flex items-center gap-1">
              <Circle className="w-4 h-4" />
              العجلة
            </TabsTrigger>
            <TabsTrigger value="sliders">المتزلقات</TabsTrigger>
            <TabsTrigger value="palette" className="flex items-center gap-1">
              <Grid3X3 className="w-4 h-4" />
              اللوحة
            </TabsTrigger>
          </TabsList>

          {/* Color Wheel Tab */}
          <TabsContent value="wheel" className="space-y-4">
            <div className="space-y-4">
              {/* Color Wheel */}
              <div className="flex justify-center">
                <canvas
                  ref={wheelRef}
                  width={200}
                  height={200}
                  className="cursor-crosshair border rounded-lg"
                  onClick={handleWheelClick}
                />
              </div>
              
              {/* Saturation/Brightness Picker */}
              <div className="flex justify-center">
                <canvas
                  ref={saturationRef}
                  width={200}
                  height={100}
                  className="cursor-crosshair border rounded-lg"
                  onClick={handleSaturationClick}
                />
              </div>
            </div>
          </TabsContent>

          {/* Sliders Tab */}
          <TabsContent value="sliders" className="space-y-4">
            <div className="space-y-4">
              {/* HSV Sliders */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">درجة اللون (H): {Math.round(hsvColor.h)}°</Label>
                  <Slider
                    value={[hsvColor.h]}
                    onValueChange={([h]) => setHsvColor(prev => ({ ...prev, h }))}
                    max={360}
                    step={1}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">التشبع (S): {Math.round(hsvColor.s)}%</Label>
                  <Slider
                    value={[hsvColor.s]}
                    onValueChange={([s]) => setHsvColor(prev => ({ ...prev, s }))}
                    max={100}
                    step={1}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">السطوع (V): {Math.round(hsvColor.v)}%</Label>
                  <Slider
                    value={[hsvColor.v]}
                    onValueChange={([v]) => setHsvColor(prev => ({ ...prev, v }))}
                    max={100}
                    step={1}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* RGB Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">R</Label>
                  <Input
                    type="number"
                    value={rgbColor.r}
                    onChange={(e) => {
                      const r = parseInt(e.target.value) || 0;
                      const newRgb = { ...rgbColor, r: Math.max(0, Math.min(255, r)) };
                      setRgbColor(newRgb);
                      const hsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
                      setHsvColor(hsv);
                    }}
                    min={0}
                    max={255}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">G</Label>
                  <Input
                    type="number"
                    value={rgbColor.g}
                    onChange={(e) => {
                      const g = parseInt(e.target.value) || 0;
                      const newRgb = { ...rgbColor, g: Math.max(0, Math.min(255, g)) };
                      setRgbColor(newRgb);
                      const hsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
                      setHsvColor(hsv);
                    }}
                    min={0}
                    max={255}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">B</Label>
                  <Input
                    type="number"
                    value={rgbColor.b}
                    onChange={(e) => {
                      const b = parseInt(e.target.value) || 0;
                      const newRgb = { ...rgbColor, b: Math.max(0, Math.min(255, b)) };
                      setRgbColor(newRgb);
                      const hsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
                      setHsvColor(hsv);
                    }}
                    min={0}
                    max={255}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Alpha Slider */}
              <div>
                <Label className="text-sm">الشفافية: {alpha}%</Label>
                <Slider
                  value={[alpha]}
                  onValueChange={([a]) => setAlpha(a)}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          {/* Palette Tab */}
          <TabsContent value="palette" className="space-y-4">
            <div className="space-y-4">
              {/* Default Colors */}
              <div>
                <Label className="text-sm font-medium mb-2 block">الألوان الأساسية</Label>
                <div className="grid grid-cols-6 gap-1">
                  {defaultColors.map((paletteColor, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded border-2 bg-current text-[${paletteColor}] ${
                        currentColor === paletteColor ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      onClick={() => handleColorSelect(paletteColor)}
                    />
                  ))}
                </div>
              </div>

              {/* Saved Colors */}
              {savedColors.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">الألوان المحفوظة</Label>
                  <div className="grid grid-cols-6 gap-1">
                    {savedColors.map((savedColor, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded border-2 bg-current text-[${savedColor}] ${
                          currentColor === savedColor ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        onClick={() => handleColorSelect(savedColor)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Colors */}
              {recentColors.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">الألوان الحديثة</Label>
                  <div className="grid grid-cols-6 gap-1">
                    {recentColors.map((recentColor, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded border-2 bg-current text-[${recentColor}] ${
                          currentColor === recentColor ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        onClick={() => handleColorSelect(recentColor)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Current Color Display */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div
            className={`w-12 h-12 rounded-lg border-2 border-gray-300 bg-current text-[${currentColor}]`}
          />
          <div className="flex-1">
            <Input
              value={currentColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="font-mono text-sm"
              placeholder="#000000"
            />
          </div>
          <Button onClick={handleSaveColor} size="sm" variant="outline">
            <Save className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Pipette className="w-4 h-4 mr-2" />
            القطارة
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleColorSelect('#000000')}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};