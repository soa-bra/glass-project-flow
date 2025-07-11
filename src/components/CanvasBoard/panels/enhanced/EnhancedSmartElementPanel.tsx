
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, Users, BarChart3, GitBranch, Lightbulb,
  Vote, Calendar, Target, Brain, Workflow,
  Play, Settings2, Zap
} from 'lucide-react';

interface SmartElement {
  id: string;
  name: string;
  icon: any;
  category: 'collaboration' | 'planning' | 'analysis';
  description: string;
  settings?: any;
}

interface EnhancedSmartElementPanelProps {
  onAddSmartElement: (type: string, config: any) => void;
  onPreviewElement: (type: string, config: any) => void;
  isAIEnabled: boolean;
  onToggleAI: (enabled: boolean) => void;
}

const EnhancedSmartElementPanel: React.FC<EnhancedSmartElementPanelProps> = ({
  onAddSmartElement,
  onPreviewElement,
  isAIEnabled,
  onToggleAI
}) => {
  const [selectedElement, setSelectedElement] = useState<SmartElement | null>(null);
  const [elementConfig, setElementConfig] = useState<any>({});

  const smartElements: SmartElement[] = [
    // أدوات التعاون
    {
      id: 'think-board',
      name: 'ثينك بورد',
      icon: Users,
      category: 'collaboration',
      description: 'لوحة تفاعلية للعصف الذهني والتعاون',
      settings: {
        columns: { type: 'number', default: 3, label: 'عدد الأعمدة' },
        categories: { type: 'text', default: 'أفكار,مشاكل,حلول', label: 'أسماء الفئات' }
      }
    },
    {
      id: 'kanban',
      name: 'كانبان',
      icon: BarChart3,
      category: 'collaboration',
      description: 'لوحة إدارة المهام والمشاريع',
      settings: {
        statuses: { type: 'select', options: ['To Do,In Progress,Done', 'مخطط,قيد التنفيذ,مكتمل'], default: 'To Do,In Progress,Done', label: 'حالات المهام' }
      }
    },
    {
      id: 'voting',
      name: 'تصويت',
      icon: Vote,
      category: 'collaboration',
      description: 'أداة التصويت والاستطلاع التفاعلي',
      settings: {
        optionsCount: { type: 'number', default: 4, label: 'عدد الخيارات' },
        duration: { type: 'number', default: 5, label: 'المدة (دقائق)' }
      }
    },
    {
      id: 'brainstorm-engine',
      name: 'محرك العصف الذهني',
      icon: Lightbulb,
      category: 'collaboration',
      description: 'عمود دردشة مخصص للعصف الذهني',
      settings: {
        mode: { type: 'select', options: ['تعاوني', 'صامت'], default: 'تعاوني', label: 'وضع العصف' },
        participants: { type: 'number', default: 5, label: 'عدد المشاركين' },
        duration: { type: 'number', default: 10, label: 'المدة (دقائق)' }
      }
    },
    // أدوات التخطيط
    {
      id: 'timeline',
      name: 'خط زمني',
      icon: Calendar,
      category: 'planning',
      description: 'إضافة خط زمني أو مخططات جانت',
      settings: {
        type: { type: 'select', options: ['خط زمني', 'جانت'], default: 'خط زمني', label: 'نوع المخطط' },
        duration: { type: 'number', default: 30, label: 'المدة (أيام)' }
      }
    },
    {
      id: 'stakeholder-map',
      name: 'خريطة أصحاب المصلحة',
      icon: Target,
      category: 'planning',
      description: 'تحديد وتصنيف أصحاب المصلحة',
      settings: {
        categories: { type: 'text', default: 'عالي,متوسط,منخفض', label: 'مستويات التأثير' }
      }
    },
    {
      id: 'decision-matrix',
      name: 'مصفوفة القرارات',
      icon: GitBranch,
      category: 'planning',
      description: 'مصفوفة لتقييم الخيارات والقرارات',
      settings: {
        criteria: { type: 'number', default: 4, label: 'عدد المعايير' },
        options: { type: 'number', default: 3, label: 'عدد الخيارات' }
      }
    },
    {
      id: 'root-connector',
      name: 'الجذر',
      icon: GitBranch,
      category: 'planning',
      description: 'أداة للربط بين العناصر',
      settings: {
        connectionType: { type: 'select', options: ['مباشر', 'منحني', 'زاوية'], default: 'منحني', label: 'نوع الاتصال' }
      }
    },
    // أدوات التحليل
    {
      id: 'smart-flowchart',
      name: 'مخطط انسيابي ذكي',
      icon: Workflow,
      category: 'analysis',
      description: 'مخطط انسيابي بالذكاء الاصطناعي',
      settings: {
        complexity: { type: 'select', options: ['بسيط', 'متوسط', 'معقد'], default: 'متوسط', label: 'مستوى التعقيد' }
      }
    },
    {
      id: 'smart-mindmap',
      name: 'خرائط ذهنية ذكية',
      icon: Brain,
      category: 'analysis',
      description: 'رسم الخرائط الذهنية يدوياً أو بالذكاء الاصطناعي',
      settings: {
        generation: { type: 'select', options: ['يدوي', 'ذكاء اصطناعي', 'مختلط'], default: 'ذكاء اصطناعي', label: 'طريقة التوليد' },
        depth: { type: 'number', default: 3, label: 'عمق الفروع' }
      }
    }
  ];

  const categories = {
    collaboration: { label: 'أدوات التعاون', icon: Users },
    planning: { label: 'أدوات التخطيط', icon: Target },
    analysis: { label: 'أدوات التحليل', icon: BarChart3 }
  };

  const handleElementSelect = (element: SmartElement) => {
    setSelectedElement(element);
    // تعيين القيم الافتراضية
    const defaultConfig: any = {};
    if (element.settings) {
      Object.entries(element.settings).forEach(([key, setting]: [string, any]) => {
        defaultConfig[key] = setting.default;
      });
    }
    setElementConfig(defaultConfig);
  };

  const handleConfigChange = (key: string, value: any) => {
    setElementConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleAddElement = () => {
    if (selectedElement) {
      onAddSmartElement(selectedElement.id, elementConfig);
      setSelectedElement(null);
      setElementConfig({});
    }
  };

  const handlePreviewElement = () => {
    if (selectedElement) {
      onPreviewElement(selectedElement.id, elementConfig);
    }
  };

  const renderElementsByCategory = (category: string) => {
    const categoryElements = smartElements.filter(el => el.category === category);
    
    return (
      <div className="grid grid-cols-2 gap-2">
        {categoryElements.map((element) => {
          const Icon = element.icon;
          return (
            <Button
              key={element.id}
              onClick={() => handleElementSelect(element)}
              variant={selectedElement?.id === element.id ? "default" : "outline"}
              className="h-20 flex flex-col items-center p-2 text-xs font-arabic"
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-center leading-tight">{element.name}</span>
            </Button>
          );
        })}
      </div>
    );
  };

  const renderElementSettings = () => {
    if (!selectedElement || !selectedElement.settings) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium font-arabic">إعدادات {selectedElement.name}</h4>
        {Object.entries(selectedElement.settings).map(([key, setting]: [string, any]) => (
          <div key={key}>
            <label className="text-xs font-arabic text-gray-600 mb-1 block">
              {setting.label}
            </label>
            {setting.type === 'number' && (
              <Input
                type="number"
                value={elementConfig[key] || setting.default}
                onChange={(e) => handleConfigChange(key, parseInt(e.target.value))}
                className="text-sm"
              />
            )}
            {setting.type === 'text' && (
              <Input
                type="text"
                value={elementConfig[key] || setting.default}
                onChange={(e) => handleConfigChange(key, e.target.value)}
                className="text-sm"
                placeholder={setting.default}
              />
            )}
            {setting.type === 'select' && (
              <select
                value={elementConfig[key] || setting.default}
                onChange={(e) => handleConfigChange(key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              >
                {setting.options.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          العنصر الذكي
          <div className="flex items-center gap-2 ml-auto">
            <Switch
              checked={isAIEnabled}
              onCheckedChange={onToggleAI}
              size="sm"
            />
            <Zap className={`w-4 h-4 ${isAIEnabled ? 'text-yellow-500' : 'text-gray-400'}`} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="collaboration" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="text-xs font-arabic flex flex-col items-center p-2 gap-1"
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{category.label.split(' ')[1]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(categories).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {renderElementsByCategory(category)}
            </TabsContent>
          ))}
        </Tabs>

        {/* معلومات العنصر المحدد */}
        {selectedElement && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <div className="font-medium text-sm font-arabic mb-1">
                {selectedElement.name}
              </div>
              <div className="text-xs text-blue-800 font-arabic">
                {selectedElement.description}
              </div>
            </div>

            {/* إعدادات العنصر */}
            {renderElementSettings()}

            {/* أزرار الإجراءات */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handlePreviewElement}
                variant="outline"
                size="sm"
                className="text-xs font-arabic rounded-xl"
              >
                <Play className="w-3 h-3 ml-1" />
                معاينة
              </Button>
              <Button
                onClick={handleAddElement}
                size="sm"
                className="text-xs font-arabic rounded-xl bg-blue-500 hover:bg-blue-600"
              >
                <Sparkles className="w-3 h-3 ml-1" />
                إضافة
              </Button>
            </div>
          </div>
        )}

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🧠 العناصر الذكية تدعم الذكاء الاصطناعي</div>
            <div>🎯 اختر العنصر وعدّل إعداداته</div>
            <div>👥 أدوات التعاون تحفز المشاركة الجماعية</div>
            <div>⌨️ S تفعيل | Enter إضافة | Esc إلغاء</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSmartElementPanel;
