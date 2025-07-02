import React from 'react';

interface Attribution {
  touchpoint: string;
  conversions: number;
  revenue: number;
  percentage: number;
}

interface AttributionChartProps {
  attribution: Attribution[];
}

export const AttributionChart: React.FC<AttributionChartProps> = ({ attribution }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};