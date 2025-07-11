
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Pen, Settings2, Palette, Zap, Group, 
  Eraser, GitBranch, Sparkles 
} from 'lucide-react';

interface EnhancedSmartPenPanelProps {
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

const EnhancedSmartPenPanel: React.FC<EnhancedSmartPenPanelProps> = ({
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
  const penModes = [
    { 
      id: 'smart-draw', 
      label: 'الرسم الذكي', 
      icon: Sparkles, 
      description: 'تحويل الأشكال إلى أشكال هندسية' 
    },
    { 
      id: 'root-connector', 
      label: 'الجذر', 
      icon: GitBranch, 
      description: 'ربط العناصر ببعضها' 
    },
    { 
      id: 'auto-group', 
      label: 'التجميع التلقائي', 
      icon: Group, 
      description: 'تجميع العناصر المحاطة' 
    },
    { 
      id: 'eraser', 
      label: 'المسح', 
      icon: Eraser, 
      description: 'حذف العناصر بالرسم فوقها' 
    }
  ];

  const lineStyles = [
    { value: 'solid', label: 'متصل' },
    { value: 'dashed', label: 'متقطع' },
    { value: 'dotted', label: 'نقطي' },
    { value: 'double', label: 'مزدوج' }
  ];

  const quickColors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#FFC0CB', '#A52A2A'
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Pen className="w-5 h-5 text-blue-500" />
          القلم الذكي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* وضع القلم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">وضع القلم</h4>
          <div className="grid grid-cols-1 gap-2">
            {penModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  onClick={() => onPenModeSelect(mode.id)}
                  variant={selectedPenMode === mode.id ? "default" : "outline"}
                  className={`h-auto p-3 text-right font-arabic rounded-xl justify-start ${
                    selectedPenMode === mode.id ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 ml-2" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{mode.label}</div>
                    <div className="text-xs opacity-75 mt-1">{mode.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* سُمك الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">سُمك الخط</h4>
          <div className="space-y-2">
            <Slider
              value={[lineWidth]}
              onValueChange={(value) => onLineWidthChange(value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center font-arabic">
              {lineWidth}px
            </div>
          </div>
        </div>

        <Separator />

        {/* نمط الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نمط الخط</h4>
          <Select value={lineStyle} onValueChange={onLineStyleChange}>
            <SelectTrigger className="w-full font-arabic rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* لون الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">لون الخط</h4>
          <div className="space-y-3">
            {/* الألوان السريعة */}
            <div className="grid grid-cols-6 gap-2">
              {quickColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    penColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* منتقي اللون المخصص */}
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={penColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer"
              />
              <div className="flex-1 bg-gray-50 px-3 py-2 rounded-xl font-mono text-sm">
                {penColor}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* الإعدادات المتقدمة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الإعدادات المتقدمة</h4>
          <div className="space-y-3">
            {/* التنعيم */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-arabic">التنعيم</span>
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

            {/* حساسية المحاذاة */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-arabic">حساسية المحاذاة</span>
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

            {/* المفاتيح */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-arabic">التجميع التلقائي</span>
                <Switch
                  checked={autoGroup}
                  onCheckedChange={onAutoGroupToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-arabic">التعرف الذكي</span>
                <Switch
                  checked={smartRecognition}
                  onCheckedChange={onSmartRecognitionToggle}
                />
              </div>
            </div>

            {/* معايرة القلم */}
            <Button
              onClick={onCalibratePen}
              variant="outline"
              size="sm"
              className="w-full font-arabic rounded-xl"
            >
              <Settings2 className="w-4 h-4 ml-2" />
              معايرة القلم
            </Button>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>✏️ اسحب لرسم خطوط وأشكال</div>
            <div>🔗 استخدم الجذر لربط العناصر</div>
            <div>🎯 الرسم الذكي يحول الخطوط لأشكال هندسية</div>
            <div>🗑️ المسح يحذف ما ترسم عليه</div>
            <div>⌨️ Shift خط مستقيم | Alt بدون ذكاء</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSmartPenPanel;
