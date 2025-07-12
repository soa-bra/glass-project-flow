
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
    return <div className="h-full flex items-center justify-center text-sm font-normal text-black font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6 h-full overflow-auto px-4">
      <div className="text-right">
        <h2 className="text-large font-semibold text-black font-arabic mb-1">الوضع المالي</h2>
        <p className="text-sm font-normal text-black font-arabic">مراقبة الأداء المالي الكلي والتنبؤات النقدية</p>
      </div>
      
      {/* مؤشرات الأداء المالي الرئيسية */}
      <FinancialKPICards kpis={data.kpis} />
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BudgetVsActualChart monthlyData={data.monthlyBudget} />
        <CashFlowForecast cashFlowData={data.cashFlow} />
      </div>
      
      {/* أدوات التصدير والتحليل */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm font-normal text-black font-arabic">
          دقة التنبؤات: {data.forecastAccuracy}%
        </div>
        <ExportButton />
      </div>
    </div>
  );
};
