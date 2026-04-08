import React from 'react';
import { Download, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { SPACING } from '@/components/shared/design-system/constants';
import { Reveal, Stagger } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { mockExpenseCategories } from './data';
import { formatCurrency } from './utils';

export const AnalysisTab: React.FC = () => {
  const colors = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9B59B6'];

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
        {/* Pie Chart */}
        <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
          <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase">
            توزيع المصروفات
          </span>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPieChart>
                <Pie
                  data={mockExpenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  innerRadius={50}
                  strokeWidth={0}
                  dataKey="value"
                >
                  {mockExpenseCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B0F12',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    padding: '8px 12px',
                  }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scenarios */}
        <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-[#0B0F12]" />
            <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase">
              التنبؤات المالية
            </span>
          </div>
          <Stagger gap={0.1} className="space-y-4 flex-1">
            {scenarios.map((scenario, index) => (
              <Stagger.Item key={index}>
                <div className="rounded-[18px] border border-[#DADCE0] p-5 flex items-center justify-between">
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
              </Stagger.Item>
            ))}
          </Stagger>
        </div>
      </div>
    </BaseTabContent>
  );
};
