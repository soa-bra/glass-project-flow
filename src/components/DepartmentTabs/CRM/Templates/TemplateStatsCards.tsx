
import React from 'react';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';
import { FileText, Star, Filter } from 'lucide-react';

interface TemplateStatsCardsProps {
  stats: {
    total: number;
    mostUsed: {
      name: string;
      usageCount: number;
    };
    categories: number;
  };
  filteredCount: number;
}

export const TemplateStatsCards: React.FC<TemplateStatsCardsProps> = ({
  stats,
  filteredCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NumericStatCard
        title="إجمالي النماذج"
        value={stats.total}
        description={`${filteredCount} نشط`}
        icon={<FileText className="h-5 w-5" />}
        accentColor="#3B82F6"
      />
      <NumericStatCard
        title="أكثر استخداماً"
        value={stats.mostUsed.usageCount}
        description={stats.mostUsed.name}
        icon={<Star className="h-5 w-5" />}
        accentColor="#EAB308"
      />
      <NumericStatCard
        title="الفئات المتاحة"
        value={stats.categories}
        description="متنوعة"
        icon={<Filter className="h-5 w-5" />}
        accentColor="#10B981"
      />
    </div>
  );
};
