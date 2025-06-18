
import React from 'react';

interface TaskListCardProps {
  project: any;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const tasks = [
    {
      id: 1,
      title: 'تصميم الواجهة',
      assignee: 'تطوير موقع سوريا',
      day: '01',
      month: 'مايو',
      status: 'completed',
      priority: 'urgent'
    },
    {
      id: 2,
      title: 'كتابة الكود',
      assignee: 'تطوير موقع سوريا',
      day: '01',
      month: 'مايو',
      status: 'in-progress',
      priority: 'normal'
    },
    {
      id: 3,
      title: 'تطوير قواعد البيانات',
      assignee: 'تطوير موقع سوريا',
      day: '01',
      month: 'يونيو',
      status: 'pending',
      priority: 'urgent'
    },
    {
      id: 4,
      title: 'التسليم',
      assignee: 'تسليم الموقع النهائي',
      day: '01',
      month: 'يوليو',
      status: 'pending',
      priority: 'urgent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full bg-white/60 backdrop-blur-[20px] rounded-2xl p-4 border border-white/30 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-semibold">قائمة المهام</h3>
        <div className="flex gap-1">
          <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">+</button>
          <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">+</button>
          <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">•••</button>
        </div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className="bg-gray-50/50 rounded-xl p-3 border border-gray-100"
          >
            <div className="flex items-start gap-3">
              {/* التاريخ */}
              <div className="text-center flex-shrink-0">
                <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{task.day}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{task.month}</div>
              </div>
              
              <div className="flex-1 min-w-0">
                {/* العنوان */}
                <h4 className="font-arabic font-semibold text-gray-800 mb-1">
                  {task.title}
                </h4>
                
                {/* الوصف */}
                <p className="text-sm font-arabic text-gray-600 mb-2">{task.assignee}</p>
                
                {/* الحالة والأولوية */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
                    <span className="text-xs text-gray-500">وفق الخطة</span>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'urgent' ? 'عاجل' : 'عادي'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
