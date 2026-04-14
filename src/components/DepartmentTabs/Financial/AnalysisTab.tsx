import React from 'react';
import { Download, Target } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { RingMetricCard } from '@/components/shared/visual-data';
import { SPACING } from '@/components/shared/design-system/constants';
import { Reveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { mockExpenseCategories } from './data';
import { formatCurrency } from './utils';

const COLORS = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9B59B6'];

export const AnalysisTab: React.FC = () => {
  const totalExpenses = mockExpenseCategories.reduce((s, c) => s + c.value, 0);

  const scenarios = [
    { title: 'السيناريو المتفائل', growth: '+25%', revenue: 3062500, color: '#3DBE8B' },
    { title: 'السيناريو الأساسي', growth: '+12%', revenue: 2744000, color: '#3DA8F5' },
    { title: 'السيناريو المتحفظ', growth: '+5%', revenue: 2572500, color: '#F6C445' },
  ];

  return (
    <BaseTabContent value="analysis">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className="text-lg font-bold text-[#0B0F12] font-arabic">التحليل والتقارير</h3>
          <BaseActionButton variant="primary" icon={<Download className="w-4 h-4" />}>
            تصدير التقرير
          </BaseActionButton>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ring Metric — expense distribution */}
        <RingMetricCard
          title="توزيع المصروفات"
          centerValue={formatCurrency(totalExpenses)}
          centerUnit="ر.س"
          layers={mockExpenseCategories.map((cat, i) => ({
            value: Math.round((cat.value / totalExpenses) * 100),
            color: COLORS[i % COLORS.length],
            label: cat.name,
          }))}
        />

        {/* Scenarios */}
        <DataCardFrame title="التنبؤات المالية" icon={<Target className="h-5 w-5" />}>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div key={index} className="rounded-[18px] border border-[#DADCE0] p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[rgba(11,15,18,0.50)] font-arabic mb-1">{scenario.title}</p>
                  <p className="text-[28px] leading-none font-bold text-[#0B0F12] font-arabic">
                    {formatCurrency(scenario.revenue)}
                  </p>
                </div>
                <div
                  className="text-sm font-bold font-arabic px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${scenario.color}20`, color: scenario.color }}
                >
                  {scenario.growth}
                </div>
              </div>
            ))}
          </div>
        </DataCardFrame>
      </div>
    </BaseTabContent>
  );
};
