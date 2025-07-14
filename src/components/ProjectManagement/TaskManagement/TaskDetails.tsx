import React from 'react';
import { X, Calendar, User, Tag, Paperclip, MessageSquare, Clock, Activity } from 'lucide-react';
import { UnifiedTask } from '@/types/task';
import TaskCard from '@/components/TaskCard';
import { mapToTaskCardProps } from '@/types/task';

interface TaskDetailsProps {
  task: UnifiedTask;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task, isOpen, onClose }) => {
  if (!isOpen) return null;

  const taskCardProps = mapToTaskCardProps(task);

  // Mock activity log data
  const activityLog = [
    {
      id: 1,
      action: 'تم إنشاء المهمة',
      user: task.assignee,
      timestamp: new Date(task.createdAt).toLocaleString('ar-SA'),
      type: 'created'
    },
    {
      id: 2,
      action: 'تم تعيين المهمة',
      user: task.assignee,
      timestamp: new Date(task.createdAt).toLocaleString('ar-SA'),
      type: 'assigned'
    },
    {
      id: 3,
      action: 'تم تحديث الحالة إلى "قيد التنفيذ"',
      user: task.assignee,
      timestamp: new Date(task.updatedAt).toLocaleString('ar-SA'),
      type: 'status_changed'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'assigned':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'status_changed':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F2FFFF] rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-black/10">
        {/* Header */}
        <div className="p-6 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">تفاصيل المهمة</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {/* Task Card Column */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">معلومات المهمة</h3>
            <div className="max-w-sm">
              <TaskCard
                {...taskCardProps}
                isSelected={false}
                isSelectionMode={false}
              />
            </div>

            {/* Task Metadata */}
            <div className="mt-6 space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-black/10">
                <h4 className="font-semibold text-black mb-3">معلومات إضافية</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">تاريخ الإنشاء:</span>
                    <span className="text-black">{new Date(task.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">التصنيفات:</span>
                    <span className="text-black">{task.tags.join(', ') || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">المرفقات:</span>
                    <span className="text-black">{task.attachments} ملف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">التعليقات:</span>
                    <span className="text-black">{task.comments} تعليق</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white rounded-2xl p-4 border border-black/10">
                <h4 className="font-semibold text-black mb-3">نسبة الإنجاز</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{task.progress}% مكتمل</p>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">سجل الأنشطة</h3>
            <div className="bg-white rounded-2xl p-4 border border-black/10">
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{activity.action}</p>
                      <p className="text-xs text-gray-600">بواسطة {activity.user}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments Section */}
            <div className="mt-6">
              <h4 className="font-semibold text-black mb-3">المرفقات</h4>
              <div className="bg-white rounded-2xl p-4 border border-black/10">
                {task.attachments > 0 ? (
                  <div className="space-y-2">
                    {Array.from({ length: task.attachments }, (_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-black">ملف مرفق {i + 1}.pdf</span>
                        <span className="text-xs text-gray-500 ml-auto">2.5 MB</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">لا توجد مرفقات</p>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h4 className="font-semibold text-black mb-3">التعليقات</h4>
              <div className="bg-white rounded-2xl p-4 border border-black/10">
                {task.comments > 0 ? (
                  <div className="space-y-3">
                    {Array.from({ length: task.comments }, (_, i) => (
                      <div key={i} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-black">{task.assignee}</span>
                          <span className="text-xs text-gray-500">منذ {i + 1} ساعة</span>
                        </div>
                        <p className="text-sm text-gray-700">هذا تعليق تجريبي على المهمة...</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">لا توجد تعليقات</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};