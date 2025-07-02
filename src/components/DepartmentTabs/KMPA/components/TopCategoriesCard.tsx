
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Progress } from '@/components/ui/progress';
import { FileText } from 'lucide-react';
import { mockKnowledgeMetrics } from '../data/mockData';

export const TopCategoriesCard: React.FC = () => {
  const metrics = mockKnowledgeMetrics;

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">الفئات الأكثر نشاطاً</h3>
      </div>
      <div className="space-y-4">
        {metrics.topCategories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-black font-arabic">{category.name}</span>
              <span className="text-sm text-black font-arabic">{category.count} وثيقة</span>
            </div>
            <Progress value={category.percentage} className="h-2" />
            <div className="text-xs text-black font-arabic">{category.percentage}% من إجمالي المحتوى</div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
