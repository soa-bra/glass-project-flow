import React, { useState } from 'react';
import { UnifiedTask } from '@/types/task';
import { TaskListCard } from '../cards/TaskListCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Paperclip, MessageSquare, Clock, User, Flag } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TaskDetailsProps {
  selectedTask: UnifiedTask | null;
  onClose: () => void;
  projectId: string;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  selectedTask,
  onClose,
  projectId
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Here you would add the comment to the task
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const mockActivityLog = [
    {
      id: 1,
      action: 'تم إنشاء المهمة',
      user: 'أحمد محمد',
      timestamp: '2024-01-15 10:30',
      type: 'created'
    },
    {
      id: 2,
      action: 'تم تغيير الحالة إلى "قيد التنفيذ"',
      user: 'سارة أحمد',
      timestamp: '2024-01-16 09:15',
      type: 'status_change'
    },
    {
      id: 3,
      action: 'تم إضافة مرفق جديد',
      user: 'محمد علي',
      timestamp: '2024-01-17 14:20',
      type: 'attachment'
    }
  ];

  const mockAttachments = [
    { id: 1, name: 'تصميم الواجهة.pdf', size: '2.4 MB', uploadedBy: 'أحمد محمد', uploadedAt: '2024-01-15' },
    { id: 2, name: 'متطلبات المشروع.docx', size: '1.8 MB', uploadedBy: 'سارة أحمد', uploadedAt: '2024-01-16' }
  ];

  const mockComments = [
    {
      id: 1,
      text: 'تم الانتهاء من مراجعة التصميم الأولي',
      author: 'أحمد محمد',
      timestamp: '2024-01-17 11:30',
      replies: []
    },
    {
      id: 2,
      text: 'يرجى مراجعة الملاحظات المرفقة والتعديل عليها',
      author: 'سارة أحمد',
      timestamp: '2024-01-17 15:45',
      replies: [
        {
          id: 3,
          text: 'تم أخذ الملاحظات في الاعتبار',
          author: 'محمد علي',
          timestamp: '2024-01-18 09:00'
        }
      ]
    }
  ];

  const getPriorityColor = (priority: string): "destructive" | "secondary" | "default" | "outline" => {
    const colors: Record<string, "destructive" | "secondary" | "default" | "outline"> = {
      urgent: 'destructive',
      high: 'secondary',
      medium: 'default',
      low: 'outline'
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      todo: 'bg-gray-100 text-gray-800',
      stopped: 'bg-red-100 text-red-800',
      treating: 'bg-purple-100 text-purple-800',
      late: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!selectedTask) {
    return (
      <div className="flex h-full">
        <div className="w-1/2 border-r">
        <TaskListCard project={{ 
          id: projectId, 
          title: '', 
          description: '', 
          daysLeft: 0,
          tasksCount: 0,
          status: 'info', 
          date: '',
          owner: '',
          value: '',
          isOverBudget: false,
          hasOverdueTasks: false
        }} />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <p className="text-muted-foreground">اختر مهمة لعرض تفاصيلها</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Task List Column */}
      <div className="w-1/2 border-r">
        <TaskListCard project={{ 
          id: projectId, 
          title: '', 
          description: '', 
          daysLeft: 0,
          tasksCount: 0,
          status: 'info', 
          date: '',
          owner: '',
          value: '',
          isOverBudget: false,
          hasOverdueTasks: false
        }} />
      </div>

      {/* Task Details Panel */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">تفاصيل المهمة</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedTask.title}</span>
              <Badge variant={getPriorityColor(selectedTask.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {selectedTask.priority}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedTask.assignee}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(selectedTask.dueDate).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">الحالة:</span>
              <Badge className={getStatusColor(selectedTask.status)}>
                {selectedTask.status}
              </Badge>
            </div>

            {selectedTask.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">الوصف</h4>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">التقدم</span>
              <span className="text-sm font-medium">{selectedTask.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${selectedTask.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">سجل الأنشطة</TabsTrigger>
            <TabsTrigger value="attachments">المرفقات</TabsTrigger>
            <TabsTrigger value="comments">التعليقات</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">سجل الأنشطة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 border-b border-border pb-3 last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.user}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Paperclip className="h-4 w-4 mr-2" />
                  المرفقات ({mockAttachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAttachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {attachment.size} • رفعه {attachment.uploadedBy} • {attachment.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        تحميل
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Paperclip className="h-4 w-4 mr-2" />
                    إضافة مرفق
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  التعليقات ({mockComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <p className="text-sm">{comment.text}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-muted-foreground">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="mr-6 flex items-start space-x-3">
                          <div className="flex-1">
                            <p className="text-sm">{reply.text}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">{reply.author}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Textarea
                      placeholder="اكتب تعليقاً..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setNewComment('')}>
                        إلغاء
                      </Button>
                      <Button size="sm" onClick={handleAddComment}>
                        إضافة تعليق
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};