import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectWidget {
  id: string;
  title: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  team: {
    total: number;
    active: number;
  };
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  csrImpact?: {
    score: number;
    metrics: string[];
  };
}

interface ProjectWidgetsProps {
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  className?: string;
}

export const ProjectWidgets: React.FC<ProjectWidgetsProps> = ({
  onCreateProject,
  onSelectProject,
  className
}) => {
  const [projects] = useState<ProjectWidget[]>([
    {
      id: 'proj-1',
      title: 'حملة التوعية البيئية',
      status: 'in-progress',
      progress: 65,
      budget: { allocated: 50000, spent: 32500, currency: 'ر.س' },
      team: { total: 8, active: 6 },
      deadline: '2024-03-15',
      priority: 'high',
      csrImpact: { score: 85, metrics: ['البيئة', 'المجتمع'] }
    },
    {
      id: 'proj-2',
      title: 'تطوير منصة التعليم الرقمي',
      status: 'planning',
      progress: 15,
      budget: { allocated: 120000, spent: 18000, currency: 'ر.س' },
      team: { total: 12, active: 4 },
      deadline: '2024-06-30',
      priority: 'medium'
    },
    {
      id: 'proj-3',
      title: 'مبادرة دعم المؤسسات الصغيرة',
      status: 'completed',
      progress: 100,
      budget: { allocated: 75000, spent: 73200, currency: 'ر.س' },
      team: { total: 6, active: 2 },
      deadline: '2024-01-30',
      priority: 'high',
      csrImpact: { score: 92, metrics: ['الاقتصاد', 'المجتمع'] }
    }
  ]);

  const getStatusIcon = (status: ProjectWidget['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'on-hold':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ProjectWidget['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ProjectWidget['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">بطاقات المشاريع</h3>
        <Button onClick={onCreateProject} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          مشروع جديد
        </Button>
      </div>

      {/* Project Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
            onClick={() => onSelectProject(project.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base line-clamp-2 mb-2">
                    {project.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <Badge variant="secondary" className={getStatusColor(project.status)}>
                      {project.status === 'in-progress' ? 'قيد التنفيذ' :
                       project.status === 'completed' ? 'مكتمل' :
                       project.status === 'on-hold' ? 'متوقف' : 'التخطيط'}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(project.priority)}>
                      {project.priority === 'high' ? 'عالي' :
                       project.priority === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>التقدم</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Budget */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>الميزانية</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {project.budget.spent.toLocaleString()} / {project.budget.allocated.toLocaleString()} {project.budget.currency}
                  </div>
                  <div className="text-xs text-gray-500">
                    متبقي: {(project.budget.allocated - project.budget.spent).toLocaleString()} {project.budget.currency}
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>الفريق</span>
                </div>
                <div>
                  <span className="font-semibold text-green-600">{project.team.active}</span>
                  <span className="text-gray-500">/{project.team.total}</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>الموعد النهائي</span>
                </div>
                <span className="font-semibold">
                  {new Date(project.deadline).toLocaleDateString('ar-SA')}
                </span>
              </div>

              {/* CSR Impact */}
              {project.csrImpact && (
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>الأثر الاجتماعي</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {project.csrImpact.score}/100
                    </Badge>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {project.csrImpact.metrics.map((metric, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600">إجمالي المشاريع</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">مكتملة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {projects.reduce((sum, p) => sum + p.budget.allocated, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">إجمالي الميزانية (ر.س)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(projects.reduce((sum, p) => sum + (p.csrImpact?.score || 0), 0) / projects.filter(p => p.csrImpact).length) || 0}
              </div>
              <div className="text-sm text-gray-600">متوسط الأثر الاجتماعي</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};