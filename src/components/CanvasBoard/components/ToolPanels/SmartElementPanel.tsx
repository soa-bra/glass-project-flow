import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Kanban, Vote, Brain, Clock, 
  Network, Target, BarChart, TrendingUp,
  Workflow, GitBranch, Lightbulb
} from 'lucide-react';

interface SmartElementPanelProps {
  onElementSelect: (element: SmartElementType) => void;
}

export interface SmartElementType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'collaboration' | 'planning' | 'analysis';
  features: string[];
}

const collaborationElements: SmartElementType[] = [
  {
    id: 'think-board',
    name: 'ثينك بورد',
    description: 'لوحة تفاعلية للعصف الذهني والأفكار',
    icon: Brain,
    category: 'collaboration',
    features: ['أعمدة قابلة للتخصيص', 'إضافة أفكار', 'تصويت', 'تصدير']
  },
  {
    id: 'kanban',
    name: 'لوحة كنبان',
    description: 'إدارة المهام والمشاريع بطريقة مرئية',
    icon: Kanban,
    category: 'collaboration',
    features: ['مراحل قابلة للتخصيص', 'سحب وإفلات', 'إضافة مهام', 'تتبع التقدم']
  },
  {
    id: 'voting',
    name: 'أداة التصويت',
    description: 'إجراء استطلاعات وتصويت تفاعلي',
    icon: Vote,
    category: 'collaboration',
    features: ['خيارات متعددة', 'نتائج فورية', 'مؤقت', 'مجهول']
  },
  {
    id: 'brainstorm',
    name: 'محرك العصف الذهني',
    description: 'جلسة عصف ذهني منظمة',
    icon: Lightbulb,
    category: 'collaboration',
    features: ['وضع صامت', 'تعاوني', 'مؤقت', 'تصنيف الأفكار']
  }
];

const planningElements: SmartElementType[] = [
  {
    id: 'timeline',
    name: 'الخط الزمني',
    description: 'تخطيط زمني للمشاريع والمهام',
    icon: Clock,
    category: 'planning',
    features: ['معالم زمنية', 'مهام', 'تبعيات', 'مخطط جانت']
  },
  {
    id: 'stakeholder-map',
    name: 'خريطة أصحاب المصلحة',
    description: 'تحديد وتحليل أصحاب المصلحة',
    icon: Network,
    category: 'planning',
    features: ['تصنيف', 'مستوى التأثير', 'العلاقات', 'تحليل']
  },
  {
    id: 'decision-matrix',
    name: 'مصفوفة القرارات',
    description: 'اتخاذ قرارات مدروسة ومنهجية',
    icon: Target,
    category: 'planning',
    features: ['معايير', 'أوزان', 'تقييم', 'ترتيب']
  },
  {
    id: 'root-connector',
    name: 'الجذر',
    description: 'ربط العناصر والأفكار ببعضها البعض',
    icon: GitBranch,
    category: 'planning',
    features: ['روابط ذكية', 'تصنيف', 'اتجاهات', 'تسميات']
  }
];

const analysisElements: SmartElementType[] = [
  {
    id: 'flowchart',
    name: 'مخطط انسيابي ذكي',
    description: 'رسم المسارات والعمليات',
    icon: Workflow,
    category: 'analysis',
    features: ['أشكال تلقائية', 'قرارات', 'مسارات', 'تحليل']
  },
  {
    id: 'dashboard',
    name: 'لوحة بيانات تفاعلية',
    description: 'عرض البيانات والإحصائيات',
    icon: BarChart,
    category: 'analysis',
    features: ['رسوم بيانية', 'مؤشرات', 'تفاعلية', 'تحديث فوري']
  },
  {
    id: 'smart-mindmap',
    name: 'خرائط ذهنية ذكية',
    description: 'خرائط ذهنية مدعومة بالذكاء الاصطناعي',
    icon: TrendingUp,
    category: 'analysis',
    features: ['توليد تلقائي', 'تصنيف', 'روابط', 'توسيع ذكي']
  }
];

export const SmartElementPanel: React.FC<SmartElementPanelProps> = ({
  onElementSelect
}) => {
  const [selectedElement, setSelectedElement] = useState<SmartElementType | null>(null);

  const handleElementSelect = (element: SmartElementType) => {
    setSelectedElement(element);
    onElementSelect(element);
  };

  const renderElementGrid = (elements: SmartElementType[], title: string) => (
    <div className="space-y-3">
      <div className="text-xs font-medium text-gray-700">{title}</div>
      <div className="space-y-2">
        {elements.map((element) => {
          const Icon = element.icon;
          const isSelected = selectedElement?.id === element.id;
          return (
            <Button
              key={element.id}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => handleElementSelect(element)}
              className="w-full p-3 h-auto flex flex-col items-start gap-2 text-right"
            >
              <div className="flex items-center gap-2 w-full">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 text-right">
                  <div className="font-medium text-sm">{element.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{element.description}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 w-full">
                {element.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {element.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{element.features.length - 3}
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">العنصر الذكي</CardTitle>
        <div className="text-xs text-gray-500">
          عناصر تفاعلية مدعومة بالذكاء الاصطناعي
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="collaboration" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collaboration" className="text-xs">التعاون</TabsTrigger>
            <TabsTrigger value="planning" className="text-xs">التخطيط</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">التحليل</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collaboration" className="space-y-4">
            {renderElementGrid(collaborationElements, 'أدوات التعاون')}
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-4">
            {renderElementGrid(planningElements, 'أدوات التخطيط')}
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            {renderElementGrid(analysisElements, 'أدوات التحليل')}
          </TabsContent>
        </Tabs>

        {selectedElement && (
          <>
            <div className="border-t pt-4">
              <div className="text-xs font-medium text-gray-700 mb-2">التفاصيل</div>
              <div className="space-y-2">
                <div className="text-sm font-medium">{selectedElement.name}</div>
                <div className="text-xs text-gray-600">{selectedElement.description}</div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700">الميزات:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedElement.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="border-t pt-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div><strong>S:</strong> تفعيل الأداة</div>
            <div><strong>Enter:</strong> إدراج العنصر</div>
            <div><strong>Esc:</strong> إلغاء</div>
            <div><strong>Shift + Arrows:</strong> التنقل داخل العناصر</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};