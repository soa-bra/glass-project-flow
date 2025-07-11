import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Square, Circle, Triangle, Hexagon, Star, Heart,
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft,
  Minus, Plus, X, Check
} from 'lucide-react';

interface ShapePanelProps {
  onShapeSelect: (shape: ShapeType) => void;
  onSettingsChange: (settings: ShapeSettings) => void;
}

export interface ShapeType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: 'basic' | 'arrows' | 'icons' | 'sticky';
}

export interface ShapeSettings {
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  opacity: number;
}

const basicShapes: ShapeType[] = [
  { id: 'rectangle', name: 'مستطيل', icon: Square, category: 'basic' },
  { id: 'circle', name: 'دائرة', icon: Circle, category: 'basic' },
  { id: 'triangle', name: 'مثلث', icon: Triangle, category: 'basic' },
  { id: 'hexagon', name: 'مسدس', icon: Hexagon, category: 'basic' },
  { id: 'star', name: 'نجمة', icon: Star, category: 'basic' },
  { id: 'heart', name: 'قلب', icon: Heart, category: 'basic' }
];

const arrowShapes: ShapeType[] = [
  { id: 'arrow-right', name: 'سهم يمين', icon: ArrowRight, category: 'arrows' },
  { id: 'arrow-left', name: 'سهم يسار', icon: ArrowLeft, category: 'arrows' },
  { id: 'arrow-up', name: 'سهم أعلى', icon: ArrowUp, category: 'arrows' },
  { id: 'arrow-down', name: 'سهم أسفل', icon: ArrowDown, category: 'arrows' }
];

const iconShapes: ShapeType[] = [
  { id: 'plus', name: 'زائد', icon: Plus, category: 'icons' },
  { id: 'minus', name: 'ناقص', icon: Minus, category: 'icons' },
  { id: 'x', name: 'إكس', icon: X, category: 'icons' },
  { id: 'check', name: 'صح', icon: Check, category: 'icons' }
];

const stickyShapes: ShapeType[] = [
  { id: 'sticky-yellow', name: 'ستيكي أصفر', icon: Square, category: 'sticky' },
  { id: 'sticky-blue', name: 'ستيكي أزرق', icon: Square, category: 'sticky' },
  { id: 'sticky-green', name: 'ستيكي أخضر', icon: Square, category: 'sticky' },
  { id: 'sticky-pink', name: 'ستيكي وردي', icon: Square, category: 'sticky' }
];

const colors = [
  { name: 'أبيض', value: '#ffffff' },
  { name: 'رمادي فاتح', value: '#f3f4f6' },
  { name: 'رمادي', value: '#9ca3af' },
  { name: 'أسود', value: '#000000' },
  { name: 'أحمر', value: '#ef4444' },
  { name: 'أزرق', value: '#3b82f6' },
  { name: 'أخضر', value: '#10b981' },
  { name: 'أصفر', value: '#f59e0b' },
  { name: 'برتقالي', value: '#f97316' },
  { name: 'بنفسجي', value: '#8b5cf6' },
  { name: 'وردي', value: '#ec4899' },
  { name: 'تركواز', value: '#06b6d4' }
];

