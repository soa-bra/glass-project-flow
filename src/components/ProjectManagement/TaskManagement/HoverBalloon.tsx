import React from 'react';
import { X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  tags: string[];
  attachments: number;
  comments: number;
  linkedTasks: string[];
}

interface HoverBalloonProps {
  task: Task;
  onClose: () => void;
}

export const HoverBalloon: React.FC<HoverBalloonProps> = ({ task, onClose }) => {
  // Mock project phase data
  const projectPhase = "المراجعة النهائية";
  
  // Mock card logs
  const cardLogs = [
    { timestamp: "2024-01-22 14:30", action: "تم تحديث الحالة إلى 'قيد التنفيذ'", user: "أحمد محمد" },
    { timestamp: "2024-01-22 10:15", action: "تم إضافة تعليق جديد", user: "فاطمة علي" },
    { timestamp: "2024-01-21 16:45", action: "تم رفع ملف مرفق", user: "محمد خالد" }
  ];

  // Mock linked tasks
  const linkedTasksDetails = [
    { id: "2", title: "إعداد قاعدة البيانات", status: "done" },
    { id: "3", title: "تطوير API المصادقة", status: "in-progress" }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done': return 'مكتمل';
      case 'in-progress': return 'قيد التنفيذ';
      case 'pending': return 'في الانتظار';
      default: return 'متوقف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return '#bdeed3';
      case 'in-progress': return '#a4e2f6';
      case 'pending': return '#dfecf2';
      default: return '#f1b5b9';
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white/90 backdrop-blur-md border border-black/10 rounded-3xl shadow-xl z-20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-black">تفاصيل المهمة</h4>
        <button 
          onClick={onClose}
          className="rounded-full bg-transparent hover:bg-black/5 border border-black w-8 h-8 flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none"
          aria-label="إغلاق"
        >
          <X className="text-black" size={18} />
        </button>
      </div>

      {/* Project Phase */}
      <div className="mb-4">
        <h5 className="text-xs font-bold text-black mb-2">مرحلة المشروع</h5>
        <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
          <span className="text-xs font-medium text-black">{projectPhase}</span>
        </div>
      </div>

      {/* Card Logs */}
      <div className="mb-4">
        <h5 className="text-xs font-bold text-black mb-2">سجل النشاط</h5>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {cardLogs.map((log, index) => (
            <div key={index} className="text-xs">
              <div className="font-normal text-black">{log.action}</div>
              <div className="font-normal text-gray-400">
                {log.user} - {new Date(log.timestamp).toLocaleString('ar-SA')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Tasks */}
      {linkedTasksDetails.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs font-bold text-black mb-2">المهام المرتبطة</h5>
          <div className="space-y-2">
            {linkedTasksDetails.map(linkedTask => (
              <div key={linkedTask.id} className="flex items-center justify-between">
                <span className="text-xs font-normal text-black truncate flex-1">
                  {linkedTask.title}
                </span>
                <div 
                  className="px-2 py-1 rounded-full ml-2"
                  style={{ backgroundColor: getStatusColor(linkedTask.status) }}
                >
                  <span className="text-xs font-medium text-black">
                    {getStatusText(linkedTask.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button className="flex-1 bg-black text-white px-3 py-2 rounded-full text-xs font-medium hover:bg-black/80 transition-colors">
          فتح التفاصيل
        </button>
        <button className="px-3 py-2 bg-transparent border border-black/10 text-black rounded-full text-xs font-medium hover:bg-black/5 transition-colors">
          تعديل
        </button>
      </div>
    </div>
  );
};