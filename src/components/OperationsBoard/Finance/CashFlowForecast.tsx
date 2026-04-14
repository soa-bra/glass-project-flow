import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Line, Tooltip } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE } from '@/components/shared/visual-data';

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

export const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ cashFlowData }) => {
  return (
    <BaseBox className="w-full" title="التنبؤ بالتدفق النقدي">
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d9d2fd" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d9d2fd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} tickFormatter={value => `${value / 1000}ك`} />
            <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
            <Area type="monotone" dataKey="cumulativeBalance" stroke="#a4e2f6" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={2.5} name="الرصيد التراكمي" dot={false} activeDot={{ r: 5, fill: '#a4e2f6', stroke: '#fff', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="netFlow" stroke="#d9d2fd" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#d9d2fd', stroke: '#fff', strokeWidth: 2 }} name="التدفق الصافي" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BaseBox>
  );
};
