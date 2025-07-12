import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
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

  const statsData = kpis.map(kpi => ({
    title: kpi.title,
    value: formatValue(kpi.value, kpi.format),
    unit: getUnit(kpi.format),
    description: getDescription(kpi)
  }));

  return <KPIStatsSection stats={statsData} />;
};