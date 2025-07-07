import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Pen, Zap, GitBranch, Group, Eraser } from 'lucide-react';
import { SMART_PEN_MODES } from '../constants';

interface SmartPenPanelProps {
  selectedMode: string;
  onModeSelect: (mode: string) => void;
  lineWidth: number;
  onLineWidthChange: (width: number) => void;
  lineStyle: string;
  onLineStyleChange: (style: string) => void;
}

const SmartPenPanel: React.FC<SmartPenPanelProps> = ({
  selectedMode,
  onModeSelect,
  lineWidth,
  onLineWidthChange,
  lineStyle,
  onLineStyleChange
}) => {
  const [penColor, setPenColor] = useState('#000000');

  const lineStyles = [
    { id: 'solid', label: 'خط مستمر', preview: '────────' },
    { id: 'dashed', label: 'خط منقط', preview: '─ ─ ─ ─ ─' },
    { id: 'dotted', label: 'نقط', preview: '• • • • • •' },
    { id: 'wavy', label: 'متموج', preview: '∼∼∼∼∼∼' }
  ];

  const getModeIcon = (modeId: string) => {
    switch (modeId) {
      case 'smart-draw': return Zap;
      case 'root-connector': return GitBranch;
      case 'auto-group': return Group;
      case 'eraser': return Eraser;
      default: return Pen;
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Pen className="w-5 h-5 text-purple-500" />
          القلم الذكي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* خيارات الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">تخصيص الخط</h4>
          
          {/* عرض الخط */}
          <div className="space-y-2">
            <Label className="text-xs font-arabic">عرض الخط: {lineWidth}px</Label>
            <Slider
              value={[lineWidth]}
              onValueChange={(value) => onLineWidthChange(value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* لون القلم */}
          <div className="space-y-2">
            <Label className="text-xs font-arabic">لون القلم</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
              <span className="text-xs text-gray-600">{penColor}</span>
            </div>
          </div>

          {/* شكل الخط */}
          <div className="space-y-2">
            <Label className="text-xs font-arabic">شكل الخط</Label>
            <div className="space-y-1">
              {lineStyles.map((style) => (
                <Button
                  key={style.id}
                  variant={lineStyle === style.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-between text-xs font-arabic"
                  onClick={() => onLineStyleChange(style.id)}
                >
                  <span>{style.label}</span>
                  <span className="font-mono text-xs">{style.preview}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* الوظائف الذكية */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">الوظائف الذكية</h4>
          <div className="space-y-2">
            {SMART_PEN_MODES.map((mode) => {
              const Icon = getModeIcon(mode.id);
              const isSelected = selectedMode === mode.id;
              
              return (
                <Button
                  key={mode.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start gap-2 text-xs font-arabic ${
                    isSelected ? 'bg-purple-500 text-white' : ''
                  }`}
                  onClick={() => onModeSelect(mode.id)}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-right">
                    <div className="font-medium">{mode.label}</div>
                    <div className="text-xs opacity-70">{mode.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* معاينة الخط */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-2">معاينة الخط</h4>
          <div className="bg-white p-3 rounded border min-h-16 flex items-center justify-center">
            <div 
              className="h-1 w-20 rounded"
              style={{
                height: `${lineWidth}px`,
                backgroundColor: lineStyle === 'solid' ? penColor : 'transparent',
                borderTop: lineStyle !== 'solid' ? `${lineWidth}px ${lineStyle} ${penColor}` : 'none'
              }}
            />
          </div>
        </div>

        {/* تعليمات الاستخدام */}
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">كيفية الاستخدام:</h4>
          <ul className="text-xs text-purple-800 font-arabic space-y-1">
            <li>• اضغط مع السحب للرسم</li>
            <li>• الرسم الذكي: يحول الأشكال تلقائياً</li>
            <li>• الجذر: يربط بين العناصر</li>
            <li>• التجميع: يجمع العناصر المحاطة</li>
            <li>• المسح: يحذف العناصر</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartPenPanel;