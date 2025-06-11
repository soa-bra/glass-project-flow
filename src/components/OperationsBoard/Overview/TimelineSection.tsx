
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface TimelineSectionProps {
  timeline: TimelineEvent[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  timeline
}) => {
  return (
    <GenericCard className="w-full h-20 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs text-[#3e494c]/60 font-arabic">5 أحداث قادمة</span>
        </div>
        <h3 className="text-sm font-arabic font-bold text-[#2A3437]">المواعيد القادمة</h3>
      </div>
      
      {/* الخط الزمني الأفقي */}
      <div className="relative overflow-x-auto">
        <div className="flex items-center gap-8 min-w-full">
          {timeline.slice(0, 5).map((event, index) => (
            <div key={event.id} className="flex flex-col items-center min-w-fit relative">
              {/* التاريخ */}
              <div className="text-xs text-[#3e494c]/60 mb-2 whitespace-nowrap font-arabic">
                {new Date(event.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
              </div>
              
              {/* النقطة الملونة مع تأثير glassmorphism */}
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${event.color} relative z-10 shadow-lg backdrop-blur-sm border border-white/30`}></div>
                <div className={`absolute inset-0 w-3 h-3 rounded-full ${event.color} opacity-30 blur-sm`}></div>
              </div>
              
              {/* العنوان والقسم */}
              <div className="text-center mt-2">
                <div className="text-xs font-medium text-[#2A3437] whitespace-nowrap mb-1 font-arabic">
                  {event.title}
                </div>
                <div className="text-xs text-[#3e494c]/60 whitespace-nowrap font-arabic">
                  {event.department}
                </div>
              </div>
              
              {/* الخط الواصل */}
              {index < timeline.slice(0, 5).length - 1 && (
                <div className="absolute top-8 right-[-16px] h-0.5 w-8 bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GenericCard>
  );
};
