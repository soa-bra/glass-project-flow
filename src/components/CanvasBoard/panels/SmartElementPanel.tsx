import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, BarChart, Calendar, Users, MessageSquare } from 'lucide-react';

interface SmartElementPanelProps {
  onAddSmartElement: (type: string, config: any) => void;
}

const SmartElementPanel: React.FC<SmartElementPanelProps> = ({ onAddSmartElement }) => {
  const smartElements = [
    {
      id: 'chart',
      name: 'مخطط ذكي',
      icon: BarChart,
      description: 'إنشاء مخططات تفاعلية'
    },
    {
      id: 'mindmap',
      name: 'خريطة ذهنية',
      icon: Brain,
      description: 'إنشاء خرائط ذهنية متفرعة'
    },
    {
      id: 'calendar',
      name: 'تقويم',
      icon: Calendar,
      description: 'عرض التواريخ والمواعيد'
    },
    {
      id: 'team',
      name: 'فريق العمل',
      icon: Users,
      description: 'عرض أعضاء الفريق'
    },
    {
      id: 'feedback',
      name: 'نموذج تغذية راجعة',
      icon: MessageSquare,
      description: 'جمع آراء المستخدمين'
    }
  ];

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={16} />
          العناصر الذكية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {smartElements.map((element) => {
            const IconComponent = element.icon;
            return (
              <Button
                key={element.id}
                variant="outline"
                onClick={() => onAddSmartElement(element.id, { type: element.id })}
                className="w-full h-auto p-3 flex-col items-start text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  <IconComponent size={16} />
                  <span className="font-medium">{element.name}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {element.description}
                </span>
              </Button>
            );
          })}
        </div>
        
        <div className="pt-2 border-t">
          <Button
            variant="default"
            className="w-full"
            onClick={() => onAddSmartElement('custom', { type: 'custom' })}
          >
            <Sparkles size={14} className="mr-2" />
            إنشاء عنصر مخصص
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartElementPanel;