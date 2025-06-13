
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { TaskData } from './types';

interface TasksPreviewCardProps {
  tasks: TaskData[];
}

export const TasksPreviewCard: React.FC<TasksPreviewCardProps> = ({
  tasks
}) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  const previewTasks = tasks.slice(0, 4);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div
      className="bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      style={{ gridColumn: 3, gridRow: '1 / 3' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic">المهام</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm text-gray-600 font-arabic">{completedTasks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600 font-arabic">{inProgressTasks}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600 font-arabic">{pendingTasks}</span>
          </div>
        </div>
      </div>

      {/* Tasks list */}
      <div className="space-y-3">
        {previewTasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="flex items-center gap-3 p-3 bg-white/30 rounded-[15px] border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
          >
            {getStatusIcon(task.status)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 font-arabic truncate">
                {task.title}
              </p>
              <p className="text-xs text-gray-600 font-arabic">
                {task.assignee}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full font-arabic ${getStatusColor(task.status)}`}>
              {task.status === 'completed' ? 'مكتمل' : 
               task.status === 'in-progress' ? 'قيد التنفيذ' : 'في الانتظار'}
            </span>
          </motion.div>
        ))}
      </div>

      {tasks.length > 4 && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <button className="text-sm text-sky-600 hover:text-sky-700 font-arabic">
            عرض جميع المهام ({tasks.length})
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
