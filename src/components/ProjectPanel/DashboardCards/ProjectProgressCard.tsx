
import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface ProjectProgressCardProps {
  totalTasks: number;
  completedTasks: number;
  daysRemaining: number;
  totalDays: number;
  className?: string;
}

export const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({
  totalTasks,
  completedTasks,
  daysRemaining,
  totalDays,
  className = ''
}) => {
  const taskProgress = Math.round((completedTasks / totalTasks) * 100);
  const timeProgress = Math.round(((totalDays - daysRemaining) / totalDays) * 100);
  
  return (
    <div className={`
      bg-white/40 backdrop-blur-[20px] rounded-[20px] p-6 border border-white/40
      hover:bg-white/50 transition-all duration-300 ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">
          تقدم المشروع
        </h3>
        <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
          <CheckCircle size={16} className="text-sky-600" />
        </div>
      </div>

      {/* تقدم المهام */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-arabic">المهام المكتملة</span>
          <span className="text-sm font-semibold text-gray-800">{completedTasks}/{totalTasks}</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-2 mb-1">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${taskProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 text-left">{taskProgress}%</div>
      </div>

      {/* تقدم الوقت */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-arabic">الوقت المنقضي</span>
          <span className="text-sm font-semibold text-gray-800">{totalDays - daysRemaining}/{totalDays} يوم</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-2 mb-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-sky-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${timeProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 text-left">{timeProgress}%</div>
      </div>

      {/* معلومات إضافية */}
      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="flex items-center gap-2 text-amber-600">
          <Clock size={14} />
          <span className="text-xs">{daysRemaining} يوم متبقي</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          <span className="text-xs">إجمالي {totalDays} يوم</span>
        </div>
      </div>
    </div>
  );
};
