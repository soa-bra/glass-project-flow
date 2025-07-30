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
  
  return (
    <div className="font-arabic px-[15px] py-0">
      {/* قسم المؤشرات المالية الرئيسية */}
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
      <div className="flex justify-between items-center py-0">
        <div className="text-sm font-normal text-black font-arabic">
          دقة التنبؤات: {data.forecastAccuracy}%
        </div>
        <ExportButton />
      </div>
    </div>
  );
};