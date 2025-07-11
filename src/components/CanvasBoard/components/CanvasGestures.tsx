import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Hand, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move,
  MousePointer2,
  Fingerprint,
  Smartphone,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface CanvasGestureProps {
  onGestureChange: (gesture: string, enabled: boolean) => void;
  onZoomChange: (direction: 'in' | 'out') => void;
  onResetView: () => void;
}

interface GestureOption {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  category: 'navigation' | 'interaction' | 'drawing';
}

export const CanvasGestures: React.FC<CanvasGestureProps> = ({
  onGestureChange,
  onZoomChange,
  onResetView
}) => {
  const [gestures, setGestures] = useState<GestureOption[]>([
    {
      id: 'pan',
      name: 'السحب للتنقل',
      icon: Hand,
      description: 'سحب اللوحة للتنقل',
      enabled: true,
      category: 'navigation'
    },
    {
      id: 'pinch-zoom',
      name: 'القرص للتكبير',
      icon: ZoomIn,
      description: 'استخدام إصبعين للتكبير والتصغير',
      enabled: true,
      category: 'navigation'
    },
    {
      id: 'double-tap',
      name: 'النقر المزدوج',
      icon: MousePointer2,
      description: 'نقرة مزدوجة للتكبير السريع',
      enabled: true,
      category: 'navigation'
    },
    {
      id: 'rotate',
      name: 'الدوران',
      icon: RotateCcw,
      description: 'دوران العناصر بالإيماءات',
      enabled: false,
      category: 'interaction'
    },
    {
      id: 'long-press',
      name: 'الضغط الطويل',
      icon: Fingerprint,
      description: 'ضغطة طويلة لفتح القائمة',
      enabled: true,
      category: 'interaction'
    },
    {
      id: 'swipe-actions',
      name: 'إيماءات السحب',
      icon: Hand,
      description: 'سحب للحذف أو التحديد',
      enabled: true,
      category: 'interaction'
    }
  ]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleGesture = useCallback((gestureId: string) => {
    setGestures(prev => prev.map(gesture => {
      if (gesture.id === gestureId) {
        const newEnabled = !gesture.enabled;
        onGestureChange(gestureId, newEnabled);
        return { ...gesture, enabled: newEnabled };
      }
      return gesture;
    }));
  }, [onGestureChange]);

  const getGesturesByCategory = (category: string) => {
    return gestures.filter(gesture => gesture.category === category);
  };

  const renderGestureOption = (gesture: GestureOption) => (
    <div 
      key={gesture.id}
      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          gesture.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          <gesture.icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{gesture.name}</h4>
          <p className="text-xs text-muted-foreground">{gesture.description}</p>
        </div>
      </div>
      
      <Button
        variant={gesture.enabled ? "default" : "outline"}
        size="sm"
        onClick={() => toggleGesture(gesture.id)}
        className="min-w-[60px]"
      >
        {gesture.enabled ? 'مفعل' : 'معطل'}
      </Button>
    </div>
  );

  return (
    <Card className="canvas-panel w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-primary" />
          الإيماءات والتفاعل
          <Badge variant="outline" className="mr-auto">
            {gestures.filter(g => g.enabled).length} مفعل
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange('in')}
            className="flex-1"
          >
            <ZoomIn className="w-4 h-4 mr-2" />
            تكبير
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange('out')}
            className="flex-1"
          >
            <ZoomOut className="w-4 h-4 mr-2" />
            تصغير
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetView}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            إعادة تعيين
          </Button>
        </div>

        <Separator />

        {/* Navigation Gestures */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Move className="w-4 h-4" />
            التنقل
          </h4>
          <div className="space-y-2">
            {getGesturesByCategory('navigation').map(renderGestureOption)}
          </div>
        </div>

        {/* Interaction Gestures */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Fingerprint className="w-4 h-4" />
            التفاعل
          </h4>
          <div className="space-y-2">
            {getGesturesByCategory('interaction').map(renderGestureOption)}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-start"
          >
            {showAdvanced ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showAdvanced ? 'إخفاء' : 'إظهار'} الإعدادات المتقدمة
          </Button>

          {showAdvanced && (
            <Card className="p-3 bg-muted/30">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">الحساسية</span>
                  <Badge variant="secondary">متوسط</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">التأخير</span>
                  <Badge variant="secondary">200ms</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">دعم الهاتف</span>
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Device Info */}
        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">معلومات الجهاز</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>نوع الجهاز: {navigator.userAgent.includes('Mobile') ? 'هاتف' : 'حاسوب'}</div>
            <div>دعم اللمس: {'ontouchstart' in window ? 'متوفر' : 'غير متوفر'}</div>
            <div>الإيماءات المتقدمة: {gestures.filter(g => g.enabled && g.category === 'interaction').length > 0 ? 'مفعلة' : 'معطلة'}</div>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};