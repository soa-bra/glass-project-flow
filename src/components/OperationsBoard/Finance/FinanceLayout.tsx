import React from 'react';
import { FinancialKPICards } from './FinancialKPICards';
import { BudgetVsActualChart } from './BudgetVsActualChart';
import { CashFlowForecast } from './CashFlowForecast';
import { ExportButton } from './ExportButton';
import { FinanceData } from '../FinanceTab';
interface FinanceLayoutProps {
  data: FinanceData;
}

/**
 * تخطيط الوضع المالي - يعرض البيانات المالية والمؤشرات الرئيسية
 */
export const FinanceLayout: React.FC<FinanceLayoutProps> = ({
  data
}) => {
  return <div className="space-y-6">
      {/* قسم المؤشرات المالية الرئيسية */}
      <div className="mb-6">
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
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mx-[30px]">
        <div className="text-sm font-normal text-gray-600">
          دقة التنبؤات: {data.forecastAccuracy}%
        </div>
        <ExportButton />
      </div>
    </div>;
};