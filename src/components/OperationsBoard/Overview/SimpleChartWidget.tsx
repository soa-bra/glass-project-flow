
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface SimpleChartWidgetProps {
  title: string;
  data: ChartDataPoint[];
  className?: string;
}

export const SimpleChartWidget: React.FC<SimpleChartWidgetProps> = ({
  title,
  data,
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="mb-6">
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">{title}</h3>
      </header>
      
      <div className="space-y-4 flex-1">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-[#23272f]">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GenericCard>
  );
};
