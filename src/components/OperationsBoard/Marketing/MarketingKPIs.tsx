import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
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

  const getDescription = (kpi: MarketingKPI) => {
    const achievementRate = Math.round((kpi.value / kpi.target) * 100);
    return `${achievementRate}% من الهدف المحدد`;
  };

  // إنشاء بيانات الإحصائيات مع إضافة ROAS الإجمالي
  const statsData = [
    {
      title: 'إجمالي عائد الاستثمار',
      value: totalROAS.toFixed(1),
      unit: 'x',
      description: 'عائد الاستثمار الكلي للحملات'
    },
    ...kpis.map(kpi => ({
      title: kpi.title,
      value: formatValue(kpi.value, kpi.format),
      unit: getUnit(kpi.format),
      description: getDescription(kpi)
    }))
  ];

  return <KPIStatsSection stats={statsData} />;
};