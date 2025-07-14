import React, { useState } from 'react';
import { TaskListContent } from '../cards/TaskList/TaskListContent';
import { TaskFilters } from './TaskFilters';
import { Project } from '@/types/project';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskFilters as UnifiedTaskFilters, UnifiedTask } from '@/types/task';
import { Edit, Archive, Trash2, FileText, MessageSquare, Paperclip, Clock, User, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TaskDetailsProps {
  project: Project;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ project }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filters, setFilters] = useState<UnifiedTaskFilters>({
    assignee: '',
    priority: '',
    status: '',
    search: ''
  });
  
  const { tasks } = useUnifiedTasks(project.id);
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'late': return 'bg-red-100 text-red-800';
      case 'stopped': return 'bg-orange-100 text-orange-800';
      case 'treating': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mockActivityLog = [
    { id: 1, action: 'تم إنشاء المهمة', user: 'أحمد محمد', timestamp: '2024-01-15 09:30', icon: FileText },
    { id: 2, action: 'تم تغيير الحالة إلى "قيد التنفيذ"', user: 'سارة أحمد', timestamp: '2024-01-16 14:20', icon: Tag },
    { id: 3, action: 'تم إضافة تعليق جديد', user: 'محمد علي', timestamp: '2024-01-17 11:45', icon: MessageSquare },
    { id: 4, action: 'تم رفع مرفق جديد', user: 'فاطمة خالد', timestamp: '2024-01-18 16:10', icon: Paperclip },
  ];

  const mockAttachments = [
    { id: 1, name: 'تصميم الواجهة.pdf', size: '2.4 MB', uploadedBy: 'أحمد محمد', uploadedAt: '2024-01-15' },
    { id: 2, name: 'مواصفات المشروع.docx', size: '1.8 MB', uploadedBy: 'سارة أحمد', uploadedAt: '2024-01-16' },
    { id: 3, name: 'الشعار الجديد.png', size: '854 KB', uploadedBy: 'محمد علي', uploadedAt: '2024-01-17' },
  ];

  const mockComments = [
    { id: 1, user: 'أحمد محمد', avatar: '👨‍💼', comment: 'تم البدء في المهمة بنجاح. سأحتاج إلى مراجعة المواصفات مع الفريق.', timestamp: '2024-01-15 10:30' },
    { id: 2, user: 'سارة أحمد', avatar: '👩‍💻', comment: 'ممتاز! تم تحديث التصميم وفقاً للملاحظات المطلوبة.', timestamp: '2024-01-16 15:45' },
    { id: 3, user: 'محمد علي', avatar: '👨‍🎨', comment: 'يرجى مراجعة التصميم الجديد المرفق والموافقة عليه.', timestamp: '2024-01-17 12:20' },
  ];

  return (
    <div className="flex gap-6 h-full">
      {/* قائمة المهام - العمود الأيسر */}
      <div className="w-1/3 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-black mb-4">قائمة المهام</h3>
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="space-y-3 overflow-y-auto h-full">
            {tasks.filter(task => {
              const matchesSearch = !filters.search || 
                task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.description.toLowerCase().includes(filters.search.toLowerCase());
              const matchesStatus = !filters.status || task.status === filters.status;
              const matchesPriority = !filters.priority || task.priority === filters.priority;
              const matchesAssignee = !filters.assignee || task.assignee?.includes(filters.assignee);
              
              return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
            }).map(task => (
              <Card 
                key={task.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTaskId === task.id ? 'ring-2 ring-black' : ''
                }`}
                onClick={() => handleTaskSelect(task.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-black truncate flex-1">{task.title}</h4>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === 'completed' ? 'مكتملة' :
                       task.status === 'in-progress' ? 'قيد التنفيذ' :
                       task.status === 'todo' ? 'مجدولة' :
                       task.status === 'late' ? 'متأخرة' :
                       task.status === 'stopped' ? 'متوقفة' :
                       task.status === 'treating' ? 'تحت المعالجة' : task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-2">{task.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>الأولوية: {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</span>
                    <span>{task.progress}% مكتمل</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* تفاصيل المهمة - العمود الأيمن */}
      <div className="flex-1 overflow-auto">
        {selectedTask ? (
          <div className="space-y-6">
            {/* رأس تفاصيل المهمة */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-black">{selectedTask.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      تعديل المهمة
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4 mr-2" />
                      أرشفة المهمة
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف المهمة
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{selectedTask.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-xs text-gray-500">الحالة</span>
                      <Badge className={`block mt-1 ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status === 'completed' ? 'مكتملة' :
                         selectedTask.status === 'in-progress' ? 'قيد التنفيذ' :
                         selectedTask.status === 'todo' ? 'مجدولة' :
                         selectedTask.status === 'late' ? 'متأخرة' :
                         selectedTask.status === 'stopped' ? 'متوقفة' :
                         selectedTask.status === 'treating' ? 'تحت المعالجة' : selectedTask.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-xs text-gray-500">الأولوية</span>
                      <Badge className={`block mt-1 ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority === 'high' ? 'عالية' : 
                         selectedTask.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-xs text-gray-500">المسؤول</span>
                      <p className="text-sm font-medium">{selectedTask.assignee || 'غير محدد'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-xs text-gray-500">نسبة الإنجاز</span>
                      <p className="text-sm font-medium">{selectedTask.progress}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* سجل الأنشطة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  سجل الأنشطة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivityLog.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black">{activity.action}</p>
                          <p className="text-xs text-gray-500">بواسطة {activity.user} • {activity.timestamp}</p>
                        </div>
                        {index < mockActivityLog.length - 1 && (
                          <div className="absolute right-4 mt-8 w-px h-6 bg-gray-200" style={{marginRight: '15px'}}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* المرفقات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  المرفقات ({mockAttachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAttachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.size} • {attachment.uploadedBy} • {attachment.uploadedAt}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">تحميل</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* التعليقات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  التعليقات ({mockComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockComments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-black">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                      👤
                    </div>
                    <div className="flex-1">
                      <textarea 
                        placeholder="اكتب تعليقك هنا..."
                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm">إضافة تعليق</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">اختر مهمة لعرض تفاصيلها</p>
              <p className="text-sm">انقر على أي مهمة من القائمة للاطلاع على تفاصيلها الكاملة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};