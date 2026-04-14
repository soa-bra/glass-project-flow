
import React from 'react';
import { ArcGaugeCard } from '@/components/shared/visual-data';

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
    <ArcGaugeCard
      title="نسبة ملء الشواغر"
      value={percentageFilled}
      subtitle={`${stats.active} موظف · ${stats.vacancies} شاغر`}
      color="#0B0F12"
    />
  );
};
