
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { InnerCard } from '@/components/ui/InnerCard';
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
    <InnerCard 
      title="نسبة ملء الشواغر"
      icon={<TrendingUp className="w-4 h-4 text-white" />}
      className="p-6"
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
    </InnerCard>
  );
};
