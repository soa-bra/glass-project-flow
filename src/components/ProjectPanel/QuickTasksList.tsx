
import React from 'react';
import { CheckCircle, Circle, Clock, ArrowLeft } from 'lucide-react';
import { TaskData } from './types';

interface QuickTasksListProps {
  tasks: TaskData[];
  onViewAllTasks: () => void;
  onTaskClick: (taskId: string) => void;
}

export const QuickTasksList: React.FC<QuickTasksListProps> = ({
  tasks,
  onViewAllTasks,
  onTaskClick
}) => {
  const getStatusIcon = (status: TaskData['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in_progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'blocked':
        return <Circle size={16} className="text-red-500" />;
      default:
        return <Circle size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: TaskData['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-r-red-500';
      case 'medium':
        return 'border-r-yellow-500';
      default:
        return 'border-r-green-500';
    }
  };

  const getStatusLabel = (status: TaskData['status']) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in_progress':
        return 'قيد التنفيذ';
      case 'blocked':
        return 'معطل';
      default:
        return 'معلق';
    }
  };

  return (
    <div className="h-full bg-white/30 backdrop-blur-[15px] rounded-[20px] p-4 border border-white/40">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onViewAllTasks}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
        >
          <ArrowLeft size={14} />
          <span>عرض جميع المهام</span>
        </button>
        
        <h3 className="text-lg font-bold text-gray-800 font-arabic">المهام السريعة</h3>
      </div>
      
      <div className="space-y-2 overflow-auto h-[calc(100%-60px)]">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => onTaskClick(task.id)}
            className={`
              bg-white/20 backdrop-blur-[10px] rounded-[12px] p-3 
              border border-white/30 cursor-pointer hover:bg-white/30 
              transition-all duration-200 border-r-4 ${getPriorityColor(task.priority)}
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(task.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm mb-1 font-arabic line-clamp-2">
                  {task.title}
                </h4>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'blocked' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {getStatusLabel(task.status)}
                  </span>
                  
                  <span className="text-gray-500">
                    {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Circle size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-arabic">لا توجد مهام</p>
          </div>
        )}
      </div>
    </div>
  );
};
