import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, Target, TrendingUp } from 'lucide-react';
import { PlanCreationModal } from './PlanCreationModal';
import { PlanDetailsPanel } from './PlanDetailsPanel';
import { CollaborationPanel } from './CollaborationPanel';

interface PlanningBoardProps {
  selectedPlanId: string | null;
  onPlanSelect: (planId: string | null) => void;
}

interface PlanItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  assignees: string[];
  progress: number;
  tags: string[];
}

export const PlanningBoard: React.FC<PlanningBoardProps> = ({
  selectedPlanId,
  onPlanSelect
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'timeline' | 'table'>('board');
  const [planItems] = useState<PlanItem[]>([
    {
      id: '1',
      title: 'تحليل السوق المستهدف',
      description: 'دراسة شاملة للسوق المستهدف وتحليل المنافسين',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-02-15',
      assignees: ['أحمد محمد', 'فاطمة علي'],
      progress: 65,
      tags: ['تسويق', 'بحوث']
    },
    {
      id: '2',
      title: 'تطوير استراتيجية المحتوى',
      description: 'إنشاء خطة محتوى شاملة لوسائل التواصل الاجتماعي',
      priority: 'medium',
      status: 'planning',
      dueDate: '2024-02-20',
      assignees: ['سارة أحمد'],
      progress: 25,
      tags: ['محتوى', 'وسائل اجتماعية']
    },
    {
      id: '3',
      title: 'إطلاق الحملة الإعلانية',
      description: 'تنفيذ الحملة الإعلانية الرقمية الأولى',
      priority: 'high',
      status: 'review',
      dueDate: '2024-03-01',
      assignees: ['محمد خالد', 'نور الدين'],
      progress: 90,
      tags: ['إعلانات', 'رقمي']
    }
  ]);

  const getPriorityColor = (priority: PlanItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-700 border-green-500/20';
    }
  };

  const getStatusColor = (status: PlanItem['status']) => {
    switch (status) {
      case 'planning': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'review': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-500/20';
    }
  };

  const statusColumns = [
    { id: 'planning', title: 'التخطيط', items: planItems.filter(item => item.status === 'planning') },
    { id: 'in-progress', title: 'قيد التنفيذ', items: planItems.filter(item => item.status === 'in-progress') },
    { id: 'review', title: 'المراجعة', items: planItems.filter(item => item.status === 'review') },
    { id: 'completed', title: 'مكتمل', items: planItems.filter(item => item.status === 'completed') }
  ];

  if (selectedPlanId) {
    return (
      <div className="h-full flex">
        <div className="flex-1">
          <PlanDetailsPanel planId={selectedPlanId} onClose={() => onPlanSelect(null)} />
        </div>
        <div className="w-80 border-l border-border/20">
          <CollaborationPanel planId={selectedPlanId} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة التخطيط التشاركي</h1>
          <p className="text-muted-foreground">إدارة وتتبع الخطط الاستراتيجية بشكل تشاركي</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
            >
              لوحة
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              جدول زمني
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              جدول
            </Button>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            مهمة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{planItems.length}</div>
              <div className="text-sm text-muted-foreground">إجمالي المهام</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(planItems.reduce((acc, item) => acc + item.progress, 0) / planItems.length)}%
              </div>
              <div className="text-sm text-muted-foreground">متوسط التقدم</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {planItems.filter(item => item.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">قيد التنفيذ</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {new Set(planItems.flatMap(item => item.assignees)).size}
              </div>
              <div className="text-sm text-muted-foreground">المتعاونون</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      {viewMode === 'board' && (
        <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden">
          {statusColumns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">{column.title}</h3>
                <Badge variant="outline">{column.items.length}</Badge>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto">
                {column.items.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onPlanSelect(item.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority === 'high' ? 'عالي' : item.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {item.progress}% مكتمل
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.dueDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {item.assignees.length}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      <PlanCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPlanCreated={(plan) => {
          console.log('New plan created:', plan);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};