import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeBalance: number;
}

interface CashFlowForecastProps {
  cashFlowData: CashFlowData[];
}

const chartConfig = {
  cumulativeBalance: {
    label: "الرصيد التراكمي",
    color: "hsl(var(--chart-3))",
  },
  netFlow: {
    label: "التدفق الصافي",
    color: "hsl(var(--chart-4))",
  },
};

export const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ cashFlowData }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right font-arabic text-lg">
          التنبؤ بالتدفق النقدي
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cumulativeBalance)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-cumulativeBalance)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
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
              <Area
                type="monotone"
                dataKey="cumulativeBalance"
                stroke="var(--color-cumulativeBalance)"
                fillOpacity={1}
                fill="url(#colorBalance)"
                strokeWidth={2}
                name="الرصيد التراكمي"
              />
              <Line
                type="monotone"
                dataKey="netFlow"
                stroke="var(--color-netFlow)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="التدفق الصافي"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};