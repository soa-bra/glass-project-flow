import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextPanelProps {
  onSettingsChange: (settings: TextSettings) => void;
}

export interface TextSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

const fontFamilies = [
  { value: 'cairo', label: 'Cairo', preview: 'نص تجريبي' },
  { value: 'amiri', label: 'Amiri', preview: 'نص تجريبي' },
  { value: 'tajawal', label: 'Tajawal', preview: 'نص تجريبي' },
  { value: 'inter', label: 'Inter', preview: 'Sample Text' },
  { value: 'roboto', label: 'Roboto', preview: 'Sample Text' },
  { value: 'opensans', label: 'Open Sans', preview: 'Sample Text' }
];

const colors = [
  { name: 'أسود', value: '#000000' },
  { name: 'رمادي', value: '#6b7280' },
  { name: 'أحمر', value: '#ef4444' },
  { name: 'أزرق', value: '#3b82f6' },
  { name: 'أخضر', value: '#10b981' },
  { name: 'برتقالي', value: '#f97316' },
  { name: 'بنفسجي', value: '#8b5cf6' },
  { name: 'وردي', value: '#ec4899' }
];

export const TextPanel: React.FC<TextPanelProps> = ({
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<TextSettings>({
    fontFamily: 'cairo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'right',
    color: '#000000'
  });

  const updateSettings = (newSettings: Partial<TextSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    onSettingsChange(updated);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">أداة النص</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* نوع الخط */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">نوع الخط</div>
          <Select
            value={settings.fontFamily}
            onValueChange={(value) => updateSettings({ fontFamily: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{font.label}</span>
                    <span className="text-xs text-gray-500 ml-4">{font.preview}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* حجم الخط */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            حجم الخط: {settings.fontSize}px
          </div>
          <Slider
            value={[settings.fontSize]}
            onValueChange={(value) => updateSettings({ fontSize: value[0] })}
            min={8}
            max={72}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>8px</span>
            <span>72px</span>
          </div>
        </div>

        <Separator />

        {/* التنسيق */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">التنسيق</div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={settings.fontWeight === 'bold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ 
                fontWeight: settings.fontWeight === 'bold' ? 'normal' : 'bold' 
              })}
              className="p-2"
              title="عريض (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={settings.fontStyle === 'italic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ 
                fontStyle: settings.fontStyle === 'italic' ? 'normal' : 'italic' 
              })}
              className="p-2"
              title="مائل (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={settings.textDecoration === 'underline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ 
                textDecoration: settings.textDecoration === 'underline' ? 'none' : 'underline' 
              })}
              className="p-2"
              title="تحته خط (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* المحاذاة */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">المحاذاة</div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={settings.textAlign === 'right' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ textAlign: 'right' })}
              className="p-2"
              title="محاذاة يمين"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant={settings.textAlign === 'center' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ textAlign: 'center' })}
              className="p-2"
              title="محاذاة وسط"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={settings.textAlign === 'left' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ textAlign: 'left' })}
              className="p-2"
              title="محاذاة يسار"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* لون النص */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">لون النص</div>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  settings.color === color.value 
                    ? 'border-gray-400 scale-110' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => updateSettings({ color: color.value })}
                title={color.name}
              />
            ))}
          </div>
          
          {/* منتقي لون مخصص */}
          <div className="mt-2">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => updateSettings({ color: e.target.value })}
              className="w-full h-8 rounded border border-gray-200"
              title="لون مخصص"
            />
          </div>
        </div>

        <Separator />

        {/* معاينة */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">المعاينة</div>
          <div className="h-20 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center p-4">
            <div
              style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                fontWeight: settings.fontWeight,
                fontStyle: settings.fontStyle,
                textDecoration: settings.textDecoration,
                textAlign: settings.textAlign,
                color: settings.color,
                width: '100%'
              }}
            >
              نص تجريبي للمعاينة
            </div>
          </div>
        </div>

        <Separator />

        {/* الاختصارات */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>T:</strong> تفعيل أداة النص</div>
          <div><strong>Ctrl+B:</strong> عريض</div>
          <div><strong>Ctrl+I:</strong> مائل</div>
          <div><strong>Ctrl+U:</strong> تحته خط</div>
          <div><strong>Enter:</strong> إضافة النص</div>
          <div><strong>Esc:</strong> إلغاء الإدخال</div>
        </div>
      </CardContent>
    </Card>
  );
};