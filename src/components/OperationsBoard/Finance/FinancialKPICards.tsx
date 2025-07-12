import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FinancialKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'percentage' | 'number';
}

interface FinancialKPICardsProps {
  kpis: FinancialKPI[];
}

export const FinancialKPICards: React.FC<FinancialKPICardsProps> = ({ kpis }) => {
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
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => {
        const achievementRate = Math.round((kpi.value / kpi.target) * 100);
        
        return (
          <Card key={kpi.id} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 font-arabic text-right">
                  {kpi.title}
                </h3>
                {getTrendIcon(kpi.trend)}
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 text-right">
                  {formatValue(kpi.value, kpi.format)}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className={`font-medium ${getTrendColor(kpi.trend)}`}>
                    {achievementRate}%
                  </div>
                  <div className="text-gray-500 font-arabic">
                    من الهدف: {formatValue(kpi.target, kpi.format)}
                  </div>
                </div>
                
                {/* شريط التقدم */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievementRate >= 100 ? 'bg-green-500' : 
                      achievementRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(achievementRate, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};