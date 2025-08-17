import React, { useState } from 'react';
import { UnifiedTask } from '@/types/task';
import { COLORS } from '@/components/shared/design-system/constants';
import { Edit, Archive, Trash2, MessageSquare, Paperclip, Activity, Calendar, User, Tag, Clock, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AddTaskModal } from '@/components/ProjectsColumn/AddTaskModal';
import type { TaskData } from '@/types';
interface TaskDetailsPanelProps {
  task: UnifiedTask;
}
export const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({
  task
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'attachments' | 'comments'>('details');
  const dueDate = new Date(task.dueDate);
  const createdDate = new Date(task.createdAt);
  const updatedDate = new Date(task.updatedAt);
  const statusColorMap = {
    completed: COLORS.TASK_STATUS_COMPLETED,
    'in-progress': COLORS.TASK_STATUS_IN_PROGRESS,
    todo: COLORS.TASK_STATUS_TODO,
    stopped: COLORS.TASK_STATUS_STOPPED,
    treating: COLORS.TASK_STATUS_TREATING,
    late: COLORS.TASK_STATUS_LATE
  };
  const statusTextMap = {
    completed: 'مكتملة',
    'in-progress': 'قيد التنفيذ',
    todo: 'لم تبدأ',
    stopped: 'متوقفة',
    treating: 'تحت المعالجة',
    late: 'متأخرة'
  };
  const priorityMap = {
    urgent: {
      text: 'عاجل جداً',
      color: '#f1b5b9'
    },
    high: {
      text: 'عاجل',
      color: '#fbe2aa'
    },
    medium: {
      text: 'متوسط',
      color: '#a4e2f6'
    },
    low: {
      text: 'منخفض',
      color: '#bdeed3'
    }
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleEdit = () => {
    // Edit task functionality
    setShowEditModal(true);
  };
  const handleArchive = () => {
    // Archive task functionality
    setShowArchiveDialog(true);
  };
  const handleDelete = () => {
    // Delete task functionality
    setShowDeleteDialog(true);
  };
  const confirmArchive = () => {
    // Task archived successfully
    setShowArchiveDialog(false);
  };
  const confirmDelete = () => {
    // Task deleted successfully
    setShowDeleteDialog(false);
  };
  const handleTaskUpdated = (updatedTask: any) => {
    // Task updated successfully
    setShowEditModal(false);
  };

  // تحويل UnifiedTask إلى TaskData
  const convertToTaskData = (unifiedTask: UnifiedTask): TaskData => ({
    id: parseInt(unifiedTask.id.split('-').pop() || '0'),
    title: unifiedTask.title,
    description: unifiedTask.description,
    dueDate: unifiedTask.dueDate,
    assignee: unifiedTask.assignee,
    priority: unifiedTask.priority as TaskData['priority'],
    attachments: [],
    stage: 'planning',
    createdAt: unifiedTask.createdAt
  });
  return <div className="bg-[#F2FFFF] rounded-3xl border border-black/10 h-full flex flex-col">
      {/* Header with actions */}
      <div className="p-6 border-b border-black/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-black mb-2">{task.title}</h2>
            <p className="text-sm text-black/70">{task.description}</p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleEdit} className="flex h-8 items-center rounded-full px-3 py-2 text-sm font-medium text-white whitespace-nowrap">
              <Edit className="w-4 h-4 mr-1" />
              تعديل
            </Button>
            <Button variant="outline" size="sm" onClick={handleArchive} className="flex h-8 items-center rounded-full px-3 py-2 text-sm font-medium text-white whitespace-nowrap">
              <Archive className="w-4 h-4 mr-1 bg-transparent" />
              أرشفة
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="bg-[#f1b5b9] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#f1b5b9]/80 transition-colors">
              <Trash2 className="w-4 h-4 mr-1" />
              حذف
            </Button>
          </div>
        </div>

        {/* Task metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{
            backgroundColor: statusColorMap[task.status]
          }} />
            <span className="text-sm text-black">{statusTextMap[task.status]}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-black/60" />
            <span className="text-sm px-2 py-1 rounded-full" style={{
            backgroundColor: priorityMap[task.priority].color,
            color: '#000'
          }}>
              {priorityMap[task.priority].text}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-black/60" />
            <span className="text-sm text-black">{task.assignee}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-black/60" />
            <span className="text-sm text-black">
              {dueDate.toLocaleDateString('ar-SA')}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {task.progress > 0 && <div className="mt-4">
            <div className="flex justify-between text-sm text-black mb-2">
              <span>التقدم</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-black/10 rounded-full h-2">
              <div className="bg-black h-2 rounded-full transition-all" style={{
            width: `${task.progress}%`
          }} />
            </div>
          </div>}
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-black/10">
        <div className="flex gap-4">
          {[{
          key: 'details',
          label: 'التفاصيل',
          icon: Activity
        }, {
          key: 'activity',
          label: 'سجل الأنشطة',
          icon: Clock
        }, {
          key: 'attachments',
          label: 'المرفقات',
          icon: Paperclip
        }, {
          key: 'comments',
          label: 'التعليقات',
          icon: MessageSquare
        }].map(tab => {
          const Icon = tab.icon;
          return <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>;
        })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'details' && <TaskDetailsTab task={task} />}
        
        {activeTab === 'activity' && <TaskActivityTab task={task} />}
        
        {activeTab === 'attachments' && <TaskAttachmentsTab task={task} />}
        
        {activeTab === 'comments' && <TaskCommentsTab task={task} />}
      </div>
      
      {/* حوارات التأكيد والنوافذ */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="font-arabic" style={{
        direction: 'rtl'
      }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الأرشفة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد أرشفة هذه المهمة؟ يمكنك استعادتها لاحقاً من الأرشيف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive}>أرشفة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="font-arabic" style={{
        direction: 'rtl'
      }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد حذف هذه المهمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddTaskModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onTaskAdded={() => {}} onTaskUpdated={handleTaskUpdated} editingTask={convertToTaskData(task)} isEditMode={true} />
    </div>;
};

// Tab Components
const TaskDetailsTab: React.FC<{
  task: UnifiedTask;
}> = ({
  task
}) => {
  const createdDate = new Date(task.createdAt);
  const updatedDate = new Date(task.updatedAt);
  return <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-black mb-3">معلومات المهمة</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-black/60">تاريخ الإنشاء:</span>
            <p className="text-black">{createdDate.toLocaleDateString('ar-SA')}</p>
          </div>
          <div>
            <span className="text-black/60">آخر تحديث:</span>
            <p className="text-black">{updatedDate.toLocaleDateString('ar-SA')}</p>
          </div>
          <div>
            <span className="text-black/60">المرفقات:</span>
            <p className="text-black">{task.attachments} ملف</p>
          </div>
          <div>
            <span className="text-black/60">التعليقات:</span>
            <p className="text-black">{task.comments} تعليق</p>
          </div>
        </div>
      </div>

      {task.tags.length > 0 && <div>
          <h4 className="text-sm font-semibold text-black mb-3">العلامات</h4>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => <BaseBadge key={index} variant="secondary" className="bg-black/10 text-black">
                {tag}
              </BaseBadge>)}
          </div>
        </div>}

      {task.linkedTasks.length > 0 && <div>
          <h4 className="text-sm font-semibold text-black mb-3">المهام المرتبطة</h4>
          <div className="space-y-2">
            {task.linkedTasks.map(taskId => <div key={taskId} className="text-sm text-black/70 p-2 bg-black/5 rounded-lg">
                مهمة #{taskId.split('-').pop()}
              </div>)}
          </div>
        </div>}
    </div>;
};
const TaskActivityTab: React.FC<{
  task: UnifiedTask;
}> = ({
  task
}) => {
  const activities = [{
    time: '2024-01-15 14:30',
    action: 'تم إنشاء المهمة',
    user: 'النظام'
  }, {
    time: '2024-01-16 09:15',
    action: 'تم تعيين المهمة للمطور',
    user: 'مدير المشروع'
  }, {
    time: '2024-01-17 11:45',
    action: 'تم بدء العمل على المهمة',
    user: task.assignee
  }, {
    time: '2024-01-18 16:20',
    action: 'تم رفع تقدم 25%',
    user: task.assignee
  }];
  return <div className="space-y-4">
      <h4 className="text-sm font-semibold text-black">سجل الأنشطة</h4>
      <div className="space-y-3">
        {activities.map((activity, index) => <div key={index} className="flex gap-3 p-3 bg-white/50 rounded-lg">
            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-black">{activity.action}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-black/60">
                <span>{activity.user}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
const TaskAttachmentsTab: React.FC<{
  task: UnifiedTask;
}> = ({
  task
}) => {
  const [attachments, setAttachments] = useState(Array.from({
    length: task.attachments
  }, (_, i) => ({
    id: i + 1,
    name: `مرفق_${i + 1}.pdf`,
    size: '2.5 MB',
    uploadedAt: '2024-01-15'
  })));
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);
  const handleAddAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newAttachments = Array.from(files).map((file, index) => ({
          id: attachments.length + index + 1,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: new Date().toISOString().split('T')[0]
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    };
    input.click();
  };
  const handleDeleteAttachment = (id: number) => {
    setAttachments(attachments.filter(att => att.id !== id));
    setShowDeleteDialog(null);
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-black">المرفقات ({attachments.length})</h4>
        <Button size="sm" className="bg-black text-white hover:bg-black/80" onClick={handleAddAttachment}>
          <Upload className="w-4 h-4 mr-1" />
          إضافة مرفق
        </Button>
      </div>
      
      {attachments.length > 0 ? <div className="space-y-2">
          {attachments.map(attachment => <div key={attachment.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                <Paperclip className="w-5 h-5 text-black/60" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black">{attachment.name}</p>
                <p className="text-xs text-black/60">{attachment.size} • {attachment.uploadedAt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  تحميل
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(attachment.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>)}
        </div> : <div className="text-center text-black/50 py-8">
          <Paperclip className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>لا توجد مرفقات</p>
        </div>}

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent className="font-arabic" style={{
        direction: 'rtl'
      }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد حذف هذا المرفق؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => showDeleteDialog && handleDeleteAttachment(showDeleteDialog)} className="bg-red-600 hover:bg-red-700">
              حذف المرفق
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
const TaskCommentsTab: React.FC<{
  task: UnifiedTask;
}> = ({
  task
}) => {
  const [comments, setComments] = useState(Array.from({
    length: task.comments
  }, (_, i) => ({
    id: i + 1,
    author: i % 2 === 0 ? task.assignee : 'مدير المشروع',
    content: `تعليق رقم ${i + 1} على هذه المهمة. يمكن أن يكون هذا التعليق طويلاً ويحتوي على تفاصيل مهمة حول المهمة.`,
    time: `منذ ${i + 1} ساعات`
  })));
  const [newComment, setNewComment] = useState('');
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'المستخدم الحالي',
        content: newComment.trim(),
        time: 'الآن'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-black">التعليقات ({comments.length})</h4>
      </div>
      
      {/* Add comment form */}
      <div className="bg-white/50 rounded-lg p-4">
        <textarea placeholder="أضف تعليقاً جديداً..." className="w-full bg-transparent border border-black/10 rounded-lg p-3 text-sm text-black resize-none" rows={3} value={newComment} onChange={e => setNewComment(e.target.value)} />
        <div className="flex justify-end mt-2">
          <Button size="sm" className="bg-black text-white hover:bg-black/80" onClick={handleAddComment} disabled={!newComment.trim()}>
            <MessageSquare className="w-4 h-4 mr-1" />
            إضافة تعليق
          </Button>
        </div>
      </div>
      
      {/* Comments list */}
      {comments.length > 0 ? <div className="space-y-3">
          {comments.map(comment => <div key={comment.id} className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-black/10 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-black/60" />
                </div>
                <span className="text-sm font-medium text-black">{comment.author}</span>
                <span className="text-xs text-black/60">•</span>
                <span className="text-xs text-black/60">{comment.time}</span>
              </div>
              <p className="text-sm text-black/80">{comment.content}</p>
            </div>)}
        </div> : <div className="text-center text-black/50 py-8">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>لا توجد تعليقات</p>
        </div>}
    </div>;
};