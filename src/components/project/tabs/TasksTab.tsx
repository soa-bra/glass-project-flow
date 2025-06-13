
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { Clock, User, AlertCircle } from 'lucide-react';

interface TasksTabProps {
  project: Project;
}

export const TasksTab: React.FC<TasksTabProps> = ({ project }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredTasks = project.tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* فلاتر المهام */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'pending', label: 'في الانتظار' },
          { id: 'in-progress', label: 'قيد التنفيذ' },
          { id: 'completed', label: 'مكتملة' },
          { id: 'overdue', label: 'متأخرة' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
              transition-all duration-200
              ${filter === item.id
                ? 'bg-white/25 text-gray-800 shadow-sm'
                : 'bg-white/10 text-gray-600 hover:bg-white/15'
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* قائمة المهام */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-1 h-6 rounded-full ${getPriorityColor(task.priority)}`} />
                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                  {task.status === 'overdue' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>متأخرة</span>
                    </div>
                  )}
                </div>
              </div>
              
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium border
                ${getStatusColor(task.status)}
              `}>
                {task.status === 'completed' ? 'مكتملة' :
                 task.status === 'in-progress' ? 'قيد التنفيذ' :
                 task.status === 'overdue' ? 'متأخرة' : 'في الانتظار'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
