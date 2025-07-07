import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Pen, Eraser, GitBranch, Group, Sparkles, 
  Palette, Settings, Target, Zap
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
  const [activeTab, setActiveTab] = useState('modes');

  const penModes = [
    { 
      id: 'smart-draw', 
      label: 'الرسم الذكي', 
      icon: Sparkles,
      description: 'تحويل الرسوم إلى أشكال هندسية تلقائياً',
      color: 'text-blue-500'
    },
    { 
      id: 'root-connector', 
      label: 'الجذر', 
      icon: GitBranch,
      description: 'ربط العناصر بخطوط ذكية ومرنة',
      color: 'text-green-500'
    },
    { 
      id: 'auto-group', 
      label: 'التجميع التلقائي', 
      icon: Group,
      description: 'تجميع العناصر المحاطة تلقائياً',
      color: 'text-purple-500'
    },
    { 
      id: 'eraser', 
      label: 'المسح الذكي', 
      icon: Eraser,
      description: 'حذف العناصر بالرسم فوقها',
      color: 'text-red-500'
    },
    { 
      id: 'annotation', 
      label: 'التعليق', 
      icon: Pen,
      description: 'إضافة تعليقات وملاحظات مرئية',
      color: 'text-orange-500'
    }
  ];

  const lineStyles = [
    { value: 'solid', label: 'متصل', preview: '────────' },
    { value: 'dashed', label: 'متقطع', preview: '── ── ──' },
    { value: 'dotted', label: 'نقطي', preview: '• • • • • •' },
    { value: 'double', label: 'مزدوج', preview: '═══════' }
  ];

  const presetColors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F97316', '#EAB308', '#22C55E',
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Pen className="w-5 h-5 text-blue-500" />
          القلم الذكي المتقدم
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modes" className="text-xs font-arabic">الأوضاع</TabsTrigger>
            <TabsTrigger value="style" className="text-xs font-arabic">التصميم</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs font-arabic">ذكي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modes" className="space-y-4">
            {/* أوضاع القلم */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-3">أوضاع القلم</h4>
              <div className="space-y-2">
                {penModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => onPenModeSelect(mode.id)}
                      className={`w-full p-3 rounded-xl border transition-all ${
                        selectedPenMode === mode.id 
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <div className="font-medium text-sm font-arabic">{mode.label}</div>
                          <div className="text-xs opacity-80 font-arabic mt-1">{mode.description}</div>
                        </div>
                        <Icon className={`w-5 h-5 ${selectedPenMode === mode.id ? 'text-white' : mode.color}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* معاينة الوضع النشط */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="text-xs font-arabic space-y-1">
                <div className="font-medium">الوضع النشط:</div>
                <div className="text-blue-600">
                  {penModes.find(m => m.id === selectedPenMode)?.label}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            {/* سُمك الخط */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">سُمك الخط</h4>
              <div className="space-y-3">
                <Slider
                  value={[lineWidth]}
                  onValueChange={(value) => onLineWidthChange(value[0])}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-arabic bg-gray-100 px-2 py-1 rounded-full">
                    {lineWidth}px
                  </span>
                  <div 
                    className="h-1 bg-gray-800 rounded-full"
                    style={{ width: `${Math.max(lineWidth * 2, 20)}px` }}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* نمط الخط */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">نمط الخط</h4>
              <div className="space-y-2">
                {lineStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => onLineStyleChange(style.value)}
                    className={`w-full p-2 rounded-xl border text-sm font-arabic transition-colors ${
                      lineStyle === style.value 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{style.label}</span>
                      <span className="font-mono text-xs">{style.preview}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* لون القلم */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">لون القلم</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
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
                
                {/* الألوان المسبقة */}
                <div>
                  <label className="text-xs font-arabic text-gray-600 mb-2 block">ألوان سريعة</label>
                  <div className="grid grid-cols-6 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => onColorChange(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          penColor === color 
                            ? 'border-blue-500 scale-110' 
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            {/* التنعيم الذكي */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">التنعيم الذكي</h4>
              <div className="space-y-2">
                <Slider
                  value={[smoothing]}
                  onValueChange={(value) => onSmoothingChange(value[0])}
                  max={100}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center font-arabic">
                  {smoothing}% تنعيم
                </div>
              </div>
            </div>

            <Separator />

            {/* حساسية الالتقاط */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">حساسية الالتقاط</h4>
              <div className="space-y-2">
                <Slider
                  value={[snapSensitivity]}
                  onValueChange={(value) => onSnapSensitivityChange(value[0])}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center font-arabic">
                  {snapSensitivity}px حساسية
                </div>
              </div>
            </div>

            <Separator />

            {/* الإعدادات الذكية */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-3">الإعدادات الذكية</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-group" className="text-sm font-arabic">
                    التجميع التلقائي
                  </Label>
                  <Switch
                    id="auto-group"
                    checked={autoGroup}
                    onCheckedChange={onAutoGroupToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="smart-recognition" className="text-sm font-arabic">
                    التعرف الذكي على الأشكال
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
              <h4 className="text-sm font-medium font-arabic mb-2">معايرة القلم</h4>
              <Button 
                onClick={onCalibratePen}
                size="sm" 
                variant="outline" 
                className="w-full text-xs font-arabic rounded-xl"
              >
                <Settings className="w-3 h-3 mr-1" />
                معايرة القلم للحصول على أفضل أداء
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>✏️ اسحب لرسم خطوط وأشكال</div>
            <div>🔗 الجذر يربط العناصر بذكاء</div>
            <div>🎯 الرسم الذكي يحول للأشكال الهندسية</div>
            <div>⚡ المسح الذكي يحذد بدقة</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSmartPenPanel;