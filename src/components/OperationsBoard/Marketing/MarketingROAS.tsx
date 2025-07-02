import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
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
  const chartConfig = {
    roas: {
      label: "عائد الاستثمار",
      color: "hsl(var(--primary))",
    },
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic">عائد الاستثمار التسويقي (ROAS)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roasData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="channel" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="roas" fill="var(--color-roas)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {roasData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/20 rounded-2xl">
              <div className="text-right">
                <p className="font-medium text-sm">{item.channel}</p>
                <p className="text-xs text-gray-600">
                  استثمار: {item.investment.toLocaleString()} ر.س
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(item.trend)}
                <span className="font-bold text-lg">{item.roas.toFixed(1)}x</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};