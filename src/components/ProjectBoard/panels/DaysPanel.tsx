
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface DaysPanelProps {
  project: ProjectCardProps;
}

export const DaysPanel: React.FC<DaysPanelProps> = ({ project }) => {
  const tasks = [
    { id: 1, name: 'تصميم الواجهات', status: 'مكتملة', date: '2025-01-15', priority: 'عالية' },
    { id: 2, name: 'تطوير API', status: 'قيد التنفيذ', date: '2025-01-18', priority: 'متوسطة' },
    { id: 3, name: 'اختبار الأداء', status: 'معلقة', date: '2025-01-22', priority: 'منخفضة' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'مكتملة': '#22c55e',
      'قيد التنفيذ': '#f59e0b',
      'معلقة': '#6b7280',
    };
    return colors[status as keyof typeof colors] || colors['معلقة'];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Task List - Takes 3 columns */}
      <div className="lg:col-span-3 rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">قائمة المهام</h3>
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center justify-between p-4 bg-white/40 rounded-2xl backdrop-blur-sm border border-white/20"
            >
              <div className="flex-1">
                <h4 className="font-arabic font-semibold text-gray-800">{task.name}</h4>
                <p className="text-sm text-gray-600 font-arabic">{task.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-arabic">
                  {task.priority}
                </span>
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Calendar - Takes 1 column */}
      <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold font-arabic text-gray-800 mb-4">التقويم</h3>
        <div className="space-y-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">15</div>
            <div className="text-sm text-gray-600 font-arabic">يناير 2025</div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-xs font-arabic text-gray-600">المهام اليوم</div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="text-xs font-arabic text-gray-500">3 من 5 مهام</div>
          </div>
        </div>
      </div>
    </div>
  );
};
