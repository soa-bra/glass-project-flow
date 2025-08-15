
import React from 'react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Target, BarChart } from 'lucide-react';
import { BaseCard } from '@/components/shared/BaseCard';
import { mockKPIData } from './data';
import { formatCurrency } from './utils';

export const KPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-green-600">{formatCurrency(mockKPIData.revenue.value)}</h3>
              <Badge variant="default" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{mockKPIData.revenue.change}%
              </Badge>
            </div>
          </div>
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </BaseCard>

      <BaseCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي المصروفات</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-red-600">{formatCurrency(mockKPIData.expenses.value)}</h3>
              <Badge variant="destructive" className="text-xs">
                <TrendingDown className="w-3 h-3 mr-1" />
                {mockKPIData.expenses.change}%
              </Badge>
            </div>
          </div>
          <Wallet className="h-8 w-8 text-red-600" />
        </div>
      </BaseCard>

      <BaseCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">صافي الربح</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(mockKPIData.netProfit.value)}</h3>
              <Badge variant="default" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{mockKPIData.netProfit.change}%
              </Badge>
            </div>
          </div>
          <Target className="h-8 w-8 text-blue-600" />
        </div>
      </BaseCard>

      <BaseCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">التدفق النقدي</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-purple-600">{formatCurrency(mockKPIData.cashFlow.value)}</h3>
              <Badge variant="default" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{mockKPIData.cashFlow.change}%
              </Badge>
            </div>
          </div>
          <BarChart className="h-8 w-8 text-purple-600" />
        </div>
      </BaseCard>
    </div>
  );
};
