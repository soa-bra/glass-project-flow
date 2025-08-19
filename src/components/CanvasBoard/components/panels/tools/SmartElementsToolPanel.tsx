import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Calendar, 
  CheckSquare, 
  Vote, 
  Lightbulb, 
  Users, 
  Target, 
  Workflow,
  Clock,
  BarChart3
} from 'lucide-react';

export const SmartElementsToolPanel: React.FC = () => {
  const smartElements = [
    { 
      icon: Brain, 
      name: 'ثينك بورد', 
      id: 'think-board',
      description: 'لوحة للعصف الذهني والأفكار الإبداعية'
    },
    { 
      icon: CheckSquare, 
      name: 'لوحة كانبان', 
      id: 'kanban-board',
      description: 'لوحة إدارة المهام والمشاريع'
    },
    { 
      icon: Vote, 
      name: 'أداة التصويت', 
      id: 'voting-tool',
      description: 'إنشاء استطلاعات رأي تفاعلية'
    },
    { 
      icon: Calendar, 
      name: 'خط زمني', 
      id: 'timeline',
      description: 'إنشاء خطوط زمنية للمشاريع'
    },
    { 
      icon: Users, 
      name: 'خريطة أصحاب المصلحة', 
      id: 'stakeholder-map',
      description: 'تخطيط العلاقات والتأثيرات'
    },
    { 
      icon: Target, 
      name: 'مصفوفة الأهداف', 
      id: 'goals-matrix',
      description: 'تنظيم وتتبع الأهداف'
    },
    { 
      icon: Workflow, 
      name: 'مخطط انسيابي ذكي', 
      id: 'smart-flowchart',
      description: 'إنشاء مخططات انسيابية تفاعلية'
    },
    { 
      icon: Clock, 
      name: 'مخطط جانت', 
      id: 'gantt-chart',
      description: 'جدولة زمنية للمشاريع'
    },
    { 
      icon: BarChart3, 
      name: 'لوحة بيانات تفاعلية', 
      id: 'interactive-dashboard',
      description: 'عرض البيانات بشكل تفاعلي'
    },
    { 
      icon: Lightbulb, 
      name: 'خريطة ذهنية', 
      id: 'mind-map',
      description: 'تنظيم الأفكار والمفاهيم'
    }
  ];

  const handleElementSelect = (elementId: string) => {
    // Smart element selection logic
  };

  const renderElementButton = (element: typeof smartElements[0], colorClass: string) => (
    <Button
      key={element.id}
      onClick={() => handleElementSelect(element.id)}
      className={`w-full h-16 ${colorClass} text-black border-none hover:opacity-80 transition-opacity rounded-[16px] flex flex-col items-center justify-center gap-1`}
      title={element.description}
    >
      <element.icon className="w-5 h-5" />
      <span className="text-xs font-arabic">{element.name}</span>
    </Button>
  );

  // Organize elements by category
  const collaborationElements = smartElements.slice(0, 3);
  const planningElements = smartElements.slice(3, 6);
  const analysisElements = smartElements.slice(6);

  return (
    <div className="space-y-4">
      {/* Collaboration Tools */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">أدوات التعاون</h4>
        <div className="grid grid-cols-1 gap-2">
          {collaborationElements.map((element, index) => {
            const colors = ['bg-[#96d8d0] hover:bg-[#96d8d0]/80', 'bg-[#a4e2f6] hover:bg-[#a4e2f6]/80', 'bg-[#bdeed3] hover:bg-[#bdeed3]/80'];
            return renderElementButton(element, colors[index]);
          })}
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Planning Tools */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">أدوات التخطيط</h4>
        <div className="grid grid-cols-1 gap-2">
          {planningElements.map((element, index) => {
            const colors = ['bg-[#d9d2fd] hover:bg-[#d9d2fd]/80', 'bg-[#fbe2aa] hover:bg-[#fbe2aa]/80', 'bg-[#f1b5b9] hover:bg-[#f1b5b9]/80'];
            return renderElementButton(element, colors[index]);
          })}
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Analysis Tools */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">أدوات التحليل</h4>
        <div className="grid grid-cols-1 gap-2">
          {analysisElements.map((element, index) => {
            const colors = ['bg-[#e9eff4] hover:bg-[#e9eff4]/80', 'bg-[#d1e1ea] hover:bg-[#d1e1ea]/80', 'bg-[#96d8d0] hover:bg-[#96d8d0]/80'];
            return renderElementButton(element, colors[index]);
          })}
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Quick Actions */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">إجراءات سريعة</h4>
        <div className="space-y-2">
          <Button
            size="sm"
            className="w-full rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none font-arabic"
          >
            استيراد قالب جاهز
          </Button>
          <Button
            size="sm"
            className="w-full rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none font-arabic"
          >
            إنشاء قالب مخصص
          </Button>
        </div>
      </div>

      {/* AI Enhancement Notice */}
      <div className="bg-[#d9d2fd]/30 p-3 rounded-[16px] border border-[#d9d2fd]/50">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-[#d9d2fd]" />
          <span className="text-xs font-medium font-arabic text-black">تحسينات الذكاء الاصطناعي</span>
        </div>
        <div className="text-xs text-black font-arabic space-y-1">
          <div>🤖 اقتراحات ذكية للعناصر المناسبة</div>
          <div>📊 تحليل تلقائي للبيانات المدخلة</div>
          <div>🔄 تحديث ديناميكي للمحتوى</div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-[#fbe2aa]/30 p-3 rounded-[16px] border border-[#fbe2aa]/50">
        <div className="text-xs text-black font-arabic space-y-1">
          <div>💡 انقر على العنصر لإضافته للكانفس</div>
          <div>⚙️ انقر مرتين لتخصيص الإعدادات</div>
          <div>🔗 اربط العناصر معاً لتدفق البيانات</div>
          <div>📱 جميع العناصر متجاوبة ومتوافقة مع الجوال</div>
        </div>
      </div>
    </div>
  );
};