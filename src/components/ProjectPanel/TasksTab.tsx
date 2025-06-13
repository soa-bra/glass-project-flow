
import React from 'react';
import { TaskData } from './types';
import { Search, Filter, Plus, Zap } from 'lucide-react';

interface TasksTabProps {
  tasks: TaskData[];
  loading: boolean;
}

const statusColors = {
  'pending': '#fbbf24',
  'in-progress': '#3b82f6',
  'completed': '#10b981'
};

const statusLabels = {
  'pending': 'قيد الانتظار',
  'in-progress': 'قيد التنفيذ',
  'completed': 'مكتمل'
};

const priorityColors = {
  'low': '#6b7280',
  'medium': '#f59e0b',
  'high': '#ef4444'
};

const priorityLabels = {
  'low': 'منخفضة',
  'medium': 'متوسطة',
  'high': 'عالية'
};

export const TasksTab: React.FC<TasksTabProps> = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-[10px] rounded-[20px] p-4 animate-pulse">
            <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* شريط الأدوات */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المهام..."
            className="w-full pl-4 pr-10 py-2 bg-white/20 backdrop-blur-[10px] border border-white/30 rounded-full text-right placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        
        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
          <Filter size={16} className="text-gray-600" />
        </button>
        
        <button className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors">
          <Plus size={16} />
        </button>
        
        <button className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors">
          <Zap size={16} />
        </button>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-4 border border-white/40 hover:bg-white/40 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: priorityColors[task.priority] }}
                ></div>
                <span className="text-xs text-gray-600">
                  {priorityLabels[task.priority]}
                </span>
              </div>
              
              <div
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: statusColors[task.status] }}
              >
                {statusLabels[task.status]}
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-2 text-right font-arabic">
              {task.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 text-right">
              {task.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
              <span>{task.assignee}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
