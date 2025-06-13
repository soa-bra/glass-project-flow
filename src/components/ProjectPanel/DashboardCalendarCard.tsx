
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export const DashboardCalendarCard: React.FC = () => {
  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          التقويم
        </h3>
        <Calendar size={20} className="text-gray-600" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-4xl font-bold text-gray-800 mb-2">15</div>
        <div className="text-sm text-gray-600 font-arabic mb-4">ديسمبر 2024</div>
        
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
            <Clock size={14} className="text-blue-500" />
            <span className="text-xs font-arabic">اجتماع فريق</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
            <Clock size={14} className="text-orange-500" />
            <span className="text-xs font-arabic">موعد تسليم</span>
          </div>
        </div>
      </div>
    </div>
  );
};
