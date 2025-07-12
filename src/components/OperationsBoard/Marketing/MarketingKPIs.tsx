import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, CircleDollarSign, Percent } from 'lucide-react';
interface MarketingKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  format: 'currency' | 'percentage' | 'number';
  trend: 'up' | 'down' | 'stable';
}
interface MarketingKPIsProps {
  kpis: MarketingKPI[];
  totalROAS: number;
}
export const MarketingKPIs: React.FC<MarketingKPIsProps> = ({
  kpis,
  totalROAS
}) => {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `${value.toLocaleString()} ر.س`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };
  const getIcon = (id: string) => {
    if (id.includes('cpa') || id.includes('ltv')) {
      return <CircleDollarSign className="w-5 h-5 text-primary" />;
    }
    return <Percent className="w-5 h-5 text-primary" />;
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Total ROAS Card */}
      <Card className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">إجمالي عائد الاستثمار</p>
              <p className="text-2xl font-bold">{totalROAS.toFixed(1)}x</p>
            </div>
            <CircleDollarSign className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      {kpis.map(kpi => {
      const achievementRate = kpi.value / kpi.target * 100;
      const isGood = achievementRate >= 100;
      return <Card key={kpi.id} className="glass-enhanced rounded-[40px]">
            <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 leading-tight">{kpi.title}</p>
                </div>
                {getIcon(kpi.id)}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xl font-bold">{formatValue(kpi.value, kpi.format)}</p>
                  <p className="text-xs text-gray-500">
                    الهدف: {formatValue(kpi.target, kpi.format)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-sm font-medium ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                    {achievementRate.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${isGood ? 'bg-green-500' : 'bg-red-500'}`} style={{
                width: `${Math.min(achievementRate, 100)}%`
              }} />
                </div>
              </div>
            </CardContent>
          </Card>;
    })}
    </div>;
};