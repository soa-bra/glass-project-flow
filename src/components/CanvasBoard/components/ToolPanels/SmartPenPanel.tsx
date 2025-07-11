import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SmartPenPanelProps {
  onSettingsChange: (settings: SmartPenSettings) => void;
}

export interface SmartPenSettings {
  thickness: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  smartMode: boolean;
}

const colors = [
  { name: 'أسود', value: '#000000' },
  { name: 'أحمر', value: '#ef4444' },
  { name: 'أزرق', value: '#3b82f6' },
  { name: 'أخضر', value: '#10b981' },
  { name: 'برتقالي', value: '#f97316' },
  { name: 'بنفسجي', value: '#8b5cf6' },
  { name: 'وردي', value: '#ec4899' },
  { name: 'رمادي', value: '#6b7280' }
];

const lineStyles = [
  { id: 'solid', label: 'متصل', preview: '──────' },
  { id: 'dashed', label: 'متقطع', preview: '- - - -' },
  { id: 'dotted', label: 'نقطي', preview: '• • • •' },
  { id: 'double', label: 'مزدوج', preview: '══════' }
];

export const SmartPenPanel: React.FC<SmartPenPanelProps> = ({
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<SmartPenSettings>({
    thickness: 2,
    color: '#000000',
    style: 'solid',
    smartMode: true
  });

  const updateSettings = (newSettings: Partial<SmartPenSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    onSettingsChange(updated);
  };

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic flex items-center justify-between">
          القلم الذكي
          <Badge variant={settings.smartMode ? 'default' : 'secondary'} className="text-xs">
            {settings.smartMode ? 'ذكي' : 'عادي'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* وضع الذكاء الاصطناعي */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">الوضع</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={settings.smartMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ smartMode: true })}
              className="text-xs"
            >
              🧠 ذكي
            </Button>
            <Button
              variant={!settings.smartMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ smartMode: false })}
              className="text-xs"
            >
              ✏️ عادي
            </Button>
          </div>
          {settings.smartMode && (
            <div className="text-xs text-gray-500 mt-1">
              يحول الأشكال تلقائياً ويتعرف على الروابط والتجميعات
            </div>
          )}
        </div>

        <Separator />

        {/* سمك الخط */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            سمك الخط: {settings.thickness}px
          </div>
          <Slider
            value={[settings.thickness]}
            onValueChange={(value) => updateSettings({ thickness: value[0] })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>رفيع</span>
            <span>عريض</span>
          </div>
        </div>

        <Separator />

        {/* لون القلم */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">لون القلم</div>
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

        {/* نمط الخط */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">نمط الخط</div>
          <div className="space-y-2">
            {lineStyles.map((style) => (
              <Button
                key={style.id}
                variant={settings.style === style.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ style: style.id as any })}
                className="w-full justify-between text-xs"
              >
                <span>{style.label}</span>
                <span className="font-mono">{style.preview}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* معاينة */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">المعاينة</div>
          <div className="h-16 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
            <svg width="120" height="40" viewBox="0 0 120 40">
              <path
                d="M10 20 Q 35 5, 60 20 T 110 20"
                stroke={settings.color}
                strokeWidth={settings.thickness}
                strokeDasharray={
                  settings.style === 'dashed' ? '5,5' :
                  settings.style === 'dotted' ? '2,3' :
                  settings.style === 'double' ? '' : ''
                }
                fill="none"
              />
              {settings.style === 'double' && (
                <path
                  d="M10 22 Q 35 7, 60 22 T 110 22"
                  stroke={settings.color}
                  strokeWidth={Math.max(1, settings.thickness - 1)}
                  fill="none"
                />
              )}
            </svg>
          </div>
        </div>

        {/* الاختصارات */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>Shift:</strong> خط مستقيم</div>
          <div><strong>Alt:</strong> رسم عادي</div>
          <div><strong>P:</strong> تفعيل الأداة</div>
        </div>
      </CardContent>
    </Card>
  );
};