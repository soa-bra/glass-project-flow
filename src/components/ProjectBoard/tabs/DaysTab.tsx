
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface DaysTabProps {
  project: ProjectCardProps;
}

const DaysTab: React.FC<DaysTabProps> = ({ project }) => {
  const days = [
    { date: '2025-01-15', tasks: 3, completed: 2, progress: 67 },
    { date: '2025-01-16', tasks: 5, completed: 4, progress: 80 },
    { date: '2025-01-17', tasks: 2, completed: 2, progress: 100 },
  ];

  return (
    <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6 h-full">
      <h3 className="text-xl font-bold font-arabic text-gray-800 mb-6">قائمة الأيام</h3>
      <div className="space-y-4">
        {days.map(day => (
          <div key={day.date} className="p-4 rounded-2xl bg-white/40">
            <div className="flex justify-between items-center mb-3">
              <div className="font-arabic font-semibold text-gray-800">{day.date}</div>
              <div className="text-sm font-arabic text-gray-600">
                {day.completed}/{day.tasks} مهام
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${day.progress}%` }}
              ></div>
            </div>
            <div className="text-xs font-arabic text-gray-500 mt-1">
              {day.progress}% مكتمل
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaysTab;
