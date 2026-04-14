import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Users, FileText, RefreshCw, TrendingDown, DollarSign, Heart } from 'lucide-react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

interface PortfolioHealth {
  totalClients: number;
  activeContracts: number;
  renewalRate: number;
  churnRate: number;
  avgContractValue: number;
  clientSatisfaction: number;
}

interface ClientPortfolioHealthProps {
  portfolioHealth: PortfolioHealth;
}

export const ClientPortfolioHealth: React.FC<ClientPortfolioHealthProps> = ({
  portfolioHealth
}) => {
  return (
    <div className="space-y-4">
      {/* إجمالي العملاء */}
      <AppCardSurface density="compact">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-sm text-gray-600">إجمالي العملاء</p>
            <p className="text-2xl font-bold">{portfolioHealth.totalClients}</p>
          </div>
          <Users className="w-8 h-8 text-primary" />
        </div>
      </AppCardSurface>

      {/* العقود النشطة */}
      <AppCardSurface density="compact">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-sm text-gray-600">العقود النشطة</p>
            <p className="text-2xl font-bold">{portfolioHealth.activeContracts}</p>
          </div>
          <FileText className="w-8 h-8 text-green-500" />
        </div>
      </AppCardSurface>

      {/* متوسط قيمة العقد */}
      <AppCardSurface density="compact">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-sm text-gray-600">متوسط قيمة العقد</p>
            <p className="text-2xl font-bold">{portfolioHealth.avgContractValue.toLocaleString()} ر.س</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-500" />
        </div>
      </AppCardSurface>

      {/* معدل التجديد */}
      <AppCardSurface density="compact">
        <div className="flex items-center justify-between mb-2">
          <div className="text-right">
            <p className="text-sm text-gray-600">معدل التجديد</p>
            <p className="text-2xl font-bold text-green-600">{portfolioHealth.renewalRate}%</p>
          </div>
          <RefreshCw className="w-8 h-8 text-green-500" />
        </div>
        <Progress value={portfolioHealth.renewalRate} className="h-2" />
      </AppCardSurface>

      {/* معدل التسرب */}
      <AppCardSurface density="compact">
        <div className="flex items-center justify-between mb-2">
          <div className="text-right">
            <p className="text-sm text-gray-600">معدل التسرب</p>
            <p className="text-2xl font-bold text-red-600">{portfolioHealth.churnRate}%</p>
          </div>
          <TrendingDown className="w-8 h-8 text-red-500" />
        </div>
        <Progress value={portfolioHealth.churnRate} className="h-2" />
      </AppCardSurface>

      {/* رضا العملاء */}
      <AppCardSurface density="compact">
        <div className="flex items-center justify-between mb-2">
          <div className="text-right">
            <p className="text-sm text-gray-600">رضا العملاء</p>
            <p className="text-2xl font-bold text-primary">{portfolioHealth.clientSatisfaction}/5</p>
          </div>
          <Heart className="w-8 h-8 text-pink-500" />
        </div>
        <Progress value={portfolioHealth.clientSatisfaction / 5 * 100} className="h-2" />
      </AppCardSurface>
    </div>
  );
};
