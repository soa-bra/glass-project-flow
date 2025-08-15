import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
interface CriticalProject {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  priority: 'high' | 'medium' | 'low';
}
interface MiniGanttChartProps {
  criticalProjects: CriticalProject[];
}
const chartConfig = {
  progress: {
    label: "التقدم",
    color: "hsl(var(--chart-1))"
  }
};
export const MiniGanttChart: React.FC<MiniGanttChartProps> = ({
  criticalProjects
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'hsl(142, 76%, 36%)';
      case 'at-risk':
        return 'hsl(48, 96%, 53%)';
      case 'delayed':
        return 'hsl(0, 84%, 60%)';
      default:
        return 'hsl(var(--chart-1))';
    }
  };
  const formatProgress = (progress: number) => `${progress}%`;
  return <Card className="rounded-[40px] bg-[#ffffff] border-[#DADCE0] ">
      <CardHeader>
        <CardTitle className="text-right font-arabic text-lg">
          أعلى 10 مشاريع حرجة (Gantt مصغر)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={criticalProjects.slice(0, 10)} layout="horizontal" margin={{
            top: 5,
            right: 30,
            left: 5,
            bottom: 5
          }}>
              <XAxis type="number" domain={[0, 100]} tick={{
              fontSize: 12
            }} tickFormatter={formatProgress} />
              <YAxis type="category" dataKey="name" tick={{
              fontSize: 11
            }} width={120} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value: number, name: string) => [`${value}%`, 'التقدم']} labelFormatter={label => `المشروع: ${label}`} />} />
              <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* مفتاح الألوان */}
        <div className="flex justify-center mt-4 space-x-4 space-x-reverse text-sm">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-arabic">في المسار</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-arabic">في خطر</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-arabic">متأخر</span>
          </div>
        </div>
      </CardContent>
    </Card>;
};