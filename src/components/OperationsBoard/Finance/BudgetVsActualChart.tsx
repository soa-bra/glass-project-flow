import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="w-full rounded-3xl border border-gray-200/50 shadow-sm" style={{ backgroundColor: '#f3ffff' }}>
      <CardHeader>
        <CardTitle className="text-right font-arabic text-lg font-semibold text-black">
          الميزانية مقابل الإنفاق الفعلي (شهري)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
                stroke="#000000"
                strokeWidth={1}
              />
              <Bar 
                dataKey="actual" 
                fill="#a4e2f6" 
                radius={[4, 4, 0, 0]}
                name="الإنفاق الفعلي"
                stroke="#000000"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};