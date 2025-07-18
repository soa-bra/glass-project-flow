import React, { useState } from 'react';
import { BudgetVsActualChart } from './Finance/BudgetVsActualChart';
import { CashFlowForecast } from './Finance/CashFlowForecast';
import { FinancialKPICards } from './Finance/FinancialKPICards';
import { ExportButton } from './Finance/ExportButton';
import { FinancialManagementModal } from './Finance/FinancialManagementModal';
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
export const FinanceTab: React.FC<FinanceTabProps> = ({
  data,
  loading
}) => {
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  
  // هذا يجب أن يأتي من context المستخدم الحقيقي
  const userRole = 'department_manager'; // محاكاة دور المستخدم
  
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }
  return <div style={{
    backgroundColor: '#f3ffff'
  }} className="overflow-auto bg-transparent">
      {/* العنوان و KPI في نفس السطر */}
      <div style={{
      backgroundColor: '#f3ffff'
    }} className="flex justify-between items-start pt-6 bg-transparent mx-[50px]">
        <div className="text-right">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFinancialModal(true)}
              className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 font-arabic text-sm"
            >
              إدارة الأوضاع المالية
            </button>
          </div>
          <h2 className="text-lg font-semibold text-black font-arabic mb-1">الوضع المالي</h2>
          <p className="text-xs font-normal text-gray-400 font-arabic">مراقبة الأداء المالي الكلي والتنبؤات النقدية</p>
        </div>
        <div className="flex-auto max-w-7xl mx-0 px-0">
          <FinancialKPICards kpis={data.kpis} />
        </div>
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <BudgetVsActualChart monthlyData={data.monthlyBudget} />
        <CashFlowForecast cashFlowData={data.cashFlow} />
      </div>
      
      {/* أدوات التصدير والتحليل */}
      <div className="flex justify-between items-center pt-4 px-6">
        <div className="text-sm font-normal text-black font-arabic">
          دقة التنبؤات: {data.forecastAccuracy}%
        </div>
        <ExportButton userRole={userRole} />
      </div>
      
      {/* نافذة إدارة الأوضاع المالية */}
      <FinancialManagementModal
        isOpen={showFinancialModal}
        onClose={() => setShowFinancialModal(false)}
        userRole={userRole}
      />
    </div>;
};