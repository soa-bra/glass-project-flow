import React from 'react';
import { Download, PieChart, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { buildTitleClasses, COLORS, TYPOGRAPHY, SPACING } from '@/components/shared/design-system/constants';
import { Reveal, Stagger } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { mockExpenseCategories } from './data';
import { formatCurrency } from './utils';

export const AnalysisTab: React.FC = () => {
  const colors = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9B59B6'];

  const scenarios = [
    {
      title: 'السيناريو المتفائل',
      growth: '+25%',
      revenue: 3062500,
      variant: 'success' as const
    },
    {
      title: 'السيناريو الأساسي',
      growth: '+12%',
      revenue: 2744000,
      variant: 'info' as const
    },
    {
      title: 'السيناريو المتحفظ',
      growth: '+5%',
      revenue: 2572500,
      variant: 'warning' as const
    }
  ];

  return (
    <BaseTabContent value="analysis">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className={buildTitleClasses()}>التحليل والتقارير</h3>
          <BaseActionButton variant="primary" icon={<Download className="w-4 h-4" />}>
            تصدير التقرير
          </BaseActionButton>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard 
          title="توزيع المصروفات" 
          icon={<PieChart className="h-5 w-5" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie 
                data={mockExpenseCategories} 
                cx="50%" 
                cy="50%" 
                labelLine={false} 
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 
                outerRadius={80} 
                fill="#8884d8" 
                dataKey="value"
              >
                {mockExpenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </BaseCard>

        <BaseCard 
          title="التنبؤات المالية" 
          icon={<Target className="h-5 w-5" />}
        >
          <Stagger gap={0.1} className="space-y-4">
            {scenarios.map((scenario, index) => (
              <Stagger.Item key={index}>
                <div className={cn(
                  'p-4 rounded-lg',
                  scenario.variant === 'success' && 'bg-green-50 border border-green-200',
                  scenario.variant === 'info' && 'bg-blue-50 border border-blue-200',
                  scenario.variant === 'warning' && 'bg-yellow-50 border border-yellow-200'
                )}>
                  <h4 className={cn(TYPOGRAPHY.BODY, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                    {scenario.title}
                  </h4>
                  <p className={cn(TYPOGRAPHY.SMALL, 'font-medium', COLORS.PRIMARY_TEXT)}>
                    نمو متوقع: {scenario.growth}
                  </p>
                  <p className={cn(TYPOGRAPHY.SMALL, COLORS.SECONDARY_TEXT)}>
                    الإيرادات المتوقعة: {formatCurrency(scenario.revenue)}
                  </p>
                </div>
              </Stagger.Item>
            ))}
          </Stagger>
        </BaseCard>
      </div>
    </BaseTabContent>
  );
};