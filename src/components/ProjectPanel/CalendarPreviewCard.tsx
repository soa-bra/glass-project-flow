
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';

interface CalendarPreviewCardProps {
  events?: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'meeting' | 'deadline' | 'task';
  }>;
}

export const CalendarPreviewCard: React.FC<CalendarPreviewCardProps> = ({
  events = [
    { id: '1', title: 'اجتماع مراجعة التصميم', date: '2025-06-15', time: '10:00', type: 'meeting' },
    { id: '2', title: 'موعد تسليم المرحلة الأولى', date: '2025-06-30', time: '17:00', type: 'deadline' },
    { id: '3', title: 'مراجعة الكود', date: '2025-06-18', time: '14:30', type: 'task' }
  ]
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users size={16} className="text-blue-500" />;
      case 'deadline':
        return <Clock size={16} className="text-red-500" />;
      default:
        return <Calendar size={16} className="text-green-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <motion.div
      className="bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      style={{ gridColumn: 1, gridRow: '2 / 3' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-sky-600" />
        <h3 className="text-lg font-semibold text-gray-800 font-arabic">التقويم</h3>
      </div>

      {/* Events list */}
      <div className="space-y-3">
        {events.slice(0, 3).map((event, index) => (
          <motion.div
            key={event.id}
            className="flex items-center gap-3 p-3 bg-white/30 rounded-[15px] border border-white/20"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
          >
            {getEventIcon(event.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 font-arabic truncate">
                {event.title}
              </p>
              <p className="text-xs text-gray-600 font-arabic">
                {event.time} - {new Date(event.date).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full font-arabic ${getEventColor(event.type)}`}>
              {event.type === 'meeting' ? 'اجتماع' : 
               event.type === 'deadline' ? 'موعد' : 'مهمة'}
            </span>
          </motion.div>
        ))}
      </div>

      {events.length > 3 && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <button className="text-sm text-sky-600 hover:text-sky-700 font-arabic">
            عرض التقويم الكامل
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
