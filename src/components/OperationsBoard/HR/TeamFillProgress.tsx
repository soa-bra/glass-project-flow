
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseCard } from '@/components/ui/BaseCard';

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
    <BaseCard 
      size="md"
      header={
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          نسبة ملء الشواغر
        </h3>
      }
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-bold text-blue-600">{percentageFilled}%</span>
        <span className="text-sm text-gray-600">تم التوظيف</span>
      </div>
      
      <Progress 
        value={percentageFilled} 
        className="h-3 bg-gray-200/50 rounded-full"
        indicatorClassName="bg-blue-500 rounded-full"
      />
      
      <div className="flex justify-between text-sm mt-3">
        <span className="text-blue-600 font-medium">{stats.active} موظف</span>
        <span className="text-purple-600 font-medium">{stats.vacancies} شاغر</span>
      </div>
    </BaseCard>
  );
};
