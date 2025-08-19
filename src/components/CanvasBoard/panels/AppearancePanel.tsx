import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  Palette, 
  Grid3X3, 
  Layers, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon,
  Monitor
} from 'lucide-react';

interface AppearancePanelProps {
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  gridOpacity?: number;
  theme?: 'light' | 'dark' | 'auto';
  onGridToggle?: (show: boolean) => void;
  onSnapToggle?: (snap: boolean) => void;
  onGridSizeChange?: (size: number) => void;
  onGridOpacityChange?: (opacity: number) => void;
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void;
}

const AppearancePanel: React.FC<AppearancePanelProps> = ({
  showGrid = true,
  snapToGrid = true,
  gridSize = 20,
  gridOpacity = 0.3,
  theme = 'auto',
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridOpacityChange,
  onThemeChange
}) => {
  const [selectedColorScheme, setSelectedColorScheme] = useState('default');

  const colorSchemes = [
    { id: 'default', name: 'افتراضي', colors: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'] },
    { id: 'warm', name: 'دافئ', colors: ['#dc2626', '#ea580c', '#ca8a04', '#65a30d'] },
    { id: 'cool', name: 'بارد', colors: ['#2563eb', '#7c3aed', '#0891b2', '#059669'] },
    { id: 'pastel', name: 'باستيل', colors: ['#f8b4cb', '#b4e6f8', '#d4b4f8', '#f8e4b4'] }
  ];

  const themeOptions = [
    { value: 'light', label: 'فاتح', icon: Sun },
    { value: 'dark', label: 'داكن', icon: Moon },
    { value: 'auto', label: 'تلقائي', icon: Monitor }
  ];

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette size={18} className="text-primary" />
          المظهر والتخصيص
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* النسق */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Monitor size={14} />
            النسق
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.value}
                  size="sm"
                  variant={theme === option.value ? "default" : "outline"}
                  onClick={() => onThemeChange?.(option.value as any)}
                  className="text-xs"
                >
                  <IconComponent size={12} className="mr-1" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* الشبكة */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Grid3X3 size={14} />
            إعدادات الشبكة
          </Label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-grid" className="text-sm flex items-center gap-1">
                {showGrid ? <Eye size={12} /> : <EyeOff size={12} />}
                إظهار الشبكة
              </Label>
              <Switch
                id="show-grid"
                checked={showGrid}
                onCheckedChange={onGridToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="snap-to-grid" className="text-sm">
                الالتصاق بالشبكة
              </Label>
              <Switch
                id="snap-to-grid"
                checked={snapToGrid}
                onCheckedChange={onSnapToggle}
              />
            </div>

            {showGrid && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    حجم الشبكة: {gridSize}px
                  </Label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={(value) => onGridSizeChange?.(value[0])}
                    min={10}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    شفافية الشبكة: {Math.round(gridOpacity * 100)}%
                  </Label>
                  <Slider
                    value={[gridOpacity]}
                    onValueChange={(value) => onGridOpacityChange?.(value[0])}
                    min={0.1}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* نظام الألوان */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Palette size={14} />
            نظام الألوان
          </Label>

          <div className="space-y-2">
            {colorSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedColorScheme === scheme.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedColorScheme(scheme.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{scheme.name}</span>
                  <div className="flex gap-1">
                    {scheme.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full border bg-[${color}]`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* إعدادات الطبقات */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Layers size={14} />
            إعدادات الطبقات
          </Label>

          <div className="grid grid-cols-2 gap-2">
            <BaseBadge variant="secondary" className="text-xs justify-center py-1">
              شفافية ذكية
            </BaseBadge>
            <BaseBadge variant="secondary" className="text-xs justify-center py-1">
              ترتيب تلقائي
            </BaseBadge>
          </div>

          <Button size="sm" variant="outline" className="w-full text-xs">
            إعادة تعيين الطبقات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearancePanel;