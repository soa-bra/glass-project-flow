import React from 'react';
import { FinancialKPICards } from './FinancialKPICards';
import { BudgetVsActualChart } from './BudgetVsActualChart';
import { CashFlowForecast } from './CashFlowForecast';
import { ExportButton } from './ExportButton';
import { FinanceData } from '../FinanceTab';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

interface FinanceLayoutProps {
  data: FinanceData;
}

/**
 * تخطيط الوضع المالي - يعرض البيانات المالية والمؤشرات الرئيسية
 */
export const FinanceLayout: React.FC<FinanceLayoutProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* قسم المؤشرات المالية الرئيسية */}
      <FinancialKPICards kpis={data.kpis} />

      {/* الرسوم البيانية + أدوات التصدير في صف واحد */}
      <AppDashboardGrid columns={12} density="spacious">
        <AppGridItem colSpan={7} tabletSpan={6}>
          <BudgetVsActualChart monthlyData={data.monthlyBudget} />
        </AppGridItem>
        <AppGridItem colSpan={5} tabletSpan={6}>
          <CashFlowForecast cashFlowData={data.cashFlow} />
        </AppGridItem>
      </AppDashboardGrid>

      {/* أدوات التصدير والتحليل */}
      <div className="flex justify-between items-center pt-4 border-t border-[#DADCE0] mx-[30px]">
        <div className="text-sm font-normal text-[rgba(11,15,18,0.6)]">
          دقة التنبؤات: {data.forecastAccuracy}%
        </div>
        <ExportButton />
      </div>
    </div>
  );
};
