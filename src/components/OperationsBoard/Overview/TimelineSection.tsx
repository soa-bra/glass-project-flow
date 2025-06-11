
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
        <h3 className="text-xl font-arabic font-bold mb-6 text-right text-gray-800">المواعيد القادمة</h3>
        
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={event.id} className="flex items-start gap-3 text-right">
              <div className="flex flex-col items-end flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-600">{new Date(event.date).toLocaleDateString('ar-SA')}</span>
                  <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.department}</p>
              </div>
            </div>
          ))}
        </div>
      </GenericCard>
    </div>
  );
};
