import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  Shapes, 
  Square, 
  Circle, 
  Triangle, 
  Diamond, 
  Heart, 
  Star, 
  Hexagon, 
  Pentagon, 
  Octagon,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Plus,
  Minus,
  X,
  Zap,
  Cloud,
  Flower
} from 'lucide-react';

interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDashArray: string;
  opacity: number;
  rotation: number;
  borderRadius: number;
}

interface ShapeConfig {
  type: string;
  style: ShapeStyle;
  size: { width: number; height: number };
  maintainAspectRatio: boolean;
}

interface ShapesPanelProps {
  onAddShape: (config: ShapeConfig) => void;
  currentShapeStyle: Partial<ShapeStyle>;
  onStyleChange: (style: Partial<ShapeStyle>) => void;
}

export const ShapesPanel: React.FC<ShapesPanelProps> = ({
  onAddShape,
  currentShapeStyle = {},
  onStyleChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [shapeSize, setShapeSize] = useState({ width: 100, height: 100 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const basicShapes = [
    { id: 'rectangle', name: 'مستطيل', icon: Square },
    { id: 'circle', name: 'دائرة', icon: Circle },
    { id: 'triangle', name: 'مثلث', icon: Triangle },
    { id: 'diamond', name: 'معين', icon: Diamond },
    { id: 'hexagon', name: 'سداسي', icon: Hexagon },
    { id: 'pentagon', name: 'خماسي', icon: Pentagon },
    { id: 'octagon', name: 'ثماني', icon: Octagon }
  ];

  const arrowShapes = [
    { id: 'arrow-right', name: 'سهم يمين', icon: ArrowRight },
    { id: 'arrow-left', name: 'سهم يسار', icon: ArrowLeft },
    { id: 'arrow-up', name: 'سهم أعلى', icon: ArrowUp },
    { id: 'arrow-down', name: 'سهم أسفل', icon: ArrowDown }
  ];

  const symbolShapes = [
    { id: 'star', name: 'نجمة', icon: Star },
    { id: 'heart', name: 'قلب', icon: Heart },
    { id: 'plus', name: 'زائد', icon: Plus },
    { id: 'minus', name: 'ناقص', icon: Minus },
    { id: 'cross', name: 'ضرب', icon: X },
    { id: 'lightning', name: 'برق', icon: Zap },
    { id: 'cloud', name: 'سحابة', icon: Cloud },
    { id: 'flower', name: 'زهرة', icon: Flower }
  ];

  const categories = [
    { id: 'basic', name: 'أساسي', shapes: basicShapes },
    { id: 'arrows', name: 'أسهم', shapes: arrowShapes },
    { id: 'symbols', name: 'رموز', shapes: symbolShapes }
  ];

  const strokeStyles = [
    { value: 'none', name: 'بدون خط', preview: '────────' },
    { value: '2,2', name: 'متقطع قصير', preview: '── ── ──' },
    { value: '5,5', name: 'متقطع متوسط', preview: '───  ───' },
    { value: '10,5', name: 'متقطع طويل', preview: '──────  ──' },
    { value: '2,2,5,2', name: 'نقطة وخط', preview: '─ ─── ─' }
  ];

  const colorPresets = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000', '#000080', '#800000', '#808000',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
  ];

  const updateStyle = (updates: Partial<ShapeStyle>) => {
    const newStyle = { ...currentShapeStyle, ...updates };
    onStyleChange(newStyle);
  };

  const handleAddShape = (shapeType: string) => {
    const config: ShapeConfig = {
      type: shapeType,
      style: {
        fill: currentShapeStyle.fill || '#4ECDC4',
        stroke: currentShapeStyle.stroke || '#333333',
        strokeWidth: currentShapeStyle.strokeWidth || 2,
        strokeDashArray: currentShapeStyle.strokeDashArray || 'none',
        opacity: currentShapeStyle.opacity || 1,
        rotation: currentShapeStyle.rotation || 0,
        borderRadius: currentShapeStyle.borderRadius || 0
      },
      size: shapeSize,
      maintainAspectRatio
    };
    onAddShape(config);
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shapes className="w-5 h-5" />
          الأشكال
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">فئة الأشكال</label>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-1 text-xs"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Shapes Grid */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{currentCategory?.name}</label>
          <div className="grid grid-cols-3 gap-2">
            {currentCategory?.shapes.map((shape) => {
              const Icon = shape.icon;
              return (
                <Button
                  key={shape.id}
                  variant="outline"
                  onClick={() => handleAddShape(shape.id)}
                  className="h-16 flex-col gap-1 p-2"
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{shape.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Size Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">الحجم</label>
            <Toggle
              pressed={maintainAspectRatio}
              onPressedChange={setMaintainAspectRatio}
              size="sm"
            >
              نسبة ثابتة
            </Toggle>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">العرض</label>
              <Input
                type="number"
                value={shapeSize.width}
                onChange={(e) => {
                  const width = parseInt(e.target.value) || 100;
                  setShapeSize(prev => ({
                    width,
                    height: maintainAspectRatio ? width : prev.height
                  }));
                }}
                min={10}
                max={500}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">الارتفاع</label>
              <Input
                type="number"
                value={shapeSize.height}
                onChange={(e) => {
                  const height = parseInt(e.target.value) || 100;
                  setShapeSize(prev => ({
                    height,
                    width: maintainAspectRatio ? height : prev.width
                  }));
                }}
                min={10}
                max={500}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Fill Color */}
        <div className="space-y-3">
          <label className="text-sm font-medium">لون التعبئة</label>
          
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={currentShapeStyle.fill || '#4ECDC4'}
              onChange={(e) => updateStyle({ fill: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              value={currentShapeStyle.fill || '#4ECDC4'}
              onChange={(e) => updateStyle({ fill: e.target.value })}
              className="flex-1 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-8 gap-1">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => updateStyle({ fill: color })}
                className="w-6 h-6 rounded border border-muted"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Stroke Settings */}
        <div className="space-y-3">
          <label className="text-sm font-medium">الحدود</label>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">لون الحد</div>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={currentShapeStyle.stroke || '#333333'}
                onChange={(e) => updateStyle({ stroke: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <Input
                value={currentShapeStyle.stroke || '#333333'}
                onChange={(e) => updateStyle({ stroke: e.target.value })}
                className="flex-1 text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">سمك الحد</div>
            <Slider
              value={[currentShapeStyle.strokeWidth || 2]}
              onValueChange={([value]) => updateStyle({ strokeWidth: value })}
              max={20}
              min={0}
              step={1}
            />
            <div className="text-xs text-center">{currentShapeStyle.strokeWidth || 2}px</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">نمط الحد</div>
            <Select
              value={currentShapeStyle.strokeDashArray || 'none'}
              onValueChange={(value) => updateStyle({ strokeDashArray: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {strokeStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono">{style.preview}</span>
                      <span>{style.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Advanced Properties */}
        <div className="space-y-3">
          <label className="text-sm font-medium">خصائص متقدمة</label>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">الشفافية</div>
            <Slider
              value={[currentShapeStyle.opacity || 1]}
              onValueChange={([value]) => updateStyle({ opacity: value })}
              max={1}
              min={0}
              step={0.1}
            />
            <div className="text-xs text-center">{Math.round((currentShapeStyle.opacity || 1) * 100)}%</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">الدوران</div>
            <Slider
              value={[currentShapeStyle.rotation || 0]}
              onValueChange={([value]) => updateStyle({ rotation: value })}
              max={360}
              min={0}
              step={15}
            />
            <div className="text-xs text-center">{currentShapeStyle.rotation || 0}°</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">استدارة الزوايا</div>
            <Slider
              value={[currentShapeStyle.borderRadius || 0]}
              onValueChange={([value]) => updateStyle({ borderRadius: value })}
              max={50}
              min={0}
              step={1}
            />
            <div className="text-xs text-center">{currentShapeStyle.borderRadius || 0}px</div>
          </div>
        </div>

        <Separator />

        {/* Shape Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">معاينة</label>
          <div className="bg-muted/50 rounded-lg p-6 flex items-center justify-center">
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: currentShapeStyle.fill || '#4ECDC4',
                border: `${currentShapeStyle.strokeWidth || 2}px ${currentShapeStyle.strokeDashArray === 'none' ? 'solid' : 'dashed'} ${currentShapeStyle.stroke || '#333333'}`,
                borderRadius: `${currentShapeStyle.borderRadius || 0}px`,
                opacity: currentShapeStyle.opacity || 1,
                transform: `rotate(${currentShapeStyle.rotation || 0}deg)`
              }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateStyle({
              fill: 'transparent',
              stroke: '#333333',
              strokeWidth: 2,
              opacity: 1,
              rotation: 0,
              borderRadius: 0
            })}
          >
            مخطط فقط
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateStyle({
              fill: '#4ECDC4',
              stroke: 'transparent',
              strokeWidth: 0,
              opacity: 1,
              rotation: 0,
              borderRadius: 0
            })}
          >
            تعبئة فقط
          </Button>
        </div>

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>🔲 انقر على الشكل لإضافته</div>
          <div>🎨 اضبط الألوان قبل الإضافة</div>
          <div>↔️ استخدم النسبة الثابتة للأشكال المنتظمة</div>
        </div>
      </CardContent>
    </Card>
  );
};