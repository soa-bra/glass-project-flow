import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Users, 
  Target, 
  CheckCircle, 
  Clock,
  MessageSquare,
  FileText,
  Plus
} from 'lucide-react';

interface PlanDetailsPanelProps {
  planId: string;
  onClose: () => void;
}

export const PlanDetailsPanel: React.FC<PlanDetailsPanelProps> = ({
  planId,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'files'>('overview');
  
  // Mock data - in real app this would come from API
  const planData = {
    id: planId,
    title: 'تحليل السوق المستهدف',
    description: 'دراسة شاملة للسوق المستهدف وتحليل المنافسين للربع الأول من 2024',
    priority: 'high' as const,
    status: 'in-progress' as const,
    progress: 65,
    dueDate: '2024-02-15',
    createdDate: '2024-01-10',
    assignees: [
      { id: '1', name: 'أحمد محمد', role: 'محلل أعمال', avatar: 'AM' },
      { id: '2', name: 'فاطمة علي', role: 'باحثة تسويق', avatar: 'FA' }
    ],
    tags: ['تسويق', 'بحوث', 'تحليل'],
    subtasks: [
      { id: '1', title: 'تحليل الجمهور المستهدف', completed: true, assignee: 'أحمد محمد' },
      { id: '2', title: 'دراسة المنافسين المباشرين', completed: true, assignee: 'فاطمة علي' },
      { id: '3', title: 'تحليل الاتجاهات السوقية', completed: false, assignee: 'أحمد محمد' },
      { id: '4', title: 'إعداد التقرير النهائي', completed: false, assignee: 'فاطمة علي' }
    ],
    timeline: [
      { date: '2024-01-10', event: 'بدء المشروع', type: 'start' },
      { date: '2024-01-15', event: 'إكمال تحليل الجمهور', type: 'milestone' },
      { date: '2024-01-20', event: 'إنهاء دراسة المنافسين', type: 'milestone' },
      { date: '2024-02-15', event: 'تسليم التقرير النهائي', type: 'deadline' }
    ],
    files: [
      { id: '1', name: 'تحليل الجمهور المستهدف.pdf', size: '2.3 MB', uploadedBy: 'أحمد محمد', date: '2024-01-15' },
      { id: '2', name: 'دراسة المنافسين.xlsx', size: '1.8 MB', uploadedBy: 'فاطمة علي', date: '2024-01-20' }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-700 border-green-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'review': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-500/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border/20">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            العودة للوحة
          </Button>
          <Button className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            تعديل
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-foreground">{planData.title}</h1>
            <div className="flex gap-2">
              <Badge variant="outline" className={getPriorityColor(planData.priority)}>
                أولوية {planData.priority === 'high' ? 'عالية' : planData.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
              </Badge>
              <Badge variant="outline" className={getStatusColor(planData.status)}>
                {planData.status === 'in-progress' ? 'قيد التنفيذ' : planData.status}
              </Badge>
            </div>
          </div>
          
          <p className="text-muted-foreground">{planData.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              تاريخ الاستحقاق: {planData.dueDate}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {planData.assignees.length} متعاون
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {planData.progress}% مكتمل
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={planData.progress} className="w-full" />
            <div className="text-sm text-muted-foreground text-center">
              {planData.subtasks.filter(task => task.completed).length} من {planData.subtasks.length} مهام مكتملة
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border/20">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: Target },
          { id: 'tasks', label: 'المهام', icon: CheckCircle },
          { id: 'timeline', label: 'الجدول الزمني', icon: Clock },
          { id: 'files', label: 'الملفات', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Assignees */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">فريق العمل</h3>
              <div className="space-y-3">
                {planData.assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {assignee.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{assignee.name}</div>
                      <div className="text-sm text-muted-foreground">{assignee.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">العلامات</h3>
              <div className="flex flex-wrap gap-2">
                {planData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">المهام الفرعية</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                مهمة جديدة
              </Button>
            </div>
            
            <div className="space-y-3">
              {planData.subtasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
                    }`}>
                      {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        مكلف: {task.assignee}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="font-medium">الجدول الزمني</h3>
            <div className="space-y-4">
              {planData.timeline.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    item.type === 'start' ? 'bg-blue-500' :
                    item.type === 'milestone' ? 'bg-green-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.event}</div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">الملفات المرفقة</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                رفع ملف
              </Button>
            </div>
            
            <div className="space-y-3">
              {planData.files.map((file) => (
                <Card key={file.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {file.size} • رفع بواسطة {file.uploadedBy} • {file.date}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">تحميل</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};