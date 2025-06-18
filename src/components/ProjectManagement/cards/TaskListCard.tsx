
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Project } from '@/types/project';

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const tasks = [
    {
      id: 1,
      title: 'تصميم الواجهة',
      assignee: 'أحمد محمد',
      daysLeft: 2,
      status: 'in-progress',
      value: '5,000'
    },
    {
      id: 2,
      title: 'كتابة الكود',
      assignee: 'سارة أحمد',
      daysLeft: 5,
      status: 'pending',
      value: '8,000'
    },
    {
      id: 3,
      title: 'تطوير قواعد البيانات',
      assignee: 'محمد علي',
      daysLeft: 1,
      status: 'urgent',
      value: '3,000'
    },
    {
      id: 4,
      title: 'الاختبار والمراجعة',
      assignee: 'فاطمة سالم',
      daysLeft: 7,
      status: 'pending',
      value: '2,000'
    },
    {
      id: 5,
      title: 'التسليم النهائي',
      assignee: 'عمر حسن',
      daysLeft: 10,
      status: 'pending',
      value: '1,000'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'urgent': return 'bg-red-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getDaysColor = (days: number) => {
    if (days <= 1) return 'text-red-600 bg-red-50';
    if (days <= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <BaseCard className="h-full">
      <h3 className="text-lg font-arabic font-semibold mb-4">قائمة المهام</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              {/* دائرة الحالة */}
              <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)} mt-1.5 flex-shrink-0`}></div>
              
              <div className="flex-1 min-w-0">
                {/* العنوان */}
                <h4 className="font-arabic font-semibold text-gray-800 mb-1 truncate">
                  {task.title}
                </h4>
                
                {/* المكلف والقيمة */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-arabic text-gray-600">{task.assignee}</span>
                  <span className="text-sm font-arabic text-gray-700 font-semibold">
                    {task.value} ر.س
                  </span>
                </div>
                
                {/* الأيام المتبقية */}
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-arabic ${getDaysColor(task.daysLeft)}`}>
                  {task.daysLeft === 1 ? 'يوم واحد' : `${task.daysLeft} أيام`} متبقية
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* إجمالي المهام */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm font-arabic">
          <span className="text-gray-600">إجمالي المهام: {tasks.length}</span>
          <span className="text-gray-700 font-semibold">
            {tasks.reduce((sum, task) => sum + parseInt(task.value.replace(/,/g, '')), 0).toLocaleString()} ر.س
          </span>
        </div>
      </div>
    </BaseCard>
  );
};
