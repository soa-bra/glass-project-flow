import React from 'react';
import { ComparisonMetricCard } from '@/components/shared/visual-data';
import { mockKPIData } from './data';
import { formatCurrency } from './utils';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

export const KPICards: React.FC = () => {
  return (
    <AppDashboardGrid columns={12} density="default" minRowHeight="auto" className="mb-8">
      <AppGridItem colSpan={3}>
        <ComparisonMetricCard
          title="إجمالي الإيرادات"
          value={formatCurrency(mockKPIData.revenue.value)}
          changeValue={`${mockKPIData.revenue.change}%`}
          changeDirection="up"
          changeLabel="عن الشهر السابق"
          accentColor="var(--visual-data-secondary-1)"
        />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <ComparisonMetricCard
          title="إجمالي المصروفات"
          value={formatCurrency(mockKPIData.expenses.value)}
          changeValue={`${Math.abs(mockKPIData.expenses.change)}%`}
          changeDirection="down"
          changeLabel="عن الشهر السابق"
          accentColor="var(--visual-data-secondary-2)"
        />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <ComparisonMetricCard
          title="صافي الربح"
          value={formatCurrency(mockKPIData.netProfit.value)}
          changeValue={`${mockKPIData.netProfit.change}%`}
          changeDirection="up"
          changeLabel="عن الشهر السابق"
          accentColor="var(--visual-data-secondary-4)"
        />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <ComparisonMetricCard
          title="التدفق النقدي"
          value={formatCurrency(mockKPIData.cashFlow.value)}
          changeValue={`${mockKPIData.cashFlow.change}%`}
          changeDirection="up"
          changeLabel="عن الشهر السابق"
          accentColor="var(--visual-data-secondary-3)"
        />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
