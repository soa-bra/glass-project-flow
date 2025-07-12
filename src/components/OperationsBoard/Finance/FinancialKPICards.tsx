
import React from 'react';

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
        return value.toString();
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#bdeed3';
      case 'down':
        return '#f1b5b9';
      default:
        return '#f3ffff';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div 
          key={kpi.id} 
          className="p-6 rounded-3xl border border-gray-200/50"
          style={{ 
            backgroundColor: getTrendColor(kpi.trend),
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="text-center">
            <h3 className="text-sm font-bold text-black font-arabic mb-2">{kpi.title}</h3>
            <div className="text-2xl font-bold text-black font-arabic mb-1">
              {formatValue(kpi.value, kpi.format)}
            </div>
            <div className="text-xs font-normal text-gray-400 font-arabic">
              الهدف: {formatValue(kpi.target, kpi.format)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