export const ShapePanel: React.FC<ShapePanelProps> = ({
  onShapeSelect,
  onSettingsChange
}) => {
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);
  const [settings, setSettings] = useState<ShapeSettings>({
    fillColor: '#3b82f6',
    borderColor: '#1e40af',
    borderWidth: 2,
    opacity: 100
  });

  const handleShapeSelect = (shape: ShapeType) => {
    setSelectedShape(shape);
    onShapeSelect(shape);
  };

  const updateSettings = (newSettings: Partial<ShapeSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    onSettingsChange(updated);
  };

  const renderShapeGrid = (shapes: ShapeType[], title: string) => (
    <div>
      <div className="text-xs font-medium text-gray-700 mb-2">{title}</div>
      <div className="grid grid-cols-3 gap-2">
        {shapes.map((shape) => {
          const Icon = shape.icon;
          const isSelected = selectedShape?.id === shape.id;
          return (
            <Button
              key={shape.id}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleShapeSelect(shape)}
              className="p-3 h-12 flex flex-col items-center gap-1"
              title={shape.name}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{shape.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">أداة الشكل</CardTitle>
        {selectedShape && (
          <div className="text-xs text-gray-500">
            الشكل المحدد: {selectedShape.name}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="text-xs">الأساسية</TabsTrigger>
            <TabsTrigger value="arrows" className="text-xs">النسبية</TabsTrigger>
            <TabsTrigger value="icons" className="text-xs">الأيقونات</TabsTrigger>
            <TabsTrigger value="sticky" className="text-xs">ستيكي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            {renderShapeGrid(basicShapes, 'الأشكال الأساسية')}
          </TabsContent>
          
          <TabsContent value="arrows" className="space-y-4">
            {renderShapeGrid(arrowShapes, 'الأشكال النسبية')}
          </TabsContent>
          
          <TabsContent value="icons" className="space-y-4">
            {renderShapeGrid(iconShapes, 'مكتبة الأيقونات')}
          </TabsContent>
          
          <TabsContent value="sticky" className="space-y-4">
            {renderShapeGrid(stickyShapes, 'ستيكي نوت')}
          </TabsContent>
        </Tabs>

        {selectedShape && (
          <>
            <Separator />
            
            {/* تخصيص الشكل */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-3">تخصيص الشكل</div>
              
              {/* لون التعبئة */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 mb-2">لون التعبئة</div>
                  <div className="grid grid-cols-6 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        className={`w-6 h-6 rounded border-2 ${
                          settings.fillColor === color.value 
                            ? 'border-gray-400 scale-110' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => updateSettings({ fillColor: color.value })}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={settings.fillColor}
                    onChange={(e) => updateSettings({ fillColor: e.target.value })}
                    className="w-full h-6 rounded border border-gray-200 mt-2"
                  />
                </div>

                {/* لون الحواف */}
                <div>
                  <div className="text-xs text-gray-600 mb-2">لون الحواف</div>
                  <div className="grid grid-cols-6 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        className={`w-6 h-6 rounded border-2 ${
                          settings.borderColor === color.value 
                            ? 'border-gray-400 scale-110' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => updateSettings({ borderColor: color.value })}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={settings.borderColor}
                    onChange={(e) => updateSettings({ borderColor: e.target.value })}
                    className="w-full h-6 rounded border border-gray-200 mt-2"
                  />
                </div>

                {/* سمك الحواف */}
                <div>
                  <div className="text-xs text-gray-600 mb-2">
                    سمك الحواف: {settings.borderWidth}px
                  </div>
                  <Slider
                    value={[settings.borderWidth]}
                    onValueChange={(value) => updateSettings({ borderWidth: value[0] })}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* الشفافية */}
                <div>
                  <div className="text-xs text-gray-600 mb-2">
                    الشفافية: {settings.opacity}%
                  </div>
                  <Slider
                    value={[settings.opacity]}
                    onValueChange={(value) => updateSettings({ opacity: value[0] })}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* معاينة */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">المعاينة</div>
              <div className="h-16 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded flex items-center justify-center"
                  style={{
                    backgroundColor: settings.fillColor,
                    border: `${settings.borderWidth}px solid ${settings.borderColor}`,
                    opacity: settings.opacity / 100
                  }}
                >
                  {selectedShape && React.createElement(selectedShape.icon, { 
                    className: "w-6 h-6",
                    style: { color: settings.borderColor }
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* الاختصارات */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>R:</strong> تفعيل الأداة</div>
          <div><strong>Enter:</strong> إدراج الشكل</div>
          <div><strong>Shift + Drag:</strong> نسبة متساوية</div>
          <div><strong>Alt + Drag:</strong> من المركز</div>
          <div><strong>Ctrl+D:</strong> تكرار</div>
        </div>
      </CardContent>
    </Card>
  );
};