import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hand, Move, Navigation, RotateCcw, Home } from 'lucide-react';
import { ZOOM_OPTIONS } from '../constants';

interface HandPanelProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canvasPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onCenterView: () => void;
}

const HandPanel: React.FC<HandPanelProps> = ({
  zoom,
  onZoomChange,
  canvasPosition,
  onPositionChange,
  onFitToScreen,
  onResetView,
  onCenterView
}) => {
  const handleQuickMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    const moveDistance = 50;
    const newPosition = { ...canvasPosition };
    
    switch (direction) {
      case 'up':
        newPosition.y -= moveDistance;
        break;
      case 'down':
        newPosition.y += moveDistance;
        break;
      case 'left':
        newPosition.x -= moveDistance;
        break;
      case 'right':
        newPosition.x += moveDistance;
        break;
    }
    
    onPositionChange(newPosition);
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onPositionChange({
      ...canvasPosition,
      [axis]: value
    });
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Hand className="w-5 h-5 text-orange-500" />
          أداة الكف
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* التنقل السريع */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">التنقل السريع</h4>
          <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
            <div></div>
            <Button 
              onClick={() => handleQuickMove('up')} 
              size="sm" 
              variant="outline"
              className="h-8 w-8 p-0"
            >
              ↑
            </Button>
            <div></div>
            
            <Button 
              onClick={() => handleQuickMove('left')} 
              size="sm" 
              variant="outline"
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
            <Button 
              onClick={onCenterView} 
              size="sm" 
              variant="default"
              className="h-8 w-8 p-0"
              title="توسيط العرض"
            >
              <Home className="w-3 h-3" />
            </Button>
            <Button 
              onClick={() => handleQuickMove('right')} 
              size="sm" 
              variant="outline"
              className="h-8 w-8 p-0"
            >
              →
            </Button>
            
            <div></div>
            <Button 
              onClick={() => handleQuickMove('down')} 
              size="sm" 
              variant="outline"
              className="h-8 w-8 p-0"
            >
              ↓
            </Button>
            <div></div>
          </div>
        </div>

        {/* التحكم الدقيق */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium font-arabic">التحكم الدقيق</h4>
          
          {/* مستوى الزوم */}
          <div>
            <Label className="text-xs font-arabic">مستوى الزوم (%)</Label>
            <Input
              type="number"
              value={zoom}
              onChange={(e) => onZoomChange(parseInt(e.target.value) || 100)}
              min={50}
              max={150}
              className="h-8 text-xs"
            />
          </div>

          {/* الاتجاه الأفقي */}
          <div>
            <Label className="text-xs font-arabic">الاتجاه الأفقي (X)</Label>
            <Input
              type="number"
              value={canvasPosition.x}
              onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>

          {/* الاتجاه العمودي */}
          <div>
            <Label className="text-xs font-arabic">الاتجاه العمودي (Y)</Label>
            <Input
              type="number"
              value={canvasPosition.y}
              onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* قائمة النسب المئوية */}
        <div>
          <Label className="text-xs font-arabic mb-2 block">نسب الزوم السريع</Label>
          <Select value={zoom.toString()} onValueChange={(value) => {
            if (value === 'fit') {
              onFitToScreen();
            } else {
              onZoomChange(parseInt(value));
            }
          }}>
            <SelectTrigger className="font-arabic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ZOOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* أدوات التنقل */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onFitToScreen} size="sm" variant="outline" className="text-xs font-arabic">
            <Move className="w-3 h-3 mr-1" />
            ملاءمة
          </Button>
          <Button onClick={onResetView} size="sm" variant="outline" className="text-xs font-arabic">
            <RotateCcw className="w-3 h-3 mr-1" />
            إعادة تعيين
          </Button>
        </div>

        {/* معلومات الموقع */}
        <div className="bg-orange-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">الموقع الحالي:</h4>
          <div className="text-xs text-orange-800 font-arabic space-y-1">
            <div>الزوم: {zoom}%</div>
            <div>الموقع: ({canvasPosition.x}, {canvasPosition.y})</div>
          </div>
        </div>

        {/* تعليمات الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">كيفية الاستخدام:</h4>
          <ul className="text-xs text-blue-800 font-arabic space-y-1">
            <li>• اضغط مع السحب للتنقل</li>
            <li>• استخدم الأسهم للحركة السريعة</li>
            <li>• زر التوسيط للعودة للمركز</li>
            <li>• مسافة + سحب للتنقل السريع</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HandPanel;