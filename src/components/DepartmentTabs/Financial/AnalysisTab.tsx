import React from 'react';
import { Download, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { SPACING } from '@/components/shared/design-system/constants';
import { Reveal } from '@/components/shared/motion';
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
        <DataCardFrame title="توزيع المصروفات">
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
        </DataCardFrame>

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
