import React from 'react';

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

export const MarketingKPIs: React.FC<MarketingKPIsProps> = ({ kpis, totalROAS }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};