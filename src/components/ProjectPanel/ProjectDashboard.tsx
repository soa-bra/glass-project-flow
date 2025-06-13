
import React from 'react';
import { ProjectData } from './types';
import { BudgetCard } from './BudgetCard';
import { CalendarCard } from './CalendarCard';
import { QuickTasksList } from './QuickTasksList';
import { ProgressSegments } from './ProgressSegments';

interface ProjectDashboardProps {
  projectData: ProjectData;
  loading: boolean;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  projectData, 
  loading 
}) => {
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

  // حساب نسبة التقدم
  const completedTasks = projectData.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = projectData.tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 h-full">
      {/* شريط التقدم */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">التقدم العام</h3>
          <span className="text-2xl font-bold text-blue-600 font-arabic">
            {progressPercentage}%
          </span>
        </div>
        <ProgressSegments 
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          progressPercentage={progressPercentage}
        />
      </div>

      {/* الشبكة الرئيسية: 3 أعمدة × 2 صفوف */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100%-120px)] min-h-[500px]">
        {/* العمود الأول: بطاقة الميزانية والتقويم */}
        <div className="col-span-4 space-y-4">
          {/* بطاقة الميزانية */}
          <div className="h-1/2">
            <BudgetCard 
              budget={projectData.budget}
              onViewDetails={() => console.log('فتح تبويب المالية')}
              onExpand={() => console.log('توسيع بطاقة الميزانية')}
            />
          </div>
          
          {/* بطاقة التقويم */}
          <div className="h-1/2">
            <CalendarCard 
              events={projectData.events || []}
              onViewCalendar={() => console.log('فتح تبويب التقويم')}
            />
          </div>
        </div>

        {/* فاصلة شفافة - العمود الثاني */}
        <div className="col-span-1"></div>

        {/* العمود الثالث: قائمة المهام المختصرة */}
        <div className="col-span-7">
          <QuickTasksList 
            tasks={projectData.tasks.slice(0, 8)} // أول 8 مهام
            onViewAllTasks={() => console.log('فتح تبويب المهام')}
            onTaskClick={(taskId) => console.log('النقر على المهمة:', taskId)}
          />
        </div>
      </div>
    </div>
  );
};
