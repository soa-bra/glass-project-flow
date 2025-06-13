
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

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

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  return (
    <BaseCard 
      size="md"
      header={
        <h3 className="text-lg font-arabic font-bold text-gray-800 text-center">
          المواعيد والأحداث القادمة
        </h3>
      }
      className="w-full min-h-[140px]"
    >
      <div className="relative overflow-x-auto">
        <div className="flex items-center gap-8 min-w-full pb-2 justify-center">
          {timeline.slice(0, 8).map((event, index) => (
            <div key={event.id} className="flex flex-col items-center min-w-fit relative">
              <div className="text-xs text-gray-500 mb-2 whitespace-nowrap font-medium">
                {new Date(event.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
              </div>
              
              <div className={`w-3 h-3 rounded-full ${event.color} relative z-10 bg-white border-2 shadow-sm`}></div>
              
              <div className="text-center mt-2">
                <div className="text-xs font-semibold text-gray-900 whitespace-nowrap mb-1">
                  {event.title}
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap">
                  {event.department}
                </div>
              </div>
              
              {index < timeline.slice(0, 8).length - 1 && (
                <div className="absolute top-8 right-[-16px] h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 w-8 z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};
