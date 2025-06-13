
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const timelineEvents = [
  { id: 1, title: 'بدء المشروع', date: '2024-01-15', status: 'completed' },
  { id: 2, title: 'إنهاء التصميم', date: '2024-02-10', status: 'completed' },
  { id: 3, title: 'تسليم النسخة الأولى', date: '2024-03-05', status: 'current' },
  { id: 4, title: 'الاختبار النهائي', date: '2024-03-20', status: 'upcoming' },
  { id: 5, title: 'النشر والتسليم', date: '2024-04-01', status: 'upcoming' }
];

const statusColors = {
  completed: 'bg-green-500',
  current: 'bg-blue-500',
  upcoming: 'bg-gray-300'
};

export const TimelineCard: React.FC = () => {
  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-gray-600" />
        <h3 className="text-lg font-bold text-gray-800 font-arabic">الخط الزمني</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex items-start gap-3">
              {/* نقطة الخط الزمني */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-3 h-3 rounded-full ${statusColors[event.status]} 
                            ${event.status === 'current' ? 'ring-2 ring-blue-300' : ''}`}
                />
                {index < timelineEvents.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                )}
              </div>

              {/* محتوى الحدث */}
              <div className="flex-1 pb-2">
                <div className="font-medium text-gray-800 font-arabic text-sm">
                  {event.title}
                </div>
                <div className="text-xs text-gray-600 font-arabic flex items-center gap-1 mt-1">
                  <Clock size={12} />
                  {new Date(event.date).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
