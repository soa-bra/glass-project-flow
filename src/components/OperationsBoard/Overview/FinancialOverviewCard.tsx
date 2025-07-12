
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Settings, RotateCcw } from 'lucide-react';

// بيانات الشرائط المالية - كل شريط يمثل نسبة من الخسارة
const createFinancialBars = (lossPercentage: number) => {
  const totalBars = 10;
  return Array.from({ length: totalBars }, (_, index) => ({
    id: index,
    value: index < (lossPercentage / 10) ? 1 : 0,
    color: index < (lossPercentage / 10) ? '#f1b5b9' : '#96d8d0'
  }));
};

const totalRevenue = 78; // مليون
const lossPercentage = 30; // نسبة الخسارة (0-100)
const isProfit = lossPercentage < 50;
const financialData = createFinancialBars(lossPercentage);

export const FinancialOverviewCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      className="row-span-2 h-[352px]"
      style={{ backgroundColor: isProfit ? '#96d8d0' : '#f1b5b9' }}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black font-arabic">النظرة المالية</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 border border-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
              <RotateCcw className="w-4 h-4 text-black" />
            </button>
            <button className="w-8 h-8 border border-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
              <Settings className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex gap-4 h-full overflow-hidden">
        {/* النصوص والأرقام - 2/5 من المساحة */}
        <div className="w-2/5 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-black font-arabic mb-1">
              {totalRevenue}
            </div>
            <div className="text-xs font-normal text-black font-arabic text-center">
              إجمالي الأرباح والخسائر
            </div>
          </div>

          {/* التفاصيل */}
          <div className="grid grid-cols-1 gap-2 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-black font-arabic">02</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">مثال</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black font-arabic">14</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">مثال</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black font-arabic">78</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">مثال</div>
            </div>
          </div>

          <div className="text-xs font-normal text-black font-arabic text-center mb-2">
            هذا النص مثال للشكل النهائي
          </div>
          <div className="text-xs font-normal text-black font-arabic text-center">
            هذا النص مثال
          </div>
        </div>

        {/* الرسم البياني - 3/5 من المساحة مع تكبير 300% */}
        <div className="w-3/5 flex justify-center items-center overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <ChartContainer
              config={{
                value: { label: "القيمة", color: isProfit ? "#96d8d0" : "#f1b5b9" }
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={financialData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <Bar 
                    dataKey="value" 
                    fill={isProfit ? "#96d8d0" : "#f1b5b9"}
                    radius={[2, 2, 0, 0]}
                    strokeWidth={1}
                    stroke="#000000"
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-lg">
                            <p className="font-arabic text-sm">
                              {payload[0].value === 1 ? 'خسارة' : 'ربح'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
