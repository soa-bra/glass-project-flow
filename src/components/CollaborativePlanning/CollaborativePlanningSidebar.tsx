import React, { useState } from 'react';
import { Plus, Users, Bot, Link2, BarChart3, Calendar, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Plan {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'on-hold';
  collaborators: number;
  lastUpdated: string;
  aiSuggestions: number;
}

interface CollaborativePlanningSidebarProps {
  activeView: 'planning' | 'ai' | 'integration' | 'analytics';
  onViewChange: (view: 'planning' | 'ai' | 'integration' | 'analytics') => void;
  selectedPlanId: string | null;
  onPlanSelect: (planId: string | null) => void;
}

export const CollaborativePlanningSidebar: React.FC<CollaborativePlanningSidebarProps> = ({
  activeView,
  onViewChange,
  selectedPlanId,
  onPlanSelect
}) => {
  const [plans] = useState<Plan[]>([
    {
      id: '1',
      title: 'خطة التسويق الرقمي Q1',
      description: 'استراتيجية شاملة للتسويق الرقمي للربع الأول',
      status: 'active',
      collaborators: 5,
      lastUpdated: '2024-01-20',
      aiSuggestions: 3
    },
    {
      id: '2',
      title: 'تطوير المنتج الجديد',
      description: 'خارطة طريق تطوير المنتج للسنة القادمة',
      status: 'draft',
      collaborators: 8,
      lastUpdated: '2024-01-19',
      aiSuggestions: 7
    },
    {
      id: '3',
      title: 'خطة التوسع الإقليمي',
      description: 'استراتيجية دخول أسواق جديدة',
      status: 'on-hold',
      collaborators: 3,
      lastUpdated: '2024-01-18',
      aiSuggestions: 2
    }
  ]);

  const getStatusColor = (status: Plan['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'draft': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'on-hold': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusText = (status: Plan['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'draft': return 'مسودة';
      case 'completed': return 'مكتمل';
      case 'on-hold': return 'معلق';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border/20">
        <h2 className="text-xl font-bold text-foreground mb-4">التخطيط التشاركي</h2>
        
        {/* View Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant={activeView === 'planning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('planning')}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            الخطط
          </Button>
          <Button
            variant={activeView === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('ai')}
            className="flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            الذكاء الاصطناعي
          </Button>
          <Button
            variant={activeView === 'integration' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('integration')}
            className="flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            التكاملات
          </Button>
          <Button
            variant={activeView === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            التحليلات
          </Button>
        </div>

        {/* New Plan Button */}
        <Button className="w-full" onClick={() => onPlanSelect(null)}>
          <Plus className="w-4 h-4 mr-2" />
          خطة جديدة
        </Button>
      </div>

      {/* Plans List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedPlanId === plan.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onPlanSelect(plan.id)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm text-foreground line-clamp-2">
                  {plan.title}
                </h3>
                <Badge variant="outline" className={getStatusColor(plan.status)}>
                  {getStatusText(plan.status)}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {plan.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {plan.collaborators}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {plan.lastUpdated}
                </div>
                {plan.aiSuggestions > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Lightbulb className="w-3 h-3" />
                    {plan.aiSuggestions}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">{plans.length}</div>
            <div className="text-xs text-muted-foreground">إجمالي الخطط</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">
              {plans.filter(p => p.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">خطط نشطة</div>
          </div>
        </div>
      </div>
    </div>
  );
};