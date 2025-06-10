
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface HRStats {
  active: number;
  vacancies: number;
}

interface TeamFillProgressProps {
  stats: HRStats;
}

export const TeamFillProgress: React.FC<TeamFillProgressProps> = ({ stats }) => {
  const totalTeamSize = stats.active + stats.vacancies;
  const percentageFilled = Math.round((stats.active / totalTeamSize) * 100);

  return (
    <div className="glass-enhanced rounded-[40px] p-6 transition-all duration-200 ease-in-out">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">{percentageFilled}% تم التوظيف</span>
        <h3 className="font-medium">نسبة ملء الشواغر</h3>
      </div>
      
      <Progress 
        value={percentageFilled} 
        className="h-3 bg-gray-200"
        indicatorClassName="bg-blue-500"
      />
      
      <div className="flex justify-between text-sm mt-2">
        <span className="text-blue-600">{stats.active} موظف</span>
        <span className="text-purple-600">{stats.vacancies} شاغر</span>
      </div>
    </div>
  );
};
