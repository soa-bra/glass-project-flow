
import React from 'react';

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
    <div className="w-1/4 glass-enhanced rounded-[40px] p-6">
      <h3 className="text-xl font-arabic font-medium mb-4 text-right">المواعيد القادمة</h3>
      
      <div className="relative mt-6">
        <div className="absolute h-full w-0.5 bg-gray-300 left-4"></div>
        
        {timeline.map((event, index) => (
          <div key={event.id} className="mb-8 relative">
            <div className={`absolute left-4 transform -translate-x-1/2 w-3 h-3 rounded-full ${event.color}`}></div>
            <div className="mr-10 text-right">
              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('ar-SA')}</p>
              <h4 className="text-base font-medium">{event.title}</h4>
              <p className="text-xs text-gray-600">{event.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
