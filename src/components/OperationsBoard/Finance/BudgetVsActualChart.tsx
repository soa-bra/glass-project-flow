import React from 'react';
import { BaseCard } from '@/components/shared/BaseCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

interface MonthlyBudget {
  month: string;
  budget: number;
  actual: number;
  variance: number;
}

interface BudgetVsActualChartProps {
  monthlyData: MonthlyBudget[];
}

const chartConfig = {
  budget: {
    label: "الميزانية المخططة",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "الإنفاق الفعلي", 
    color: "hsl(var(--chart-2))",
  },
};

export const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ monthlyData }) => {
  return (
    <BaseCard
      className="w-full"
      title="الميزانية مقابل الإنفاق الفعلي (شهري)"
    >
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}ك`}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} ر.س`,
                    name
                  ]}
                />
              }
            />
            <Legend />
            <Bar 
              dataKey="budget" 
              fill="#bdeed3" 
              radius={[4, 4, 0, 0]}
              name="الميزانية المخططة"
            />
            <Bar 
              dataKey="actual" 
              fill="#a4e2f6" 
              radius={[4, 4, 0, 0]}
              name="الإنفاق الفعلي"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </BaseCard>
  );
};