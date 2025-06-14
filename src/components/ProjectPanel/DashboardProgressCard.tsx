
import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';

interface DashboardProgressCardProps {
  completedTasks: number;
  totalTasks: number;
}

export const DashboardProgressCard: React.FC<DashboardProgressCardProps> = ({
  completedTasks,
  totalTasks
}) => {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const circumference = 2 * Math.PI * 75;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          التقدم
        </h3>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Target size={20} className="text-white" />
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="75"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80" 
              r="75"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800 font-arabic mb-1" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              {Math.round(progressPercentage)}%
            </span>
            <span className="text-sm text-gray-600 font-arabic">مكتمل</span>
          </div>
        </div>
      </div>

      {/* Task Stats */}
      <div className="space-y-3">
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
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المتبقية</span>
          <span className="text-base font-semibold text-orange-600 font-arabic">
            {totalTasks - completedTasks}
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mt-4 p-2 bg-blue-100/50 rounded-[10px]">
        <TrendingUp size={16} className="text-blue-600 ml-2" />
        <span className="text-sm font-arabic text-blue-700">في المسار الصحيح</span>
      </div>
    </div>
  );
};
