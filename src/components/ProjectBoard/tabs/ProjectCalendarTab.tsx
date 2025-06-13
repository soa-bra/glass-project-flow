
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ProjectCalendarTabProps {
  project: ProjectCardProps;
  tint: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'milestone';
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'مراجعة التصميم الأولي',
    date: '2025-01-20',
    time: '14:00',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'موعد تسليم المرحلة الأولى',
    date: '2025-01-25',
    time: '17:00',
    type: 'deadline'
  },
  {
    id: '3',
    title: 'إنجاز التطوير الأساسي',
    date: '2025-02-01',
    time: '12:00',
    type: 'milestone'
  }
];

export const ProjectCalendarTab: React.FC<ProjectCalendarTabProps> = ({ project, tint }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return '#3b82f6';
      case 'deadline': return '#ef4444';
      case 'milestone': return '#22c55e';
      default: return tint;
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'meeting': return 'اجتماع';
      case 'deadline': return 'موعد نهائي';
      case 'milestone': return 'معلم مهم';
      default: return 'حدث';
    }
  };

  const formatMonth = (date: Date) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <motion.div 
      className="h-full p-6 overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Calendar Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <Calendar size={24} className="text-gray-600" />
          <h3 className="text-xl font-bold font-arabic text-gray-800">تقويم المشروع</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/20 rounded-full p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 rounded-full text-sm font-arabic transition-colors ${
                view === 'month' 
                  ? 'bg-white/40 text-gray-800' 
                  : 'text-gray-600 hover:bg-white/20'
              }`}
            >
              شهر
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 rounded-full text-sm font-arabic transition-colors ${
                view === 'week' 
                  ? 'bg-white/40 text-gray-800' 
                  : 'text-gray-600 hover:bg-white/20'
              }`}
            >
              أسبوع
            </button>
          </div>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-arabic text-white transition-colors"
            style={{ backgroundColor: tint }}
          >
            <Plus size={16} />
            إضافة حدث
          </button>
        </div>
      </motion.div>

      {/* Calendar Navigation */}
      <motion.div 
        className="flex items-center justify-between mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <ChevronRight size={20} className="text-gray-600" />
        </button>
        
        <h4 className="text-lg font-bold font-arabic text-gray-800">
          {formatMonth(currentDate)}
        </h4>
        
        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
      </motion.div>

      {/* Events List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {mockEvents.map((event, index) => (
          <motion.div
            key={event.id}
            className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/30 transition-all duration-200 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getEventTypeColor(event.type) }}
              />
              <div className="flex-1">
                <h4 className="font-semibold font-arabic text-gray-800 mb-1">
                  {event.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                    {getEventTypeText(event.type)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
