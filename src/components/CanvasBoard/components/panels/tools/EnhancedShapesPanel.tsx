import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  Square, 
  Circle, 
  Triangle,
  Diamond,
  Pentagon,
  Hexagon,
  Star,
  Heart,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Minus,
  Plus,
  X,
  Zap,
  Cloud,
  Bookmark,
  Shield,
  MapPin,
  Home,
  User,
  Settings,
  Eye,
  Grid3X3,
  List,
  Palette,
  Brush,
  PaintBucket,
  Eraser,
  RotateCw,
  Copy,
  Sparkles
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface ShapeStyle {
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  opacity: number;
  borderRadius: number;
}

interface ShapeConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: 'basic' | 'arrows' | 'symbols' | 'icons' | 'custom';
  path?: string;
  defaultSize: { width: number; height: number };
}

interface EnhancedShapesPanelProps {
  onAddShape?: (shapeId: string, style: ShapeStyle, size: { width: number; height: number }) => void;
  selectedShapeId?: string;
}

const shapeCategories = [
  { id: 'basic', name: 'أساسي', icon: Square },
  { id: 'arrows', name: 'أسهم', icon: ArrowRight },
  { id: 'symbols', name: 'رموز', icon: Star },
  { id: 'icons', name: 'أيقونات', icon: Home },
  { id: 'custom', name: 'مخصص', icon: Sparkles }
];

const shapesData: ShapeConfig[] = [
  // Basic Shapes
  { id: 'rectangle', name: 'مستطيل', icon: Square, category: 'basic', defaultSize: { width: 120, height: 80 } },
  { id: 'circle', name: 'دائرة', icon: Circle, category: 'basic', defaultSize: { width: 100, height: 100 } },
  { id: 'triangle', name: 'مثلث', icon: Triangle, category: 'basic', defaultSize: { width: 100, height: 100 } },
  { id: 'diamond', name: 'معين', icon: Diamond, category: 'basic', defaultSize: { width: 100, height: 100 } },
  { id: 'pentagon', name: 'خماسي', icon: Pentagon, category: 'basic', defaultSize: { width: 100, height: 100 } },
  { id: 'hexagon', name: 'سداسي', icon: Hexagon, category: 'basic', defaultSize: { width: 100, height: 100 } },
  
  // Arrows
  { id: 'arrow-right', name: 'سهم يمين', icon: ArrowRight, category: 'arrows', defaultSize: { width: 120, height: 40 } },
  { id: 'arrow-left', name: 'سهم يسار', icon: ArrowLeft, category: 'arrows', defaultSize: { width: 120, height: 40 } },
  { id: 'arrow-up', name: 'سهم أعلى', icon: ArrowUp, category: 'arrows', defaultSize: { width: 40, height: 120 } },
  { id: 'arrow-down', name: 'سهم أسفل', icon: ArrowDown, category: 'arrows', defaultSize: { width: 40, height: 120 } },
  
  // Symbols
  { id: 'star', name: 'نجمة', icon: Star, category: 'symbols', defaultSize: { width: 80, height: 80 } },
  { id: 'heart', name: 'قلب', icon: Heart, category: 'symbols', defaultSize: { width: 80, height: 80 } },
  { id: 'cloud', name: 'سحابة', icon: Cloud, category: 'symbols', defaultSize: { width: 120, height: 80 } },
  { id: 'bookmark', name: 'علامة مرجعية', icon: Bookmark, category: 'symbols', defaultSize: { width: 60, height: 100 } },
  { id: 'shield', name: 'درع', icon: Shield, category: 'symbols', defaultSize: { width: 80, height: 100 } },
  
  // Icons
  { id: 'home', name: 'منزل', icon: Home, category: 'icons', defaultSize: { width: 60, height: 60 } },
  { id: 'user', name: 'مستخدم', icon: User, category: 'icons', defaultSize: { width: 60, height: 60 } },
  { id: 'settings', name: 'إعدادات', icon: Settings, category: 'icons', defaultSize: { width: 60, height: 60 } },
  { id: 'eye', name: 'عين', icon: Eye, category: 'icons', defaultSize: { width: 60, height: 60 } },
  { id: 'map-pin', name: 'دبوس خريطة', icon: MapPin, category: 'icons', defaultSize: { width: 40, height: 60 } }
];

