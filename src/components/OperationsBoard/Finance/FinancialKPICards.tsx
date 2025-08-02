import React from 'react';
import { UnifiedSystemStats } from '@/components/ui/UnifiedSystemStats';
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
export const FinancialKPICards: React.FC<FinancialKPICardsProps> = ({
  kpis
}) => {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `${value.toLocaleString()}`;
      case 'percentage':
        return `${value}`;
      default:
        return value.toLocaleString();
    }
  };

  const getUnit = (format: string) => {
    switch (format) {
      case 'currency':
        return 'الف ريال';
      case 'percentage':
        return '%';
      default:
        return '';
    }
  };

  const getDescription = (kpi: FinancialKPI) => {
    const achievementRate = Math.round((kpi.value / kpi.target) * 100);
    return `${achievementRate}% من الهدف المحدد`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map(kpi => (
        <UnifiedSystemStats
          key={kpi.id}
          title={kpi.title}
          value={formatValue(kpi.value, kpi.format)}
          subtitle={`${getUnit(kpi.format)} - ${getDescription(kpi)}`}
          trend={kpi.trend !== 'stable' ? {
            value: Math.round((kpi.value / kpi.target) * 100),
            isPositive: kpi.trend === 'up'
          } : undefined}
        />
      ))}
    </div>
  );
};