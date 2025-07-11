import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Sparkles, 
  Brain, 
  Target, 
  Users, 
  Calendar, 
  Presentation,
  BookOpen,
  Workflow,
  TrendingUp,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface SmartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'creative' | 'educational' | 'research';
  icon: any;
  aiGenerated: boolean;
  usageCount: number;
  effectiveness: number;
  preview: string;
}

const mockTemplates: SmartTemplate[] = [
  {
    id: '1',
    name: 'خطة المشروع الذكية',
    description: 'قالب متقدم لتخطيط المشاريع مع ربط المهام والمواعيد',
    category: 'business',
    icon: Target,
    aiGenerated: true,
    usageCount: 156,
    effectiveness: 94,
    preview: 'هيكل تفاعلي مع خط زمني وتوزيع المهام'
  },
  {
    id: '2', 
    name: 'جلسة العصف الذهني',
    description: 'تصميم محفز للإبداع مع أدوات التفكير البصري',
    category: 'creative',
    icon: Lightbulb,
    aiGenerated: true,
    usageCount: 89,
    effectiveness: 87,
    preview: 'خريطة ذهنية تفاعلية مع أدوات الربط'
  },
  {
    id: '3',
    name: 'تحليل البيانات التفاعلي',
    description: 'عرض البيانات بطريقة بصرية وتفاعلية',
    category: 'research',
    icon: BarChart3,
    aiGenerated: false,
    usageCount: 203,
    effectiveness: 91,
    preview: 'رسوم بيانية ذكية مع ربط المصادر'
  },
  {
    id: '4',
    name: 'خطة التعلم الشخصية',
    description: 'مسار تعليمي مخصص مع متابعة التقدم',
    category: 'educational', 
    icon: BookOpen,
    aiGenerated: true,
    usageCount: 67,
    effectiveness: 88,
    preview: 'مسار تدريجي مع نقاط التحقق والأهداف'
  },
  {
    id: '5',
    name: 'تدفق العمل الأمثل',
    description: 'تحسين العمليات باستخدام الذكاء الاصطناعي',
    category: 'business',
    icon: Workflow,
    aiGenerated: true,
    usageCount: 134,
    effectiveness: 96,
    preview: 'مخطط انسيابي ذكي مع نقاط التحسين'
  }
];

interface SmartTemplatesProps {
  onSelectTemplate: (template: SmartTemplate) => void;
}

export const SmartTemplates: React.FC<SmartTemplatesProps> = ({ onSelectTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'الكل', count: mockTemplates.length },
    { id: 'business', label: 'الأعمال', count: mockTemplates.filter(t => t.category === 'business').length },
    { id: 'creative', label: 'الإبداع', count: mockTemplates.filter(t => t.category === 'creative').length },
    { id: 'educational', label: 'التعليم', count: mockTemplates.filter(t => t.category === 'educational').length },
    { id: 'research', label: 'البحث', count: mockTemplates.filter(t => t.category === 'research').length }
  ];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return Target;
      case 'creative': return Lightbulb;
      case 'educational': return BookOpen;
      case 'research': return BarChart3;
      default: return Sparkles;
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return 'text-green-600';
    if (effectiveness >= 80) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          القوالب الذكية
          <Badge variant="secondary" className="mr-auto">
            {filteredTemplates.length} قالب
          </Badge>
        </CardTitle>
        
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث في القوالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredTemplates.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد قوالب تطابق البحث</p>
              </div>
            ) : (
              filteredTemplates.map(template => {
                const Icon = template.icon;
                const CategoryIcon = getCategoryIcon(template.category);
                
                return (
                  <Card 
                    key={template.id} 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          {template.aiGenerated && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              <Brain className="w-3 h-3 mr-1" />
                              ذكي
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {template.description}
                        </p>
                        
                        <p className="text-xs text-primary/80 mb-3 italic">
                          {template.preview}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CategoryIcon className="w-3 h-3" />
                            <span className="capitalize">{template.category}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{template.usageCount} استخدام</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`w-3 h-3 ${getEffectivenessColor(template.effectiveness)}`} />
                            <span className={getEffectivenessColor(template.effectiveness)}>
                              {template.effectiveness}% فعالية
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};