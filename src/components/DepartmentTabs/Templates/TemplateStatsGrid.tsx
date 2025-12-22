
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const TemplateStatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <BaseCard variant="operations" size="sm" className="text-center">
        <h3 className="text-2xl font-bold text-blue-600 mb-1 font-arabic">42</h3>
        <p className="text-sm text-gray-600 font-arabic">إجمالي النماذج</p>
      </BaseCard>

      <BaseCard variant="operations" size="sm" className="text-center">
        <h3 className="text-2xl font-bold text-green-600 mb-1 font-arabic">1,890</h3>
        <p className="text-sm text-gray-600 font-arabic">مرات التحميل</p>
      </BaseCard>

      <BaseCard variant="operations" size="sm" className="text-center">
        <h3 className="text-2xl font-bold text-purple-600 mb-1 font-arabic">8</h3>
        <p className="text-sm text-gray-600 font-arabic">نماذج جديدة</p>
      </BaseCard>

      <BaseCard variant="operations" size="sm" className="text-center">
        <h3 className="text-2xl font-bold text-orange-600 mb-1 font-arabic">4.7</h3>
        <p className="text-sm text-gray-600 font-arabic">متوسط التقييم</p>
      </BaseCard>
    </div>
  );
};
