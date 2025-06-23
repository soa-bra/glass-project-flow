
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const chartData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 35 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 40 },
  { name: 'Jun', value: 60 }
];

export const DataVisualizationCard: React.FC = () => {
  return (
    <div 
      className="h-full p-6 rounded-3xl border border-white/20"
      style={{
        background: '#f7ffff',
      }}
    >
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-arabic font-semibold text-gray-800">التحليل البياني</h3>
        <button className="text-xs bg-white/40 backdrop-filter backdrop-blur-lg text-gray-600 px-3 py-1 rounded-lg font-arabic border border-white/20 hover:bg-white/60 transition-colors">
          تفاصيل
        </button>
      </div>

      {/* الرقم الرئيسي */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-800 font-arabic">46</div>
        <div className="text-sm text-gray-500 font-arabic">مليار</div>
      </div>

      {/* الرسم البياني */}
      <div className="h-32 mb-4">
        <ChartContainer
          config={{
            value: {
              label: "القيمة",
              color: "#a4e2f6"
            }
          }}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#a4e2f6" 
                strokeWidth={3} 
                dot={{ fill: '#a4e2f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#a4e2f6' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* النص السفلي */}
      <div className="text-center">
        <p className="text-xs text-gray-500 font-arabic leading-relaxed">هذا النص مثال للشكل البياني</p>
        <p className="text-xs text-gray-500 font-arabic">تحليل الأداء الشهري</p>
      </div>
    </div>
  );
};
