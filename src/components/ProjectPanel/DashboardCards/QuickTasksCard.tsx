
import React from 'react';
import { ListTodo, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface QuickTasksCardProps {
  tasks: Task[];
  className?: string;
  onTaskClick?: (taskId: string) => void;
  onViewAll?: () => void;
}

export const QuickTasksCard: React.FC<QuickTasksCardProps> = ({
  tasks,
  className = '',
  onTaskClick,
  onViewAll
}) => {
  const priorityColors = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-amber-600 bg-amber-100',
    low: 'text-gray-600 bg-gray-100'
  };

  const priorityLabels = {
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  // عرض أول 4 مهام فقط
  const displayTasks = tasks.slice(0, 4);

  return (
    <div className={`
      bg-white/40 backdrop-blur-[20px] rounded-[20px] p-5 border border-white/40
      hover:bg-white/50 transition-all duration-300 ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">
          المهام السريعة
        </h3>
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <ListTodo size={16} className="text-purple-600" />
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-3 mb-4">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick?.(task.id)}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/30 hover:bg-white/40 transition-colors cursor-pointer"
          >
            {/* مربع الحالة */}
            <div className={`
              w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5
              ${task.status === 'completed' 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}>
              {task.status === 'completed' && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              )}
            </div>

            {/* محتوى المهمة */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className={`
                  text-sm font-medium text-gray-800 font-arabic line-clamp-2
                  ${task.status === 'completed' ? 'line-through text-gray-500' : ''}
                `}>
                  {task.title}
                </h4>
                
                {/* مؤشر الأولوية */}
                {task.priority === 'high' && (
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                )}
              </div>

              {/* معلومات إضافية */}
              <div className="flex items-center gap-2 mt-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${priorityColors[task.priority]}
                `}>
                  {priorityLabels[task.priority]}
                </span>
                
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* إحصائيات سريعة */}
      <div className="flex items-center justify-between pt-3 border-t border-white/20">
        <div className="text-xs text-gray-600">
          إجمالي المهام: {tasks.length}
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            عرض الكل ←
          </button>
        )}
      </div>

      {/* شريط التقدم السريع */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>التقدم الإجمالي</span>
          <span>{Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
