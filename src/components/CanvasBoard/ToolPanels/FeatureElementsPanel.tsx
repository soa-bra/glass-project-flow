import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Brain, 
  Zap, 
  Target,
  TrendingUp,
  Users,
  MessageCircle,
  Lightbulb,
  Workflow
} from 'lucide-react';

interface FeatureElementsPanelProps {
  onAddElement: (elementConfig: any) => void;
}

export const FeatureElementsPanel: React.FC<FeatureElementsPanelProps> = ({
  onAddElement
}) => {
  const smartElements = [
    {
      id: 'ai-chart',
      name: 'مخطط ذكي',
      icon: BarChart3,
      description: 'مخطط بياني بتحليل AI',
      category: 'analytics',
      config: { type: 'ai-chart', aiGenerated: true }
    },
    {
      id: 'smart-calendar',
      name: 'تقويم ذكي',
      icon: Calendar,
      description: 'تقويم تفاعلي مع اقتراحات',
      category: 'productivity',
      config: { type: 'smart-calendar', features: ['ai-suggestions'] }
    },
    {
      id: 'mindmap-ai',
      name: 'خريطة ذهنية AI',
      icon: Brain,
      description: 'خريطة ذهنية بتوليد آلي',
      category: 'thinking',
      config: { type: 'mindmap', aiAssisted: true }
    },
    {
      id: 'insights-widget',
      name: 'رؤى ذكية',
      icon: Lightbulb,
      description: 'عنصر تحليل البيانات',
      category: 'analytics',
      config: { type: 'insights', realTime: true }
    }
  ];

  const categories = [
    { id: 'analytics', name: 'التحليلات', color: 'bg-blue-100 text-blue-800' },
    { id: 'productivity', name: 'الإنتاجية', color: 'bg-green-100 text-green-800' },
    { id: 'thinking', name: 'التفكير', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          العناصر الذكية
          <Badge variant="secondary" className="text-xs">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Smart Elements Grid */}
        <div className="space-y-3">
          {categories.map(category => {
            const categoryElements = smartElements.filter(el => el.category === category.id);
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={category.color}>{category.name}</Badge>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {categoryElements.map(element => {
                    const Icon = element.icon;
                    return (
                      <Button
                        key={element.id}
                        variant="outline"
                        onClick={() => onAddElement(element.config)}
                        className="h-auto p-3 flex items-start gap-3 text-left"
                      >
                        <Icon className="w-5 h-5 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{element.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {element.description}
                          </div>
                        </div>
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Features */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">ميزات الذكاء الاصطناعي</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>🧠 توليد المحتوى تلقائياً</div>
            <div>📊 تحليل البيانات الذكي</div>
            <div>💡 اقتراحات محسنة</div>
            <div>🎯 تخصيص تفاعلي</div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>✨ العناصر الذكية تتفاعل مع البيانات</div>
          <div>🔄 تحديث تلقائي للمحتوى</div>
          <div>⚡ معالجة فورية بالـ AI</div>
        </div>
      </CardContent>
    </Card>
  );
};