import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, FileText, RefreshCw, TrendingDown, DollarSign, Heart } from 'lucide-react';

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

export const ClientPortfolioHealth: React.FC<ClientPortfolioHealthProps> = ({ portfolioHealth }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* إجمالي العملاء */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">إجمالي العملاء</p>
              <p className="text-2xl font-bold">{portfolioHealth.totalClients}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* العقود النشطة */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">العقود النشطة</p>
              <p className="text-2xl font-bold">{portfolioHealth.activeContracts}</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* متوسط قيمة العقد */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">متوسط قيمة العقد</p>
              <p className="text-2xl font-bold">{portfolioHealth.avgContractValue.toLocaleString()} ر.س</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* معدل التجديد */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">معدل التجديد</p>
              <p className="text-2xl font-bold text-green-600">{portfolioHealth.renewalRate}%</p>
            </div>
            <RefreshCw className="w-8 h-8 text-green-500" />
          </div>
          <Progress value={portfolioHealth.renewalRate} className="h-2" />
        </CardContent>
      </Card>

      {/* معدل التسرب */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">معدل التسرب</p>
              <p className="text-2xl font-bold text-red-600">{portfolioHealth.churnRate}%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <Progress value={portfolioHealth.churnRate} className="h-2" />
        </CardContent>
      </Card>

      {/* رضا العملاء */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">رضا العملاء</p>
              <p className="text-2xl font-bold text-primary">{portfolioHealth.clientSatisfaction}/5</p>
            </div>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <Progress value={(portfolioHealth.clientSatisfaction / 5) * 100} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
};