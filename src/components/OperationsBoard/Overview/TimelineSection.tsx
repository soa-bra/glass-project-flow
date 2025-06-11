
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
    <div className="w-1/4">
      <GenericCard className="h-full">
        <h3 className="text-lg font-arabic font-bold mb-4 text-right text-gray-800">المواعيد القادمة</h3>
        
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id} className="flex items-start gap-2 text-right">
              <div className="flex flex-col items-end flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-gray-600">{new Date(event.date).toLocaleDateString('ar-SA')}</span>
                  <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">{event.title}</h4>
                <p className="text-xs text-gray-600">{event.department}</p>
              </div>
            </div>
          ))}
        </div>
      </GenericCard>
    </div>
  );
};
