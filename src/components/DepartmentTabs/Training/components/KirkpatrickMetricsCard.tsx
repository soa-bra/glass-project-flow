
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { mockTrainingMetrics } from '../data';

export const KirkpatrickMetricsCard: React.FC = () => {
  const metrics = mockTrainingMetrics;

  const kirkpatrickMetrics = [
    { name: 'رد الفعل', value: metrics.kirkpatrickMetrics.reaction },
    { name: 'التعلم', value: metrics.kirkpatrickMetrics.learning },
    { name: 'السلوك', value: metrics.kirkpatrickMetrics.behavior },
    { name: 'النتائج', value: metrics.kirkpatrickMetrics.results }
  ];

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">مؤشرات كيركباتريك للتقييم</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kirkpatrickMetrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-black font-arabic">{metric.name}</span>
              <span className="text-sm text-black font-arabic">{metric.value}/5</span>
            </div>
            <Progress value={(metric.value / 5) * 100} className="h-2" />
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
