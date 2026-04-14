import React from 'react';
import { NumericStatCard, ComparisonMetricCard } from '@/components/shared/visual-data';
import { mockKPIData } from './data';
import { formatCurrency } from './utils';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

export const KPICards: React.FC = () => {
  return (
    <AppDashboardGrid columns={12} density="default" minRowHeight="auto" className="mb-8">
      <AppGridItem colSpan={3}>
        <NumericStatCard
          title="إجمالي الإيرادات"
          value={formatCurrency(mockKPIData.revenue.value)}
          description={`+${mockKPIData.revenue.change}% عن الشهر السابق`}
          accentColor="var(--visual-data-secondary-1)"
        />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <NumericStatCard
          title="إجمالي المصروفات"
          value={formatCurrency(mockKPIData.expenses.value)}
          description={`${mockKPIData.expenses.change}% عن الشهر السابق`}
          accentColor="var(--visual-data-secondary-2)"
        />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <NumericStatCard
          title="صافي الربح"
          value={formatCurrency(mockKPIData.netProfit.value)}
          description={`+${mockKPIData.netProfit.change}% عن الشهر السابق`}
          accentColor="var(--visual-data-secondary-4)"
        />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <NumericStatCard
          title="التدفق النقدي"
          value={formatCurrency(mockKPIData.cashFlow.value)}
          description={`+${mockKPIData.cashFlow.change}% عن الشهر السابق`}
          accentColor="var(--visual-data-secondary-3)"
        />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
