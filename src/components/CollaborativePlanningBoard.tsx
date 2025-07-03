import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  Users, 
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

const CollaborativePlanningBoard: React.FC = () => {
  const [activeView, setActiveView] = useState('kanban');

  const planningColumns = [
    {
      id: 'backlog',
      title: 'المهام المطلوبة',
      color: 'bg-gray-100',
      tasks: [
        {
          id: '1',
          title: 'تحليل متطلبات المشروع',
          description: 'دراسة وتحليل جميع متطلبات المشروع الجديد',
          assignee: 'أحمد محمد',
          priority: 'high',
          dueDate: '2024-01-15',
          tags: ['تحليل', 'متطلبات']
        },
        {
          id: '2',
          title: 'إعداد التقرير الشهري',
          description: 'تجميع البيانات وإعداد التقرير الشهري للإدارة',
          assignee: 'فاطمة أحمد',
          priority: 'medium',
          dueDate: '2024-01-20',
          tags: ['تقرير', 'بيانات']
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'قيد التنفيذ',
      color: 'bg-blue-100',
      tasks: [
        {
          id: '3',
          title: 'تطوير واجهة المستخدم',
          description: 'تصميم وتطوير واجهة المستخدم الجديدة',
          assignee: 'خالد سالم',
          priority: 'high',
          dueDate: '2024-01-18',
          tags: ['تطوير', 'واجهة']
        }
      ]
    },
    {
      id: 'review',
      title: 'تحت المراجعة',
      color: 'bg-yellow-100',
      tasks: [
        {
          id: '4',
          title: 'مراجعة الكود البرمجي',
          description: 'مراجعة وفحص الكود البرمجي للوحدة الجديدة',
          assignee: 'سارة علي',
          priority: 'medium',
          dueDate: '2024-01-12',
          tags: ['مراجعة', 'كود']
        }
      ]
    },
    {
      id: 'completed',
      title: 'مكتملة',
      color: 'bg-green-100',
      tasks: [
        {
          id: '5',
          title: 'إعداد قاعدة البيانات',
          description: 'تصميم وإعداد قاعدة البيانات للمشروع',
          assignee: 'محمد حسن',
          priority: 'high',
          dueDate: '2024-01-10',
          tags: ['قاعدة بيانات', 'تصميم']
        }
      ]
    }
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-arabic">
            لوحة التخطيط التشاركي
          </h1>
          <p className="text-muted-foreground font-arabic mt-1">
            إدارة ومتابعة المهام والمشاريع بشكل تشاركي
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 ml-2" />
            عرض التقويم
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 ml-2" />
            مهمة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4">
        <BaseCard size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">24</div>
          <div className="text-xs text-muted-foreground font-arabic">إجمالي المهام</div>
        </BaseCard>
        
        <BaseCard size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">8</div>
          <div className="text-xs text-muted-foreground font-arabic">قيد التنفيذ</div>
        </BaseCard>
        
        <BaseCard size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">12</div>
          <div className="text-xs text-muted-foreground font-arabic">مكتملة</div>
        </BaseCard>
        
        <BaseCard size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">6</div>
          <div className="text-xs text-muted-foreground font-arabic">أعضاء الفريق</div>
        </BaseCard>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <div className="flex gap-6 h-full min-w-max">
          {planningColumns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <BaseCard className="h-full flex flex-col">
                {/* Column Header */}
                <div className={`${column.color} rounded-t-lg p-4 flex items-center justify-between`}>
                  <h3 className="font-semibold text-foreground font-arabic">
                    {column.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks.length}
                  </Badge>
                </div>
                
                {/* Tasks */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {column.tasks.map((task) => (
                    <BaseCard key={task.id} size="sm" className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        {/* Task Header */}
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-foreground font-arabic text-sm leading-tight">
                            {task.title}
                          </h4>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Task Description */}
                        <p className="text-xs text-muted-foreground font-arabic line-clamp-2">
                          {task.description}
                        </p>
                        
                        {/* Task Meta */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {getPriorityIcon(task.priority)}
                            <span className="text-muted-foreground font-arabic">
                              {task.assignee}
                            </span>
                          </div>
                          <div className="text-muted-foreground font-arabic">
                            {task.dueDate}
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs font-arabic">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </BaseCard>
                  ))}
                  
                  {/* Add Task Button */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-foreground border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مهمة
                  </Button>
                </div>
              </BaseCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaborativePlanningBoard;