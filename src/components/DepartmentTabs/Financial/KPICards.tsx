import React from 'react';
import { NumericStatCard, ComparisonMetricCard } from '@/components/shared/visual-data';
import { mockKPIData } from './data';
import { formatCurrency } from './utils';

export const KPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <NumericStatCard
        title="إجمالي الإيرادات"
        value={formatCurrency(mockKPIData.revenue.value)}
        description={`+${mockKPIData.revenue.change}% عن الشهر السابق`}
        accentColor="var(--visual-data-secondary-1)"
      />
      <NumericStatCard
        title="إجمالي المصروفات"
        value={formatCurrency(mockKPIData.expenses.value)}
        description={`${mockKPIData.expenses.change}% عن الشهر السابق`}
        accentColor="var(--visual-data-secondary-2)"
      />
      <NumericStatCard
        title="صافي الربح"
        value={formatCurrency(mockKPIData.netProfit.value)}
        description={`+${mockKPIData.netProfit.change}% عن الشهر السابق`}
        accentColor="var(--visual-data-secondary-4)"
      />
      <NumericStatCard
        title="التدفق النقدي"
        value={formatCurrency(mockKPIData.cashFlow.value)}
        description={`+${mockKPIData.cashFlow.change}% عن الشهر السابق`}
        accentColor="var(--visual-data-secondary-3)"
      />
    </div>
  );
};
