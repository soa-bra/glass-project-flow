
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Target } from 'lucide-react';

interface DashboardProgressCardProps {
  completedTasks: number;
  totalTasks: number;
}

export const DashboardProgressCard: React.FC<DashboardProgressCardProps> = ({
  completedTasks,
  totalTasks
}) => {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          التقدم
        </h3>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Target size={20} className="text-white" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 flex flex-col justify-center mb-4">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 font-arabic mb-2" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-gray-600 font-arabic">مكتمل</div>
        </div>

        <div className="w-full bg-white/30 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Task Stats */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المكتملة</span>
          <span className="text-base font-semibold text-blue-600 font-arabic">
            {completedTasks}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">الإجمالي</span>
          <span className="text-base font-semibold text-gray-800 font-arabic">
            {totalTasks}
          </span>
        </div>
      </div>
    </div>
  );
};
