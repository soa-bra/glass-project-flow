
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
      className="h-full p-6 rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] overflow-hidden"
    >
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-arabic font-semibold text-gray-800">التحليل البياني</h3>
        <button className="text-xs bg-white/40 backdrop-filter backdrop-blur-lg text-gray-600 px-3 py-1 rounded-lg font-arabic border border-white/20 hover:bg-white/60 transition-colors">
          تفاصيل
        </button>
      </div>

      {/* المحتوى مقسم لنصفين */}
      <div className="flex gap-4 h-full overflow-hidden">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800 font-arabic">46</div>
            <div className="text-sm text-gray-500 font-arabic">مليار</div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 font-arabic leading-relaxed">هذا النص مثال للشكل البياني</p>
            <p className="text-xs text-gray-500 font-arabic">تحليل الأداء الشهري</p>
          </div>
        </div>

        {/* الرسم البياني - النصف الثاني بنسبة 16:9 */}
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <div 
            className="w-full max-w-[120px]"
            style={{ aspectRatio: '16/9' }}
          >
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
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <YAxis hide />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#a4e2f6" 
                    strokeWidth={2} 
                    dot={{ fill: '#a4e2f6', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4, fill: '#a4e2f6' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
