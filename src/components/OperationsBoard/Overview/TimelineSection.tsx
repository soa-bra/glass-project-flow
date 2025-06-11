
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
    <GenericCard className="w-full h-16">
      <h3 className="text-sm font-arabic font-bold mb-2 text-right text-gray-800">المواعيد القادمة</h3>
      
      {/* الخط الزمني الأفقي */}
      <div className="relative overflow-x-auto">
        <div className="flex items-center gap-6 min-w-full pb-1">
          {timeline.slice(0, 5).map((event, index) => (
            <div key={event.id} className="flex flex-col items-center min-w-fit">
              {/* التاريخ */}
              <div className="text-xs text-gray-500 mb-1 whitespace-nowrap">
                {new Date(event.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
              </div>
              
              {/* النقطة الملونة */}
              <div className={`w-2 h-2 rounded-full ${event.color} relative z-10 bg-white border-2`}></div>
              
              {/* العنوان والقسم */}
              <div className="text-center mt-1">
                <div className="text-xs font-medium text-gray-900 whitespace-nowrap mb-0.5">
                  {event.title}
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap">
                  {event.department}
                </div>
              </div>
              
              {/* الخط الواصل (إلا آخر عنصر) */}
              {index < timeline.slice(0, 5).length - 1 && (
                <div className="absolute top-6 h-0.5 bg-gray-300 w-6 translate-x-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GenericCard>
  );
};
