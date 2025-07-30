import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shapes, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  ArrowRight,
  Star,
  Heart,
  Diamond,
  Hexagon,
  Pentagon,
  Octagon,
  Plus,
  Palette
} from 'lucide-react';

interface ShapesPanelProps {
  onAddShape: (shapeConfig: any) => void;
  selectedShape?: any;
  onUpdateShape?: (updates: any) => void;
}

export const ShapesPanel: React.FC<ShapesPanelProps> = ({
  onAddShape,
  selectedShape,
  onUpdateShape
}) => {
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(100);

  const basicShapes = [
    {
      name: 'مربع',
      icon: Square,
      type: 'rectangle',
      config: { width: 100, height: 100 }
    },
    {
      name: 'مستطيل',
      icon: Square,
      type: 'rectangle',
      config: { width: 150, height: 80 }
    },
    {
      name: 'دائرة',
      icon: Circle,
      type: 'circle',
      config: { radius: 50 }
    },
    {
      name: 'بيضاوي',
      icon: Circle,
      type: 'ellipse',
      config: { radiusX: 75, radiusY: 50 }
    },
    {
      name: 'مثلث',
      icon: Triangle,
      type: 'triangle',
      config: { base: 100, height: 80 }
    },
    {
      name: 'خط',
      icon: Minus,
      type: 'line',
      config: { length: 100, angle: 0 }
    }
  ];

  const specialShapes = [
    {
      name: 'نجمة',
      icon: Star,
      type: 'star',
      config: { points: 5, outerRadius: 50, innerRadius: 25 }
    },
    {
      name: 'قلب',
      icon: Heart,
      type: 'heart',
      config: { size: 50 }
    },
    {
      name: 'معين',
      icon: Diamond,
      type: 'diamond',
      config: { width: 80, height: 100 }
    },
    {
      name: 'سداسي',
      icon: Hexagon,
      type: 'hexagon',
      config: { radius: 50 }
    },
    {
      name: 'خماسي',
      icon: Pentagon,
      type: 'pentagon',
      config: { radius: 50 }
    },
    {
      name: 'ثماني',
      icon: Octagon,
      type: 'octagon',
      config: { radius: 50 }
    }
  ];

  const arrowShapes = [
    {
      name: 'سهم بسيط',
      icon: ArrowRight,
      type: 'arrow',
      config: { length: 100, width: 20, headSize: 30 }
    },
    {
      name: 'سهم مزدوج',
      icon: ArrowRight,
      type: 'double-arrow',
      config: { length: 120, width: 20, headSize: 30 }
    },
    {
      name: 'سهم منحني',
      icon: ArrowRight,
      type: 'curved-arrow',
      config: { length: 100, curve: 45, width: 20 }
    }
  ];

  const handleAddShape = (shape: any) => {
    onAddShape({
      type: shape.type,
      config: {
        ...shape.config,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        opacity: opacity / 100
      }
    });
  };

  const handleStrokeWidthChange = (value: number[]) => {
    setStrokeWidth(value[0]);
    if (selectedShape && onUpdateShape) {
      onUpdateShape({ strokeWidth: value[0] });
    }
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
    if (selectedShape && onUpdateShape) {
      onUpdateShape({ opacity: value[0] / 100 });
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shapes className="w-5 h-5" />
          الأشكال
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shape Categories */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="text-xs">أساسي</TabsTrigger>
            <TabsTrigger value="special" className="text-xs">خاص</TabsTrigger>
            <TabsTrigger value="arrows" className="text-xs">أسهم</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {basicShapes.map((shape) => {
                const Icon = shape.icon;
                return (
                  <Button
                    key={shape.type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShape(shape)}
                    className="h-auto p-2 flex-col gap-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{shape.name}</span>
                  </Button>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="special" className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {specialShapes.map((shape) => {
                const Icon = shape.icon;
                return (
                  <Button
                    key={shape.type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShape(shape)}
                    className="h-auto p-2 flex-col gap-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{shape.name}</span>
                  </Button>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="arrows" className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {arrowShapes.map((shape) => {
                const Icon = shape.icon;
                return (
                  <Button
                    key={shape.type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShape(shape)}
                    className="h-auto p-2 flex-col gap-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{shape.name}</span>
                  </Button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Style Controls */}
        <div className="space-y-3">
          <label className="text-sm font-medium">إعدادات الشكل</label>
          
          {/* Fill Color */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">لون التعبئة</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="flex-1 text-xs"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* Stroke Color */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">لون الحدود</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="flex-1 text-xs"
                placeholder="#1e40af"
              />
            </div>
          </div>

          {/* Stroke Width */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              سمك الحدود: {strokeWidth}px
            </label>
            <Slider
              value={[strokeWidth]}
              onValueChange={handleStrokeWidthChange}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              الشفافية: {opacity}%
            </label>
            <Slider
              value={[opacity]}
              onValueChange={handleOpacityChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">قوالب سريعة</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFillColor('#ef4444');
                setStrokeColor('#dc2626');
              }}
              className="text-xs"
            >
              🔴 أحمر
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFillColor('#22c55e');
                setStrokeColor('#16a34a');
              }}
              className="text-xs"
            >
              🟢 أخضر
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFillColor('#3b82f6');
                setStrokeColor('#2563eb');
              }}
              className="text-xs"
            >
              🔵 أزرق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFillColor('#fbbf24');
                setStrokeColor('#f59e0b');
              }}
              className="text-xs"
            >
              🟡 أصفر
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>🎨 استخدم قوالب الألوان السريعة</div>
          <div>✏️ اسحب لتغيير حجم الشكل</div>
          <div>🔄 انقر مرتين لتحرير الخصائص</div>
        </div>
      </CardContent>
    </Card>
  );
};