
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface FinancialData {
  total: number;
  segments: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

interface FinancialOverviewChartProps {
  title: string;
  data: FinancialData;
  isProfit?: boolean;
}

export const FinancialOverviewChart: React.FC<FinancialOverviewChartProps> = ({
  title,
  data,
  isProfit = true
}) => {
  return (
    <div className={`
      operations-board-card
      ${isProfit ? 'financial-card-profit' : 'financial-card-loss'}
    `}>
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          {title}
        </h3>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex items-center justify-between mb-6">
        {/* الرقم الكبير */}
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-gray-900 font-arabic">
            {data.total}%
          </span>
          <span className="text-sm text-gray-700 font-arabic mt-1">
            {isProfit ? 'ربح' : 'خسارة'}
          </span>
        </div>

        {/* الرسم البياني الدائري */}
        <div className="w-20 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.segments}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={35}
                paddingAngle={2}
                dataKey="value"
              >
                {data.segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* قائمة العناصر */}
      <div className="space-y-2">
        {data.segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-xs text-gray-700 font-arabic flex-1">
              {segment.label}
            </span>
            <span className="text-xs font-bold text-gray-800">
              {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
