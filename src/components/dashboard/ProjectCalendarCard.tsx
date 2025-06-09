
import { useState } from 'react';

const ProjectCalendarCard = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
  
  // Sample project events
  const projectEvents = [
    { 
      date: 8, 
      title: 'اجتماع المراجعة الأسبوعية',
      startTime: '10:00',
      endTime: '11:30',
      type: 'meeting'
    },
    { 
      date: 12, 
      title: 'تسليم المرحلة الأولى',
      startTime: '14:00',
      endTime: '16:00',
      type: 'deadline'
    },
    { 
      date: 18, 
      title: 'ورشة عمل التصميم',
      startTime: '09:00',
      endTime: '17:00',
      type: 'workshop'
    },
  ];
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();

  return (
    <div className="glass rounded-lg p-6 relative">
      <h3 className="text-xl font-medium text-soabra-text-primary mb-4">
        تقويم المشروع
      </h3>
      
      {/* Mini Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-soabra-text-secondary p-1">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day) => {
          const hasEvent = projectEvents.some(event => event.date === day);
          const isToday = day === currentDate.getDate();
          const event = projectEvents.find(e => e.date === day);
          
          return (
            <button
              key={day}
              onClick={() => event && setSelectedEvent(event)}
              className={`
                relative w-8 h-8 text-sm rounded-md transition-colors text-center
                ${isToday ? 'bg-soabra-primary-blue text-white font-semibold' : 'hover:bg-white/20'}
                ${hasEvent ? 'cursor-pointer' : ''}
              `}
            >
              {day}
              {hasEvent && !isToday && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-soabra-warning rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Event Tooltip Modal */}
      {selectedEvent && (
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-modal">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-soabra-text-primary">
              {selectedEvent.title}
            </h4>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-soabra-text-secondary hover:text-soabra-text-primary"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-soabra-text-secondary">
            {selectedEvent.startTime} - {selectedEvent.endTime}
          </p>
          <p className="text-sm text-soabra-text-secondary capitalize">
            نوع الحدث: {selectedEvent.type === 'meeting' ? 'اجتماع' : selectedEvent.type === 'deadline' ? 'موعد تسليم' : 'ورشة عمل'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectCalendarCard;
