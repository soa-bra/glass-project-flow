import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Pen, Palette, Settings, Zap, Target } from 'lucide-react';

interface EnhancedSmartPenToolProps {
  selectedTool: string;
  selectedPenMode: string;
  lineWidth: number;
  lineStyle: string;
  penColor: string;
  smoothing: number;
  snapSensitivity: number;
  autoGroup: boolean;
  smartRecognition: boolean;
  onPenModeSelect: (mode: string) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onColorChange: (color: string) => void;
  onSmoothingChange: (smoothing: number) => void;
  onSnapSensitivityChange: (sensitivity: number) => void;
  onAutoGroupToggle: (enabled: boolean) => void;
  onSmartRecognitionToggle: (enabled: boolean) => void;
  onCalibratePen: () => void;
}

export const EnhancedSmartPenTool: React.FC<EnhancedSmartPenToolProps> = ({
  selectedTool,
  selectedPenMode,
  lineWidth,
  lineStyle,
  penColor,
  smoothing,
  snapSensitivity,
  autoGroup,
  smartRecognition,
  onPenModeSelect,
  onLineWidthChange,
  onLineStyleChange,
  onColorChange,
  onSmoothingChange,
  onSnapSensitivityChange,
  onAutoGroupToggle,
  onSmartRecognitionToggle,
  onCalibratePen
}) => {
  const [previewStroke, setPreviewStroke] = useState(false);

  if (selectedTool !== 'smart-pen') return null;

  const penModes = [
    { id: 'draw', label: 'رسم حر', description: 'رسم خطوط حرة' },
    { id: 'line', label: 'خط مستقيم', description: 'رسم خطوط مستقيمة' },
    { id: 'curve', label: 'منحنى', description: 'رسم منحنيات ناعمة' },
    { id: 'smart', label: 'ذكي', description: 'التعرف على الأشكال' }
  ];

  const lineStyles = [
    { value: 'solid', label: 'مستمر' },
    { value: 'dashed', label: 'متقطع' },
    { value: 'dotted', label: 'منقط' },
    { value: 'dash-dot', label: 'خط-نقطة' }
  ];

  const colorPresets = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#FF69B4', '#8B4513'
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Pen className="w-5 h-5 text-green-500" />
          القلم الذكي المتقدم
        </CardTitle>
        {smartRecognition && (
          <BaseBadge className="w-fit bg-green-100 text-green-800 font-arabic">
            <Zap className="w-3 h-3 mr-1" />
            التعرف الذكي مُفعل
          </BaseBadge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* نمط القلم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نمط القلم</h4>
          <div className="grid grid-cols-2 gap-2">
            {penModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onPenModeSelect(mode.id)}
                className={`p-3 rounded-lg border text-xs font-arabic transition-colors ${
                  selectedPenMode === mode.id 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs opacity-75 mt-1">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* سُمك الخط */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-arabic">سُمك الخط</Label>
            <BaseBadge variant="outline" className="font-mono">
              {lineWidth}px
            </BaseBadge>
          </div>
          <Slider
            value={[lineWidth]}
            onValueChange={(value) => onLineWidthChange(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
          
          {/* معاينة سُمك الخط */}
          <div className="mt-2 flex justify-center">
            <div
              className="rounded"
              style={{
                width: '60px',
                height: `${lineWidth}px`,
                backgroundColor: penColor,
                minHeight: '2px'
              }}
            />
          </div>
        </div>

        {/* نمط الخط */}
        <div>
          <Label className="text-sm font-arabic mb-2 block">نمط الخط</Label>
          <Select value={lineStyle} onValueChange={onLineStyleChange}>
            <SelectTrigger className="font-arabic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineStyles.map((style) => (
                <SelectItem key={style.value} value={style.value} className="font-arabic">
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* اللون */}
        <div>
          <Label className="text-sm font-arabic mb-2 block">لون القلم</Label>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={penColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-12 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={penColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border rounded font-mono"
                placeholder="#000000"
              />
            </div>
            
            {/* ألوان مُعدة مسبقاً */}
            <div className="grid grid-cols-6 gap-1">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    penColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* الإعدادات المتقدمة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            إعدادات متقدمة
          </h4>
          
          <div className="space-y-3">
            {/* التنعيم */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-arabic">تنعيم الخطوط</Label>
                <span className="text-xs text-gray-500">{smoothing}%</span>
              </div>
              <Slider
                value={[smoothing]}
                onValueChange={(value) => onSmoothingChange(value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* حساسية السنابينج */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-arabic">حساسية الإلتصاق</Label>
                <span className="text-xs text-gray-500">{snapSensitivity}px</span>
              </div>
              <Slider
                value={[snapSensitivity]}
                onValueChange={(value) => onSnapSensitivityChange(value[0])}
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            {/* التجميع التلقائي */}
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-group" className="text-sm font-arabic">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  تجميع تلقائي
                </span>
              </Label>
              <Switch
                id="auto-group"
                checked={autoGroup}
                onCheckedChange={onAutoGroupToggle}
              />
            </div>

            {/* التعرف الذكي */}
            <div className="flex items-center justify-between">
              <Label htmlFor="smart-recognition" className="text-sm font-arabic">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  التعرف على الأشكال
                </span>
              </Label>
              <Switch
                id="smart-recognition"
                checked={smartRecognition}
                onCheckedChange={onSmartRecognitionToggle}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* معايرة القلم */}
        <div>
          <Button
            onClick={onCalibratePen}
            variant="outline"
            className="w-full font-arabic rounded-xl"
          >
            <Settings className="w-4 h-4 mr-2" />
            معايرة القلم
          </Button>
        </div>

        {/* معاينة الرسم */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-medium font-arabic mb-2">معاينة:</h4>
          <div className="bg-white rounded-lg border p-4 h-20 flex items-center justify-center">
            <svg width="100" height="40" className="overflow-visible">
              <path
                d="M10,30 Q30,10 50,30 T90,30"
                fill="none"
                stroke={penColor}
                strokeWidth={lineWidth}
                strokeDasharray={
                  lineStyle === 'dashed' ? '5,5' :
                  lineStyle === 'dotted' ? '2,2' :
                  lineStyle === 'dash-dot' ? '5,2,2,2' : '0'
                }
              />
            </svg>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-green-50 p-3 rounded-xl border border-green-200">
          <div className="text-xs text-green-800 font-arabic space-y-1">
            <div>✏️ اسحب لرسم خطوط حرة</div>
            <div>📏 اضغط مع السحب للخطوط المستقيمة</div>
            <div>🎯 التعرف الذكي يحول الرسم لأشكال</div>
            <div>⚡ التجميع التلقائي ينظم الخطوط</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSmartPenTool;