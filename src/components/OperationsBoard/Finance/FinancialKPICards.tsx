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
          <Card key={kpi.id} className="relative overflow-hidden rounded-3xl border border-gray-200/50 shadow-sm" style={{ backgroundColor: '#f3ffff' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-black font-arabic text-right">
                  {kpi.title}
                </h3>
                {getTrendIcon(kpi.trend)}
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-black text-right font-arabic">
                  {formatValue(kpi.value, kpi.format)}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-sm font-bold text-black font-arabic">
                    {achievementRate}%
                  </div>
                  <div className="text-xs font-normal text-gray-400 font-arabic">
                    من الهدف: {formatValue(kpi.target, kpi.format)}
                  </div>
                </div>
                
                {/* شريط التقدم */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievementRate >= 100 ? 'bg-black' : 
                      achievementRate >= 80 ? 'bg-black' : 'bg-black'
                    }`}
                    style={{ 
                      width: `${Math.min(achievementRate, 100)}%`,
                      backgroundColor: achievementRate >= 100 ? '#bdeed3' : 
                                      achievementRate >= 80 ? '#fbe2aa' : '#f1b5b9'
                    }}
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