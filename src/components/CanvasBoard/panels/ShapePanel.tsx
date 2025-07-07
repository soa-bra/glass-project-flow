import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Shapes, Square, Circle, Triangle, Star, Heart, 
  Home, User, Settings, Mail, Phone, Calendar,
  StickyNote, Palette
} from 'lucide-react';

interface ShapePanelProps {
  onAddShape: (type: 'geometric' | 'icon' | 'sticky', shapeData: any) => void;
}

const ShapePanel: React.FC<ShapePanelProps> = ({ onAddShape }) => {
  const [activeTab, setActiveTab] = useState<'geometric' | 'icons' | 'sticky'>('geometric');
  const [shapeColor, setShapeColor] = useState('#3B82F6');
  const [stickyColor, setStickyColor] = useState('#FEF3C7');
  const [stickyText, setStickyText] = useState('');

  const geometricShapes = [
    { id: 'rectangle', label: 'مستطيل', icon: Square },
    { id: 'circle', label: 'دائرة', icon: Circle },
    { id: 'triangle', label: 'مثلث', icon: Triangle },
    { id: 'star', label: 'نجمة', icon: Star },
    { id: 'heart', label: 'قلب', icon: Heart },
    { id: 'diamond', label: 'معين', icon: Square },
    { id: 'hexagon', label: 'سداسي', icon: Square },
    { id: 'arrow', label: 'سهم', icon: Triangle }
  ];

  const iconLibrary = [
    { id: 'home', label: 'منزل', icon: Home },
    { id: 'user', label: 'مستخدم', icon: User },
    { id: 'settings', label: 'إعدادات', icon: Settings },
    { id: 'mail', label: 'بريد', icon: Mail },
    { id: 'phone', label: 'هاتف', icon: Phone },
    { id: 'calendar', label: 'تقويم', icon: Calendar },
    { id: 'star', label: 'نجمة', icon: Star },
    { id: 'heart', label: 'قلب', icon: Heart }
  ];

  const stickyColors = [
    '#FEF3C7', '#FEE2E2', '#DBEAFE', '#D1FAE5',
    '#F3E8FF', '#FDE68A', '#FCA5A5', '#93C5FD'
  ];

  const handleAddGeometric = (shapeId: string) => {
    onAddShape('geometric', { shapeId, color: shapeColor });
  };

  const handleAddIcon = (iconId: string) => {
    onAddShape('icon', { iconId, color: shapeColor });
  };

  const handleAddSticky = () => {
    if (stickyText.trim()) {
      onAddShape('sticky', { 
        text: stickyText.trim(), 
        color: stickyColor 
      });
      setStickyText('');
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Shapes className="w-5 h-5 text-purple-500" />
          أداة الأشكال
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* تبويبات */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('geometric')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-arabic transition-colors ${
              activeTab === 'geometric' 
                ? 'bg-white shadow-sm text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            أشكال هندسية
          </button>
          <button
            onClick={() => setActiveTab('icons')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-arabic transition-colors ${
              activeTab === 'icons' 
                ? 'bg-white shadow-sm text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            مكتبة الأيقونات
          </button>
          <button
            onClick={() => setActiveTab('sticky')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-arabic transition-colors ${
              activeTab === 'sticky' 
                ? 'bg-white shadow-sm text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ستيكي نوت
          </button>
        </div>

        {/* اختيار اللون */}
        {activeTab !== 'sticky' && (
          <>
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">اللون</h4>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={shapeColor}
                  onChange={(e) => setShapeColor(e.target.value)}
                  className="w-8 h-8 rounded-xl border border-gray-200"
                />
                <Input
                  value={shapeColor}
                  onChange={(e) => setShapeColor(e.target.value)}
                  className="text-xs rounded-xl border-gray-200"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* الأشكال الهندسية */}
        {activeTab === 'geometric' && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-3">الأشكال الهندسية</h4>
            <div className="grid grid-cols-4 gap-2">
              {geometricShapes.map(shape => {
                const Icon = shape.icon;
                return (
                  <button
                    key={shape.id}
                    onClick={() => handleAddGeometric(shape.id)}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center gap-1"
                    title={shape.label}
                  >
                    <Icon className="w-5 h-5" style={{ color: shapeColor }} />
                    <span className="text-xs font-arabic">{shape.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* مكتبة الأيقونات */}
        {activeTab === 'icons' && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-3">مكتبة الأيقونات</h4>
            <div className="grid grid-cols-4 gap-2">
              {iconLibrary.map(icon => {
                const Icon = icon.icon;
                return (
                  <button
                    key={icon.id}
                    onClick={() => handleAddIcon(icon.id)}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center gap-1"
                    title={icon.label}
                  >
                    <Icon className="w-5 h-5" style={{ color: shapeColor }} />
                    <span className="text-xs font-arabic">{icon.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ستيكي نوت */}
        {activeTab === 'sticky' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium font-arabic">ستيكي نوت</h4>
            
            {/* ألوان الستيكي */}
            <div>
              <label className="text-xs font-arabic mb-2 block">اللون</label>
              <div className="flex gap-2 flex-wrap">
                {stickyColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setStickyColor(color)}
                    className={`w-6 h-6 rounded-lg border-2 transition-all ${
                      stickyColor === color 
                        ? 'border-gray-600 scale-110' 
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* نص الستيكي */}
            <div>
              <label className="text-xs font-arabic mb-2 block">النص</label>
              <Input
                value={stickyText}
                onChange={(e) => setStickyText(e.target.value)}
                placeholder="اكتب نص الستيكي نوت..."
                className="font-arabic text-sm rounded-xl border-gray-200"
              />
            </div>

            {/* معاينة */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <h5 className="text-xs font-arabic mb-2">معاينة:</h5>
              <div 
                className="p-3 rounded-lg shadow-sm min-h-16 flex items-center justify-center font-arabic text-sm"
                style={{ backgroundColor: stickyColor }}
              >
                {stickyText || 'نص تجريبي'}
              </div>
            </div>

            {/* إضافة الستيكي */}
            <Button
              onClick={handleAddSticky}
              disabled={!stickyText.trim()}
              className="w-full text-sm font-arabic rounded-xl"
            >
              <StickyNote className="w-4 h-4 mr-2" />
              إضافة ستيكي نوت
            </Button>
          </div>
        )}

        {/* نصائح */}
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
          <div className="text-xs text-purple-800 font-arabic space-y-1">
            <div>🎨 اختر الألوان المناسبة لتصميمك</div>
            <div>📐 الأشكال قابلة لتغيير الحجم</div>
            <div>📝 ستيكي نوت مفيدة للملاحظات السريعة</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShapePanel;