
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

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          الإنجاز
        </h3>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Target size={16} className="text-white" />
        </div>
      </div>

      {/* Progress Circle - Smaller for narrow column */}
      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center"
              style={{
                background: `conic-gradient(from 0deg, #3B82F6 0%, #3B82F6 ${progressPercentage}%, #E5E7EB ${progressPercentage}%, #E5E7EB 100%)`
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800 font-arabic">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Stats - Compact */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-arabic">مكتمل</span>
          <span className="font-semibold text-blue-600 font-arabic">
            {completedTasks}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-arabic">المجموع</span>
          <span className="font-semibold text-gray-800 font-arabic">
            {totalTasks}
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mt-3 p-1 bg-blue-100/50 rounded-[8px]">
        <TrendingUp size={12} className="text-blue-600 ml-1" />
        <span className="text-xs font-arabic text-blue-700">متقدم</span>
      </div>
    </div>
  );
};
