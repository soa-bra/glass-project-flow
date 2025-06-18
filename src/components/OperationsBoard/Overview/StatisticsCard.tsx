
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StatisticsCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  chartType?: 'line' | 'bar' | 'simple';
  chartData?: any[];
}

const sampleLineData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 35 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 40 },
];

const sampleBarData = [
  { name: 'A', value: 20 },
  { name: 'B', value: 35 },
  { name: 'C', value: 25 },
  { name: 'D', value: 15 },
];

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  unit,
  description,
  chartType = 'simple',
  chartData
}) => {
  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <div className="h-16 mt-2">
          <ChartContainer
            config={{ value: { label: "القيمة", color: "#d9d2fd" } }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData || sampleLineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#d9d2fd" 
                  strokeWidth={2}
                  dot={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      );
    }

    if (chartType === 'bar') {
      return (
        <div className="h-16 mt-2">
          <ChartContainer
            config={{ value: { label: "القيمة", color: "#bdeed3" } }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData || sampleBarData}>
                <Bar dataKey="value" fill="#bdeed3" radius={[2, 2, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      );
    }

    return null;
  };

  return (
    <BaseCard 
      variant="glass" 
      size="md"
      className="h-[200px]"
      header={
        <h3 className="text-sm font-bold text-gray-800 font-arabic">{title}</h3>
      }
    >
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-3xl font-bold text-black font-arabic">
            {value}
          </div>
          <div className="text-sm font-bold text-gray-700 font-arabic">
            {unit}
          </div>
        </div>
        
        <div className="text-xs text-gray-600 font-arabic mb-2">
          {description}
        </div>

        {renderChart()}
      </div>
    </BaseCard>
  );
};
