
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Users, 
  Brain,
  ArrowRight,
  Grid3X3,
  MousePointer
} from 'lucide-react';

interface DefaultViewProps {
  onStartCanvas: () => void;
}

export const DefaultView: React.FC<DefaultViewProps> = ({ onStartCanvas }) => {
  const features = [
    {
      icon: Brain,
      title: 'مساعد ذكي مدعوم بالذكاء الاصطناعي',
      description: 'احصل على اقتراحات ذكية وتحسينات تلقائية لتصميمك'
    },
    {
      icon: Users,
      title: 'تعاون فوري',
      description: 'اعمل مع فريقك في الوقت الفعلي مع إمكانيات التعاون المتقدمة'
    },
    {
      icon: Zap,
      title: 'أداء فائق',
      description: 'محرك رسم محسّن للأداء العالي مع دعم المشاريع الكبيرة'
    },
    {
      icon: Grid3X3,
      title: 'شبكة ذكية ومحاذاة تلقائية',
      description: 'أدوات محاذاة متقدمة مع شبكة قابلة للتخصيص'
    }
  ];

  const tools = [
    { name: 'قلم ذكي', shortcut: 'P' },
    { name: 'أشكال متقدمة', shortcut: 'R/C' },
    { name: 'نصوص تفاعلية', shortcut: 'T' },
    { name: 'ملصقات ذكية', shortcut: 'S' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Palette className="w-8 h-8 text-primary" />
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              مدعوم بالذكاء الاصطناعي
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            لوحة الرسم الذكية
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ابدأ رحلتك الإبداعية مع أدوات رسم متطورة مدعومة بالذكاء الاصطناعي
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 animate-scale-in">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Tools */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <MousePointer className="w-5 h-5" />
              أدوات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tools.map((tool, index) => (
                <div key={index} className="text-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-sm font-medium mb-1">{tool.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {tool.shortcut}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={onStartCanvas}
            className="px-8 py-3 text-lg hover:scale-105 transition-all duration-200 shadow-lg animate-pulse"
          >
            ابدأ الرسم الآن
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-3">
            استخدم الاختصارات السريعة أو انقر لتحديد الأدوات
          </p>
        </div>
      </div>
    </div>
  );
};
