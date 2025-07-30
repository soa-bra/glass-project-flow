import React from 'react';
import { FinanceLayout } from './Finance/FinanceLayout';

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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 font-arabic">
        جارٍ التحميل...
      </div>
    );
  }

  // التأكد من وجود البيانات
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 font-arabic">
        لا توجد بيانات متاحة
      </div>
    );
  }

  return <FinanceLayout data={data} />;
};