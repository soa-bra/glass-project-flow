
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface CalendarTabProps {
  project: ProjectCardProps;
}

const CalendarTab: React.FC<CalendarTabProps> = ({ project }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const events = [
    { id: 1, title: 'اجتماع فريق التطوير', date: 15, type: 'meeting', color: '#3b82f6' },
    { id: 2, title: 'موعد تسليم التصاميم', date: 18, type: 'deadline', color: '#ef4444' },
    { id: 3, title: 'مراجعة المشروع', date: 22, type: 'review', color: '#22c55e' },
    { id: 4, title: 'اختبار النظام', date: 25, type: 'testing', color: '#f59e0b' },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const todayAgenda = [
    { time: '09:00', title: 'مراجعة كود المشروع', type: 'review' },
    { time: '11:30', title: 'اجتماع العميل', type: 'meeting' },
    { time: '14:00', title: 'تطوير الميزة الجديدة', type: 'development' },
    { time: '16:30', title: 'اختبار الجودة', type: 'testing' },
  ];

  return (
    <div className="h-full flex gap-6">
      {/* Main Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Calendar Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white font-arabic">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={16} />
              </motion.button>
              
              <motion.button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={16} />
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setViewType('month')}
              className={`px-4 py-2 rounded-full text-sm font-arabic transition-all duration-200 ${
                viewType === 'month'
                  ? 'bg-white/40 text-white border border-white/60'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              شهر
            </motion.button>
            
            <motion.button
              onClick={() => setViewType('week')}
              className={`px-4 py-2 rounded-full text-sm font-arabic transition-all duration-200 ${
                viewType === 'week'
                  ? 'bg-white/40 text-white border border-white/60'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              أسبوع
            </motion.button>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div 
          className="flex-1 rounded-3xl backdrop-blur-3xl bg-white/30 p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day, index) => (
              <motion.div
                key={day}
                className="text-center text-sm font-arabic text-white/80 py-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.02) }}
              >
                {day}
              </motion.div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {generateCalendarDays().map((day, index) => (
              <motion.div
                key={index}
                className={`
                  relative aspect-square flex flex-col items-center justify-start p-2 rounded-xl transition-all duration-200
                  ${day 
                    ? 'bg-white/10 hover:bg-white/20 cursor-pointer border border-white/10 hover:border-white/30' 
                    : ''
                  }
                  ${day === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() && 
                    currentDate.getFullYear() === new Date().getFullYear()
                    ? 'bg-white/30 border-white/50' 
                    : ''
                  }
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + (index * 0.01) }}
                whileHover={day ? { scale: 1.05 } : {}}
              >
                {day && (
                  <>
                    <span className="text-white font-arabic text-sm mb-1">{day}</span>
                    {events
                      .filter(event => event.date === day)
                      .slice(0, 2)
                      .map((event, eventIndex) => (
                        <div
                          key={event.id}
                          className="w-full h-1.5 rounded-full mb-1"
                          style={{ backgroundColor: event.color }}
                        />
                      ))
                    }
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Today's Agenda Sidebar */}
      <motion.div 
        className="w-80 rounded-3xl backdrop-blur-3xl bg-white/30 p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={20} className="text-white" />
          <h3 className="text-lg font-bold text-white font-arabic">جدول اليوم</h3>
        </div>

        <div className="space-y-3">
          {todayAgenda.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.05) }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1 text-white/80 text-sm min-w-fit">
                <Clock size={14} />
                <span className="font-arabic">{item.time}</span>
              </div>
              <div className="flex-1">
                <div className="text-white font-arabic text-sm">{item.title}</div>
                <div className="text-white/60 text-xs font-arabic mt-1 capitalize">{item.type}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="w-full mt-6 p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-arabic text-sm transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          إضافة حدث جديد
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CalendarTab;
