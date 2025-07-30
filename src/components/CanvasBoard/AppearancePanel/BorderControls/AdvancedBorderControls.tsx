import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Square, 
  Circle, 
  Minus, 
  MoreHorizontal,
  Zap,
  Copy,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface BorderStyle {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  radius: number;
  opacity: number;
}

interface BorderControlsProps {
  border: BorderStyle;
  onChange: (border: BorderStyle) => void;
  onPresetSave?: (preset: BorderPreset) => void;
  savedPresets?: BorderPreset[];
}

interface BorderPreset {
  id: string;
  name: string;
  border: BorderStyle;
  preview: string;
}

export const AdvancedBorderControls: React.FC<BorderControlsProps> = ({
  border,
  onChange,
  onPresetSave,
  savedPresets = []
}) => {
  const [presetName, setPresetName] = useState('');
  
  // Predefined border styles
  const borderStyles = [
    { value: 'solid', label: 'صلب', preview: '────' },
    { value: 'dashed', label: 'متقطع', preview: '── ──' },
    { value: 'dotted', label: 'منقط', preview: '••••' },
    { value: 'double', label: 'مزدوج', preview: '══' },
    { value: 'groove', label: 'محفور', preview: '▬▬' },
    { value: 'ridge', label: 'مرتفع', preview: '■■' },
    { value: 'inset', label: 'داخلي', preview: '▣▣' },
    { value: 'outset', label: 'خارجي', preview: '▢▢' }
  ];

  // Predefined border presets
  const defaultPresets: BorderPreset[] = [
    {
      id: 'thin-solid',
      name: 'حد رفيع',
      border: { width: 1, color: '#000000', style: 'solid', radius: 0, opacity: 100 },
      preview: '1px solid'
    },
    {
      id: 'medium-solid',
      name: 'حد متوسط',
      border: { width: 3, color: '#000000', style: 'solid', radius: 0, opacity: 100 },
      preview: '3px solid'
    },
    {
      id: 'thick-solid',
      name: 'حد سميك',
      border: { width: 5, color: '#000000', style: 'solid', radius: 0, opacity: 100 },
      preview: '5px solid'
    },
    {
      id: 'rounded-thin',
      name: 'مدور رفيع',
      border: { width: 2, color: '#3B82F6', style: 'solid', radius: 8, opacity: 100 },
      preview: '2px solid r8'
    },
    {
      id: 'rounded-medium',
      name: 'مدور متوسط',
      border: { width: 3, color: '#10B981', style: 'solid', radius: 12, opacity: 100 },
      preview: '3px solid r12'
    },
    {
      id: 'dashed-blue',
      name: 'متقطع أزرق',
      border: { width: 2, color: '#3B82F6', style: 'dashed', radius: 4, opacity: 100 },
      preview: '2px dashed'
    },
    {
      id: 'dotted-red',
      name: 'منقط أحمر',
      border: { width: 3, color: '#EF4444', style: 'dotted', radius: 0, opacity: 100 },
      preview: '3px dotted'
    },
    {
      id: 'double-black',
      name: 'مزدوج أسود',
      border: { width: 4, color: '#000000', style: 'double', radius: 0, opacity: 100 },
      preview: '4px double'
    }
  ];

  const allPresets = [...defaultPresets, ...savedPresets];

  const updateBorder = (updates: Partial<BorderStyle>) => {
    onChange({ ...border, ...updates });
  };

  const applyPreset = (preset: BorderPreset) => {
    onChange(preset.border);
    toast.success(`تم تطبيق النمط: ${preset.name}`);
  };

  const saveCurrentAsPreset = () => {
    if (!presetName.trim()) {
      toast.error('يرجى إدخال اسم النمط');
      return;
    }

    const newPreset: BorderPreset = {
      id: `custom-${Date.now()}`,
      name: presetName,
      border: { ...border },
      preview: `${border.width}px ${border.style}`
    };

    if (onPresetSave) {
      onPresetSave(newPreset);
      setPresetName('');
      toast.success('تم حفظ النمط');
    }
  };

  const resetBorder = () => {
    onChange({
      width: 1,
      color: '#000000',
      style: 'solid',
      radius: 0,
      opacity: 100
    });
    toast.success('تم إعادة تعيين الحدود');
  };

  const getPreviewStyle = (borderStyle: BorderStyle) => ({
    border: `${borderStyle.width}px ${borderStyle.style} ${borderStyle.color}`,
    borderRadius: `${borderStyle.radius}px`,
    opacity: borderStyle.opacity / 100
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Square className="w-5 h-5" />
          تحكم الحدود المتقدم
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="style">النمط</TabsTrigger>
            <TabsTrigger value="presets">الأنماط الجاهزة</TabsTrigger>
            <TabsTrigger value="advanced">متقدم</TabsTrigger>
          </TabsList>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4">
            {/* Preview */}
            <div className="flex justify-center">
              <div
                className="w-24 h-24 bg-gray-100 dark:bg-gray-800"
                style={getPreviewStyle(border)}
              />
            </div>

            {/* Border Width */}
            <div className="space-y-2">
              <Label className="text-sm">عرض الحد: {border.width}px</Label>
              <Slider
                value={[border.width]}
                onValueChange={([width]) => updateBorder({ width })}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Border Style */}
            <div className="space-y-2">
              <Label className="text-sm">نوع الحد</Label>
              <Select value={border.style} onValueChange={(style: any) => updateBorder({ style })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {borderStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{style.preview}</span>
                        <span>{style.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Border Color */}
            <div className="space-y-2">
              <Label className="text-sm">لون الحد</Label>
              <div className="flex gap-2">
                <div
                  className="w-10 h-10 rounded border cursor-pointer"
                  style={{ backgroundColor: border.color }}
                  onClick={() => {
                    // يمكن ربطه بـ Color Picker
                    toast.info('سيتم فتح منتقي الألوان');
                  }}
                />
                <Input
                  value={border.color}
                  onChange={(e) => updateBorder({ color: e.target.value })}
                  placeholder="#000000"
                  className="font-mono"
                />
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <Label className="text-sm">انحناء الزوايا: {border.radius}px</Label>
              <Slider
                value={[border.radius]}
                onValueChange={([radius]) => updateBorder({ radius })}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-4">
            {/* Save Current as Preset */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <Label className="text-sm font-medium">حفظ النمط الحالي</Label>
              <div className="flex gap-2">
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="اسم النمط..."
                  className="flex-1"
                />
                <Button onClick={saveCurrentAsPreset} size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preset Grid */}
            <div className="grid grid-cols-2 gap-3">
              {allPresets.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start gap-2"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm font-medium">{preset.name}</span>
                    <div
                      className="w-6 h-6 border-2 rounded"
                      style={getPreviewStyle(preset.border)}
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {preset.preview}
                  </span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            {/* Opacity */}
            <div className="space-y-2">
              <Label className="text-sm">شفافية الحد: {border.opacity}%</Label>
              <Slider
                value={[border.opacity]}
                onValueChange={([opacity]) => updateBorder({ opacity })}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Individual Border Sides */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">حدود منفصلة</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-current" />
                  علوي
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-current" />
                  أيمن
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-current" />
                  سفلي
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-current" />
                  أيسر
                </Button>
              </div>
            </div>

            {/* Shadow Effects */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">تأثيرات الظل</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  ظل خارجي
                </Button>
                <Button variant="outline" size="sm">
                  ظل داخلي
                </Button>
                <Button variant="outline" size="sm">
                  توهج
                </Button>
                <Button variant="outline" size="sm">
                  إضاءة
                </Button>
              </div>
            </div>

            {/* Gradient Borders */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">حدود متدرجة</Label>
              
              <Button variant="outline" className="w-full justify-start">
                <Zap className="w-4 h-4 mr-2" />
                تطبيق تدرج الألوان
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetBorder}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            إعادة تعيين
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.info('سيتم نسخ كود CSS')}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {/* CSS Code Preview */}
        <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">كود CSS:</Label>
          <code className="text-xs font-mono text-gray-800 dark:text-gray-200">
            {`border: ${border.width}px ${border.style} ${border.color};`}
            {border.radius > 0 && <br />}
            {border.radius > 0 && `border-radius: ${border.radius}px;`}
            {border.opacity < 100 && <br />}
            {border.opacity < 100 && `opacity: ${border.opacity / 100};`}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};