const colorPalette = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6', '#eab308'
];

const presetStyles = [
  { name: 'افتراضي', fillColor: '#3b82f6', borderColor: '#2563eb', borderWidth: 2 },
  { name: 'شفاف', fillColor: 'transparent', borderColor: '#374151', borderWidth: 2 },
  { name: 'ملون', fillColor: '#ef4444', borderColor: '#dc2626', borderWidth: 0 },
  { name: 'مخطط', fillColor: 'transparent', borderColor: '#6b7280', borderWidth: 1 }
];

export const EnhancedShapesPanel: React.FC<EnhancedShapesPanelProps> = ({
  onAddShape,
  selectedShapeId
}) => {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [activeTab, setActiveTab] = useState('shapes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShape, setSelectedShape] = useState<ShapeConfig | null>(null);
  const [shapeStyle, setShapeStyle] = useState<ShapeStyle>({
    fillColor: '#3b82f6',
    borderColor: '#2563eb',
    borderWidth: 2,
    borderStyle: 'solid',
    opacity: 100,
    borderRadius: 0
  });
  const [customSize, setCustomSize] = useState({ width: 100, height: 100 });

  // Filter shapes by category
  const filteredShapes = shapesData.filter(shape => shape.category === activeCategory);

  const handleShapeSelect = (shape: ShapeConfig) => {
    setSelectedShape(shape);
    setCustomSize(shape.defaultSize);
    setActiveTab('customize');
  };

  const handleAddShape = () => {
    if (selectedShape && onAddShape) {
      onAddShape(selectedShape.id, shapeStyle, customSize);
      toast.success(`تم إضافة ${selectedShape.name} إلى الكانفاس`);
    }
  };

  const applyPresetStyle = (preset: any) => {
    setShapeStyle(prev => ({
      ...prev,
      fillColor: preset.fillColor,
      borderColor: preset.borderColor,
      borderWidth: preset.borderWidth
    }));
    toast.success(`تم تطبيق النمط ${preset.name}`);
  };

  const copyCurrentStyle = () => {
    // Copy current style to clipboard (simulated)
    toast.success('تم نسخ النمط الحالي');
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Square className="w-4 h-4" />
          الأشكال والرموز
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="shapes" className="text-xs">الأشكال</TabsTrigger>
            <TabsTrigger value="customize" className="text-xs">تخصيص</TabsTrigger>
            <TabsTrigger value="library" className="text-xs">مكتبة</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="shapes" className="mt-0 flex flex-col h-full">
              {/* Categories */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-medium">التصنيفات</Label>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      onClick={() => setViewMode('grid')}
                      className="h-6 w-6 p-0"
                    >
                      <Grid3X3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      onClick={() => setViewMode('list')}
                      className="h-6 w-6 p-0"
                    >
                      <List className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-1 overflow-x-auto">
                  {shapeCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Button
                        key={category.id}
                        size="sm"
                        variant={activeCategory === category.id ? 'default' : 'outline'}
                        onClick={() => setActiveCategory(category.id)}
                        className="text-xs whitespace-nowrap"
                      >
                        <IconComponent className="w-3 h-3 mr-1" />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator className="mb-3" />

              {/* Shapes Grid */}
              <ScrollArea className="flex-1">
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-3 gap-2' 
                    : 'space-y-2'
                }>
                  {filteredShapes.map((shape) => {
                    const IconComponent = shape.icon;
                    return (
                      <Button
                        key={shape.id}
                        variant="outline"
                        onClick={() => handleShapeSelect(shape)}
                        className={`${viewMode === 'grid' ? 'aspect-square' : 'justify-start'} p-2 text-xs`}
                      >
                        <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'items-center gap-2'} items-center`}>
                          <IconComponent className="w-6 h-6" />
                          {viewMode === 'list' && (
                            <span className="truncate">{shape.name}</span>
                          )}
                          {viewMode === 'grid' && (
                            <span className="text-xs mt-1 truncate">{shape.name}</span>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="customize" className="mt-0 space-y-4">
              {selectedShape ? (
                <>
                  {/* Selected Shape Info */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <selectedShape.icon className="w-8 h-8" />
                    <div>
                      <h3 className="text-sm font-medium">{selectedShape.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {customSize.width} × {customSize.height}
                      </p>
                    </div>
                  </div>

                  {/* Quick Style Presets */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block">أنماط سريعة</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {presetStyles.map((preset, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => applyPresetStyle(preset)}
                          className="text-xs"
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Size Controls */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block">الحجم</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">العرض</Label>
                        <Input
                          type="number"
                          value={customSize.width}
                          onChange={(e) => setCustomSize(prev => ({ ...prev, width: Number(e.target.value) }))}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">الارتفاع</Label>
                        <Input
                          type="number"
                          value={customSize.height}
                          onChange={(e) => setCustomSize(prev => ({ ...prev, height: Number(e.target.value) }))}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Fill Color */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block">لون التعبئة</Label>
                    <div className="grid grid-cols-6 gap-1 mb-2">
                      {colorPalette.map((color) => (
                        <Button
                          key={color}
                          size="sm"
                          variant={shapeStyle.fillColor === color ? 'default' : 'outline'}
                          onClick={() => setShapeStyle(prev => ({ ...prev, fillColor: color }))}
                          className="h-8 p-0"
                          style={{ backgroundColor: color }}
                        >
                          {shapeStyle.fillColor === color && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={shapeStyle.fillColor}
                      onChange={(e) => setShapeStyle(prev => ({ ...prev, fillColor: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <Separator />

                  {/* Border */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block">الحدود</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">لون الحدود</Label>
                        <Input
                          type="color"
                          value={shapeStyle.borderColor}
                          onChange={(e) => setShapeStyle(prev => ({ ...prev, borderColor: e.target.value }))}
                          className="h-8"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          سمك الحدود: {shapeStyle.borderWidth}px
                        </Label>
                        <Slider
                          value={[shapeStyle.borderWidth]}
                          onValueChange={([value]) => setShapeStyle(prev => ({ ...prev, borderWidth: value }))}
                          max={10}
                          min={0}
                          step={1}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">نمط الحدود</Label>
                        <div className="grid grid-cols-3 gap-1">
                          {['solid', 'dashed', 'dotted'].map((style) => (
                            <Button
                              key={style}
                              size="sm"
                              variant={shapeStyle.borderStyle === style ? 'default' : 'outline'}
                              onClick={() => setShapeStyle(prev => ({ ...prev, borderStyle: style as any }))}
                              className="text-xs"
                            >
                              {style === 'solid' ? 'صلب' : style === 'dashed' ? 'متقطع' : 'منقط'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Opacity and Border Radius */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        الشفافية: {shapeStyle.opacity}%
                      </Label>
                      <Slider
                        value={[shapeStyle.opacity]}
                        onValueChange={([value]) => setShapeStyle(prev => ({ ...prev, opacity: value }))}
                        max={100}
                        min={0}
                        step={5}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        استدارة الزوايا: {shapeStyle.borderRadius}px
                      </Label>
                      <Slider
                        value={[shapeStyle.borderRadius]}
                        onValueChange={([value]) => setShapeStyle(prev => ({ ...prev, borderRadius: value }))}
                        max={50}
                        min={0}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddShape}
                      className="flex-1 text-xs"
                      size="sm"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      إضافة الشكل
                    </Button>
                    <Button
                      variant="outline"
                      onClick={copyCurrentStyle}
                      className="text-xs"
                      size="sm"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Square className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      اختر شكلاً لتخصيصه
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="library" className="mt-0 space-y-4">
              {/* Shape Library - Custom shapes and saved presets */}
              <div className="text-center py-8">
                <Bookmark className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  مكتبة الأشكال المخصصة
                </p>
                <Button size="sm" variant="outline" className="text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  إضافة شكل مخصص
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};