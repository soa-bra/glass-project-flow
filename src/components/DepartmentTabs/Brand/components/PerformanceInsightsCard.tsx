
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { TrendingUp } from 'lucide-react';

export const PerformanceInsightsCard: React.FC = () => {
  const insights = [
    {
      value: '15.2K',
      label: 'التفاعل الشهري',
      change: '+12% عن الشهر الماضي'
    },
    {
      value: '89%',
      label: 'رضا العملاء الثقافي',
      change: '+5% عن الربع الماضي'
    },
    {
      value: '94%',
      label: 'التزام الموظفين بالقيم',
      change: '+8% عن العام الماضي'
    }
  ];

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">رؤى الأداء الثقافي</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="text-3xl font-bold text-black font-arabic">{insight.value}</div>
            <div className="text-sm text-black font-arabic">{insight.label}</div>
            <div className="text-xs text-black flex items-center justify-center gap-1 font-arabic">
              <TrendingUp className="h-3 w-3" />
              {insight.change}
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
