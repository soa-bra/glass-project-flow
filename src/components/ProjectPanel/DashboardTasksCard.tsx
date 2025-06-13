
import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { TaskData } from './types';

interface DashboardTasksCardProps {
  tasks: TaskData[];
}

export const DashboardTasksCard: React.FC<DashboardTasksCardProps> = ({ tasks }) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          المهام
        </h3>
        <CheckSquare size={20} className="text-gray-600" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/20 rounded-[12px]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-arabic">قيد الانتظار</span>
          </div>
          <span className="text-lg font-bold text-gray-800">{pendingTasks}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/20 rounded-[12px]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-arabic">قيد التنفيذ</span>
          </div>
          <span className="text-lg font-bold text-gray-800">{inProgressTasks}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/20 rounded-[12px]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-arabic">مكتمل</span>
          </div>
          <span className="text-lg font-bold text-gray-800">{completedTasks}</span>
        </div>
      </div>
    </div>
  );
};
