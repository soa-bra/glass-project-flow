
import React, { useState } from 'react';
import { ProjectData } from './types';
import { InteractiveCalendar } from './InteractiveCalendar';
import { Calendar, Clock, Users, MapPin, Bell, Plus } from 'lucide-react';

interface CalendarTabProps {
  projectData: ProjectData;
  loading: boolean;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ projectData, loading }) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-[10px] rounded-[20px] p-4 animate-pulse">
            <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const calendarEvents = [
    {
      id: '1',
      title: 'اجتماع مراجعة التقدم',
      date: '2025-06-15',
      time: '10:00',
      attendees: 5,
      location: 'قاعة الاجتماعات الرئيسية',
      type: 'meeting' as const
    },
    {
      id: '2',
      title: 'موعد تسليم المرحلة الثانية',
      date: '2025-06-20',
      time: '17:00',
      attendees: 3,
      location: 'عبر الإنترنت',
      type: 'deadline' as const
    },
    {
      id: '3',
      title: 'ورشة عمل التصميم',
      date: '2025-06-18',
      time: '14:30',
      attendees: 8,
      location: 'استوديو التصميم',
      type: 'task' as const
    },
    {
      id: '4',
      title: 'مراجعة الكود',
      date: '2025-06-25',
      time: '11:00',
      attendees: 4,
      location: 'مكتب التطوير',
      type: 'task' as const
    }
  ];

  const upcomingEvents = calendarEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-600 border-red-200';
      case 'task': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'اجتماع';
      case 'deadline': return 'موعد نهائي';
      case 'task': return 'مهمة';
      default: return 'حدث';
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  return (
    <div className="p-6 space-y-6">
      {/* التقويم التفاعلي */}
      <InteractiveCalendar
        events={calendarEvents}
        onEventClick={handleEventClick}
        onDateClick={(date) => console.log('تاريخ محدد:', date)}
      />

      {/* الأحداث القادمة */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">الأحداث القادمة</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Bell size={16} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2">{event.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(event.date).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{event.attendees} مشارك</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                  {getEventTypeLabel(event.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ملخص الأنشطة */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">ملخص الأنشطة</h3>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {calendarEvents.filter(e => e.type === 'meeting').length}
            </p>
            <p className="text-sm text-gray-600">اجتماعات</p>
          </div>
          
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {calendarEvents.filter(e => e.type === 'deadline').length}
            </p>
            <p className="text-sm text-gray-600">مواعيد نهائية</p>
          </div>
          
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {calendarEvents.filter(e => e.type === 'task').length}
            </p>
            <p className="text-sm text-gray-600">مهام</p>
          </div>

          <div className="text-center p-3 bg-purple-100 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {upcomingEvents.length}
            </p>
            <p className="text-sm text-gray-600">قادمة</p>
          </div>
        </div>
      </div>

      {/* تفاصيل الحدث المحدد */}
      {selectedEvent && (
        <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 font-arabic">تفاصيل الحدث</h3>
            <button 
              onClick={() => setSelectedEvent(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">{selectedEvent.title}</h4>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getEventTypeColor(selectedEvent.type)}`}>
                {getEventTypeLabel(selectedEvent.type)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span>{new Date(selectedEvent.date).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span>{selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span>{selectedEvent.attendees} مشارك</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>
            
            <div className="flex gap-2 pt-3">
              <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                تعديل
              </button>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                حذف
              </button>
              <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
                تكرار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
