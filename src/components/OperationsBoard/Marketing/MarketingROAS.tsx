import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE } from '@/components/shared/visual-data';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ROASData {
  channel: string;
  investment: number;
  revenue: number;
  roas: number;
  trend: 'up' | 'down' | 'stable';
}
interface MarketingROASProps {
  roasData: ROASData[];
}

export const MarketingROAS: React.FC<MarketingROASProps> = ({ roasData }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-[#3DBE8B]" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-[#E5564D]" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-[rgba(11,15,18,0.15)]" />;
    }
  };

  return (
    <DataCardFrame title="عائد الاستثمار التسويقي (ROAS)">
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={roasData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} interval={0} angle={-45} textAnchor="end" height={80} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
            <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
            <Bar dataKey="roas" fill="#3DA8F5" radius={[999, 999, 999, 999]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {roasData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-[rgba(11,15,18,0.02)] border border-[#DADCE0] rounded-[18px]">
            <div className="text-right">
              <p className="font-medium text-sm text-[#0B0F12] font-arabic">{item.channel}</p>
              <p className="text-xs text-[rgba(11,15,18,0.40)] font-arabic">
                استثمار: {item.investment.toLocaleString()} ر.س
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(item.trend)}
              <span className="font-bold text-lg text-[#0B0F12] font-arabic">{item.roas.toFixed(1)}x</span>
            </div>
          </div>
        ))}
      </div>
    </DataCardFrame>
  );
};
