
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

interface SatisfactionWidgetProps {
  satisfaction: number;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ satisfaction }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (satisfaction / 100) * circumference;

  return (
    <GenericCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-[#3e494c]/60 font-arabic">ممتاز</span>
        </div>
        <h3 className="text-sm font-arabic font-bold text-[#2A3437]">رضا العملاء</h3>
      </div>
      
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-24 h-24 mb-3">
          {/* خلفية الدائرة */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              className="backdrop-blur-sm"
            />
            {/* دائرة التقدم */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out drop-shadow-lg"
            />
            {/* تدرج للدائرة */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* النص الداخلي */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-[#2A3437] font-arabic">{satisfaction}%</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-[#3e494c]/60 font-arabic">متوسط التقييم</p>
        </div>
      </div>
    </GenericCard>
  );
};
