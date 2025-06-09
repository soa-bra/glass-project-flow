
import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const ProjectCalendarCard = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
  
  // Sample project events with colors
  const projectEvents = [
    { 
      date: 8, 
      title: 'اجتماع المراجعة الأسبوعية',
      startTime: '10:00',
      endTime: '11:30',
      type: 'meeting',
      location: 'قاعة الاجتماعات',
      color: '#8B5CF6'
    },
    { 
      date: 12, 
      title: 'تسليم المرحلة الأولى',
      startTime: '14:00',
      endTime: '16:00',
      type: 'deadline',
      location: 'مكتب المدير',
      color: '#EF4444'
    },
    { 
      date: 18, 
      title: 'ورشة عمل التصميم',
      startTime: '09:00',
      endTime: '17:00',
      type: 'workshop',
      location: 'استوديو التصميم',
      color: '#10B981'
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
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 relative shadow-xl border border-white/60">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        تقويم المشروع - {currentMonth}
      </h3>
      
      {/* Compact Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-600 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
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
                relative w-8 h-8 text-xs rounded-lg transition-all duration-300 text-center font-bold
                ${isToday ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md scale-110' : 'hover:bg-gray-100'}
                ${hasEvent && !isToday ? 'cursor-pointer text-white shadow-md' : 'text-gray-700'}
              `}
              style={{
                backgroundColor: hasEvent && !isToday ? event.color : undefined
              }}
            >
              {day}
              {hasEvent && !isToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-sm animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Events List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-700 mb-3">الأحداث القادمة</h4>
        {projectEvents.map((event, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
              style={{ backgroundColor: event.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{event.title}</div>
              <div className="text-xs text-gray-600">{event.startTime} - {event.endTime}</div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {event.date}
            </div>
          </div>
        ))}
      </div>
      
      {/* Event Modal */}
      {selectedEvent && (
        <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: selectedEvent.color }}
              />
              {selectedEvent.title}
            </h4>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{selectedEvent.location}</span>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl">
              <span className="text-gray-700 font-medium">
                نوع الحدث: {
                  selectedEvent.type === 'meeting' ? 'اجتماع' : 
                  selectedEvent.type === 'deadline' ? 'موعد تسليم' : 'ورشة عمل'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCalendarCard;
