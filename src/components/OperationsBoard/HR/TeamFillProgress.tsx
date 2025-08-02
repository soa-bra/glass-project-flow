
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseCard } from '@/components/ui/BaseCard';
import { TrendingUp } from 'lucide-react';

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
      variant="unified"
      size="md"
      header={
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-black" />
          <h3 className="text-lg font-arabic font-bold text-black">
            نسبة ملء الشواغر
          </h3>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-black">{percentageFilled}%</span>
          <span className="text-sm text-black/70 font-arabic">تم التوظيف</span>
        </div>
        
        <Progress 
          value={percentageFilled} 
          className="h-3 bg-black/10 rounded-full"
          indicatorClassName="bg-black rounded-full"
        />
        
        <div className="flex justify-between text-sm">
          <span className="text-black font-medium font-arabic">{stats.active} موظف</span>
          <span className="text-black font-medium font-arabic">{stats.vacancies} شاغر</span>
        </div>
      </div>
    </BaseCard>
  );
};
