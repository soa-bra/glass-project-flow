
import React from 'react';
import { Project } from '@/types/project';
import { Plus } from 'lucide-react';

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const tasks = [
    {
      id: 1,
      title: 'تصميم الواجهة',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: 'bg-soabra-new-on-plan text-gray-800',
      progress: 'دقيقة',
      date: '28 May',
      number: '01',
      priority: 'عاجل وهام'
    },
    {
      id: 2,
      title: 'كتابة الكود',
      description: 'تطوير موقع سوبرا',
      status: 'عاجل وهام',
      statusColor: 'bg-soabra-new-secondary-2 text-gray-800',
      progress: 'ساعتين',
      date: '29 May',
      number: '02',
      priority: 'عاجل وهام'
    },
    {
      id: 3,
      title: 'تطوير قواعد البيانات',
      description: 'تطوير موقع سوبرا',
      status: 'غير عاجل وهام',
      statusColor: 'bg-soabra-new-secondary-5 text-gray-800',
      progress: 'ساعتين',
      date: '01 Jun',
      number: '03',
      priority: 'غير عاجل وهام'
    },
    {
      id: 4,
      title: 'التسليم',
      description: 'تسليم الموقع النهائي',
      status: 'غير عاجل وغير هام',
      statusColor: 'bg-soabra-new-secondary-3 text-gray-800',
      progress: 'منجزة',
      date: '',
      number: '04',
      priority: 'غير عاجل وغير هام'
    }
  ];

  return (
    <div 
      className="h-full p-6 rounded-3xl border border-white/20"
      style={{
        background: 'var(--backgrounds-cards-admin-ops)',
      }}
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-arabic font-semibold text-gray-800">قائمة المهام</h3>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="w-8 h-8 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
            <span className="text-sm text-gray-600">•••</span>
          </button>
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-4 max-h-[calc(100%-120px)] overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white/40 backdrop-filter backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-start gap-4">
              {/* رقم المهمة */}
              <div className="w-12 h-12 bg-white/60 backdrop-filter backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
                <span className="text-sm font-semibold text-gray-700">{task.number}</span>
              </div>

              {/* محتوى المهمة */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-arabic font-semibold text-gray-800 mb-1">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 font-arabic">
                      {task.description}
                    </p>
                  </div>
                  
                  {/* الحالة */}
                  <div className={`px-3 py-1 rounded-lg text-xs font-arabic border border-white/20 ${task.statusColor}`}>
                    {task.status}
                  </div>
                </div>

                {/* التفاصيل السفلية */}
                <div className="flex items-center gap-4 text-sm text-gray-500 font-arabic">
                  <span>{task.progress}</span>
                  {task.date && <span>{task.date}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
