
import React from 'react';
import { BudgetVsActualChart } from './Finance/BudgetVsActualChart';
import { CashFlowForecast } from './Finance/CashFlowForecast';
import { FinancialKPICards } from './Finance/FinancialKPICards';
import { ExportButton } from './Finance/ExportButton';

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

export const FinanceTab: React.FC<FinanceTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="font-arabic px-[15px] py-0">
      {/* مؤشرات الأداء المالي الرئيسية */}
      <div className="mb-6 py-0 px-0 my-0">
        <FinancialKPICards kpis={data.kpis} />
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BudgetVsActualChart monthlyData={data.monthlyBudget} />
          <CashFlowForecast cashFlowData={data.cashFlow} />
        </div>
      </div>
      
      {/* أدوات التصدير والتحليل */}
      <div className="py-0">
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-600 font-arabic">
            دقة التنبؤات: {data.forecastAccuracy}%
          </div>
          <ExportButton />
        </div>
      </div>
    </div>
  );
};
