
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
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
      <GenericCard className="text-center">
        <div className="flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold font-arabic text-gray-900">{stats.total}</h3>
        <p className="text-gray-600 font-arabic">إجمالي النماذج</p>
        <div className="mt-2 text-sm text-blue-600 font-arabic">
          {filteredCount} نشط
        </div>
      </GenericCard>

      <GenericCard className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold font-arabic text-gray-900">{stats.mostUsed.usageCount}</h3>
        <p className="text-gray-600 font-arabic">أكثر استخداماً</p>
        <div className="mt-2 text-sm text-yellow-600 font-arabic">
          {stats.mostUsed.name}
        </div>
      </GenericCard>

      <GenericCard className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Filter className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold font-arabic text-gray-900">{stats.categories}</h3>
        <p className="text-gray-600 font-arabic">الفئات المتاحة</p>
        <div className="mt-2 text-sm text-green-600 font-arabic">
          متنوعة
        </div>
      </GenericCard>
    </div>
  );
};
