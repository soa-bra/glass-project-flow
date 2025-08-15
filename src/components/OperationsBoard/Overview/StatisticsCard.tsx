import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
interface StatisticsCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  chartType?: 'line' | 'bar' | 'simple';
  chartData?: Array<{
    name: string;
    value: number;
  }>;
}
const sampleLineData = [{
  name: 'Jan',
  value: 30
}, {
  name: 'Feb',
  value: 45
}, {
  name: 'Mar',
  value: 35
}, {
  name: 'Apr',
  value: 50
}, {
  name: 'May',
  value: 40
}];
const sampleBarData = [{
  name: 'A',
  value: 20
}, {
  name: 'B',
  value: 35
}, {
  name: 'C',
  value: 25
}, {
  name: 'D',
  value: 15
}];
export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  unit,
  description,
  chartType = 'simple',
  chartData
}) => {
  const renderChart = () => {
    if (chartType === 'line') {
      return <div className="w-full h-full">
          <ChartContainer config={{
          value: {
            label: "القيمة",
            color: "#d9d2fd"
          }
        }} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData || sampleLineData} margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5
            }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                fontSize: 10,
                fill: '#000000'
              }} />
                <YAxis axisLine={false} tickLine={false} tick={{
                fontSize: 10,
                fill: '#000000'
              }} />
                <Line type="monotone" dataKey="value" stroke="#d9d2fd" strokeWidth={2} dot={{
                fill: '#000000',
                r: 2
              }} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>;
    }
    if (chartType === 'bar') {
      return <div className="w-full h-full">
          <ChartContainer config={{
          value: {
            label: "القيمة",
            color: "#bdeed3"
          }
        }} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData || sampleBarData} margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5
            }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                fontSize: 10,
                fill: '#000000'
              }} />
                <YAxis axisLine={false} tickLine={false} tick={{
                fontSize: 10,
                fill: '#000000'
              }} />
                <Bar dataKey="value" fill="#bdeed3" radius={[2, 2, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>;
    }
    return null;
  };
  if (chartType === 'simple') {
    return <BaseCard variant="glass" size="md" className="h-full min-h-0 border-[#DADCE0]" style={{
      backgroundColor: '#ffffff'
    }} header={<h3 className="text-lg font-semibold text-black font-arabic">{title}</h3>}>
        <div className="flex-1 flex flex-col justify-center py-0 h-full overflow-hidden">
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-2xl font-bold text-black font-arabic">
              {value}
            </div>
            <div className="text-sm font-bold text-black font-arabic">
              {unit}
            </div>
          </div>
          
          <div className="text-xs font-normal text-gray-400 font-arabic">
            {description}
          </div>
        </div>
      </BaseCard>;
  }
  return <BaseCard variant="glass" size="md" className="h-full min-h-0" style={{
    backgroundColor: '#ffffff'
  }} header={<h3 className="text-lg font-semibold text-black font-arabic">{title}</h3>}>
      <div className="flex gap-14 h-90 w-full overflow-hidden mx-0 py-0 my-0 px-0">
        {/* النصوص والأرقام - 2/7 من المساحة */}
        <div className="w-2/7 flex flex-col justify-center overflow-hidden">
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-2xl font-bold text-black font-arabic">
              {value}
            </div>
            <div className="text-sm font-bold text-black font-arabic">
              {unit}
            </div>
          </div>
          
          <div className="text-xs font-normal text-gray-400 font-arabic">
            {description}
          </div>
        </div>

        {/* الرسم البياني - 5/7 من المساحة */}
        <div className="w-5/7 flex justify-center items-center overflow-hidden">
          <div className="w-full h-90">
            {renderChart()}
          </div>
        </div>
      </div>
    </BaseCard>;
};