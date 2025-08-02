
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Target, BarChart } from 'lucide-react';
import { UnifiedSystemStats } from '@/components/ui/UnifiedSystemStats';
import { mockKPIData } from './data';
import { formatCurrency } from './utils';

export const KPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UnifiedSystemStats
        title="إجمالي الإيرادات"
        value={formatCurrency(mockKPIData.revenue.value)}
        icon={<DollarSign />}
        trend={{
          value: mockKPIData.revenue.change,
          isPositive: true
        }}
      />

      <UnifiedSystemStats
        title="إجمالي المصروفات"
        value={formatCurrency(mockKPIData.expenses.value)}
        icon={<Wallet />}
        trend={{
          value: Math.abs(mockKPIData.expenses.change),
          isPositive: false
        }}
      />

      <UnifiedSystemStats
        title="صافي الربح"
        value={formatCurrency(mockKPIData.netProfit.value)}
        icon={<Target />}
        trend={{
          value: mockKPIData.netProfit.change,
          isPositive: true
        }}
      />

      <UnifiedSystemStats
        title="التدفق النقدي"
        value={formatCurrency(mockKPIData.cashFlow.value)}
        icon={<BarChart />}
        trend={{
          value: mockKPIData.cashFlow.change,
          isPositive: true
        }}
      />
    </div>
  );
};
