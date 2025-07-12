
import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

interface HRStats {
  active: number;
  onLeave: number;
  vacancies: number;
}

interface HRStatsCardsProps {
  stats: HRStats;
}

export const HRStatsCards: React.FC<HRStatsCardsProps> = ({ stats }) => {
  const statsData = [
    {
      title: 'أعضاء نشطين',
      value: String(stats.active).padStart(2, '0'),
      unit: 'موظف',
      description: 'يعملون حالياً في المشاريع'
    },
    {
      title: 'في إجازة',
      value: String(stats.onLeave).padStart(2, '0'),
      unit: 'موظف',
      description: 'في إجازة رسمية أو مرضية'
    },
    {
      title: 'شواغر',
      value: String(stats.vacancies).padStart(2, '0'),
      unit: 'منصب',
      description: 'مناصب مطلوب شغلها'
    }
  ];

  return <KPIStatsSection stats={statsData} />;
};
