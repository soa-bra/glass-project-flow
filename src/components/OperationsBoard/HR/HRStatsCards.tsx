
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Users, UserX, Briefcase } from 'lucide-react';

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
      value: stats.active,
      icon: Users,
      description: 'يعملون حالياً في المشاريع'
    },
    {
      title: 'في إجازة',
      value: stats.onLeave,
      icon: UserX,
      description: 'في إجازة رسمية أو مرضية'
    },
    {
      title: 'شواغر',
      value: stats.vacancies,
      icon: Briefcase,
      description: 'مناصب مطلوب شغلها'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <BaseCard key={index} variant="unified" size="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-black/70">{stat.title}</p>
                <p className="text-2xl font-bold text-black">{String(stat.value).padStart(2, '0')}</p>
                <p className="text-xs font-arabic text-black/60">{stat.description}</p>
              </div>
              <Icon className="h-8 w-8 text-black" />
            </div>
          </BaseCard>
        );
      })}
    </div>
  );
};
