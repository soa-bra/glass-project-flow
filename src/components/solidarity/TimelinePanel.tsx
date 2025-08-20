// Timeline Management Panel for Solidarity Planning
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  X,
  Users,
  Target,
  Star
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  assignees: string[];
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

interface TimelinePanelProps {
  isOpen: boolean;
  onClose: () => void;
  'data-test-id'?: string;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({
  isOpen,
  onClose,
  'data-test-id': testId
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'milestones'>('timeline');

  // Mock milestones data
  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'إطلاق حملة التوعية',
      description: 'بدء حملة التوعية المجتمعية حول المبادرة التضامنية',
      dueDate: new Date('2024-01-15'),
      status: 'completed',
      progress: 100,
      assignees: ['أحمد محمد', 'فاطمة علي'],
      priority: 'high'
    },
    {
      id: '2',
      title: 'جمع التبرعات والموارد',
      description: 'تنظيم حملة لجمع التبرعات والموارد اللازمة للمشروع',
      dueDate: new Date('2024-01-30'),
      status: 'in-progress',
      progress: 65,
      assignees: ['عبدالله سعد'],
      priority: 'high'
    },
    {
      id: '3',
      title: 'تدريب المتطوعين',
      description: 'تنظيم دورات تدريبية للمتطوعين المشاركين في المبادرة',
      dueDate: new Date('2024-02-10'),
      status: 'upcoming',
      progress: 0,
      assignees: ['فاطمة علي'],
      priority: 'medium'
    },
    {
      id: '4',
      title: 'التنفيذ الميداني',
      description: 'بدء التنفيذ الفعلي للأنشطة التضامنية في الميدان',
      dueDate: new Date('2024-02-25'),
      status: 'upcoming',
      progress: 0,
      assignees: ['أحمد محمد', 'فاطمة علي', 'عبدالله سعد'],
      priority: 'high'
    },
    {
      id: '5',
      title: 'تقييم النتائج والأثر',
      description: 'تقييم شامل للنتائج المحققة والأثر الاجتماعي للمبادرة',
      dueDate: new Date('2024-03-15'),
      status: 'upcoming',
      progress: 0,
      assignees: ['عبدالله سعد'],
      priority: 'medium'
    }
  ]);

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'upcoming':
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">مكتمل</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">قيد التنفيذ</Badge>;
      case 'overdue':
        return <Badge variant="destructive">متأخر</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">مجدول</Badge>;
    }
  };

  const getPriorityBadge = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">عالية</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">متوسطة</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">منخفضة</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `متأخر ${Math.abs(diffDays)} يوم`;
    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'غداً';
    return `${diffDays} يوم متبقي`;
  };

  if (!isOpen) return null;

  return (
    <Card className="w-80 h-full flex flex-col" data-test-id={testId}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          الجدولة الزمنية
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="mr-auto w-8 h-8 p-0"
            data-test-id="btn-close-panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
        
        <div className="flex gap-1 mt-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-2" />
            الخط الزمني
          </Button>
          <Button
            variant={viewMode === 'milestones' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('milestones')}
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            المعالم
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 pb-4">
            {/* Add Milestone Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
              data-test-id="btn-add-milestone"
            >
              <Plus className="w-4 h-4" />
              إضافة معلم جديد
            </Button>

            {viewMode === 'timeline' ? (
              /* Timeline View */
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute right-6 top-8 bottom-0 w-0.5 bg-border" />
                
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative flex gap-4 pb-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-background bg-background shadow-sm">
                      {getStatusIcon(milestone.status)}
                    </div>
                    
                    {/* Milestone Card */}
                    <Card className="flex-1 p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{milestone.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {milestone.description}
                          </p>
                        </div>
                        {getStatusBadge(milestone.status)}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(milestone.dueDate)}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className={
                          milestone.status === 'overdue' ? 'text-red-600' :
                          milestone.status === 'in-progress' ? 'text-blue-600' :
                          'text-muted-foreground'
                        }>
                          {getDaysUntil(milestone.dueDate)}
                        </span>
                      </div>

                      {milestone.status === 'in-progress' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>التقدم</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <Progress value={milestone.progress} className="h-1" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {milestone.assignees.length} مشارك
                          </span>
                        </div>
                        {getPriorityBadge(milestone.priority)}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              /* Milestones View */
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <Card key={milestone.id} className="p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {getStatusIcon(milestone.status)}
                        <div>
                          <h4 className="font-medium text-sm">{milestone.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(milestone.dueDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {getPriorityBadge(milestone.priority)}
                        {getStatusBadge(milestone.status)}
                      </div>
                    </div>

                    {milestone.status === 'in-progress' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>التقدم</span>
                          <span>{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{milestone.assignees.join(', ')}</span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {milestone.description}
                    </p>
                  </Card>
                ))}
              </div>
            )}

            <Separator />

            {/* Timeline Summary */}
            <Card className="p-3 bg-muted/50">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                ملخص المشروع
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>إجمالي المعالم:</span>
                  <span className="font-medium">{milestones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>مكتملة:</span>
                  <span className="text-green-600 font-medium">
                    {milestones.filter(m => m.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>قيد التنفيذ:</span>
                  <span className="text-blue-600 font-medium">
                    {milestones.filter(m => m.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>مجدولة:</span>
                  <span className="text-gray-600 font-medium">
                    {milestones.filter(m => m.status === 'upcoming').length}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>التقدم الإجمالي</span>
                    <span>{Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length)}%</span>
                  </div>
                  <Progress 
                    value={milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length} 
                    className="h-2" 
                  />
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TimelinePanel;