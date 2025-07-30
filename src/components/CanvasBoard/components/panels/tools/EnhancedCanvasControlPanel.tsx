/**
 * @fileoverview Enhanced Canvas Control Panel for comprehensive canvas management
 * Combines grid, zoom, alignment, and view controls in one integrated panel
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  Eye,
  Settings,
  Target,
  Ruler,
  MousePointer,
  Crosshair,
  Navigation,
  RotateCcw,
  Compass,
  Layers,
  PaintBucket,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';

interface CanvasControlSettings {
  grid: {
    visible: boolean;
    size: number;
    color: string;
    opacity: number;
    snap: boolean;
  };
  zoom: {
    level: number;
    min: number;
    max: number;
    step: number;
  };
  view: {
    rulers: boolean;
    guides: boolean;
    boundaries: boolean;
    center: boolean;
  };
  interaction: {
    cursor: 'default' | 'crosshair' | 'move';
    precision: boolean;
    magnetism: number;
  };
  appearance: {
    theme: 'light' | 'dark';
    background: string;
    contrast: number;
  };
}

interface EnhancedCanvasControlPanelProps {
  settings?: Partial<CanvasControlSettings>;
  onSettingsChange?: (settings: Partial<CanvasControlSettings>) => void;
  onZoomChange?: (zoom: number) => void;
  onPositionReset?: () => void;
  onFitToScreen?: () => void;
  canvasPosition?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

const defaultSettings: CanvasControlSettings = {
  grid: {
    visible: true,
    size: 20,
    color: '#e5e7eb',
    opacity: 0.5,
    snap: false
  },
  zoom: {
    level: 100,
    min: 25,
    max: 400,
    step: 25
  },
  view: {
    rulers: false,
    guides: false,
    boundaries: true,
    center: true
  },
  interaction: {
    cursor: 'default',
    precision: false,
    magnetism: 5
  },
  appearance: {
    theme: 'light',
    background: '#ffffff',
    contrast: 100
  }
};

export const EnhancedCanvasControlPanel: React.FC<EnhancedCanvasControlPanelProps> = ({
  settings = {},
  onSettingsChange,
  onZoomChange,
  onPositionReset,
  onFitToScreen,
  canvasPosition = { x: 0, y: 0 },
  onPositionChange
}) => {
  const [currentSettings, setCurrentSettings] = useState<CanvasControlSettings>({
    ...defaultSettings,
    ...settings
  });
  const [activeTab, setActiveTab] = useState('grid');

  const updateSettings = (category: keyof CanvasControlSettings, updates: any) => {
    const newSettings = {
      ...currentSettings,
      [category]: { ...currentSettings[category], ...updates }
    };
    setCurrentSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleZoomChange = (newZoom: number) => {
    updateSettings('zoom', { level: newZoom });
    onZoomChange?.(newZoom);
  };

  const zoomIn = () => {
    const newZoom = Math.min(
      currentSettings.zoom.level + currentSettings.zoom.step,
      currentSettings.zoom.max
    );
    handleZoomChange(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(
      currentSettings.zoom.level - currentSettings.zoom.step,
      currentSettings.zoom.min
    );
    handleZoomChange(newZoom);
  };

  const resetZoom = () => {
    handleZoomChange(100);
  };

  const presetZoomLevels = [25, 50, 75, 100, 125, 150, 200, 300, 400];
  const gridSizePresets = [10, 15, 20, 25, 30, 40];

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Settings className="w-4 h-4" />
          إعدادات الكانفاس
          <Badge variant="outline" className="text-xs">
            {currentSettings.zoom.level}%
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-3">
            <TabsTrigger value="grid" className="text-xs">
              <Grid3X3 className="w-3 h-3 mr-1" />
              شبكة
            </TabsTrigger>
            <TabsTrigger value="zoom" className="text-xs">
              <ZoomIn className="w-3 h-3 mr-1" />
              تكبير
            </TabsTrigger>
            <TabsTrigger value="view" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              عرض
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs">
              <PaintBucket className="w-3 h-3 mr-1" />
              مظهر
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="grid" className="mt-0 space-y-4">
              {/* رؤية الشبكة */}
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">إظهار الشبكة</Label>
                <Switch
                  checked={currentSettings.grid.visible}
                  onCheckedChange={(checked) => 
                    updateSettings('grid', { visible: checked })
                  }
                />
              </div>

              {/* حجم الشبكة */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-medium">حجم الشبكة</Label>
                  <Badge variant="secondary" className="text-xs">
                    {currentSettings.grid.size}px
                  </Badge>
                </div>
                <Slider
                  value={[currentSettings.grid.size]}
                  onValueChange={([value]) => updateSettings('grid', { size: value })}
                  max={50}
                  min={5}
                  step={5}
                  className="mb-2"
                />
                <div className="grid grid-cols-3 gap-1">
                  {gridSizePresets.slice(0, 6).map(size => (
                    <Button
                      key={size}
                      size="sm"
                      variant={currentSettings.grid.size === size ? 'default' : 'outline'}
                      onClick={() => updateSettings('grid', { size })}
                      className="text-xs h-7"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* الجذب للشبكة */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium block">الجذب للشبكة</Label>
                  <p className="text-xs text-muted-foreground">محاذاة العناصر تلقائياً</p>
                </div>
                <Switch
                  checked={currentSettings.grid.snap}
                  onCheckedChange={(checked) => 
                    updateSettings('grid', { snap: checked })
                  }
                />
              </div>

              {/* شفافية الشبكة */}
              <div>
                <Label className="text-xs font-medium mb-2 block">
                  شفافية الشبكة: {Math.round(currentSettings.grid.opacity * 100)}%
                </Label>
                <Slider
                  value={[currentSettings.grid.opacity]}
                  onValueChange={([value]) => updateSettings('grid', { opacity: value })}
                  max={1}
                  min={0.1}
                  step={0.1}
                />
              </div>

              {/* لون الشبكة */}
              <div>
                <Label className="text-xs font-medium mb-2 block">لون الشبكة</Label>
                <Input
                  type="color"
                  value={currentSettings.grid.color}
                  onChange={(e) => updateSettings('grid', { color: e.target.value })}
                  className="h-8"
                />
              </div>
            </TabsContent>

            <TabsContent value="zoom" className="mt-0 space-y-4">
              {/* مستوى التكبير */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-medium">مستوى التكبير</Label>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={zoomOut} className="h-7 w-7 p-0">
                      <ZoomOut className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetZoom} className="h-7 px-2 text-xs">
                      100%
                    </Button>
                    <Button size="sm" variant="outline" onClick={zoomIn} className="h-7 w-7 p-0">
                      <ZoomIn className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <Slider
                  value={[currentSettings.zoom.level]}
                  onValueChange={([value]) => handleZoomChange(value)}
                  max={currentSettings.zoom.max}
                  min={currentSettings.zoom.min}
                  step={currentSettings.zoom.step}
                  className="mb-3"
                />

                <div className="grid grid-cols-3 gap-1">
                  {presetZoomLevels.slice(0, 9).map(zoom => (
                    <Button
                      key={zoom}
                      size="sm"
                      variant={currentSettings.zoom.level === zoom ? 'default' : 'outline'}
                      onClick={() => handleZoomChange(zoom)}
                      className="text-xs h-7"
                    >
                      {zoom}%
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* عمليات العرض */}
              <div>
                <Label className="text-xs font-medium mb-2 block">عمليات العرض</Label>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onFitToScreen}
                    className="w-full text-xs"
                  >
                    <Maximize className="w-3 h-3 mr-2" />
                    ملء الشاشة
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onPositionReset}
                    className="w-full text-xs"
                  >
                    <Target className="w-3 h-3 mr-2" />
                    الوسط
                  </Button>
                </div>
              </div>

              {/* موقع الكانفاس */}
              <div>
                <Label className="text-xs font-medium mb-2 block">موقع الكانفاس</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <Input
                      type="number"
                      value={canvasPosition.x}
                      onChange={(e) => onPositionChange?.({
                        ...canvasPosition,
                        x: parseInt(e.target.value) || 0
                      })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input
                      type="number"
                      value={canvasPosition.y}
                      onChange={(e) => onPositionChange?.({
                        ...canvasPosition,
                        y: parseInt(e.target.value) || 0
                      })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="view" className="mt-0 space-y-4">
              {/* أدوات المساعدة البصرية */}
              <div>
                <Label className="text-xs font-medium mb-3 block">أدوات المساعدة البصرية</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-3 h-3" />
                      <span className="text-xs">المساطر</span>
                    </div>
                    <Switch
                      checked={currentSettings.view.rulers}
                      onCheckedChange={(checked) => 
                        updateSettings('view', { rulers: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3 h-3" />
                      <span className="text-xs">الأدلة</span>
                    </div>
                    <Switch
                      checked={currentSettings.view.guides}
                      onCheckedChange={(checked) => 
                        updateSettings('view', { guides: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      <span className="text-xs">حدود الكانفاس</span>
                    </div>
                    <Switch
                      checked={currentSettings.view.boundaries}
                      onCheckedChange={(checked) => 
                        updateSettings('view', { boundaries: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      <span className="text-xs">نقطة المركز</span>
                    </div>
                    <Switch
                      checked={currentSettings.view.center}
                      onCheckedChange={(checked) => 
                        updateSettings('view', { center: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* أدوات التفاعل */}
              <div>
                <Label className="text-xs font-medium mb-3 block">أدوات التفاعل</Label>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">نوع المؤشر</Label>
                    <div className="grid grid-cols-3 gap-1">
                      <Button
                        size="sm"
                        variant={currentSettings.interaction.cursor === 'default' ? 'default' : 'outline'}
                        onClick={() => updateSettings('interaction', { cursor: 'default' })}
                        className="text-xs h-8"
                      >
                        <MousePointer className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={currentSettings.interaction.cursor === 'crosshair' ? 'default' : 'outline'}
                        onClick={() => updateSettings('interaction', { cursor: 'crosshair' })}
                        className="text-xs h-8"
                      >
                        <Crosshair className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={currentSettings.interaction.cursor === 'move' ? 'default' : 'outline'}
                        onClick={() => updateSettings('interaction', { cursor: 'move' })}
                        className="text-xs h-8"
                      >
                        <Move className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">الوضع الدقيق</span>
                    <Switch
                      checked={currentSettings.interaction.precision}
                      onCheckedChange={(checked) => 
                        updateSettings('interaction', { precision: checked })
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      قوة المغناطيسية: {currentSettings.interaction.magnetism}px
                    </Label>
                    <Slider
                      value={[currentSettings.interaction.magnetism]}
                      onValueChange={([value]) => updateSettings('interaction', { magnetism: value })}
                      max={20}
                      min={0}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-4">
              {/* السمة */}
              <div>
                <Label className="text-xs font-medium mb-2 block">السمة</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={currentSettings.appearance.theme === 'light' ? 'default' : 'outline'}
                    onClick={() => updateSettings('appearance', { theme: 'light' })}
                    className="text-xs"
                  >
                    <Sun className="w-3 h-3 mr-1" />
                    فاتح
                  </Button>
                  <Button
                    size="sm"
                    variant={currentSettings.appearance.theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => updateSettings('appearance', { theme: 'dark' })}
                    className="text-xs"
                  >
                    <Moon className="w-3 h-3 mr-1" />
                    داكن
                  </Button>
                </div>
              </div>

              <Separator />

              {/* خلفية الكانفاس */}
              <div>
                <Label className="text-xs font-medium mb-2 block">لون الخلفية</Label>
                <Input
                  type="color"
                  value={currentSettings.appearance.background}
                  onChange={(e) => updateSettings('appearance', { background: e.target.value })}
                  className="h-8 mb-2"
                />
                <div className="grid grid-cols-4 gap-1">
                  {['#ffffff', '#f8f9fa', '#e9ecef', '#000000'].map(color => (
                    <Button
                      key={color}
                      size="sm"
                      variant="outline"
                      onClick={() => updateSettings('appearance', { background: color })}
                      className="h-8 p-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              {/* التباين */}
              <div>
                <Label className="text-xs font-medium mb-2 block">
                  التباين: {currentSettings.appearance.contrast}%
                </Label>
                <Slider
                  value={[currentSettings.appearance.contrast]}
                  onValueChange={([value]) => updateSettings('appearance', { contrast: value })}
                  max={200}
                  min={50}
                  step={10}
                />
              </div>

              {/* إعادة تعيين */}
              <div className="pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentSettings(defaultSettings);
                    onSettingsChange?.(defaultSettings);
                    toast.success('تم إعادة تعيين الإعدادات');
                  }}
                  className="w-full text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-2" />
                  إعادة تعيين الإعدادات
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};