
import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

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
      type: 'meeting',
      location: 'قاعة الاجتماعات'
    },
    { 
      date: 12, 
      title: 'تسليم المرحلة الأولى',
      startTime: '14:00',
      endTime: '16:00',
      type: 'deadline',
      location: 'مكتب المدير'
    },
    { 
      date: 18, 
      title: 'ورشة عمل التصميم',
      startTime: '09:00',
      endTime: '17:00',
      type: 'workshop',
      location: 'استوديو التصميم'
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
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 relative border border-gray-200/30 shadow-sm">
      <h3 className="text-xl font-medium text-soabra-text-primary mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-soabra-primary-blue" />
        تقويم المشروع
      </h3>
      
      {/* Mini Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-soabra-text-secondary p-2 bg-gray-50/50 rounded">
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
                relative w-8 h-8 text-sm rounded-lg transition-all duration-200 text-center font-medium
                ${isToday ? 'bg-soabra-primary-blue text-white shadow-md' : 'hover:bg-gray-100/70'}
                ${hasEvent && !isToday ? 'cursor-pointer bg-blue-50/80 text-soabra-primary-blue' : ''}
              `}
            >
              {day}
              {hasEvent && !isToday && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-soabra-warning rounded-full shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Event Tooltip Modal */}
      {selectedEvent && (
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200/50 p-4 z-modal backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-soabra-text-primary flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  selectedEvent.type === 'meeting' ? 'bg-blue-500' : 
                  selectedEvent.type === 'deadline' ? 'bg-red-500' : 'bg-green-500'
                }`} 
              />
              {selectedEvent.title}
            </h4>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-soabra-text-secondary hover:text-soabra-text-primary transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-soabra-text-secondary">
              <Clock className="w-4 h-4" />
              <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
            </div>
            
            <div className="flex items-center gap-2 text-soabra-text-secondary">
              <MapPin className="w-4 h-4" />
              <span>{selectedEvent.location}</span>
            </div>
            
            <div className="text-soabra-text-secondary">
              نوع الحدث: {
                selectedEvent.type === 'meeting' ? 'اجتماع' : 
                selectedEvent.type === 'deadline' ? 'موعد تسليم' : 'ورشة عمل'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCalendarCard;
