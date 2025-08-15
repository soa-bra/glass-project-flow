import React from 'react';
import { FinanceLayout } from './Finance/FinanceLayout';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';

interface MonthlyBudget {
  month: string;
  budget: number;
  actual: number;
  variance: number;
}

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeBalance: number;
}

interface FinancialKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'percentage' | 'number';
}

export interface FinanceData {
  monthlyBudget: MonthlyBudget[];
  cashFlow: CashFlowData[];
  kpis: FinancialKPI[];
  totalBudget: number;
  totalSpent: number;
  forecastAccuracy: number;
}

interface FinanceTabProps {
  data?: FinanceData;
  loading: boolean;
}

/**
 * تبويب الوضع المالي - يعرض البيانات المالية والمؤشرات الرئيسية
 */
export const FinanceTab: React.FC<FinanceTabProps> = ({
  data,
  loading
}) => {
  // تحويل البيانات إلى تنسيق KPI
  const kpiStats = data ? [{
    title: 'إجمالي الميزانية',
    value: (data.totalBudget / 1000).toFixed(0),
    unit: 'ألف ر.س',
    description: 'للعام الحالي'
  }, {
    title: 'المبلغ المنفق',
    value: (data.totalSpent / 1000).toFixed(0),
    unit: 'ألف ر.س',
    description: `${((data.totalSpent / data.totalBudget) * 100).toFixed(1)}% من الميزانية`
  }, {
    title: 'دقة التوقعات',
    value: data.forecastAccuracy.toFixed(1),
    unit: '%',
    description: 'دقة التنبؤات المالية'
  }] : [];

  return (
    <BaseOperationsTabLayout
      value="finance"
      kpiStats={kpiStats}
      loading={loading}
      error={!data && !loading ? "لا توجد بيانات مالية متاحة" : undefined}
    >
      {data && <FinanceLayout data={data} />}
    </BaseOperationsTabLayout>
  );
};