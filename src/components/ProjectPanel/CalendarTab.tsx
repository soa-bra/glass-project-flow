
import React, { useState } from 'react';
import { ProjectData } from './types';
import { Calendar, Clock, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarTabProps {
  projectData: ProjectData;
  loading: boolean;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ projectData, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const upcomingEvents = [
    {
      id: '1',
      title: 'اجتماع مراجعة التقدم',
      date: '2025-06-15',
      time: '10:00',
      attendees: 5,
      location: 'قاعة الاجتماعات الرئيسية',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'موعد تسليم المرحلة الثانية',
      date: '2025-06-20',
      time: '17:00',
      attendees: 3,
      location: 'عبر الإنترنت',
      type: 'deadline'
    },
    {
      id: '3',
      title: 'ورشة عمل التصميم',
      date: '2025-06-18',
      time: '14:30',
      attendees: 8,
      location: 'استوديو التصميم',
      type: 'workshop'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-600 border-red-200';
      case 'workshop': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'اجتماع';
      case 'deadline': return 'موعد نهائي';
      case 'workshop': return 'ورشة عمل';
      default: return 'حدث';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6 space-y-6">
      {/* التقويم الشهري */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 font-arabic">تقويم المشروع</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
            <span className="px-4 py-2 bg-white/20 rounded-lg font-semibold text-gray-800">
              {currentDate.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* شبكة التقويم المبسطة */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
            <div key={day} className="text-center p-2 text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {/* خلايا التقويم - مبسطة للعرض */}
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="aspect-square flex items-center justify-center text-sm hover:bg-white/20 rounded-lg transition-colors cursor-pointer">
              {i + 1 <= 30 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </div>

      {/* الأحداث القادمة */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">الأحداث القادمة</h3>
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30">
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
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-600">اجتماعات هذا الشهر</p>
          </div>
          
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-sm text-gray-600">مواعيد نهائية</p>
          </div>
          
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-sm text-gray-600">ورش عمل</p>
          </div>
        </div>
      </div>
    </div>
  );
};
