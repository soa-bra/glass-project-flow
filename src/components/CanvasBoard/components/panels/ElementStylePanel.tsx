
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Square, 
  Move, 
  RotateCw, 
  Maximize2,
  Eye,
  Lock,
  Layers
} from 'lucide-react';
import { CanvasElement } from '../../types';

interface ElementStylePanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (elementId: string, updates: any) => void;
}

export const ElementStylePanel: React.FC<ElementStylePanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  const [activeTab, setActiveTab] = useState('style');

  const handleUpdateElement = (updates: any) => {
    if (selectedElement) {
      onUpdateElement(selectedElement.id, updates);
    }
  };

  const renderColorPicker = (label: string, value: string, onChange: (color: string) => void) => (
    <div className="space-y-2">
      <label className="text-sm font-arabic text-black">{label}</label>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-[8px] border border-[#d1e1ea] cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        />
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm rounded-[12px] border-[#d1e1ea] text-black"
        />
      </div>
    </div>
  );

  const renderSlider = (label: string, value: number, onChange: (value: number) => void, min: number, max: number, step: number = 1) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-arabic text-black">{label}</label>
        <span className="text-xs text-black/70">{value}{step < 1 ? '' : 'px'}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );

  if (!selectedElement) {
    return (
      <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
            <Palette className="w-5 h-5" />
            تنسيق العنصر
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex items-center justify-center h-[calc(100%-4rem)]">
          <div className="text-center space-y-2">
            <Square className="w-12 h-12 text-black/30 mx-auto" />
            <div className="text-sm font-arabic text-black/70">
              لا يوجد عنصر محدد
            </div>
            <div className="text-xs font-arabic text-black/50">
              اختر عنصر لتعديل خصائصه
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Palette className="w-5 h-5" />
          تنسيق العنصر
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-[#96d8d0] text-black border-none text-xs">
            {selectedElement.type}
          </Badge>
          <Badge className="bg-[#a4e2f6] text-black border-none text-xs">
            {selectedElement.id.slice(0, 8)}...
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-6rem)] overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-1">
            <TabsTrigger 
              value="style" 
              className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-[#96d8d0] data-[state=active]:text-black"
            >
              التنسيق
            </TabsTrigger>
            <TabsTrigger 
              value="position" 
              className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-[#96d8d0] data-[state=active]:text-black"
            >
              الموضع
            </TabsTrigger>
            <TabsTrigger 
              value="effects" 
              className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-[#96d8d0] data-[state=active]:text-black"
            >
              التأثيرات
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="mt-4 space-y-4">
            {selectedElement.type === 'text' && (
              <>
                <div>
                  <label className="text-sm font-arabic text-black mb-2 block">النص</label>
                  <Input 
                    value={selectedElement.content || ''}
                    onChange={(e) => handleUpdateElement({ content: e.target.value })}
                    className="text-sm rounded-[12px] border-[#d1e1ea] text-black"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-arabic text-black mb-2 block">حجم الخط</label>
                  <Select 
                    value={selectedElement.fontSize?.toString() || '16'}
                    onValueChange={(value) => handleUpdateElement({ fontSize: parseInt(value) })}
                  >
                    <SelectTrigger className="rounded-[12px] border-[#d1e1ea] text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                      <SelectItem value="24">24px</SelectItem>
                      <SelectItem value="32">32px</SelectItem>
                      <SelectItem value="48">48px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-arabic text-black mb-2 block">نوع الخط</label>
                  <Select 
                    value={selectedElement.fontFamily || 'Arabic'}
                    onValueChange={(value) => handleUpdateElement({ fontFamily: value })}
                  >
                    <SelectTrigger className="rounded-[12px] border-[#d1e1ea] text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arabic">عربي</SelectItem>
                      <SelectItem value="Tajawal">تجول</SelectItem>
                      <SelectItem value="Amiri">أميري</SelectItem>
                      <SelectItem value="Noto Sans Arabic">نوتو سانس</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {renderColorPicker('لون النص', selectedElement.color || '#000000', (color) => handleUpdateElement({ color }))}
              </>
            )}
            
            {(selectedElement.type === 'shape' || selectedElement.type === 'rectangle' || selectedElement.type === 'circle') && (
              <>
                {renderColorPicker('لون التعبئة', selectedElement.fillColor || '#ffffff', (color) => handleUpdateElement({ fillColor: color }))}
                {renderColorPicker('لون الحد', selectedElement.strokeColor || '#000000', (color) => handleUpdateElement({ strokeColor: color }))}
                {renderSlider('سمك الحد', selectedElement.strokeWidth || 1, (value) => handleUpdateElement({ strokeWidth: value }), 0, 10)}
              </>
            )}
            
            {renderSlider('الشفافية', selectedElement.opacity || 1, (value) => handleUpdateElement({ opacity: value }), 0, 1, 0.1)}
          </TabsContent>
          
          <TabsContent value="position" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">الموضع X</label>
                <Input 
                  type="number"
                  value={selectedElement.x || 0}
                  onChange={(e) => handleUpdateElement({ x: parseInt(e.target.value) })}
                  className="text-sm rounded-[12px] border-[#d1e1ea] text-black"
                />
              </div>
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">الموضع Y</label>
                <Input 
                  type="number"
                  value={selectedElement.y || 0}
                  onChange={(e) => handleUpdateElement({ y: parseInt(e.target.value) })}
                  className="text-sm rounded-[12px] border-[#d1e1ea] text-black"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">العرض</label>
                <Input 
                  type="number"
                  value={selectedElement.width || 100}
                  onChange={(e) => handleUpdateElement({ width: parseInt(e.target.value) })}
                  className="text-sm rounded-[12px] border-[#d1e1ea] text-black"
                />
              </div>
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">الارتفاع</label>
                <Input 
                  type="number"
                  value={selectedElement.height || 100}
                  onChange={(e) => handleUpdateElement({ height: parseInt(e.target.value) })}
                  className="text-sm rounded-[12px] border-[#d1e1ea] text-black"
                />
              </div>
            </div>
            
            {renderSlider('الدوران', selectedElement.rotation || 0, (value) => handleUpdateElement({ rotation: value }), 0, 360)}
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
                onClick={() => handleUpdateElement({ x: Math.round((selectedElement.x || 0) / 10) * 10, y: Math.round((selectedElement.y || 0) / 10) * 10 })}
              >
                <Move className="w-4 h-4 mr-1" />
                محاذاة
              </Button>
              <Button 
                size="sm" 
                className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
                onClick={() => handleUpdateElement({ rotation: 0 })}
              >
                <RotateCw className="w-4 h-4 mr-1" />
                إعادة تعيين
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="effects" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">تأثير الظل</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
                    onClick={() => handleUpdateElement({ shadow: 'light' })}
                  >
                    خفيف
                  </Button>
                  <Button 
                    size="sm" 
                    className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
                    onClick={() => handleUpdateElement({ shadow: 'heavy' })}
                  >
                    قوي
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">التمويه</label>
                {renderSlider('شدة التمويه', selectedElement.blur || 0, (value) => handleUpdateElement({ blur: value }), 0, 20)}
              </div>
              
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">تأثير الضوء</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
                    onClick={() => handleUpdateElement({ glow: 'soft' })}
                  >
                    ناعم
                  </Button>
                  <Button 
                    size="sm" 
                    className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
                    onClick={() => handleUpdateElement({ glow: 'medium' })}
                  >
                    متوسط
                  </Button>
                  <Button 
                    size="sm" 
                    className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none"
                    onClick={() => handleUpdateElement({ glow: 'strong' })}
                  >
                    قوي
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator className="bg-[#d1e1ea]" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-arabic text-black">الحالة</span>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className={`rounded-[12px] w-8 h-8 p-0 ${selectedElement.visible !== false ? 'bg-[#96d8d0] hover:bg-[#96d8d0]/80' : 'bg-[#d1e1ea] hover:bg-[#d1e1ea]/80'} text-black border-none`}
                    onClick={() => handleUpdateElement({ visible: !(selectedElement.visible !== false) })}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className={`rounded-[12px] w-8 h-8 p-0 ${selectedElement.locked ? 'bg-[#f1b5b9] hover:bg-[#f1b5b9]/80' : 'bg-[#d1e1ea] hover:bg-[#d1e1ea]/80'} text-black border-none`}
                    onClick={() => handleUpdateElement({ locked: !selectedElement.locked })}
                  >
                    <Lock className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-arabic text-black mb-2 block">ترتيب الطبقة</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
                    onClick={() => handleUpdateElement({ zIndex: (selectedElement.zIndex || 0) + 1 })}
                  >
                    للأمام
                  </Button>
                  <Button 
                    size="sm" 
                    className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
                    onClick={() => handleUpdateElement({ zIndex: Math.max(0, (selectedElement.zIndex || 0) - 1) })}
                  >
                    للخلف
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
