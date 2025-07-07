import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Square, Circle, Triangle, Hexagon, Star, Heart, Palette } from 'lucide-react';

interface EnhancedShapeToolProps {
  selectedTool: string;
  onAddShape: (config: {
    type: 'rectangle' | 'circle' | 'triangle' | 'hexagon' | 'star' | 'heart';
    width: number;
    height: number;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    cornerRadius?: number;
    rotation?: number;
    opacity?: number;
  }) => void;
}

export const EnhancedShapeTool: React.FC<EnhancedShapeToolProps> = ({
  selectedTool,
  onAddShape
}) => {
  const [shapeType, setShapeType] = useState<'rectangle' | 'circle' | 'triangle' | 'hexagon' | 'star' | 'heart'>('rectangle');
  const [width, setWidth] = useState(120);
  const [height, setHeight] = useState(80);
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);

  if (selectedTool !== 'shape') return null;

  const shapes = [
    {
      type: 'rectangle',
      label: 'مستطيل',
      icon: Square,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      type: 'circle',
      label: 'دائرة',
      icon: Circle,
      color: 'bg-green-50 border-green-200'
    },
    {
      type: 'triangle',
      label: 'مثلث',
      icon: Triangle,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      type: 'hexagon',
      label: 'سداسي',
      icon: Hexagon,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      type: 'star',
      label: 'نجمة',
      icon: Star,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      type: 'heart',
      label: 'قلب',
      icon: Heart,
      color: 'bg-red-50 border-red-200'
    }
  ];

  const colorPresets = [
    { name: 'أزرق', fill: '#3b82f6', stroke: '#1e40af' },
    { name: 'أخضر', fill: '#10b981', stroke: '#047857' },
    { name: 'أحمر', fill: '#ef4444', stroke: '#dc2626' },
    { name: 'أصفر', fill: '#f59e0b', stroke: '#d97706' },
    { name: 'بنفسجي', fill: '#8b5cf6', stroke: '#7c3aed' },
    { name: 'وردي', fill: '#ec4899', stroke: '#db2777' }
  ];

  const handleAddShape = () => {
    onAddShape({
      type: shapeType,
      width,
      height: shapeType === 'circle' ? width : height,
      fillColor,
      strokeColor,
      strokeWidth,
      cornerRadius: shapeType === 'rectangle' ? cornerRadius : undefined,
      rotation,
      opacity: opacity / 100
    });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setFillColor(preset.fill);
    setStrokeColor(preset.stroke);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Square className="w-5 h-5 text-blue-500" />
          أداة الأشكال المتقدمة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* اختيار نوع الشكل */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نوع الشكل</h4>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map(shape => {
              const Icon = shape.icon;
              return (
                <button
                  key={shape.type}
                  onClick={() => setShapeType(shape.type as any)}
                  className={`p-3 rounded-lg border text-xs font-arabic transition-colors ${
                    shapeType === shape.type 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : `${shape.color} hover:opacity-80`
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className="w-4 h-4" />
                    <span>{shape.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* الألوان المُعدة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">ألوان مُعدة</h4>
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                onClick={() => applyColorPreset(preset)}
                variant="outline"
                size="sm"
                className="text-xs font-arabic rounded-lg flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded border"
                  style={{ backgroundColor: preset.fill }}
                />
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* الأبعاد */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الأبعاد</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-arabic mb-1 block">العرض</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(Math.max(20, Number(e.target.value)))}
                min={20}
                max={500}
                className="text-center"
              />
            </div>
            
            {shapeType !== 'circle' && (
              <div>
                <Label className="text-xs font-arabic mb-1 block">الارتفاع</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Math.max(20, Number(e.target.value)))}
                  min={20}
                  max={500}
                  className="text-center"
                />
              </div>
            )}
          </div>
        </div>

        {/* الألوان المخصصة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الألوان المخصصة</h4>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-arabic mb-1 block">لون التعبئة</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-10 h-8 rounded border cursor-pointer"
                />
                <Input
                  type="text"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="font-mono text-xs"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-arabic mb-1 block">لون الحدود</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-10 h-8 rounded border cursor-pointer"
                />
                <Input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="font-mono text-xs"
                  placeholder="#1e40af"
                />
              </div>
            </div>
          </div>
        </div>

        {/* الإعدادات المتقدمة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">إعدادات متقدمة</h4>
          <div className="space-y-3">
            {/* سُمك الحدود */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-arabic">سُمك الحدود</Label>
                <Badge variant="outline" className="text-xs">{strokeWidth}px</Badge>
              </div>
              <Slider
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* انحناء الزوايا (للمستطيل فقط) */}
            {shapeType === 'rectangle' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-arabic">انحناء الزوايا</Label>
                  <Badge variant="outline" className="text-xs">{cornerRadius}px</Badge>
                </div>
                <Slider
                  value={[cornerRadius]}
                  onValueChange={(value) => setCornerRadius(value[0])}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* الدوران */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-arabic">الدوران</Label>
                <Badge variant="outline" className="text-xs">{rotation}°</Badge>
              </div>
              <Slider
                value={[rotation]}
                onValueChange={(value) => setRotation(value[0])}
                max={360}
                min={0}
                step={15}
                className="w-full"
              />
            </div>

            {/* الشفافية */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-arabic">الشفافية</Label>
                <Badge variant="outline" className="text-xs">{opacity}%</Badge>
              </div>
              <Slider
                value={[opacity]}
                onValueChange={(value) => setOpacity(value[0])}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* معاينة */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-medium font-arabic mb-2">معاينة:</h4>
          <div className="flex justify-center bg-white rounded-lg border p-4 min-h-[80px] items-center">
            <div
              className="border transition-all duration-200"
              style={{
                width: Math.min(width, 60),
                height: shapeType === 'circle' ? Math.min(width, 60) : Math.min(height, 60),
                backgroundColor: fillColor,
                borderColor: strokeColor,
                borderWidth: strokeWidth,
                borderRadius: shapeType === 'circle' ? '50%' : 
                           shapeType === 'rectangle' ? `${cornerRadius}px` : '0',
                transform: `rotate(${rotation}deg)`,
                opacity: opacity / 100,
                clipPath: shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                         shapeType === 'hexagon' ? 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' :
                         shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                         shapeType === 'heart' ? 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")' :
                         'none'
              }}
            />
          </div>
        </div>

        {/* إضافة الشكل */}
        <Button 
          onClick={handleAddShape}
          className="w-full rounded-xl font-arabic"
        >
          <Square className="w-4 h-4 mr-2" />
          إضافة الشكل
        </Button>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🎨 استخدم الألوان المُعدة للسرعة</div>
            <div>📐 اسحب لإنشاء شكل بالحجم المطلوب</div>
            <div>🔄 غيّر الدوران والشفافية للتأثيرات</div>
            <div>⚙️ استخدم انحناء الزوايا للمستطيلات</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedShapeTool;