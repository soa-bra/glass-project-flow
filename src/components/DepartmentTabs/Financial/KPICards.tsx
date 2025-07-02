
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Target, BarChart, Download } from 'lucide-react';
import { mockKPIData } from './data';
import { formatCurrency } from './utils';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

export const KPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black font-arabic">إجمالي الإيرادات</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-black">{formatCurrency(mockKPIData.revenue.value)}</h3>
              <div className="px-2 py-1 rounded-full text-xs font-normal text-black bg-[#bdeed3]">
                <TrendingUp className="w-3 h-3 mr-1 inline" />
                +{mockKPIData.revenue.change}%
              </div>
            </div>
          </div>
          <CircularIconButton 
            icon={DollarSign}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
      </div>

      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black font-arabic">إجمالي المصروفات</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-black">{formatCurrency(mockKPIData.expenses.value)}</h3>
              <div className="px-2 py-1 rounded-full text-xs font-normal text-black bg-[#f1b5b9]">
                <TrendingDown className="w-3 h-3 mr-1 inline" />
                {mockKPIData.expenses.change}%
              </div>
            </div>
          </div>
          <CircularIconButton 
            icon={Wallet}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
      </div>

      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black font-arabic">صافي الربح</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-black">{formatCurrency(mockKPIData.netProfit.value)}</h3>
              <div className="px-2 py-1 rounded-full text-xs font-normal text-black bg-[#a4e2f6]">
                <TrendingUp className="w-3 h-3 mr-1 inline" />
                +{mockKPIData.netProfit.change}%
              </div>
            </div>
          </div>
          <CircularIconButton 
            icon={Target}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
      </div>

      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black font-arabic">التدفق النقدي</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-black">{formatCurrency(mockKPIData.cashFlow.value)}</h3>
              <div className="px-2 py-1 rounded-full text-xs font-normal text-black bg-[#d9d2fd]">
                <TrendingUp className="w-3 h-3 mr-1 inline" />
                +{mockKPIData.cashFlow.change}%
              </div>
            </div>
          </div>
          <CircularIconButton 
            icon={BarChart}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
      </div>
    </div>
  );
};
