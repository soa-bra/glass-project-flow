import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Hand, Move, RotateCcw, ZoomIn } from 'lucide-react';

interface HandPanelProps {
  panSpeed: number;
  onPanSpeedChange: (speed: number) => void;
  canvasPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onResetPosition: () => void;
  onFitToScreen: () => void;
}

const HandPanel: React.FC<HandPanelProps> = ({
  panSpeed,
  onPanSpeedChange,
  canvasPosition,
  onPositionChange,
  onResetPosition,
  onFitToScreen
}) => {
  const panModes = [
    { id: 'smooth', label: 'تنقل سلس', description: 'حركة ناعمة وبطيئة' },
    { id: 'normal', label: 'تنقل عادي', description: 'سرعة متوسطة' },
    { id: 'fast', label: 'تنقل سريع', description: 'حركة سريعة ومباشرة' }
  ];

  const quickMoves = [
    { label: 'المركز', action: () => onPositionChange({ x: 0, y: 0 }) },
    { label: 'أعلى يسار', action: () => onPositionChange({ x: -100, y: -100 }) },
    { label: 'أعلى يمين', action: () => onPositionChange({ x: 100, y: -100 }) },
    { label: 'أسفل يسار', action: () => onPositionChange({ x: -100, y: 100 }) },
    { label: 'أسفل يمين', action: () => onPositionChange({ x: 100, y: 100 }) }
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Hand className="w-5 h-5 text-orange-500" />
          أداة الكف (التنقل)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* سرعة التنقل */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">سرعة التنقل</h4>
          <div className="space-y-2">
            <Label className="text-xs font-arabic">السرعة: {panSpeed}%</Label>
            <Slider
              value={[panSpeed]}
              onValueChange={(value) => onPanSpeedChange(value[0])}
              max={200}
              min={50}
              step={10}
              className="w-full"
            />
          </div>
        </div>

        {/* أنماط التنقل */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نمط التنقل</h4>
          <div className="space-y-1">
            {panModes.map((mode) => (
              <Button
                key={mode.id}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs font-arabic"
                onClick={() => {
                  switch(mode.id) {
                    case 'smooth': onPanSpeedChange(80); break;
                    case 'normal': onPanSpeedChange(120); break;
                    case 'fast': onPanSpeedChange(180); break;
                  }
                }}
              >
                <div className="text-right">
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-xs opacity-70">{mode.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* التحكم السريع */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">التحكم السريع</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onResetPosition} size="sm" variant="outline" className="text-xs font-arabic">
              <RotateCcw className="w-3 h-3 mr-1" />
              إعادة تعيين
            </Button>
            <Button onClick={onFitToScreen} size="sm" variant="outline" className="text-xs font-arabic">
              <ZoomIn className="w-3 h-3 mr-1" />
              ملاءمة الشاشة
            </Button>
          </div>
        </div>

        {/* التحركات السريعة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">تحركات سريعة</h4>
          <div className="grid grid-cols-2 gap-1">
            {quickMoves.map((move, index) => (
              <Button
                key={index}
                onClick={move.action}
                size="sm"
                variant="ghost"
                className="text-xs font-arabic h-8"
              >
                {move.label}
              </Button>
            ))}
          </div>
        </div>

        {/* معلومات الموقع الحالي */}
        <div className="bg-orange-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">الموقع الحالي:</h4>
          <div className="text-xs text-orange-800 font-arabic space-y-1">
            <div>س: {canvasPosition.x}px</div>
            <div>ص: {canvasPosition.y}px</div>
            <div>السرعة: {panSpeed}%</div>
          </div>
        </div>

        {/* تعليمات الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">كيفية الاستخدام:</h4>
          <ul className="text-xs text-blue-800 font-arabic space-y-1">
            <li>• اسحب بالماوس للتنقل</li>
            <li>• استخدم مفاتيح الأسهم</li>
            <li>• مسطرة المسافة + اسحب</li>
            <li>• عجلة الماوس للتنقل العمودي</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HandPanel;